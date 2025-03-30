import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Cargar el modelo entrenado
model = load_model("modelo_cnn_cpu.h5")
CLASSES = ["Coche", "Avion", "Tren"]

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")  # Usar color (no grises)
    image = image.resize((128, 128))
    image = img_to_array(image)
    image = image.reshape((1, 128, 128, 3)) / 255.0
    return image

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        image_bytes = file.read()

        image = preprocess_image(image_bytes)
        prediction = model.predict(image)[0]
        predicted_class = CLASSES[np.argmax(prediction)]
        confidence = round(float(np.max(prediction) * 100), 2)

        return jsonify({
            "class": predicted_class,
            "confidence": confidence,
            "raw": prediction.tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
