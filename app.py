from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

API_URL = "https://api.opexams.com/questions-generator"
API_KEY = os.getenv("OPEXAMS_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    topic = data.get("topic")
    difficulty = data.get("difficulty")

    headers = {
        "api-key": API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "type": "topicBased",
        "topic": topic,
        "questionType": "MCQ",
        "difficulty": difficulty
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

if __name__ == "__main__":
    app.run(debug=True)
