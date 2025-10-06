// pages/api/ai-divination.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Debug 指紋
  res.setHeader('X-Handler', 'api/ai-divination.js');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '只允許 POST 請求' });
  }

  try {
    // ---- 解析 body（Next 已 parse；若是字串再 JSON.parse）----
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};

    // ---- 主要介面：優先吃 prompt；若無則相容 questionType+data ----
    let prompt = (typeof body.prompt === 'string') ? body.prompt.trim() : '';
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
          `請以傳統六爻（世應、用神、動爻、變爻、日月、六親）進行解讀，結論條列 200~400 字。`;
      }
    }
    if (!prompt) {
      return res.status(400).json({ success: false, error: '缺少 prompt 參數（或 questionType+data）' });
    }

    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ success: false, error: '伺服器缺少 GOOGLE_AI_API_KEY' });
    }

    // ---- 設定可用模型（可用 GEMINI_MODEL 覆蓋第一順位）----
    const defaultModels = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-1.5-flash'];
    const modelsToTry = [];
    if (process.env.GEMINI_MODEL && typeof process.env.GEMINI_MODEL === 'string') {
      modelsToTry.push(process.env.GEMINI_MODEL.trim());
    }
    for (const m of defaultModels) {
      if (!modelsToTry.includes(m)) modelsToTry.push(m);
    }

    // ---- 呼叫 v1beta generateContent（並做 404/NOT_FOUND fallback）----
    const callGemini = async (model) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${API_KEY}`;
      const payload = {
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ]
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('timeout')), 20000);

      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const text = await resp.text();
        let json; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
        return { ok: resp.ok, status: resp.status, json, modelTried: model };
      } finally {
        clearTimeout(timer);
      }
    };

    let last = null;
    for (const model of modelsToTry) {
      // 第一次嘗試
      const res1 = await callGemini(model);
      last = res1;

      // 成功
      if (res1.ok) {
        const candidates = res1.json?.candidates || [];
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
          _debug: { handler: 'api/ai-divination.js', apiVersion: 'v1beta', model: res1.modelTried }
        });
      }

      // 404 / NOT_FOUND → 換下一個模型
      const notFound = res1.status === 404 ||
                       String(res1.json?.error?.status || '').includes('NOT_FOUND') ||
                       /not found/i.test(JSON.stringify(res1.json || {}));
      if (notFound) {
        // 繼續嘗試下一個模型
        continue;
      }

      // 其他錯誤（401/403/429/5xx）直接返回，避免無意義重試
      return res.status(res1.status).json({
        success: false,
        error: '上游服務回應錯誤',
        upstreamStatus: res1.status,
        upstreamBody: res1.json,
        _debug: { handler: 'api/ai-divination.js', apiVersion: 'v1beta', model: res1.modelTried }
      });
    }

    // 若所有模型都 404 失敗
    return res.status(last?.status || 404).json({
      success: false,
      error: '所有候補模型皆無法使用（可能是 API 版本或模型名變更）',
      upstreamStatus: last?.status || 404,
      upstreamBody: last?.json || null,
      _debug: { tried: modelsToTry, apiVersionTried: 'v1beta' }
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
