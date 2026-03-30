@echo off
cd /d "C:\Users\mathe\projeto-tere-verde\back-end"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
