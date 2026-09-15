// Operator-only reconciliation. Dry-run by default; no Pipedrive mutations,
// customer messages, lead inserts, or writes outside the exact 3D intake scope.
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { selectExistingDeal, firstQuoteSent } from '../lib/commercial-reconciliation.ts';
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PIPEDRIVE_API_TOKEN }=process.env;
if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY||!PIPEDRIVE_API_TOKEN) throw Error('Missing operator credentials');
const origin=new URL(SUPABASE_URL).origin;
if(origin!=='https://nevrgqwwrkgpsxwwzoqa.supabase.co') throw Error('Wrong approved database');
async function db(path,options={}) {
  const r=await fetch(origin+'/rest/v1/'+path,{...options,headers:{apikey:SUPABASE_SERVICE_ROLE_KEY,authorization:'Bearer '+SUPABASE_SERVICE_ROLE_KEY,'content-type':'application/json',...(options.headers||{})},signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw Error('Database HTTP '+r.status);
  return r.status===204?[]:r.json();
}
async function pd(path,params={}) {
  const u=new URL('https://api.pipedrive.com'+path);for(const[k,v]of Object.entries(params))u.searchParams.set(k,String(v));u.searchParams.set('api_token',PIPEDRIVE_API_TOKEN);
  const r=await fetch(u,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('Pipedrive HTTP '+r.status);const p=await r.json();if(!p.success)throw Error('Pipedrive unsuccessful');return p;
}
async function paged(path,params={}) {
  const result=[];let cursor;do{const p=await pd(path,{...params,limit:500,...(cursor?{cursor}:{})});result.push(...(p.data||[]));cursor=p.additional_data?.next_cursor;}while(cursor);return result;
}
const rows=await db('quote_requests?or=(source_host.eq.3dilluminatedsigns.com.au,details->>source_site.eq.3dilluminatedsigns.com.au)&select=*&order=created_at.asc&limit=1000');
if(rows.length>=1000)throw Error('Intake safety limit: pagination required');
const stages=await paged('/api/v2/stages');const names=new Map(stages.map(s=>[s.id,s.name]));const quoteStageIds=stages.filter(s=>/^quote sent$/i.test(s.name)).map(s=>s.id);
if(!quoteStageIds.length)throw Error('Quote Sent stage unresolved');
const plan=[];
for(const [ordinal,l]of rows.entries()) {
  if(/\btest\b|synthetic|\bQA\b|canary/i.test(l.name+' '+l.notes)){plan.push({ordinal:ordinal+1,disposition:'qa_excluded'});continue;}
  const search=await pd('/api/v2/persons/search',{term:l.email,fields:'email',exact_match:true,limit:100});if(search.additional_data?.next_cursor)throw Error('Person search pagination required');
  const people=[],deals=[];
  for(const hit of search.data?.items||[]) {const p=(await pd('/api/v2/persons/'+hit.item.id)).data;people.push({id:p.id,emails:(p.emails||[]).map(e=>e.value),phones:(p.phones||[]).map(e=>e.value)});deals.push(...await paged('/api/v2/deals',{person_id:p.id}));}
  const selected=selectExistingDeal(l,people,deals);
  if(!selected.dealId){plan.push({ordinal:ordinal+1,disposition:selected.reason});continue;}
  const d=(await pd('/api/v2/deals/'+selected.dealId)).data;
  const changes=await paged('/v1/deals/'+d.id+'/changelog');const quotedAt=firstQuoteSent(changes,quoteStageIds);
  const internal=await db('deals?pipedrive_deal_id=eq.'+d.id+'&select=id&limit=2');
  if(internal.length>1 || (l.internal_deal_id && l.internal_deal_id!==internal[0]?.id)){plan.push({ordinal:ordinal+1,disposition:'internal_join_conflict'});continue;}
  const evidence={method:selected.reason,pipedrive_deal_id:d.id,status:d.status,stage:names.get(d.stage_id)||'unknown',quote_sent_at:quotedAt,lost_reason:d.lost_reason||null,source_attribution:'supporting_identity_and_timing_not_causal_proof'};
  const previous=l.details?.commercial_reconciliation;
  const unchanged=previous && isDeepStrictEqual(previous.evidence,evidence) && (!internal[0] || l.internal_deal_id===internal[0].id);
  plan.push({ordinal:ordinal+1,disposition:unchanged?'already_reconciled':'matched',intakeId:l.id,updatedAt:l.updated_at,internalJoin:!!internal[0],quoted:!!quotedAt,crmStatus:d.status,patch:unchanged?null:{details:{...l.details,commercial_reconciliation:{evidence,checked_at:new Date().toISOString()}},lead_status:'pushed_to_pipedrive',...(internal[0]?{internal_deal_id:internal[0].id}:{}),...(quotedAt && ['needs_review','pending'].includes(l.qualification_status)?{qualification_status:'qualified'}:{})}});
}
const hash=createHash('sha256').update(JSON.stringify(plan.map(({patch,...r})=>({...r,patch:patch?{...patch,details:{...patch.details,commercial_reconciliation:{evidence:patch.details.commercial_reconciliation.evidence}}}:null})))).digest('hex');
const safe=()=>plan.map(({ordinal,disposition,internalJoin,quoted,crmStatus})=>({ordinal,disposition,internalJoin,quoted,crmStatus}));
console.log(JSON.stringify({mode:'dry-run',planHash:hash,rows:safe()},null,2));
if(process.argv.includes('--apply')) {
  if(process.env.RECONCILIATION_APPROVED_PLAN_HASH!==hash)throw Error('Fresh plan differs from approved dry run; no writes');
  let updated=0;
  for(const item of plan.filter(x=>x.patch)) {
    const path='quote_requests?id=eq.'+item.intakeId+'&updated_at=eq.'+encodeURIComponent(item.updatedAt)+'&or=(source_host.eq.3dilluminatedsigns.com.au,details->>source_site.eq.3dilluminatedsigns.com.au)';
    const result=await db(path,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(item.patch)});
    if(result.length!==1)throw Error('Concurrent intake change; stopped after '+updated+' writes, rerun dry-run');
    const read=await db('quote_requests?id=eq.'+item.intakeId+'&select=internal_deal_id,lead_status,qualification_status,details');
    if(read.length!==1||!isDeepStrictEqual(read[0].details?.commercial_reconciliation?.evidence,item.patch.details.commercial_reconciliation.evidence)||read[0].lead_status!=='pushed_to_pipedrive'||(item.patch.internal_deal_id&&read[0].internal_deal_id!==item.patch.internal_deal_id)||(item.patch.qualification_status&&read[0].qualification_status!==item.patch.qualification_status))throw Error('Read-back mismatch after '+updated+' prior writes');
    updated++;
  }
  console.log(JSON.stringify({mode:'applied',updated,readBackMatched:updated,qaRowsUntouched:plan.filter(x=>x.disposition==='qa_excluded').length}));
}
