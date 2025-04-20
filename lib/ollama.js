 async function ollama(prompt) {

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3.2', // or your model name
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  console.log(data);
  
  return data.response
}
ollama('hello')