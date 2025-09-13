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
    const customQuestion = guaData.customQuestion;

    // 構建詳細的卦象資訊
    let prompt = `你是專業的六爻卦師，請根據以下卦象資訊提供解卦分析：

問題類型：${questionText}
${customQuestion ? `具體問題：${customQuestion}` : ''}
主卦：${guaData.mainGuaName || '未知'}
變卦：${guaData.changeGuaName || '無變卦'}
取用神：${yongshen}
起卦時間：月支${guaData.monthBranch || '未知'}、日支${guaData.dayBranch || '未知'}、時支${guaData.hourBranch || '未知'}

請按照專業六爻分析法進行判斷：

【第一步：用神分析】
1. 確認用神是否為動爻？如是動爻，分析其力量強弱（F欄數據）
2. 動變後用神是變強還是變弱？（參考J欄數據）
3. 分析日月對用神的生克關係（參考F欄數據）

【第二步：元神忌神分析】
1. 元神、忌神是否為動爻？如是動爻，力量如何？
2. 元神幫扶用神的力量 vs 忌神克害用神的力量，何者較強？

【第三步：伏神分析（如用神不現）】
1. 日月對伏神是生扶還是克害？
2. 飛神（伏神所在爻的地支）對伏神是生扶還是克害？

【第四步：綜合判斷】
基於以上分析，判斷用神的旺衰強弱，進而判斷吉凶。

請提供以下分析（總字數控制在${this.maxWords}字以內）：

1. 用神旺衰分析（80字內）
2. 元神忌神力量對比（70字內）
3. 日月生克影響（50字內）
4. 吉凶判斷與建議（100字內）

回覆格式：
【用神旺衰】...
【元忌對比】...
【日月影響】...
【吉凶判斷】...

注意：請根據六爻專業理論進行客觀分析，總字數控制在${this.maxWords}字以內。`;

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
    
    const optionsHTML = `
        <div class="interpretation-options">
            <h4>請選擇解卦方式：</h4>
            
            <div class="option-card basic-option" onclick="generateBasicInterpretation('${questionType}')">
                <h5>📋 基礎解卦</h5>
                <p>根據傳統六爻理論提供基本解釋</p>
                <span class="option-price">免費</span>
            </div>
            
            <div class="option-card ai-option" onclick="showAIQuestionModal('${questionType}')">
                <h5>🤖 AI 智能解卦</h5>
                <p>結合 AI 技術提供個性化深度分析</p>
                <span class="option-price">免費 AI 智能解卦</span>
            </div>
            
            <div class="option-card master-option" onclick="showMasterDivinationModal('${questionType}')">
                <h5>👨‍🏫 卦師親自解卦</h5>
                <p>由專業卦師提供完整深度解析</p>
                <span class="option-price">NT$ 300</span>
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = optionsHTML;
}
function showAIQuestionModal(questionType) {
    const modalHTML = `
        <div id="ai-question-modal" class="modal" style="display: flex;">
            <div class="modal-content">
                <span class="close-btn" onclick="closeAIQuestionModal()">&times;</span>
                <h3>AI 智能解卦</h3>
                <div class="ai-question-form">
                    <label for="ai-custom-question">您想問的具體問題：</label>
                    <textarea id="ai-custom-question" 
                             placeholder="請詳細描述您想問的問題...（建議100-200字）" 
                             rows="4" 
                             maxlength="300"></textarea>
                    <div class="char-counter">
                        <span id="char-count">0</span>/300 字
                    </div>
                    
                    <div class="ai-notice">
                        <h4>注意事項：</h4>
                        <p>• 每日限問卦 1 次</p>
                        <p>• 問題寫得愈清楚，解卦結果也會更明確</p>
                    </div>
                    
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" onclick="closeAIQuestionModal()">取消</button>
                        <button class="btn btn-primary" onclick="confirmAIInterpretation('${questionType}')">開始 AI 解卦</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 移除現有 modal
    const existingModal = document.getElementById('ai-question-modal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 字數計算
    const textarea = document.getElementById('ai-custom-question');
    const charCount = document.getElementById('char-count');
    
    textarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}
function closeAIQuestionModal() {
    const modal = document.getElementById('ai-question-modal');
    if (modal) modal.remove();
}
function confirmAIInterpretation(questionType) {
    const customQuestion = document.getElementById('ai-custom-question').value.trim();
    
    if (!customQuestion) {
        alert('請輸入您想問的問題');
        return;
    }
    
    // 檢查使用次數
    if (!aiDivination.canUseAIDivination()) {
        aiDivination.showUsageLimitModal();
        return;
    }
    
    closeAIQuestionModal();
    generateAIInterpretation(questionType, customQuestion);
}
// 提取六爻分析所需的所有資料
function extractHexagramData() {
    console.log('=== 開始提取六爻資料 ===');
    
    const data = {
        // 基本資訊
        mainGuaName: getMainGuaName(),
        changeGuaName: getChangeGuaName(),
        
        // 農曆干支資訊
        yearBranch: null,
        monthBranch: null, 
        dayBranch: null,
        hourBranch: null,
        
        // 用神資訊
        yongshen: {
            exists: false,
            isMoving: false,
            strength: null, // F欄
            changeEffect: null // J欄
        },
        
        // 元神資訊
        yuanshen: {
            exists: false,
            isMoving: false,
            strength: null,
            changeEffect: null
        },
        
        // 忌神資訊
        jishen: {
            exists: false,
            isMoving: false,
            strength: null,
            changeEffect: null
        },
        
        // 伏神資訊
        fushen: {
            exists: false,
            position: null, // 在哪一爻
            element: null, // 地支五行
            flyingGodElement: null // 飛神(該爻地支)
        }
    };
    
    try {
        console.log('初始資料結構:', data);
        
        // 提取農曆干支
        extractGanzhiData(data);
        console.log('提取干支後:', {
            年支: data.yearBranch,
            月支: data.monthBranch,
            日支: data.dayBranch,
            時支: data.hourBranch
        });
        
        // 提取用神、元神、忌神資料
        extractShenData(data);
        console.log('提取神煞後:', {
            用神: data.yongshen,
            元神: data.yuanshen,
            忌神: data.jishen
        });
        
        // 檢查是否有伏神
        checkFushen(data);
        console.log('檢查伏神後:', data.fushen);
        
        console.log('=== 最終提取的六爻資料 ===', data);
        return data;
        
    } catch (error) {
        console.error('提取六爻資料錯誤:', error);
        return data;
    }
}

// 提取農曆干支資料
function extractGanzhiData(data) {
    console.log('--- 開始提取干支資料 ---');
    
    const tables = document.querySelectorAll('table');
    console.log('找到表格數量:', tables.length);
    
    tables.forEach((table, tableIndex) => {
        console.log(`檢查第 ${tableIndex + 1} 個表格`);
        
        const rows = table.querySelectorAll('tr');
        console.log(`表格 ${tableIndex + 1} 有 ${rows.length} 列`);
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td, th');
            
            for (let j = 0; j < cells.length; j++) {
                const cellText = cells[j].textContent.trim();
                
                // 找到年、月、日、時，取下一列的資料
                if (cellText === '年' && i + 1 < rows.length) {
                    const nextRowCells = rows[i + 1].querySelectorAll('td, th');
                    if (nextRowCells[j]) {
                        data.yearBranch = nextRowCells[j].textContent.trim();
                        console.log(`找到年支: ${data.yearBranch} (位置: 表${tableIndex + 1}, 列${i + 2}, 欄${j + 1})`);
                    }
                }
                if (cellText === '月' && i + 1 < rows.length) {
                    const nextRowCells = rows[i + 1].querySelectorAll('td, th');
                    if (nextRowCells[j]) {
                        data.monthBranch = nextRowCells[j].textContent.trim();
                        console.log(`找到月支: ${data.monthBranch} (位置: 表${tableIndex + 1}, 列${i + 2}, 欄${j + 1})`);
                    }
                }
                if (cellText === '日' && i + 1 < rows.length) {
                    const nextRowCells = rows[i + 1].querySelectorAll('td, th');
                    if (nextRowCells[j]) {
                        data.dayBranch = nextRowCells[j].textContent.trim();
                        console.log(`找到日支: ${data.dayBranch} (位置: 表${tableIndex + 1}, 列${i + 2}, 欄${j + 1})`);
                    }
                }
                if (cellText === '時' && i + 1 < rows.length) {
                    const nextRowCells = rows[i + 1].querySelectorAll('td, th');
                    if (nextRowCells[j]) {
                        data.hourBranch = nextRowCells[j].textContent.trim();
                        console.log(`找到時支: ${data.hourBranch} (位置: 表${tableIndex + 1}, 列${i + 2}, 欄${j + 1})`);
                    }
                }
            }
        }
    });
}

// 提取用神、元神、忌神資料
function extractShenData(data) {
    console.log('--- 開始提取神煞資料 ---');
    
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table, tableIndex) => {
        console.log(`檢查第 ${tableIndex + 1} 個表格中的神煞`);
        
        const rows = table.querySelectorAll('tr');
        
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td, th');
            
            cells.forEach((cell, cellIndex) => {
                const cellText = cell.textContent.trim();
                
                // 尋找"用"、"元"、"忌"
                if (cellText === '用') {
                    console.log(`找到用神 (位置: 表${tableIndex + 1}, 列${rowIndex + 1}, 欄${cellIndex + 1})`);
                    data.yongshen.exists = true;
                    extractShenDetails(data.yongshen, cells, cellIndex, '用神');
                }
                if (cellText === '元') {
                    console.log(`找到元神 (位置: 表${tableIndex + 1}, 列${rowIndex + 1}, 欄${cellIndex + 1})`);
                    data.yuanshen.exists = true;
                    extractShenDetails(data.yuanshen, cells, cellIndex, '元神');
                }
                if (cellText === '忌') {
                    console.log(`找到忌神 (位置: 表${tableIndex + 1}, 列${rowIndex + 1}, 欄${cellIndex + 1})`);
                    data.jishen.exists = true;
                    extractShenDetails(data.jishen, cells, cellIndex, '忌神');
                }
            });
        });
    });
}

// 提取神煞的詳細資料（F欄、J欄）
function extractShenDetails(shenObj, cells, index, shenName) {
    console.log(`--- 提取 ${shenName} 詳細資料 ---`);
    
    // F欄 (右邊1欄)
    if (cells[index + 1]) {
        const fColumnText = cells[index + 1].textContent.trim();
        if (fColumnText && fColumnText !== '') {
            shenObj.strength = fColumnText;
            console.log(`${shenName} F欄 (強度): ${fColumnText}`);
        }
    }
    
    // 檢查是否為動爻
    const cell = cells[index];
    if (cell) {
        // 檢查各種可能的動爻標記
        const computedStyle = window.getComputedStyle(cell);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        console.log(`${shenName} 樣式檢查:`, {
            backgroundColor: backgroundColor,
            color: color,
            classList: Array.from(cell.classList),
            innerHTML: cell.innerHTML
        });
        
        // 檢查是否有紅色標記（動爻通常用紅色）
        const hasRedBackground = backgroundColor.includes('rgb(255') || // red variants
                                backgroundColor.includes('red') || 
                                cell.classList.contains('red') ||
                                cell.querySelector('.red') ||
                                cell.innerHTML.includes('style="color: red"') ||
                                cell.innerHTML.includes('color:red');
        
        if (hasRedBackground) {
            shenObj.isMoving = true;
            console.log(`${shenName} 確認為動爻`);
            
            // 如果是動爻，尋找J欄資料
            console.log('搜尋J欄資料...');
            for (let i = index + 2; i < Math.min(cells.length, index + 6); i++) {
                const jColumnText = cells[i].textContent.trim();
                console.log(`檢查位置 ${i}: "${jColumnText}"`);
                if (jColumnText && jColumnText !== '' && jColumnText !== shenObj.strength) {
                    shenObj.changeEffect = jColumnText;
                    console.log(`${shenName} J欄 (變化效果): ${jColumnText}`);
                    break;
                }
            }
        } else {
            console.log(`${shenName} 不是動爻`);
        }
    }
    
    console.log(`${shenName} 最終資料:`, shenObj);
}

// 檢查伏神
function checkFushen(data) {
    console.log('--- 檢查伏神 ---');
    
    // 如果沒有找到用神，則可能是伏神
    if (!data.yongshen.exists) {
        console.log('未找到用神，開始搜尋伏神...');
        
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table, tableIndex) => {
            const rows = table.querySelectorAll('tr');
            
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td, th');
                
                cells.forEach((cell, cellIndex) => {
                    const cellText = cell.textContent.trim();
                    
                    // 尋找B欄有文字的格子（可能包含伏神標記）
                    if (cellText && cellText.length > 0 && rowIndex + 1 < rows.length) {
                        console.log(`檢查可能的伏神位置: "${cellText}" (表${tableIndex + 1}, 列${rowIndex + 1}, 欄${cellIndex + 1})`);
                        
                        const nextRow = rows[rowIndex + 1];
                        const nextRowCells = nextRow.querySelectorAll('td, th');
                        
                        if (nextRowCells[cellIndex]) {
                            const elementText = nextRowCells[cellIndex].textContent.trim();
                            console.log(`下一列對應位置文字: "${elementText}"`);
                            
                            if (elementText && ['金', '木', '水', '火', '土'].some(element => elementText.includes(element))) {
                                data.fushen.exists = true;
                                data.fushen.position = cellText;
                                data.fushen.element = elementText;
                                data.fushen.flyingGodElement = elementText;
                                
                                console.log('找到伏神:', {
                                    位置: cellText,
                                    五行: elementText,
                                    飛神: elementText
                                });
                                return; // 找到就結束
                            }
                        }
                    }
                });
            });
        });
    } else {
        console.log('已找到用神，無需檢查伏神');
    }
}
// 生成基礎解卦（原有功能）
function generateBasicInterpretation(questionType) {
    // 調用原有的 generateInterpretation 函數
    if (typeof generateInterpretation === 'function') {
        generateInterpretation(questionType);
    }
}

// 生成 AI 解卦
async function generateAIInterpretationWithQuestion(questionType, customQuestion) {
    const contentDiv = document.getElementById('simple-interpretation-content');
    
    contentDiv.innerHTML = `
        <div class="loading-interpretation">
            <div class="loading-spinner"></div>
            <div class="loading-text">AI 正在分析卦象...</div>
        </div>
    `;
    
    aiDivination.incrementUsage();
    
    try {
        const hexagramData = extractHexagramData();
        hexagramData.customQuestion = customQuestion;
        
        const aiResponse = await aiDivination.callAIAPI(hexagramData, questionType);
        
        const interpretationHTML = `
            <div class="question-indicator">
                問題類型：${aiDivination.getQuestionText(questionType)}
                <br>具體問題：${customQuestion}
            </div>
            
            <div class="ai-interpretation" id="interpretation-content">
                <h4>🤖 AI 智能解卦</h4>
                <div class="ai-content">
                    ${formatAIResponse(aiResponse)}
                </div>
            </div>
            
            <div class="interpretation-actions">
                <button class="btn btn-download" onclick="downloadInterpretation()">
                    📥 下載解卦結果
                </button>
            </div>
            
            <div class="interpretation-footer-info">
                <small>※ 此為 AI 輔助分析，建議搭配專業卦師諮詢</small>
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
// 4. 下載解卦結果功能
function downloadInterpretation() {
    // 需要先添加 html2canvas 庫
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function() {
        const element = document.getElementById('interpretation-content');
        
        html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `六爻解卦結果_${new Date().toLocaleDateString()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    };
    document.head.appendChild(script);
}
// 5. 卦師解卦 Modal
function showMasterDivinationModal(questionType) {
    const modalHTML = `
        <div id="master-divination-modal" class="modal" style="display: flex;">
            <div class="modal-content large-modal">
                <span class="close-btn" onclick="closeMasterDivinationModal()">&times;</span>
                <h3>👨‍🏫 卦師親自解卦</h3>
                
                <div class="master-divination-form">
                    <div class="form-group">
                        <label for="master-question">您想問的問題：</label>
                        <textarea id="master-question" 
                                 placeholder="請詳細說明您想問的問題..."
                                 rows="4" 
                                 required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="master-email">電子郵件：</label>
                        <input type="email" id="master-email" 
                               placeholder="請輸入您的 Email" 
                               required>
                    </div>
                    
                    <div class="service-terms">
                        <h4>服務說明：</h4>
                        <ul>
                            <li>將由本站站長馬克老師於 24 小時內親自為您解卦，並將解卦結果寄至您的信箱</li>
                            <li>超過 24 小時則全額退費（以寄出的時間為準）</li>
                            <li>若因您的信箱問題導致無法收到解卦結果，請於 24 小時以電子郵件告知站長。逾 24 小時（合計 48 小時）未反應者，則視同已收到批卦結果，不得再要求補寄</li>
                            <li>一旦您確認送出占卦請求，則除了逾時未寄送，則一律不予退費</li>
                        </ul>
                    </div>
                    
                    <div class="price-info">
                        <h4>費用：NT$ 300</h4>
                    </div>
                    
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" onclick="closeMasterDivinationModal()">取消</button>
                        <button class="btn btn-primary" onclick="submitMasterDivinationRequest('${questionType}')">確認送出</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeMasterDivinationModal() {
    const modal = document.getElementById('master-divination-modal');
    if (modal) modal.remove();
}

// 6. 提交卦師解卦請求
async function submitMasterDivinationRequest(questionType) {
    const question = document.getElementById('master-question').value.trim();
    const email = document.getElementById('master-email').value.trim();
    
    if (!question || !email) {
        alert('請填寫完整的問題和電子郵件');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('請輸入正確的電子郵件格式');
        return;
    }
    
    const submitBtn = document.querySelector('#master-divination-modal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '正在產生卦表截圖...';
    
    try {
        // 先載入 html2canvas 庫
        if (!window.html2canvas) {
            await loadHtml2Canvas();
        }
        
        // 產生卦表截圖
        const hexagramImage = await captureHexagramTable();
        
        submitBtn.textContent = '送出中...';
        
        const hexagramData = extractHexagramData();
        const formattedHexagramData = formatHexagramDataForEmail(hexagramData);
        
        const emailParams = {
            user_email: email,
            question_type: aiDivination.getQuestionText(questionType),
            question: question,
            hexagram_data: formattedHexagramData,
            hexagram_image: hexagramImage, // Base64 圖片
            timestamp: new Date().toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        const result = await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            emailParams
        );
        
        console.log('郵件發送成功:', result);
        
        saveToLocalStorage({
            id: Date.now().toString(),
            ...emailParams,
            status: 'sent',
            emailResult: result
        });
        
        closeMasterDivinationModal();
        showSuccessModal(email);
        
    } catch (error) {
        console.error('發送郵件失敗:', error);
        
        let errorMessage = '系統忙碌中，請稍後再試';
        if (error.message.includes('截圖')) {
            errorMessage = '卦表截圖失敗，請重新嘗試';
        } else if (error.status === 422) {
            errorMessage = '郵件格式錯誤，請檢查電子郵件地址';
        }
        
        alert(errorMessage);
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// 載入 html2canvas 庫
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('html2canvas 載入失敗'));
        document.head.appendChild(script);
    });
}

// 截取卦表
async function captureHexagramTable() {
    try {
        // 尋找卦表元素
        const tableElement = document.querySelector('.main-table') || 
                            document.querySelector('table') || 
                            document.querySelector('.hexagram-table');
        
        if (!tableElement) {
            throw new Error('找不到卦表元素');
        }
        
        // 暫時調整樣式以改善截圖效果
        const originalStyle = tableElement.style.cssText;
        tableElement.style.backgroundColor = '#ffffff';
        tableElement.style.padding = '20px';
        tableElement.style.border = '2px solid #333';
        tableElement.style.borderRadius = '8px';
        
        // 確保表格完全顯示
        tableElement.scrollIntoView({ behavior: 'instant', block: 'center' });
        
        // 等待一點時間確保樣式套用
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 截圖
        const canvas = await html2canvas(tableElement, {
            backgroundColor: '#ffffff',
            scale: 2, // 提高解析度
            useCORS: true,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0,
            width: tableElement.offsetWidth,
            height: tableElement.offsetHeight
        });
        
        // 恢復原始樣式
        tableElement.style.cssText = originalStyle;
        
        // 轉換為 Base64
        const base64Image = canvas.toDataURL('image/png', 0.9);
        
        return base64Image;
        
    } catch (error) {
        console.error('卦表截圖失敗:', error);
        throw new Error('卦表截圖失敗: ' + error.message);
    }
}
// 成功提示模組
function showSuccessModal(email) {
    const successModal = `
        <div id="success-modal" class="modal" style="display: flex;">
            <div class="modal-content">
                <h3>申請送出成功！</h3>
                <div class="success-content">
                    <p>您的解卦請求（包含卦表截圖）已經成功送出至馬克老師。</p>
                    <p><strong>請注意：</strong></p>
                    <ul>
                        <li>馬克老師將於 24 小時內親自解卦</li>
                        <li>解卦結果將寄送至：<strong>${email}</strong></li>
                        <li>請留意您的信箱（包含垃圾郵件資料夾）</li>
                        <li>卦表截圖已一併送出，便於老師解卦</li>
                    </ul>
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-primary" onclick="closeSuccessModal()">確認</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successModal);
}
async function generateAIInterpretation(questionType, customQuestion = '') {
    const contentDiv = document.getElementById('simple-interpretation-content');
    
    // 如果沒有傳入 customQuestion，可能是從其他地方呼叫的，顯示問題輸入modal
    if (!customQuestion) {
        showAIQuestionModal(questionType);
        return;
    }
    
    // 其餘保持您已經修改的內容...
    contentDiv.innerHTML = `
        <div class="loading-interpretation">
            <div class="loading-spinner"></div>
            <div class="loading-text">AI 正在分析卦象...</div>
        </div>
    `;
    
    aiDivination.incrementUsage();
    
    try {
        const hexagramData = extractHexagramData();
        hexagramData.customQuestion = customQuestion;
        
        const aiResponse = await aiDivination.callAIAPI(hexagramData, questionType);
        
        const interpretationHTML = `
            <div class="question-indicator">
                問題類型：${aiDivination.getQuestionText(questionType)}
                <br>具體問題：${customQuestion}
            </div>
            
            <div class="ai-interpretation" id="interpretation-content">
                <h4>🤖 AI 智能解卦</h4>
                <div class="ai-content">
                    ${formatAIResponse(aiResponse)}
                </div>
            </div>
            
            <div class="interpretation-actions">
                <button class="btn btn-download" onclick="downloadInterpretation()">
                    📥 下載解卦結果
                </button>
            </div>
            
            <div class="interpretation-footer-info">
                <small>※ 此為 AI 輔助分析，建議搭配專業卦師諮詢</small>
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
// EmailJS 初始化
(function() {
    emailjs.init("TSdwo36GqNZWm259J"); // 從 EmailJS 後台取得
})();

// 修改 submitMasterDivinationRequest 函數
async function submitMasterDivinationRequest(questionType) {
    const question = document.getElementById('master-question').value.trim();
    const email = document.getElementById('master-email').value.trim();
    
    if (!question || !email) {
        alert('請填寫完整的問題和電子郵件');
        return;
    }
    
    // 簡單的 email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('請輸入正確的電子郵件格式');
        return;
    }
    
    // 顯示載入狀態
    const submitBtn = document.querySelector('#master-divination-modal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';
    
    try {
        const hexagramData = extractHexagramData();
        
        // 格式化卦象資料為易讀文字
        const formattedHexagramData = formatHexagramDataForEmail(hexagramData);
        
        const emailParams = {
            user_email: email,
            question_type: aiDivination.getQuestionText(questionType),
            question: question,
            hexagram_data: formattedHexagramData,
            timestamp: new Date().toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // 發送郵件
        const result = await emailjs.send(
            'service_h23ly0m',    // 從 EmailJS 後台取得
            'template_fc17e8f',   // 從 EmailJS 後台取得
            emailParams
        );
        
        console.log('郵件發送成功:', result);
        
        // 儲存到本地記錄（供後台查看）
        saveToLocalStorage({
            id: Date.now().toString(),
            ...emailParams,
            status: 'sent',
            emailResult: result
        });
        
        closeMasterDivinationModal();
        
        // 成功提示
        const successModal = `
            <div id="success-modal" class="modal" style="display: flex;">
                <div class="modal-content">
                    <h3>申請送出成功！</h3>
                    <div class="success-content">
                        <p>您的解卦請求已經成功送出至馬克老師。</p>
                        <p><strong>請注意：</strong></p>
                        <ul>
                            <li>馬克老師將於 24 小時內親自解卦</li>
                            <li>解卦結果將寄送至：<strong>${email}</strong></li>
                            <li>請留意您的信箱（包含垃圾郵件資料夾）</li>
                        </ul>
                    </div>
                    <div class="modal-buttons">
                        <button class="btn btn-primary" onclick="closeSuccessModal()">確認</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successModal);
        
    } catch (error) {
        console.error('發送郵件失敗:', error);
        
        let errorMessage = '系統忙碌中，請稍後再試';
        if (error.status === 422) {
            errorMessage = '郵件格式錯誤，請檢查電子郵件地址';
        } else if (error.status === 400) {
            errorMessage = '請求格式錯誤，請重新填寫表單';
        }
        
        alert(errorMessage);
        
    } finally {
        // 恢復按鈕狀態
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// 格式化卦象資料為郵件友善格式
function formatHexagramDataForEmail(data) {
    let formatted = `
主卦：${data.mainGuaName || '未知'}
變卦：${data.changeGuaName || '無變卦'}

起卦時間：
年支：${data.yearBranch || '未知'}
月支：${data.monthBranch || '未知'}
日支：${data.dayBranch || '未知'}
時支：${data.hourBranch || '未知'}

神煞分析：`;

    if (data.yongshen.exists) {
        formatted += `
用神：存在${data.yongshen.isMoving ? '（動爻）' : '（靜爻）'}
  - 強度：${data.yongshen.strength || '未知'}
  - 變化：${data.yongshen.changeEffect || '無變化'}`;
    } else {
        formatted += `
用神：不現`;
    }

    if (data.yuanshen.exists) {
        formatted += `
元神：存在${data.yuanshen.isMoving ? '（動爻）' : '（靜爻）'}
  - 強度：${data.yuanshen.strength || '未知'}`;
    }

    if (data.jishen.exists) {
        formatted += `
忌神：存在${data.jishen.isMoving ? '（動爻）' : '（靜爻）'}
  - 強度：${data.jishen.strength || '未知'}`;
    }

    if (data.fushen.exists) {
        formatted += `
伏神：${data.fushen.element || '未知'}（伏於${data.fushen.position || '未知'}）`;
    }

    return formatted;
}

// 儲存到本地記錄
function saveToLocalStorage(data) {
    try {
        const requests = JSON.parse(localStorage.getItem('master_divination_requests') || '[]');
        requests.push(data);
        
        // 只保留最近 100 筆記錄
        if (requests.length > 100) {
            requests.splice(0, requests.length - 100);
        }
        
        localStorage.setItem('master_divination_requests', JSON.stringify(requests));
    } catch (error) {
        console.error('儲存本地記錄失敗:', error);
    }
}

// 關閉成功提示
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.remove();
}
