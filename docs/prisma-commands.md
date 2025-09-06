# 🗄️ Comandos Prisma - Ambientes de Desenvolvimento e Produção

## 🎯 **Visão Geral**

Este projeto utiliza scripts organizados para gerenciar bancos de dados em diferentes ambientes de forma segura e eficiente.

## 🔧 **Ambiente de Desenvolvimento**

### **Comandos Disponíveis:**

| Comando                   | Descrição                   | Uso                       |
| ------------------------- | --------------------------- | ------------------------- |
| `npm run prisma:validate` | Valida o schema Prisma      | Desenvolvimento local     |
| `npm run prisma:generate` | Gera o cliente Prisma       | Após mudanças no schema   |
| `npm run prisma:studio`   | Abre o Prisma Studio        | Visualizar dados do banco |
| `npm run prisma:push`     | Sincroniza schema com banco | Desenvolvimento rápido    |
| `npm run prisma:migrate`  | Cria e executa migrações    | Mudanças estruturais      |
| `npm run prisma:status`   | Status das migrações        | Verificar estado do banco |

### **Variáveis Utilizadas:**

- `DATABASE_URL` - Conexão principal (com pooling)
- `DIRECT_URL` - Conexão direta (sem pooling)

---

## 🚨 **Ambiente de Produção**

### **⚠️ ATENÇÃO DE SEGURANÇA:**

- **NUNCA** execute comandos de produção sem confirmação
- **SEMPRE** confirme digitando 'PRODUCAO' quando solicitado
- **VERIFIQUE** o ambiente antes de executar
- **BACKUP** sempre antes de mudanças estruturais

### **Comandos Disponíveis:**

| Comando                          | Descrição                  | Uso                       |
| -------------------------------- | -------------------------- | ------------------------- |
| `npm run prisma:prod:validate`   | Valida schema em produção  | Verificar configuração    |
| `npm run prisma:prod:generate`   | Gera cliente para produção | Deploy                    |
| `npm run prisma:prod:studio`     | Prisma Studio em produção  | **CUIDADO: Dados reais!** |
| `npm run prisma:prod:deploy`     | Deploy de migrações        | **MÓDIFICAR BANCO REAL**  |
| `npm run prisma:prod:status`     | Status em produção         | Monitoramento             |
| `npm run prisma:prod:introspect` | Introspectar banco         | Sincronizar schema        |

### **Variáveis Utilizadas:**

- `DATABASE_URL_PROD` - Conexão principal de produção
- `DIRECT_URL_PROD` - Conexão direta de produção

---

## 🚀 **Fluxo de Trabalho Recomendado**

### **1. Desenvolvimento Local:**

```bash
# 1. Fazer mudanças no schema
npm run prisma:validate    # Validar
npm run prisma:generate    # Gerar cliente
npm run prisma:push        # Sincronizar banco local
npm run prisma:studio      # Verificar dados
```

### **2. Preparar para Produção:**

```bash
# 1. Criar migração
npm run prisma:migrate     # Gerar arquivo de migração

# 2. Testar migração
npm run prisma:prod:validate  # Validar em produção
npm run prisma:prod:status    # Verificar estado
```

### **3. Deploy em Produção:**

```bash
# 1. Deploy da migração
npm run prisma:prod:deploy    # ⚠️ MODIFICA BANCO REAL

# 2. Verificar sucesso
npm run prisma:prod:status    # Confirmar aplicação
```

---

## 🔒 **Segurança e Boas Práticas**

### **✅ FAZER:**

- Sempre confirme comandos de produção
- Use variáveis de ambiente para credenciais
- Faça backup antes de mudanças estruturais
- Teste migrações em ambiente de desenvolvimento
- Monitore logs após deploy

### **❌ NUNCA FAZER:**

- Executar comandos de produção sem confirmação
- Commitar credenciais no Git
- Fazer mudanças estruturais sem backup
- Usar credenciais de produção em desenvolvimento
- Executar migrações não testadas

---

## 🐛 **Solução de Problemas**

### **Erro: "DATABASE_URL not found"**

```bash
# Verificar se .env existe
ls -la .env

# Verificar variáveis
echo $DATABASE_URL
```

### **Erro: "Connection failed"**

```bash
# Verificar credenciais no .env
cat .env | grep DATABASE_URL

# Testar conexão
npm run prisma:validate
```

### **Erro: "Migration failed"**

```bash
# Verificar status
npm run prisma:status

# Reverter se necessário
# (Implementar script de rollback se necessário)
```

---

## 📚 **Recursos Adicionais**

- [Documentação Prisma](https://www.prisma.io/docs)
- [Prisma Studio](https://www.prisma.io/docs/concepts/tools/prisma-studio)
- [Migrações Prisma](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

## 🎯 **Próximos Passos**

1. **Teste os comandos** de desenvolvimento
2. **Configure ambiente** de produção
3. **Implemente CI/CD** para migrações automáticas
4. **Monitore logs** de produção
5. **Documente mudanças** no schema
