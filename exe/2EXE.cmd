cls
@REM pyinstaller -w -F --add-data "templates;templates" --add-data "static;static" ../app.py
python setup.py build
ngrok http 5000