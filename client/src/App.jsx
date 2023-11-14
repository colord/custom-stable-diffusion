import { useState } from 'react'
import './App.css'
import ImageContainer from './components/ImageContainer';

function App() {
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(4);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  async function generateImage(form) {
    try {
      const formData = new FormData(form);
      const plainFormData = Object.fromEntries(formData.entries());
      const formDataJSON = JSON.stringify(plainFormData);

      const response = await fetch('http://127.0.0.1:8000/create-image/', {
        method: form.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: formDataJSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const imageResponse = await response.json();
      setImageSrc(imageResponse["image_url"]);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    generateImage(ev.target);
  }

  return (
    <>
      <ImageContainer imageSrc={imageSrc} width={width} height={height} />

      <form onSubmit={handleSubmit} className="settings-form" method="POST">
        <fieldset>
          <label>
            Width
            <input type="number" name="width" id="input-width" min={1}
              value={width}
              onChange={e => setWidth(e.target.value)}
            />
          </label>

          <label>
            Height
            <input type="number" name="height" id="input-height" min={1}
              value={height}
              onChange={e => setHeight(e.target.value)}
            />
          </label>

          <label>
            Steps
            <input type="number" name="steps" id="input-steps" min={1}
              value={steps} onChange={e => setSteps(e.target.value)}
            />
          </label>
        </fieldset>

        <label htmlFor="input-prompt">Prompt</label>
        <textarea name="prompt" placeholder="Enter prompt..." id="input-prompt" rows={8}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}>
        </textarea>

        <label htmlFor="input-negative-prompt">Negative Prompt</label>
        <textarea name="negative_prompt" placeholder="Enter negative prompt..." id="input-negative-prompt" rows={8}
          value={negativePrompt}
          onChange={e => setNegativePrompt(e.target.value)}>
        </textarea>

        <button className="queue-button" type="submit">Queue</button>
      </form>
    </>
  )
}

export default App;