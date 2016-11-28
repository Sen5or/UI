import pyaudio
import wave
import speech_recognition as sr
from os import path
import threading
import sys

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "output.wav"

def content():
	AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), "output.wav")
	r = sr.Recognizer()
	with sr.AudioFile(AUDIO_FILE) as source:
	    audio = r.record(source)
	try:
            #print AUDIO_FILE
	    print(r.recognize_google(audio))
	except sr.UnknownValueError:
	    print("Google Speech Recognition could not understand audio")
	except sr.RequestError as e:
	    print("Could not request results from Google Speech Recognition service; {0}".format(e))

	sys.stdout.flush()

threads = []
frames = []
while True:
	p = pyaudio.PyAudio()
	stream = p.open(format=FORMAT,
	                channels=CHANNELS,
	                rate=RATE,
	                input=True,
	                frames_per_buffer=CHUNK)

	print("* recording")


	for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
	    data = stream.read(CHUNK)
	    frames.append(data)
	
	if (len(frames) > 150):
	    frames = frames[75:225]
	
	print("* done recording")


	stream.stop_stream()
	stream.close()
	p.terminate()

	wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
	wf.setnchannels(CHANNELS)
	wf.setsampwidth(p.get_sample_size(FORMAT))
	wf.setframerate(RATE)
	wf.writeframes(b''.join(frames))
	wf.close()

	t = threading.Thread(target = content)
	threads.append(t)
	t.start()

