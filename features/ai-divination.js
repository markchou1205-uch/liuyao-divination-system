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
// 修改這個函數，從直接調用 Google AI 改為調用自己的後端
async callAIAPI(guaData, questionType) {
    try {
        const aiGuaData = extractAIGuaData(questionType, guaData.customQuestion);
        if (!aiGuaData) {
            throw new Error('無法提取解卦數據');
        }
        const prompt = generateAIPrompt(aiGuaData);
        console.log('生成的 AI Prompt:', prompt);
        
        const response = await fetch('/api/ai-divination.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        console.log('API 回應狀態:', response.status);
        console.log('API 回應 headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('錯誤回應內容:', errorText);
            throw new Error(`API 錯誤: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API 成功回應:', data);
        return data.interpretation;

    } catch (error) {
        console.error('完整錯誤資訊:', error);
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
                <span class="option-price">免費</span>
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
    
    try {
        submitBtn.textContent = '準備發送郵件...';
        
        const hexagramData = extractHexagramData();
        const hexagramCodes = extractHexagramCodesMain();
        const formattedHexagramData = formatHexagramDataForEmail(hexagramData);
        const formattedHexagramCodes = formatHexagramCodes(hexagramCodes);
        console.log('提取結果:', {
            hexagramData: hexagramData,
            hexagramCodes: hexagramCodes
        });
        // 不包含圖片，避免超過 50KB 限制
        const emailParams = {
            to_name: '馬克老師',
            from_name: '六爻網站系統',
            user_email: email,
            question_type: aiDivination.getQuestionText(questionType),
            question: question,
            hexagram_data: formattedHexagramData,
            hexagram_codes: formattedHexagramCodes,
            timestamp: new Date().toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        console.log('EmailJS 參數 (不含圖片):', emailParams);
        
        // 檢查參數總大小
        const paramsSize = JSON.stringify(emailParams).length;
        console.log('參數大小:', Math.round(paramsSize / 1024), 'KB');
        
        if (paramsSize > 50000) { // 50KB
            throw new Error('參數過大，超過 EmailJS 限制');
        }
        
        submitBtn.textContent = '發送郵件中...';
        
        const result = await emailjs.send(
            'service_h23ly0m',
            'template_fc17e8f', 
            emailParams
        );
        
        console.log('郵件發送成功:', result);
        
        // 嘗試在背景產生截圖並儲存到本地
        try {
            submitBtn.textContent = '產生卦表截圖中...';
            
            if (!window.html2canvas) {
                await loadHtml2Canvas();
            }
            
            const hexagramImage = await captureHexagramTable();
            console.log('截圖成功，儲存到本地記錄');
            
            saveToLocalStorage({
                id: Date.now().toString(),
                ...emailParams,
                status: 'sent',
                emailResult: result,
                hasImage: true,
                imageData: hexagramImage // 本地儲存圖片
            });
            
        } catch (screenshotError) {
            console.warn('截圖失敗:', screenshotError);
            
            saveToLocalStorage({
                id: Date.now().toString(),
                ...emailParams,
                status: 'sent',
                emailResult: result,
                hasImage: false
            });
        }
        
        closeMasterDivinationModal();
        showSuccessModal(email, false); // 暫時顯示無圖片版本
        
    } catch (error) {
        console.error('整體流程失敗:', error);
        
        // 修正錯誤處理
        let errorMessage = '系統忙碌中，請稍後再試';
        
        if (error && error.text) {
            if (error.text.includes('Variables size limit')) {
                errorMessage = '資料過大，請簡化問題描述';
            } else {
                errorMessage = 'EmailJS 錯誤: ' + error.text;
            }
        } else if (error && error.message) {
            if (error.message.includes('參數過大')) {
                errorMessage = '資料過大，請簡化問題描述';
            } else {
                errorMessage = error.message;
            }
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

// 成功提示模組
function showSuccessModal(email, hasImage) {
    const imageStatus = hasImage ? 
        '<li>卦表截圖已一併送出，便於老師解卦</li>' : 
        '<li>卦表截圖失敗，但卦象數據已完整送出</li>';
    
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
                        ${imageStatus}
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

// 格式化卦象資料為郵件友善格式
function formatHexagramDataForEmail(data, questionType) {
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
    
    let formatted = `
主卦：${data.mainGuaName || '未知'}
變卦：${data.changeGuaName || '無變卦'}

起卦時間：
年支：${data.yearBranch || '未知'}
月支：${data.monthBranch || '未知'}
日支：${data.dayBranch || '未知'}
時支：${data.hourBranch || '未知'}

取用神：${yongshen}`;

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

// 更新主要提取函數
function extractHexagramCodesMain() {
    // 使用新的卦名推算方法
    return extractHexagramCodesByName();
}

// 格式化六爻代碼為郵件內容
function formatHexagramCodes(codes) {
    if (!codes || codes.length !== 6) {
        return '六爻代碼提取失敗';
    }
    
    const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    const codeDescriptions = {
        1: '陽爻（靜）',
        2: '陰爻（靜）', 
        3: '陽爻（動）',
        0: '陰爻（動）'
    };
    
    let formatted = '六爻代碼（從初爻到上爻）：\n';
    formatted += codes.join(', ') + '\n\n';
    formatted += '詳細說明：\n';
    
    codes.forEach((code, index) => {
        formatted += `${yaoNames[index]}：${code} (${codeDescriptions[code]})\n`;
    });
    
    return formatted;
}
// 用卦名推算六爻代碼的函數
function extractHexagramCodesByName() {
    console.log('=== 使用卦名推算六爻代碼 ===');
    
    try {
        // 獲取本卦和變卦名稱
        const mainGuaName = getMainGuaName();
        const changeGuaName = getChangeGuaName();
        
        console.log('本卦:', mainGuaName);
        console.log('變卦:', changeGuaName);
        
        if (!mainGuaName) {
            console.error('找不到本卦名稱');
            return null;
        }
        
        // 從常數中找到對應的二進制代碼
        const mainGuaCode = findGuaCodeByName(mainGuaName);
        if (!mainGuaCode) {
            console.error('找不到本卦的二進制代碼:', mainGuaName);
            return null;
        }
        
        console.log('本卦二進制:', mainGuaCode);
        
        // 如果沒有變卦，所有爻都是靜爻
        if (!changeGuaName || changeGuaName === '') {
            const staticCodes = mainGuaCode.split('').map(bit => bit === '1' ? 1 : 2);
            console.log('無變卦，所有爻為靜爻:', staticCodes);
            return staticCodes;
        }
        
        // 有變卦，找變卦的二進制代碼
        const changeGuaCode = findGuaCodeByName(changeGuaName);
        if (!changeGuaCode) {
            console.error('找不到變卦的二進制代碼:', changeGuaName);
            return null;
        }
        
        console.log('變卦二進制:', changeGuaCode);
        
        // 比較本卦和變卦，推算六爻代碼
        const yaoCodesArray = [];
        for (let i = 0; i < 6; i++) {
            const mainBit = mainGuaCode[i];
            const changeBit = changeGuaCode[i];
            
            let code;
            if (mainBit === '0' && changeBit === '0') {
                code = 2; // 陰爻（靜）
            } else if (mainBit === '0' && changeBit === '1') {
                code = 0; // 老陰（陰變陽）
            } else if (mainBit === '1' && changeBit === '0') {
                code = 3; // 老陽（陽變陰）
            } else { // mainBit === '1' && changeBit === '1'
                code = 1; // 陽爻（靜）
            }
            
            yaoCodesArray.push(code);
            console.log(`第${i+1}爻: ${mainBit}變${changeBit} = ${code}`);
        }
        
        console.log('最終六爻代碼 (初爻到上爻):', yaoCodesArray);
        return yaoCodesArray;
        
    } catch (error) {
        console.error('用卦名推算六爻代碼失敗:', error);
        return null;
    }
}

// 根據卦名找到二進制代碼
function findGuaCodeByName(guaName) {
const GUA_64_SIMPLE = {
    '111111': { name: '乾為天', palace: '乾', wuxing: '金', type: '八純卦', shi: 6, ying: 3, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '011111': { name: '天風姤', palace: '乾', wuxing: '金', type: '一世卦', shi: 1, ying: 4, dizhi: ['丑土', '亥水', '酉金', '午火', '申金', '戌土'] },
    '001111': { name: '天山遯', palace: '乾', wuxing: '金', type: '二世卦', shi: 2, ying: 5, dizhi: ['辰土', '午火', '申金', '午火', '申金', '戌土'] },
    '000111': { name: '天地否', palace: '乾', wuxing: '金', type: '三世卦', shi: 3, ying: 6, dizhi: ['未土', '巳火', '卯木', '午火', '申金', '戌土'] },
    '000011': { name: '風地觀', palace: '乾', wuxing: '金', type: '四世卦', shi: 4, ying: 1, dizhi: ['未土', '巳火', '卯木', '亥水', '酉金', '未土'] },
    '000001': { name: '山地剝', palace: '乾', wuxing: '金', type: '五世卦', shi: 5, ying: 2, dizhi: ['未土', '巳火', '卯木', '戌土', '子水', '寅木'] },
    '000101': { name: '火地晉', palace: '乾', wuxing: '金', type: '游魂卦', shi: 4, ying: 1, dizhi: ['未土', '巳火', '卯木', '酉金', '未土', '巳火'] },
    '111101': { name: '火天大有', palace: '乾', wuxing: '金', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['卯木', '丑土', '亥水', '午火', '申金', '戌土'] },

    // 兌宮八卦（五行屬金）
    '110110': { name: '兌為澤', palace: '兌', wuxing: '金', type: '八純卦', shi: 6, ying: 3, dizhi: ['巳火', '卯木', '丑土', '亥水', '酉金', '未土'] },
    '010110': { name: '澤水困', palace: '兌', wuxing: '金', type: '一世卦', shi: 1, ying: 4, dizhi: ['寅木', '辰土', '午火', '亥水', '酉金', '未土'] },
    '000110': { name: '澤地萃', palace: '兌', wuxing: '金', type: '二世卦', shi: 2, ying: 5, dizhi: ['未土', '巳火', '卯木', '亥水', '酉金', '未土'] },
    '001110': { name: '澤山咸', palace: '兌', wuxing: '金', type: '三世卦', shi: 3, ying: 6, dizhi: ['辰土', '午火', '申金', '亥水', '酉金', '未土'] },
    '001010': { name: '水山蹇', palace: '兌', wuxing: '金', type: '四世卦', shi: 4, ying: 1, dizhi: ['辰土', '午火', '申金', '申金', '戌土', '子水'] },
    '001000': { name: '地山謙', palace: '兌', wuxing: '金', type: '五世卦', shi: 5, ying: 2, dizhi: ['未土', '巳火', '卯木', '戌土', '子水', '寅木'] },
    '001100': { name: '雷山小過', palace: '兌', wuxing: '金', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '戌土', '子水', '寅木'] },
    '110100': { name: '雷澤歸妹', palace: '兌', wuxing: '金', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['卯木', '丑土', '亥水', '亥水', '酉金', '未土'] },

    // 離宮八卦（五行屬火）
    '101101': { name: '離為火', palace: '離', wuxing: '火', type: '八純卦', shi: 6, ying: 3, dizhi: ['卯木', '丑土', '亥水', '酉金', '未土', '巳火'] },
    '001101': { name: '火山旅', palace: '離', wuxing: '火', type: '一世卦', shi: 1, ying: 4, dizhi: ['辰土', '午火', '申金', '酉金', '未土', '巳火'] },
    '011101': { name: '火風鼎', palace: '離', wuxing: '火', type: '二世卦', shi: 2, ying: 5, dizhi: ['丑土', '亥水', '酉金', '酉金', '未土', '巳火'] },
    '010101': { name: '火水未濟', palace: '離', wuxing: '火', type: '三世卦', shi: 3, ying: 6, dizhi: ['寅木', '辰土', '午火', '酉金', '未土', '巳火'] },
    '010001': { name: '山水蒙', palace: '離', wuxing: '火', type: '四世卦', shi: 4, ying: 1, dizhi: ['寅木', '辰土', '午火', '戌土', '子水', '寅木'] },
    '010011': { name: '風水渙', palace: '離', wuxing: '火', type: '五世卦', shi: 5, ying: 2, dizhi: ['寅木', '辰土', '午火', '未土', '巳火', '卯木'] },
    '010111': { name: '天水訟', palace: '離', wuxing: '火', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '申金', '戌土', '子水'] },
    '101111': { name: '天火同人', palace: '離', wuxing: '火', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '酉金', '未土', '巳火'] },

    // 震宮八卦（五行屬木）- 按您提供的卦序
    '100100': { name: '震為雷', palace: '震', wuxing: '木', type: '八純卦', shi: 6, ying: 3, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '000100': { name: '雷地豫', palace: '震', wuxing: '木', type: '一世卦', shi: 1, ying: 4, dizhi: ['未土', '巳火', '卯木', '午火', '申金', '戌土'] },
    '010100': { name: '雷水解', palace: '震', wuxing: '木', type: '二世卦', shi: 2, ying: 5, dizhi: ['寅木', '辰土', '午火', '午火', '申金', '戌土'] },
    '011100': { name: '雷風恒', palace: '震', wuxing: '木', type: '三世卦', shi: 3, ying: 6, dizhi: ['丑土', '亥水', '酉金', '午火', '申金', '戌土'] },
    '011000': { name: '地風升', palace: '震', wuxing: '木', type: '四世卦', shi: 4, ying: 1, dizhi: ['丑土', '亥水', '酉金', '丑土', '亥水', '酉金'] },
    '011010': { name: '水風井', palace: '震', wuxing: '木', type: '五世卦', shi: 5, ying: 2, dizhi: ['丑土', '亥水', '酉金', '申金', '戌土', '子水'] },
    '011110': { name: '澤風大過', palace: '震', wuxing: '木', type: '游魂卦', shi: 4, ying: 1, dizhi: ['巳火', '卯木', '丑土', '未土', '巳火', '卯木'] },
    '100110': { name: '澤雷隨', palace: '震', wuxing: '木', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '亥水', '酉金', '未土'] },

    // 巽宮八卦（五行屬木）
    '011011': { name: '巽為風', palace: '巽', wuxing: '木', type: '八純卦', shi: 6, ying: 3, dizhi: ['丑土', '亥水', '酉金', '未土', '巳火', '卯木'] },
    '111011': { name: '風天小畜', palace: '巽', wuxing: '木', type: '一世卦', shi: 1, ying: 4, dizhi: ['子水', '寅木', '辰土', '未土', '巳火', '卯木'] },
    '101011': { name: '風火家人', palace: '巽', wuxing: '木', type: '二世卦', shi: 2, ying: 5, dizhi: ['卯木', '丑土', '亥水', '未土', '巳火', '卯木'] },
    '100011': { name: '風雷益', palace: '巽', wuxing: '木', type: '三世卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '未土', '巳火', '卯木'] },
    '100111': { name: '天雷無妄', palace: '巽', wuxing: '木', type: '四世卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '100101': { name: '火雷噬嗑', palace: '巽', wuxing: '木', type: '五世卦', shi: 5, ying: 2, dizhi: ['子水', '寅木', '辰土', '酉金', '未土', '巳火'] },
    '100001': { name: '山雷頤', palace: '巽', wuxing: '木', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '戌土', '子水', '寅木'] },
    '011001': { name: '山風蠱', palace: '巽', wuxing: '木', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['丑土', '亥水', '酉金', '戌土', '子水', '寅木'] },

    // 坎宮八卦（五行屬水）  <-- 補齊
    '010010': { name: '坎為水', palace: '坎', wuxing: '水', type: '八純卦', shi: 6, ying: 3, dizhi: ['寅木', '辰土', '午火', '申金', '戌土', '子水'] },
    '110010': { name: '水澤節', palace: '坎', wuxing: '水', type: '一世卦', shi: 1, ying: 4, dizhi: ['巳火', '卯木', '丑土', '申金', '戌土', '子水'] },
    '100010': { name: '水雷屯', palace: '坎', wuxing: '水', type: '二世卦', shi: 2, ying: 5, dizhi: ['子水', '寅木', '辰土',  '申金', '戌土', '子水'] },
    '101010': { name: '水火既齊', palace: '坎', wuxing: '水', type: '三世卦', shi: 3, ying: 6, dizhi: ['卯木', '丑土', '亥水', '申金', '戌土', '子水'] },
    '101110': { name: '澤火革', palace: '坎', wuxing: '水', type: '四世卦', shi: 4, ying: 1, dizhi: ['卯木', '丑土', '亥水','亥水',  '酉金', '未土'] },
    '101100': { name: '雷火豐', palace: '坎', wuxing: '水', type: '五世卦', shi: 5, ying: 2, dizhi: ['卯木', '丑土', '亥水', '午火', '申金', '戌土'] },
    '101000': { name: '地火明夷', palace: '坎', wuxing: '水', type: '游魂卦', shi: 4, ying: 1, dizhi: ['卯木', '丑土', '亥水', '丑土', '亥水', '酉金'] },
    '010000': { name: '地水師', palace: '坎', wuxing: '水', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['寅木', '辰土', '午火', '丑土', '亥水', '酉金'] },

    // 艮宮八卦（五行屬土）  <-- 補齊
    '001001': { name: '艮為山', palace: '艮', wuxing: '土', type: '八純卦', shi: 6, ying: 3, dizhi: ['辰土', '午火', '申金', '戌土', '子水', '寅木'] },
    '101001': { name: '山火賁', palace: '艮', wuxing: '土', type: '一世卦', shi: 1, ying: 4, dizhi: ['卯木', '丑土', '亥水', '戌土', '子水', '寅木'] },
    '111001': { name: '山天大畜', palace: '艮', wuxing: '土', type: '二世卦', shi: 2, ying: 5, dizhi: ['子水', '', '寅木', '辰土', '戌土', '子水', '寅木'] },
    '110001': { name: '山澤損', palace: '艮', wuxing: '土', type: '三世卦', shi: 3, ying: 6, dizhi: ['巳火', '卯木', '丑土', '戌土', '子水', '寅木'] },
    '110101': { name: '火澤暌', palace: '艮', wuxing: '土', type: '四世卦', shi: 4, ying: 1, dizhi: ['巳火', '卯木', '丑土', '酉金', '未土', '巳火'] },
    '110111': { name: '天澤覆', palace: '艮', wuxing: '土', type: '五世卦', shi: 5, ying: 2, dizhi: ['巳火', '卯木', '丑土', '午火', '申金', '戌土'] },
    '110011': { name: '風澤中孚', palace: '艮', wuxing: '土', type: '游魂卦', shi: 4, ying: 1, dizhi: ['巳火', '卯木', '丑土', '未土', '巳火', '卯木'] },
    '001011': { name: '風山漸', palace: '艮', wuxing: '土', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['辰土', '午火', '申金', '未土', '巳火', '卯木'] },

    // 坤宮八卦（五行屬土）
    '000000': { name: '坤為地', palace: '坤', wuxing: '土', type: '八純卦', shi: 6, ying: 3, dizhi: ['未土', '巳火', '卯木', '丑土', '亥水', '酉金'] },
    '100000': { name: '地雷復', palace: '坤', wuxing: '土', type: '一世卦', shi: 1, ying: 4, dizhi: ['子水', '寅木', '辰土', '丑土', '亥水', '酉金'] },
    '110000': { name: '地澤臨', palace: '坤', wuxing: '土', type: '二世卦', shi: 2, ying: 5, dizhi: ['巳火', '卯木', '丑土', '丑土', '亥水', '酉金'] },
    '111000': { name: '地天泰', palace: '坤', wuxing: '土', type: '三世卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '丑土', '亥水', '酉金'] },
    '111100': { name: '雷天大壯', palace: '坤', wuxing: '土', type: '四世卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '111110': { name: '澤天夬', palace: '坤', wuxing: '土', type: '五世卦', shi: 5, ying: 2, dizhi: ['子水', '寅木', '辰土', '亥水', '酉金', '未土'] },
    '111010': { name: '水天需', palace: '坤', wuxing: '土', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '申金', '戌土', '子水'] },
    '000010': { name: '水地比', palace: '坤', wuxing: '土', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['未土', '巳火', '卯木', '申金', '戌土', '子水'] }
};
    for (const [binaryCode, guaInfo] of Object.entries(GUA_64_SIMPLE)) {
        if (guaInfo.name === guaName) {
            return binaryCode;
        }
    }
    
    return null;
}
