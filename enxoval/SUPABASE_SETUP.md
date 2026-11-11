# Supabase: configuração do Enxoval em Conta

## O que foi conectado

- Projeto Supabase: `Enxoval em Conta`, região São Paulo.
- O app usa autenticação por e-mail e senha e não oferece cadastro público.
- O navegador usa somente a chave **publishable** do Supabase, armazenada em `cloud.js`. Ela é pública por definição; a segurança dos dados depende do RLS.
- A chave `secret`, a senha do banco e os tokens de administração não fazem parte deste repositório.
- Os registros ficam em `enxoval_products` e `enxoval_observations`, associados a um grupo familiar.
- As políticas RLS autorizam acesso somente a membros do grupo. Novas tabelas não recebem permissões públicas automáticas.
- Alterações feitas sem internet ficam no armazenamento local do aparelho e são sincronizadas quando a conexão retorna. Exclusões de preços são sincronizadas por tombstones.

## Configurar o banco

1. No painel Supabase, abra **SQL Editor**.
2. Abra o arquivo `supabase-schema.sql` nesta pasta, copie todo o conteúdo e cole numa consulta nova.
3. Clique em **Run**. O script cria as tabelas, funções, políticas RLS, permissões mínimas e publicação Realtime. Ele pode ser executado novamente sem apagar registros.

## Acesso no app

Entre com a conta criada em **Authentication → Users**. Use o mesmo login em cada dispositivo. O app sincroniza os dados locais existentes do aparelho na primeira entrada, juntando registros identificados pelo mesmo ID. Para guardar uma cópia independente, exporte o backup antes da primeira sincronização.

A primeira conta cria o grupo familiar no banco. Para adicionar outra conta no futuro, convide o usuário em Authentication e associe o UUID dele ao grupo por meio de `add_enxoval_household_member`; não compartilhe sua senha.

## Operação

- O projeto usa o plano Free. Projetos gratuitos podem pausar após períodos de inatividade; a sincronização volta depois que o projeto for retomado no painel.
- O painel e o app precisam de internet para autenticar e sincronizar. O modo offline mantém alterações no dispositivo até a conexão voltar.
- Não copie uma chave `secret`, `service_role`, senha do banco ou token de administração para o código do app ou para este repositório.
