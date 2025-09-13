export default async function handler(req, res) {
  // 設定 CORS
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
    const { hexagrams, question, timestamp } = req.body;
    
    // 建構解卦 prompt
    const prompt = `
作為專業的六爻卦師，請解析以下卦象：

問題：${question}
起卦時間：${timestamp}
卦象：${JSON.stringify(hexagrams)}

請提供簡潔而深入的解卦，包含：
1. 卦象分析
2. 事件走向
3. 建議行動
4. 注意事項

字數控制在 300 字以內。
`;

    // 調用 Google AI API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GOOGLE_AI_API_KEY, {
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
