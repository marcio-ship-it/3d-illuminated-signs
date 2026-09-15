begin;

create table if not exists public.field_vitals_3d (
  id bigint generated always as identity primary key,
  metric_name text not null check (metric_name in ('CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB')),
  metric_id text not null check (metric_id ~ '^[A-Za-z0-9._:-]{1,128}$'),
  metric_value double precision not null check (
    metric_value not in ('NaN'::double precision, 'Infinity'::double precision, '-Infinity'::double precision)
    and metric_value >= 0 and metric_value <= 600000
  ),
  metric_delta double precision not null check (
    metric_delta not in ('NaN'::double precision, 'Infinity'::double precision, '-Infinity'::double precision)
    and metric_delta >= 0 and metric_delta <= 600000
  ),
  metric_sequence smallint not null check (metric_sequence between 1 and 100),
  page_route text not null check (length(page_route) between 1 and 200 and page_route like '/%' and page_route not like '%?%' and page_route not like '%#%'),
  release_sha text not null check (release_sha ~ '^[0-9a-fA-F]{40}$'),
  device_class text not null check (device_class in ('mobile', 'tablet', 'desktop')),
  navigation_type text not null check (navigation_type in ('navigate', 'reload', 'prerender', 'back-forward', 'back-forward-cache', 'restore', 'unknown')),
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint field_vitals_3d_metric_release_key unique (metric_name, metric_id, release_sha),
  constraint field_vitals_3d_cls_bounds check (metric_name <> 'CLS' or (metric_value <= 100 and metric_delta <= 100))
);

create or replace function public.field_vitals_3d_keep_latest_sequence()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.metric_sequence < old.metric_sequence then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists field_vitals_3d_latest_sequence on public.field_vitals_3d;
create trigger field_vitals_3d_latest_sequence
before update on public.field_vitals_3d
for each row execute function public.field_vitals_3d_keep_latest_sequence();

comment on table public.field_vitals_3d is
  'Privacy-minimised numeric Web Vitals. One latest row per metric, page-load metric ID and release SHA.';
comment on column public.field_vitals_3d.metric_id is
  'Per-document Web Vitals identifier supplied by the browser; not a person or cross-session identifier.';

alter table public.field_vitals_3d enable row level security;
revoke all on table public.field_vitals_3d from public, service_role;
revoke all on table public.field_vitals_3d from anon, authenticated;
revoke all on sequence public.field_vitals_3d_id_seq from public, service_role;
revoke all on sequence public.field_vitals_3d_id_seq from anon, authenticated;
grant select, insert, update on table public.field_vitals_3d to service_role;
grant usage, select on sequence public.field_vitals_3d_id_seq to service_role;
revoke all on function public.field_vitals_3d_keep_latest_sequence() from public, anon, authenticated;

notify pgrst, 'reload schema';

commit;
