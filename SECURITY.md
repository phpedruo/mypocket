# 🔒 Segurança - My Pocket

## Medidas de Segurança Implementadas

### ✅ Autenticação e Sessões
- **Senhas**: Hash bcrypt com 12 rounds (mais seguro que 10)
- **Sessões**: Iron-session com cookies httpOnly, secure, sameSite
- **SESSION_SECRET**: 64 caracteres hexadecimais (256 bits)
- **Validação**: Secret validado no startup (mínimo 32 caracteres)

### ✅ Proteção contra Ataques

#### SQL Injection
- **Prisma ORM**: Queries parametrizadas automaticamente
- **Zero SQL cru**: Nenhuma query SQL manual no código

#### XSS (Cross-Site Scripting)
- **DOMPurify**: Sanitização de todos os inputs de usuário
- **Sanitização**: Descrições, nomes, emails limpos antes de salvar
- **Content Security Policy**: Cookies com httpOnly previnem acesso JavaScript

#### Brute Force / DDoS
- **Rate Limiting**: Máximo 5 tentativas por 15 minutos por IP
- **Bloqueio**: 30 minutos de bloqueio após limite atingido
- **Login**: Rate limit especialmente rigoroso

#### CSRF (Cross-Site Request Forgery)
- **SameSite cookies**: Previne requisições cross-site
- **Iron-session**: Proteção built-in contra CSRF

### ✅ Validações

#### Dados de Entrada
- **Zod schemas**: Validação de tipos em runtime
- **Email**: Formato validado com biblioteca `validator`
- **Senhas**: Mínimo 8 caracteres, maiúscula, minúscula e número obrigatórios
- **Descrições**: 3-200 caracteres, sanitizadas
- **Valores**: Máximo 999.999.999, apenas positivos

#### Limites
- **Transações**: Valor máximo de ~1 bilhão
- **Descrição**: Máximo 200 caracteres
- **Nome**: 2-100 caracteres
- **Categorias**: Máximo 50 por requisição

### ✅ Proteção de Dados

#### Senhas
- ❌ **NUNCA** armazenadas em texto puro
- ✅ Hash bcrypt com salt automático
- ✅ Nunca retornadas em respostas da API

#### Secrets
- ✅ `.env*` no `.gitignore` (nunca versionados)
- ✅ SESSION_SECRET gerado com crypto.randomBytes
- ✅ Validação de força do secret no startup

#### Autorização
- ✅ Todas as rotas protegidas verificam sessão
- ✅ Usuário só acessa seus próprios dados
- ✅ Verificação de ownership antes de update/delete

## 🚨 Configuração Obrigatória

### Gerar SESSION_SECRET Seguro

```bash
# Execute no terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e adicione no `.env.local`:
```env
SESSION_SECRET="seu_secret_gerado_aqui"
```

**⚠️ IMPORTANTE:**
- Mínimo 32 caracteres (64 recomendado)
- Nunca compartilhe ou versione
- Use secret diferente em produção
- Rotacione periodicamente

## 📋 Checklist de Segurança

### Antes de Deploy
- [ ] SESSION_SECRET forte e único
- [ ] `.env*` no `.gitignore`
- [ ] HTTPS configurado (obrigatório em produção)
- [ ] Database com senha forte
- [ ] Firewall configurado (apenas portas necessárias)
- [ ] Backup automático do banco

### Monitoramento
- [ ] Logs de tentativas de login falhadas
- [ ] Alertas de rate limiting atingido
- [ ] Auditoria de acessos suspeitos

## 🔐 Melhores Práticas

### Para Usuários
1. Use senhas fortes (mínimo 8 caracteres, letras e números)
2. Não compartilhe sua conta
3. Faça logout em computadores compartilhados

### Para Desenvolvedores
1. Nunca commite secrets ou senhas
2. Rotacione SESSION_SECRET periodicamente
3. Mantenha dependências atualizadas
4. Revise logs regularmente
5. Use HTTPS sempre em produção

## 📊 Ferramentas de Segurança

### Dependências
- `bcryptjs`: Hash de senhas
- `iron-session`: Sessões criptografadas
- `zod`: Validação de schemas
- `validator`: Validação de strings
- `isomorphic-dompurify`: Sanitização XSS

### Comandos Úteis
```bash
# Verificar vulnerabilidades
npm audit

# Atualizar dependências
npm update

# Gerar novo secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🐛 Reportar Vulnerabilidades

Se encontrar uma vulnerabilidade de segurança, **NÃO** abra uma issue pública.
Entre em contato diretamente com os mantenedores.

---

**Última atualização**: Janeiro 2026
**Revisão**: v1.0
