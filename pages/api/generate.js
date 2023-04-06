const generateAction = async (req, res) => {
  console.log('Received request');
  
  const input = JSON.parse(req.body).input;
  
  const response = await fetch(
    `https://api-inference.huggingface.co/models/borgsid/borgsidlukee`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'false'
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );

  // Check for different statuses to send proper payload
  if (response.ok) {
    const buffer = await response.arrayBuffer();
    console.log("buffer.body",Buffer.from(buffer, 'utf8'))
    // Convert to base64
    const base64 = bufferToBase64(buffer);
    // Make sure to change to base64
    res.status(200).json({ image: base64 });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    console.log("json",json)
    res.status(response.status).json({ error: response.statusText });
  }
};
const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  return `data:image/png;base64,${base64}`;
};
export default generateAction;