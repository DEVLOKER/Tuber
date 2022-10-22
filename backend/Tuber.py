from pytube import YouTube
from pytube import Search
from pytube import Playlist
from math import log, floor
import sys
import xml.etree.ElementTree as ElementTree
from html import unescape
import json
import os

class Tuber(object):


    """         static variables      """
    DOWNLOAD_PATH = "downloads"
    YouTubeVideoLink1 = 'http://youtube.com/watch?v='
    YouTubeVideoLink2 = 'https://www.youtube.com/watch?'
    YouTubeVideoLink3 = 'https://youtu.be/'
    YouTubePlayListLink = 'https://www.youtube.com/playlist?list='
    


    def __init__(self, videoID):
        self.videoURL = ''
        self.yt_obj = None
        if(videoID.startswith(Tuber.YouTubeVideoLink1) or videoID.startswith(Tuber.YouTubeVideoLink2) or videoID.startswith(Tuber.YouTubeVideoLink3)):
            self.videoURL = videoID
        else:
            self.videoURL = Tuber.YouTubeVideoLink1+videoID
        try:
            self.yt_obj = YouTube(self.videoURL) # , on_progress_callback=Tuber.progress_function)
        except:
            self.yt_obj = None
    
    def getVideoURL(self):
        return self.videoURL
    
    def getYouTubeVideo(self):
        return self.yt_obj




    """         YouTube Video infos      """
    def getVideoInfo(self):
        # video = pafy.new(self.videoURL)
        return {
            "title"         : self.yt_obj.title,
            "duration"      : Tuber.duration_format(self.yt_obj.length),
            "rating"        : Tuber.count_format(self.yt_obj.rating),
            "likes"         : self.yt_obj.initial_data['contents']['twoColumnWatchNextResults']['results']['results']['contents'][0]['videoPrimaryInfoRenderer']['videoActions']['menuRenderer']['topLevelButtons'][0]['toggleButtonRenderer']['defaultText']['simpleText'],
            "dislikes"      : self.yt_obj.initial_data['contents']['twoColumnWatchNextResults']['results']['results']['contents'][0]['videoPrimaryInfoRenderer']['videoActions']['menuRenderer']['topLevelButtons'][1]['toggleButtonRenderer']['defaultText']['simpleText'],
            "views"         : Tuber.count_format(self.yt_obj.views),
            "author"        : self.yt_obj.author,
            "publish_date"  : self.yt_obj.publish_date.strftime("%m/%d/%Y, %H:%M:%S"),
            "description"   : self.yt_obj.description,
            "thumbnail_url" : self.yt_obj.thumbnail_url,
            "age_restricted": self.yt_obj.age_restricted,
            # "captions"      : self.yt_obj.captions["en"], #    ["en"]
            # "caption_tracks": self.yt_obj.caption_tracks,
            "channel_id"    : self.yt_obj.channel_id,
            "channel_url"   : self.yt_obj.channel_url,
            "watch_url"     : self.yt_obj.watch_url,
            # "watch_html"    : self.yt_obj.watch_html,
            # "embed_html"    : yt_obj.embed_html,
            "embed_url"     : self.yt_obj.embed_url,
            "keywords"      : self.yt_obj.keywords,
            #"vid_info"      : self.yt_obj.vid_info
        }



    """         Stream infos      """
    def getAvailableStreams(self):
        mp4files = self.getMP4Streams()
        audiofiles = self.getAudioStreams()
        listStreams = []
        for stream in [*mp4files, *audiofiles]:
            listStreams.append(Tuber.getStreamInfo(stream))
        return listStreams

    def getMP4Streams(self):
        mp4files = self.yt_obj.streams.filter(file_extension='mp4').order_by('resolution').desc()
        return mp4files

    def getAudioStreams(self):
        audiofiles = self.yt_obj.streams.filter(only_audio=True).desc()
        return audiofiles

    def getStreamInfo(stream):
        if(stream.type=="audio"):
            return {
                "itag"          : stream.itag,
                "size"          : stream.filesize,
                "filesize"      : Tuber.size_format(stream.filesize),
                "mime_type"     : stream.mime_type,
                "abr"           : stream.abr,
                "codecs"        : stream.codecs,
                "is_progressive": stream.is_progressive,
                "type"          : stream.type,
                # "file_extension": stream.file_extension,
                "url"           : stream.url
            }
        if(stream.type=="video"):
            return {
                "itag"          : stream.itag,
                "size"          : stream.filesize,
                "filesize"      : Tuber.size_format(stream.filesize),
                "mime_type"     : stream.mime_type,
                "resolution"    : stream.resolution,
                "fps"           : stream.fps,
                "codecs"        : stream.codecs,
                "is_progressive": stream.is_progressive,
                "type"          : stream.type,
                # "file_extension": stream.file_extension,
                "url"           : stream.url
            }




    """         Download Stream      """
    def downloadStreamByID(self, streamID, name):
        self.yt_obj.register_on_progress_callback(Tuber.progress_function)
        self.yt_obj.register_on_complete_callback(Tuber.complete_function)
        path = os.path.join(Tuber.DOWNLOAD_PATH, 'streams')
        stream = self.yt_obj.streams.get_by_itag(streamID)
        stream.download(output_path=path, filename=name)




    """         Captions      """
    def getAvailableCaptions(self):
        langs = []
        for caption in self.yt_obj.caption_tracks: # items, all
            langs.append({"name": caption.name, "code": caption.code})
        return langs
    
    def captionByLanguageName(self, code, name):
        try:
            # caption = self.yt_obj.captions.get(lang_name).generate_srt_captions()
            xml_captions = self.yt_obj.captions[code].xml_captions
            segments = []
            root = ElementTree.fromstring(xml_captions)
            for i, child in enumerate(list(root.findall('body/p'))):
                text = ''.join(child.itertext()).strip()
                if not text:
                    continue
                line = unescape(text.replace("\n", " ").replace("  ", " "),)
                segments.append(line)

            return { "code": code, "name": name, "str": segments, "xml": xml_captions } # "\n".join(segments).strip()
            
        except:  
            return None
    
    def downloadCaption(self, lang_name):
        path = Tuber.DOWNLOAD_PATH+'/'+self.yt_obj.title+'/captions/'+lang_name
        self.yt_obj.captions.get(lang_name).download(self.yt_obj.title, srt=True, output_path=path ) # filename_prefix
        self.yt_obj.captions.get(lang_name).download(self.yt_obj.title, srt=False, output_path=path ) # filename_prefix





    """         PlayList videos      """
    @staticmethod
    def getPlayListURLs(playListID):
        videoURL = ''
        if(playListID.startswith(Tuber.YouTubePlayListLink)):
            videoURL = playListID
        else:
            videoURL = Tuber.YouTubePlayListLink+playListID
        return Playlist(videoURL).video_urls

    @staticmethod
    def searchVideos(text):
        searchList = [] 
        s = Search(text)
        # print(s.completion_suggestions):
        for i, v_ in enumerate(s.results):
            searchList.append({"title": v_.title, "url": v_.watch_url})
        return searchList
        # return s.results





    """         tools      """
    @staticmethod
    def duration_format(seconds):
        if seconds is not None:
            seconds = int(seconds)
            d = seconds // (3600 * 24)
            h = seconds // 3600 % 24
            m = seconds % 3600 // 60
            s = seconds % 3600 % 60
            if d > 0:
                return '{:02d}:{:02d}:{:02d}:{:02d}'.format(d, h, m, s)
            elif h > 0:
                return '{:02d}:{:02d}:{:02d}'.format(h, m, s)
            elif m > 0:
                return '{:02d}:{:02d}'.format(m, s)
            elif s > 0:
                return '00:{:02d}'.format(s)
        return '-'

    @staticmethod
    def count_format(number, precision=2, units=['', 'K', 'M', 'G', 'T', 'P']):
        if number is not None:
            k = 1000.0
            magnitude = int(floor(log(number, k)))
            return f'{number/k**magnitude:.{precision}f}{units[magnitude]}'
        else:
            return '-'


    @staticmethod
    def size_format(number, precision=2, units=['', 'K', 'M', 'G', 'T', 'P']):
        if number is not None:
            k = 1024.0
            magnitude = int(floor(log(number, k)))
            return f'{number/k**magnitude:.{precision}f}{units[magnitude]}'
        else:
            return '-'

    @staticmethod
    def progress_function(stream, chunk, bytes_remaining):
        filesize = stream.filesize
        #progress = int(((filesize - bytes_remaining) / filesize) * 100)

        current = ((filesize - bytes_remaining)/filesize)
        percent = ('{0:.1f}').format(current*100)
        progress = int(50*current)
        status = '█' * progress + '-' * (50 - progress)
        sys.stdout.write('|{bar}| {percent}%\r'.format(bar=status, percent=percent))
        sys.stdout.flush()

    @staticmethod
    def complete_function(stream, file_handle):
        print('download complelte!')


    @staticmethod
    def isVideoURL(text):
        if(text.startswith(Tuber.YouTubeVideoLink1) or text.startswith(Tuber.YouTubeVideoLink2) or text.startswith(Tuber.YouTubeVideoLink3)):
            return True
        else:
            return False

    @staticmethod
    def isPlayListURL(text):
        if(text.startswith(Tuber.YouTubePlayListLink)):
            return True
        else:
            return False




"""
# searchList = Tuber.searchVideos('YouTube Rewind')
# print(searchList)

print(json.dumps(video.getVideoInfo(), indent=4))



videoID = 'c85AhmKL-_8' # 2lAe1cqCOXo   c85AhmKL-_8     oQdxL_WW3aE   mBJMkFNRVek
video = Tuber(videoID)
# print(video.yt_obj)

print(video.getAvailableStreams())



playListID = 'PLynhp4cZEpTbRs_PYISQ8v_uwO0_mDg_X' # PLynhp4cZEpTbRs_PYISQ8v_uwO0_mDg_X  PLpi4YdMCC439sN_5vIza6IfQm0qc-IqPO   PLcow8_btriE11hzMbT3-B1sBg4YIc-9g_
playlist = Tuber.getPlayListURLs(playListID)
print(playlist)
for url in playlist:
    v = Tuber(url)
    print(json.dumps(v.getVideoInfo(), indent=4))

"""

# video = Tuber("http://youtube.com/watch?v=2lAe1cqCOXo")
# listStreams = video.getAvailableStreams()
# print(listStreams)
# print(listStreams[0]['itag'])
# video.downloadStreamByID(listStreams[0]['itag'], 'test')




