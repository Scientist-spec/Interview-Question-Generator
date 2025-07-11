from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
import cohere
import os
from flask_cors import CORS

app = Flask(__name__,)
CORS(app)  # To allow frontend requests
load_dotenv()
# ✅ Load Cohere API key from .env file
co = cohere.Client(os.getenv("COHERE_API_KEY"))

@app.route('/generate', methods=['POST'])
def generate_questions():
    try:
        data = request.json
        role = data.get('role')
        experience = data.get('experience')
        skills = data.get('skills')
        difficulty = data.get('difficulty')
        round_type = data.get('roundType')

        # ✅ Build prompt dynamically
        if round_type == "Technical":
            prompt = f"""
            Generate 5 {difficulty} level technical coding questions for a {role}.
            Candidate experience: {experience}
            Skills: {skills}
            Each question should include:
            - Problem Statement
            - Sample Input
            - Sample Output
            """
        elif round_type == "HR":
            prompt = f"""
            Generate 5 {difficulty} level HR interview questions for a {role}.
            Candidate experience: {experience}
            """
        elif round_type == "Behavioral":
            prompt = f"""
            Generate 5 {difficulty} level behavioral interview questions for a {role}.
            Candidate experience: {experience}
            """
        elif round_type == "Mixed":
            prompt = f"""
            Generate a set of 5 {difficulty} level interview questions for a {role}.
            - 3 Technical coding questions (include input/output)
            - 1 Behavioral
            - 1 HR
            Candidate experience: {experience}
            Skills: {skills}
            Format clearly by section.
            """
        else:
            return jsonify({"error": "Invalid round type"}), 400

        # ✅ Generate using Cohere
        response = co.chat(
            message=prompt,
            model="command-r-plus",
            temperature=0.7
        )

        print("Prompt:\n", prompt)
        print("Response:\n", response.text)

        return jsonify({"questions": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
