cls
cd ../frontend
npm run build
npm run postbuild
cd ../exe
pyinstaller --noconfirm --onefile --console --icon "logo.ico" --add-data "../backend/.flaskenv;." --add-data "../backend/Tuber.py;." --add-data "../backend/static;static/" --add-data "../backend/downloads;downloads/"  "../backend/app.py"
@REM pyinstaller --noconfirm --onefile --windowed --icon "logo.ico" --add-data "../backend/.flaskenv;." --add-data "../backend/Tuber.py;." --add-data "../backend/static;static/" --add-data "../backend/downloads;downloads/"  "../backend/app.py"
@REM auto-py-to-exe