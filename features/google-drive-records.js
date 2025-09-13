// google-drive-records.js - 雲端記錄管理功能

// ==================== 雲端記錄儲存功能 ====================
// 新增缺少的輔助函數
function createGuaMap(diceValue) {
    // 根據擲幣結果創建卦映射
    const maps = {
        0: '老陰', // 變爻
        1: '少陽',
        2: '少陰', 
        3: '老陽'  // 變爻
    };
    return maps[diceValue] || '未知';
}


// 修改後的 collectPiguaData 函數 - 只收集必要資料
function collectCloudPiguaData() {
    const piguaInfo = {
        date: document.getElementById('pigua-date').value,
        questioner: document.getElementById('questioner-name').value.trim(),
        phone: document.getElementById('questioner-phone').value.trim(),
        content: document.getElementById('pigua-content').value.trim()
    };
    
    // 收集起卦資料 - 只要擲幣結果和干支
    const divinationData = {
        liuyaoResults: [
            window.dice1 || 0, window.dice2 || 0, window.dice3 || 0,
            window.dice4 || 0, window.dice5 || 0, window.dice6 || 0
        ],
        ganzhi: {
            yearZhi: document.getElementById('year-zhi')?.value || '巳',
            monthZhi: document.getElementById('month-zhi')?.value || '酉',
            dayZhi: document.getElementById('day-zhi')?.value || '卯',
            timeZhi: document.getElementById('time-zhi')?.value || '戌'
        }
    };
    
    return {
        version: '1.0',
        saveDate: new Date().toISOString(),
        pigua: piguaInfo,
        divination: divinationData
    };
}

// 儲存到雲端的主函數
async function saveToGoogleDrive(piguaData) {
    try {
        // 檢查 Google Drive 連接狀態
        if (!window.driveManager || !window.driveManager.isSignedIn) {
            const shouldConnect = confirm('需要連接 Google Drive 才能儲存雲端記錄。是否現在連接？');
            if (!shouldConnect) return;
            
            showMessage('正在連接 Google Drive...', 'info');
            const connected = await window.driveManager.signIn();
            if (!connected) {
                showMessage('Google Drive 連接失敗', 'error');
                return;
            }
        }
        
        // 讓使用者輸入檔案名稱
        const fileName = await showSaveFileNameDialog(piguaData);
        if (!fileName) return;
        
        showMessage('正在儲存到雲端...', 'info');
        
        // 準備 JSON 資料
        const jsonContent = JSON.stringify(piguaData, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
        
        // 上傳到 Google Drive
        await window.driveManager.uploadFile(jsonBlob, fileName, {
            questioner: piguaData.pigua.questioner,
            date: piguaData.pigua.date,
            type: 'liuyao_record'
        });
        
        showMessage('雲端記錄儲存成功！', 'success');
        
    } catch (error) {
        console.error('雲端儲存失敗:', error);
        showMessage('雲端儲存失敗：' + error.message, 'error');
    }
}

// 顯示檔案命名對話框
function showSaveFileNameDialog(piguaData) {
    return new Promise((resolve) => {
        const questioner = piguaData.pigua.questioner || '未知';
        const date = new Date().toLocaleDateString('zh-TW').replace(/\//g, '');
        const defaultName = `${questioner}_${date}`;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; width: 90%;">
                <h3 style="margin: 0 0 20px 0; text-align: center;">儲存雲端記錄</h3>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">檔案名稱：</label>
                    <input type="text" id="save-filename" value="${defaultName}" 
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px;">
                    <small style="color: #666;">系統會自動添加 .json 副檔名</small>
                </div>
                <div style="text-align: center;">
                    <button id="confirm-save" style="background: #28a745; color: white; border: none; padding: 12px 25px; border-radius: 6px; margin-right: 10px; cursor: pointer;">儲存</button>
                    <button id="cancel-save" style="background: #6c757d; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer;">取消</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('confirm-save').onclick = function() {
            const fileName = document.getElementById('save-filename').value.trim();
            if (fileName) {
                resolve(`${fileName}.json`);
            } else {
                alert('請輸入檔案名稱');
                return;
            }
            document.body.removeChild(modal);
        };
        
        document.getElementById('cancel-save').onclick = function() {
            resolve(null);
            document.body.removeChild(modal);
        };
    });
}

// ==================== 雲端記錄載入功能 ====================

// 修改 proceedToRecordManager 函數
async function proceedToRecordManager() {
    const skipReminder = document.getElementById('skip-reminder-checkbox')?.checked;
    if (skipReminder) {
        localStorage.setItem('skipGoogleDriveReminder', 'true');
    }
    
    closeRecordModal();
    
    try {
        showMessage('正在載入雲端記錄...', 'info');
        
        // 確保 Google Drive 已連接
        if (!window.driveManager.isSignedIn) {
            await window.driveManager.signIn();
        }
        
        // 取得雲端記錄列表
        const files = await listGoogleDriveRecords();
        showRecordListModal(files);
        
    } catch (error) {
        console.error('載入記錄失敗:', error);
        showMessage('載入雲端記錄失敗', 'error');
    }
}

// 列出 Google Drive 中的記錄檔案
async function listGoogleDriveRecords() {
    await window.driveManager.createOrGetFolder();
    
    const response = await gapi.client.drive.files.list({
        q: `parents in '${window.driveManager.folderId}' and name contains '.json' and trashed=false`,
        fields: 'files(id,name,createdTime,modifiedTime,description)',
        orderBy: 'modifiedTime desc'
    });
    
    return response.result.files || [];
}

// 顯示記錄列表 Modal
function showRecordListModal(files) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        z-index: 10000;
    `;
    
    const fileListHTML = files.length > 0 ? 
        files.map(file => {
            const metadata = file.description ? JSON.parse(file.description) : {};
            const fileName = file.name.replace('.json', '');
            
            return `
                <div class="record-item" style="
                    border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0;
                    cursor: pointer; transition: all 0.2s; background: white;
                " onclick="loadGoogleDriveRecord('${file.id}')" 
                   onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(-2px)'" 
                   onmouseout="this.style.backgroundColor='white'; this.style.transform='translateY(0)'">
                    <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${fileName}</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="margin: 0; color: #7f8c8d; font-size: 14px;">
                                問卦者: ${metadata.questioner || '未知'}<br>
                                日期: ${metadata.date || '未知'}
                            </p>
                        </div>
                        <div style="text-align: right; color: #95a5a6; font-size: 12px;">
                            ${new Date(file.modifiedTime).toLocaleString('zh-TW')}
                        </div>
                    </div>
                </div>
            `;
        }).join('') : 
        '<p style="text-align: center; color: #7f8c8d; padding: 40px;">尚無雲端記錄</p>';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; max-width: 700px; width: 90%; max-height: 80vh; overflow: hidden;">
            <div style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #2c3e50;">雲端批卦記錄</h3>
                <button onclick="closeRecordListModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
            </div>
            <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                ${fileListHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentRecordListModal = modal;
}

// 載入選中的雲端記錄
async function loadGoogleDriveRecord(fileId) {
    try {
        showMessage('正在載入記錄...', 'info');
        
        // 從 Google Drive 下載檔案
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        
        const recordData = JSON.parse(response.body);
        
        // 關閉記錄列表
        closeRecordListModal();
        
        // 還原起卦狀態
        await restoreFromRecord(recordData);
        
        showMessage('記錄載入成功！', 'success');
        
    } catch (error) {
        console.error('載入記錄失敗:', error);
        showMessage('載入記錄失敗：' + error.message, 'error');
    }
}

// 從記錄還原起卦狀態
async function restoreFromRecord(recordData) {
    console.log('開始還原記錄:', recordData);
    
    // 1. 還原擲幣結果
    const results = recordData.divination.liuyaoResults;
    window.dice1 = results[0];
    window.dice2 = results[1];
    window.dice3 = results[2];
    window.dice4 = results[3];
    window.dice5 = results[4];
    window.dice6 = results[5];
    
    // 2. 建立必要的全域變數
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
    
    // 3. 還原干支設定
    const ganzhi = recordData.divination.ganzhi;
    document.getElementById('year-zhi').value = ganzhi.yearZhi;
    document.getElementById('month-zhi').value = ganzhi.monthZhi;
    document.getElementById('day-zhi').value = ganzhi.dayZhi;
    document.getElementById('time-zhi').value = ganzhi.timeZhi;
    
    // 4. 更新干支旬空表
    updateTimeDisplay();
    
    // 5. 生成卦表
    fillLiuyaoGuaTable();
    showMainTable();
    
    // 6. 還原批卦資料並顯示批卦區域
    restorePiguaContent(recordData.pigua);
    
    console.log('記錄還原完成');
}

// 還原批卦內容
function restorePiguaContent(piguaData) {
    // 填入批卦資料
    document.getElementById('pigua-date').value = piguaData.date || '';
    document.getElementById('questioner-name').value = piguaData.questioner || '';
    document.getElementById('questioner-phone').value = piguaData.phone || '';
    document.getElementById('pigua-content').value = piguaData.content || '';
    
    // 自動展開批卦區域
    const piguaSection = document.getElementById('pigua-section');
    const piguaBtn = document.getElementById('pigua-btn');
    
    if (piguaSection && piguaSection.classList.contains('hidden')) {
        piguaSection.classList.remove('hidden');
        if (piguaBtn) piguaBtn.textContent = '關閉';
    }
}

// 關閉記錄列表
function closeRecordListModal() {
    if (window.currentRecordListModal) {
        window.currentRecordListModal.remove();
        window.currentRecordListModal = null;
    }
}

// ==================== 修改現有儲存函數 ====================

// 修改 savePiguaContent 函數，整合雲端儲存
async function savePiguaContentWithCloud() {
    console.log('開始儲存批卦內容（含雲端）');
    
    const piguaData = collectPiguaData();
    if (!validatePiguaData(piguaData)) return;
    
    try {
        // 1. 生成本地 PDF
        await generatePDF(piguaData);
        
        // 2. 儲存到雲端
        const cloudData = collectCloudPiguaData();
        await saveToGoogleDrive(cloudData);
        
        // 3. 詢問是否下載 JSON
        showJsonDownloadDialog(piguaData);
        
    } catch (error) {
        console.error('儲存過程發生錯誤:', error);
        showMessage('儲存失敗，請重試', 'error');
    }
}
// ==================== 批卦記錄處理函數 ====================

function handleRecordSelection() {
    console.log('處理批卦記錄選擇');
    
    // 檢查是否已設定不再提醒
    const skipReminder = localStorage.getItem('skipGoogleDriveReminder') === 'true';
    
    if (skipReminder) {
        console.log('略過隱私說明，直接處理 Google Drive');
        // 直接連接 Google Drive（如果未連接）或進入記錄管理
        if (window.driveManager?.isSignedIn) {
            proceedToRecordManager();
        } else {
            connectGoogleDriveDirectly();
        }
    } else {
        console.log('顯示隱私說明對話框');
        // 顯示記錄管理選項對話框
        showRecordManagementModal();
    }
}

// 直接連接 Google Drive（略過說明）
async function connectGoogleDriveDirectly() {
    try {
        showMessage('正在連接 Google Drive...', 'info');
        
        const connected = await window.driveManager.signIn();
        if (connected) {
            showMessage('Google Drive 連接成功！', 'success');
            setTimeout(() => {
                proceedToRecordManager();
            }, 1000);
        } else {
            showMessage('Google Drive 連接失敗，請重試', 'error');
        }
        
    } catch (error) {
        console.error('Google Drive 連接失敗:', error);
        showMessage('連接過程中發生錯誤，請重試', 'error');
    }
}

// 顯示記錄管理選項對話框
function showRecordManagementModal() {
    const modal = document.createElement('div');
    modal.className = 'record-management-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        z-index: 10000; font-family: 'Microsoft JhengHei', sans-serif;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white; padding: 30px; border-radius: 15px; 
            max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 48px; margin-bottom: 15px;">🔒</div>
                <h2 style="color: #2c3e50; margin: 0 0 15px 0;">隱私保護說明</h2>
            </div>

            <!-- 隱私說明區域 -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            ">
                <div style="display: flex; align-items: flex-start;">
                    <div style="
                        width: 40px; height: 40px; background: rgba(255,255,255,0.2);
                        border-radius: 50%; display: flex; align-items: center; justify-content: center;
                        font-size: 20px; margin-right: 15px; flex-shrink: 0; margin-top: 5px;
                    ">🛡️</div>
                    
                    <div>
                        <h3 style="margin: 0 0 12px 0; font-size: 18px;">資料安全承諾</h3>
                        <p style="margin: 0; line-height: 1.6; font-size: 15px;">
                            基於保護您的資訊安全與隱私，同時讓您可以在不同地點透過網路使用本站的功能，
                            <strong>本站將不會儲存任何您的批卦資料</strong>。您的批卦資料將安全的儲存於您的 Google 雲端硬碟中。
                        </p>
                    </div>
                </div>
            </div>

            <!-- Google Drive 連接區域 -->
            <div style="
                border: 2px solid #4285f4; border-radius: 12px; padding: 25px;
                background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
            ">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="
                        width: 50px; height: 50px; background: linear-gradient(135deg, #4285f4, #34a853);
                        border-radius: 50%; display: flex; align-items: center; justify-content: center;
                        font-size: 24px; margin-right: 15px;
                    ">🔗</div>
                    
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; color: #1a73e8;">連接您的 Google Drive</h3>
                        <p style="margin: 0; color: #5f6368; font-size: 14px;">
                            ${window.driveManager?.isSignedIn ? 
                                '已成功連接到您的 Google Drive' : 
                                '需要授權存取您的 Google Drive 來管理批卦記錄'
                            }
                        </p>
                    </div>
                </div>

                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4285f4;">
                    <h4 style="margin: 0 0 8px 0; color: #202124; font-size: 14px;">🔐 我們的隱私保證：</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #5f6368; font-size: 13px;">
                        <li>只存取應用程式建立的檔案，不會讀取您的其他資料</li>
                        <li>不會將您的資料傳送到我們的伺服器</li>
                        <li>您可以隨時撤銷授權</li>
                        <li>所有操作都在您的裝置上進行</li>
                    </ul>
                </div>
            </div>

            <!-- Google 帳號提醒 -->
            <div style="
                background: #fff3e0; border: 1px solid #ffb74d; border-radius: 8px;
                padding: 15px; margin: 15px 0; display: flex; align-items: center;
            ">
                <div style="margin-right: 12px; font-size: 20px;">💡</div>
                <div style="color: #e65100; font-size: 14px;">
                    <strong>還沒有 Google 帳號？</strong> 
                    <a href="https://accounts.google.com/signup" target="_blank" style="color: #1976d2; text-decoration: none;">
                        立即免費註冊 →
                    </a>
                </div>
            </div>

            <!-- 不再提醒選項 -->
            <div style="
                background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;
                padding: 15px; margin: 15px 0;
            ">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 14px; color: #495057;">
                    <input type="checkbox" id="skip-reminder-checkbox" style="
                        margin-right: 8px; width: 16px; height: 16px; cursor: pointer;
                    ">
                    <span>我已了解隱私政策，下次直接連接 Google Drive（不再顯示此說明）</span>
                </label>
            </div>

            <!-- 底部按鈕 -->
            <div style="text-align: center; margin-top: 25px;">
                ${window.driveManager?.isSignedIn ? 
                    `<button onclick="proceedToRecordManager()" style="
                        padding: 15px 30px; margin: 0 10px; 
                        background: linear-gradient(135deg, #4285f4, #34a853); color: white;
                        border: none; border-radius: 8px; cursor: pointer; font-size: 16px;
                        box-shadow: 0 3px 10px rgba(66, 133, 244, 0.3);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(66, 133, 244, 0.4)'"
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 10px rgba(66, 133, 244, 0.3)'">
                        📋 進入記錄管理
                    </button>` :
                    `<button onclick="connectGoogleDrive()" style="
                        padding: 15px 30px; margin: 0 10px; 
                        background: linear-gradient(135deg, #4285f4, #34a853); color: white;
                        border: none; border-radius: 8px; cursor: pointer; font-size: 16px;
                        box-shadow: 0 3px 10px rgba(66, 133, 244, 0.3);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(66, 133, 244, 0.4)'"
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 10px rgba(66, 133, 244, 0.3)'">
                        🔗 連接 Google Drive
                    </button>`
                }
                
                <button onclick="closeRecordModal()" style="
                    padding: 15px 30px; margin: 0 10px; background: #95a5a6; color: white;
                    border: none; border-radius: 8px; cursor: pointer; font-size: 16px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#7f8c8d'"
                   onmouseout="this.style.background='#95a5a6'">
                    取消
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 點擊外部關閉
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeRecordModal();
        }
    });

    // 儲存到全域變數供後續使用
    window.currentRecordModal = modal;
}

// 連接 Google Drive
async function connectGoogleDrive() {
    try {
        // 檢查是否勾選不再提醒
        const skipReminder = document.getElementById('skip-reminder-checkbox')?.checked;
        if (skipReminder) {
            localStorage.setItem('skipGoogleDriveReminder', 'true');
        }
        
        closeRecordModal();
        showMessage('正在連接 Google Drive...', 'info');
        
        const connected = await window.driveManager.signIn();
        if (connected) {
            showMessage('Google Drive 連接成功！', 'success');
            // 連接成功後直接進入記錄管理
            setTimeout(() => {
                proceedToRecordManager();
            }, 1000);
        } else {
            showMessage('Google Drive 連接失敗，請重試', 'error');
        }
        
    } catch (error) {
        console.error('Google Drive 連接失敗:', error);
        showMessage('連接過程中發生錯誤，請重試', 'error');
    }
}

// 關閉記錄管理對話框
function closeRecordModal() {
    if (window.currentRecordModal) {
        window.currentRecordModal.remove();
        window.currentRecordModal = null;
    }
}

// 通用訊息顯示函數（如果你的 script.js 中還沒有的話）
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10002;
        padding: 15px 20px; border-radius: 8px; color: white; font-weight: bold;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'Microsoft JhengHei', sans-serif;
        max-width: 300px;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}