-- Vértice - Mapa do Ponto Crítico da Operação Comercial
-- Execute este arquivo no SQL Editor do Supabase antes de usar o novo diagnóstico.

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
  business_model text,
  commercial_process_clarity text,
  opportunity_handling text,
  sales_bottleneck text,
  next_step_discipline text,
  management_visibility text,
  commercial_routine text,
  process_technology_adoption text,
  implementation_priority text,
  diagnostic_name text default 'Mapa do Ponto Crítico da Operação Comercial Vértice',
  current_step text,
  status text default 'started',
  raw_answers jsonb default '{}'::jsonb,
  score_maturidade_operacional integer,
  score_fit_vertice integer,
  maturity_level text,
  main_critical_points jsonb default '[]'::jsonb,
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

alter table diagnostics
  add column if not exists diagnostic_name text default 'Mapa do Ponto Crítico da Operação Comercial Vértice';

alter table diagnostics
  add column if not exists recommended_structure text,
  add column if not exists urgency_level text,
  add column if not exists critical_point_category text,
  add column if not exists score_maturidade_operacional integer,
  add column if not exists main_critical_points jsonb default '[]'::jsonb;

alter table diagnostics
  add column if not exists business_model text,
  add column if not exists commercial_process_clarity text,
  add column if not exists opportunity_handling text,
  add column if not exists sales_bottleneck text,
  add column if not exists next_step_discipline text,
  add column if not exists management_visibility text,
  add column if not exists commercial_routine text,
  add column if not exists process_technology_adoption text,
  add column if not exists implementation_priority text;

alter table daily_ai_learning
  add column if not exists recommended_structure_patterns jsonb default '[]'::jsonb;

create table if not exists diagnostic_question_versions (
  id uuid primary key default gen_random_uuid(),
  version_name text not null,
  description text,
  questions jsonb not null default '[]'::jsonb,
  questions_schema jsonb not null default '[]'::jsonb,
  active boolean default false,
  is_active boolean default false,
  created_at timestamp with time zone default now()
);

alter table diagnostic_question_versions
  add column if not exists description text,
  add column if not exists questions jsonb not null default '[]'::jsonb,
  add column if not exists questions_schema jsonb not null default '[]'::jsonb,
  add column if not exists active boolean default false,
  add column if not exists is_active boolean default false;

create index if not exists diagnostics_status_idx on diagnostics (status);
create index if not exists diagnostics_created_at_idx on diagnostics (created_at desc);
create index if not exists diagnostics_completed_at_idx on diagnostics (completed_at desc);
create index if not exists diagnostics_score_fit_idx on diagnostics (score_fit_vertice desc);
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
  business_model,
  commercial_process_clarity,
  opportunity_handling,
  sales_bottleneck,
  next_step_discipline,
  management_visibility,
  commercial_routine,
  process_technology_adoption,
  implementation_priority,
  diagnostic_name,
  score_maturidade_operacional,
  score_fit_vertice,
  maturity_level,
  recommended_next_step,
  recommended_structure,
  urgency_level,
  critical_point_category,
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

insert into diagnostic_question_versions (
  version_name,
  description,
  questions,
  questions_schema,
  active,
  is_active
)
select
  'mapa-ponto-critico-operacao-comercial-v1',
  'Diagnóstico alinhado ao posicionamento atual da Vértice: ponto crítico operacional, processo, implantação e acompanhamento.',
  '[
    {"id":"seller_count","block":"operacao_comercial","type":"button"},
    {"id":"business_model","block":"operacao_comercial","type":"button"},
    {"id":"commercial_process_clarity","block":"processo_real","type":"button"},
    {"id":"opportunity_handling","block":"aproveitamento_oportunidades","type":"button"},
    {"id":"sales_bottleneck","block":"ponto_critico_principal","type":"button"},
    {"id":"next_step_discipline","block":"continuidade_comercial","type":"button"},
    {"id":"management_visibility","block":"gestao_previsibilidade","type":"button"},
    {"id":"commercial_routine","block":"gestao_previsibilidade","type":"button"},
    {"id":"process_technology_adoption","block":"adocao_operacional","type":"button"},
    {"id":"implementation_priority","block":"prioridade_implantacao","type":"button"},
    {"id":"contact_capture","block":"contato","type":"contact"}
  ]'::jsonb,
  '[
    {"id":"seller_count","block":"operacao_comercial","type":"button"},
    {"id":"business_model","block":"operacao_comercial","type":"button"},
    {"id":"commercial_process_clarity","block":"processo_real","type":"button"},
    {"id":"opportunity_handling","block":"aproveitamento_oportunidades","type":"button"},
    {"id":"sales_bottleneck","block":"ponto_critico_principal","type":"button"},
    {"id":"next_step_discipline","block":"continuidade_comercial","type":"button"},
    {"id":"management_visibility","block":"gestao_previsibilidade","type":"button"},
    {"id":"commercial_routine","block":"gestao_previsibilidade","type":"button"},
    {"id":"process_technology_adoption","block":"adocao_operacional","type":"button"},
    {"id":"implementation_priority","block":"prioridade_implantacao","type":"button"},
    {"id":"contact_capture","block":"contato","type":"contact"}
  ]'::jsonb,
  true,
  true
where not exists (
  select 1 from diagnostic_question_versions
  where version_name = 'mapa-ponto-critico-operacao-comercial-v1'
);

update diagnostic_question_versions
set active = false,
    is_active = false
where version_name <> 'mapa-ponto-critico-operacao-comercial-v1';

update diagnostic_question_versions
set active = true,
    is_active = true
where version_name = 'mapa-ponto-critico-operacao-comercial-v1';
