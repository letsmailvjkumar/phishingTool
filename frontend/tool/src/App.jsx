import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    setError(null);
  
    try {
      console.log('Sending URL:', input);
      const response = await fetch('http://localhost:5000/api/phishing-detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: input }),
      });
      
      const json = await response.json();
      console.log('Received response:', json);
      
      if (response.ok) {
        setResult(json);
      } else {
        setError(json.error || 'An error occurred during phishing detection');
      }
    } catch (error) {
      console.error('Error during phishing detection:', error);
      setError('An error occurred during phishing detection');
    }
  };

  return (
    <div className="App">
      <h1>Phishing Detection Tool</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit">Check</button>
      </form>

      {result && (
        <div className={`result ${result.result}`}>
          {result.result === 'phishing' && <p>⚠️ This is likely a phishing attempt!</p>}
          {result.result === 'suspicious' && <p>🚧 This URL is suspicious. Proceed with caution.</p>}
          {result.result === 'safe' && <p>✔️ This URL appears to be safe.</p>}
        </div>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;