from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('phishing_detection_model.pkl')

# Whitelist of known legitimate domains
WHITELIST = {'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org', 'twitter.com', 'linkedin.com', 'ebay.com', 'instagram.com', 'pinterest.com', 'reddit.com', 'spotify.com', 'netflix.com', 'hulu.com', 'hbo.com', 'disney.com', 'apple.com', 'microsoft.com', 'google.com', 'amazon.com', 'wikipedia.org', 'twitter.com', 'linkedin.com', 'ebay.com', 'instagram.com', 'pinterest.com', 'reddit.com', 'spotify.com', 'netflix.com', 'hulu.com', 'hbo.com', 'disney.com', 'apple.com', 'microsoft.com', 'office.com'}

def is_whitelisted(url):
    from urllib.parse import urlparse
    domain = urlparse(url).netloc
    return any(domain.endswith(white_domain) for white_domain in WHITELIST)

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.json
        url = data.get('url')
        
        if is_whitelisted(url):
            return jsonify({
                'result': 'safe',
                'confidence': 1.0,
                'message': 'Domain is whitelisted'
            })
        
        if 'features' not in data or not isinstance(data['features'], list):
            return jsonify({'error': 'Missing or invalid features in request'}), 400
        
        features = np.array(data['features']).reshape(1, -1)
        features_df = pd.DataFrame(features)
        
        prediction_proba = model.predict_proba(features_df)
        feature_importance = model.feature_importances_
        
        phishing_probability = prediction_proba[0][1]
        
        if phishing_probability > 0.75:
            result = 'phishing'
        elif phishing_probability > 0.4:
            result = 'suspicious'
        else:
            result = 'safe'
        
        return jsonify({
            'result': result,
            'confidence': float(phishing_probability),
            'feature_importance': feature_importance.tolist()
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)