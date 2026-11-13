# Grocery Ops — execução local

## Pré-requisitos
- Docker Desktop ou Docker Engine com Compose.
- Git.

## Iniciar
```bash
git clone https://github.com/jettrajano/grocery-ops.git
cd grocery-ops
make deps
make install
make db
make dev
```

Abra http://localhost:3000.

## Produção local
```bash
make run
```
Abra http://localhost:8080. O app usa Postgres via DATABASE_URL; não coloque dados reais no repositório público.

## Funcionalidades
Lista compartilhada, preparação da ida, modo mercado, controle do saldo/budget, histórico de preços, fechamento da compra, relatórios de gastos e importação CSV. O PWA pode ser instalado quando servido por HTTPS.
