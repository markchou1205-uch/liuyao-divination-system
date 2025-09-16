// 主程式 script.js - 包含起卦功能和基本邏輯

// ==================== 常數定義 ====================

// 八卦常數定義（只保留這些，不重複定義天干地支）
const GuaCode = {
    1: [1, 1, 1], // 乾
    2: [1, 1, 2], // 兌  
    3: [1, 2, 1], // 離
    4: [1, 2, 2], // 震
    5: [2, 1, 1], // 巽
    6: [2, 1, 2], // 坎
    7: [2, 2, 1], // 艮
    8: [2, 2, 2]  // 坤
};

const GuaNames = {
    1: '乾', 2: '兌', 3: '離', 4: '震',
    5: '巽', 6: '坎', 7: '艮', 8: '坤'
};

const DIZHI_NUMBERS = {
    '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
    '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12
};

const WUXING_SHENGKE = {
    '金': { sheng: '水', ke: '木' },
    '水': { sheng: '木', ke: '火' },
    '木': { sheng: '火', ke: '土' },
    '火': { sheng: '土', ke: '金' },
    '土': { sheng: '金', ke: '水' }
};

// 進退神關係
const JINTUISHEN = {
    '亥': '子',
    '寅': '卯', 
    '巳': '午',
    '申': '酉',
    '丑': '辰',
    '辰': '未',
    '未': '戌',
    '戌': '丑'
};

// 五行地支的十二長生關係
const WUXING_CHANGSHENG = {
    '水': { mu: '辰', jue: '巳' },
    '土': { mu: '辰', jue: '巳' },
    '木': { mu: '未', jue: '申' },
    '火': { mu: '戌', jue: '亥' },
    '金': { mu: '丑', jue: '寅' }
};

// 地支的沖合關係
const DIZHI_CHONGHE = {
    '子': { chong: '午', he: '丑' },
    '丑': { chong: '未', he: '子' },
    '寅': { chong: '申', he: '亥' },
    '卯': { chong: '酉', he: '戌' },
    '辰': { chong: '戌', he: '酉' },
    '巳': { chong: '亥', he: '申' },
    '午': { chong: '子', he: '未' },
    '未': { chong: '丑', he: '午' },
    '申': { chong: '寅', he: '巳' },
    '酉': { chong: '卯', he: '辰' },
    '戌': { chong: '辰', he: '卯' },
    '亥': { chong: '巳', he: '寅' }
};


// ==================== 基本功能 ====================

// 計算指定日期的干支
function calculateGanZhiForDate(date) {
    // 檢查 GanZhiCalculator 是否可用
    if (typeof GanZhiCalculator !== 'undefined') {
        return GanZhiCalculator.calculateGanZhi(date);
    } else {
        // 簡化的干支計算（降級處理）
        return {
            year: '乙巳',
            month: '乙酉', 
            day: '己卯',
            time: '甲戌',
            shiChen: '戌時'
        };
    }
}

// 獲取當前時間的干支
function getCurrentGanZhi() {
    const now = new Date();
    return calculateGanZhiForDate(now);
}

// 更新時間顯示
function updateTimeDisplay() {
  
    try {
        // 獲取干支信息
        const ganZhi = getCurrentGanZhi();
        
        // 獲取顯示元素
        const elements = {
            t1: document.getElementById('t1'),
            t2: document.getElementById('t2'), 
            t3: document.getElementById('t3'),
            t4: document.getElementById('t4'),
            k: document.getElementById('k')
        };
        
        // 更新干支顯示
        if (elements.t1) elements.t1.textContent = ganZhi.year || '乙巳';
        if (elements.t2) elements.t2.textContent = ganZhi.month || '乙酉';
        if (elements.t3) elements.t3.textContent = ganZhi.day || '己卯';
        if (elements.t4) elements.t4.textContent = ganZhi.time || '甲戌';
        
        // 處理旬空顯示
        if (elements.k) {
            let xunKong = '';
            
            // 嘗試使用 GuaCalculator 計算旬空
            if (typeof GuaCalculator !== 'undefined' && ganZhi.day) {
                try {
                    xunKong = GuaCalculator.getXunKongDisplay(ganZhi.day);
                } catch (error) {
                    xunKong = '申、酉'; // 降級處理
                }
            } else {
                xunKong = '申、酉'; // 預設值
            }
            
            elements.k.textContent = xunKong;
        }
        
        // 更新五行神煞顯示（暫時使用預設值，等待後續說明）
        updateWuxingDisplay();
        
    } catch (error) {
    }
}

// 更新五行神煞顯示
function updateWuxingDisplay() {
    try {
        // 獲取當前干支數據
        const ganZhi = getCurrentGanZhi();
        
        // 檢查 AdvancedCalculator 是否可用
        if (typeof AdvancedCalculator !== 'undefined') {
            // 計算五行旺衰
            const monthZhi = ganZhi.month.charAt(1);
            const wuxingState = AdvancedCalculator.calculateWuxingState(monthZhi);
           
            // 更新五行旺衰表
            const wuxingElements = {
                w1: document.getElementById('w1'), // 木
                w2: document.getElementById('w2'), // 火
                w3: document.getElementById('w3'), // 土
                w4: document.getElementById('w4'), // 金
                w5: document.getElementById('w5')  // 水
            };
            
            if (wuxingElements.w1) wuxingElements.w1.textContent = wuxingState.wood || '--';
            if (wuxingElements.w2) wuxingElements.w2.textContent = wuxingState.fire || '--';
            if (wuxingElements.w3) wuxingElements.w3.textContent = wuxingState.earth || '--';
            if (wuxingElements.w4) wuxingElements.w4.textContent = wuxingState.metal || '--';
            if (wuxingElements.w5) wuxingElements.w5.textContent = wuxingState.water || '--';
            
            // 計算神煞
            const shensha = AdvancedCalculator.calculateShensha(ganZhi);
           
            // 更新神煞表
            const shenshaElements = {
                o1: document.getElementById('o1'), // 驛馬
                o2: document.getElementById('o2'), // 貴人
                o3: document.getElementById('o3'), // 桃花
                o4: document.getElementById('o4')  // 祿存
            };
            
            if (shenshaElements.o1) shenshaElements.o1.textContent = shensha.yima || '--';
            if (shenshaElements.o2) shenshaElements.o2.textContent = shensha.guiren || '--';
            if (shenshaElements.o3) shenshaElements.o3.textContent = shensha.taohua || '--';
            if (shenshaElements.o4) shenshaElements.o4.textContent = shensha.lucun || '--';
            
        } else {
            // 使用預設值
            const wuxingElements = {
                w1: document.getElementById('w1'),
                w2: document.getElementById('w2'),
                w3: document.getElementById('w3'),
                w4: document.getElementById('w4'),
                w5: document.getElementById('w5'),
                o1: document.getElementById('o1'),
                o2: document.getElementById('o2'),
                o3: document.getElementById('o3'),
                o4: document.getElementById('o4')
            };
            
            Object.values(wuxingElements).forEach(element => {
                if (element) element.textContent = '--';
            });
        }
    } catch (error) {
        // 錯誤處理：設置為預設值
        const allElements = ['w1', 'w2', 'w3', 'w4', 'w5', 'o1', 'o2', 'o3', 'o4'];
        allElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '--';
        });
    }
}

// 用神選擇處理函數
function handleYongshenSelection() {
    const yongshenSelect = document.getElementById('yongshen-method');
    if (!yongshenSelect || !yongshenSelect.value) {
        return;
    }
    
    const selectedYongshen = yongshenSelect.value;
   
    // 清除之前的用神標記
    clearYongshenMarks();
    
    // 根據選擇的用神類型處理
    if (selectedYongshen === 'shi' || selectedYongshen === 'ying') {
        handleShiYingYongshen(selectedYongshen);
    } else {
        handleLiuqinYongshen(selectedYongshen);
    }
}

// 處理世應用神
function handleShiYingYongshen(type) {
  
    // 獲取世應位置數據
    let shiYingData = null;
    
    // 嘗試從不同的起卦結果中獲取世應數據
    if (window.numberGuaResult || window.timeGuaResult) {
        const guaResult = window.numberGuaResult || window.timeGuaResult;
        if (typeof AdvancedCalculator !== 'undefined') {
            const guaNames = AdvancedCalculator.calculateNumberGuaNames(guaResult);
            if (guaNames && guaNames.originalBinary) {
                shiYingData = AdvancedCalculator.calculateShiYing(guaNames.originalBinary);
            }
        }
    } else if (window.dice1 !== undefined) {
        // 六爻起卦或隨機起卦
        const liuyaoResults = [window.dice1, window.dice2, window.dice3, window.dice4, window.dice5, window.dice6];
        if (typeof AdvancedCalculator !== 'undefined') {
            const guaNames = AdvancedCalculator.calculateGuaNames(liuyaoResults);
            if (guaNames && guaNames.originalBinary) {
                shiYingData = AdvancedCalculator.calculateShiYing(guaNames.originalBinary);
            }
        }
    }
    
    if (!shiYingData) {
        alert('無法獲取世應位置數據');
        return;
    }
    
    const targetPosition = type === 'shi' ? shiYingData.shi : shiYingData.ying;
   
    if (targetPosition) {
        markYongshen(targetPosition);
        calculateYuanJishen(targetPosition);
    }
}

// 修正：處理六親用神
function handleLiuqinYongshen(liuqinType) {
    const liuqinMap = {
        'xiongdi': '兄弟',
        'zisun': '子孫',
        'qicai': '妻財',
        'guanGui': '官鬼',
        'fumu': '父母'
    };
    
    const targetLiuqin = liuqinMap[liuqinType];
    const matchedYao = [];
    
    // 搜索六親欄位E1-E6
    const table = document.querySelector('.main-table');
    if (!table) {
        return;
    }
    
    const rows = table.querySelectorAll('tr');
    
    // 修正：更寬鬆的篩選條件，直接找有足夠單元格的行
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length >= 5; // 至少要有5個單元格（包含六親欄位）
    });
    dataRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
        }
    });
    
    let actualDataRows = [];
    dataRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const firstCell = cells[0].textContent.trim();
            const fifthCell = cells[4].textContent.trim();
            
            // 檢查第5列是否包含六親關係（兄弟、父母、子孫、妻財、官鬼）
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(fifthCell)) {
                actualDataRows.push({row, index});
            }
        }
    });
    
    
    actualDataRows.forEach((item, idx) => {
        const { row } = item;
        const cells = row.querySelectorAll('td');
        const yaoPosition = 6 - idx; // 從上到下對應第6爻到第1爻
        const liuqinCell = cells[4]; // E列六親
        
        if (liuqinCell) {
            const cellText = liuqinCell.textContent.trim();
          
            if (cellText === targetLiuqin) {
                matchedYao.push(yaoPosition);
            }
        }
    });
    
    if (matchedYao.length === 1) {
        // 只有一個用神
        markYongshen(matchedYao[0]);
        calculateYuanJishen(matchedYao[0]);
    } else if (matchedYao.length > 1) {
        // 多個用神，顯示選擇modal
        showYongshenSelectionModal(matchedYao, targetLiuqin);
    } else {
        // 用神不現，檢查伏神
        handleHiddenYongshen(targetLiuqin);
    }
}

// 顯示用神選擇modal
function showYongshenSelectionModal(matchedYao, liuqinName) {
    // 創建modal
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'yongshen-selection-modal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 2px solid #333;
        max-width: 400px;
        width: 90%;
        position: relative;
    `;
    
    const yaoOptions = matchedYao.map(yao => {
        const yaoNames = ['', '初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
        return `<option value="${yao}">${yaoNames[yao]}</option>`;
    }).join('');
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px;">用神多現，請擇一爻為用神</h3>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">${liuqinName}用神出現在：</label>
            <select id="yao-selection" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                ${yaoOptions}
            </select>
        </div>
        
        <div style="text-align: center;">
            <button id="confirm-yongshen-selection" style="background: #28a745; color: white; border: none; padding: 12px 25px; border-radius: 4px; margin-right: 10px; cursor: pointer; font-size: 16px;">確定</button>
            <button id="cancel-yongshen-selection" style="background: #6c757d; color: white; border: none; padding: 12px 25px; border-radius: 4px; cursor: pointer; font-size: 16px;">取消</button>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // 添加事件監聽器
    document.getElementById('confirm-yongshen-selection').onclick = function() {
        const selectedYao = parseInt(document.getElementById('yao-selection').value);
        markYongshen(selectedYao);
        calculateYuanJishen(selectedYao);
        closeYongshenModal();
    };
    
    document.getElementById('cancel-yongshen-selection').onclick = function() {
        closeYongshenModal();
    };
    
    modalOverlay.onclick = function(e) {
        if (e.target === modalOverlay) {
            closeYongshenModal();
        }
    };
}

// 關閉用神選擇modal
function closeYongshenModal() {
    const modal = document.getElementById('yongshen-selection-modal');
    if (modal) {
        modal.remove();
    }
}

// 處理伏神用神
function handleHiddenYongshen(targetLiuqin) {

    // 檢查日月地支
    const ganZhi = getCurrentGanZhi();
    const dayZhi = ganZhi.day.charAt(1);
    const monthZhi = ganZhi.month.charAt(1);
    alert('用神伏藏不現');
}

// 標記用神
function markYongshen(yaoPosition) {
    const table = document.querySelector('.main-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length >= 5;
    });
    
    let actualDataRows = [];
    dataRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const fifthCell = cells[4].textContent.trim();
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(fifthCell)) {
                actualDataRows.push(row);
            }
        }
    });
    
    actualDataRows.forEach((row, index) => {
        const tableYaoPosition = 6 - index; // 從上到下對應第6爻到第1爻
        
        if (tableYaoPosition === yaoPosition) {
            const cells = row.querySelectorAll('td');
            const liuqinCell = cells[4]; // E列六親
            
            if (liuqinCell) {
                // 改善的標記方式：保持文字居中對齊，用神標記放在右上角
                const originalText = liuqinCell.textContent.trim();
                liuqinCell.innerHTML = `
                    <div style="position: relative; text-align: center; display: inline-block; width: 100%;">
                        ${originalText}
                        <span style="position: absolute; top: -5px; right: -5px; color: #28a745; font-weight: bold; font-size: 14px;">用</span>
                    </div>
                `;
            }
        }
    });
}

// 計算元神忌神
// 修正：計算元神忌神 - 修正六親關係表
function calculateYuanJishen(yongshenPosition) {
   
    // 獲取用神的六親
    const yongshenLiuqin = getYaoLiuqin(yongshenPosition);
    if (!yongshenLiuqin) {
        return;
    }
    
    // 修正：正確的六親關係定義元神和忌神
    const liuqinRelations = {
        '兄弟': { yuan: '父母', ji: '官鬼' },
        '子孫': { yuan: '兄弟', ji: '父母' }, 
        '妻財': { yuan: '子孫', ji: '兄弟' },
        '官鬼': { yuan: '妻財', ji: '子孫' },
        '父母': { yuan: '官鬼', ji: '妻財' }
    };
    
    const relation = liuqinRelations[yongshenLiuqin];
    if (!relation) {
        return;
    }
    
    // 檢查其他爻的六親關係
    for (let yao = 1; yao <= 6; yao++) {
        if (yao === yongshenPosition) continue; // 跳過用神自己
        
        const yaoLiuqin = getYaoLiuqin(yao);
        if (!yaoLiuqin) continue;
        
        // 檢查是否為元神
        if (yaoLiuqin === relation.yuan) {
            markYuanJishen(yao, '元', '#dc3545'); // 紅色
        }
        // 檢查是否為忌神
        else if (yaoLiuqin === relation.ji) {
            markYuanJishen(yao, '忌', '#000000'); // 黑色
        }
    }
}
// 修正：獲取爻的六親 - 使用表格行位置而非內容篩選
// 修正：獲取爻的六親 - 修正備用方法
function getYaoLiuqin(yaoPosition) {
    
    const table = document.querySelector('.main-table');
    if (!table) return null;
    
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // 根據固定的表格結構定位：標題行(0) + 卦名行(1) + 數據行(2-7)
    const dataRowIndex = 2 + (6 - yaoPosition); // 第1爻在第8行，第6爻在第3行
    if (dataRowIndex < rows.length) {
        const targetRow = rows[dataRowIndex];
        const cells = targetRow.querySelectorAll('td');
        
        if (cells.length >= 5) {
            const fifthCell = cells[4];
            const fifthCellText = fifthCell.textContent || fifthCell.innerText || '';
            const cleanText = fifthCellText.trim().replace(/[用元忌]/g, '').replace(/\s+/g, ''); // 移除標記和多餘空白
            
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(cleanText)) {
                return cleanText;
            }
        }
    }
    
    const expectedLiuqin = {
        6: '妻財',
        5: '官鬼', 
        4: '子孫',
        3: '兄弟',
        2: '子孫',
        1: '妻財'
    };
    
    const result = expectedLiuqin[yaoPosition];
    return result || null;
}

// 標記元神忌神
function markYuanJishen(yaoPosition, mark, color) {
    const table = document.querySelector('.main-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length >= 5;
    });
    
    let actualDataRows = [];
    dataRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const fifthCell = cells[4].textContent.trim();
            const cleanText = fifthCell.replace(/[用元忌]/g, '').trim();
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(cleanText)) {
                actualDataRows.push(row);
            }
        }
    });
    
    actualDataRows.forEach((row, index) => {
        const tableYaoPosition = 6 - index; // 從上到下對應第6爻到第1爻
        
        if (tableYaoPosition === yaoPosition) {
            const cells = row.querySelectorAll('td');
            const liuqinCell = cells[4]; // E列六親
            
            if (liuqinCell) {
                // 獲取原始文字（去除已有的標記）
                const originalText = liuqinCell.textContent.trim().replace(/[用元忌]/g, '').trim();
                
                // 檢查是否已有用神標記
                const hasYongshen = liuqinCell.innerHTML.includes('用');
                
                if (hasYongshen) {
                    // 如果已有用神標記，保持用神標記並添加元神/忌神標記
                    liuqinCell.innerHTML = `
                        <div style="position: relative; text-align: center; display: inline-block; width: 100%;">
                            ${originalText}
                            <span style="position: absolute; top: -5px; right: -5px; color: #28a745; font-weight: bold; font-size: 16px;">用</span>
                            <span style="position: absolute; top: -5px; left: -5px; color: ${color}; font-weight: bold; font-size: 14px;">${mark}</span>
                        </div>
                    `;
                } else {
                    // 只有元神/忌神標記
                    liuqinCell.innerHTML = `
                        <div style="position: relative; text-align: center; display: inline-block; width: 100%;">
                            ${originalText}
                            <span style="position: absolute; top: -5px; right: -5px; color: ${color}; font-weight: bold; font-size: 14px;">${mark}</span>
                        </div>
                    `;
                }
            }
        }
    });
}

// 清除用神標記
function clearYongshenMarks() {
    const table = document.querySelector('.main-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length > 2 && /^[A-J][1-6]$/.test(cells[0].textContent.trim());
    });
    
    dataRows.forEach((row, index) => {
        if (index < 6) {
            const cells = row.querySelectorAll('td');
            const liuqinCell = cells[4]; // E列六親
            
            if (liuqinCell) {
                // 恢復原始六親文字
                const originalText = liuqinCell.textContent.trim().replace(/[用元忌]/g, '');
                liuqinCell.textContent = originalText;
            }
        }
    });
}

// 更新大卦表中的卦名（GN和BGN）
function updateGuaNames(guaNames) {
    if (!guaNames) {
        return;
    }
    
    // 查找大卦表
    const table = document.querySelector('.main-table');
    if (!table) {
        return;
    }
    
    const rows = table.querySelectorAll('tr');
    
    // 修正：現在卦名行是第1行（索引0）
    if (rows.length >= 1) {
        const gnBgnRow = rows[0]; // 第一行（索引0）
        const cells = gnBgnRow.querySelectorAll('td');
       
        if (cells.length >= 2) {
            // 找到所有有colspan屬性的單元格
            let gnUpdated = false;
            let bgnUpdated = false;
            
            for (let i = 0; i < cells.length; i++) {
                const colspan = cells[i].getAttribute('colspan');
                
                if (colspan === '6' && !gnUpdated) {
                    console.log('更新GN為:', guaNames.gn);
                    cells[i].textContent = guaNames.gn || 'GN';
                    cells[i].innerHTML = guaNames.gn || 'GN';
                    gnUpdated = true;
                } else if (colspan === '4' && !bgnUpdated) {
                    console.log('更新BGN為:', guaNames.bgn);
                    cells[i].textContent = guaNames.bgn || 'BGN';
                    cells[i].innerHTML = guaNames.bgn || 'BGN';
                    bgnUpdated = true;
                }
            }
            
            console.log('卦名更新完成 - GN:', gnUpdated, 'BGN:', bgnUpdated);
        } else {
            console.error('GN/BGN行單元格數量不足，實際數量:', cells.length);
        }
    } else {
        console.error('表格行數不足，實際行數:', rows.length);
    }
    
    console.log('=== updateGuaNames 結束 ===');
}

// 初始化事件監聽器
function initializeEventListeners() {
    console.log('initializeEventListeners 函數開始執行');
    
    // 基本元素
    const methodSelect = document.getElementById('divination-method');
    const dateMethodSelect = document.getElementById('date-method');
    
    console.log('methodSelect:', methodSelect);
    console.log('dateMethodSelect:', dateMethodSelect);
    
    // 起卦方式選擇器
    if (methodSelect) {
        methodSelect.addEventListener('change', function() {
            console.log('起卦方式改變為:', this.value);
            const method = this.value;

        if (method === 'record') {
            // 處理批卦記錄選擇
            handleRecordSelection();
            // 重置選擇，避免卡在記錄選項
            this.value = '';
            return;
        }
            
            // 隱藏所有特殊輸入區域
            const randomSection = document.getElementById('random-section');
            
            if (randomSection) randomSection.classList.add('hidden');
            
            // 更新結果顯示
            const resultText = document.getElementById('result-text');
            
            switch(method) {
                case 'time':
                    if (resultText) resultText.textContent = '時間起卦 - 準備就緒';
                    break;
                case 'number':
                    if (resultText) resultText.textContent = '數字起卦 - 請點擊開始起卦';
                    console.log('選擇了數字起卦，準備顯示模態視窗');
                    setTimeout(() => {
                        showNumberModal();
                    }, 100);
                    break;
                case 'random':
                    if (randomSection) randomSection.classList.remove('hidden');
                    if (resultText) resultText.textContent = '隨機起卦 - 請點擊隨機起卦按鈕';
                    break;
                case 'liuyao':
                    if (resultText) resultText.textContent = '六爻起卦 - 請點擊開始起卦';
                    console.log('選擇了六爻起卦，準備顯示模態視窗');
                    setTimeout(() => {
                        showLiuyaoModal();
                    }, 100);
                    break;
                default:
                    if (resultText) resultText.textContent = '';
            }
        });
    }
    
    // 日期選擇方式
    if (dateMethodSelect) {
        dateMethodSelect.addEventListener('change', function() {
            const datePicker = document.getElementById('date-picker');
            const ganzhiPicker = document.getElementById('ganzhi-picker');
            
            if (this.value === 'specific') {
                if (datePicker) datePicker.classList.remove('hidden');
                if (ganzhiPicker) ganzhiPicker.classList.add('hidden');
            } else if (this.value === 'ganzhi') {
                if (datePicker) datePicker.classList.add('hidden');
                if (ganzhiPicker) ganzhiPicker.classList.remove('hidden');
            } else {
                if (datePicker) datePicker.classList.add('hidden');
                if (ganzhiPicker) ganzhiPicker.classList.add('hidden');
                updateTimeDisplay();
            }
        });
    }
    
    // 手動日期選擇
    const specificDate = document.getElementById('specific-date');
    if (specificDate) {
        specificDate.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const ganZhi = calculateGanZhiForDate(selectedDate);
            
            // 更新顯示
            const elements = {
                t1: document.getElementById('t1'),
                t2: document.getElementById('t2'),
                t3: document.getElementById('t3'),
                t4: document.getElementById('t4'),
                k: document.getElementById('k')
            };
            
            if (elements.t1) elements.t1.textContent = ganZhi.year || '乙巳';
            if (elements.t2) elements.t2.textContent = ganZhi.month || '乙酉';
            if (elements.t3) elements.t3.textContent = ganZhi.day || '己卯';
            if (elements.t4) elements.t4.textContent = ganZhi.time || '甲戌';
            
            // 計算旬空
            if (elements.k && typeof GuaCalculator !== 'undefined' && ganZhi.day) {
                try {
                    const xunKong = GuaCalculator.getXunKongDisplay(ganZhi.day);
                    elements.k.textContent = xunKong;
                } catch (error) {
                    elements.k.textContent = '申、酉';
                }
            }
            
            // 更新五行神煞
            updateWuxingDisplay();
        });
    }
    
    console.log('initializeEventListeners 函數執行完成');
}

// 顯示結果 - 修改為更新一行顯示
function showResult(text) {
    const resultText = document.getElementById('result-text');
    if (resultText) {
        // 移除換行符，改為空格分隔
        const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        resultText.textContent = cleanText;
    }
}

// ==================== 六爻起卦功能 ====================

// 顯示六爻輸入模態視窗
function showLiuyaoModal() {
    console.log('showLiuyaoModal 函數被調用');
    
    // 移除已存在的模態視窗
    const existingModal = document.getElementById('liuyao-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 創建模態視窗覆蓋層
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'liuyao-modal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // 創建模態視窗內容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 2px solid #333;
        max-width: 90%;
        width: auto;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button id="close-modal" style="
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">&times;</button>
        
        <div style="text-align: center; margin-bottom: 20px; padding-right: 30px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">請準備三枚相同的硬幣，並擲幣6次，記下每次<br>出現"陽面"的次數（一般為頭像），並輸入結果：</h3>
        </div>
        
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; min-width: 480px;">
                <tr>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: bold; font-size: 14px; width: 16.66%;">第1次</td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: bold; font-size: 14px; width: 16.66%;">第2次</td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: bold; font-size: 14px; width: 16.66%;">第3次</td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: bold; font-size: 14px; width: 16.66%;">第4次</td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: bold; font-size: 14px; width: 16.66%;">第5次</td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: bold; font-size: 14px; width: 16.66%;">第6次</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center;">
                        <select id="modal-dice1" style="width: 90%; padding: 4px; font-size: 14px;">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center;">
                        <select id="modal-dice2" style="width: 90%; padding: 4px; font-size: 14px;">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center;">
                        <select id="modal-dice3" style="width: 90%; padding: 4px; font-size: 14px;">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center;">
                        <select id="modal-dice4" style="width: 90%; padding: 4px; font-size: 14px;">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center;">
                        <select id="modal-dice5" style="width: 90%; padding: 4px; font-size: 14px;">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                    <td style="border: 1px solid #333; padding: 6px; text-align: center;">
                        <select id="modal-dice6" style="width: 90%; padding: 4px; font-size: 14px;">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
        
        <div style="text-align: center;">
            <button id="confirm-liuyao" style="background: #5a9fd4; color: white; border: none; padding: 10px 20px; border-radius: 4px; margin-right: 10px; cursor: pointer; font-size: 14px;">確定送出</button>
            <button id="reset-liuyao" style="background: #5a9fd4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">重新輸入</button>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    console.log('模態視窗已添加到頁面');
    
    // 添加事件監聽器
    document.getElementById('confirm-liuyao').onclick = function() {
        console.log('確定送出被點擊');
        confirmModalLiuyaoResults();
    };
    
    document.getElementById('reset-liuyao').onclick = function() {
        console.log('重新輸入被點擊');
        resetModalLiuyaoInputs();
    };
    
    // 右上角關閉按鈕
    document.getElementById('close-modal').onclick = function() {
        console.log('關閉按鈕被點擊');
        closeLiuyaoModal();
    };
    
    // 點擊覆蓋層關閉模態視窗
    modalOverlay.onclick = function(e) {
        if (e.target === modalOverlay) {
            closeLiuyaoModal();
        }
    };
}

// 關閉六爻模態視窗
function closeLiuyaoModal() {
    const modal = document.getElementById('liuyao-modal');
    if (modal) {
        modal.remove();
    }
}

// 確認模態視窗的六爻結果
function confirmModalLiuyaoResults() {
    console.log('確認模態視窗的六爻結果');
    
    // 收集六次擲幣結果
    const results = [];
    for (let i = 1; i <= 6; i++) {
        const diceValue = document.getElementById('modal-dice' + i).value;
        results.push(parseInt(diceValue));
    }
    
    console.log('六爻擲幣結果:', results);
    
    // 存儲到全域變數 dice1~dice6
    window.dice1 = results[0];
    window.dice2 = results[1];
    window.dice3 = results[2];
    window.dice4 = results[3];
    window.dice5 = results[4];
    window.dice6 = results[5];
    
    console.log('存儲的dice值:', {dice1: window.dice1, dice2: window.dice2, dice3: window.dice3, dice4: window.dice4, dice5: window.dice5, dice6: window.dice6});
    
    // 建立Yinyuang1~Yinyuang6常數
    window.Yinyuang1 = (window.dice1 === 0 || window.dice1 === 2) ? 0 : 1;
    window.Yinyuang2 = (window.dice2 === 0 || window.dice2 === 2) ? 0 : 1;
    window.Yinyuang3 = (window.dice3 === 0 || window.dice3 === 2) ? 0 : 1;
    window.Yinyuang4 = (window.dice4 === 0 || window.dice4 === 2) ? 0 : 1;
    window.Yinyuang5 = (window.dice5 === 0 || window.dice5 === 2) ? 0 : 1;
    window.Yinyuang6 = (window.dice6 === 0 || window.dice6 === 2) ? 0 : 1;
    
    console.log('Yinyuang值:', {Yinyuang1: window.Yinyuang1, Yinyuang2: window.Yinyuang2, Yinyuang3: window.Yinyuang3, Yinyuang4: window.Yinyuang4, Yinyuang5: window.Yinyuang5, Yinyuang6: window.Yinyuang6});
    
    // 建立guamap1~guamap6
    window.guamap1 = createGuaMap(window.dice1);
    window.guamap2 = createGuaMap(window.dice2);
    window.guamap3 = createGuaMap(window.dice3);
    window.guamap4 = createGuaMap(window.dice4);
    window.guamap5 = createGuaMap(window.dice5);
    window.guamap6 = createGuaMap(window.dice6);
    
    console.log('guamap值:', {guamap1: window.guamap1, guamap2: window.guamap2, guamap3: window.guamap3, guamap4: window.guamap4, guamap5: window.guamap5, guamap6: window.guamap6});
    
    // 關閉模態視窗
    closeLiuyaoModal();
    
    const resultText = `六爻起卦完成：${results.join(', ')}`;
    showResult(resultText);
}

// 重置模態視窗的六爻輸入
function resetModalLiuyaoInputs() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById('modal-dice' + i).value = '0';
    }
}

// ==================== 數字起卦功能 ====================

// 顯示數字起卦模態視窗
function showNumberModal() {
    console.log('showNumberModal 函數被調用');
    
    // 移除已存在的模態視窗
    const existingModal = document.getElementById('number-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 創建模態視窗覆蓋層
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'number-modal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // 創建模態視窗內容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 2px solid #333;
        max-width: 400px;
        width: 90%;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button id="close-number-modal" style="
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">&times;</button>
        
        <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px;">數字起卦</h3>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">請輸入1-8：</label>
            <input type="number" id="x1-input" min="1" max="8" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
                   placeholder="上卦">
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">請輸入1-8：</label>
            <input type="number" id="x2-input" min="1" max="8" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
                   placeholder="下卦">
        </div>
        
        <div style="margin-bottom: 25px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">請輸入0-99：</label>
            <input type="number" id="x3-input" min="0" max="99" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
                   placeholder="動爻">
        </div>
        
        <div style="text-align: center;">
            <button id="confirm-number" style="background: #5a9fd4; color: white; border: none; padding: 12px 25px; border-radius: 4px; margin-right: 10px; cursor: pointer; font-size: 16px;">確定送出</button>
            <button id="reset-number" style="background: #5a9fd4; color: white; border: none; padding: 12px 25px; border-radius: 4px; cursor: pointer; font-size: 16px;">重新輸入</button>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    console.log('數字起卦模態視窗已添加到頁面');
    
    // 添加事件監聽器
    document.getElementById('confirm-number').onclick = function() {
        console.log('確定送出被點擊');
        confirmNumberResults();
    };
    
    document.getElementById('reset-number').onclick = function() {
        console.log('重新輸入被點擊');
        resetNumberInputs();
    };
    
    // 右上角關閉按鈕
    document.getElementById('close-number-modal').onclick = function() {
        console.log('關閉按鈕被點擊');
        closeNumberModal();
    };
    
    // 點擊覆蓋層關閉模態視窗
    modalOverlay.onclick = function(e) {
        if (e.target === modalOverlay) {
            closeNumberModal();
        }
    };
}

// 關閉數字起卦模態視窗
function closeNumberModal() {
    const modal = document.getElementById('number-modal');
    if (modal) {
        modal.remove();
    }
}

// 確認數字起卦結果
function confirmNumberResults() {
    console.log('確認數字起卦結果');
    
    const x1 = document.getElementById('x1-input').value;
    const x2 = document.getElementById('x2-input').value;
    const x3 = document.getElementById('x3-input').value;
    
    // 驗證輸入
    if (!x1 || !x2 || x3 === '') {
        alert('請填入所有欄位');
        return;
    }
    
    const x1Num = parseInt(x1);
    const x2Num = parseInt(x2);
    const x3Num = parseInt(x3);
    
    // 驗證 X1, X2 範圍
    if (x1Num < 1 || x1Num > 8) {
        alert('X1 必須是 1-8 的數字');
        return;
    }
    
    if (x2Num < 1 || x2Num > 8) {
        alert('X2 必須是 1-8 的數字');
        return;
    }
    
    // 驗證 X3 範圍
    if (x3Num < 0 || x3Num > 99) {
        alert('X3 必須是 0-99 的數字');
        return;
    }
    
    console.log('輸入驗證通過:', {x1: x1Num, x2: x2Num, x3: x3Num});
    
    // 計算動爻位置
    const dongYao = calculateDongYao(x3Num);
    console.log('動爻位置:', dongYao);
    
    // 生成卦象
    const guaResult = generateNumberGua(x1Num, x2Num, dongYao);
    console.log('卦象結果:', guaResult);
    
    // 存儲全域變數
    window.numberGuaResult = guaResult;
    
    // 關閉模態視窗
    closeNumberModal();
    
    const resultText = `數字起卦完成 下卦：${GuaNames[x2Num]} 上卦：${GuaNames[x1Num]} 動爻：${dongYao === 0 ? '無' : '第' + dongYao + '爻'}`;
    showResult(resultText);
}

// 計算動爻位置
function calculateDongYao(x3) {
    if (x3 === 0) return 0;
    
    let sum = x3;
    
    // 如果是兩位數，將各位數相加
    while (sum >= 10) {
        const digits = sum.toString().split('').map(Number);
        sum = digits.reduce((a, b) => a + b, 0);
    }
    
    // 如果 > 6，減 6
    if (sum > 6) {
        sum -= 6;
    }
    
    return sum;
}

// 生成數字起卦的卦象
function generateNumberGua(x1, x2, dongYao) {
    // 獲取下卦和上卦的 GuaCode
    const lowerGua = GuaCode[x2]; // 下卦
    const upperGua = GuaCode[x1]; // 上卦
    
    // 組合成完整卦象 (從下到上：下卦 + 上卦)
    const fullGua = [...lowerGua, ...upperGua];
    
    console.log('完整卦象:', fullGua);
    console.log('動爻位置:', dongYao);
    
    // 處理動爻
    const finalGua = [...fullGua];
    if (dongYao > 0 && dongYao <= 6) {
        const position = dongYao - 1;
        if (finalGua[position] === 1) {
            finalGua[position] = 2; // 陽爻→陰爻
        } else if (finalGua[position] === 2) {
            finalGua[position] = 1; // 陰爻→陽爻
        }
    }
    
    console.log('處理動爻後:', finalGua);
    
    // 生成 GuaMap
    const guaMaps = finalGua.map(code => createNumberGuaMap(code));
    
    return {
        originalGua: fullGua,
        finalGua: finalGua,
        guaMaps: guaMaps,
        lowerGuaName: GuaNames[x2],
        upperGuaName: GuaNames[x1],
        dongYao: dongYao
    };
}

// 重置數字起卦輸入
function resetNumberInputs() {
    document.getElementById('x1-input').value = '';
    document.getElementById('x2-input').value = '';
    document.getElementById('x3-input').value = '';
}

// ==================== 時間起卦功能 ====================
function timeBasedDivination() {
    console.log('開始執行時間起卦');
    
    // 獲取當前干支
    const ganZhi = getCurrentGanZhi();
    console.log('當前干支:', ganZhi);
    
    // 提取地支並轉換為數字
    const yearZhi = ganZhi.year.charAt(1);
    const monthZhi = ganZhi.month.charAt(1);
    const dayZhi = ganZhi.day.charAt(1);
    const timeZhi = ganZhi.time.charAt(1);
    
    const yearNum = DIZHI_NUMBERS[yearZhi] || 1;
    const monthNum = DIZHI_NUMBERS[monthZhi] || 1;
    const dayNum = DIZHI_NUMBERS[dayZhi] || 1;
    const timeNum = DIZHI_NUMBERS[timeZhi] || 1;
    
    console.log('地支數字:', {
        年: `${yearZhi}=${yearNum}`,
        月: `${monthZhi}=${monthNum}`,
        日: `${dayZhi}=${dayNum}`,
        時: `${timeZhi}=${timeNum}`
    });
    
    // 計算上卦：(年+月+日) / 8 的餘數
    const upperSum = yearNum + monthNum + dayNum;
    let upperGua = upperSum % 8;
    if (upperGua === 0) upperGua = 8; // 餘數為0時取8
    
    // 計算下卦：(年+月+日+時) / 8 的餘數
    const lowerSum = yearNum + monthNum + dayNum + timeNum;
    let lowerGua = lowerSum % 8;
    if (lowerGua === 0) lowerGua = 8; // 餘數為0時取8
    
    // 計算動爻：(年+月+日+時) / 6 的餘數
    let dongYao = lowerSum % 6;
    if (dongYao === 0) dongYao = 6; // 餘數為0時取6
    
    console.log('計算結果:', {
        上卦: `${upperSum} % 8 = ${upperGua} (${GuaNames[upperGua]})`,
        下卦: `${lowerSum} % 8 = ${lowerGua} (${GuaNames[lowerGua]})`,
        動爻: `${lowerSum} % 6 = ${dongYao}`
    });
    
    // 生成完整卦象 (從初爻到上爻：下卦 + 上卦)
    const lowerGuaCode = GuaCode[lowerGua]; // 下卦
    const upperGuaCode = GuaCode[upperGua]; // 上卦
    const fullGua = [...lowerGuaCode, ...upperGuaCode];
    
    console.log('完整卦象:', fullGua);
    
    // 建立時間起卦的結果對象，使用與數字起卦相同的格式
    const finalGua = [...fullGua];
    
    // 處理動爻變化
    if (dongYao > 0 && dongYao <= 6) {
        const position = dongYao - 1;
        if (finalGua[position] === 1) {
            finalGua[position] = 2; // 陽爻→陰爻
        } else if (finalGua[position] === 2) {
            finalGua[position] = 1; // 陰爻→陽爻
        }
    }
    
    console.log('處理動爻後:', finalGua);
    
    // 創建時間起卦結果對象
    window.timeGuaResult = {
        originalGua: fullGua,
        finalGua: finalGua,
        upperGua: upperGua,
        lowerGua: lowerGua,
        dongYao: dongYao,
        upperGuaName: GuaNames[upperGua],
        lowerGuaName: GuaNames[lowerGua]
    };
    
    const resultText = `時間起卦完成 - 上卦：${GuaNames[upperGua]} 下卦：${GuaNames[lowerGua]} 動爻：第${dongYao}爻`;
    showResult(resultText);
    
    console.log('時間起卦結果:', window.timeGuaResult);
}

// 時間起卦填表函數
function fillTimeGuaTable() {
    console.log('開始填入時間起卦結果到卦表');
    
    const table = document.querySelector('.main-table');
    if (!table) {
        console.error('找不到主表格');
        return;
    }
    
    const rows = table.querySelectorAll('tr');
    // 新增：清空預設值
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length > 2 && /^[A-J][1-6]$/.test(cells[0].textContent.trim());
    });
    
    // 本卦卦象：使用 originalGua 生成，動爻標記為紅色
    const originalGuamaps = [];
    for (let i = 0; i < 6; i++) {
        const originalCode = window.timeGuaResult.originalGua[i];
        const isDongYao = (window.timeGuaResult.dongYao === i + 1);
        
        let guaMap = createNumberGuaMap(originalCode);
        // 如果是動爻，將顏色改為紅色
        if (isDongYao) {
            guaMap = guaMap.replace(/color:\s*black/g, 'color: red');
        }
        originalGuamaps.push(guaMap);
    }
    
    // 表格顯示順序：從上到下對應上爻到初爻
    const guamaps = [
        originalGuamaps[5], originalGuamaps[4], originalGuamaps[3],
        originalGuamaps[2], originalGuamaps[1], originalGuamaps[0]
    ];
    
    // 計算並更新卦名及詳細信息
    let guaNames = null;
    let guaDetails = null;
    let bianGuaDetails = null;
    let fushenData = null;
    let liushenData = null;
    let shiYingData = null;
    
    if (typeof AdvancedCalculator !== 'undefined') {
        // 使用 calculateNumberGuaNames 來計算卦名
        guaNames = AdvancedCalculator.calculateNumberGuaNames(window.timeGuaResult);
        console.log('計算得到的卦名:', guaNames);
        
        // 計算本卦詳細信息
        if (guaNames && guaNames.originalBinary) {
            guaDetails = AdvancedCalculator.calculateGuaComplete(guaNames.originalBinary);
            console.log('計算得到的本卦詳細信息:', guaDetails);
            
            // 計算世應位置
            shiYingData = AdvancedCalculator.calculateShiYing(guaNames.originalBinary);
            console.log('計算得到的世應位置:', shiYingData);
            
            // 計算伏神
            if (guaDetails.liuqin) {
                fushenData = AdvancedCalculator.calculateFushen(guaNames.originalBinary, guaDetails.liuqin);
                console.log('計算得到的伏神:', fushenData);
            }
        }
        
        // 計算六獸
        const ganZhi = getCurrentGanZhi();
        const dayGan = ganZhi.day.charAt(0);
        if (typeof GuaCalculator !== 'undefined') {
            liushenData = GuaCalculator.getLiushen(dayGan);
            console.log('計算得到的六獸:', liushenData);
        }
        
        // 計算變卦詳細信息
        if (guaNames && guaNames.bianBinary) {
            bianGuaDetails = AdvancedCalculator.calculateGuaComplete(guaNames.bianBinary);
            console.log('計算得到的變卦詳細信息:', bianGuaDetails);
        }
        
        updateGuaNames(guaNames);
        console.log('時間起卦卦名已更新');
    }
    
    // 變卦卦象
    const bianGuamaps = [];
    for (let i = 0; i < 6; i++) {
        const finalCode = window.timeGuaResult.finalGua[i];
        bianGuamaps.push(createNumberGuaMap(finalCode));
    }
    const bianGuamapsReverse = [
        bianGuamaps[5], bianGuamaps[4], bianGuamaps[3],
        bianGuamaps[2], bianGuamaps[1], bianGuamaps[0]
    ];
    
    dataRows.forEach((row, index) => {
        if (index < 6) {
            const cells = row.querySelectorAll('td');
            if (cells.length > 9) {
                const yaoIndex = 5 - index;
                const actualYaoPosition = yaoIndex + 1;
                
                // A列：六獸
                if (liushenData && liushenData[yaoIndex]) {
                    cells[0].innerHTML = `<div style="text-align: center; font-size: 14px; font-weight: bold;">${liushenData[yaoIndex]}</div>`;
                } else {
                    cells[0].innerHTML = '';
                }
                
                // B列：伏神
                if (fushenData && fushenData[yaoIndex] && fushenData[yaoIndex].trim() !== '') {
                    let updatedFushen = fushenData[yaoIndex];
                    updatedFushen = updatedFushen.replace(/font-size:\s*10px/g, 'font-size: 14px');
                    cells[1].innerHTML = updatedFushen;
                } else {
                    cells[1].innerHTML = '';
                }
                
                // C列：卦象（加入世應顯示）
                if (guamaps[index]) {
                    let guaDisplay = `<div style="display: flex; align-items: center; justify-content: center; position: relative;">`;
                    guaDisplay += `<span style="text-align: center;">${guamaps[index]}</span>`;
                    
                    // 添加世應標記
                    if (shiYingData) {
                        if (shiYingData.shi === actualYaoPosition) {
                            guaDisplay += '<span style="position: absolute; right: -8px; font-size: 14px; color: red; font-weight: bold;">世</span>';
                        } else if (shiYingData.ying === actualYaoPosition) {
                            guaDisplay += '<span style="position: absolute; right: -8px; font-size: 14px; color: blue; font-weight: bold;">應</span>';
                        }
                    }
                    
                    guaDisplay += '</div>';
                    cells[2].innerHTML = guaDisplay;
                } else {
                    cells[2].innerHTML = '';
                }
                
                // D列：地支五行
                if (guaDetails && guaDetails.dizhiWuxing) {
                    cells[3].textContent = guaDetails.dizhiWuxing[yaoIndex] || '--';
                } else {
                    cells[3].textContent = '--';
                }
                
                // E列：六親
                if (guaDetails && guaDetails.liuqin) {
                    cells[4].textContent = guaDetails.liuqin[yaoIndex] || '--';
                } else {
                    cells[4].textContent = '--';
                }
                // F列：用神 - 保持空白
                if (cells.length > 5) {
                    cells[5].textContent = '';
                    cells[5].innerHTML = '';
                }
                
                // 變卦部分
                // G列：變卦地支五行
                if (bianGuaDetails && bianGuaDetails.dizhiWuxing) {
                    cells[6].textContent = bianGuaDetails.dizhiWuxing[yaoIndex] || '--';
                } else {
                    cells[6].textContent = '--';
                }
                
                // H列：變卦六親
                if (bianGuaDetails && bianGuaDetails.liuqin) {
                    cells[7].textContent = bianGuaDetails.liuqin[yaoIndex] || '--';
                } else {
                    cells[7].textContent = '--';
                }
                
                // I列：變卦卦象
                cells[8].innerHTML = bianGuamapsReverse[index];
                // J列：卦變 - 保持空白
                if (cells.length > 9) {
                    cells[9].textContent = '';
                    cells[9].innerHTML = '';
                }
            }
        }
    });
setTimeout(() => {
    correctChangeGuaLiuqin();
}, 200);
    console.log('已將時間起卦結果填入卦表，包含動爻紅色標記、六獸、世應、伏神');
}

// ==================== 共用函數 ====================

// 創建六爻起卦的卦象符號
function createGuaMap(dice) {
    switch(dice) {
        case 0: return '<span style="color: red;">▇▇　▇▇</span>';   // 老陰，紅色
        case 1: return '<span style="color: black;">▇▇▇▇▇</span>'; // 少陽，黑色
        case 2: return '<span style="color: black;">▇▇　▇▇</span>'; // 少陰，黑色
        case 3: return '<span style="color: red;">▇▇▇▇▇</span>';   // 老陽，紅色
        default: return '?';
    }
}

// 創建數字起卦的卦象符號
function createNumberGuaMap(code) {
    switch(code) {
        case 1: return '<span style="color: black;">▇▇▇▇▇</span>'; // 陽爻，黑色
        case 2: return '<span style="color: black;">▇▇　▇▇</span>'; // 陰爻，黑色
        case 3: return '<span style="color: red;">▇▇▇▇▇</span>';   // 老陽，紅色
        case 0: return '<span style="color: red;">▇▇　▇▇</span>';   // 老陰，紅色
        default: return '?';
    }
}

// ==================== 卦表填入功能 ====================

/**
 * 修正：六爻起卦填表函數 - 正確的順序和世應顯示
 */
function fillLiuyaoGuaTable() {
    console.log('開始填入六爻起卦結果到卦表');
    
    const table = document.querySelector('.main-table');
    if (!table) {
        console.error('找不到主表格');
        return;
    }
    
    const rows = table.querySelectorAll('tr');
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length > 2 && /^[A-J][1-6]$/.test(cells[0].textContent.trim());
    });
    
    console.log(`找到 ${dataRows.length} 個數據行`);
    
    // 檢查是否有動爻（老陰0或老陽3）
    const liuyaoResults = [window.dice1, window.dice2, window.dice3, window.dice4, window.dice5, window.dice6];
    const hasMovingYao = liuyaoResults.some(dice => dice === 0 || dice === 3);
    console.log('是否有動爻:', hasMovingYao, '六爻結果:', liuyaoResults);
    
    // 修正：卦象順序應該正確對應
    // 表格從上到下對應上爻到初爻，所以要反轉guamap數組
    const guamaps = [window.guamap6, window.guamap5, window.guamap4, window.guamap3, window.guamap2, window.guamap1];
    
    // 重新計算所有數據
    let guaNames = null;
    let guaDetails = null;
    let bianGuaDetails = null;
    let fushenData = null;
    let liushenData = null;
    let shiYingData = null;
    
    if (typeof AdvancedCalculator !== 'undefined') {
        console.log('重新計算六爻結果數組:', liuyaoResults);
        
        // 重新計算卦名
        guaNames = AdvancedCalculator.calculateGuaNames(liuyaoResults);
        console.log('重新計算得到的卦名:', guaNames);
        
        // 重新計算本卦地支五行和六親
        if (guaNames && guaNames.originalBinary) {
            guaDetails = AdvancedCalculator.calculateGuaComplete(guaNames.originalBinary);
            console.log('重新計算得到的本卦詳細信息:', guaDetails);
            
            // 計算世應位置
            shiYingData = AdvancedCalculator.calculateShiYing(guaNames.originalBinary);
            console.log('計算得到的世應位置:', shiYingData);
            
            // 重新計算伏神
            if (guaDetails.liuqin) {
                fushenData = AdvancedCalculator.calculateFushen(guaNames.originalBinary, guaDetails.liuqin);
                console.log('重新計算得到的伏神:', fushenData);
            }
        }
        
        // 只有在有動爻時才計算變卦
        if (hasMovingYao && guaNames && guaNames.bianBinary) {
            bianGuaDetails = AdvancedCalculator.calculateGuaComplete(guaNames.bianBinary);
            console.log('重新計算得到的變卦詳細信息:', bianGuaDetails);
        } else {
            console.log('無動爻，變卦數據設為空');
            bianGuaDetails = null;
        }
        
        // 重新計算六神
        const ganZhi = getCurrentGanZhi();
        const dayGan = ganZhi.day.charAt(0);
        if (typeof GuaCalculator !== 'undefined') {
            liushenData = GuaCalculator.getLiushen(dayGan);
            console.log('重新計算得到的六神:', liushenData);
        }
        
        // 更新卦名
        if (guaNames) {
            const displayGuaNames = {
                gn: guaNames.gn,
                bgn: hasMovingYao ? guaNames.bgn : '',
                originalBinary: guaNames.originalBinary,
                bianBinary: guaNames.bianBinary
            };
            updateGuaNames(displayGuaNames);
            console.log('六爻起卦卦名已更新, 有動爻:', hasMovingYao);
        }
    }
    
    // 生成變卦的卦象（只有在有動爻時）
    let bianGuamaps = [];
    if (hasMovingYao) {
        for (let i = 0; i < 6; i++) {
            const diceValue = liuyaoResults[i];
            let bianCode;
            
            if (diceValue === 0) bianCode = 1; // 老陰變少陽
            else if (diceValue === 3) bianCode = 2; // 老陽變少陰
            else bianCode = diceValue; // 少陽少陰不變
            
            bianGuamaps.push(createGuaMap(bianCode));
        }
        // 變卦卦象也要反轉顯示
        bianGuamaps = [bianGuamaps[5], bianGuamaps[4], bianGuamaps[3], bianGuamaps[2], bianGuamaps[1], bianGuamaps[0]];
    } else {
        bianGuamaps = Array(6).fill('');
    }
    
    console.log('開始進行填入數據');
    
    dataRows.forEach((row, index) => {
        if (index < 6) {
            const cells = row.querySelectorAll('td');
            
            if (cells.length > 9) {
                // 修正：正確的爻位對應關係
                // 表格index=0(最上行) -> 上爻(第6爻)
                // 表格index=5(最下行) -> 初爻(第1爻)
                const yaoIndex = 5 - index; // 爻的實際索引：0=初爻, 5=上爻
                const actualYaoPosition = yaoIndex + 1; // 爻位：1-6
                console.log(`處理表格第 ${index + 1} 行，對應第 ${actualYaoPosition} 爻`);
                
                // A列：只顯示六神
                if (liushenData && liushenData[yaoIndex]) {
                    cells[0].innerHTML = `<div style="text-align: center; font-size: 14px; font-weight: bold;">${liushenData[yaoIndex]}</div>`;
                    console.log(`A列填入六神: ${liushenData[yaoIndex]}`);
                } else {
                    cells[0].textContent = `A${actualYaoPosition}`;
                }
                
                // B列：伏神
                if (fushenData && fushenData[yaoIndex] && fushenData[yaoIndex].trim() !== '') {
                    let updatedFushen = fushenData[yaoIndex];
                    updatedFushen = updatedFushen.replace(/font-size:\s*10px/g, 'font-size: 14px');
                    cells[1].innerHTML = updatedFushen;
                } else {
                    cells[1].innerHTML = '';
                }
                
                // C列：卦象（加入世應顯示，右側對齊）
                if (guamaps[index]) {
                    let guaDisplay = `<div style="display: flex; align-items: center; justify-content: center; position: relative;">`;
                    guaDisplay += `<span style="text-align: center;">${guamaps[index]}</span>`;
                    
                    // 添加世應標記，顯示在右側
                    if (shiYingData) {
                        if (shiYingData.shi === actualYaoPosition) {
                            guaDisplay += '<span style="position: absolute; right: -8px; font-size: 14px; color: red; font-weight: bold;">世</span>';
                        } else if (shiYingData.ying === actualYaoPosition) {
                            guaDisplay += '<span style="position: absolute; right: -8px; font-size: 14px; color: blue; font-weight: bold;">應</span>';
                        }
                    }
                    
                    guaDisplay += '</div>';
                    cells[2].innerHTML = guaDisplay;
                    console.log(`C列填入卦象和世應，第${actualYaoPosition}爻`);
                } else {
                    cells[2].innerHTML = '';
                }
                
                // D列：地支五行
                if (guaDetails && guaDetails.dizhiWuxing && guaDetails.dizhiWuxing[yaoIndex]) {
                    cells[3].textContent = guaDetails.dizhiWuxing[yaoIndex];
                    cells[3].innerHTML = guaDetails.dizhiWuxing[yaoIndex];
                    console.log(`D列填入地支五行: ${guaDetails.dizhiWuxing[yaoIndex]}`);
                } else {
                    cells[3].textContent = '--';
                    cells[3].innerHTML = '--';
                }
                
                // E列：六親
                if (guaDetails && guaDetails.liuqin && guaDetails.liuqin[yaoIndex]) {
                    cells[4].textContent = guaDetails.liuqin[yaoIndex];
                    cells[4].innerHTML = guaDetails.liuqin[yaoIndex];
                    console.log(`E列填入六親: ${guaDetails.liuqin[yaoIndex]}`);
                } else {
                    cells[4].textContent = '--';
                    cells[4].innerHTML = '--';
                }
                
                // F列：用神 - 暫時留空
                cells[5].textContent = '';
                cells[5].innerHTML = '';
                
                // 變卦部分
                if (hasMovingYao) {
                    // G列：變卦地支五行
                    if (bianGuaDetails && bianGuaDetails.dizhiWuxing && bianGuaDetails.dizhiWuxing[yaoIndex]) {
                        cells[6].textContent = bianGuaDetails.dizhiWuxing[yaoIndex];
                        cells[6].innerHTML = bianGuaDetails.dizhiWuxing[yaoIndex];
                    } else {
                        cells[6].textContent = '--';
                        cells[6].innerHTML = '--';
                    }
                    
                    // H列：變卦六親
                    if (bianGuaDetails && bianGuaDetails.liuqin && bianGuaDetails.liuqin[yaoIndex]) {
                        cells[7].textContent = bianGuaDetails.liuqin[yaoIndex];
                        cells[7].innerHTML = bianGuaDetails.liuqin[yaoIndex];
                    } else {
                        cells[7].textContent = '--';
                        cells[7].innerHTML = '--';
                    }
                    
                    // I列：變卦卦象
                    if (bianGuamaps[index]) {
                        cells[8].innerHTML = bianGuamaps[index];
                    } else {
                        cells[8].innerHTML = '';
                    }
                } else {
                    // 無動爻時，變卦部分全部清空
                    cells[6].textContent = '';
                    cells[6].innerHTML = '';
                    cells[7].textContent = '';
                    cells[7].innerHTML = '';
                    cells[8].innerHTML = '';
                    console.log('無動爻，變卦部分已清空');
                }
                
                // J列：卦變 - 暫時留空
                cells[9].textContent = '';
                cells[9].innerHTML = '';
                
                console.log(`第 ${index + 1} 行（第${actualYaoPosition}爻）數據填入完成`);
            }
        }
    });
setTimeout(() => {
    correctChangeGuaLiuqin();
}, 200);
    console.log('已將六爻結果完全重新填入卦表，包括正確的顯示順序和世應位置');
}

// 將數字起卦結果填入卦表的C1-C6位置
function fillNumberGuaTable() {
    const table = document.querySelector('.main-table');
    if (!table) {
        console.error('找不到主表格');
        return;
    }
    
    const rows = table.querySelectorAll('tr');
    const dataRows = Array.from(rows).filter(row => {
        const cells = row.querySelectorAll('td');
        return cells.length > 2 && /^[A-J][1-6]$/.test(cells[0].textContent.trim());
    });
    
    // 本卦卦象：使用 originalGua 生成，動爻標記為紅色
    const originalGuamaps = [];
    for (let i = 0; i < 6; i++) {
        const originalCode = window.numberGuaResult.originalGua[i];
        const isDongYao = (window.numberGuaResult.dongYao === i + 1); // 檢查是否為動爻
        
        let guaMap = createNumberGuaMap(originalCode);
        // 如果是動爻，將顏色改為紅色
        if (isDongYao) {
            guaMap = guaMap.replace(/color:\s*black/g, 'color: red');
        }
        originalGuamaps.push(guaMap);
    }
    
    // 表格顯示順序：從上到下對應上爻到初爻
    const guamaps = [
        originalGuamaps[5], // 上爻 (C6)
        originalGuamaps[4], // 五爻 (C5)
        originalGuamaps[3], // 四爻 (C4)
        originalGuamaps[2], // 三爻 (C3)
        originalGuamaps[1], // 二爻 (C2)
        originalGuamaps[0]  // 初爻 (C1)
    ];
    
    // 計算並更新卦名及詳細信息
    let guaNames = null;
    let guaDetails = null;
    let bianGuaDetails = null;
    let fushenData = null;
    let liushenData = null; // 添加六獸數據
    let shiYingData = null; // 添加世應數據
    
    if (typeof AdvancedCalculator !== 'undefined' && window.numberGuaResult) {
        console.log('數字起卦結果:', window.numberGuaResult);
        guaNames = AdvancedCalculator.calculateNumberGuaNames(window.numberGuaResult);
        console.log('計算得到的卦名:', guaNames);
        
        // 計算本卦地支五行和六親
        if (guaNames && guaNames.originalBinary) {
            guaDetails = AdvancedCalculator.calculateGuaComplete(guaNames.originalBinary);
            console.log('計算得到的本卦詳細信息:', guaDetails);
            
            // 計算世應位置
            shiYingData = AdvancedCalculator.calculateShiYing(guaNames.originalBinary);
            console.log('計算得到的世應位置:', shiYingData);
            
            // 計算伏神
            if (guaDetails.liuqin) {
                fushenData = AdvancedCalculator.calculateFushen(guaNames.originalBinary, guaDetails.liuqin);
                console.log('計算得到的伏神:', fushenData);
            }
        }
        
        // 計算六獸（添加這部分）
        const ganZhi = getCurrentGanZhi();
        const dayGan = ganZhi.day.charAt(0);
        if (typeof GuaCalculator !== 'undefined') {
            liushenData = GuaCalculator.getLiushen(dayGan);
            console.log('計算得到的六獸:', liushenData);
        }
        
        // 計算變卦地支五行和六親
        if (guaNames && guaNames.bianBinary) {
            bianGuaDetails = AdvancedCalculator.calculateGuaComplete(guaNames.bianBinary);
            console.log('計算得到的變卦詳細信息:', bianGuaDetails);
        }
        
        updateGuaNames(guaNames);
        console.log('數字起卦卦名已更新');
    }
    
    // 修正：變卦卦象完全使用 finalGua
    const bianGuamaps = [];
    for (let i = 0; i < 6; i++) {
        const finalCode = window.numberGuaResult.finalGua[i];
        bianGuamaps.push(createNumberGuaMap(finalCode));
    }
    // 變卦也要按表格順序反轉
    const bianGuamapsReverse = [
        bianGuamaps[5], // 上爻
        bianGuamaps[4], // 五爻
        bianGuamaps[3], // 四爻
        bianGuamaps[2], // 三爻
        bianGuamaps[1], // 二爻
        bianGuamaps[0]  // 初爻
    ];
    
    dataRows.forEach((row, index) => {
        if (index < 6) {
            const cells = row.querySelectorAll('td');
            if (cells.length > 9) {
                const yaoIndex = 5 - index; // 轉換為從下到上的索引
                const actualYaoPosition = yaoIndex + 1; // 爻位：1-6
                
                // A列：顯示六獸（修正）
                if (liushenData && liushenData[yaoIndex]) {
                    cells[0].innerHTML = `<div style="text-align: center; font-size: 14px; font-weight: bold;">${liushenData[yaoIndex]}</div>`;
                    console.log(`A列填入六獸: ${liushenData[yaoIndex]}`);
                } else {
                    cells[0].innerHTML = '';
                }
                
                // B列：伏神
                if (fushenData && fushenData[yaoIndex] && fushenData[yaoIndex].trim() !== '') {
                    let updatedFushen = fushenData[yaoIndex];
                    updatedFushen = updatedFushen.replace(/font-size:\s*10px/g, 'font-size: 14px');
                    cells[1].innerHTML = updatedFushen;
                    console.log(`B列填入伏神: ${fushenData[yaoIndex]}`);
                } else {
                    cells[1].innerHTML = '';
                }
                
                // C列：卦象（加入世應顯示，右側對齊）（修正）
                if (guamaps[index]) {
                    let guaDisplay = `<div style="display: flex; align-items: center; justify-content: center; position: relative;">`;
                    guaDisplay += `<span style="text-align: center;">${guamaps[index]}</span>`;
                    
                    // 添加世應標記，顯示在右側
                    if (shiYingData) {
                        if (shiYingData.shi === actualYaoPosition) {
                            guaDisplay += '<span style="position: absolute; right: -8px; font-size: 14px; color: red; font-weight: bold;">世</span>';
                        } else if (shiYingData.ying === actualYaoPosition) {
                            guaDisplay += '<span style="position: absolute; right: -8px; font-size: 14px; color: blue; font-weight: bold;">應</span>';
                        }
                    }
                    
                    guaDisplay += '</div>';
                    cells[2].innerHTML = guaDisplay;
                    console.log(`C列填入卦象和世應，第${actualYaoPosition}爻`);
                } else {
                    cells[2].innerHTML = '';
                }
                
                // D列：地支五行（索引3）
                if (guaDetails && guaDetails.dizhiWuxing) {
                    cells[3].textContent = guaDetails.dizhiWuxing[yaoIndex] || '--';
                } else {
                    cells[3].textContent = '--';
                }
                
                // E列：六親（索引4）
                if (guaDetails && guaDetails.liuqin) {
                    cells[4].textContent = guaDetails.liuqin[yaoIndex] || '--';
                } else {
                    cells[4].textContent = '--';
                }
                // F列：用神 - 保持空白
                if (cells.length > 5) {
                    cells[5].textContent = '';
                    cells[5].innerHTML = '';
                }
                
                // 變卦部分
                // G列：地支五行（索引6）
                if (bianGuaDetails && bianGuaDetails.dizhiWuxing) {
                    cells[6].textContent = bianGuaDetails.dizhiWuxing[yaoIndex] || '--';
                } else {
                    cells[6].textContent = '--';
                }
                
                // H列：六親（索引7）
                if (bianGuaDetails && bianGuaDetails.liuqin) {
                    cells[7].textContent = bianGuaDetails.liuqin[yaoIndex] || '--';
                } else {
                    cells[7].textContent = '--';
                }
                
                // I列：變卦卦象（索引8）
                cells[8].innerHTML = bianGuamapsReverse[index];
                // J列：卦變 - 保持空白
                if (cells.length > 9) {
                    cells[9].textContent = '';
                    cells[9].innerHTML = '';
                }
            }
        }
    });
setTimeout(() => {
    correctChangeGuaLiuqin();
}, 200);
    console.log('已將數字起卦結果填入卦表，包含動爻紅色標記、六獸、世應、伏神');
}
    
// ==================== 其他功能函數 ====================

// 顯示主卦表
function showMainTable() {
    console.log('showMainTable 函數被調用');
    const mainTableSection = document.getElementById('main-table-section');
    console.log('main-table-section 元素:', mainTableSection);
    
    if (mainTableSection) {
        console.log('移除 hidden 類別前，元素狀態:', {
            classList: mainTableSection.className,
            display: window.getComputedStyle(mainTableSection).display,
            visibility: window.getComputedStyle(mainTableSection).visibility
        });
        
        mainTableSection.classList.remove('hidden');
        mainTableSection.style.display = 'block';
        
        console.log('移除 hidden 類別後，元素狀態:', {
            classList: mainTableSection.className,
            display: window.getComputedStyle(mainTableSection).display,
            visibility: window.getComputedStyle(mainTableSection).visibility
        });
        
        console.log('主卦表已顯示');
    } else {
        console.error('找不到主卦表元素');
    }
}

// 返回起卦界面
// 修正版：返回起卦功能 - 直接重新載入頁面
function backToSection1() {
    console.log('返回起卦：重新載入頁面');
    
    // 直接重新載入頁面，這會清除所有變數和狀態
    window.location.reload();
}

// 開始起卦功能 - 修改為直接顯示卦表
function startDivination() {
    console.log('startDivination 函數被調用');
    
    const methodSelect = document.getElementById('divination-method');
    if (!methodSelect) {
        alert('找不到起卦方式選擇器');
        return;
    }
    
    const method = methodSelect.value;
    if (!method) {
        alert('請選擇起卦方式');
        return;
    }
        // 檢查用神選擇
    const yongshenSelect = document.getElementById('yongshen-method');
    if (!yongshenSelect || !yongshenSelect.value) {
        alert('請先選擇用神');
        return;
    }
    console.log('選擇的起卦方式:', method);
    
    // 隱藏起卦方式和起卦日期選擇行
    const methodRow = document.getElementById('method-selection-row');
    const dateRow = document.getElementById('date-selection-row');
    if (methodRow) methodRow.style.display = 'none';
    if (dateRow) dateRow.style.display = 'none';
    
    // 顯示五行旺衰表和神煞表
    const wuxingTable = document.getElementById('wuxing-table');
    const shenshaTable = document.getElementById('shensha-table');
    console.log('五行旺衰表元素:', wuxingTable);
    console.log('神煞表元素:', shenshaTable);
    if (wuxingTable) {
        wuxingTable.classList.remove('hidden');
        // 強制設定樣式
        wuxingTable.style.visibility = 'visible';
        wuxingTable.style.opacity = '1';
        wuxingTable.style.display = 'table';
        console.log('五行旺衰表已顯示');
    }
    if (shenshaTable) {
        shenshaTable.classList.remove('hidden');
        // 強制設定樣式
        shenshaTable.style.visibility = 'visible';
        shenshaTable.style.opacity = '1';
        shenshaTable.style.display = 'table';
        console.log('神煞表已顯示');
    }
    
    // 如果是六爻起卦且已有擲幣結果，將guamap放入卦表並顯示
    if (method === 'liuyao' && window.guamap1) {
        console.log('六爻起卦：開始填入卦表並顯示');
        fillLiuyaoGuaTable();
        showResult('六爻起卦完成，已將結果放入卦表');
        console.log('六爻起卦：即將調用 showMainTable()');
        showMainTable(); // 直接顯示卦表
        console.log('六爻起卦：showMainTable() 調用完成');
        
setTimeout(() => {
    handleYongshenSelection();
    // 添加卦變分析
    setTimeout(() => {
        analyzeGuabian();
        // 添加日月關係分析
        setTimeout(() => {
            analyzeYaoRiyue();
        }, 100);
    }, 100);
}, 500);
        triggerLearningModeAfterDivination();
        return;
    }
    
    // 如果是數字起卦且已有結果，將結果放入卦表並顯示
    if (method === 'number' && window.numberGuaResult) {
        fillNumberGuaTable();
        showResult('數字起卦完成，已將結果放入卦表');
        showMainTable(); // 直接顯示卦表
        
setTimeout(() => {
    handleYongshenSelection();
    // 添加卦變分析
    setTimeout(() => {
        analyzeGuabian();
        // 添加日月關係分析
        setTimeout(() => {
            analyzeYaoRiyue();
        }, 100);
    }, 100);
}, 500);
        triggerLearningModeAfterDivination();
        return;
    }
    
    // 時間起卦的處理
    if (method === 'time') {
        console.log('開始處理時間起卦');
        
        // 執行時間起卦邏輯
        timeBasedDivination();
        
        // 填入卦表
        fillTimeGuaTable();
        
        showResult('時間起卦完成，已將結果放入卦表');
        showMainTable();
        
setTimeout(() => {
    handleYongshenSelection();
    // 添加卦變分析
    setTimeout(() => {
        analyzeGuabian();
        // 添加日月關係分析
        setTimeout(() => {
            analyzeYaoRiyue();
        }, 100);
    }, 100);
}, 500);
        triggerLearningModeAfterDivination();
        return;
    }
    
    // 隨機起卦的處理
    if (method === 'random') {
        console.log('開始處理隨機起卦');
        
        // 先執行隨機起卦邏輯
        randomDivination();
        
        // 然後使用六爻起卦的填表邏輯
        fillLiuyaoGuaTable(); // 使用六爻起卦的完整填表功能
        
        showResult('隨機起卦完成，已將結果放入卦表');
        showMainTable();
        
setTimeout(() => {
    handleYongshenSelection();
    // 添加卦變分析
    setTimeout(() => {
        analyzeGuabian();
        // 添加日月關係分析
        setTimeout(() => {
            analyzeYaoRiyue();
        }, 100);
    }, 100);
}, 500);
        triggerLearningModeAfterDivination();
        return;
    }
    
    // 其他起卦方式提示用戶先完成設置
    if (method === 'liuyao' && !window.guamap1) {
        // 重新顯示選擇行，因為需要用戶完成輸入
        if (methodRow) methodRow.style.display = 'flex';
        if (dateRow) dateRow.style.display = 'flex';
        showResult('請先完成六爻擲幣輸入');
        return;
    }
    
    if (method === 'number' && !window.numberGuaResult) {
        // 重新顯示選擇行，因為需要用戶完成輸入
        if (methodRow) methodRow.style.display = 'flex';
        if (dateRow) dateRow.style.display = 'flex';
        showResult('請先完成數字起卦輸入');
        return;
    }
    
    // 預設處理
    showResult('起卦方式：' + method);
    showMainTable(); // 直接顯示卦表
    
setTimeout(() => {
    handleYongshenSelection();
    // 添加卦變分析
    setTimeout(() => {
        analyzeGuabian();
        // 添加日月關係分析
        setTimeout(() => {
            analyzeYaoRiyue();
        }, 100);
    }, 100);
}, 500);
triggerLearningModeAfterDivination();
}

// 隨機起卦功能 - 調整機率版本
function randomDivination() {
    console.log('開始執行隨機起卦');
    
    // 生成有權重的隨機六爻結果
    const results = [];
    for (let i = 0; i < 6; i++) {
        results.push(generateWeightedRandom());
    }
    
    console.log('隨機生成的六爻結果:', results);
    
    // 存儲到全域變數 - 與手動六爻起卦完全一致
    window.dice1 = results[0];
    window.dice2 = results[1];
    window.dice3 = results[2];
    window.dice4 = results[3];
    window.dice5 = results[4];
    window.dice6 = results[5];
    
    // 建立所有必要的全域變數
    window.Yinyuang1 = (window.dice1 === 0 || window.dice1 === 2) ? 0 : 1;
    window.Yinyuang2 = (window.dice2 === 0 || window.dice2 === 2) ? 0 : 1;
    window.Yinyuang3 = (window.dice3 === 0 || window.dice3 === 2) ? 0 : 1;
    window.Yinyuang4 = (window.dice4 === 0 || window.dice4 === 2) ? 0 : 1;
    window.Yinyuang5 = (window.dice5 === 0 || window.dice5 === 2) ? 0 : 1;
    window.Yinyuang6 = (window.dice6 === 0 || window.dice6 === 2) ? 0 : 1;
    
    window.guamap1 = createGuaMap(window.dice1);
    window.guamap2 = createGuaMap(window.dice2);
    window.guamap3 = createGuaMap(window.dice3);
    window.guamap4 = createGuaMap(window.dice4);
    window.guamap5 = createGuaMap(window.dice5);
    window.guamap6 = createGuaMap(window.dice6);
    
    console.log('隨機起卦數據準備完成');
    
    const hasMovingYao = results.some(dice => dice === 0 || dice === 3);
    const resultText = `隨機起卦完成：${results.join(', ')}${hasMovingYao ? ' (有動爻)' : ' (無動爻)'}`;
    showResult(resultText);
}

/**
 * 產生有權重的隨機數
 * 0: 12.5% (0.125)
 * 1: 37.5% (0.375) 
 * 2: 37.5% (0.375)
 * 3: 12.5% (0.125)
 */
function generateWeightedRandom() {
    const random = Math.random(); // 0-1 之間的隨機數
    
    if (random < 0.125) {
        return 0; // 老陰，機率 12.5%
    } else if (random < 0.5) {
        return 1; // 少陽，機率 37.5% (0.125 + 0.375)
    } else if (random < 0.875) {
        return 2; // 少陰，機率 37.5% (0.5 + 0.375)
    } else {
        return 3; // 老陽，機率 12.5% (0.875 + 0.125)
    }
}

// 更新指定日期的干支
function updateSpecificDate() {
    const dateInput = document.getElementById('specific-date');
    const timeInput = document.getElementById('specific-time');
    
    if (!dateInput.value) {
        alert('請先選擇日期');
        return;
    }
    
    let selectedDate = new Date(dateInput.value);
    
    // 如果有指定時間，加入時間
    if (timeInput.value) {
        const [hours, minutes] = timeInput.value.split(':');
        selectedDate.setHours(parseInt(hours), parseInt(minutes));
    }
    
    const ganZhi = calculateGanZhiForDate(selectedDate);
    
    // 更新顯示
    const elements = {
        t1: document.getElementById('t1'),
        t2: document.getElementById('t2'),
        t3: document.getElementById('t3'),
        t4: document.getElementById('t4'),
        k: document.getElementById('k')
    };
    
    if (elements.t1) elements.t1.textContent = ganZhi.year || '乙巳';
    if (elements.t2) elements.t2.textContent = ganZhi.month || '乙酉';
    if (elements.t3) elements.t3.textContent = ganZhi.day || '己卯';
    if (elements.t4) elements.t4.textContent = ganZhi.time || '甲戌';
    
    // 計算旬空
    if (elements.k && typeof GuaCalculator !== 'undefined' && ganZhi.day) {
        try {
            const xunKong = GuaCalculator.getXunKongDisplay(ganZhi.day);
            elements.k.textContent = xunKong;
        } catch (error) {
            elements.k.textContent = '申、酉';
        }
    }
    
    // 更新五行神煞
    updateWuxingDisplay();
}

// 更新干支日期
function updateGanzhiDate() {
    // 此功能需要根據干支反推日期，暫時保留空實作
    alert('干支日期更新功能待實作');
}

//=============================================爻變查詢
// 新增：分析卦變關係並更新J欄
function analyzeGuabian() {
    console.log('開始分析卦變關係');
    
    // 獲取當前干支信息（用於旬空）
    const ganZhi = getCurrentGanZhi();
    let xunKong = [];
    
    // 獲取旬空信息
    if (typeof GuaCalculator !== 'undefined' && ganZhi.day) {
        try {
            const xunKongStr = GuaCalculator.getXunKongDisplay(ganZhi.day);
            // 修正：正確分割旬空字符串
            xunKong = xunKongStr.split('、').map(zhi => zhi.trim()); // 使用頓號分割並去除空格
            console.log('旬空地支:', xunKong);
            console.log('旬空原始字符串:', xunKongStr);
        } catch (error) {
            console.log('無法獲取旬空信息');
        }
    }
    
    // 獲取動爻信息
    const dongYaoList = getDongYaoList();
    console.log('動爻列表:', dongYaoList);
    
    if (dongYaoList.length === 0) {
        console.log('沒有動爻，跳過卦變分析');
        return;
    }
    
    // 分析每個動爻
    dongYaoList.forEach(yaoPosition => {
        const analysis = analyzeYaoGuabian(yaoPosition, xunKong);
        updateJColumn(yaoPosition, analysis);
    });
}

// 獲取動爻列表
function getDongYaoList() {
    const dongYaoList = [];
    
    // 根據不同的起卦方式獲取動爻
    if (window.dice1 !== undefined) {
        // 六爻起卦或隨機起卦
        const liuyaoResults = [window.dice1, window.dice2, window.dice3, window.dice4, window.dice5, window.dice6];
        console.log('六爻結果檢查:', liuyaoResults);
        
        liuyaoResults.forEach((dice, index) => {
            const yaoPosition = index + 1; // 第1爻到第6爻
            console.log(`第${yaoPosition}爻值: ${dice}, 是否為動爻: ${dice === 0 || dice === 3}`);
            if (dice === 0 || dice === 3) { // 老陰或老陽為動爻
                dongYaoList.push(yaoPosition);
            }
        });
    } else if (window.numberGuaResult && window.numberGuaResult.dongYao > 0) {
        // 數字起卦
        dongYaoList.push(window.numberGuaResult.dongYao);
    } else if (window.timeGuaResult && window.timeGuaResult.dongYao > 0) {
        // 時間起卦
        dongYaoList.push(window.timeGuaResult.dongYao);
    }
    
    console.log('最終動爻列表:', dongYaoList);
    return dongYaoList;
}

// 獲取指定爻位的地支
function getYaoDizhi(yaoPosition, type) {
    console.log(`獲取第${yaoPosition}爻的${type === 'ben' ? '本卦' : '變卦'}地支`);
    
    const table = document.querySelector('.main-table');
    if (!table) return null;
    
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // 尋找包含六親的數據行
    let dataRows = [];
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 9) {
            const liuqinCell = cells[4].textContent.trim();
            const cleanLiuqin = liuqinCell.replace(/[用元忌]/g, '').trim();
            
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(cleanLiuqin)) {
                dataRows.push({
                    row: row,
                    rowIndex: rowIndex,
                    yaoPos: dataRows.length + 1 // 第1爻=1, 第2爻=2, ..., 第6爻=6
                });
            }
        }
    });
    
    console.log(`getYaoDizhi找到${dataRows.length}個數據行`);
    
    // 找到目標爻位的行 - 修正：數據行順序是從第6爻到第1爻
    const targetIndex = 6 - yaoPosition; // 第6爻=0, 第5爻=1, ..., 第1爻=5
    
    if (targetIndex >= 0 && targetIndex < dataRows.length) {
        const cells = dataRows[targetIndex].row.querySelectorAll('td');
        let result = '';
        
        if (type === 'ben') {
            // 本卦地支五行在第4列（索引3）
            result = cells[3].textContent.trim();
        } else if (type === 'bian') {
            // 變卦地支五行在第7列（索引6）
            result = cells[6].textContent.trim();
        }
        
        console.log(`第${yaoPosition}爻${type === 'ben' ? '本卦' : '變卦'}地支: ${result}`);
        
        // 過濾掉無效數據
        if (result === '地支五行' || result === '--' || result === '') {
            console.log(`第${yaoPosition}爻地支數據無效: ${result}`);
            return null;
        }
        
        return result;
    }
    
    console.log(`無法定位第${yaoPosition}爻`);
    return null;
}

// 修正：更新J欄顯示 - 改善樣式
function updateJColumn(yaoPosition, analysis) {
    if (!analysis) return;
    
    console.log(`更新第${yaoPosition}爻的J欄: ${analysis}`);
    
    const table = document.querySelector('.main-table');
    if (!table) return;
    
    const rows = Array.from(table.querySelectorAll('tr'));
    
    let dataRows = [];
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 10) {
            const liuqinCell = cells[4].textContent.trim();
            const cleanLiuqin = liuqinCell.replace(/[用元忌]/g, '').trim();
            
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(cleanLiuqin)) {
                dataRows.push(row);
            }
        }
    });
    
    const targetIndex = 6 - yaoPosition;
    
    if (targetIndex >= 0 && targetIndex < dataRows.length) {
        const targetRow = dataRows[targetIndex];
        const cells = targetRow.querySelectorAll('td');
        
        if (cells.length >= 10) {
            const jCell = cells[9]; // J列
            jCell.textContent = analysis;
            
            // 根據文字長度動態調整字體大小
            const textLength = analysis.length;
            let fontSize = '14px'; // 預設與六獸相同
            if (textLength > 8) fontSize = '12px';
            if (textLength > 12) fontSize = '10px';
            if (textLength > 16) fontSize = '9px';
            
            jCell.style.fontSize = fontSize;
            jCell.style.fontWeight = 'bold';
            jCell.style.color = getAnalysisColor(analysis);
            jCell.style.textAlign = 'left';
            jCell.style.wordWrap = 'break-word';
            jCell.style.whiteSpace = 'normal';
            jCell.style.overflow = 'hidden';
            
            console.log(`第${yaoPosition}爻J欄已更新為: ${analysis}`);
        }
    }
}

//根據日月關係分析結果設置顏色
function getFColumnColor(analysis) {
    if (!analysis) return '#000000';
    
    // 定義吉凶分類
    const jiConditions = ['日建', '月令', '日生', '月生', '合起'];
    const xiongConditions = ['日沖', '月破', '日克', '月克', '合絆'];
    
    // 檢查是否包含吉的條件
    const hasJi = jiConditions.some(condition => analysis.includes(condition));
    // 檢查是否包含凶的條件
    const hasXiong = xiongConditions.some(condition => analysis.includes(condition));
    
    if (hasJi && hasXiong) {
        // 既有吉又有凶，使用混合色（橙色）
        return '#ff8c00';
    } else if (hasJi) {
        // 只有吉，使用綠色
        return '#28a745';
    } else if (hasXiong) {
        // 只有凶，使用紅色
        return '#dc3545';
    } else {
        // 其他情況，使用黑色
        return '#000000';
    }
}

// 修正：分析單個爻的卦變關係 - 添加回頭沖判斷
function analyzeYaoGuabian(yaoPosition, xunKong) {
    console.log(`分析第${yaoPosition}爻的卦變關係`);
    
    // 獲取本卦和變卦的地支五行
    const benGuaDizhi = getYaoDizhi(yaoPosition, 'ben');
    const bianGuaDizhi = getYaoDizhi(yaoPosition, 'bian');
    
    if (!benGuaDizhi || !bianGuaDizhi) {
        console.log(`第${yaoPosition}爻無法獲取地支信息`);
        return '';
    }
    
    console.log(`第${yaoPosition}爻 - 本卦:${benGuaDizhi}, 變卦:${bianGuaDizhi}`);
    
    // 提取地支和五行
    const benGuaZhi = benGuaDizhi.charAt(0);
    const benGuaWuxing = benGuaDizhi.charAt(1);
    const bianGuaZhi = bianGuaDizhi.charAt(0);
    const bianGuaWuxing = bianGuaDizhi.charAt(1);
    
    console.log(`第${yaoPosition}爻 - 本卦地支:${benGuaZhi}(${benGuaWuxing}), 變卦地支:${bianGuaZhi}(${bianGuaWuxing})`);
    
    // 收集所有符合的條件
    const conditions = [];
    
    // 1. 檢查化墓、化絕
    if (WUXING_CHANGSHENG[benGuaWuxing]) {
        const changsheng = WUXING_CHANGSHENG[benGuaWuxing];
        if (bianGuaZhi === changsheng.mu) {
            conditions.push('化墓');
        }
        if (bianGuaZhi === changsheng.jue) {
            conditions.push('化絕');
        }
    }
    
    // 2. 檢查化空
    if (xunKong.includes(bianGuaZhi)) {
        conditions.push('化空');
    }
    
    // 3. 檢查進退神
    if (JINTUISHEN[benGuaZhi] === bianGuaZhi) {
        // 本卦地支 > 變卦地支，為化進神
        conditions.push('化進神');
    }
    
    // 檢查化退神（反向查找）
    for (const [key, value] of Object.entries(JINTUISHEN)) {
        if (key === bianGuaZhi && value === benGuaZhi) {
            // 變卦地支 > 本卦地支，為化退神
            conditions.push('化退神');
            break;
        }
    }
    
    // 4. 檢查回頭沖
    if (DIZHI_CHONGHE[benGuaZhi] && DIZHI_CHONGHE[benGuaZhi].chong === bianGuaZhi) {
        conditions.push('回頭沖');
    }
    
    // 5. 檢查化扶（地支合）
    if (DIZHI_CHONGHE[benGuaZhi] && DIZHI_CHONGHE[benGuaZhi].he === bianGuaZhi) {
        conditions.push('化扶');
    }
    
    // 6. 檢查回頭克
    if (WUXING_SHENGKE[bianGuaWuxing] && WUXING_SHENGKE[bianGuaWuxing].ke === benGuaWuxing) {
        conditions.push('回頭克');
    }
    
    // 7. 檢查回頭生
    if (WUXING_SHENGKE[bianGuaWuxing] && WUXING_SHENGKE[bianGuaWuxing].sheng === benGuaWuxing) {
        conditions.push('回頭生');
    }
    
    // 用空格連接所有條件
    const result = conditions.join(' ');
    console.log(`第${yaoPosition}爻卦變分析結果: ${result}`);
    
    return result;
}

// 修正：根據分析結果設置顏色 - 添加回頭沖
function getAnalysisColor(analysis) {
    if (!analysis) return '#000000';
    
    // 檢查是否包含不利條件
    const unfavorable = ['化墓', '化絕', '化空', '回頭克', '化退神', '回頭沖'];
    const favorable = ['回頭生', '化扶', '化進神'];
    
    const hasUnfavorable = unfavorable.some(condition => analysis.includes(condition));
    const hasFavorable = favorable.some(condition => analysis.includes(condition));
    
    if (hasUnfavorable && hasFavorable) {
        // 既有有利又有不利，使用橙色表示混合
        return '#ff8c00';
    } else if (hasFavorable) {
        // 只有有利條件，使用紅色
        return '#dc3545';
    } else {
        // 只有不利條件或無條件，使用黑色
        return '#000000';
    }
}
//====================分析本卦各爻與日月的關係=============
// 新增：分析爻與日月的關係
function analyzeYaoRiyue() {
    console.log('開始分析爻與日月關係');
    
    // 獲取當前干支
    const ganZhi = getCurrentGanZhi();
    const dayZhi = ganZhi.day.charAt(1);
    const monthZhi = ganZhi.month.charAt(1);
    const dayWuxing = getDizhiWuxing(dayZhi);
    const monthWuxing = getDizhiWuxing(monthZhi);
    
    console.log(`日支: ${dayZhi}(${dayWuxing}), 月支: ${monthZhi}(${monthWuxing})`);
    
    // 分析每一爻
    for (let yaoPosition = 1; yaoPosition <= 6; yaoPosition++) {
        const yaoInfo = getYaoInfo(yaoPosition);
        if (!yaoInfo) continue;
        
        const analysis = analyzeYaoRiyueRelation(yaoPosition, yaoInfo, dayZhi, monthZhi, dayWuxing, monthWuxing);
        updateFColumn(yaoPosition, analysis);
    }
}

// 獲取爻的完整信息
function getYaoInfo(yaoPosition) {
    const dizhiWuxing = getYaoDizhi(yaoPosition, 'ben'); // 本卦地支五行
    if (!dizhiWuxing) return null;
    
    const zhi = dizhiWuxing.charAt(0);
    const wuxing = dizhiWuxing.charAt(1);
    const isDongYao = isDongYaoPosition(yaoPosition);
    
    return {
        zhi: zhi,
        wuxing: wuxing,
        isDongYao: isDongYao
    };
}

// 檢查是否為動爻
function isDongYaoPosition(yaoPosition) {
    const dongYaoList = getDongYaoList();
    return dongYaoList.includes(yaoPosition);
}

// 根據地支獲取五行
function getDizhiWuxing(zhi) {
    const zhiWuxingMap = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
    return zhiWuxingMap[zhi] || '';
}

// 分析單個爻與日月的關係
function analyzeYaoRiyueRelation(yaoPosition, yaoInfo, dayZhi, monthZhi, dayWuxing, monthWuxing) {
    console.log(`分析第${yaoPosition}爻與日月關係: ${yaoInfo.zhi}(${yaoInfo.wuxing}), 動爻: ${yaoInfo.isDongYao}`);
    
    const conditions = [];
    
    // 1. 檢查日建
    if (yaoInfo.zhi === dayZhi) {
        conditions.push('日建');
    }
    
    // 2. 檢查月令
    if (yaoInfo.zhi === monthZhi) {
        conditions.push('月令');
    }
    
    // 3. 檢查月破（與月支沖）
    if (DIZHI_CHONGHE[yaoInfo.zhi] && DIZHI_CHONGHE[yaoInfo.zhi].chong === monthZhi) {
        conditions.push('月破');
    }
    
    // 4. 檢查日沖（與日支沖）
    if (DIZHI_CHONGHE[yaoInfo.zhi] && DIZHI_CHONGHE[yaoInfo.zhi].chong === dayZhi) {
        conditions.push('日沖');
    }
    
    // 5-6. 檢查合的關係
    const heWithDay = DIZHI_CHONGHE[yaoInfo.zhi] && DIZHI_CHONGHE[yaoInfo.zhi].he === dayZhi;
    const heWithMonth = DIZHI_CHONGHE[yaoInfo.zhi] && DIZHI_CHONGHE[yaoInfo.zhi].he === monthZhi;
    
    if (heWithDay || heWithMonth) {
        if (yaoInfo.isDongYao) {
            conditions.push('合絆'); // 動爻與日或月合
        } else {
            conditions.push('合起'); // 靜爻與日或月合
        }
    }
    
    // 7. 檢查日生（日的五行生爻的五行）
    if (WUXING_SHENGKE[dayWuxing] && WUXING_SHENGKE[dayWuxing].sheng === yaoInfo.wuxing) {
        conditions.push('日生');
    }
    
    // 8. 檢查日克（日的五行克爻的五行）
    if (WUXING_SHENGKE[dayWuxing] && WUXING_SHENGKE[dayWuxing].ke === yaoInfo.wuxing) {
        conditions.push('日克');
    }
    
    // 9. 檢查月生（月的五行生爻的五行）
    if (WUXING_SHENGKE[monthWuxing] && WUXING_SHENGKE[monthWuxing].sheng === yaoInfo.wuxing) {
        conditions.push('月生');
    }
    
    // 10. 檢查月克（月的五行克爻的五行）
    if (WUXING_SHENGKE[monthWuxing] && WUXING_SHENGKE[monthWuxing].ke === yaoInfo.wuxing) {
        conditions.push('月克');
    }
    
    const result = conditions.join(' ');
    console.log(`第${yaoPosition}爻日月關係分析結果: ${result}`);
    
    return result;
}

// 修正：更新F欄顯示 - 分色顯示不同條件
function updateFColumn(yaoPosition, analysis) {
    if (!analysis) return;
    
    console.log(`更新第${yaoPosition}爻的F欄: ${analysis}`);
    
    const table = document.querySelector('.main-table');
    if (!table) return;
    
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // 尋找包含六親的數據行
    let dataRows = [];
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            const liuqinCell = cells[4].textContent.trim();
            const cleanLiuqin = liuqinCell.replace(/[用元忌]/g, '').trim();
            
            if (['兄弟', '父母', '子孫', '妻財', '官鬼'].includes(cleanLiuqin)) {
                dataRows.push(row);
            }
        }
    });
    
    const targetIndex = 6 - yaoPosition;
    
    if (targetIndex >= 0 && targetIndex < dataRows.length) {
        const targetRow = dataRows[targetIndex];
        const cells = targetRow.querySelectorAll('td');
        
        if (cells.length >= 6) {
            const fCell = cells[5]; // F列
            
            // 創建分色的HTML內容
            const coloredHTML = createColoredFColumnHTML(analysis);
            fCell.innerHTML = coloredHTML;
            
            // 根據文字長度動態調整字體大小
            const textLength = analysis.length;
            let fontSize = '14px';
            if (textLength > 8) fontSize = '12px';
            if (textLength > 12) fontSize = '10px';
            if (textLength > 16) fontSize = '9px';
            
            fCell.style.fontSize = fontSize;
            fCell.style.fontWeight = 'bold';
            fCell.style.textAlign = 'left';
            fCell.style.wordWrap = 'break-word';
            fCell.style.whiteSpace = 'normal';
            fCell.style.overflow = 'hidden';
            
            console.log(`第${yaoPosition}爻F欄已更新為: ${analysis}`);
        }
    }
}

// 新增：創建分色的F欄HTML內容
function createColoredFColumnHTML(analysis) {
    if (!analysis) return '';
    
    // 定義吉凶分類和對應顏色
    const jiConditions = ['日建', '月令', '日生', '月生', '合起'];
    const xiongConditions = ['日沖', '月破', '日克', '月克', '合絆'];
    
    // 分割條件（以空格分隔）
    const conditions = analysis.split(' ').filter(item => item.trim());
    
    // 為每個條件設置顏色
    const coloredConditions = conditions.map(condition => {
        let color = '#000000'; // 預設黑色
        
        if (jiConditions.includes(condition)) {
            color = '#28a745'; // 綠色
        } else if (xiongConditions.includes(condition)) {
            color = '#dc3545'; // 紅色
        }
        
        return `<span style="color: ${color};">${condition}</span>`;
    });
    
    // 用空格連接
    return coloredConditions.join(' ');
}
// ==================== 批卦功能 ====================

// 切換批卦區域顯示/隱藏
function togglePiguaSection() {
    const piguaSection = document.getElementById('pigua-section');
    const piguaBtn = document.getElementById('pigua-btn');
    
    if (piguaSection.classList.contains('hidden')) {
        // 顯示批卦區域
        piguaSection.classList.remove('hidden');
        piguaBtn.textContent = '關閉';
        
        // 設置預設批卦日期為今天
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pigua-date').value = today;
        
        console.log('批卦區域已開啟');
    } else {
        // 隱藏批卦區域
        piguaSection.classList.add('hidden');
        piguaBtn.textContent = '批卦';
        console.log('批卦區域已關閉');
    }
}

// 儲存批卦內容
// 簡化版本：直接使用雲端儲存函數
async function savePiguaContent() {
    await savePiguaContentWithCloud();
}

// 收集批卦資料
function collectPiguaData() {
    // 收集基本資訊
    const piguaInfo = {
        date: document.getElementById('pigua-date').value,
        questioner: document.getElementById('questioner-name').value.trim(),
        phone: document.getElementById('questioner-phone').value.trim(),
        content: document.getElementById('pigua-content').value.trim()
    };
    
    // 收集起卦資料
    const divinationData = collectDivinationData();
    
    return {
        version: '1.0',
        saveDate: new Date().toISOString(),
        pigua: piguaInfo,
        divination: divinationData
    };
}

// 收集起卦資料
function collectDivinationData() {
    const ganZhi = getCurrentGanZhi();
    let method = '';
    let data = {};
    
    // 判斷使用的起卦方式
    if (window.dice1 !== undefined) {
        method = 'liuyao';
        data.dice = [window.dice1, window.dice2, window.dice3, window.dice4, window.dice5, window.dice6];
    } else if (window.numberGuaResult) {
        method = 'number';
        data.numbers = {
            x1: window.numberGuaResult.upperGuaName,
            x2: window.numberGuaResult.lowerGuaName,
            dongYao: window.numberGuaResult.dongYao
        };
    } else if (window.timeGuaResult) {
        method = 'time';
        data.timeData = window.timeGuaResult;
    } else {
        method = 'unknown';
    }
    
    // 獲取用神選擇
    const yongshenSelect = document.getElementById('yongshen-method');
    const yongshen = yongshenSelect ? yongshenSelect.value : '';
    
    return {
        method: method,
        yongshen: yongshen,
        ganzhi: ganZhi,
        data: data
    };
}

// 驗證批卦資料
function validatePiguaData(data) {
    if (!data.pigua.date) {
        alert('請選擇批卦日期');
        return false;
    }
    
    if (!data.pigua.questioner) {
        alert('請輸入問卦者姓名');
        return false;
    }
    
    if (!data.pigua.content) {
        alert('請輸入批卦內容');
        return false;
    }
    
    return true;
}

// 清除批卦內容
function clearPiguaContent() {
    if (confirm('確定要清除所有批卦內容嗎？')) {
        document.getElementById('questioner-name').value = '';
        document.getElementById('questioner-phone').value = '';
        document.getElementById('pigua-content').value = '';
        
        // 重設批卦日期為今天
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pigua-date').value = today;
        
        console.log('批卦內容已清除');
    }
}

// 顯示JSON下載對話框
function showJsonDownloadDialog(piguaData) {
    // 檢查是否已經設定不再提醒
    if (localStorage.getItem('skipJsonDownload') === 'true') {
        return;
    }
    
    // 創建對話框
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;
    
modalContent.innerHTML = `
    <h3 style="margin: 0 0 20px 0;">下載本地備份</h3>
    <p style="margin: 0 0 20px 0; line-height: 1.5;">
        記錄已儲存到雲端。<br>
        是否要下載本地 JSON 備份檔案？
    </p>
        <div style="margin: 20px 0;">
            <label style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <input type="checkbox" id="skip-reminder" />
                <span>下次不要再提醒我</span>
            </label>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="download-json-btn" style="background: #28a745; color: white; border: none; padding: 12px 25px; border-radius: 4px; cursor: pointer;">確定下載</button>
            <button id="skip-json-btn" style="background: #6c757d; color: white; border: none; padding: 12px 25px; border-radius: 4px; cursor: pointer;">跳過</button>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // 添加事件監聽器
    document.getElementById('download-json-btn').onclick = function() {
        const skipReminder = document.getElementById('skip-reminder').checked;
        if (skipReminder) {
            localStorage.setItem('skipJsonDownload', 'true');
        }
        
        downloadJSON(piguaData);
        document.body.removeChild(modalOverlay);
    };
    
    document.getElementById('skip-json-btn').onclick = function() {
        const skipReminder = document.getElementById('skip-reminder').checked;
        if (skipReminder) {
            localStorage.setItem('skipJsonDownload', 'true');
        }
        
        document.body.removeChild(modalOverlay);
    };
}

// ==================== 學習模式整合函數 ====================

// 初始化學習模式
function initializeLearningMode() {
    // 確保學習模式腳本已加載
    if (typeof showLearningModeModal !== 'function') {
        console.warn('學習模式腳本未正確加載');
        return;
    }
    
    console.log('學習模式已初始化');
}

// 修改學習模式觸發函數
function triggerLearningModeAfterDivination() {
    // 移除自動觸發，讓用戶主動從設定選單開啟
    console.log('起卦完成，用戶可從右上角設定選單開啟學習模式');
}

// 錯誤處理
function handleLearningModeErrors(error) {
    if (error && error.message && error.message.includes('learning')) {
        console.warn('學習模式相關錯誤，功能可能受限:', error.message);
        return true;
    }
    return false;
}
//=====================  增加變卦六親修正函數  ===================
/**
 * 修正變卦六親（後處理函數）
 * 在表格建構完成後執行，重新計算變卦六親
 */
/**
 * 修正變卦六親（後處理函數）- 通用版本
 * 適用於問卦界面和卦師界面
 */
function correctChangeGuaLiuqin() {
    console.log('=== 開始修正變卦六親 ===');
    
    try {
        // 1. 取得本卦的宮位五行 - 改用多種方法
        let mainGuaBinary = null;
        let mainGuaName = null;
        
        // 方法1：嘗試從函數獲取（問卦界面）
        if (typeof getMainGuaName === 'function') {
            mainGuaName = getMainGuaName();
            if (mainGuaName) {
                mainGuaBinary = findGuaCodeByName(mainGuaName);
            }
        }
        
        // 方法2：從表格第一列獲取卦名（通用方法）
        if (!mainGuaBinary) {
            const table = document.querySelector('table.main-table');
            if (table) {
                const firstRow = table.querySelector('tr');
                if (firstRow) {
                    const cells = firstRow.querySelectorAll('td');
                    // 找第一個colspan=6的格子（本卦名稱）
                    for (let cell of cells) {
                        if (cell.getAttribute('colspan') === '6') {
                            mainGuaName = cell.textContent.trim();
                            if (mainGuaName && mainGuaName !== 'GN') {
                                mainGuaBinary = findGuaCodeByName(mainGuaName);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        // 方法3：從全域變數推算（備用方法）
        if (!mainGuaBinary && window.dice1 !== undefined) {
            const liuyaoResults = [window.dice1, window.dice2, window.dice3, window.dice4, window.dice5, window.dice6];
            const guaNames = AdvancedCalculator.calculateGuaNames(liuyaoResults);
            mainGuaBinary = guaNames.originalBinary;
            mainGuaName = guaNames.gn;
        }
        
        if (!mainGuaBinary) {
            console.log('無法取得本卦資訊，跳過修正');
            return;
        }
        
        const mainGuaData = AdvancedCalculator.GUA_64_COMPLETE[mainGuaBinary];
        if (!mainGuaData) {
            console.error('無法取得本卦資料:', mainGuaBinary);
            return;
        }
        
        const mainPalaceWuxing = mainGuaData.wuxing;
        console.log(`本卦: ${mainGuaName || '未知'}, 宮位五行: ${mainPalaceWuxing}`);
        
        // 2. 找到 main-table 並處理變卦欄位
        const mainTable = document.querySelector('table.main-table');
        if (!mainTable) {
            console.error('找不到 main-table');
            return;
        }
        
        const rows = mainTable.querySelectorAll('tr');
        console.log(`找到主表格，共 ${rows.length} 列`);
        
        // 3. 遍歷每一列，修正變卦六親（第8欄）
        let correctedCount = 0;
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td, th');
            
            // 跳過表頭或欄位不足的列
            if (rowIndex === 0 || cells.length < 8) {
                return;
            }
            
            // 變卦的地支五行在第7欄（索引6），六親在第8欄（索引7）
            const changeGuaDizhiWuxingCell = cells[6]; // 第7欄
            const changeGuaLiuqinCell = cells[7]; // 第8欄
            
            if (changeGuaDizhiWuxingCell && changeGuaLiuqinCell) {
                const dizhiWuxingText = changeGuaDizhiWuxingCell.textContent.trim();
                
                // 跳過空白或無效的格子
                if (!dizhiWuxingText || dizhiWuxingText === '--' || dizhiWuxingText === '') {
                    return;
                }
                
                // 提取五行
                const yaoWuxing = extractWuxingFromText(dizhiWuxingText);
                
                if (yaoWuxing && yaoWuxing !== '--') {
                    // 重新計算六親（基於本卦宮位）
                    const correctLiuqin = AdvancedCalculator.calculateLiuqin(mainPalaceWuxing, yaoWuxing);
                    
                    const originalLiuqin = changeGuaLiuqinCell.textContent.trim();
                    
                    console.log(`第 ${rowIndex} 爻變卦: ${dizhiWuxingText}(${yaoWuxing}) vs 本卦宮${mainPalaceWuxing} = ${correctLiuqin} (原為 ${originalLiuqin})`);
                    
                    // 更新六親顯示
                    changeGuaLiuqinCell.textContent = correctLiuqin;
                    
                    // 如果有變更，標記顏色
                    if (originalLiuqin !== correctLiuqin) {
                        changeGuaLiuqinCell.style.backgroundColor = '#ffe6e6'; // 淺紅色背景表示已修正
                        changeGuaLiuqinCell.title = `已修正：${originalLiuqin} → ${correctLiuqin} (基於本卦${mainGuaName || '未知'}宮)`;
                    }
                    
                    correctedCount++;
                }
            }
        });
        
        console.log(`=== 變卦六親修正完成，共處理 ${correctedCount} 個爻 ===`);
        
    } catch (error) {
        console.error('修正變卦六親時發生錯誤:', error);
    }
}
/**
 * 根據卦名找到二進制代碼
 */
function findGuaCodeByName(guaName) {
    if (!guaName) return null;
    
    // 遍歷 GUA_64_COMPLETE 常數
    for (const [binaryCode, guaInfo] of Object.entries(AdvancedCalculator.GUA_64_COMPLETE)) {
        if (guaInfo.name === guaName) {
            return binaryCode;
        }
    }
    
    return null;
}
/**
 * 輔助函數：從文字中提取五行
 */
function extractWuxingFromText(text) {
    if (!text || text === '--') return null;
    
    // 直接找五行字符
    const wuxingChars = ['金', '木', '水', '火', '土'];
    for (const wuxing of wuxingChars) {
        if (text.includes(wuxing)) {
            return wuxing;
        }
    }
    
    // 如果沒有直接的五行字符，從地支推斷
    const dizhiWuxing = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
    
    for (const [dizhi, wuxing] of Object.entries(dizhiWuxing)) {
        if (text.includes(dizhi)) {
            return wuxing;
        }
    }
    
    return null;
}
/**
 * 提取 AI 解卦所需的完整數據
 */
function extractAIGuaData(questionType, customQuestion) {
    console.log('=== 開始提取 AI 解卦數據 ===');
    
    try {
        // 1. 基本信息
        const ganZhi = getCurrentGanZhi();
        const questionText = aiDivination.getQuestionText(questionType);
        
        // 2. 卦名信息
        const guaNames = getGuaNamesFromTable();
        
        // 3. 用神信息
        const yongshenInfo = getYongshenInfo(questionType);
        
        // 4. 元神忌神信息
        const yuanJishenInfo = getYuanJishenInfo(yongshenInfo.liuqin);
        
        // 5. 世爻信息
        const shiYaoInfo = getShiYaoInfo();
        
        // 6. 用神對世爻的生克關係
        const yongshenShiRelation = getYongshenShiRelation(yongshenInfo, shiYaoInfo);
        
        return {
            ganZhi: ganZhi,
            questionType: questionText,
            customQuestion: customQuestion,
            guaNames: guaNames,
            yongshen: yongshenInfo,
            yuanJishen: yuanJishenInfo,
            shiYao: shiYaoInfo,
            yongshenShiRelation: yongshenShiRelation
        };
        
    } catch (error) {
        console.error('提取 AI 解卦數據時發生錯誤:', error);
        return null;
    }
}

/**
 * 從表格獲取卦名
 */
/**
 * 從表格獲取卦名 - 根據實際結構修正
 */
function getGuaNamesFromTable() {
    const table = document.querySelector('table.main-table');
    if (!table) return { ben: '未知', bian: '' };
    
    const firstRow = table.querySelector('tr');
    if (!firstRow) return { ben: '未知', bian: '' };
    
    const cells = firstRow.querySelectorAll('td');
    let benGuaName = '未知';
    let bianGuaName = '';
    
    console.log('檢查第一行卦名格子數量:', cells.length);
    
    // 根據實際的 colspan 值來匹配
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const colspan = cell.getAttribute('colspan');
        const text = cell.textContent.trim();
        
        console.log(`格子 ${i}: colspan=${colspan}, 內容="${text}"`);
        
        // 修正：本卦是 colspan=5
        if (colspan === '5' && text && text !== 'GN' && text !== '本卦') {
            benGuaName = text;
            console.log('找到本卦名:', benGuaName);
        } 
        // 修正：變卦是 colspan=3
        else if (colspan === '3' && text && text !== 'BGN' && text !== '變卦' && text !== '') {
            bianGuaName = text;
            console.log('找到變卦名:', bianGuaName);
        }
    }
    
    // 如果沒找到變卦，檢查是否確實無動爻
    if (!bianGuaName) {
        const dongYaoList = getDongYaoList();
        if (dongYaoList.length === 0) {
            bianGuaName = ''; // 確實無變卦
            console.log('無動爻，無變卦');
        } else {
            console.log('有動爻但沒找到變卦名，使用備用方法');
            bianGuaName = getBianGuaNameAlternative();
        }
    }
    
    console.log('最終卦名結果:', { ben: benGuaName, bian: bianGuaName });
    return { ben: benGuaName, bian: bianGuaName };
}
function getBianGuaNameAlternative() {
    // 方法1：從全域變數獲取
    if (window.dice1 !== undefined) {
        const liuyaoResults = [window.dice1, window.dice2, window.dice3, window.dice4, window.dice5, window.dice6];
        const guaNames = AdvancedCalculator.calculateGuaNames(liuyaoResults);
        return guaNames.bgn || '';
    }
    
    // 方法2：從數字起卦結果獲取
    if (window.numberGuaResult) {
        const guaNames = AdvancedCalculator.calculateNumberGuaNames(window.numberGuaResult);
        return guaNames.bgn || '';
    }
    
    // 方法3：從時間起卦結果獲取
    if (window.timeGuaResult) {
        const guaNames = AdvancedCalculator.calculateNumberGuaNames(window.timeGuaResult);
        return guaNames.bgn || '';
    }
    
    return '';
}
/**
 * 獲取用神信息
 */
function getYongshenInfo(questionType) {
    // 用神映射
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
    
    const yongshenLiuqin = yongshenMapping[questionType];
    
    // 在表格中找到用神標記
    const yongshenYao = findYongshenInTable();
    
    if (yongshenYao) {
        return {
            liuqin: yongshenLiuqin,
            position: yongshenYao.position,
            wangShuai: yongshenYao.fColumn,
            isDong: yongshenYao.isDong,
            dongBian: yongshenYao.jColumn
        };
    }
    
    return {
        liuqin: yongshenLiuqin,
        position: 0,
        wangShuai: '不現',
        isDong: false,
        dongBian: ''
    };
}

/**
 * 在表格中找到用神標記
 */
function findYongshenInTable() {
    const table = document.querySelector('table.main-table');
    if (!table) return null;
    
    const rows = table.querySelectorAll('tr');
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const cells = row.querySelectorAll('td');
        
        if (cells.length >= 10) {
            const eCell = cells[4]; // 六親欄
            const fCell = cells[5]; // F欄（旺衰）
            const jCell = cells[9]; // J欄（動變）
            
            // 檢查是否有用神標記
            if (eCell.innerHTML.includes('用')) {
                const position = 6 - (rowIndex - 1); // 計算爻位
                const isDong = isDongYaoFromTable(position);
                
                return {
                    position: position,
                    fColumn: fCell.textContent.trim(),
                    isDong: isDong,
                    jColumn: jCell.textContent.trim()
                };
            }
        }
    }
    
    return null;
}

/**
 * 獲取元神忌神信息
 */
function getYuanJishenInfo(yongshenLiuqin) {
    const liuqinRelations = {
        '兄弟': { yuan: '父母', ji: '官鬼' },
        '子孫': { yuan: '兄弟', ji: '父母' },
        '妻財': { yuan: '子孫', ji: '兄弟' },
        '官鬼': { yuan: '妻財', ji: '子孫' },
        '父母': { yuan: '官鬼', ji: '妻財' }
    };
    
    const relation = liuqinRelations[yongshenLiuqin];
    if (!relation) return { yuan: null, ji: null };
    
    const yuanShenInfo = findLiuqinInTable(relation.yuan);
    const jiShenInfo = findLiuqinInTable(relation.ji);
    
    return {
        yuan: yuanShenInfo,
        ji: jiShenInfo
    };
}

/**
 * 在表格中找到指定六親
 */
function findLiuqinInTable(targetLiuqin) {
    const table = document.querySelector('table.main-table');
    if (!table) return null;
    
    const rows = table.querySelectorAll('tr');
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const cells = row.querySelectorAll('td');
        
        if (cells.length >= 10) {
            const eCell = cells[4]; // 六親欄
            const fCell = cells[5]; // F欄
            const jCell = cells[9]; // J欄
            
            const liuqinText = eCell.textContent.trim().replace(/[用元忌]/g, '').trim();
            
            if (liuqinText === targetLiuqin) {
                const position = 6 - (rowIndex - 1);
                const isDong = isDongYaoFromTable(position);
                
                return {
                    liuqin: targetLiuqin,
                    position: position,
                    wangShuai: fCell.textContent.trim(),
                    isDong: isDong,
                    dongBian: jCell.textContent.trim()
                };
            }
        }
    }
    
    return null;
}

/**
 * 獲取世爻信息
 */
function getShiYaoInfo() {
    const table = document.querySelector('table.main-table');
    if (!table) return null;
    
    const rows = table.querySelectorAll('tr');
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const cells = row.querySelectorAll('td');
        
        if (cells.length >= 10) {
            const cCell = cells[2]; // 卦象欄
            const eCell = cells[4]; // 六親欄
            const fCell = cells[5]; // F欄
            const jCell = cells[9]; // J欄
            
            // 檢查是否有世爻標記
            if (cCell.innerHTML.includes('世')) {
                const position = 6 - (rowIndex - 1);
                const isDong = isDongYaoFromTable(position);
                const liuqin = eCell.textContent.trim().replace(/[用元忌]/g, '').trim();
                
                return {
                    position: position,
                    liuqin: liuqin,
                    wangShuai: fCell.textContent.trim(),
                    isDong: isDong,
                    dongBian: jCell.textContent.trim()
                };
            }
        }
    }
    
    return null;
}

/**
 * 檢查指定位置是否為動爻
 */
function isDongYaoFromTable(position) {
    const dongYaoList = getDongYaoList();
    return dongYaoList.includes(position);
}

/**
 * 計算用神對世爻的生克關係
 */
function getYongshenShiRelation(yongshenInfo, shiYaoInfo) {
    if (!yongshenInfo || !shiYaoInfo) return '關係不明';
    
    const yongshenLiuqin = yongshenInfo.liuqin;
    const shiLiuqin = shiYaoInfo.liuqin;
    
    // 六親生克關係
    const liuqinShengke = {
        '父母': { sheng: '兄弟', ke: '子孫' },
        '兄弟': { sheng: '子孫', ke: '妻財' },
        '子孫': { sheng: '妻財', ke: '官鬼' },
        '妻財': { sheng: '官鬼', ke: '父母' },
        '官鬼': { sheng: '父母', ke: '兄弟' }
    };
    
    if (yongshenLiuqin === shiLiuqin) {
        return '比和';
    } else if (liuqinShengke[yongshenLiuqin]?.sheng === shiLiuqin) {
        return '生';
    } else if (liuqinShengke[yongshenLiuqin]?.ke === shiLiuqin) {
        return '克';
    } else if (liuqinShengke[shiLiuqin]?.sheng === yongshenLiuqin) {
        return '被生';
    } else if (liuqinShengke[shiLiuqin]?.ke === yongshenLiuqin) {
        return '被克';
    } else {
        return '無直接關係';
    }
}

/**
 * 生成 AI 解卦 prompt
 */
function generateAIPrompt(guaData) {
    if (!guaData) return null;
    
    const formatDate = (ganZhi) => {
        return `${ganZhi.year}年${ganZhi.month}月${ganZhi.day}日${ganZhi.time}時`;
    };
    
    const formatYaoInfo = (info) => {
        if (!info) return '不現';
        
        let result = `${info.wangShuai}，為${info.isDong ? '動' : '靜'}爻`;
        if (info.isDong && info.dongBian) {
            result += `，變動結果為${info.dongBian}`;
        }
        return result;
    };
    
    const prompt = `你是專業的六爻卦師，請用六爻及易經的卦辭解卦，
卜卦的日期為${formatDate(guaData.ganZhi)}，干支為${formatDate(guaData.ganZhi)}。
問題是${guaData.customQuestion || guaData.questionType}
得到的本卦為${guaData.guaNames.ben}、變卦為${guaData.guaNames.bian || '無'}。
在易經中的解釋為${guaData.guaNames.ben}卦。
用神為${guaData.yongshen.liuqin}，用神對於日月為${formatYaoInfo(guaData.yongshen)}。
元神在卦中為${formatYaoInfo(guaData.yuanJishen.yuan)}，${guaData.yuanJishen.yuan ? '能' : '不能'}生旺用神。
忌神在卦中為${formatYaoInfo(guaData.yuanJishen.ji)}，${guaData.yuanJishen.ji ? '能' : '不能'}克害用神。
世爻為${guaData.shiYao ? guaData.shiYao.liuqin : '未知'}，${formatYaoInfo(guaData.shiYao)}。
用神對世爻的關係為${guaData.yongshenShiRelation}。

請你依據這些數據進行解卦，格式如下：
【問題】整理歸納使用者的問題，不超過50字。
【卦辭】用易經的卦辭推斷使用者的問題，不超過200字。
【用神】說明用神在卦中的旺衰、動靜及動變的結果，不超過50字。
【元、忌神】說明元神、忌神的旺衰，以及是否能幫扶或克害用神，不超過50字。
【應期】如果使用者的問題有包括時間，則從用神的狀況去判斷應期，原則是：如果用神被忌神沖克，則日或月的地支沖開忌神的時間為應期；如果元神是動爻，但被日或月沖克，則走到日或月的時間則為應期；如果用神動變回動沖克，則沖開變爻的時間為應期。其它狀況就請你依專業進行判斷，不超過100字。
【總結】依卦辭及六爻綜合的使用者的問題做總結及建議，不超過300字。`;

    return prompt;
}
// ==================== 初始化 ====================

// 主程式初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面載入完成，開始初始化...');
    console.log('typeof initializeEventListeners:', typeof initializeEventListeners);
    console.log('typeof GanZhiCalculator:', typeof GanZhiCalculator);
    
    // 首先更新時間顯示
    updateTimeDisplay();
    
    // 初始化事件監聽器
    if (typeof initializeEventListeners === 'function') {
        console.log('initializeEventListeners 函數存在，開始調用');
        initializeEventListeners();
    } else {
        console.error('initializeEventListeners 函數不存在');
    }
    
    // 檢查頁面元素
    const methodElement = document.getElementById('divination-method');
    const datePickerElement = document.getElementById('date-picker');
    const ganzhiPickerElement = document.getElementById('ganzhi-picker');
    
    console.log('divination-method元素:', methodElement);
    console.log('date-picker元素:', datePickerElement);
    console.log('ganzhi-picker元素:', ganzhiPickerElement);

    setTimeout(initializeLearningMode, 100);
});

// 使常數可全域存取
window.GuaCode = GuaCode;
window.GuaNames = GuaNames;
