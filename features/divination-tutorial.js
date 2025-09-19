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
        const tutorialStatus = localStorage.getItem('divination_tutorial_status');
        if (tutorialStatus !== 'never_show') {
            this.startTutorial();
        }
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

    // 第五步：選擇起卦方式（實際功能）
    showMethodSelectionStep() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>選擇起卦方式</h2>
                <div class="method-selection">
                    <div class="method-option">
                        <label class="method-radio">
                            <input type="radio" name="tutorial-method" value="random" id="tutorial-random">
                            <span class="radio-label">隨機起卦（簡易）</span>
                        </label>
                        <div class="method-description" id="random-description" style="display: none;">
                            由系統隨機起卦，您不需要做其它動作，只需在心中專心默唸您的問題。
                        </div>
                    </div>
                    
                    <div class="method-option">
                        <label class="method-radio">
                            <input type="radio" name="tutorial-method" value="liuyao" id="tutorial-liuyao">
                            <span class="radio-label">六爻起卦（進階）</span>
                        </label>
                        <div class="method-description" id="liuyao-description" style="display: none;">
                            <div class="liuyao-instruction">
                                <p><strong>六爻起卦步驟：</strong></p>
                                <ol>
                                    <li>將3枚硬幣置於掌心合起，輕輕搖晃，讓硬幣在掌中滾動後，將硬幣輕擲於桌上</li>
                                    <li>觀察三枚硬幣中，陽面（正面/人頭面）出現的次數並記錄下來</li>
                                    <li>重複前述步驟，總共6次，會得到6個0-3的數字</li>
                                </ol>
                                <div id="liuyao-inputs" style="display: none;">
                                    <p><strong>請輸入6次擲幣結果：</strong></p>
                                    <div class="dice-inputs">
                                        <div class="dice-row">
                                            <span>第1次：</span>
                                            <select id="dice-1">
                                                <option value="0">0個正面</option>
                                                <option value="1">1個正面</option>
                                                <option value="2">2個正面</option>
                                                <option value="3">3個正面</option>
                                            </select>
                                        </div>
                                        <div class="dice-row">
                                            <span>第2次：</span>
                                            <select id="dice-2">
                                                <option value="0">0個正面</option>
                                                <option value="1">1個正面</option>
                                                <option value="2">2個正面</option>
                                                <option value="3">3個正面</option>
                                            </select>
                                        </div>
                                        <div class="dice-row">
                                            <span>第3次：</span>
                                            <select id="dice-3">
                                                <option value="0">0個正面</option>
                                                <option value="1">1個正面</option>
                                                <option value="2">2個正面</option>
                                                <option value="3">3個正面</option>
                                            </select>
                                        </div>
                                        <div class="dice-row">
                                            <span>第4次：</span>
                                            <select id="dice-4">
                                                <option value="0">0個正面</option>
                                                <option value="1">1个正面</option>
                                                <option value="2">2個正面</option>
                                                <option value="3">3個正面</option>
                                            </select>
                                        </div>
                                        <div class="dice-row">
                                            <span>第5次：</span>
                                            <select id="dice-5">
                                                <option value="0">0個正面</option>
                                                <option value="1">1個正面</option>
                                                <option value="2">2個正面</option>
                                                <option value="3">3個正面</option>
                                            </select>
                                        </div>
                                        <div class="dice-row">
                                            <span>第6次：</span>
                                            <select id="dice-6">
                                                <option value="0">0個正面</option>
                                                <option value="1">1個正面</option>
                                                <option value="2">2個正面</option>
                                                <option value="3">3個正面</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${this.createNavigationButtons()}
            </div>
            <style>
                .method-option {
                    margin: 20px 0;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                }
                .method-radio {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                }
                .method-radio input {
                    margin-right: 10px;
                }
                .method-description {
                    margin-top: 15px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .dice-inputs {
                    margin-top: 15px;
                }
                .dice-row {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                }
                .dice-row span {
                    width: 80px;
                    font-weight: bold;
                }
                .dice-row select {
                    margin-left: 10px;
                    padding: 5px;
                }
                .liuyao-instruction ol {
                    margin-left: 20px;
                }
                .liuyao-instruction li {
                    margin: 8px 0;
                }
            </style>
        `;
        
        this.setupMethodSelectionListeners();
    }

    // 第六步：選擇問題類型（新增）
    showQuestionSelectionStep() {
        if (!this.userData.method) {
            alert('請先選擇起卦方式');
            this.previousStep();
            return;
        }

        // 如果選擇六爻起卦但沒有輸入數據，收集數據
        if (this.userData.method === 'liuyao' && this.userData.liuyaoData.length === 0) {
            this.collectLiuyaoData();
            if (this.userData.liuyaoData.length === 0) {
                alert('請完成六爻擲幣輸入');
                this.previousStep();
                return;
            }
        }

        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>選擇問題類型</h2>
                <div class="question-selection">
                    <div class="question-options">
                        <h4>常用問題：</h4>
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
                        <h4>或輸入您的完整問題：</h4>
                        <textarea id="custom-question" 
                                 placeholder="請詳細描述您想問的問題..."
                                 rows="4" 
                                 maxlength="500"></textarea>
                        <div class="char-counter">
                            <span id="char-count">0</span>/500 字
                        </div>
                        <p class="note">如果選單中沒有看到您要問的問題，請在此輸入完整問題，我們將依照六爻卦理為您判斷及解卦。</p>
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

    // 第七步：解卦方式選擇（新增）
    showDivinationOptionsStep() {
        // 收集問題數據
        this.collectQuestionData();
        
        if (!this.userData.questionType && !this.userData.customQuestion) {
            alert('請選擇問題類型或輸入自定義問題');
            this.previousStep();
            return;
        }

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
            const select = document.getElementById(`dice-${i}`);
            if (select) {
                data.push(parseInt(select.value));
            }
        }
        this.userData.liuyaoData = data;
    }

    // 收集問題數據
    collectQuestionData() {
        const radioButtons = document.querySelectorAll('input[name="question-type"]');
        const customQuestion = document.getElementById('custom-question').value.trim();
        
        let selectedType = '';
        radioButtons.forEach(radio => {
            if (radio.checked) {
                selectedType = radio.value;
            }
        });
        
        this.userData.questionType = selectedType;
        this.userData.customQuestion = customQuestion;
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
    selectAIDivination() {
        console.log('用戶選擇AI解卦');
        
        // 檢查AI解卦限制
        if (typeof aiDivination !== 'undefined' && !aiDivination.canUseAIDivination()) {
            if (typeof aiDivination.showUsageLimitModal === 'function') {
                aiDivination.showUsageLimitModal();
            } else {
                alert('今日AI解卦次數已用完，請明天再試或選擇卦師解卦');
            }
            return;
        }
        
        // 顯示AI解卦結果
        this.showAIDivinationResult();
    }

    // 選擇卦師解卦
    selectMasterDivination() {
        console.log('用戶選擇卦師解卦');
        
        // 調用現有的卦師解卦功能
        if (typeof showMasterDivinationModal === 'function') {
            // 關閉引導精靈
            this.closeTutorial();
            
            // 先設置好起卦環境
            this.setupDivinationEnvironment();
            
            // 顯示卦師解卦modal
            showMasterDivinationModal(this.userData.questionType);
        } else {
            alert('卦師解卦功能暫時無法使用，請稍後再試');
        }
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
        if (this.overlay) {
            document.body.removeChild(this.overlay);
        }
        this.isActive = false;
    }

    // 重設功能
    resetTutorialSettings() {
        localStorage.removeItem('divination_tutorial_status');
        localStorage.removeItem('divination_tutorial_seen');
        console.log('引導精靈設定已重設');
        alert('引導精靈設定已重設，重新載入頁面後將會顯示引導');
    }

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
