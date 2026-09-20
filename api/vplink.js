export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const API_TOKEN = '6eaee48971cfe32c69479bc0c517f03142cefc47';

  try {
    const vpRes = await fetch(
      `https://vplink.in/api?api=${API_TOKEN}&url=${encodeURIComponent(targetUrl)}`
    );
    const data = await vpRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'VPLINK request failed', detail: err.message });
  }
}
