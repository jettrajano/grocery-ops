-- Marca itens como comprados sem apagá-los; mantém a data para sincronizar entre dispositivos.
-- Seguro para executar mais de uma vez: as colunas só são criadas se ainda não existirem.
begin;

alter table public.enxoval_products
  add column if not exists purchased boolean not null default false;

alter table public.enxoval_products
  add column if not exists purchased_at timestamptz;

commit;
