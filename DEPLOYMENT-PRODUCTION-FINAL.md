# 🚀 Deployment em Produção - Guia Final

## ✅ PRÉ-REQUISITOS

- [ ] Servidor com Ubuntu 22.04 LTS
- [ ] Docker & Docker Compose instalados
- [ ] Domínio configurado (DNS)
- [ ] SSL/TLS certificate (Let's Encrypt)
- [ ] Credenciais de todas as integrações
- [ ] Backup do banco de dados
- [ ] Monitoramento configurado

---

## 📋 CHECKLIST DE DEPLOYMENT

### 1. Preparação de Infraestrutura

```bash
# SSH no servidor
ssh ubuntu@seu-servidor.com

# Update do sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### 2. Clone do Repositório

```bash
# Criar diretório
sudo mkdir -p /app/psd-hub
cd /app/psd-hub

# Clone do repositório
sudo git clone https://github.com/marcodivulga-design/psd-billing-master.git .

# Permissões
sudo chown -R ubuntu:ubuntu /app/psd-hub
```

### 3. Configuração de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.production

# Editar variáveis de produção
nano .env.production
```

**Variáveis Críticas:**

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@mysql:3306/psd_hub_prod
REDIS_URL=redis://redis:6379

# Autenticação
JWT_SECRET=seu-jwt-secret-muito-seguro
OAUTH_SERVER_URL=https://api.manus.im

# Pagamentos
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
ASAAS_API_KEY=sua-chave-asaas

# Email
SENDGRID_API_KEY=sua-chave-sendgrid

# IA
OPENAI_API_KEY=sua-chave-openai

# Domínio
FRONTEND_URL=https://psd-hub.com
BACKEND_URL=https://api.psd-hub.com

# Segurança
NODE_ENV=production
LOG_LEVEL=info
```

### 4. SSL/TLS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Gerar certificado
sudo certbot certonly --standalone -d psd-hub.com -d api.psd-hub.com

# Copiar certificados para Docker
sudo cp /etc/letsencrypt/live/psd-hub.com/fullchain.pem ./certs/
sudo cp /etc/letsencrypt/live/psd-hub.com/privkey.pem ./certs/

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 5. Build Docker

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Verificar imagens
docker images
```

### 6. Migrations do Banco de Dados

```bash
# Iniciar apenas banco de dados
docker-compose -f docker-compose.prod.yml up -d mysql redis

# Aguardar inicialização
sleep 30

# Executar migrations
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:migrate

# Fazer seed de dados iniciais (opcional)
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:seed
```

### 7. Deploy Completo

```bash
# Iniciar todos os serviços
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 8. Verificação de Saúde

```bash
# Health check do backend
curl -s https://api.psd-hub.com/health | jq .

# Health check do frontend
curl -s https://psd-hub.com/health | jq .

# Verificar banco de dados
docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p -e "SELECT 1;"

# Verificar Redis
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

### 9. Monitoramento

```bash
# Instalar Prometheus
docker-compose -f docker-compose.prod.yml up -d prometheus

# Instalar Grafana
docker-compose -f docker-compose.prod.yml up -d grafana

# Acessar Grafana
# https://psd-hub.com:3000
# Username: admin
# Password: admin (MUDE!)
```

### 10. Backup Automático

```bash
# Criar script de backup
cat > /app/psd-hub/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/psd-hub"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup do banco de dados
docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD psd_hub_prod > $BACKUP_DIR/db_$TIMESTAMP.sql

# Backup do Redis
docker-compose -f docker-compose.prod.yml exec -T redis redis-cli BGSAVE
docker cp psd-hub-redis-1:/data/dump.rdb $BACKUP_DIR/redis_$TIMESTAMP.rdb

# Backup de arquivos
tar -czf $BACKUP_DIR/files_$TIMESTAMP.tar.gz /app/psd-hub

# Manter apenas últimos 7 dias
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup concluído: $TIMESTAMP"
EOF

# Tornar executável
chmod +x /app/psd-hub/backup.sh

# Agendar backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * /app/psd-hub/backup.sh") | crontab -
```

---

## 🔐 Segurança em Produção

### 1. Firewall

```bash
# Instalar UFW
sudo apt install ufw -y

# Configurar firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Fail2Ban

```bash
# Instalar Fail2Ban
sudo apt install fail2ban -y

# Configurar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Verificar status
sudo fail2ban-client status
```

### 3. Atualizações Automáticas

```bash
# Instalar unattended-upgrades
sudo apt install unattended-upgrades -y

# Configurar
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Monitoramento em Produção

### 1. Logs Centralizados

```bash
# Instalar ELK Stack (Elasticsearch, Logstash, Kibana)
docker-compose -f docker-compose.prod.yml up -d elasticsearch logstash kibana

# Acessar Kibana
# https://psd-hub.com:5601
```

### 2. Alertas

```bash
# Configurar alertas no Prometheus
cat > /app/psd-hub/prometheus/alerts.yml << 'EOF'
groups:
  - name: psd_hub
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / 1024 / 1024 > 1024
        for: 5m
        annotations:
          summary: "High memory usage detected"
      
      - alert: DatabaseDown
        expr: up{job="mysql"} == 0
        for: 1m
        annotations:
          summary: "Database is down"
EOF
```

### 3. Notificações Slack

```bash
# Configurar webhook do Slack
# https://api.slack.com/messaging/webhooks

# Adicionar ao Prometheus
cat >> /app/psd-hub/prometheus/prometheus.yml << 'EOF'
alertmanager:
  - static_configs:
      - targets:
          - localhost:9093

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - localhost:9093
EOF
```

---

## 🧪 Testes Pós-Deployment

### 1. Testes de Saúde

```bash
# Health checks
curl -s https://psd-hub.com/health
curl -s https://api.psd-hub.com/health

# Verificar banco de dados
curl -s https://api.psd-hub.com/api/health/db

# Verificar Redis
curl -s https://api.psd-hub.com/api/health/redis
```

### 2. Testes de Performance

```bash
# Load test com Apache Bench
ab -n 1000 -c 10 https://psd-hub.com/

# Load test com wrk
wrk -t12 -c400 -d30s https://psd-hub.com/
```

### 3. Testes de Segurança

```bash
# SSL/TLS test
curl -I https://psd-hub.com/

# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://psd-hub.com/

# Verificar headers de segurança
curl -I https://psd-hub.com/ | grep -i "security\|cache\|x-"
```

---

## 📈 Escalabilidade

### 1. Load Balancing

```yaml
# docker-compose.prod.yml
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend-1
      - backend-2
      - backend-3

  backend-1:
    build: .
    environment:
      - NODE_ENV=production
      - INSTANCE=1

  backend-2:
    build: .
    environment:
      - NODE_ENV=production
      - INSTANCE=2

  backend-3:
    build: .
    environment:
      - NODE_ENV=production
      - INSTANCE=3
```

### 2. Auto-scaling

```bash
# Instalar Docker Swarm
docker swarm init

# Deploy com replicas
docker service create \
  --name psd-hub-backend \
  --replicas 3 \
  --publish 3000:3000 \
  seu-repo/backend:latest

# Escalar
docker service scale psd-hub-backend=5
```

---

## 🚨 Troubleshooting

### Problema: Container não inicia

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs backend

# Verificar configuração
docker-compose -f docker-compose.prod.yml config

# Reiniciar
docker-compose -f docker-compose.prod.yml restart backend
```

### Problema: Banco de dados não conecta

```bash
# Verificar status
docker-compose -f docker-compose.prod.yml ps mysql

# Verificar logs
docker-compose -f docker-compose.prod.yml logs mysql

# Reconectar
docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p
```

### Problema: Alto uso de memória

```bash
# Verificar uso
docker stats

# Limpar cache
docker system prune -a

# Aumentar limite
# Editar docker-compose.prod.yml e adicionar:
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

---

## ✅ Checklist Final

- [ ] Servidor preparado
- [ ] Docker instalado
- [ ] Repositório clonado
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/TLS configurado
- [ ] Migrations executadas
- [ ] Deploy completo
- [ ] Health checks passando
- [ ] Monitoramento ativo
- [ ] Backups configurados
- [ ] Firewall ativo
- [ ] Fail2Ban ativo
- [ ] Testes de saúde passando
- [ ] Testes de performance OK
- [ ] Testes de segurança OK
- [ ] Equipe notificada
- [ ] Documentação atualizada

---

## 🎉 DEPLOYMENT CONCLUÍDO!

Seu sistema está agora em **PRODUÇÃO** e pronto para servir clientes reais.

**Próximos passos:**
1. Monitorar performance
2. Ativar marketing automations
3. Começar a vender
4. Coletar feedback
5. Otimizar baseado em dados

---

**Status:** 🟢 **PRONTO PARA PRODUÇÃO**

---

**Desenvolvido com ❤️ pelo Super Prompt Autônomo**

**Data:** 2024 | **Versão:** 5.0.0
