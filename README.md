Phishing Detection Tool
A full-stack web application that detects phishing URLs using machine learning. This tool features a React frontend, Node.js backend, and a Flask API integrated with a trained machine learning model for real-time phishing detection.

Key Features
URL Phishing Detection: Detects whether a submitted URL is legitimate or a phishing attempt.
React Frontend: Simple and user-friendly interface where users can input URLs for analysis.
Node.js Backend: Acts as a middle layer between the frontend and the machine learning API, processing requests and returning predictions.
Machine Learning Model: A Flask API running a trained Random Forest model that analyzes URL features to detect phishing attempts.
Real-Time Detection: Fast analysis of URLs and immediate feedback to the user on whether the URL is safe or phishing.
Extensible Architecture: Easily extendable for future enhancements such as handling more complex threat types or integrating additional models.
Project Workflow
User Interaction: The user submits a URL through the React frontend.
Backend Processing: The Node.js backend receives the URL and sends the extracted features to the Flask API.
Machine Learning Analysis: The Flask API loads a pre-trained machine learning model (Random Forest) and analyzes the URL features to predict whether the URL is phishing or legitimate.
Result Relay: The Flask API returns the prediction result to the Node.js backend, which then forwards the result to the React frontend.
User Feedback: The frontend displays the result (phishing or legitimate) to the user in real-time.
Setup Instructions
Frontend (React):

Navigate to the frontend/ folder.
Run npm install to install dependencies.
Run npm start to launch the React app.
Backend (Node.js):

Navigate to the backend/ folder.
Run npm install to install dependencies.
Run node index.js to start the backend server.
Machine Learning API (Flask):

Navigate to the ml_model/ folder.
Run pip install -r requirements.txt to install dependencies.
Run python app.py to start the Flask API.
