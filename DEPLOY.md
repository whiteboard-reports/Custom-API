# Guia de Deploy - Render.com

## 🚀 Deploy Rápido (3 minutos)

### Passo 1: Prepare o Repositório
Certifique-se de que estes arquivos estão commitados:
- ✅ `render.yaml` - Configuração automática do Render
- ✅ `.node-version` - Versão do Node.js
- ✅ `package.json` - Dependências e scripts

### Passo 2: Acesse o Render
1. Vá para [render.com](https://render.com)
2. Clique em "Get Started" ou "Sign In"
3. Faça login com GitHub, GitLab ou **Email**

### Passo 3: Crie um Web Service
1. No dashboard, clique em **"New +"** (canto superior direito)
2. Selecione **"Web Service"**

### Passo 4: Conecte o Repositório

#### Opção A: Repositório Público do Bitbucket
1. Clique em **"Public Git repository"**
2. Cole a URL do repositório: `https://bitbucket.org/seu-workspace/seu-repo`
3. Clique em **"Continue"**

#### Opção B: Conectar Bitbucket via OAuth
1. Clique em **"Connect Bitbucket"**
2. Autorize o Render a acessar **apenas este repositório**
3. Selecione o repositório da lista

### Passo 5: Configuração (Auto-detectada)
O Render lerá o arquivo `render.yaml` e preencherá automaticamente:

```yaml
Name: poc-api
Region: Frankfurt (ou qualquer região próxima)
Branch: main (ou master)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Não precisa alterar nada!** ✅

### Passo 6: Escolha o Plano
- Selecione **"Free"** (US$ 0/mês)
- ⚠️ Atenção: No plano free, a API hiberna após 15min de inatividade

### Passo 7: Deploy
1. Clique em **"Create Web Service"**
2. Aguarde o build (~2-3 minutos)
3. Pronto! 🎉

---

## 📋 Após o Deploy

### URL da API
Sua API estará disponível em:
```
https://poc-api.onrender.com
```
ou
```
https://poc-api-xyz.onrender.com
```

### Endpoints Públicos
```bash
# Health check
https://seu-app.onrender.com/health

# Issues (requer autenticação)
https://seu-app.onrender.com/api/issues

# Projetos (público)
https://seu-app.onrender.com/api/public/projects
```

### Testando a API

```bash
# Health check
curl https://seu-app.onrender.com/health

# Issues com Basic Auth
curl -u admin:admin123 https://seu-app.onrender.com/api/issues

# Issues com Bearer Token
curl -H "Authorization: Bearer wbr-token-2024-xyz" https://seu-app.onrender.com/api/issues

# Projetos (sem auth)
curl https://seu-app.onrender.com/api/public/projects
```

---

## ⚙️ Configurações Importantes

### Auto-Deploy
Por padrão, o Render faz deploy automático a cada push no branch configurado.

**Para desabilitar:**
1. Vá em "Settings" do seu web service
2. Procure "Auto-Deploy"
3. Desabilite se preferir deploys manuais

### Variáveis de Ambiente
Caso precise adicionar variáveis de ambiente no futuro:
1. Vá em "Environment" no painel do serviço
2. Adicione as variáveis necessárias
3. Clique em "Save Changes"

### Logs
Para ver os logs da aplicação:
1. Vá na aba "Logs" do seu web service
2. Logs em tempo real aparecerão aqui

---

## 🐛 Troubleshooting

### Build falhou
- Verifique se `package.json` está correto
- Verifique os logs de build no Render
- Confirme que `npm install` funciona localmente

### App não inicia
- Verifique os logs de runtime
- Confirme que a porta está usando `process.env.PORT`
- Teste `npm start` localmente

### App hiberna (plano free)
- Normal no plano gratuito
- Primeiro request após 15min de inatividade demora ~30s
- Para evitar: upgrade para plano pago ou use serviço de "ping" (ex: UptimeRobot)

### URL não funciona
- Aguarde o deploy finalizar (status "Live")
- Verifique se não há erros nos logs
- Teste com `curl` primeiro

---

## 📊 Monitoramento

### Dashboard do Render
- CPU e memória em tempo real
- Número de requests
- Tempo de resposta
- Status de saúde

### Logs
- Acesse via dashboard
- Download de logs disponível
- Retenção de 7 dias no plano free

---

## 🔄 Atualizações

### Deploy Manual
1. Vá no dashboard do seu web service
2. Clique em "Manual Deploy"
3. Selecione "Clear build cache & deploy" (se necessário)

### Rollback
1. Vá em "Events" no dashboard
2. Encontre o deploy anterior que funcionava
3. Clique em "Rollback to this deploy"

---

## 💰 Custos

### Plano Free
- ✅ 750 horas/mês (suficiente para 1 app 24/7)
- ✅ SSL automático
- ✅ Deploy ilimitados
- ⚠️ App hiberna após 15min de inatividade
- ⚠️ Recursos compartilhados

### Upgrade (opcional)
Se precisar de app sempre online:
- **Starter Plan**: US$ 7/mês
  - Sem hibernação
  - 512MB RAM
  - Recursos dedicados

---

## 📞 Suporte

- Documentação: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)
- Status: [status.render.com](https://status.render.com)

---

## ✅ Checklist Final

Antes de compartilhar com QA:

- [ ] Deploy concluído com sucesso (status "Live")
- [ ] Testou `GET /health` (retorna `{"status":"ok"}`)
- [ ] Testou `GET /api/issues` com autenticação
- [ ] Testou `GET /api/public/projects` sem autenticação
- [ ] Compartilhou URL com time de QA
- [ ] Documentou credenciais de teste (admin/admin123 e token)

---

**Pronto!** Sua API está online e acessível para toda a equipe. 🎉
