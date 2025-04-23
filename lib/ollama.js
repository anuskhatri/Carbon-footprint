// app/api/insight/route.ts

 export async function ollama(userData) {
  const { steps, distance, activity } = await userData;

  // Calculate total distance walked in kilometers
  const totalDistanceKm = distance.reduce((total, entry) => total + entry.meters / 1000, 0);

  // Carbon footprint reduction calculation
  const CO2EmissionsPerKm = 0.21; // kg of CO2 per kilometer
  const carbonSaved = totalDistanceKm * CO2EmissionsPerKm;

  // Create the prompt for Ollama
  const prompt = `
    User walked a total of ${totalDistanceKm.toFixed(2)} kilometers today.
    Walking instead of driving helps reduce carbon footprint.
    Calculate the total carbon saved from walking instead of driving a car, and provide insights into how this contributes to environmental health.
    Assume a car emits 0.21kg of CO₂ per kilometer traveled.
    Respond in a friendly and informative tone 80 words only.
  `;

  // Call Ollama API to get the insight
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2', // or the specific model you're using
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  
  return { carbonSaved, insight: data.response }
}