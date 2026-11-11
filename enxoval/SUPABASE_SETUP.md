# Acesso seguro ao Enxoval em Conta

Este guia explica como os dados são protegidos e como compartilhar a lista com outra pessoa.

## Como funciona a segurança

- O app não tem botão de cadastro público. Cada pessoa usa a própria conta e senha.
- Você, que criou primeiro a lista, é o **responsável** (owner). Só essa conta pode liberar outras pessoas.
- As outras contas recebem o papel de **membro**. Membros podem ver, adicionar, alterar e excluir itens e preços da mesma lista.
- A lista só aparece para contas que o responsável vinculou. Receber um e-mail de convite, sozinho, **não** dá acesso aos dados.
- O app usa uma chave pública do Supabase. As regras do banco (RLS) verificam o usuário em cada acesso. A chave secreta do projeto nunca deve ser copiada para o app, para o GitHub ou para uma mensagem.
- A senha de cada pessoa é privada: ninguém deve compartilhar a própria senha com você nem usar sua conta.

## Como compartilhar com uma pessoa

Faça estas etapas com internet. O convite e o acesso à lista são duas coisas diferentes.

### 1. Enviar o convite de conta, se a pessoa ainda não tem conta

1. Entre no app com sua conta de responsável.
2. Na área **Compartilhar a lista com alguém**, abra o link **Usuários no painel Supabase**. Você também pode abrir diretamente: [Authentication → Users](https://supabase.com/dashboard/project/zxhpvpckkvholtrhyaod/auth/users).
3. No painel, escolha **Add user → Send invitation**.
4. Digite o e-mail da pessoa e envie o convite.
5. Peça para a pessoa abrir o e-mail do Supabase e concluir o convite. O convite abre o app, que pedirá para ela criar uma senha própria.

Se a pessoa já possui uma conta confirmada neste projeto Supabase, pule esta etapa. Não crie uma segunda conta para o mesmo e-mail.

### 2. Liberar o acesso à lista da família

1. Depois que a pessoa aceitou o convite e confirmou o e-mail, volte ao app.
2. Digite no campo o mesmo e-mail que recebeu o convite.
3. Escolha **Dar acesso à lista**.
4. O app confirma se há uma conta válida e a associa à sua lista. A pessoa então entra no app com o próprio e-mail e a senha que acabou de criar.

Se aparecer uma mensagem dizendo que a conta não foi encontrada, confira se o e-mail está escrito igual e se a pessoa já aceitou/confirmou o convite. A pessoa também pode entrar uma vez no app para concluir o acesso e, depois, você tenta novamente. Se a conta já pertencer a outra lista familiar, ela não pode ser adicionada a esta.

## Corrigir o endereço de retorno do convite

O Supabase usa o **Site URL** para decidir para onde o navegador volta depois de aceitar um convite. Ele precisa apontar para a versão publicada do app, não para `localhost` (que só funciona no computador de desenvolvimento).

1. No painel do projeto, abra **Authentication → URL Configuration**.
2. Em **Site URL**, coloque `https://jettrajano.github.io/grocery-ops/enxoval/`.
3. Em **Redirect URLs**, adicione também esse mesmo endereço exato.
4. Salve. Convites enviados antes da correção ainda podem levar ao endereço antigo; envie um convite novo depois de cancelar a conta convidada antiga.

## Como retirar o acesso

No momento, não há botão para remover membros no app. Se precisar retirar alguém, abra **Authentication → Users** no painel Supabase e exclua a conta dessa pessoa. O vínculo de membro é removido automaticamente pelo banco. A pessoa deixa de conseguir acessar a lista; não exclua sua própria conta de responsável.

## Antes de compartilhar

Compartilhe somente com pessoas em quem confia. Todo membro pode editar e apagar itens e preços. Não existe perfil somente para leitura nesta versão. Cada pessoa deve manter sua própria senha e usar uma conta individual.

## Para revisar ou aprender

- O arquivo `supabase-schema.sql` contém as tabelas, funções e regras de acesso do banco. Ele pode ser executado novamente; não apaga os dados da lista.
- A função `ensure_enxoval_household` deixa a primeira conta criar a lista. Contas seguintes não criam outra lista automaticamente; precisam ser vinculadas pelo responsável.
- A função `is_enxoval_household_owner` permite ao app mostrar a área de compartilhamento somente ao responsável.
- A função `add_enxoval_household_member_by_email` só aceita chamadas autenticadas do responsável. Ela procura no banco uma conta com e-mail confirmado e retorna apenas o necessário; o app não recebe uma lista de usuários.
- As regras RLS continuam verificando a associação em cada consulta. Saber o endereço do projeto ou a chave pública não é suficiente para ler a lista.

## Configuração original e suporte

- Projeto Supabase: **Enxoval em Conta**, região São Paulo.
- O app usa login por e-mail e senha, armazenamento local para modo offline e sincronização ao voltar a internet.
- A primeira entrada no app em um novo aparelho pode combinar os dados locais desse aparelho com a nuvem. Exporte um backup antes de importar dados antigos.
- O projeto usa o plano Free. O painel fica em [Supabase](https://supabase.com/dashboard/project/zxhpvpckkvholtrhyaod).
- Não cole senhas, chaves secretas ou tokens em chats, tickets ou no código do app.
