import bluetooth
from flask import Flask, jsonify

app = Flask(_name_)

@app.route('/nearby_devices')
def scan_devices():
    nearby_devices = bluetooth.discover_devices(duration=5, lookup_names=True)
    if nearby_devices:
        return jsonify({"message": "⚠️ Unauthorized Device Detected!"})
    
    return jsonify({"message": "✅ No Unauthorized Devices Found"})

if _name_ == "_main_":
    app.run(debug=True, port=5003)