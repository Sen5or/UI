import pyaudio
import wave
import speech_recognition as sr
from os import path
import threading
import sys

HELPER_PATH = path.dirname(path.realpath(__file__)) + "/Identification"
sys.path.insert(0, HELPER_PATH)
import IdentificationServiceHttpClientHelper

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
RECORD_SECONDS = 3
WAVE_OUTPUT_FILENAME = "output.wav"
AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), WAVE_OUTPUT_FILENAME)


def content():
    r = sr.Recognizer()
    with sr.AudioFile(AUDIO_FILE) as source:
        audio = r.record(source)
    try:
        print(r.recognize_google(audio))
    except sr.UnknownValueError:
        sys.stderr.write("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        sys.stderr.write("Could not request results from Google Speech Recognition service; {0}".format(e))

    sys.stdout.flush()


def speaker():
    "ok"
'''
    #path = "output.wav"

    profile_ids = ["2ec9f081-5188-438a-b7f7-d374f9bbf88f", "99ef319e-a9a5-4a46-b679-cf2e7e4ca5f7",
                   "de762baa-703c-4083-8595-000c3b389cb5", "3c5ef345-39ee-41bc-a5fb-63154a5b8f1e",
                   "33ab384c-029f-4dad-8249-9a863e85e04c"]

    subscription_key = '136e62d920fc4696a91c1dbbf32d9a31'
    force_short_audio = 'true'
    helper = IdentificationServiceHttpClientHelper.IdentificationServiceHttpClientHelper(subscription_key)

    identification_response = helper.identify_file(
        AUDIO_FILE, profile_ids,
        force_short_audio.lower() == "true")
    try:
        if (identification_response.get_identified_profile_id() == "99ef319e-a9a5-4a46-b679-cf2e7e4ca5f7"):
            print('user:Frank')
        elif (identification_response.get_identified_profile_id() == "33ab384c-029f-4dad-8249-9a863e85e04c"):
            print('user:YiDan')
        elif (identification_response.get_identified_profile_id() == "3c5ef345-39ee-41bc-a5fb-63154a5b8f1e"):
            print('user:Dhanesh')
        elif (identification_response.get_identified_profile_id() == "2ec9f081-5188-438a-b7f7-d374f9bbf88f"):
            print('user:Deagan')
        else:
            sys.stderr.write('Cannot Identify Speaker')

    except:
        sys.stderr.write('Error Return')

    sys.stdout.flush()
'''

threads = []
frames = []
s = 0
while True:
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    #print("* recording")

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    if (len(frames) > 150):
        frames = frames[75:225]

    #print("* done recording")

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(AUDIO_FILE, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    t = threading.Thread(target = content)
    threads.append(t)
    t.start()

    if (s == 1) :
        t = threading.Thread(target = speaker)
        threads.append(t)
        t.start()
        s = 0
    else:
        s = 1
