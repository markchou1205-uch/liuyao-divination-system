// AI 解卦功能
class AIDivination {
    constructor() {
        this.dailyLimit = 10; // 每日限制次數
        this.maxWords = 300; // 回覆字數限制
        this.storageKey = 'ai_divination_usage';
        this.dateKey = 'ai_divination_date';
    }

    // 檢查今日使用次數
    checkDailyUsage() {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem(this.dateKey);
        const storedUsage = parseInt(localStorage.getItem(this.storageKey) || '0');

        // 如果是新的一天，重置使用次數
        if (storedDate !== today) {
            localStorage.setItem(this.dateKey, today);
            localStorage.setItem(this.storageKey, '0');
            return 0;
        }

        return storedUsage;
    }

    // 增加使用次數
    incrementUsage() {
        const currentUsage = this.checkDailyUsage();
        localStorage.setItem(this.storageKey, (currentUsage + 1).toString());
    }

    // 檢查是否可以使用 AI 解卦
    canUseAIDivination() {
        const currentUsage = this.checkDailyUsage();
        return currentUsage < this.dailyLimit;
    }

    // 獲取剩餘次數
    getRemainingUsage() {
        const currentUsage = this.checkDailyUsage();
        return Math.max(0, this.dailyLimit - currentUsage);
    }

    // 生成 AI 解卦 prompt
    generatePrompt(guaData, questionType) {
        const questionTexts = {
            'love-female': '感情/問女方',
            'love-male': '感情/問男方',
            'parents': '問父母',
            'children': '問子女',
            'career': '問事業',
            'health': '問健康',
            'wealth': '問財富',
            'partnership': '問合作合夥',
            'lawsuit': '問官司'
        };

        const questionText = questionTexts[questionType] || '未知問題';
        const yongshenMapping = {
            'love-female': '妻財',
            'love-male': '官鬼',
            'parents': '父母',
            'children': '子孫',
            'career': '官鬼',
            'health': '世爻',
            'wealth': '妻財',
            'partnership': '兄弟',
            'lawsuit': '官鬼'
        };
        
        const yongshen = yongshenMapping[questionType] || '未知';

        // 構建詳細的卦象資訊
        let prompt = `你是專業的六爻卦師，請根據以下卦象資訊提供解卦分析：

問題類型：${questionText}
主卦：${guaData.mainGuaName || '未知'}
變卦：${guaData.changeGuaName || '無變卦'}
取用神：${yongshen}

請提供以下分析（總字數控制在${this.maxWords}字以內）：

1. 卦象概述（50字內）
2. 用神分析（100字內）
3. 卦變解釋（如有變卦，80字內）
4. 結論建議（70字內）

請用專業但易懂的語言，避免過於艱深的術語。回覆格式：
【卦象概述】...
【用神分析】...
【卦變解釋】...（如無變卦可省略）
【結論建議】...

注意：回覆請務必控制在${this.maxWords}字以內。`;

        return prompt;
    }

    // 調用增強版 AI API
    async callEnhancedAIAPI(guaData, userQuestion) {
        try {
            const prompt = this.generateEnhancedPrompt(guaData, null, userQuestion);
            
            // 調用您的後端 API
            const response = await fetch('/api/ai-divination-enhanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    userQuestion: userQuestion,
                    maxWords: this.maxWords,
                    guaData: guaData
                })
            });

            if (!response.ok) {
                throw new Error('API 調用失敗');
            }

            const result = await response.json();
            return result.content || '很抱歉，AI 分析暫時無法使用';

        } catch (error) {
            console.error('增強版 AI API 調用錯誤:', error);
            return '系統忙碌中，請稍後再試';
        }
    }
// 調用基本 AI API（連接到後端或直接調用）
async callAIAPI(guaData, questionType) {
    try {
        // 暫時使用前端直接調用方案
        const prompt = this.generatePrompt(guaData, questionType);
        
        // 請替換為您的 Google AI API Key
        const apiKey = 'AIzaSyDwNr6Res144rwZJMbxX7jNa1OcGf1DQJQ';
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('AI API 調用錯誤:', error);
        throw error;
    }
}

// 輔助方法：獲取問題文字
getQuestionText(questionType) {
    const questionTexts = {
        'love-female': '感情/問女方',
        'love-male': '感情/問男方',
        'parents': '問父母',
        'children': '問子女',
        'career': '問事業',
        'health': '問健康',
        'wealth': '問財富',
        'partnership': '問合作合夥',
        'lawsuit': '問官司'
    };
    return questionTexts[questionType] || '未知問題';
}
    // 顯示使用限制提示
    showUsageLimitModal() {
        const modalHTML = `
            <div id="usage-limit-modal" class="modal" style="display: flex;">
                <div class="modal-content">
                    <span class="close-btn" onclick="closeUsageLimitModal()">&times;</span>
                    <h3>使用限制提醒</h3>
                    <div class="usage-limit-content">
                        <p>免費用戶每日限制使用 AI 解卦 <strong>${this.dailyLimit} 次</strong></p>
                        <p>今日已達使用上限，明天會自動重置。</p>
                        
                        <div class="upgrade-options">
                            <h4>升級選項：</h4>
                            <div class="option-card">
                                <h5>專業版</h5>
                                <p>• 無限制 AI 解卦</p>
                                <p>• 更詳細的分析報告</p>
                                <p>• 優先客服支持</p>
                                <button class="btn upgrade-btn" onclick="handleUpgrade('premium')">
                                    NT$ 99/月
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 移除現有 modal
        const existingModal = document.getElementById('usage-limit-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 添加新 modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// 全域實例
let aiDivination;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    aiDivination = new AIDivination();
});

// 修改簡易解卦函數以整合 AI
function showSimpleInterpretationWithAI() {
    // 檢查是否已完成起卦
    const mainTableSection = document.getElementById('main-table-section');
    if (!mainTableSection || mainTableSection.classList.contains('hidden')) {
        alert('請先完成起卦');
        return;
    }

    // 獲取當前問題類型
    const questionSelect = document.getElementById('question-type');
    const currentQuestion = questionSelect ? questionSelect.value : '';
    
    if (!currentQuestion) {
        alert('請選擇要問的問題');
        return;
    }

    // 檢查 AI 使用次數
    if (!aiDivination.canUseAIDivination()) {
        aiDivination.showUsageLimitModal();
        return;
    }

    // 顯示 Modal
    const modal = document.getElementById('simple-interpretation-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 顯示選擇：基礎解卦或 AI 解卦
        showInterpretationOptions(currentQuestion);
    }
}

// 顯示解卦選項
function showInterpretationOptions(questionType) {
    const contentDiv = document.getElementById('simple-interpretation-content');
    const remaining = aiDivination.getRemainingUsage();
    
    const optionsHTML = `
        <div class="interpretation-options">
            <h4>請選擇解卦方式：</h4>
            
            <div class="option-card basic-option" onclick="generateBasicInterpretation('${questionType}')">
                <h5>📋 基礎解卦</h5>
                <p>根據傳統六爻理論提供基本解釋</p>
                <span class="option-price">免費</span>
            </div>
            
            <div class="option-card ai-option" onclick="generateAIInterpretation('${questionType}')">
                <h5>🤖 AI 智能解卦</h5>
                <p>結合 AI 技術提供個性化深度分析</p>
                <span class="option-price">剩餘 ${remaining} 次</span>
            </div>
        </div>
        
        <div class="usage-info">
            <small>※ AI 解卦每日限制 ${aiDivination.dailyLimit} 次，今日剩餘 ${remaining} 次</small>
        </div>
    `;
    
    contentDiv.innerHTML = optionsHTML;
}

// 生成基礎解卦（原有功能）
function generateBasicInterpretation(questionType) {
    // 調用原有的 generateInterpretation 函數
    if (typeof generateInterpretation === 'function') {
        generateInterpretation(questionType);
    }
}

// 生成 AI 解卦
async function generateAIInterpretation(questionType) {
    const contentDiv = document.getElementById('simple-interpretation-content');
    
    // 顯示載入中
    contentDiv.innerHTML = `
        <div class="loading-interpretation">
            <div class="loading-spinner"></div>
            <div class="loading-text">AI 正在分析卦象...</div>
        </div>
    `;
    
    // 增加使用次數
    aiDivination.incrementUsage();
    
    try {
        // 獲取卦象資料
        const guaData = {
            mainGuaName: getMainGuaName(),
            changeGuaName: getChangeGuaName()
        };
        
        // 調用 AI API
        const aiResponse = await aiDivination.callAIAPI(guaData, questionType);
        
        // 顯示 AI 解卦結果
        const interpretationHTML = `
            <div class="question-indicator">問題：${getQuestionText(questionType)}</div>
            
            <div class="ai-interpretation">
                <h4>🤖 AI 智能解卦</h4>
                <div class="ai-content">
                    ${formatAIResponse(aiResponse)}
                </div>
            </div>
            
            <div class="interpretation-footer-info">
                <small>※ 此為 AI 輔助分析，建議搭配專業卦師諮詢</small>
                <small>今日 AI 解卦剩餘次數：${aiDivination.getRemainingUsage()}</small>
            </div>
        `;
        
        contentDiv.innerHTML = interpretationHTML;
        
    } catch (error) {
        console.error('AI 解卦失敗:', error);
        contentDiv.innerHTML = `
            <div class="error-message">
                <h4>AI 分析失敗</h4>
                <p>系統暫時無法提供 AI 解卦服務，請稍後再試或選擇基礎解卦。</p>
                <button class="btn" onclick="generateBasicInterpretation('${questionType}')">
                    使用基礎解卦
                </button>
            </div>
        `;
    }
}

// 輔助函數
function getMainGuaName() {
    const gnCell = document.querySelector('.main-table tr.blue-header td:first-child');
    return gnCell ? gnCell.textContent.trim() : '未知卦';
}

function getChangeGuaName() {
    const bgnCell = document.querySelector('.main-table tr.blue-header td:nth-child(2)');
    const text = bgnCell ? bgnCell.textContent.trim() : '';
    return (text && text !== 'BGN') ? text : '';
}

function formatAIResponse(response) {
    // 格式化 AI 回應，處理換行和特殊格式
    return response
        .replace(/【([^】]+)】/g, '<h5>$1</h5>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// Modal 關閉函數
function closeUsageLimitModal() {
    const modal = document.getElementById('usage-limit-modal');
    if (modal) {
        modal.remove();
    }
}

function handleUpgrade(plan) {
    alert(`升級 ${plan} 功能開發中...`);
    closeUsageLimitModal();
}
