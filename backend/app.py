from flask import Flask, Response, redirect, stream_with_context, url_for, request
from Tuber import Tuber
import requests
# from gevent.pywsgi import WSGIServer
from waitress import serve
import threading, webbrowser
import os


PORT = 5000
# app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app = Flask(__name__, static_folder='static', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/search',methods = ['POST'])
def search():
    if request.method == 'POST':
        searchText = request.get_json()['searchText']

        if(Tuber.isVideoURL(searchText)):
            return redirect(url_for('.videoURL', url=searchText))

        if(Tuber.isPlayListURL(searchText)):
            return redirect(url_for('.playListURL', url=searchText))
        
        return redirect(url_for('.searchText', text=searchText))


@app.route('/videoURL')
def videoURL():
    url = request.args['url']
    video = Tuber(url)
    return [video.getVideoInfo()]


@app.route('/playListURL')
def playListURL():
    url = request.args['url']
    return Tuber.getPlayListURLs(url)


@app.route('/searchText')
def searchText():
    text = request.args['text']
    return Tuber.searchVideos(text)


@app.route('/availableStreams',methods = ['POST'])
def availableStreams():
    if request.method == 'POST':
        url = request.get_json()['url']
        return Tuber(url).getAvailableStreams()
    else:
        return []

@app.route('/availableCaptions',methods = ['POST'])
def availableCaptions():
    if request.method == 'POST':
        url = request.get_json()['url']
        return Tuber(url).getAvailableCaptions()
    else:
        return []

@app.route('/captionByLanguageName',methods = ['POST'])
def captionByLanguageName():
    if request.method == 'POST':
        code = request.get_json()['code']
        name = request.get_json()['name']
        url = request.get_json()['url']
        return Tuber(url).captionByLanguageName(code, name)
    else:
        return {}



@app.route('/downloadStream',methods = ['POST'])
def downloadStream():
    def generate(res):
        for chunk in res.iter_content(chunk_size=1024): 
                if chunk:
                    yield chunk

    if request.method == 'POST':
        url = request.get_json()['url']
        # fileName = request.get_json()['fileName']
        res = requests.get(url, stream=True)
        return Response(stream_with_context(generate(res)))
    else:
        return {}



# threading.Timer(1.25, lambda: os.system(f"start http://localhost:3000")).start()
# threading.Timer(1.25, lambda: webbrowser.open_new(f'http://localhost:{PORT}')).start()


if __name__ == '__main__':
    # app.run(debug = True)
    # app.run('0.0.0.0', 5000, debug=True)
    
    # webbrowser.open('http://localhost:5000')
    serve(app, host="0.0.0.0", port=PORT)
    
    # WSGIServer(('', 5000), app).serve_forever() # http_server