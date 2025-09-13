// 六爻專有名詞解釋常數
const LIUYAO_TERMS = {
    // 基本概念
    '六爻': '古代占卜術，用三枚銅錢起卦，解釋事物變化規律的方法',
    '起卦': '開始占卜的過程，通常用時間、數字或銅錢來產生卦象',
    '本卦': '最初起出的原始卦象，代表事情的初始狀態',
    '變卦': '本卦中有動爻變化後形成的新卦象，代表事情的最終結果',
    '動爻': '在起卦過程中變動的爻位，是分析重點，代表變化的關鍵',
    '靜爻': '在起卦過程中不變動的爻位，相對穩定，影響力較小',
    
    // 六親系統
    '六親': '以日干為基準，將卦中地支分為父母、兄弟、子孫、妻財、官鬼五類',
    '父母': '代表長輩、文書、房屋等。測事業為阻力，測考試為試題',
    '兄弟': '代表朋友、同事、劫財。測財運為破財，測合作為助力',
    '子孫': '代表晚輩、醫藥、娛樂。是忌神的剋星，能化解災難',
    '妻財': '代表錢財、妻子、女友。測財運為財源，測婚姻為配偶',
    '官鬼': '代表官職、疾病、災難。測事業為工作，測健康為病症',
    
    // 用神系統
    '用神': '與所測事情最直接相關的六親，是分析的核心對象',
    '原神': '生用神的六親，對用神有利，代表助力和貴人',
    '忌神': '剋用神的六親，對用神不利，代表阻礙和小人',
    '仇神': '剋原神的六親，間接對用神不利，需要防範',
    
    // 五行生剋
    '五行': '金、木、水、火、土五種基本元素，相互生剋制化',
    '相生': '五行相互滋生：木生火、火生土、土生金、金生水、水生木',
    '相剋': '五行相互制約：木剋土、土剋水、水剋火、火剋金、金剋木',
    '生扶': '五行相生或同類相助，增強力量，多為吉象',
    '剋制': '五行相剋，削弱力量，根據用忌神判斷吉凶',
    
    // 旺衰狀態
    '旺': '五行力量最強的狀態，如春天的木、夏天的火',
    '相': '五行力量次強的狀態，受旺氣相生，力量充足',
    '休': '五行力量平和的狀態，不旺不弱，處於中性',
    '囚': '五行力量較弱的狀態，被月令所剋，力量受制',
    '死': '五行力量最弱的狀態，完全不得月令之氣',
    
    // 空亡系統
    '空亡': '地支在十二天干中找不到對應，代表虛空、無力、不實',
    '真空': '用神空亡且無其他因素解空，事情難成或虛假',
    '假空': '用神空亡但有填實或沖實，最終仍可成功',
    '填實': '空亡的地支在後來的時間出現，空亡狀態解除',
    '沖實': '與空亡地支相沖的地支出現，可以解除空亡',
    
    // 刑沖會合
    '六合': '地支兩兩相合，代表和諧、結合、成功的象徵',
    '三合': '地支三個一組相合，力量最強，代表團結合作',
    '六沖': '地支兩兩相沖，代表對立、衝突、變動的象徵',
    '三刑': '地支三個一組相刑，代表刑罰、傷害、是非',
    '破': '地支相破，代表破壞、損失、不完整的狀態',
    '害': '地支相害，代表嫉妒、暗中傷害、小人作祟',
    
    // 神煞系統
    '貴人': '天乙貴人，代表高貴的人相助，遇事有人幫忙',
    '驛馬': '代表走動、變遷、出行、工作調動等動態',
    '桃花': '代表愛情、人緣、異性緣，也可能代表桃色事件',
    '劫煞': '代表劫難、破財、小人，需要小心防範',
    
    // 化象變化
    '化進': '卦象越變越好，事情發展呈上升趨勢，多為吉象',
    '化退': '與化進相反，代表所問的事情愈做愈退步，但又不得不做。例如成績愈來差，生意愈來愈差。但如果是忌神，也代表對用神的傷害會愈來愈小，反而為吉',
    '化回頭剋': '變爻反過來剋制本爻，先吉後凶，事情有反覆',
    '化回頭生': '變爻反過來生助本爻，吉上加吉，越來越好',
    
    // 應期系統
    '應期': '事情發生或實現的具體時間，需結合爻位旺衰判斷',
    '沖動': '地支相沖時，靜爻被沖動，可能應驗於沖日',
    '合動': '地支相合時，動爻被合住，應期可能延後',
    '值日': '用神當值的日子，是比較可能應驗的時間',
    
    // 爻位含義
    '初爻': '第一爻，代表開始、基礎、腳部、地面等概念',
    '二爻': '第二爻，代表中下層、腰腹、室內、近期等',
    '三爻': '第三爻，代表中層、胸部、門戶、轉折等',
    '四爻': '第四爻，代表中上層、肩膀、近領導、外部',
    '五爻': '第五爻，代表領導層、頭部、君王、遠期等',
    '上爻': '第六爻，代表最高層、極端、結束、超越等'
};

// 學習模式管理類
class LearningMode {
    constructor() {
        this.isActive = false;
        this.modal = null;
        this.tooltip = null;
        this.minimized = false;
        this.init();
    }
    
    // 初始化學習模式
    init() {
        this.createModal();
        this.createTooltip();
        this.bindEvents();
    }
    
// 創建學習模式Modal
createModal() {
    // 創建modal容器
    this.modal = document.createElement('div');
    this.modal.className = 'learning-modal';
    this.modal.innerHTML = `
        <div class="learning-modal-content">
            <div class="learning-modal-header">
                <h4>學習模式</h4>
                <span class="learning-close">&times;</span>
            </div>
            <div class="learning-modal-body">
                <p>啟用學習模式後，將滑鼠移動到專有名詞上即可查看詳細解釋</p>
                <div class="learning-buttons">
                    <button class="btn learning-btn-enable">開啟</button>
                    <button class="btn learning-btn-disable">關閉</button>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                    <label style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; color: #666;">
                        <input type="checkbox" id="learning-no-remind" style="margin: 0;">
                        <span>不要再提醒我</span>
                    </label>
                </div>
            </div>
        </div>
    `;
    
    // 添加到頁面
    document.body.appendChild(this.modal);
    
    // 創建最小化按鈕
    this.createMinimizedButton();
}
    
// 創建最小化按鈕
createMinimizedButton() {
    this.minimizedBtn = document.createElement('div');
    this.minimizedBtn.className = 'learning-minimized-btn hidden';
    this.minimizedBtn.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; line-height: 1;">
            <div style="font-size: 10px; margin-bottom: 2px;">學習模式</div>
            <div style="font-size: 18px; font-weight: bold;">一</div>
        </div>
    `;
    this.minimizedBtn.onclick = () => this.restore();
    document.body.appendChild(this.minimizedBtn);
}
    
    // 創建提示框
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'learning-tooltip hidden';
        document.body.appendChild(this.tooltip);
    }
    
// 綁定事件
// 綁定事件
bindEvents() {
    // 關閉按鈕 - 修改為完全關閉而不是最小化
    this.modal.querySelector('.learning-close').onclick = () => {
        // 檢查是否勾選"不要再提醒我"
        const noRemindCheckbox = document.getElementById('learning-no-remind');
        if (noRemindCheckbox && noRemindCheckbox.checked) {
            this.saveNoRemindPreference();
        }
        // 改為完全關閉，而不是最小化
        this.hide();
    };
    
    // 開啟按鈕
    this.modal.querySelector('.learning-btn-enable').onclick = () => this.enable();
    
    // 關閉按鈕 - 修改為同時關閉學習模式並完全隱藏
    this.modal.querySelector('.learning-btn-disable').onclick = () => {
        this.disable(); // 關閉學習模式
        
        // 檢查是否勾選"不要再提醒我"
        const noRemindCheckbox = document.getElementById('learning-no-remind');
        if (noRemindCheckbox && noRemindCheckbox.checked) {
            this.saveNoRemindPreference();
        }
        
        // 改為完全關閉，而不是最小化
        this.hide();
    };
    
    // 點擊modal外部關閉
    this.modal.onclick = (e) => {
        if (e.target === this.modal) {
            // 檢查是否勾選"不要再提醒我"
            const noRemindCheckbox = document.getElementById('learning-no-remind');
            if (noRemindCheckbox && noRemindCheckbox.checked) {
                this.saveNoRemindPreference();
            }
            // 改為完全關閉，而不是最小化
            this.hide();
        }
    };
}

// 保存"不要再提醒我"設置
saveNoRemindPreference() {
    // 設置Cookie，有效期30天
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `learningModeNoRemind=true; expires=${expiryDate.toUTCString()}; path=/`;
    console.log('已保存學習模式提醒設置');
}

// 檢查是否應該跳過提醒
shouldSkipReminder() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'learningModeNoRemind' && value === 'true') {
            return true;
        }
    }
    return false;
}
    
    // 顯示學習模式modal
    show() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('show');
        this.minimized = false;
        this.minimizedBtn.classList.add('hidden');
    }
    
    // 隱藏modal
    hide() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('show');
    }
    
    // 最小化
    minimize() {
        this.hide();
        this.minimized = true;
        this.minimizedBtn.classList.remove('hidden');
    }
    
    // 恢復顯示
    restore() {
        this.show();
    }
    
    // 啟用學習模式
    enable() {
        this.isActive = true;
        this.minimize();
        this.highlightTerms();
        this.bindTermEvents();
        
        // 更新按鈕狀態
        this.modal.querySelector('.learning-btn-enable').classList.add('active');
        this.modal.querySelector('.learning-btn-disable').classList.remove('active');
    }
    
    // 關閉學習模式
    disable() {
        this.isActive = false;
        this.removeHighlights();
        this.unbindTermEvents();
        this.hideTooltip();
        
        // 更新按鈕狀態
        this.modal.querySelector('.learning-btn-enable').classList.remove('active');
        this.modal.querySelector('.learning-btn-disable').classList.add('active');
    }
    
    // 高亮專有名詞
    highlightTerms() {
        const textNodes = this.getTextNodes(document.body);
        
        textNodes.forEach(node => {
            let text = node.textContent;
            let hasTerms = false;
            
            // 檢查是否包含專有名詞
            Object.keys(LIUYAO_TERMS).forEach(term => {
                if (text.includes(term)) {
                    hasTerms = true;
                }
            });
            
            if (hasTerms) {
                // 創建新的HTML內容
                let newHTML = text;
                Object.keys(LIUYAO_TERMS).forEach(term => {
                    const regex = new RegExp(term, 'g');
                    newHTML = newHTML.replace(regex, `<span class="learning-term" data-term="${term}">${term}</span>`);
                });
                
                // 替換節點
                if (newHTML !== text) {
                    const wrapper = document.createElement('span');
                    wrapper.innerHTML = newHTML;
                    node.parentNode.replaceChild(wrapper, node);
                }
            }
        });
    }
    
    // 獲取所有文字節點
    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // 跳過script、style等標籤內的文字
                    const parent = node.parentElement;
                    if (parent && ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳過已經是學習模式相關的元素
                    if (parent && parent.closest('.learning-modal, .learning-tooltip')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }
    
    // 移除高亮
    removeHighlights() {
        const highlightedTerms = document.querySelectorAll('.learning-term');
        highlightedTerms.forEach(term => {
            const parent = term.parentNode;
            parent.replaceChild(document.createTextNode(term.textContent), term);
            parent.normalize(); // 合併相鄰的文字節點
        });
    }
    
    // 綁定專有名詞事件
    bindTermEvents() {
        document.addEventListener('mouseover', this.handleTermHover.bind(this));
        document.addEventListener('mouseout', this.handleTermLeave.bind(this));
    }
    
    // 解綁專有名詞事件
    unbindTermEvents() {
        document.removeEventListener('mouseover', this.handleTermHover.bind(this));
        document.removeEventListener('mouseout', this.handleTermLeave.bind(this));
    }
    
    // 處理滑鼠懸停
    handleTermHover(e) {
        if (!this.isActive) return;
        
        const term = e.target.closest('.learning-term');
        if (term) {
            const termName = term.dataset.term;
            const explanation = LIUYAO_TERMS[termName];
            
            if (explanation) {
                this.showTooltip(e, explanation);
            }
        }
    }
    
    // 處理滑鼠離開
    handleTermLeave(e) {
        if (!this.isActive) return;
        
        const term = e.target.closest('.learning-term');
        if (term) {
            this.hideTooltip();
        }
    }
    
    // 顯示提示框
    showTooltip(e, text) {
        this.tooltip.textContent = text;
        this.tooltip.classList.remove('hidden');
        
        // 計算位置
        const rect = e.target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // 邊界檢查
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }
    
    // 隱藏提示框
    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }
}

// 全局學習模式實例
let learningMode;

// 當開始起卦時顯示學習模式modal
function showLearningModeModal() {
    if (!learningMode) {
        learningMode = new LearningMode();
    }
    
    // 檢查是否應該跳過提醒
    if (learningMode.shouldSkipReminder()) {
        console.log('用戶已設置不再提醒，跳過學習模式Modal');
        // 修改：不要顯示最小化按鈕，完全跳過
        return;
    }
    
    learningMode.show();
}

// 導出給其他腳本使用
window.showLearningModeModal = showLearningModeModal;
window.LIUYAO_TERMS = LIUYAO_TERMS;