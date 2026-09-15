import assert from 'node:assert/strict';
import test from 'node:test';
import { selectExistingDeal, firstQuoteSent } from '../lib/commercial-reconciliation.ts';
const lead={email:'buyer@example.invalid',phone:'0412345678',created_at:'2026-09-01T10:00:00Z'};
const person={id:1,emails:['BUYER@example.invalid'],phones:['+61 412 345 678']};
const deal={id:2,person_id:1,add_time:'2026-09-01T10:01:00Z'};
test('requires exact email AND phone and one contemporaneous deal',()=>assert.equal(selectExistingDeal(lead,[person],[deal]).dealId,2));
test('refuses ambiguous people, deals, stale deals, and missing phone',()=>{
  assert.equal(selectExistingDeal(lead,[person,person],[deal]).reason,'ambiguous_person');
  assert.equal(selectExistingDeal(lead,[person],[deal,{...deal,id:3}]).reason,'ambiguous_deal');
  assert.equal(selectExistingDeal(lead,[person],[{...deal,add_time:'2026-07-01'}]).dealId,null);
  assert.equal(selectExistingDeal(lead,[{...person,phones:[]}],[deal]).dealId,null);
  assert.equal(selectExistingDeal(lead,[{...person,emails:['other@example.invalid']}],[deal]).dealId,null);
});
test('qualification requires dated Quote Sent history, not current lead status',()=>{
  assert.equal(firstQuoteSent([{field_key:'status',new_value:'lost',time:'2026-09-02'}],[4]),null);
  assert.equal(firstQuoteSent([{field_key:'stage_id',new_value:4,time:'2026-09-03'},{field_key:'stage_id',new_value:4,time:'2026-09-02'}],[4]),'2026-09-02');
  assert.equal(firstQuoteSent([{field_key:'stage_id',new_value:4}],[4]),null);
});
