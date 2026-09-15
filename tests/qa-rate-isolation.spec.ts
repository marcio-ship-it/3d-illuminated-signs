import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('signed QA has its own bounded quota and cannot spend the customer quota', async ({ page, request }) => {
  const auth=process.env.QA_CANARY_AUTH_TOKEN || 'local-playwright-qa-auth-token-3d-signs-only';
  async function session() {
    const issued=await page.context().request.post('/api/qa/session/',{headers:{Authorization:`Bearer ${auth}`,'X-QA-Run-Id':`rate-${randomUUID()}`}});
    expect(issued.status()).toBe(200);
  }
  const payload=()=>({name:'QA rate isolation',email:'rate@example.invalid',phone:'0400000000',message:'Signed isolated rate-limit test only. No customer enquiry.',submissionId:randomUUID(),startedAt:Date.now()-3000});
  await session();
  for(let i=0;i<6;i++) {
    const response=await page.context().request.post('/api/contact/',{headers:{'X-QA-Mode':'dry-run'},data:payload()});
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({dryRun:true,channels:{crm:false,team_email:false,acknowledgement:false,downstream_adapter:false}});
  }
  // The existing limiter is per process, not a distributed quota. Exercise its
  // exact cap on the single local server; hosted requests can span instances.
  const local=["localhost","127.0.0.1","[::1]"].includes(new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3100').hostname);
  if(local) {
    const limited=await page.context().request.post('/api/contact/',{headers:{'X-QA-Mode':'dry-run'},data:payload()});
    expect(limited.status()).toBe(429);
  }
  await session();
  const separate=await page.context().request.post('/api/contact/',{headers:{'X-QA-Mode':'dry-run'},data:payload()});
  expect(separate.status()).toBe(200);
  expect(await separate.json()).toMatchObject({dryRun:true});
  // An independent request context has no signed cookie and must fail closed,
  // but not because signed QA consumed its quota.
  const unsigned=await request.post('/api/contact/',{headers:{'X-QA-Mode':'dry-run'},data:payload()});
  expect(unsigned.status()).toBe(403);
  expect(await unsigned.json()).toEqual({error:'QA session is missing or expired. No enquiry was submitted.'});
});
