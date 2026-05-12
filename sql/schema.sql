-- VAMO - Raio-X de Vazamento Comercial V2
-- Execute este arquivo no SQL Editor do Supabase antes de usar o novo diagnostico.

create extension if not exists "pgcrypto";

create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  lead_name text,
  company_name text,
  role text,
  whatsapp text,
  email text,
  segment text,
  seller_count text,
  sales_channel text,
  sales_model text,
  current_step text,
  status text default 'started',
  raw_answers jsonb default '{}'::jsonb,
  score_previsibilidade integer,
  score_fit_vamo integer,
  maturity_level text,
  main_leaks jsonb default '[]'::jsonb,
  contradictions jsonb default '[]'::jsonb,
  pillar_scores jsonb default '{}'::jsonb,
  final_report jsonb default '{}'::jsonb,
  recommended_next_step text,
  consent_contact boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

create table if not exists diagnostic_messages (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references diagnostics(id) on delete cascade,
  sender text not null,
  message text not null,
  answer_type text,
  step text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists daily_ai_learning (
  id uuid primary key default gen_random_uuid(),
  learning_date date default current_date,
  diagnostics_analyzed integer default 0,
  recurring_patterns jsonb default '[]'::jsonb,
  best_segments jsonb default '[]'::jsonb,
  common_objections jsonb default '[]'::jsonb,
  question_improvements jsonb default '[]'::jsonb,
  prompt_improvements jsonb default '[]'::jsonb,
  sales_insights jsonb default '[]'::jsonb,
  summary text,
  created_at timestamp with time zone default now()
);

create table if not exists diagnostic_question_versions (
  id uuid primary key default gen_random_uuid(),
  version_name text not null,
  questions jsonb not null,
  active boolean default false,
  created_at timestamp with time zone default now()
);

create index if not exists diagnostics_status_idx on diagnostics (status);
create index if not exists diagnostics_created_at_idx on diagnostics (created_at desc);
create index if not exists diagnostics_completed_at_idx on diagnostics (completed_at desc);
create index if not exists diagnostics_score_fit_idx on diagnostics (score_fit_vamo desc);
create index if not exists diagnostics_recommended_next_step_idx on diagnostics (recommended_next_step);
create index if not exists diagnostic_messages_diagnostic_id_idx on diagnostic_messages (diagnostic_id, created_at);
create index if not exists daily_ai_learning_date_idx on daily_ai_learning (learning_date desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists diagnostics_set_updated_at on diagnostics;
create trigger diagnostics_set_updated_at
before update on diagnostics
for each row
execute function set_updated_at();

create or replace view vw_diagnostics_admin as
select
  id,
  lead_name,
  company_name,
  role,
  whatsapp,
  email,
  seller_count,
  sales_channel,
  sales_model,
  score_previsibilidade,
  score_fit_vamo,
  maturity_level,
  recommended_next_step,
  status,
  consent_contact,
  created_at,
  completed_at
from diagnostics
order by created_at desc;

alter table diagnostics enable row level security;
alter table diagnostic_messages enable row level security;
alter table daily_ai_learning enable row level security;
alter table diagnostic_question_versions enable row level security;

drop policy if exists "diagnostics service role only" on diagnostics;
drop policy if exists "diagnostic messages service role only" on diagnostic_messages;
drop policy if exists "daily learning service role only" on daily_ai_learning;
drop policy if exists "question versions service role only" on diagnostic_question_versions;

create policy "diagnostics service role only"
  on diagnostics
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "diagnostic messages service role only"
  on diagnostic_messages
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "daily learning service role only"
  on daily_ai_learning
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "question versions service role only"
  on diagnostic_question_versions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into diagnostic_question_versions (version_name, active, questions)
select
  'raio-x-v2',
  true,
  '[
    {"id":"seller_count","block":"contexto_comercial","type":"button"},
    {"id":"performance_owner","block":"contexto_comercial","type":"button"},
    {"id":"sales_channel","block":"contexto_comercial","type":"button"},
    {"id":"sales_model","block":"contexto_comercial","type":"button"},
    {"id":"forecast_clarity","block":"previsibilidade","type":"button"},
    {"id":"quota_attainment","block":"previsibilidade","type":"button"},
    {"id":"tracking_frequency","block":"previsibilidade","type":"button"},
    {"id":"forecast_difficulty","block":"previsibilidade","type":"text"},
    {"id":"contact_capture","block":"previsibilidade","type":"contact"},
    {"id":"main_loss_area","block":"vazamento_performance","type":"button"},
    {"id":"lead_followup_loss","block":"vazamento_performance","type":"button"},
    {"id":"underperformance_reason","block":"vazamento_performance","type":"button"},
    {"id":"thirty_day_fix","block":"vazamento_performance","type":"text"},
    {"id":"has_commission","block":"comissao_incentivo","type":"button"},
    {"id":"commission_calculation","block":"comissao_incentivo","type":"button"},
    {"id":"seller_commission_visibility","block":"comissao_incentivo","type":"button"},
    {"id":"commission_conflict","block":"comissao_incentivo","type":"button"},
    {"id":"individual_action_plan","block":"gestao_correcao","type":"button"},
    {"id":"has_pdi","block":"gestao_correcao","type":"button"},
    {"id":"manager_correction_data","block":"gestao_correcao","type":"button"},
    {"id":"urgency","block":"gestao_correcao","type":"button"},
    {"id":"final_contact_choice","block":"finalizacao","type":"button"}
  ]'::jsonb
where not exists (
  select 1 from diagnostic_question_versions where version_name = 'raio-x-v2'
);
