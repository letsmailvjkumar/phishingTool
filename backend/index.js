const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { URL } = require('url');
const dns = require('dns');
const { promisify } = require('util');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5001';

app.use(express.json());
app.use(cors());

const dnsLookup = promisify(dns.lookup);

async function extractFeaturesFromURL(urlString) {
  // Add protocol if missing
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = 'https://' + urlString;
  }

  try {
    const parsedUrl = new URL(urlString);
    
    const features = [
      /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(parsedUrl.hostname) ? 1 : 0, // Have_IP
      urlString.includes('@') ? 1 : 0, // Have_At
      urlString.length, // URL_Length
      parsedUrl.pathname.split('/').filter(Boolean).length, // URL_Depth
      urlString.includes('//') ? 1 : 0, // Redirection
      parsedUrl.protocol === 'https:' ? 1 : 0, // https_Domain
      urlString.includes('tinyurl') ? 1 : 0, // TinyURL
      parsedUrl.hostname.includes('-') ? 1 : 0, // Prefix/Suffix
      1, // DNS_Record (assuming it has a DNS record if we can parse it)
      0, // Web_Traffic (placeholder)
      0, // Domain_Age (placeholder)
      parsedUrl.hostname.split('.').pop().length, // Domain_End (length of TLD)
      0, // iFrame (placeholder)
      0, // Mouse_Over (placeholder)
      0, // Right_Click (placeholder)
      parsedUrl.searchParams.size > 0 ? 1 : 0, // Web_Forwards (assuming query params might indicate forwarding)
    ];

    return features;
  } catch (error) {
    console.error('Error extracting features:', error);
    throw error;
  }
}

app.post('/api/phishing-detect', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Missing URL in request' });
    }

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let features;
    try {
      features = await extractFeaturesFromURL(url);
    } catch (error) {
      console.error('Error extracting features:', error);
      return res.json({ result: 'suspicious', message: 'Unable to analyze URL' });
    }

    console.log('Extracted features:', features);

    try {
      const response = await axios.post(`${FLASK_API_URL}/detect`, { url, features });
      console.log('Flask API response:', response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error from Flask API:', error.message);
      if (error.response && error.response.status === 400) {
        return res.json({ result: 'suspicious', message: 'Unable to classify URL' });
      }
      throw error;  // Re-throw for general error handling
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while detecting phishing.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});