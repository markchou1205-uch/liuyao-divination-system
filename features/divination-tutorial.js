/**
 * 整合版引導精靈 - 具備完整起卦和解卦功能
 */
class DivinationTutorial {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 8; // 增加到8步
        this.isActive = false;
        this.overlay = null;
        this.modal = null;
        
        // 用戶數據
        this.userData = {
            method: '', // 起卦方式
            liuyaoData: [], // 六爻數據
            questionType: '', // 問題類型
            customQuestion: '', // 自定義問題
            divinationResult: null // 起卦結果
        };
    }

    // 檢查是否需要顯示引導
checkIfNeedTutorial() {
    // 如果正在處理卦師解卦，不要觸發引導精靈
    if (this.isProcessingMasterDivination) {
        return;
    }
    
    const tutorialStatus = localStorage.getItem('divination_tutorial_status');
    if (tutorialStatus !== 'never_show') {
        this.startTutorial();
    }
}

    // 強制顯示引導精靈（無論設定如何）
    forceShowTutorial() {
        console.log('強制顯示引導精靈');
        this.startTutorial();
    }

    // 開始引導流程
    startTutorial() {
        this.isActive = true;
        this.createOverlay();
        this.createModal();
        this.showStep(1);
    }

    // 創建遮罩層
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        document.body.appendChild(this.overlay);
    }

    // 創建Modal
    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'tutorial-modal';
        this.modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 700px;
            width: 95%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 9999;
        `;
        this.overlay.appendChild(this.modal);
    }

    // 顯示指定步驟
    showStep(stepNumber) {
        this.currentStep = stepNumber;
        
        switch(stepNumber) {
            case 1:
                this.showWelcomeStep();
                break;
            case 2:
                this.showPreparation1Step();
                break;
            case 3:
                this.showPreparation2Step();
                break;
            case 4:
                this.showPreparation3Step();
                break;
            case 5:
                this.showMethodSelectionStep();
                break;
            case 6:
                this.showQuestionSelectionStep();
                break;
            case 7:
                this.showDivinationOptionsStep();
                break;
            case 8:
                this.showResultStep();
                break;
        }
    }

    // 第一步：歡迎界面
    showWelcomeStep() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>歡迎使用命理教觀室</h2>
                <div class="tutorial-text">
                    <p>歡迎您使用命理教觀室-免費排卦解卦系統。</p>
                    <p>以下將一步一步告訴您如何正確的起卦及取得解卦結果。</p>
                </div>
                <div class="tutorial-navigation welcome-navigation">
                    <button class="btn btn-secondary" onclick="divinationTutorial.closeTemporarily()">
                        關閉
                    </button>
                    <span class="step-indicator">${this.currentStep} / ${this.totalSteps}</span>
                    <button class="btn btn-primary" onclick="divinationTutorial.nextStep()">
                        下一步
                    </button>
                </div>
            </div>
            <style>
                .tutorial-content h2 { margin-bottom: 20px; text-align: center; color: #333; }
                .tutorial-text p { margin-bottom: 15px; line-height: 1.6; }
                .tutorial-navigation { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-top: 30px; 
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }
                .btn { 
                    padding: 10px 20px; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    font-size: 14px;
                }
                .btn-primary { background: #007bff; color: white; }
                .btn-secondary { background: #6c757d; color: white; }
                .btn:hover { opacity: 0.9; }
                .step-indicator { font-weight: bold; color: #666; }
            </style>
        `;
        this.removeHighlight();
    }

    // 第二步：占卦準備1（保持原樣，但優化版面）
    showPreparation1Step() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>占卦準備 (1/3)</h2>
                <div class="tutorial-text">
                    <p>1. 請簡單洗手洗臉、穿著整齊。</p>
                    <p>並選擇有桌椅且安靜不受打擾的場所。</p>
                </div>
                <div class="tutorial-image-container">
                    <img src="/assets/images/tutorial/table.png" 
                         alt="整齊的桌椅環境" 
                         class="tutorial-image"
                         onload="this.style.display='block';"
                         onerror="this.style.display='none';">
                </div>
                ${this.createNavigationButtons()}
            </div>
            <style>
                .tutorial-image-container {
                    text-align: center;
                    margin: 20px 0;
                    min-height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .tutorial-image {
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 8px;
                    display: none;
                }
            </style>
        `;
        this.removeHighlight();
    }

    // 第三步：占卦準備2
    showPreparation2Step() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>占卦準備 (2/3)</h2>
                <div class="tutorial-text">
                    <p>請準備紙、筆、以及三枚面額、形式相同的硬幣置於桌上。</p>
                    <p>同時請您放鬆自在的坐於桌前。</p>
                </div>
                <div class="tutorial-image-container">
                    <div class="preparation-items">
                        <div class="item">📝 紙筆</div>
                        <div class="item">🪙 三枚硬幣</div>
                        <div class="item">🪑 舒適座椅</div>
                    </div>
                </div>
                ${this.createNavigationButtons()}
            </div>
            <style>
                .preparation-items {
                    display: flex;
                    justify-content: space-around;
                    margin: 30px 0;
                }
                .item {
                    text-align: center;
                    font-size: 18px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    min-width: 100px;
                }
            </style>
        `;
        this.removeHighlight();
    }

    // 第四步：占卦準備3
    showPreparation3Step() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>占卦準備 (3/3)</h2>
                <div class="tutorial-text">
                    <p><strong>在心中默唸您所要問的問題</strong></p>
                    <div class="preparation-note">
                        <p>向神靈自我介紹、說明現在的狀況、以及想問的問題。</p>
                        <p><strong>注意：</strong>問題要明確，答案要單純，儘量避免「好不好？」之類模擬兩可的問題，因為凡事有好有壞。</p>
                        
                        <div class="examples">
                            <h4>例如：</h4>
                            <p class="wrong-example">❌ 新的工作好不好</p>
                            <p class="wrong-example">❌ 新的工作薪水會不會增加？上司會不會幫助我？與同事相處如何？</p>
                            <p class="correct-example">✅ 新的工作能不能得到上司的幫助</p>
                        </div>
                    </div>
                </div>
                ${this.createNavigationButtons()}
            </div>
            <style>
                .preparation-note {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .examples {
                    margin-top: 15px;
                }
                .wrong-example {
                    color: #dc3545;
                    margin: 8px 0;
                }
                .correct-example {
                    color: #28a745;
                    margin: 8px 0;
                    font-weight: bold;
                }
            </style>
        `;
        this.removeHighlight();
    }

// 第五步：六次點擊起卦（單欄版；按鈕在下、爻象在上）
showMethodSelectionStep() {
this.modal.innerHTML = `
  <div class="tutorial-content">
    <h2>起卦（六次點擊）</h2>

    <div id="sixi-container" class="sixi single-col" aria-live="polite">

      <!-- 卦名 -->
      <div id="sixi-gua-name" class="gua-name" aria-live="polite" aria-atomic="true"></div>

      <!-- 硬幣動畫區 -->
      <div class="coins" id="sixi-coins" aria-hidden="true">
        <div class="coin">
          <div class="face front"><img class="coin-front" alt="正"></div>
          <div class="face back"><img class="coin-back"  alt="反"></div>
        </div>
        <div class="coin">
          <div class="face front"><img class="coin-front" alt="正"></div>
          <div class="face back"><img class="coin-back"  alt="反"></div>
        </div>
        <div class="coin">
          <div class="face front"><img class="coin-front" alt="正"></div>
          <div class="face back"><img class="coin-back"  alt="反"></div>
        </div>
      </div>

      <!-- 爻象列表（由下到上） -->
      <ol id="sixi-yao-list" class="yao-list">
        <li data-slot="1" class="yao-slot"></li>
        <li data-slot="2" class="yao-slot"></li>
        <li data-slot="3" class="yao-slot"></li>
        <li data-slot="4" class="yao-slot"></li>
        <li data-slot="5" class="yao-slot"></li>
        <li data-slot="6" class="yao-slot"></li>
      </ol>

      <!-- 主操作區 -->
      <div class="sixi-ops">
        <button id="btn-reset-sixi" class="ghost disabled" disabled>重新起卦</button>
        <button id="btn-sixi-main" class="primary">
          擲一次（<span id="sixi-count">0</span>/6）
        </button>
      </div>

      <!-- 倒數與確認框（原樣保留） -->
      <div id="sixi-countdown" class="countdown hidden" role="dialog" aria-modal="true" aria-labelledby="sixi-countdown-title">
        <div class="countdown-card">
          <h3 id="sixi-countdown-title">靜心倒數</h3>
          <p class="lead">請調息、凝神，專注於所問之事……</p>
          <div class="timer"><span id="sixi-timer">60</span> 秒</div>
        </div>
      </div>

      <div id="sixi-confirm" class="confirm hidden" role="dialog" aria-modal="true" aria-labelledby="sixi-confirm-title">
        <div class="confirm-card">
          <h3 id="sixi-confirm-title">重新起卦</h3>
          <p>重新起卦會重新計時 60 秒的靜心時間，請確認是否重新起卦？</p>
          <div class="confirm-actions">
            <button id="sixi-confirm-cancel" class="ghost">取消</button>
            <button id="sixi-confirm-ok" class="danger">確認</button>
          </div>
        </div>
      </div>
    </div>

    ${this.createNavigationButtons()}
  </div>

  <style>
    .sixi.single-col { display:flex; flex-direction:column; gap:12px; min-height:520px; }
    .gua-name { min-height:28px; font-weight:700; text-align:center; }

    /* 硬幣區 */
    .coins{ display:flex; gap:18px; justify-content:center; align-items:center; padding:6px 0 12px; }
    .coin{
      width:84px; height:84px; border-radius:50%; position:relative; perspective:800px;
      transform-style:preserve-3d;
    }
    .coin .face{
      position:absolute; inset:0; border-radius:50%; backface-visibility:hidden; overflow:hidden;
      display:grid; place-items:center; background:radial-gradient(circle at 35% 30%, #f6e7b8,#c8a44f 60%, #7a5f23 100%);
      border:2px solid #b48a2b; box-shadow: inset 0 3px 10px rgba(0,0,0,.35), 0 6px 18px rgba(0,0,0,.22);
    }
    .coin .back{ transform:rotateY(180deg); }
    .coin img{ width:74px; height:74px; object-fit:contain; }

    /* 翻轉動畫 */
    .coin.flip{ animation:coinFlip 900ms cubic-bezier(.2,.65,.2,1) infinite; }
    @keyframes coinFlip{
      0%{ transform:rotateY(0deg); }
      50%{ transform:rotateY(180deg) translateZ(0.01px); }
      100%{ transform:rotateY(360deg); }
    }

    /* 滾動效果（容器微晃＋位移） */
    #sixi-coins.roll { animation:rollShake 620ms ease-out; }
    @keyframes rollShake{
      0%{ transform:translateY(0) rotate(0deg); }
      20%{ transform:translateY(-6px) rotate(-2deg); }
      45%{ transform:translateY(2px) rotate(1.5deg); }
      70%{ transform:translateY(-2px) rotate(-1deg); }
      100%{ transform:translateY(0) rotate(0deg); }
    }

    /* 爻列表（原樣） */
    .yao-list{
      list-style:none; margin:0; padding:8px 6px; border:1px solid #ddd; border-radius:8px;
      display:flex; flex-direction:column; justify-content:flex-end;
      min-height:240px; gap:8px; background:#fafafa;
    }
    .yao-slot{ min-height:28px; display:flex; align-items:center; justify-content:center; }
    .yao-item{ display:inline-flex; align-items:center; gap:10px; }
    .yao-num{ width:16px; text-align:right; font-weight:600; opacity:.85; }
    .yao-text{ font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:18px; letter-spacing:1px; }
    .yao-moving{ color:#ef4444; }

    .sixi-ops{ display:flex; gap:10px; justify-content:center; padding-top:6px; }
    .primary{ padding:12px 18px; border-radius:999px; background:#2563eb; color:#fff; border:none; cursor:pointer; }
    .ghost{ padding:10px 14px; border-radius:10px; background:#fff; border:1px solid #d1d5db; cursor:pointer; }
    .disabled{ opacity:.5; pointer-events:none; cursor:not-allowed; }

    .countdown,.confirm{ position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.4); z-index:50; }
    .hidden{ display:none; }
    .countdown-card,.confirm-card{ width:min(520px,92vw); padding:24px; background:white; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.15); text-align:center; }
    .timer{ font-size:42px; font-weight:800; margin-top:10px; }
    .confirm-actions{ margin-top:16px; display:flex; gap:8px; justify-content:center; }
    .danger{ background:#ef4444; color:white; border:none; padding:10px 14px; border-radius:10px; }
  </style>
`;


  // 固定為六爻模式
  this.userData.method = 'liuyao';

  // 啟用六次點擊流程（含鎖定上一/下一步）
  this.setupSixiListeners();
}

// 第六步：選擇問題類型（修正版）
showQuestionSelectionStep() {
    // ✅ 不再要求使用者手選起卦方式；若已有六爻資料，默認為六爻
    if (!this.userData.method) {
        if (this.userData.liuyaoData && this.userData.liuyaoData.length === 6) {
            this.userData.method = 'liuyao';
        } else {
            // 仍在新流程下，預設就是六爻
            this.userData.method = 'liuyao';
        }
    }

    // ✅ 舊流程的手動輸入保留容錯（若你不再用可移除）
    if (this.userData.method === 'liuyao' && this.userData.liuyaoData.length === 0) {
        this.collectLiuyaoData();
        if (this.userData.liuyaoData.length === 0) {
            // 這裡不跳回去、不警告，直接允許先選問題再回前一步補起卦
            console.warn('尚未完成六爻輸入，允許先選問題內容');
        }
    }

    this.modal.innerHTML = `
        <div class="tutorial-content">
            <h2>選擇問題類型</h2>
            <div class="question-selection">
                <div class="question-options">
                    <h4>1. 請選擇問題類型：</h4>
                    <div class="question-grid">
                        <label class="question-option">
                            <input type="radio" name="question-type" value="love-female">
                            <span>感情/問女方</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="love-male">
                            <span>感情/問男方</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="parents">
                            <span>問父母</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="children">
                            <span>問子女</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="career">
                            <span>問事業</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="health">
                            <span>問健康</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="wealth">
                            <span>問財官</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="partnership">
                            <span>問合作合夥</span>
                        </label>
                        <label class="question-option">
                            <input type="radio" name="question-type" value="lawsuit">
                            <span>問官司</span>
                        </label>
                    </div>
                </div>
                
                <div class="custom-question">
                    <h4>2. 輸入問題內容，並儘量詳細：</h4>
                    <textarea id="custom-question" 
                             placeholder="請詳細描述您想問的問題..."
                             rows="4" 
                             maxlength="500"
                             required></textarea>
                    <div class="char-counter">
                        <span id="char-count">0</span>/500 字
                    </div>
                    <p class="note">請先選擇上方的問題類型，然後在此處輸入您的具體問題內容。</p>
                </div>
            </div>
            ${this.createNavigationButtons()}
        </div>
        <style>
            .question-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin: 15px 0;
            }
            .question-option {
                display: flex;
                align-items: center;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .question-option:hover {
                background-color: #f0f0f0;
            }
            .question-option input {
                margin-right: 8px;
            }
            .custom-question {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
            .custom-question textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-family: inherit;
                resize: vertical;
                margin-top: 10px;
            }
            .custom-question textarea:focus {
                border-color: #007bff;
                outline: none;
            }
            .char-counter {
                text-align: right;
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }
            .note {
                font-size: 14px;
                color: #666;
                margin-top: 10px;
                line-height: 1.4;
            }
        </style>
    `;

    // 添加字數計算
    const textarea = document.getElementById('custom-question');
    const charCount = document.getElementById('char-count');
    
    textarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

    // 第七步：解卦方式選擇
    showDivinationOptionsStep() {
    const radioButtons = document.querySelectorAll('input[name="question-type"]');
    const customQuestionElement = document.getElementById('custom-question');
    const customQuestion = customQuestionElement ? customQuestionElement.value.trim() : '';
    let selectedType = '';
    radioButtons.forEach(radio => {
        if (radio.checked) {
            selectedType = radio.value;
        }
    });
    // 檢查兩個都要填寫，但不清除已輸入的內容
    if (!selectedType && !customQuestion) {
        alert('請選擇問題類型並輸入問題內容');
        return; // 直接返回，不執行 previousStep()
    } else if (!selectedType) {
        alert('請選擇問題類型');
        return; // 直接返回，不執行 previousStep()
    } else if (!customQuestion) {
        alert('請輸入問題內容');
        return; // 直接返回，不執行 previousStep()
    }
            // 驗證通過，保存數據
    this.userData.questionType = selectedType;
    this.userData.customQuestion = customQuestion;
        // 執行起卦
        this.performDivination();

        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>選擇解卦方式</h2>
                <div class="divination-info">
                    <p><strong>起卦完成！</strong></p>
                    <div class="gua-summary">
                        <p>起卦方式：${this.userData.method === 'random' ? '隨機起卦' : '六爻起卦'}</p>
                        <p>問題類型：${this.getQuestionTypeText()}</p>
                        ${this.userData.customQuestion ? `<p>問題：${this.userData.customQuestion}</p>` : ''}
                    </div>
                </div>
                
                <div class="divination-options">
                    <div class="option-card ai-option" onclick="divinationTutorial.selectAIDivination()">
                        <h3>🤖 AI智能解卦</h3>
                        <p>結合AI技術提供個性化深度分析</p>
                        <div class="option-limit">每日限用1次 - 免費</div>
                    </div>
                    
                    <div class="option-card master-option" onclick="divinationTutorial.selectMasterDivination()">
                        <h3>👨‍🏫 卦師親自解卦</h3>
                        <p>由專業卦師提供完整深度解析</p>
                        <div class="option-price">NT$ 300</div>
                    </div>
                </div>
                
                <div class="tutorial-navigation">
                    <button class="btn btn-secondary" onclick="divinationTutorial.previousStep()">
                        上一步
                    </button>
                    <span class="step-indicator">${this.currentStep} / ${this.totalSteps}</span>
                    <button class="btn btn-tertiary" onclick="divinationTutorial.neverShowAgain()">
                        下次不用再提醒我
                    </button>
                </div>
            </div>
            <style>
                .divination-info {
                    background: #e8f5e8;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                }
                .gua-summary {
                    margin-top: 15px;
                }
                .gua-summary p {
                    margin: 8px 0;
                    color: #333;
                }
                .divination-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .option-card {
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    padding: 25px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: white;
                }
                .option-card:hover {
                    border-color: #007bff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,123,255,0.15);
                }
                .option-card h3 {
                    margin: 0 0 15px 0;
                    color: #333;
                }
                .option-card p {
                    margin: 0 0 15px 0;
                    color: #666;
                    line-height: 1.4;
                }
                .option-limit {
                    color: #28a745;
                    font-weight: bold;
                    font-size: 14px;
                }
                .option-price {
                    color: #007bff;
                    font-weight: bold;
                    font-size: 18px;
                }
                .btn-tertiary {
                    background: #ffc107;
                    color: #333;
                }
            </style>
        `;
    }

    // 第八步：顯示結果
    showResultStep() {
        // 這步會在選擇解卦方式後動態生成
    }
// --- 六次點擊：內部狀態 ---
initSixiState() {
  this._sixi = {
    n: 0, data: [], locked: false, mode: 'rolling',
    timerId: null, countdownRemain: 60,
    nav: { prev: null, next: null }
  };
}
sixiBindNavButtons() {
  // 這兩個選擇器如與你專案不同，改成你的 ID / class
  this._sixi.nav.prev = this.modal.querySelector('#tutorial-prev');
  this._sixi.nav.next = this.modal.querySelector('#tutorial-next');

  // 初始：未點擊前，允許 prev；禁用 next
  this.sixiSetPrevDisabled(false);
  this.sixiSetNextDisabled(true);

  // 在本步強制攔截點擊（防止外面沒理會 disabled）
  if (this._sixi.nav.prev) {
    this._sixi.nav.prev.addEventListener('click', (e) => {
      if (this._sixi.n > 0) { // 一旦開始就禁止上一步
        e.preventDefault(); e.stopPropagation();
      }
    }, true);
  }
  if (this._sixi.nav.next) {
    this._sixi.nav.next.addEventListener('click', (e) => {
      if (this._sixi.n < 6) { // 未滿 6 次不給下一步
        e.preventDefault(); e.stopPropagation();
      }
    }, true);
  }
}
// 權重抽樣（0..3, weights 1:3:3:1）
sixiWeightedPick() {
  // 0..3, 權重 1:3:3:1
  const r = Math.floor(Math.random() * 8); // 0..7
  if (r === 0) return 0;
  if (r <= 3) return 1;
  if (r <= 6) return 2;
  return 3;
}
sixiIsYang(v) { return v === 1 || v === 3; }      // 1/3 陽
sixiIsMoving(v) { return v === 0 || v === 3; }    // 0 老陰、3 老陽

/* 爻渲染：左邊顯示數字，右邊用字元條 */
sixiRenderYao(slotIndex, v) {
  const slot = this.modal.querySelector(`.yao-slot[data-slot="${slotIndex}"]`);
  if (!slot) return;
  const isYang = this.sixiIsYang(v);
  const isMoving = this.sixiIsMoving(v);
  const text = isYang ? '▇▇▇▇▇▇▇▇▇' : '▇▇▇▇  ▇▇▇▇';

  const wrap = document.createElement('div');
  wrap.className = 'yao-item' + (isMoving ? ' yao-moving' : '');

  const num = document.createElement('span');
  num.className = 'yao-num';
  num.textContent = String(v);

  const span = document.createElement('span');
  span.className = 'yao-text';
  span.textContent = text;

  wrap.appendChild(num);
  wrap.appendChild(span);
  slot.innerHTML = '';
  slot.appendChild(wrap);
}


sixiClearUI() {
  this.modal.querySelectorAll('.yao-slot').forEach(li => (li.innerHTML = ''));
  const nameEl = this.modal.querySelector('#sixi-gua-name');
  if (nameEl) nameEl.textContent = '';
}

sixiComputeGuaNameByBits(bits /* 初→上, 1=陽,0=陰 */) {
  const dict = (typeof window !== 'undefined' && window.GUA_64_COMPLETE)
            || (typeof GUA_64_COMPLETE !== 'undefined' ? GUA_64_COMPLETE : null)
            || this.GUA_64_COMPLETE || null;
  const dbg = { hasDict: !!dict, bits, bottomUp: bits.join(''), topDown: bits.slice().reverse().join('') };
  if (dict && typeof dict === 'object') {
    const e1 = dict[dbg.bottomUp];
    const e2 = dict[dbg.topDown];
    dbg.matchBottomUp = !!(e1 && e1.name);
    dbg.matchTopDown = !!(e2 && e2.name);
    dbg.name = e1?.name || e2?.name || '';
    console.debug('[GUA DEBUG]', dbg);
    return dbg.name || '';
  }
  console.debug('[GUA DEBUG] dict not found', dbg);
  return '';
}

sixiRenderGuaNameIfReady() {
  if (!this._sixi || this._sixi.n !== 6) return;
  const bits = this._sixi.data.map(v => (this.sixiIsYang(v) ? 1 : 0)); // 初→上
  const name = this.sixiComputeGuaNameByBits(bits);
  const el = this.modal.querySelector('#sixi-gua-name');
  if (el) el.textContent = name ? `本卦：${name}` : '(未匹配到卦名，請查看 Console 的 [GUA DEBUG])';
}

// 僅重置狀態與畫面（不啟動倒數）
sixiResetStateOnly() {
  if (!this._sixi) this.initSixiState();
  this._sixi.n = 0; this._sixi.data = []; this._sixi.locked = false; this._sixi.mode = 'rolling';
  if (this.userData) this.userData.liuyaoData = [];

  // 清 UI
  this.modal.querySelectorAll('.yao-slot').forEach(li => (li.innerHTML = ''));
  const nameEl = this.modal.querySelector('#sixi-gua-name'); if (nameEl) nameEl.textContent = '';
  const cnt = this.modal.querySelector('#sixi-count'); if (cnt) cnt.textContent = '0';
  const main = this.modal.querySelector('#btn-sixi-main'); if (main) main.innerHTML = '擲一次（<span id="sixi-count">0</span>/6）';
  // 重新起卦在第一擲之前不可點
  const reset = this.modal.querySelector('#btn-reset-sixi'); if (reset) { reset.classList.add('disabled'); reset.setAttribute('disabled',''); }

  // 導覽鎖定（未滿 6 次禁用 Next；一開始允許 Prev）
  this.sixiSetNextDisabled(true);
  this.sixiSetPrevDisabled(false);
}
// 倒數視窗
sixiOpenCountdown() {
  const mask = this.modal.querySelector('#sixi-countdown');
  if (!mask) return;
  mask.classList.remove('hidden');
  this._sixi.countdownRemain = 60;
  const timerEl = this.modal.querySelector('#sixi-timer');
  if (timerEl) timerEl.textContent = this._sixi.countdownRemain;

  this._sixi.timerId = setInterval(() => {
    this._sixi.countdownRemain -= 1;
    if (timerEl) timerEl.textContent = this._sixi.countdownRemain;
    if (this._sixi.countdownRemain <= 0) {
      clearInterval(this._sixi.timerId); this._sixi.timerId = null;
      this.sixiCloseCountdown();
      this.sixiResetStateOnly();
    }
  }, 1000);
}
sixiCloseCountdown() {
  const mask = this.modal.querySelector('#sixi-countdown');
  if (mask) mask.classList.add('hidden');
}

/* 確認框 */
sixiOpenConfirm() {
  const dlg = this.modal.querySelector('#sixi-confirm');
  if (dlg) dlg.classList.remove('hidden');
}
sixiCloseConfirm() {
  const dlg = this.modal.querySelector('#sixi-confirm');
  if (dlg) dlg.classList.add('hidden');
}
sixiSetPrevDisabled(disabled) {
  if (!this._sixi.nav.prev) return;
  this._sixi.nav.prev.toggleAttribute('disabled', !!disabled);
  this._sixi.nav.prev.classList.toggle('disabled', !!disabled);
}
sixiSetNextDisabled(disabled) {
  if (!this._sixi.nav.next) return;
  this._sixi.nav.next.toggleAttribute('disabled', !!disabled);
  this._sixi.nav.next.classList.toggle('disabled', !!disabled);
}
sixiSetResetDisabled(disabled) {
  const resetBtn = this.modal.querySelector('#btn-reset-sixi');
  if (!resetBtn) return;
  resetBtn.toggleAttribute('disabled', !!disabled);
  resetBtn.classList.toggle('disabled', !!disabled);
}
// 主按鈕行為
// 置於你的 DivinationTutorial 類別裡，直接覆蓋原本的 sixiOnMainClick()
sixiOnMainClick() {
  // 確保狀態存在
  if (!this._sixi) this.initSixiState();
  if (this._sixi.locked) return; // 避免連點

  // 若已完成 6 爻 → 進入解卦（沿用你現有流程）
  if (this._sixi.mode === 'ready') {
    this.userData.method = 'liuyao';
    try {
      const ret = (typeof this.performLiuyaoDivination === 'function')
        ? this.performLiuyaoDivination()
        : null;

      const goNext = () => {
        if (typeof this.goToStep === 'function') {
          this.goToStep(6);
        } else if (typeof this.showQuestionSelectionStep === 'function') {
          this.showQuestionSelectionStep();
        }
      };

      if (ret && typeof ret.then === 'function') {
        ret.then(goNext).catch(() => goNext());
      } else {
        goNext();
      }
    } catch (e) {
      // 出錯也盡量往下一步
      if (typeof this.showQuestionSelectionStep === 'function') this.showQuestionSelectionStep();
    }
    return;
  }

  // 進行第 n 次擲爻
  if (this._sixi.n >= 6) return;
  this._sixi.locked = true;

  // 以 1:3:3:1 權重抽 0..3（對應 6/7/8/9）
  const v = this.sixiWeightedPick();
  // 反推出三枚硬幣的正/反，用於動畫定格顯示
  const faces = this.sixiFacesFromV(v);

  // 先播放「翻轉＋滾動」動畫 → 再入帳並渲染本次爻
  this.sixiAnimateCoins(faces).then(() => {
    // 累積資料
    this._sixi.data.push(v);
    this._sixi.n += 1;

    // 對外保留：給後續裝卦/用神計算使用
    if (this.userData) this.userData.liuyaoData = this._sixi.data.slice();

    // 渲染本次爻（自下而上）：第 n 次落在 slotIndex = 7 - n
    const slotIndex = 7 - this._sixi.n;
    this.sixiRenderYao(slotIndex, v);

    // 首次擲到後，開放「重新起卦」按鈕並禁用「上一步」
    if (this._sixi.n === 1) {
      const reset = this.modal.querySelector('#btn-reset-sixi');
      if (reset) {
        reset.classList.remove('disabled');
        reset.removeAttribute('disabled');
      }
      if (typeof this.sixiSetPrevDisabled === 'function') this.sixiSetPrevDisabled(true);
    }

    // 更新主按鈕顯示計數
    const cnt = this.modal.querySelector('#sixi-count');
    if (cnt) cnt.textContent = String(this._sixi.n);

    const main = this.modal.querySelector('#btn-sixi-main');
    if (main && this._sixi.n < 6) {
      main.innerHTML = '擲一次（<span id="sixi-count">' + this._sixi.n + '</span>/6）';
    }

    // 若滿六爻 → 切換為「開始解卦」
    if (this._sixi.n === 6) {
      this._sixi.mode = 'ready';
      if (typeof this.sixiRenderGuaNameIfReady === 'function') this.sixiRenderGuaNameIfReady();
      if (main) main.textContent = '開始解卦';
      if (typeof this.sixiSetNextDisabled === 'function') this.sixiSetNextDisabled(false);
    }
  }).catch(() => {
    // 動畫若失敗，至少把面顯示出來，避免卡住
    try { this.sixiSetCoinFaces(faces); } catch {}
  }).finally(() => {
    // 稍微延遲解除鎖，避免連點
    setTimeout(() => { this._sixi.locked = false; }, 200);
  });
}

/* 把 v(0..3) 映射成三枚硬幣正反組合 */
sixiFacesFromV(v){
  // v=0(老陰=6): 反反反
  // v=1(少陽=7): 兩反一正（位置隨機）
  // v=2(少陰=8): 兩正一反（位置隨機）
  // v=3(老陽=9): 正正正
  const faces = (v===0) ? ['反','反','反']
              : (v===3) ? ['正','正','正']
              : (v===1) ? ['反','反','正']
              :            ['正','正','反'];
  // 打散其中一枚的位置，讓畫面更自然
  if (v===1 || v===2){
    const i = Math.floor(Math.random()*3), j = Math.floor(Math.random()*3);
    [faces[i], faces[j]] = [faces[j], faces[i]];
  }
  return faces;
}

/* 把三枚硬幣顯示為指定面（支援自訂圖片；無圖片時以文字替代） */
sixiSetCoinFaces(faces){
  const box = this.modal.querySelector('#sixi-coins');
  if (!box) return;
  // 允許用戶在外部設定圖片 URL
  const frontURL = window.COIN_FRONT_URL || null; // 正面
  const backURL  = window.COIN_BACK_URL  || null; // 反面

  const coins = Array.from(box.querySelectorAll('.coin'));
  coins.forEach((coin, idx) => {
    const wantFront = faces[idx] === '正';
    // 先把翻轉清掉
    coin.classList.remove('flip');
    // 設定圖片（若無圖片則顯示底圖＋alt）
    coin.querySelectorAll('.coin-front').forEach(img=>{
      if (frontURL) { img.src = frontURL; img.style.opacity = 1; }
      else { img.removeAttribute('src'); img.style.opacity = 0; }
    });
    coin.querySelectorAll('.coin-back').forEach(img=>{
      if (backURL) { img.src = backURL; img.style.opacity = 1; }
      else { img.removeAttribute('src'); img.style.opacity = 0; }
    });
    // 讓正面朝上或背面朝上
    coin.style.transform = wantFront ? 'rotateY(0deg)' : 'rotateY(180deg)';
  });
}

/* 播放翻轉＋滾動動畫，最後定格到 faces 指定的面 */
sixiAnimateCoins(faces){
  const box = this.modal.querySelector('#sixi-coins');
  const coins = box ? Array.from(box.querySelectorAll('.coin')) : [];

  return new Promise(resolve=>{
    if (!box || coins.length!==3) { resolve(); return; }

    // 開始翻轉與滾動
    coins.forEach(c=>{
      c.classList.add('flip');
      c.style.animationDuration = (700 + Math.random()*500) + 'ms';
    });
    box.classList.add('roll');

    const maxT = Math.max(...coins.map(c => parseFloat(c.style.animationDuration))) + 120;

    setTimeout(()=>{
      // 定格
      coins.forEach(c=>{
        c.classList.remove('flip');
        c.style.animationDuration = '';
      });
      box.classList.remove('roll');
      this.sixiSetCoinFaces(faces);
      resolve();
    }, maxT);
  });
}

// 綁定此步驟的所有監聽
setupSixiListeners() {
  this.initSixiState();
  this.sixiBindNavButtons();
  this.sixiResetStateOnly();

  const mainBtn = this.modal.querySelector('#btn-sixi-main');
  const resetBtn = this.modal.querySelector('#btn-reset-sixi');
  const okBtn = this.modal.querySelector('#sixi-confirm-ok');
  const cancelBtn = this.modal.querySelector('#sixi-confirm-cancel');

  if (mainBtn) mainBtn.addEventListener('click', () => this.sixiOnMainClick());
  if (resetBtn) resetBtn.addEventListener('click', () => this.sixiOpenConfirm());
  if (cancelBtn) cancelBtn.addEventListener('click', () => this.sixiCloseConfirm());
  if (okBtn) okBtn.addEventListener('click', () => { this.sixiCloseConfirm(); this.sixiOpenCountdown(); });

  // Space 鍵（倒數/確認中停用）
  window.addEventListener('keydown', (e) => {
    const cdOpen = !this.modal.querySelector('#sixi-countdown').classList.contains('hidden');
    const cfOpen = !this.modal.querySelector('#sixi-confirm').classList.contains('hidden');
    if (cdOpen || cfOpen) return;
    if (e.code === 'Space') { e.preventDefault(); this.sixiOnMainClick(); }
  }, { passive: false });

  // 保險：固定六爻
  this.userData.method = 'liuyao';
}
    // 設置方法選擇監聽器
    setupMethodSelectionListeners() {
        const randomRadio = document.getElementById('tutorial-random');
        const liuyaoRadio = document.getElementById('tutorial-liuyao');
        const randomDesc = document.getElementById('random-description');
        const liuyaoDesc = document.getElementById('liuyao-description');
        const liuyaoInputs = document.getElementById('liuyao-inputs');

        if (randomRadio) {
            randomRadio.addEventListener('change', () => {
                if (randomRadio.checked) {
                    randomDesc.style.display = 'block';
                    liuyaoDesc.style.display = 'none';
                    this.userData.method = 'random';
                }
            });
        }

        if (liuyaoRadio) {
            liuyaoRadio.addEventListener('change', () => {
                if (liuyaoRadio.checked) {
                    liuyaoDesc.style.display = 'block';
                    randomDesc.style.display = 'none';
                    if (liuyaoInputs) {
                        liuyaoInputs.style.display = 'block';
                    }
                    this.userData.method = 'liuyao';
                }
            });
        }
    }

    // 收集六爻數據
    collectLiuyaoData() {
        const data = [];
        for (let i = 1; i <= 6; i++) {
            const select = document.getElementById('dice-' + i);
            if (select) {
                data.push(parseInt(select.value));
            }
        }
        this.userData.liuyaoData = data;
    }

    // 收集問題數據
// 收集問題數據（加入驗證）
collectQuestionData() {
    const radioButtons = document.querySelectorAll('input[name="question-type"]');
    const customQuestion = document.getElementById('custom-question').value.trim();
    
    let selectedType = '';
    radioButtons.forEach(radio => {
        if (radio.checked) {
            selectedType = radio.value;
        }
    });
    
    // 檢查兩個都要填寫
    if (!selectedType) {
        alert('請選擇問題類型');
        return false;
    }
    
    if (!customQuestion) {
        alert('請輸入問題內容');
        return false;
    }
    
    this.userData.questionType = selectedType;
    this.userData.customQuestion = customQuestion;
    return true;
}

    // 執行起卦
    performDivination() {
        console.log('執行起卦，方式：', this.userData.method);
        
        if (this.userData.method === 'random') {
            // 調用隨機起卦功能
            if (typeof randomDivination === 'function') {
                randomDivination();
                this.userData.divinationResult = 'random_completed';
            }
        } else if (this.userData.method === 'liuyao') {
            // 調用六爻起卦功能
            this.performLiuyaoDivination();
        }
        
        console.log('起卦完成，結果：', this.userData.divinationResult);
    }

    // 執行六爻起卦
    performLiuyaoDivination() {
        const results = this.userData.liuyaoData;
        
        // 存儲到全域變數 dice1~dice6
        window.dice1 = results[0];
        window.dice2 = results[1];
        window.dice3 = results[2];
        window.dice4 = results[3];
        window.dice5 = results[4];
        window.dice6 = results[5];
        
        // 建立Yinyuang1~Yinyuang6常數
        window.Yinyuang1 = (window.dice1 === 0 || window.dice1 === 2) ? 0 : 1;
        window.Yinyuang2 = (window.dice2 === 0 || window.dice2 === 2) ? 0 : 1;
        window.Yinyuang3 = (window.dice3 === 0 || window.dice3 === 2) ? 0 : 1;
        window.Yinyuang4 = (window.dice4 === 0 || window.dice4 === 2) ? 0 : 1;
        window.Yinyuang5 = (window.dice5 === 0 || window.dice5 === 2) ? 0 : 1;
        window.Yinyuang6 = (window.dice6 === 0 || window.dice6 === 2) ? 0 : 1;
        
        // 建立guamap1~guamap6
        if (typeof createGuaMap === 'function') {
            window.guamap1 = createGuaMap(window.dice1);
            window.guamap2 = createGuaMap(window.dice2);
            window.guamap3 = createGuaMap(window.dice3);
            window.guamap4 = createGuaMap(window.dice4);
            window.guamap5 = createGuaMap(window.dice5);
            window.guamap6 = createGuaMap(window.dice6);
        }
        
        this.userData.divinationResult = 'liuyao_completed';
    }

    // 獲取問題類型文字
    getQuestionTypeText() {
        const typeMap = {
            'love-female': '感情/問女方',
            'love-male': '感情/問男方',
            'parents': '問父母',
            'children': '問子女',
            'career': '問事業',
            'health': '問健康',
            'wealth': '問財官',
            'partnership': '問合作合夥',
            'lawsuit': '問官司'
        };
        
        if (this.userData.customQuestion) {
            return '自定義問題';
        }
        
        return typeMap[this.userData.questionType] || '未選擇';
    }

    // 選擇AI解卦
// 選擇AI解卦（修改版 - 加入使用限制）
selectAIDivination() {
    console.log('用戶選擇AI解卦');
    
    // 檢查今日AI解卦使用次數
    const today = new Date().toDateString();
    const usage = localStorage.getItem('ai_divination_usage');
    const usageData = usage ? JSON.parse(usage) : {};
    const todayUsage = usageData[today] || 0;
    
    // 如果今日已使用過，顯示限制提示
    if (todayUsage > 0) {
        this.showUsageLimitModal();
        return;
    }
    
    // 記錄使用次數
    usageData[today] = 1;
    localStorage.setItem('ai_divination_usage', JSON.stringify(usageData));
    
    // 顯示AI解卦結果（進度條版本）
    this.showAIDivinationResultWithProgress();
}
    // 顯示使用次數限制提示
showUsageLimitModal() {
    this.modal.innerHTML = `
        <div class="tutorial-content">
            <h2>AI解卦使用限制</h2>
            <div class="usage-limit-info">
                <p>您今日已使用過AI解卦，每日限用1次。</p>
                <p>如需更多解卦服務，可選擇以下方案：</p>
            </div>
            
            <div class="usage-options">
                <div class="option-card" onclick="divinationTutorial.showPurchaseModal()">
                    <h3>購買AI解卦</h3>
                    <p>單次使用</p>
                    <div class="option-price">NT$ 39</div>
                </div>
                
                <div class="option-card" onclick="divinationTutorial.selectMasterDivination()">
                    <h3>卦師解卦</h3>
                    <p>專業卦師親自為您解卦</p>
                    <div class="option-price">NT$ 300</div>
                </div>
                
                <div class="option-card tomorrow-option" onclick="divinationTutorial.closeTutorial()">
                    <h3>明日再占</h3>
                    <p>明天可再次免費使用</p>
                    <div class="option-free">免費</div>
                </div>
            </div>
        </div>
        <style>
            .usage-limit-info {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .usage-options {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 30px;
            }
            .option-card {
                border: 2px solid #ddd;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
                display: flex;
                flex-direction: column;
                height: 140px;
            }
            .option-card:hover {
                border-color: #007bff;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,123,255,0.15);
            }
            .option-card h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 18px;
            }
            .option-card p {
                margin: 0 0 auto 0;
                color: #666;
                font-size: 14px;
                flex-grow: 1;
            }
            .option-price {
                color: #007bff;
                font-weight: bold;
                font-size: 18px;
                margin-top: 10px;
            }
            .option-free {
                color: #28a745;
                font-weight: bold;
                font-size: 16px;
                margin-top: 10px;
            }
            .tomorrow-option {
                border-color: #28a745;
            }
            @media (max-width: 768px) {
                .usage-options {
                    grid-template-columns: 1fr;
                }
                .option-card {
                    height: auto;
                }
            }
        </style>
    `;
}
    // 顯示購買AI解卦視窗
showPurchaseModal() {
    alert('付費功能開發中，暫時無法使用。請選擇其他方案或明日再占。');
    // TODO: 整合綠界科技支付API
    // 付費完成後調用 this.completePurchase()
}

// 完成付費後的處理
completePurchase() {
    console.log('AI解卦付費完成');
    
    const today = new Date().toDateString();
    const paidUsage = localStorage.getItem('ai_paid_usage') || '{}';
    const paidUsageData = JSON.parse(paidUsage);
    
    if (!paidUsageData[today]) {
        paidUsageData[today] = 0;
    }
    paidUsageData[today]++;
    
    localStorage.setItem('ai_paid_usage', JSON.stringify(paidUsageData));
    
    this.showAIDivinationResultWithProgress();
}
    // 顯示AI解卦結果（進度條版本）
async showAIDivinationResultWithProgress() {
    this.modal.innerHTML = `
        <div class="tutorial-content">
            <h2>AI智能解卦</h2>
            <div class="ai-analysis-container">
                <div class="gua-display">
                    <h3>卦象資訊</h3>
                    <div id="gua-info">正在生成卦象...</div>
                </div>
                <div class="ai-result">
                    <h3>AI分析結果</h3>
                    <div id="ai-content">
                        <div class="ai-progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill"></div>
                            </div>
                            <div class="progress-text" id="progress-text">起卦中...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="result-actions">
                <button class="btn btn-primary" onclick="divinationTutorial.continueReading()" id="continue-btn">
                    繼續起卦
                </button>
                <button class="btn btn-secondary" onclick="divinationTutorial.downloadResult()" id="download-btn" style="display: none;">
                    下載解卦報告
                </button>
                <button class="btn btn-tertiary" onclick="divinationTutorial.selectMasterDivination()">
                    還需要卦師親自斷卦
                </button>
            </div>
        </div>
        <style>
            .ai-progress-container {
                text-align: center;
                padding: 40px 20px;
            }
            .progress-bar {
                width: 100%;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 20px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #007bff, #0056b3);
                width: 0%;
                transition: width 0.5s ease;
                border-radius: 10px;
            }
            .progress-text {
                font-size: 16px;
                color: #333;
                font-weight: 500;
            }
        </style>
    `;
    
    this.setupDivinationEnvironment();
    this.generateGuaDisplay();
    this.performAIDivinationWithProgress();
}

// 執行AI解卦（進度條版本）
async performAIDivinationWithProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (!progressFill || !progressText) return;
    
    const progressSteps = [
        { text: "起卦中", progress: 15, delay: 800 },
        { text: "正在生成卦象", progress: 30, delay: 1000 },
        { text: "解析用神衰旺", progress: 50, delay: 1200 },
        { text: "解析本卦與變卦", progress: 70, delay: 1000 },
        { text: "解讀卦象", progress: 85, delay: 1500 },
        { text: "建立批卦報告", progress: 100, delay: 800 }
    ];
    
    try {
        for (let i = 0; i < progressSteps.length; i++) {
            const step = progressSteps[i];
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }
        
        const customQuestion = this.userData.customQuestion || 
                             `關於${this.getQuestionTypeText()}的問題`;
        
        const aiResponse = await this.callAIDirectly(customQuestion);
        this.displayAIResult(aiResponse);
        
    } catch (error) {
        console.error('AI解卦失敗:', error);
        const aiContentDiv = document.getElementById('ai-content');
        if (aiContentDiv) {
            aiContentDiv.innerHTML = `
                <div class="error-message">
                    <h4>AI分析暫時無法使用</h4>
                    <p>系統暫時無法提供AI解卦服務，建議您選擇卦師親自解卦。</p>
                </div>
            `;
        }
    }
}

    // 選擇卦師解卦
// 選擇卦師解卦 - 修正版本
selectMasterDivination() {
    console.log('用戶選擇卦師解卦');
    
    // 設置標記，防止重複觸發
    this.isProcessingMasterDivination = true;
    
    // 先設置好起卦環境
    this.setupDivinationEnvironment();
    
    // 準備問題內容
    const questionText = this.userData.customQuestion || '';
    const questionType = this.userData.questionType;
    
    // 立即關閉引導精靈
    this.closeTutorial();
    
    // 延遲顯示卦師解卦modal，確保引導精靈完全關閉
    setTimeout(() => {
        // 再次確認引導精靈已關閉
        if (document.getElementById('tutorial-overlay')) {
            document.getElementById('tutorial-overlay').remove();
        }
        
        // 調用現有的卦師解卦功能
        if (typeof showMasterDivinationModal === 'function') {
            try {
                showMasterDivinationModal(questionType, questionText);
                
                // 如果有問題內容，自動填入表單
                if (questionText) {
                    setTimeout(() => {
                        const questionInput = document.querySelector('#master-question, [name="question"], textarea[placeholder*="問題"]');
                        if (questionInput) {
                            questionInput.value = questionText;
                            console.log('已自動填入問題內容:', questionText);
                        }
                    }, 200);
                }
            } catch (error) {
                console.error('顯示卦師解卦modal時發生錯誤:', error);
                alert('卦師解卦功能暫時無法使用，請稍後再試');
            }
        } else {
            console.error('找不到 showMasterDivinationModal 函數');
            alert('卦師解卦功能暫時無法使用，請稍後再試');
        }
        
        // 重置標記
        this.isProcessingMasterDivination = false;
    }, 200);
}

    // 顯示AI解卦結果
    async showAIDivinationResult() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>AI智能解卦</h2>
                <div class="ai-analysis-container">
                    <div class="gua-display">
                        <h3>卦象資訊</h3>
                        <div id="gua-info">正在生成卦象...</div>
                    </div>
                    <div class="ai-result">
                        <h3>AI分析結果</h3>
                        <div id="ai-content">
                            <div class="loading-spinner">
                                <div class="spinner"></div>
                                <p>AI正在分析卦象，請稍候...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-secondary" onclick="divinationTutorial.closeTutorial()">
                        完成
                    </button>
                    <button class="btn btn-primary" onclick="divinationTutorial.downloadResult()" id="download-btn" style="display: none;">
                        下載解卦報告
                    </button>
                    <button class="btn btn-tertiary" onclick="divinationTutorial.selectMasterDivination()">
                        還需要卦師親自斷卦
                    </button>
                </div>
            </div>
            <style>
                .ai-analysis-container {
                    margin: 20px 0;
                }
                .gua-display, .ai-result {
                    margin: 20px 0;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: #f9f9f9;
                }
                .gua-display h3, .ai-result h3 {
                    margin: 0 0 15px 0;
                    color: #333;
                }
                .loading-spinner {
                    text-align: center;
                    padding: 30px;
                }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .result-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                    flex-wrap: wrap;
                }
                .btn-tertiary {
                    background: #17a2b8;
                    color: white;
                }
            </style>
        `;
        
        // 設置起卦環境
        this.setupDivinationEnvironment();
        
        // 生成卦象顯示
        this.generateGuaDisplay();
        
        // 調用AI解卦
        this.performAIDivination();
    }

    // 設置起卦環境（為了讓現有功能正常運作）
    setupDivinationEnvironment() {
            // 暫存原始函數
    if (typeof handleHiddenYongshen === 'function' && !this.originalHandleHiddenYongshen) {
        this.originalHandleHiddenYongshen = window.handleHiddenYongshen;
        
        // 在引導模式中覆寫為空函數
        window.handleHiddenYongshen = function(targetLiuqin) {
            console.log('引導模式：跳過用神伏藏警告');
            // 不顯示alert，直接返回
            return;
        };
    }
        // 更新時間顯示
        if (typeof updateTimeDisplay === 'function') {
            updateTimeDisplay();
        }
        
        // 顯示主表格並填入數據
        if (typeof showMainTable === 'function') {
            showMainTable();
        }
        
        // 根據起卦方式填入表格
        if (this.userData.method === 'liuyao' && typeof fillLiuyaoGuaTable === 'function') {
            fillLiuyaoGuaTable();
        } else if (this.userData.method === 'random' && typeof fillLiuyaoGuaTable === 'function') {
            fillLiuyaoGuaTable(); // 隨機起卦也使用相同的填表邏輯
        }
        
        // 設置用神
        this.setupYongshen();
        
        // 執行相關分析
        setTimeout(() => {
            if (typeof analyzeGuabian === 'function') {
                analyzeGuabian();
            }
            if (typeof analyzeYaoRiyue === 'function') {
                analyzeYaoRiyue();
            }
        }, 500);
    }

    // 設置用神
    setupYongshen() {
        const yongshenSelect = document.getElementById('yongshen-method');
        if (yongshenSelect && this.userData.questionType) {
            // 根據問題類型設置用神
            const yongshenMapping = {
                'love-female': 'qicai',
                'love-male': 'guanGui',
                'parents': 'fumu',
                'children': 'zisun',
                'career': 'guanGui',
                'health': 'shi',
                'wealth': 'qicai',
                'partnership': 'xiongdi',
                'lawsuit': 'guanGui'
            };
            
            const yongshen = yongshenMapping[this.userData.questionType];
            if (yongshen) {
                yongshenSelect.value = yongshen;
                
                // 觸發用神選擇處理
                setTimeout(() => {
                    if (typeof handleYongshenSelection === 'function') {
                        handleYongshenSelection();
                    }
                }, 100);
            }
        }
    }

    // 生成卦象顯示
    generateGuaDisplay() {
        const guaInfoDiv = document.getElementById('gua-info');
        if (!guaInfoDiv) return;
        
        let guaInfo = `
            <div class="gua-summary">
                <p><strong>起卦方式：</strong>${this.userData.method === 'random' ? '隨機起卦' : '六爻起卦'}</p>
                <p><strong>問題類型：</strong>${this.getQuestionTypeText()}</p>
        `;
        
        if (this.userData.customQuestion) {
            guaInfo += `<p><strong>具體問題：</strong>${this.userData.customQuestion}</p>`;
        }
        
        if (this.userData.method === 'liuyao') {
            guaInfo += `<p><strong>六爻結果：</strong>${this.userData.liuyaoData.join(', ')}</p>`;
        }
        
        // 嘗試獲取卦名
        try {
            if (typeof getMainGuaName === 'function') {
                const mainGuaName = getMainGuaName();
                if (mainGuaName && mainGuaName !== 'GN') {
                    guaInfo += `<p><strong>主卦：</strong>${mainGuaName}</p>`;
                }
            }
            
            if (typeof getChangeGuaName === 'function') {
                const changeGuaName = getChangeGuaName();
                if (changeGuaName && changeGuaName !== 'BGN') {
                    guaInfo += `<p><strong>變卦：</strong>${changeGuaName}</p>`;
                }
            }
        } catch (error) {
            console.log('獲取卦名時出錯:', error);
        }
        
        guaInfo += `</div>`;
        
        guaInfoDiv.innerHTML = guaInfo;
    }

    // 執行AI解卦
    async performAIDivination() {
        const aiContentDiv = document.getElementById('ai-content');
        if (!aiContentDiv) return;
        
        try {
            // 檢查AI解卦功能是否可用
            if (typeof aiDivination === 'undefined') {
                throw new Error('AI解卦功能未載入');
            }
            
            // 增加使用次數
            if (typeof aiDivination.incrementUsage === 'function') {
                aiDivination.incrementUsage();
            }
            
            // 調用現有的AI解卦功能
            if (typeof generateAIInterpretation === 'function') {
                // 使用現有的AI解卦函數
                const customQuestion = this.userData.customQuestion || 
                                     `關於${this.getQuestionTypeText()}的問題`;
                
                // 模擬調用generateAIInterpretation但不顯示modal
                const aiResponse = await this.callAIDirectly(customQuestion);
                this.displayAIResult(aiResponse);
            } else {
                throw new Error('AI解卦功能不可用');
            }
            
        } catch (error) {
            console.error('AI解卦失敗:', error);
            aiContentDiv.innerHTML = `
                <div class="error-message">
                    <h4>AI分析暫時無法使用</h4>
                    <p>系統暫時無法提供AI解卦服務，建議您選擇卦師親自解卦。</p>
                </div>
                <style>
                    .error-message {
                        text-align: center;
                        padding: 30px;
                        color: #666;
                    }
                    .error-message h4 {
                        color: #dc3545;
                        margin-bottom: 15px;
                    }
                </style>
            `;
        }
    }

    // 直接調用AI解卦
    async callAIDirectly(customQuestion) {
        try {
            if (typeof extractHexagramData === 'function' && typeof aiDivination.callAIAPI === 'function') {
                const hexagramData = extractHexagramData();
                hexagramData.customQuestion = customQuestion;
                
                const response = await aiDivination.callAIAPI(hexagramData, this.userData.questionType);
                return response;
            } else {
                // 備用方案：調用簡化版AI分析
                return this.generateSimpleAIResponse(customQuestion);
            }
        } catch (error) {
            console.error('直接調用AI解卦失敗:', error);
            throw error;
        }
    }
// 繼續起卦功能
continueReading() {
    console.log('用戶選擇繼續起卦');
    
    const currentMethod = this.userData.method;
    this.userData = {
        method: currentMethod,
        liuyaoData: [],
        questionType: '',
        customQuestion: '',
        divinationResult: null
    };
    
    this.showStep(5);
}
    // 生成簡化版AI回應（備用方案）
    generateSimpleAIResponse(question) {
        const responses = [
            `根據您問的「${question}」，從卦象來看，此事需要耐心等待時機成熟。目前情況雖有挑戰，但整體趨勢向好。建議您保持積極心態，適時採取行動。`,
            `針對「${question}」這個問題，卦象顯示當前處於變化之中。雖然過程可能會有些波折，但最終結果是正面的。建議謹慎行事，多聽取他人意見。`,
            `關於「${question}」，卦象提示您現在需要做出重要抉擇。建議您仔細分析利弊，依據內心的直覺做決定，同時要有充分的準備和耐心。`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 顯示AI結果
    displayAIResult(response) {
        const aiContentDiv = document.getElementById('ai-content');
        const downloadBtn = document.getElementById('download-btn');
        
        if (aiContentDiv) {
            aiContentDiv.innerHTML = `
                <div class="ai-response">
                    <div class="response-content">
                        ${this.formatAIResponse(response)}
                    </div>
                    <div class="response-footer">
                        <small>※ 此為AI輔助分析，建議搭配專業卦師諮詢以獲得更完整的解讀</small>
                    </div>
                </div>
                <style>
                    .ai-response {
                        line-height: 1.6;
                    }
                    .response-content {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        border-left: 4px solid #007bff;
                        margin-bottom: 15px;
                    }
                    .response-footer {
                        text-align: center;
                        color: #666;
                        font-style: italic;
                    }
                </style>
            `;
        }
        
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-block';
        }
    }

    // 格式化AI回應
    formatAIResponse(response) {
        if (!response) return '暫無分析結果';
        
        return response
            .replace(/【([^】]+)】/g, '<h5>$1</h5>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    }

    // 下載結果
    downloadResult() {
        const reportContent = this.generateReport();
        this.downloadAsFile(reportContent, `六爻解卦報告_${new Date().toLocaleDateString()}.txt`);
    }

    // 生成報告
    generateReport() {
        let report = `六爻解卦報告\n`;
        report += `生成時間：${new Date().toLocaleString()}\n`;
        report += `==========================================\n\n`;
        
        report += `起卦資訊：\n`;
        report += `起卦方式：${this.userData.method === 'random' ? '隨機起卦' : '六爻起卦'}\n`;
        report += `問題類型：${this.getQuestionTypeText()}\n`;
        
        if (this.userData.customQuestion) {
            report += `具體問題：${this.userData.customQuestion}\n`;
        }
        
        if (this.userData.method === 'liuyao') {
            report += `六爻結果：${this.userData.liuyaoData.join(', ')}\n`;
        }
        
        report += `\n卦象分析：\n`;
        const aiContentDiv = document.getElementById('ai-content');
        if (aiContentDiv) {
            const responseContent = aiContentDiv.querySelector('.response-content');
            if (responseContent) {
                report += responseContent.textContent || responseContent.innerText || '';
            }
        }
        
        report += `\n\n==========================================\n`;
        report += `※ 此報告僅供參考，實際情況請以現實為準\n`;
        
        return report;
    }

    // 下載文件
    downloadAsFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // 創建導航按鈕
    createNavigationButtons() {
        const prevDisabled = this.currentStep <= 1 ? 'disabled' : '';
        const nextText = this.currentStep >= this.totalSteps ? '完成' : '下一步';
        
        return `
            <div class="tutorial-navigation">
                <button class="btn btn-secondary" ${prevDisabled} onclick="divinationTutorial.previousStep()">
                    上一步
                </button>
                <span class="step-indicator">${this.currentStep} / ${this.totalSteps}</span>
                <button class="btn btn-primary" onclick="divinationTutorial.nextStep()">
                    ${nextText}
                </button>
            </div>
        `;
    }

    // 下一步
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.completeTutorial();
        }
    }

    // 上一步
    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    // 高亮指定元素
    highlightElement(selector) {
        this.removeHighlight();
        
        const element = document.querySelector(selector);
        if (element) {
            element.style.position = 'relative';
            element.style.zIndex = '10000';
            element.style.boxShadow = '0 0 0 4px rgba(74, 144, 226, 0.8)';
            element.style.borderRadius = '4px';
            element.classList.add('tutorial-highlight');
        }
    }

    // 移除高亮
    removeHighlight() {
        const highlighted = document.querySelectorAll('.tutorial-highlight');
        highlighted.forEach(el => {
            el.style.position = '';
            el.style.zIndex = '';
            el.style.boxShadow = '';
            el.style.borderRadius = '';
            el.classList.remove('tutorial-highlight');
        });
    }

    // 臨時關閉（下次還會顯示）
    closeTemporarily() {
        this.closeTutorial();
    }

    // 完成引導
    completeTutorial() {
        this.closeTutorial();
    }

    // 跳過引導
    skipTutorial() {
        this.closeTutorial();
    }

    // 下次不再顯示
    neverShowAgain() {
        localStorage.setItem('divination_tutorial_status', 'never_show');
        this.closeTutorial();
    }

// 關閉引導
closeTutorial() {
    this.removeHighlight();
        // 恢復原始的handleHiddenYongshen函數
    if (this.originalHandleHiddenYongshen) {
        window.handleHiddenYongshen = this.originalHandleHiddenYongshen;
        this.originalHandleHiddenYongshen = null;
        console.log('已恢復原始的用神伏藏警告函數');
    }
    // 強制移除所有可能的引導精靈元素
    const overlays = document.querySelectorAll('#tutorial-overlay, [id*="tutorial"]');
    overlays.forEach(overlay => {
        if (overlay && overlay.parentNode) {
            try {
                overlay.parentNode.removeChild(overlay);
                console.log('移除引導精靈元素:', overlay.id);
            } catch (error) {
                console.error('移除元素時發生錯誤:', error);
            }
        }
    });
    
    // 清理引用
    this.overlay = null;
    this.modal = null;
    this.isActive = false;
    
    console.log('引導精靈已完全關閉');
}

    // 重設功能
    resetTutorialSettings() {
        localStorage.removeItem('divination_tutorial_status');
        localStorage.removeItem('divination_tutorial_seen');
        console.log('引導精靈設定已重設');
        alert('引導精靈設定已重設，重新載入頁面後將會顯示引導');
    }

    
}

// 創建全域實例
const divinationTutorial = new DivinationTutorial();

// 頁面載入完成後檢查是否需要顯示引導
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - 檢查引導精靈');
    
    // 多重檢查確保腳本正確載入
    if (typeof divinationTutorial === 'undefined') {
        console.error('divinationTutorial 未定義');
        return;
    }
    
    // 檢查當前頁面是否為求卦頁面
    const isDivinationPage = window.location.pathname.includes('divination.html') || 
                            document.title.includes('免費求卦');
    
    console.log('是否為求卦頁面:', isDivinationPage);
    
    if (isDivinationPage) {
        // 延遲一點時間確保其他腳本都載入完成
        setTimeout(() => {
            console.log('準備顯示引導精靈');
            divinationTutorial.checkIfNeedTutorial();
        }, 1500);
    }
});

// 備用初始化方法
window.addEventListener('load', function() {
    console.log('Window load - 備用初始化');
    
    if (typeof divinationTutorial !== 'undefined') {
        const isDivinationPage = window.location.pathname.includes('divination.html') || 
                               document.title.includes('免費求卦');
        
        if (isDivinationPage) {
            setTimeout(() => {
                const tutorialStatus = localStorage.getItem('divination_tutorial_status');
                console.log('Tutorial status:', tutorialStatus);
                
                if (tutorialStatus !== 'never_show') {
                    console.log('強制顯示引導精靈');
                    divinationTutorial.forceShowTutorial();
                }
            }, 2000);
        }
    }
});

// 全域函數，供外部調用
window.divinationTutorial = divinationTutorial;
// 輔助函數：清理過期的使用記錄
function cleanupExpiredUsage() {
    const today = new Date().toDateString();
    
    const usage = localStorage.getItem('ai_divination_usage');
    if (usage) {
        const usageData = JSON.parse(usage);
        const cleanedData = {};
        
        Object.keys(usageData).forEach(dateStr => {
            const recordDate = new Date(dateStr);
            const daysDiff = Math.floor((new Date() - recordDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 7) {
                cleanedData[dateStr] = usageData[dateStr];
            }
        });
        
        localStorage.setItem('ai_divination_usage', JSON.stringify(cleanedData));
    }
}

setTimeout(cleanupExpiredUsage, 3000);

// 開發者調試工具
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugTutorial = {
        reset: function() {
            localStorage.removeItem('divination_tutorial_status');
            localStorage.removeItem('ai_divination_usage');
            localStorage.removeItem('ai_paid_usage');
            console.log('所有引導相關設定已重設');
            location.reload();
        },
        
        simulateUsed: function() {
            const today = new Date().toDateString();
            const usage = { [today]: 1 };
            localStorage.setItem('ai_divination_usage', JSON.stringify(usage));
            console.log('已模擬今日免費額度用完');
        }
    };
}
