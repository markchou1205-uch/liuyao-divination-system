// 分析統計系統
class AnalyticsSystem {
    constructor() {
        this.apiEndpoint = '/api/analytics';
    }

    // 記錄用戶訪問
    async trackUserVisit(userType = 'divination') {
        try {
            await fetch(`${this.apiEndpoint}/visit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType, // 'divination' 或 'professional'
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer
                })
            });
        } catch (error) {
            console.error('記錄訪問失敗:', error);
        }
    }

    // 記錄 AI 問卦使用
    async trackAIUsage(question, prompt, response, tokenCount) {
        try {
            await fetch(`${this.apiEndpoint}/ai-usage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: question.substring(0, 100), // 隱私考量，只記錄前100字
                    promptLength: prompt.length,
                    responseLength: response.length,
                    tokenCount,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('記錄AI使用失敗:', error);
        }
    }

    // 記錄基礎起卦使用
    async trackBasicDivination(method, questionType) {
        try {
            await fetch(`${this.apiEndpoint}/basic-divination`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method, // 'random', 'liuyao', etc.
                    questionType,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('記錄基礎起卦失敗:', error);
        }
    }

    // Token 計算函數
    calculateTokens(text) {
        // 中文字符計算方式：1個中文字約等於1.5-2個token
        // 英文單詞：平均4個字符=1個token
        const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
        const englishChars = text.replace(/[\u4e00-\u9fff]/g, '').length;
        
        const chineseTokens = chineseChars * 1.8; // 中文係數
        const englishTokens = englishChars / 4;   // 英文係數
        
        return Math.ceil(chineseTokens + englishTokens);
    }

    // 獲取統計數據
    async getAnalytics(dateRange = 'today') {
        try {
            const response = await fetch(`${this.apiEndpoint}/stats?range=${dateRange}`);
            return await response.json();
        } catch (error) {
            console.error('獲取統計失敗:', error);
            return null;
        }
    }
}

// 全域實例
window.analyticsSystem = new AnalyticsSystem();

// 修改 AI 解卦函數以包含統計
async function callEnhancedAIAPIWithAnalytics(guaData, userQuestion) {
    try {
        const prompt = aiDivination.generateEnhancedPrompt(guaData, null, userQuestion);
        
        // 計算 prompt tokens
        const promptTokens = window.analyticsSystem.calculateTokens(prompt);
        
        const response = await fetch('/api/ai-divination-enhanced', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                userQuestion: userQuestion,
                maxWords: aiDivination.maxWords,
                guaData: guaData
            })
        });

        if (!response.ok) {
            throw new Error('API 調用失敗');
        }

        const result = await response.json();
        const responseText = result.content || '';
        
        // 計算 response tokens
        const responseTokens = window.analyticsSystem.calculateTokens(responseText);
        const totalTokens = promptTokens + responseTokens;
        
        // 記錄統計
        await window.analyticsSystem.trackAIUsage(
            userQuestion, 
            prompt, 
            responseText, 
            totalTokens
        );
        
        // 在控制台顯示 token 消耗
        console.log(`Token 消耗統計:
Prompt: ${promptTokens} tokens
Response: ${responseTokens} tokens  
Total: ${totalTokens} tokens
估計成本: $${(totalTokens * 0.00025 / 1000).toFixed(4)}`);
        
        return responseText;

    } catch (error) {
        console.error('AI API 調用錯誤:', error);
        return '系統忙碌中，請稍後再試';
    }
}

// 頁面載入時記錄訪問
document.addEventListener('DOMContentLoaded', function() {
    // 判斷是求卦者還是專業版
    const userType = window.location.pathname.includes('divination.html') ? 'divination' : 'professional';
    window.analyticsSystem.trackUserVisit(userType);
});

// 修改原有的起卦函數以包含統計
const originalStartDivination = window.startDivination;
if (originalStartDivination) {
    window.startDivination = function() {
        // 記錄基礎起卦使用
        const method = document.getElementById('divination-method')?.value;
        const questionType = document.getElementById('question-type')?.value;
        
        if (method) {
            window.analyticsSystem.trackBasicDivination(method, questionType);
        }
        
        return originalStartDivination.apply(this, arguments);
    };
}