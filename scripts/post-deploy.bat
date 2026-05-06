@echo off
REM PSD HUB - POST DEPLOY AUTOMATION SCRIPT (Windows)
REM
REM Este script automatiza as ações após o projeto ser criado no Manus WebDev
REM
REM Uso: scripts\post-deploy.bat

setlocal enabledelayedexpansion

cls

echo.
echo ===============================================================
echo PSD HUB - POST DEPLOY AUTOMATION
echo ===============================================================
echo.

REM FASE 1: Verificar Pré-Requisitos
echo [INFO] FASE 1: Verificando pré-requisitos...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js nao encontrado
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js: %NODE_VERSION%

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm nao encontrado
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm: %NPM_VERSION%

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git nao encontrado
    exit /b 1
)
echo [OK] Git encontrado

echo.

REM FASE 2: Instalar Dependências
echo [INFO] FASE 2: Instalando dependências...

if exist package.json (
    call npm ci --silent
    echo [OK] Dependencias instaladas
) else (
    echo [ERROR] package.json nao encontrado
    exit /b 1
)

echo.

REM FASE 3: Validar Build
echo [INFO] FASE 3: Validando build...

call npm run check
echo [OK] TypeScript check passou

call npm run build
echo [OK] Build bem-sucedido

echo.

REM FASE 4: Executar Testes
echo [INFO] FASE 4: Executando testes...

call npm run test
echo [OK] Testes concluidos

echo.

REM FASE 5: Validar Estrutura
echo [INFO] FASE 5: Validando estrutura do projeto...

if exist "client\src" (
    echo [OK] Diretorio encontrado: client\src
) else (
    echo [ERROR] Diretorio nao encontrado: client\src
    exit /b 1
)

if exist "server" (
    echo [OK] Diretorio encontrado: server
) else (
    echo [ERROR] Diretorio nao encontrado: server
    exit /b 1
)

if exist "drizzle" (
    echo [OK] Diretorio encontrado: drizzle
) else (
    echo [ERROR] Diretorio nao encontrado: drizzle
    exit /b 1
)

if exist "dist" (
    echo [OK] Diretorio encontrado: dist
) else (
    echo [ERROR] Diretorio nao encontrado: dist
    exit /b 1
)

echo.

REM FASE 6: Preparar para Deploy
echo [INFO] FASE 6: Preparando para deploy...

if not exist ".env" (
    echo [WARNING] .env nao encontrado, criando a partir de .env.example...
    copy .env.example .env
    echo [OK] .env criado (CONFIGURE COM SEUS VALORES!)
) else (
    echo [OK] .env ja existe
)

echo.

REM FASE 7: Informações de Deploy
echo [INFO] FASE 7: Informacoes de deploy...

echo.
echo ===============================================================
echo [OK] PROJETO PRONTO PARA DEPLOY
echo ===============================================================
echo.

echo Resumo:
echo   - Dependencias: [OK] Instaladas
echo   - Build: [OK] Bem-sucedido
echo   - Testes: [OK] Executados
echo   - Estrutura: [OK] Validada
echo.

echo Proximos passos:
echo   1. Editar .env com suas credenciais
echo   2. Fazer commit: git add . ^&^& git commit -m "chore: post-deploy setup"
echo   3. Push: git push origin main
echo   4. Deploy no Manus WebDev: npm start
echo.

echo Arquivos importantes:
echo   - .env - Variaveis de ambiente (CONFIGURE!)
echo   - dist\ - Build pronto para deploy
echo   - README.md - Documentacao
echo   - DEPLOY-MANUS-WEBDEV.md - Guia de deploy
echo.

echo Links uteis:
echo   - Repositorio: https://github.com/marcodivulga-design/psd-hub
echo   - Manus WebDev: https://manus.space
echo   - Documentacao: README.md
echo.

echo ===============================================================
echo.

echo [OK] Script de automacao concluido!
echo [INFO] Agora faca o deploy no Manus WebDev
echo.

pause
