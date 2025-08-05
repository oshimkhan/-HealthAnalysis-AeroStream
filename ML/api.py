from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load("health_model.pkl")
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array([data["features"]])  # must be 17 values
    scaled = scaler.transform(features)
    prediction = model.predict(scaled)[0]
    label = label_encoder.inverse_transform([prediction])[0]
    return jsonify({"prediction": label})

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=8080, debug=True)
