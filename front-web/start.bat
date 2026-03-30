@echo off
cd /d "C:\Users\mathe\projeto-tere-verde\front-web"
echo Instalando dependencias...
call npm install
echo.
echo Criando arquivo .env...
echo VITE_API_URL=http://localhost:8000 > .env
echo.
echo Iniciando servidor...
npm run dev
pause
