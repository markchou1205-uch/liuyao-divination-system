class WelcomeModal {
    constructor() {
        this.modalId = 'welcome-modal';
        this.storageKey = 'hideWelcomeModal';
        this.init();
    }

    init() {
        // 檢查是否應該顯示Modal
        if (this.shouldShowModal()) {
            this.createModal();
            this.showModal();
        }
    }

    shouldShowModal() {
        // 檢查localStorage中的設定
        return localStorage.getItem(this.storageKey) !== 'true';
    }

    createModal() {
        // 如果Modal已存在，直接返回
        if (document.getElementById(this.modalId)) {
            return;
        }

const modalHTML = `
  <div id="\${this.modalId}" class="welcome-modal">
    <div class="welcome-modal-content">
      <div class="welcome-modal-header">
        <h2>歡迎來到命理教觀室 - 文王卦排卦系統</h2>
      </div>

      <div class="welcome-modal-body">
        <!-- 左：我要求卦 -->
        <div id="welcome-ask" class="welcome-option" onclick="welcomeModal.selectOption('divination')">
          <!-- 底圖用 <img> -->
          <img
            class="bg-img"
            src="/public/img/pray.png"
            alt="我要求卦"
            loading="eager"
            onload="this.style.display='block'"
            onerror="this.style.display='none'"
          />
          <!-- 遮罩（紫調） -->
          <span class="bg-mask bg-mask--ask" aria-hidden="true"></span>

          <!-- 文字 -->
          <div class="copy">
            <h4>我要求卦</h4>
            <p>有任何困惑都可以來這裡免費求卦，本站提供免費解卦的參考，也可以請老師為您解卦</p>
          </div>
        </div>

        <!-- 右：我是卦師 -->
        <div id="welcome-master" class="welcome-option" onclick="welcomeModal.selectOption('professional')">
          <!-- 底圖用 <img> -->
          <img
            class="bg-img"
            src="/public/img/pro.png"
            alt="我是卦師"
            loading="eager"
            onload="this.style.display='block'"
            onerror="this.style.display='none'"
          />
          <!-- 遮罩（暖金調） -->
          <span class="bg-mask bg-mask--master" aria-hidden="true"></span>

          <!-- 文字 -->
          <div class="copy">
            <h4>我是卦師</h4>
            <p>提供專業的線上排卦程式，您可以在這裡得到市面上最詳細的解卦資訊，也可以透過本站批卦、列印專業解卦報告並管理您的批卦記錄</p>
          </div>
        </div>
      </div>

      <div class="welcome-modal-footer">
        <div class="no-show-again" onclick="welcomeModal.toggleNoShowAgain()">
          <input type="checkbox" id="no-show-checkbox">
          <label for="no-show-checkbox">下次不用再顯示這個視窗</label>
        </div>
      </div>
    </div>
  </div>
`;


        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    showModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // 防止背景滾動
            document.body.style.overflow = 'hidden';
        }
    }

/**
 * 關閉歡迎 modal
 * @param {boolean} remove 是否從 DOM 直接移除（預設 true）
 */
hideModal(remove = true) {
  const el = document.getElementById(this.modalId);
  if (!el) return;

  // 若有 backdrop（有些版本會用 overlay）
  const backdrop = document.getElementById(this.modalId + '-backdrop')
                   || document.querySelector('.welcome-modal-backdrop');

  // 從 DOM 移除或隱藏
  if (remove) {
    el.remove();
    if (backdrop) backdrop.remove();
  } else {
    el.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
  }

  // 還原 body 狀態（避免仍然 overflow:hidden 或 pointer-events:none）
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.pointerEvents = '';

  // 安全：把遮罩層都關掉（即使 class 名稱不同）
  document.querySelectorAll('.welcome-modal, .welcome-overlay, .modal-backdrop')
    .forEach(n => { if (n !== el) n.style.display = 'none'; });

  // 移除可能註冊在 window 的 keydown（若你有 ESC 關閉）
  // 建議你在 createModal 裡用命名的 handler，這裡才能 removeEventListener
  // 這裡先保守不移除，以免你其他地方也用到
}


selectOption(option) {
  // 防多點
  const root = document.getElementById(this.modalId);
  if (!root) return;

  if (option === 'divination') {
    // 求卦者 → 走你原本的流程（如果是 /divination 或 /divination.html 請保持一致）
    window.location.href = 'divination';
    return;
  }

  if (option === 'professional') {
    // 卦師 → 關閉 modal 並標記這次不再顯示
    try {
      // 本次瀏覽就不再顯示（你也可改成 localStorage）
      sessionStorage.setItem(this.storageKey, '1');
    } catch {}

    this.hideModal(true); // 徹底移除
    return;
  }
}


    toggleNoShowAgain() {
        const checkbox = document.getElementById('no-show-checkbox');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
        }
    }

    // 手動顯示Modal的方法（可用於設定或其他地方調用）
    forceShow() {
        if (!document.getElementById(this.modalId)) {
            this.createModal();
        }
        this.showModal();
    }

    // 重設顯示設定
    resetShowSetting() {
        localStorage.removeItem(this.storageKey);
    }
}

// 全域變數，方便在HTML中調用
let welcomeModal;

// 當DOM載入完成時初始化
document.addEventListener('DOMContentLoaded', function() {
    welcomeModal = new WelcomeModal();
});

// 導出給設定頁面使用的函數
window.WelcomeModalUtils = {
    show: () => welcomeModal && welcomeModal.forceShow(),
    reset: () => welcomeModal && welcomeModal.resetShowSetting()
};
