import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { version } from '../package.json';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import ContactPage from './ContactPage'; // Import the ContactPage component

// comment out for now
// import { connectFunctionsEmulator } from 'firebase/functions'

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCUgp9YM_EPNV_gDn1WUIgi36wG4LXTPug",
  authDomain: "scottadamsai-a33bb.firebaseapp.com",
  projectId: "scottadamsai-a33bb",
  storageBucket: "scottadamsai-a33bb.firebasestorage.app",
  messagingSenderId: "793456642494",
  appId: "1:793456642494:web:5ad5ce6dff45acce35d1ef",
  measurementId: "G-8X6XS1KSQR"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const askFunction = httpsCallable(functions, 'ask');

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LdDWGkrAAAAAP67KnKq_mFDzafh_NRMiUxY6Ihh'),
  isTokenAutoRefreshEnabled: true
});

// Comment out for now, set env var
// connectFunctionsEmulator(functions, 'localhost', 5001);

function HomePage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await askFunction({
        question: query,
        env: 'production'
      });
      const data = result.data;

      if (data.text) {
        setResponse(data.text);
      } else {
        setError('No response received');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Scott Adams AI</h1>
      <p>I'm the AI version of Scott Adams</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here..."
          rows={4}
          maxLength={500}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? 'Processing...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div className="response success">
          <p>{response}</p>
        </div>
      )}

      {error && (
        <div className="response error">
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <div className="background"></div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><a href="https://github.com/lando2319/scottAdamsAI/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute</a></li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <footer>
            <p>V {version}</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;