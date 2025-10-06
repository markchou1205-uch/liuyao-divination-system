// pages/api/ai-divination.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Debug 指紋（方便在 Network / Response Headers 確認命中哪支 handler）
  res.setHeader('X-Handler', 'api/ai-divination.js');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '只允許 POST 請求' });
  }

  try {
    // ---- 讀取並兼容 body 來源（Next.js 會自動 parse；保留字串時也支援）----
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};

    // ---- 主要介面：優先吃 prompt；若無則兼容 questionType+data（自動組 prompt）----
    let prompt = '';
    if (typeof body.prompt === 'string') prompt = body.prompt.trim();

    if (!prompt) {
      const qType = body.questionType;
      const data = body.data || {};
      if (qType && data) {
        const ly = Array.isArray(data.liuyaoData) ? data.liuyaoData.join(',') : '';
        const cq = (data.customQuestion || '').toString().trim();
        const main = (data.mainGuaName || '').toString().trim();
        const change = (data.changeGuaName || '').toString().trim();
        prompt =
          `【六爻占卜】\n` +
          `問題類型：${qType}\n` +
          `問題：${cq || '(未填)'}\n` +
          (main ? `本卦：${main}\n` : '') +
          (change ? `變卦：${change}\n` : '') +
          (ly ? `六爻代碼（自下而上）：${ly}\n` : '') +
          `請以傳統六爻規則（世應、用神、動爻、變爻、日月、六親）進行解讀，結論簡潔扼要（約 200~400 字），分段條列。`;
      }
    }

    if (!prompt) {
      return res.status(400).json({ success: false, error: '缺少 prompt 參數（或 questionType+data）' });
    }

    // ---- 檢查金鑰 ----
    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ success: false, error: '伺服器缺少 GOOGLE_AI_API_KEY' });
    }

    // ---- 呼叫 Gemini（20 秒逾時保護）----
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const payload = {
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ]
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error('timeout')), 20000);

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).catch((e) => {
      // 連線層錯誤（DNS/逾時/被中斷）
      throw new Error(`上游連線失敗：${e?.message || e}`);
    });
    clearTimeout(timer);

    const text = await upstream.text();
    let j;
    try { j = text ? JSON.parse(text) : {}; } catch { j = { raw: text }; }

    if (!upstream.ok) {
      // 將上游錯誤原樣帶回，方便前端/Network 面板定位（401/403/429/5xx）
      console.error('Upstream error:', upstream.status, j);
      return res.status(upstream.status).json({
        success: false,
        error: '上游服務回應錯誤',
        upstreamStatus: upstream.status,
        upstreamBody: j
      });
    }

    // ---- 解析 Gemini 回應 ----
    // 典型路徑：candidates[0].content.parts[].text
    const candidates = j?.candidates || [];
    let interpretation = '';
    if (candidates.length > 0) {
      const parts = candidates[0]?.content?.parts || [];
      const texts = parts.map(p => (p?.text || '').toString()).filter(Boolean);
      interpretation = texts.join('\n').trim();
    }
    if (!interpretation) interpretation = '(空回應)';

    return res.status(200).json({
      success: true,
      interpretation,
      timestamp: new Date().toISOString(),
      _debug: { handler: 'api/ai-divination.js', model: 'gemini-1.5-flash' }
    });

  } catch (err) {
    console.error('Handler exception:', err);
    const detail = (err && err.message) ? err.message : String(err);
    return res.status(500).json({
      success: false,
      error: 'AI 解卦服務暫時無法使用（伺服器例外）',
      detail
    });
  }
}
