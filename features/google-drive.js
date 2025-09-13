// Google Drive 整合功能 - 使用新的 Google Identity Services
// 請將 YOUR_CLIENT_ID 替換為你的實際 Google Cloud Console Client ID

class GoogleDriveManager {
    constructor() {
        // ⚠️ 重要：請替換為你從 Google Cloud Console 取得的 Client ID
        this.CLIENT_ID = '559513692996-3vogmrglnc7fb0e2pvsdon5t5ke4r2g8.apps.googleusercontent.com';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
        this.isInitialized = false;
        this.isSignedIn = false;
        this.folderName = '六爻起卦記錄';
        this.folderId = null;
        this.tokenClient = null;
        this.accessToken = null;
    }

    // 初始化 Google API
    async initialize() {
        try {
            // 檢查是否使用正確的協議
            if (window.location.protocol === 'file:') {
                this.showError('請使用本地伺服器運行此網站，不能直接開啟 HTML 檔案。請參考說明文件設定本地伺服器。');
                return;
            }

            // 初始化 gapi client
            await new Promise((resolve) => {
                gapi.load('client', resolve);
            });

            await gapi.client.init({
                discoveryDocs: [this.DISCOVERY_DOC],
            });

            // 初始化 Google Identity Services
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES,
                callback: (tokenResponse) => {
                    this.accessToken = tokenResponse.access_token;
                    this.isSignedIn = true;
                    gapi.client.setApiKey = () => {}; // 不需要 API key
                    this.showSuccess('成功連接 Google Drive！');
                    if (this.signInCallback) {
                        this.signInCallback(true);
                    }
                },
                error_callback: (error) => {
                    console.error('Token client error:', error);
                    this.isSignedIn = false;
                    this.showError('Google Drive 授權失敗');
                    if (this.signInCallback) {
                        this.signInCallback(false);
                    }
                }
            });

            this.isInitialized = true;
            console.log('Google Drive API 初始化完成 (使用新的 Google Identity Services)');

        } catch (error) {
            console.error('Google Drive API 初始化失敗:', error);
            this.showError('Google Drive API 初始化失敗: ' + error.message);
        }
    }

    // 登入 Google Drive
    async signIn() {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            if (this.isSignedIn) {
                this.showSuccess('已經連接到 Google Drive');
                return true;
            }

            // 使用 Promise 包裝回調
            return new Promise((resolve) => {
                this.signInCallback = resolve;
                this.tokenClient.requestAccessToken({ prompt: 'consent' });
            });

        } catch (error) {
            console.error('Google Drive 登入失敗:', error);
            this.showError('Google Drive 登入失敗，請重試');
            return false;
        }
    }

    // 登出 Google Drive
    async signOut() {
        try {
            if (this.accessToken) {
                google.accounts.oauth2.revoke(this.accessToken);
                this.accessToken = null;
            }
            this.isSignedIn = false;
            this.showSuccess('已中斷 Google Drive 連接');
        } catch (error) {
            console.error('登出失敗:', error);
            this.showError('登出失敗');
        }
    }

    // 建立或取得專用資料夾
    async createOrGetFolder() {
        try {
            if (this.folderId) {
                return this.folderId;
            }

            // 搜尋是否已存在資料夾
            const response = await gapi.client.drive.files.list({
                q: `name='${this.folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                spaces: 'drive'
            });

            if (response.result.files.length > 0) {
                this.folderId = response.result.files[0].id;
                console.log('找到現有資料夾:', this.folderId);
            } else {
                // 建立新資料夾
                const createResponse = await gapi.client.drive.files.create({
                    resource: {
                        name: this.folderName,
                        mimeType: 'application/vnd.google-apps.folder'
                    }
                });
                this.folderId = createResponse.result.id;
                console.log('建立新資料夾:', this.folderId);
            }

            return this.folderId;

        } catch (error) {
            console.error('建立/取得資料夾失敗:', error);
            throw error;
        }
    }

    // 上傳檔案到 Google Drive
    async uploadFile(fileBlob, fileName, metadata) {
        try {
            if (!this.isSignedIn) {
                const success = await this.signIn();
                if (!success) return null;
            }

            const folderId = await this.createOrGetFolder();

            // 準備檔案 metadata
            const fileMetadata = {
                name: fileName,
                parents: [folderId],
                description: JSON.stringify({
                    type: '六爻起卦記錄',
                    timestamp: new Date().toISOString(),
                    ...metadata
                })
            };

            // 使用 multipart 上傳
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {
                type: 'application/json'
            }));
            form.append('file', fileBlob);

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: form
            });

            if (!response.ok) {
                throw new Error(`上傳失敗: ${response.status}`);
            }

            const result = await response.json();
            console.log('檔案上傳成功:', result);

            this.showSuccess(`檔案已儲存到 Google Drive: ${fileName}`);
            return result;

        } catch (error) {
            console.error('上傳檔案失敗:', error);
            this.showError('檔案上傳失敗，請重試');
            throw error;
        }
    }

    // 取得目前使用者資訊（簡化版本）
    getCurrentUser() {
        if (!this.isSignedIn) return null;

        // 新版本需要額外的 API 調用來獲取使用者資訊
        // 暫時返回基本資訊
        return {
            email: '已連接的 Google 帳號',
            name: '使用者',
            imageUrl: ''
        };
    }

    // 顯示成功訊息
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    // 顯示錯誤訊息
    showError(message) {
        this.showMessage(message, 'error');
    }

    // 顯示訊息
    showMessage(message, type) {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // 建立動態訊息提示
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
}

// 建立全域實例
const driveManager = new GoogleDriveManager();

// 頁面載入後自動初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延遲初始化，確保 Google API 已載入
    setTimeout(() => {
        driveManager.initialize();
    }, 1000);
});

// 匯出供其他模組使用
window.driveManager = driveManager;