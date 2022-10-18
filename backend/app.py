from flask import Flask, Response, redirect, stream_with_context, url_for, request, jsonify, make_response
from Tuber import Tuber
import requests

app = Flask(__name__)



@app.route('/search',methods = ['POST'])
def search():
    if request.method == 'POST':
        link = request.get_json()['searchText']
        if(link.startswith(Tuber.YouTubeVideoLink1) or link.startswith(Tuber.YouTubeVideoLink2) or link.startswith(Tuber.YouTubeVideoLink3)):
            video = Tuber(link)
            return [video.getVideoInfo()]
        else:
            if(link.startswith(Tuber.YouTubePlayListLink)):
                return Tuber.getPlayListURLs(link)
            else:
                return Tuber.searchVideos(link)



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
        url = request.get_json()['url']
        return Tuber(url).getCaptionByName(code)
    else:
        return {}



@app.route('/downloadFile',methods = ['POST'])
def downloadFile():
    def generate(res):
        for chunk in res.iter_content(chunk_size=1024): 
                if chunk:
                    yield chunk

    if request.method == 'POST':
        url = request.get_json()['url']
        fileName = request.get_json()['fileName']
        res = requests.get(url, stream=True)
        # print(res.headers)
        resp = Response(stream_with_context(generate(res)))
        # resp.headers['Access-Control-Allow-Origin'] = '*'
        # resp.headers['Access-Control-Allow-Origin'] = resp.calculate_content_length
        return resp
        """
        with open(fileName, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024): 
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    #f.flush() commented by recommendation from J.F.Sebastian
        """
    else:
        return {}


@app.route('/chunks')
def chunks():
    def generate():
        for i in range(1, 1000):
            yield str(i)
    return Response(stream_with_context(generate()))


if __name__ == '__main__':
    app.run(debug = True)
    # app.run('0.0.0.0', 8085, debug=True)