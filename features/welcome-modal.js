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
  const hideLocal = localStorage.getItem(this.storageKey) === 'true';
  const hideSession = sessionStorage.getItem(this.storageKey) === '1' || sessionStorage.getItem(this.storageKey) === 'true';
  const result = !(hideLocal || hideSession);
  console.log('[WELCOME] shouldShowModal', { hideLocal, hideSession, show: result });
  return result;
}
createModal() {
  // 如果Modal已存在，直接返回
  if (document.getElementById(this.modalId)) {
    console.log('[WELCOME] createModal: already exists');
    return;
  }

  const modalHTML = `
  <style>
    /* 防止遮罩層攔截點擊（只影響本 modal） */
    #${this.modalId} .bg-mask { pointer-events: none; }
    #${this.modalId} .welcome-option { cursor: pointer; }
  </style>
  <div id="${this.modalId}" class="welcome-modal">
    <div class="welcome-modal-content">
      <div class="welcome-modal-header">
        <h2>歡迎來到命理教觀室 - 文王卦排卦系統</h2>
      </div>

      <div class="welcome-modal-body">
        <!-- 左：我要求卦 -->
        <div id="welcome-ask" class="welcome-option">
          <img class="bg-img" src="/public/img/pray.png" alt="我要求卦" loading="eager"
               onload="this.style.display='block'" onerror="this.style.display='none'" />
          <span class="bg-mask bg-mask--ask" aria-hidden="true"></span>
          <div class="copy">
            <h4>我要求卦</h4>
            <p>有任何困惑都可以來這裡免費求卦，本站提供免費解卦的參考，也可以請老師為您解卦</p>
          </div>
        </div>

        <!-- 右：我是卦師 -->
        <div id="welcome-master" class="welcome-option">
          <img class="bg-img" src="/public/img/pro.png" alt="我是卦師" loading="eager"
               onload="this.style.display='block'" onerror="this.style.display='none'" />
          <span class="bg-mask bg-mask--master" aria-hidden="true"></span>
          <div class="copy">
            <h4>我是卦師</h4>
            <p>提供專業的線上排卦程式，您可以在這裡得到市面上最詳細的解卦資訊，也可以透過本站批卦、列印專業解卦報告並管理您的批卦記錄</p>
          </div>
        </div>
      </div>

      <div class="welcome-modal-footer">
        <div class="no-show-again">
          <input type="checkbox" id="no-show-checkbox">
          <label for="no-show-checkbox">下次不用再顯示這個視窗</label>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  console.log('[WELCOME] createModal: inserted');

  // 綁定事件（改用 JS 綁，便於記錄 target）
  const askEl = document.getElementById('welcome-ask');
  const masterEl = document.getElementById('welcome-master');

  askEl?.addEventListener('click', (e) => {
    console.log('[WELCOME] ask click', { target: e.target, currentTarget: e.currentTarget });
    this.selectOption('divination');
  });

  masterEl?.addEventListener('click', (e) => {
    console.log('[WELCOME] master click', { target: e.target, currentTarget: e.currentTarget });
    this.selectOption('professional');
  });
}


showModal() {
  const modal = document.getElementById(this.modalId);
  console.log('[WELCOME] showModal', { hasModal: !!modal });
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 關閉歡迎 modal
 * @param {boolean} remove 是否從 DOM 直接移除（預設 true）
 */
hideModal(remove = true) {
  const el = document.getElementById(this.modalId);
  const backdrop = document.getElementById(this.modalId + '-backdrop')
                  || document.querySelector('.welcome-modal-backdrop')
                  || document.querySelector('.welcome-overlay');
  console.log('[WELCOME] hideModal', { remove, hasEl: !!el, hasBackdrop: !!backdrop });

  if (!el && !backdrop) return;

  if (remove) {
    el?.remove();
    backdrop?.remove();
  } else {
    if (el) el.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
  }
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.pointerEvents = '';

  document.querySelectorAll('.welcome-modal, .welcome-overlay, .modal-backdrop')
    .forEach(n => { if (n !== el) n.style.display = 'none'; });

  console.log('[WELCOME] hideModal: done');
}

forceCloseModal() {
  console.log('[WELCOME] forceCloseModal: start');
  try {
    document.getElementById(this.modalId)?.remove();
    document.querySelectorAll('.welcome-modal, .welcome-overlay, .modal-backdrop, .welcome-modal-backdrop')
      .forEach(n => n.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
    console.log('[WELCOME] forceCloseModal: removed all');
  } catch (e) {
    console.warn('[WELCOME] forceCloseModal error', e);
  }
}

selectOption(option) {
  console.log('[WELCOME] selectOption called', { option });
  const root = document.getElementById(this.modalId);
  console.log('[WELCOME] selectOption has modal?', !!root);
  if (!root) return;

  if (option === 'divination') {
    console.log('[WELCOME] go to divination');
    window.location.href = 'divination';
    return;
  }

  if (option === 'professional') {
    console.log('[WELCOME] professional branch');
    try { sessionStorage.setItem(this.storageKey, '1'); console.log('[WELCOME] session set'); } catch {}
    const cb = document.getElementById('no-show-checkbox');
    if (cb && cb.checked) {
      try { localStorage.setItem(this.storageKey, 'true'); console.log('[WELCOME] local set'); } catch {}
    }
    this.forceCloseModal();
    return;
  }

  console.warn('[WELCOME] selectOption unknown option', option);
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
  console.log('[WELCOME] DOMContentLoaded');
  window.welcomeModal = new WelcomeModal();
  console.log('[WELCOME] instance created', welcomeModal);
});

// 導出給設定頁面使用的函數
window.WelcomeModalUtils = {
    show: () => welcomeModal && welcomeModal.forceShow(),
    reset: () => welcomeModal && welcomeModal.resetShowSetting()
};
