# 🚀 Guia Completo de Deployment em Produção

## 📋 Pré-Requisitos

### Hardware
- **CPU:** 4+ cores
- **RAM:** 8GB+ (16GB recomendado)
- **Disk:** 100GB+ SSD
- **Bandwidth:** 100Mbps+

### Software
- **Docker:** 20.10+
- **Docker Compose:** 2.0+
- **Git:** 2.30+
- **Node.js:** 18+

### Contas/Credenciais
- [ ] Stripe Account (Pagamentos)
- [ ] Asaas Account (PIX/Boleto)
- [ ] SendGrid Account (Email)
- [ ] Twilio Account (SMS)
- [ ] OpenAI API Key (IA)
- [ ] Google Cloud Account (Maps/Analytics)
- [ ] AWS/Azure/DigitalOcean Account (Hosting)

---

## 🔧 Passo 1: Preparação do Servidor

### 1.1 Atualizar Sistema
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git
```

### 1.2 Instalar Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### 1.3 Instalar Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 1.4 Verificar Instalação
```bash
docker --version
docker-compose --version
```

---

## 📦 Passo 2: Clonar e Preparar Repositório

### 2.1 Clonar Repositório
```bash
cd /opt
sudo git clone https://github.com/marcodivulga-design/psd-billing-master.git
sudo chown -R $USER:$USER psd-billing-master
cd psd-billing-master
```

### 2.2 Criar Arquivo .env
```bash
cp .env.example .env
nano .env  # Editar com suas credenciais
```

### 2.3 Configurar Variáveis de Ambiente

```env
# Database
DATABASE_URL=mysql://root:password@mysql:3306/psd_hub
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Asaas (PIX/Boleto)
ASAAS_API_KEY=your-asaas-api-key
ASAAS_WEBHOOK_SECRET=your-webhook-secret

# SendGrid
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Twilio
TWILIO_ACCOUNT_SID=AC_xxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+55xxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Google
GOOGLE_MAPS_API_KEY=AIzaSy_xxxxx
GOOGLE_ANALYTICS_ID=G-xxxxx

# App
APP_URL=https://yourdomain.com
APP_NAME=PSD Hub
NODE_ENV=production
```

---

## 🗄️ Passo 3: Banco de Dados

### 3.1 Criar Banco de Dados
```bash
docker-compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE psd_hub;"
```

### 3.2 Executar Migrations
```bash
docker-compose exec backend npm run db:migrate
```

### 3.3 Fazer Seed dos Dados
```bash
docker-compose exec backend npm run db:seed
```

### 3.4 Verificar Banco de Dados
```bash
docker-compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD psd_hub -e "SHOW TABLES;"
```

---

## 🐳 Passo 4: Build e Deploy com Docker

### 4.1 Build das Imagens
```bash
docker-compose build
```

### 4.2 Iniciar Serviços
```bash
docker-compose up -d
```

### 4.3 Verificar Status
```bash
docker-compose ps
docker-compose logs -f
```

### 4.4 Verificar Health
```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost:5173/health
```

---

## 🔒 Passo 5: Configurar SSL/TLS

### 5.1 Instalar Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Gerar Certificado
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### 5.3 Configurar Nginx
```bash
# Editar nginx.conf
sudo nano /etc/nginx/nginx.conf

# Adicionar:
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 5.4 Recarregar Nginx
```bash
sudo systemctl reload nginx
```

---

## 📊 Passo 6: Monitoramento

### 6.1 Configurar Prometheus
```bash
# Editar prometheus.yml
sudo nano /etc/prometheus/prometheus.yml

# Adicionar:
scrape_configs:
  - job_name: 'psd-hub'
    static_configs:
      - targets: ['localhost:9090']
```

### 6.2 Configurar Grafana
```bash
# Acessar http://localhost:3000
# Username: admin
# Password: admin

# Adicionar data source: Prometheus (http://prometheus:9090)
# Importar dashboards
```

### 6.3 Configurar Alertas
```bash
# Editar alertmanager.yml
sudo nano /etc/alertmanager/alertmanager.yml

# Configurar notificações por email/Slack
```

---

## 🔄 Passo 7: Backup e Recovery

### 7.1 Backup Automático
```bash
# Criar script de backup
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/psd-hub"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup do banco de dados
docker-compose exec -T mysql mysqldump -uroot -p$MYSQL_ROOT_PASSWORD psd_hub > $BACKUP_DIR/db_$DATE.sql

# Backup de arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /opt/psd-billing-master

# Upload para S3
aws s3 cp $BACKUP_DIR/ s3://your-bucket/backups/ --recursive

# Limpar backups antigos (> 30 dias)
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /opt/backup.sh
```

### 7.2 Agendar Backup
```bash
# Adicionar ao crontab
crontab -e

# Adicionar linha:
0 2 * * * /opt/backup.sh  # Backup diário às 2 AM
```

### 7.3 Recovery
```bash
# Restaurar banco de dados
docker-compose exec -T mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD psd_hub < /backups/psd-hub/db_YYYYMMDD_HHMMSS.sql

# Restaurar arquivos
tar -xzf /backups/psd-hub/files_YYYYMMDD_HHMMSS.tar.gz -C /
```

---

## 🧪 Passo 8: Testes de Produção

### 8.1 Testes de Funcionalidade
```bash
# Testes unitários
docker-compose exec backend npm run test

# Testes de integração
docker-compose exec backend npm run test:integration

# Testes E2E
docker-compose exec backend npm run test:e2e
```

### 8.2 Testes de Performance
```bash
# Load testing com Apache Bench
ab -n 1000 -c 100 https://yourdomain.com/

# Load testing com wrk
wrk -t12 -c400 -d30s https://yourdomain.com/
```

### 8.3 Testes de Segurança
```bash
# OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://yourdomain.com

# SSL Labs
# Visitar: https://www.ssllabs.com/ssltest/
```

---

## 📈 Passo 9: Otimizações

### 9.1 Cache
```bash
# Redis para sessões
REDIS_URL=redis://redis:6379/0

# Cache de API
CACHE_TTL=3600

# Cache de assets
CACHE_CONTROL=public, max-age=31536000
```

### 9.2 CDN
```bash
# Configurar CloudFlare
# 1. Adicionar domínio
# 2. Configurar nameservers
# 3. Ativar cache
# 4. Ativar compression
```

### 9.3 Compressão
```bash
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
```

---

## 🚨 Passo 10: Monitoramento Contínuo

### 10.1 Health Checks
```bash
# Verificar status
curl -s http://localhost:3000/health | jq .

# Verificar database
curl -s http://localhost:3000/health/db | jq .

# Verificar cache
curl -s http://localhost:3000/health/cache | jq .
```

### 10.2 Logs
```bash
# Ver logs em tempo real
docker-compose logs -f

# Filtrar por serviço
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Exportar logs
docker-compose logs > logs.txt
```

### 10.3 Alertas
```bash
# Configurar alertas no Grafana
# 1. Ir para Alerting > Alert Rules
# 2. Criar regra para CPU > 80%
# 3. Criar regra para Memory > 85%
# 4. Criar regra para Disk > 90%
# 5. Configurar notificações
```

---

## 🔄 Passo 11: Atualizações

### 11.1 Atualizar Código
```bash
# Pull latest changes
git pull origin main

# Rebuild images
docker-compose build

# Restart services
docker-compose up -d
```

### 11.2 Atualizar Dependências
```bash
# Backend
docker-compose exec backend npm update

# Frontend
docker-compose exec frontend npm update

# Rebuild
docker-compose build
```

### 11.3 Zero-Downtime Deployment
```bash
# 1. Build nova imagem
docker-compose build backend

# 2. Iniciar novo container
docker-compose up -d --no-deps --build backend

# 3. Verificar saúde
curl http://localhost:3000/health

# 4. Remover container antigo
docker-compose down
```

---

## 📞 Troubleshooting

### Problema: Serviço não inicia
```bash
# Ver logs
docker-compose logs -f [service]

# Verificar portas
netstat -tlnp | grep 3000

# Limpar e reconstruir
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Banco de dados não conecta
```bash
# Verificar container
docker-compose ps mysql

# Verificar logs
docker-compose logs mysql

# Reiniciar
docker-compose restart mysql
```

### Problema: Alto uso de CPU/Memory
```bash
# Ver uso
docker stats

# Limpar volumes não usados
docker volume prune

# Limpar imagens não usadas
docker image prune
```

---

## ✅ Checklist Final

- [ ] Servidor preparado
- [ ] Docker instalado
- [ ] Repositório clonado
- [ ] .env configurado
- [ ] Banco de dados criado
- [ ] Migrations executadas
- [ ] Docker build completo
- [ ] Serviços iniciados
- [ ] SSL/TLS configurado
- [ ] Monitoramento ativo
- [ ] Backups agendados
- [ ] Testes passando
- [ ] Performance otimizada
- [ ] Alertas configurados
- [ ] Documentação atualizada

---

## 🎉 Conclusão

Seu PSD HUB está agora **PRONTO PARA PRODUÇÃO**! 🚀

**Próximos passos:**
1. Monitorar performance
2. Coletar feedback de usuários
3. Otimizar baseado em dados
4. Escalar conforme necessário
5. Expandir para novos mercados

**Status:** 🟢 **DEPLOYMENT COMPLETO**

---

**Desenvolvido com ❤️ pelo Super Prompt Autônomo**

**Data:** 2024 | **Versão:** 4.0.0
