// file-handler.js - 檔案處理功能

// 生成PDF檔案
async function generatePDF(piguaData) {
    console.log('開始生成PDF');
    
    // 這裡先用簡單的方式實現，之後可以使用jsPDF或html2pdf
    // 暫時生成HTML格式下載
    const htmlContent = generatePDFContent(piguaData);
    downloadHTML(htmlContent, generateFileName(piguaData, 'html'));
    
    console.log('PDF生成完成');
}

// 生成PDF內容
// 修改 generatePDFContent 函數
function generatePDFContent(piguaData) {
    const { pigua, divination } = piguaData;
    const templateSettings = loadTemplateSettings();
    
    // 建立標題區塊
    let headerSection = '';
    if (templateSettings.shopName) {
        headerSection += `<h1 style="text-align: center; margin: 0 0 10px 0; color: #2c3e50;">${templateSettings.shopName}</h1>`;
    }
    if (templateSettings.name) {
        headerSection += `<h2 style="text-align: center; margin: 0 0 20px 0; color: #34495e;">批卦師：${templateSettings.name}</h2>`;
    }
    
    // 建立聯絡資訊區塊
    let contactSection = '';
    if (templateSettings.contact || templateSettings.address) {
        contactSection = '<div style="text-align: center; margin-bottom: 30px; padding: 15px; background: #ecf0f1; border-radius: 8px;">';
        if (templateSettings.contact) {
            contactSection += `<p style="margin: 5px 0; color: #2c3e50;"><strong>聯絡方式：</strong>${templateSettings.contact}</p>`;
        }
        if (templateSettings.address) {
            contactSection += `<p style="margin: 5px 0; color: #2c3e50;"><strong>地址：</strong>${templateSettings.address}</p>`;
        }
        contactSection += '</div>';
    }
    
    // 建立備註區塊
    let notesSection = '';
    if (templateSettings.notes) {
        notesSection = `
            <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-left: 4px solid #3498db; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">重要說明</h4>
                <p style="margin: 0; color: #5a6c7d; line-height: 1.6; white-space: pre-wrap;">${templateSettings.notes}</p>
            </div>
        `;
    }
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>六爻起卦批卦記錄</title>
        <style>
            body { 
                font-family: '微軟正黑體', Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #2c3e50;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .info-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px; 
                border: 2px solid #34495e;
            }
            .info-table td { 
                border: 1px solid #bdc3c7; 
                padding: 12px; 
                vertical-align: top;
            }
            .info-table .label {
                background: #ecf0f1; 
                font-weight: bold; 
                width: 20%;
                color: #2c3e50;
            }
            .content { 
                margin-top: 20px; 
                line-height: 1.8; 
            }
            .content-box {
                border: 2px solid #3498db;
                border-radius: 8px;
                padding: 20px;
                background: #f8f9fa;
            }
        </style>
    </head>
    <body>
        ${headerSection}
        ${contactSection}
        
        <table class="info-table">
            <tr>
                <td class="label">批卦日期</td>
                <td>${pigua.date}</td>
                <td class="label">問卦者</td>
                <td>${pigua.questioner}</td>
            </tr>
            <tr>
                <td class="label">聯絡電話</td>
                <td colspan="3">${pigua.phone}</td>
            </tr>
            <tr>
                <td class="label">起卦方式</td>
                <td>${getMethodDisplayName(divination.method)}</td>
                <td class="label">起卦時間</td>
                <td>${divination.ganzhi.year} ${divination.ganzhi.month} ${divination.ganzhi.day} ${divination.ganzhi.time}</td>
            </tr>
        </table>
        
        <div class="content">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">批卦內容</h3>
            <div class="content-box">${pigua.content.replace(/\n/g, '<br>')}</div>
        </div>
        
        ${notesSection}
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #bdc3c7; color: #7f8c8d; font-size: 12px;">
            批卦記錄產生時間：${new Date().toLocaleString('zh-TW')}
        </div>
    </body>
    </html>
    `;
}

// 下載JSON檔案
function downloadJSON(piguaData) {
    // piguaData = { pigua: {...}, divination: {...} }
    
    // 確保 divination.liuyaoResults 與 divination.ganzhi 存起來
    const exportData = {
        pigua: piguaData.pigua,
        divination: {
            method: piguaData.divination.method,
            liuyaoResults: window.liuyaoResults || piguaData.divination.liuyaoResults || [],
            ganzhi: piguaData.divination.ganzhi || {
                year: document.getElementById("year-zhi")?.value || "",
                month: document.getElementById("month-zhi")?.value || "",
                day: document.getElementById("day-zhi")?.value || "",
                time: document.getElementById("time-zhi")?.value || ""
            }
        }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = generateFileName(exportData, 'json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('JSON檔案下載完成');
}


// 下載HTML檔案
function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 生成檔案名稱
function generateFileName(data, extension) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const time = new Date().toISOString().slice(11, 19).replace(/:/g, '');
    const questioner = data.pigua?.questioner || '未知';
    
    return `六爻起卦_${questioner}_${date}_${time}.${extension}`;
}

// 獲取起卦方式顯示名稱
function getMethodDisplayName(method) {
    const methodNames = {
        'liuyao': '六爻起卦',
        'number': '數字起卦', 
        'time': '時間起卦',
        'random': '隨機起卦'
    };
    return methodNames[method] || '未知方式';
}
// 載入JSON檔案
function loadJSONFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            callback(data);
        } catch (err) {
            alert("檔案格式錯誤，請確認是否為批卦記錄檔。");
        }
    };
    reader.readAsText(file, "utf-8");
}

// ============== 版面設定功能 ==============

// 預設設定模板
const DEFAULT_TEMPLATE = {
    name: '',
    shopName: '',
    contact: '',
    address: '',
    notes: ''
};

// 載入版面設定
// 修正載入版面設定函數
function loadTemplateSettings() {
    try {
        // 優先嘗試從localStorage讀取（因為Cookie被阻擋）
        let savedTemplate = localStorage.getItem('piguaTemplate');
        
        // 如果localStorage沒有資料，再嘗試從Cookie讀取
        if (!savedTemplate) {
            console.log('localStorage無資料，嘗試Cookie');
            savedTemplate = getCookie('piguaTemplate');
        }
        
        console.log('從儲存讀取的資料:', savedTemplate);
        
        if (savedTemplate) {
            const parsedData = JSON.parse(savedTemplate);
            console.log('解析後的資料:', parsedData);
            return parsedData;
        }
    } catch (error) {
        console.error('載入版面設定失敗:', error);
    }
    
    console.log('使用預設模板');
    return {
        name: '',
        shopName: '',
        contact: '',
        address: '',
        notes: ''
    };
}

// 儲存版面設定
function saveTemplateSettings(templateData) {
    try {
        // 先測試Cookie功能
        if (!testCookieFunction()) {
            console.error('Cookie功能異常，嘗試使用localStorage');
            // 如果Cookie不行，使用localStorage作為備選
            localStorage.setItem('piguaTemplate', JSON.stringify(templateData));
            console.log('使用localStorage儲存:', templateData);
            return true;
        }
        
        const jsonString = JSON.stringify(templateData);
        setCookie('piguaTemplate', jsonString, 365);
        console.log('使用Cookie儲存成功:', templateData);
        return true;
    } catch (error) {
        console.error('儲存版面設定失敗:', error);
        return false;
    }
}

// Cookie操作輔助函數
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
    console.log('設定Cookie:', name, '=', value); // 除錯
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    console.log('所有Cookie:', document.cookie); // 除錯
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
            console.log('找到Cookie:', name, '=', value); // 除錯
            return value;
        }
    }
    console.log('未找到Cookie:', name); // 除錯
    return null;
}

// 測試Cookie功能
function testCookieFunction() {
    // 清除測試Cookie
    setCookie('test', '', -1);
    
    // 設定測試Cookie
    setCookie('test', 'hello', 1);
    
    // 立即讀取
    const result = getCookie('test');
    console.log('Cookie測試結果:', result);
    
    if (result === 'hello') {
        console.log('Cookie功能正常');
        return true;
    } else {
        console.log('Cookie功能異常');
        return false;
    }
}

// 顯示版面設定Modal
function showTemplateSettingsModal() {
    // 移除已存在的modal
    const existingModal = document.getElementById('template-settings-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 載入現有設定
    const currentSettings = loadTemplateSettings();
    console.log('載入的設定資料:', currentSettings); // 除錯用
    // 確保所有欄位都有預設值
    const safeSettings = {
        name: currentSettings.name || '',
        shopName: currentSettings.shopName || '',
        contact: currentSettings.contact || '',
        address: currentSettings.address || '',
        notes: currentSettings.notes || ''
    };
    
    // 創建modal
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'template-settings-modal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button id="close-template-modal" style="
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        " onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor='transparent'">&times;</button>
        
        <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; color: #333;">批卦版面設定</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">設定您的專業批卦資料</p>
        </div>
        
        <form id="template-settings-form">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">
                    批卦者姓名 <span style="color: #e74c3c;">*</span>
                </label>
                <input type="text" id="template-name" value="${currentSettings.name}" required
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px; transition: border-color 0.2s;"
                       placeholder="請輸入您的姓名"
                       onfocus="this.style.borderColor='#3498db'" onblur="this.style.borderColor='#ddd'">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">命相館名稱</label>
                <input type="text" id="template-shop" value="${currentSettings.shopName}"
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px; transition: border-color 0.2s;"
                       placeholder="選填：如XX命相館"
                       onfocus="this.style.borderColor='#3498db'" onblur="this.style.borderColor='#ddd'">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">聯絡資訊</label>
                <input type="text" id="template-contact" value="${currentSettings.contact}"
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px; transition: border-color 0.2s;"
                       placeholder="電話、LINE ID、Email等"
                       onfocus="this.style.borderColor='#3498db'" onblur="this.style.borderColor='#ddd'">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">地址</label>
                <input type="text" id="template-address" value="${currentSettings.address}"
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px; transition: border-color 0.2s;"
                       placeholder="選填：營業地址"
                       onfocus="this.style.borderColor='#3498db'" onblur="this.style.borderColor='#ddd'">
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">備註資料</label>
                <textarea id="template-notes" rows="3"
                          style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical; transition: border-color 0.2s;"
                          placeholder="選填：免責聲明、服務說明等"
                          onfocus="this.style.borderColor='#3498db'" onblur="this.style.borderColor='#ddd'">${safeSettings.notes}</textarea>
            </div>
            
            <div style="text-align: center;">
                <button type="submit" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; padding: 14px 30px; border-radius: 6px; margin-right: 15px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(52, 152, 219, 0.3)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">儲存設定</button>
                <button type="button" id="cancel-template" style="background: #95a5a6; color: white; border: none; padding: 14px 30px; border-radius: 6px; cursor: pointer; font-size: 16px; transition: all 0.3s;"
                        onmouseover="this.style.backgroundColor='#7f8c8d'" onmouseout="this.style.backgroundColor='#95a5a6'">取消</button>
            </div>
        </form>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // 綁定事件
    document.getElementById('template-settings-form').onsubmit = function(e) {
        e.preventDefault();
        saveTemplateData();
    };
    
    document.getElementById('close-template-modal').onclick = closeTemplateModal;
    document.getElementById('cancel-template').onclick = closeTemplateModal;
    
    modalOverlay.onclick = function(e) {
        if (e.target === modalOverlay) {
            closeTemplateModal();
        }
    };
}

// 儲存模板資料
function saveTemplateData() {
    const templateData = {
        name: document.getElementById('template-name').value.trim(),
        shopName: document.getElementById('template-shop').value.trim(),
        contact: document.getElementById('template-contact').value.trim(),
        address: document.getElementById('template-address').value.trim(),
        notes: document.getElementById('template-notes').value.trim()
    };
    
    console.log('準備儲存的資料:', templateData); // 除錯用
    
    // 驗證必填欄位
    if (!templateData.name) {
        alert('請輸入批卦者姓名');
        document.getElementById('template-name').focus();
        return;
    }
    
    // 儲存設定
    if (saveTemplateSettings(templateData)) {
        alert('版面設定儲存成功！');
        closeTemplateModal();
    } else {
        alert('儲存失敗，請重試');
    }
}

// 關閉模板設定Modal
function closeTemplateModal() {
    const modal = document.getElementById('template-settings-modal');
    if (modal) {
        modal.remove();
    }
}

// 顯示設定選單
function showSettingsMenu() {
    // 移除已存在的選單
    const existingMenu = document.getElementById('settings-menu');
    if (existingMenu) {
        existingMenu.remove();
        return; // 如果選單已開啟，則關閉
    }
    
    const menu = document.createElement('div');
    menu.id = 'settings-menu';
    menu.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1500;
        min-width: 180px;
        animation: slideIn 0.2s ease-out;
    `;
    
    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    menu.innerHTML = `
        <div style="padding: 8px 0;">
            <button onclick="showTemplateSettingsModal(); document.getElementById('settings-menu').remove();" style="
                width: 100%;
                padding: 12px 20px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                gap: 10px;
            " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                📋 設定資料
            </button>
            <button onclick="showLearningModeFromMenu(); document.getElementById('settings-menu').remove();" style="
                width: 100%;
                padding: 12px 20px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                gap: 10px;
            " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                📖 學習模式
            </button>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // 點擊其他地方關閉選單
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('#settings-btn')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}
// 新增從選單開啟學習模式的函數
function showLearningModeFromMenu() {
    // 檢查學習模式是否可用
    if (typeof showLearningModeModal === 'function') {
        showLearningModeModal();
    } else {
        console.warn('學習模式功能未載入');
        alert('學習模式功能目前無法使用');
    }
}