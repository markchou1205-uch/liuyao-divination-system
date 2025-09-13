// 檢查使用限制的 API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const today = new Date().toDateString();
  
  // 簡單的記憶體儲存（生產環境建議使用資料庫）
  const usageKey = `${clientIP}_${today}`;
  
  // 這裡可以實作更複雜的限制邏輯
  
  res.status(200).json({
    canUse: true, // 簡化版本，先允許所有請求
    remainingUses: 1
  });
}
