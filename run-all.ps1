Start-Process powershell -ArgumentList "-NoExit","-Command","cd E:\final_GDM_project\backend; .\.venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --reload --port 8000"

Start-Process powershell -ArgumentList "-NoExit","-Command","cd E:\final_GDM_project\test-model; python app.py"

Start-Process powershell -ArgumentList "-NoExit","-Command","cd E:\final_GDM_project\frontend; npm run dev"