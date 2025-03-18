import pyaudio
import numpy as np
from flask import Flask, jsonify

app = Flask(_name_)
CHUNK = 1024
RATE = 44100
THRESHOLD = 1000

@app.route('/sound_detection')
def sound_detection():
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=RATE, input=True, frames_per_buffer=CHUNK)
    data = np.frombuffer(stream.read(CHUNK), dtype=np.int16)
    volume = np.abs(data).mean()
    stream.stop_stream()
    stream.close()
    p.terminate()

    if volume > THRESHOLD:
        return jsonify({"message": "⚠️ Unusual Sound Detected!"})

    return jsonify({"message": "✅ Silent Environment"})

if _name_ == "_main_":
    app.run(debug=True, port=5002)