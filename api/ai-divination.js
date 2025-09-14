export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }
  
  try {
    // 修改：接收前端傳來的 prompt
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: '缺少 prompt 參數' });
    }
    
    // 修改：使用正確的 API 端點
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + process.env.GOOGLE_AI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error('AI 服務暫時無法使用');
    }
    
    const data = await response.json();
    const result = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({
      success: true,
      interpretation: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI 解卦錯誤:', error);
    res.status(500).json({
      success: false,
      error: 'AI 解卦服務暫時無法使用，請稍後再試'
    });
  }
}
