begin;

-- PostgREST's on_conflict=lead_submission_id requires a non-partial unique
-- constraint it can infer. PostgreSQL unique constraints still permit multiple
-- NULL values, so historical quote requests without a submission ID remain valid.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.quote_requests'::regclass
      and conname = 'quote_requests_lead_submission_id_key'
  ) then
    alter table public.quote_requests
      add constraint quote_requests_lead_submission_id_key unique (lead_submission_id);
  end if;
end
$$;

comment on constraint quote_requests_lead_submission_id_key on public.quote_requests is
  'Makes website lead acceptance idempotent by client-generated submission ID.';

notify pgrst, 'reload schema';

commit;
