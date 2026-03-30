@echo off
cd /d "C:\Users\mathe\projeto-tere-verde\back-end"
echo Populando banco de dados...
python -m app.seed
echo.
echo Banco populado! Admin: admin@tereverde.com / admin123
pause
