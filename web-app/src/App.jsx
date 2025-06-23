import { useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'

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
}

const app = initializeApp(firebaseConfig)
const functions = getFunctions(app)
const askFunction = httpsCallable(functions, 'ask')

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LdDWGkrAAAAAP67KnKq_mFDzafh_NRMiUxY6Ihh'),
  isTokenAutoRefreshEnabled: true
})

// Comment out for now, set env var
// connectFunctionsEmulator(functions, 'localhost', 5001);

function App() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const result = await askFunction({ 
        question: query,
        env: 'production'
      })
      const data = result.data

      if (data.text) {
        setResponse(data.text)
      } else {
        setError('No response received')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="background"></div>

      <div className="content">
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

        <footer>
          <p>V 0.0.1</p>
        </footer>
      </div>
    </div>
  )
}

export default App