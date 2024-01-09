import { useState } from 'react'
import './App.css'

function App() {
  const [inputApiKey, setInputApiKey] = useState('')
  const [inputPrompt, setInputPrompt] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawResponseData, setRawResponseData] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  const onSend = () => {
    if (!inputApiKey) {
      alert('Invalid input API key')
      return
    }

    setProcessing(true)
    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${inputApiKey}`
      },
      body: JSON.stringify({
        "model": "dall-e-3",
        "prompt": inputPrompt,
        "n": 1,
        "size": "1024x1024"
      })
    })
    .then(response => response.json())
    .then((data) => {
      setRawResponseData(data)
      console.log(data)
    })
    .catch(error => console.error('Error:', error))
    .finally(() => setProcessing(false))
  }

  return (
    <>
      <h1>Image Generation</h1>
      <div>
        <h2>Input</h2>
        <div>
          API Key:
          <input
            value={inputApiKey}
            onChange={(event) => { setInputApiKey(event.target.value) }}
          />
        </div>
        <div>
          <textarea
            value={inputPrompt}
            onChange={(event) => { setInputPrompt(event.target.value) }}
            rows={10}
            cols={80}
          />
        </div>
        <div>
          <button
            onClick={() => onSend()}
            disabled={processing}
          >
            Send
          </button>
          {processing && <div>Processing...</div>}
        </div>
      </div>

      <div>
        <h2>Output</h2>
        <div>
          <h3>Image</h3>
          <div>
            {rawResponseData?.data?.[0]?.url && <img src={rawResponseData.data[0].url} />}
          </div>
        </div>
        <div>
          <h3>Raw</h3>
          {rawResponseData && (
            <pre>
              {JSON.stringify(rawResponseData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </>
  )
}

export default App
