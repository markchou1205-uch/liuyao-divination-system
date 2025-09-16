/**
 * 求卦者界面引導流程精靈
 */
class DivinationTutorial {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.isActive = false;
        this.overlay = null;
        this.modal = null;
    }
resetTutorialSettings() {
    localStorage.removeItem('divination_tutorial_status');
    localStorage.removeItem('divination_tutorial_seen');
    console.log('引導精靈設定已重設');
    alert('引導精靈設定已重設，重新載入頁面後將會顯示引導');
}

// 強制顯示引導（無論設定如何）
forceShowTutorial() {
    this.startTutorial();
}
    // 檢查是否需要顯示引導
checkIfNeedTutorial() {
    const tutorialStatus = localStorage.getItem('divination_tutorial_status');
    // 只有明確設置為 'never_show' 才不顯示
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
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
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
                this.showStartDivinationStep();
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
    `;
    this.removeHighlight();
}

    // 第二步：占卦準備1
    showPreparation1Step() {
        this.modal.innerHTML = `
            <div class="tutorial-content">
                <h2>占卦準備 (1/3)</h2>
                <div class="tutorial-text">
                    <p>1. 請簡單洗手洗臉、穿著整齊。</p>
                    <p>並選擇有桌椅且安靜不受打擾的場所。</p>
                </div>
                <div class="tutorial-image-placeholder">
                    <div class="image-placeholder">
                        <img src="/assets/images/tutorial/desk.jpg" 
                     alt="整齊的桌椅環境" 
                     class="tutorial-image"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span>圖片位置預留</span>
                        <small>建議圖片：整齊的桌椅環境</small>
                    </div>
                </div>
                ${this.createNavigationButtons()}
            </div>
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
                <div class="tutorial-image-placeholder">
                    <div class="image-placeholder">
                        <span>圖片位置預留</span>
                        <small>建議圖片：桌上的紙筆和三枚硬幣</small>
                    </div>
                </div>
                ${this.createNavigationButtons()}
            </div>
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
        `;
        this.removeHighlight();
    }

    // 第五步：選擇起卦方式
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
                            <div class="liuyao-steps">
                                <div class="step-navigation">
                                    <div class="step-dots">
                                        <span class="step-dot active" data-step="1"></span>
                                        <span class="step-dot" data-step="2"></span>
                                        <span class="step-dot" data-step="3"></span>
                                    </div>
                                </div>
                                <div class="step-content" id="liuyao-step-content">
                                    <div class="step-text" data-step="1">
                                        將3枚硬幣置於掌心合起，輕輕搖晃，讓硬幣在掌中滾動後，將硬幣輕擲於桌上。
                                    </div>
                                    <div class="step-text" data-step="2" style="display: none;">
                                        觀察三枚硬幣中，陽/正面（一般為人頭面）出現的次數並記錄下來，例如二個陰面、一個陽面，則記錄「1」。
                                    </div>
                                    <div class="step-text" data-step="3" style="display: none;">
                                        重複前1個步驟，總共6次，會得到6個0-3的數字，請記得順序。並將結果依序輸入網頁的表單中。
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${this.createNavigationButtons()}
            </div>
        `;
        
        this.highlightElement('#divination-method');
        this.setupMethodSelectionListeners();
    }

showStartDivinationStep() {
    this.modal.innerHTML = `
        <div class="tutorial-content">
            <h2>開始起卦</h2>
            <div class="tutorial-text">
                <p>現在請點擊「開始起卦」按鈕開始您的占卦過程。</p>
                <p>系統將根據您選擇的起卦方式引導您完成起卦。</p>
            </div>
            <div class="final-step-buttons">
                <button class="btn btn-primary" onclick="divinationTutorial.completeTutorial()">
                    我知道了，開始起卦
                </button>
                <button class="btn btn-secondary" onclick="divinationTutorial.skipTutorial()">
                    跳過引導
                </button>
                <button class="btn btn-tertiary" onclick="divinationTutorial.neverShowAgain()">
                    下次不用再提醒我
                </button>
            </div>
        </div>
    `;
    
    this.highlightElement('button[onclick="startDivination()"]');
}
    // 新增：臨時關閉（下次還會顯示）
closeTemporarily() {
    // 不設置任何localStorage，保持下次會顯示的狀態
    this.closeTutorial();
}

    // 設置方法選擇監聽器
    setupMethodSelectionListeners() {
        const randomRadio = document.getElementById('tutorial-random');
        const liuyaoRadio = document.getElementById('tutorial-liuyao');
        const randomDesc = document.getElementById('random-description');
        const liuyaoDesc = document.getElementById('liuyao-description');

        if (randomRadio) {
            randomRadio.addEventListener('change', () => {
                if (randomRadio.checked) {
                    randomDesc.style.display = 'block';
                    liuyaoDesc.style.display = 'none';
                }
            });
        }

        if (liuyaoRadio) {
            liuyaoRadio.addEventListener('change', () => {
                if (liuyaoRadio.checked) {
                    liuyaoDesc.style.display = 'block';
                    randomDesc.style.display = 'none';
                    this.setupLiuyaoStepNavigation();
                }
            });
        }
    }

    // 設置六爻步驟導航
    setupLiuyaoStepNavigation() {
        const dots = document.querySelectorAll('.step-dot');
        const stepTexts = document.querySelectorAll('.step-text');
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const step = parseInt(dot.dataset.step);
                
                // 更新圓點狀態
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // 更新步驟內容
                stepTexts.forEach(text => {
                    text.style.display = text.dataset.step === step.toString() ? 'block' : 'none';
                });
            });
        });
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

    // 完成引導
completeTutorial() {
    // 不設置localStorage，保持下次會顯示的狀態
    this.closeTutorial();
}

    // 跳過引導
skipTutorial() {
    // 不設置localStorage，保持下次會顯示的狀態
    this.closeTutorial();
}
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

    // 重新顯示引導（用於設置或幫助選單）
showTutorialAgain() {
    localStorage.removeItem('divination_tutorial_status');
    this.startTutorial();
}

}
// 創建全域實例（移到類定義外部）
const divinationTutorial = new DivinationTutorial();

// 頁面載入完成後檢查是否需要顯示引導（移到類定義外部）
document.addEventListener('DOMContentLoaded', function() {
    // 延遲一點時間確保其他腳本都載入完成
    setTimeout(() => {
        divinationTutorial.checkIfNeedTutorial();
    }, 1000);
});
