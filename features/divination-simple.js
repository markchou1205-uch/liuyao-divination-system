// 求卦者頁面簡化適配器
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 求卦者頁面適配器初始化 ===');
    
    // 問題類型到取用神的映射
    const questionToYongshen = {
        'love-female': 'qicai',     // 感情/問女方 > 妻財
        'love-male': 'guanGui',     // 感情/問男方 > 官鬼
        'parents': 'fumu',          // 問父母 > 父母
        'children': 'zisun',        // 問子女 > 子孫
        'career': 'guanGui',        // 問事業 > 官鬼
        'health': 'shi',            // 問健康 > 世
        'wealth': 'qicai',          // 問財富 > 妻財
        'partnership': 'xiongdi',   // 問合作合夥 > 兄弟
        'lawsuit': 'guanGui'        // 問官司 > 官鬼
    };
    
    // 設置問題類型變更監聽器
    const questionSelect = document.getElementById('question-type');
    if (questionSelect) {
        questionSelect.addEventListener('change', function(e) {
            const selectedQuestion = e.target.value;
            console.log('選擇的問題類型:', selectedQuestion);
            
            // 自動設置對應的取用神
            const yongshenSelect = document.getElementById('yongshen-method');
            if (yongshenSelect && selectedQuestion) {
                const yongshenValue = questionToYongshen[selectedQuestion];
                yongshenSelect.value = yongshenValue;
                console.log('自動設置取用神為:', yongshenValue);
                
                // 觸發change事件，讓其他邏輯感知到變化
                const changeEvent = new Event('change', { bubbles: true });
                yongshenSelect.dispatchEvent(changeEvent);
            }
        });
    }
    
    // 確保日期方法固定為"現在時間"
    const dateMethodSelect = document.getElementById('date-method');
    if (dateMethodSelect) {
        dateMethodSelect.value = 'current';
        console.log('日期方法固定為現在時間');
    }
    
    // 修正表格 colspan
    fixTableColspan();
    
    // 監聽表格變化，每當表格顯示時重新修正 colspan
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'main-table-section' && !target.classList.contains('hidden')) {
                    setTimeout(fixTableColspan, 100); // 延遲執行確保DOM更新完成
                }
            }
        });
    });
    
    const mainTableSection = document.getElementById('main-table-section');
    if (mainTableSection) {
        observer.observe(mainTableSection, { attributes: true });
    }
    
    console.log('=== 求卦者頁面適配器初始化完成 ===');
});

// 修正表格 colspan
function fixTableColspan() {
    console.log('修正表格 colspan...');
    
    const table = document.querySelector('.main-table');
    if (!table) {
        console.log('找不到主表格');
        return;
    }
    
    // 修正第一行的 colspan
    const firstRow = table.querySelector('tr.blue-header');
    if (firstRow) {
        const cells = firstRow.querySelectorAll('td, th');
        if (cells.length >= 2) {
            // 第一個單元格（GN）：隱藏F欄後從6變成5
            cells[0].colSpan = 5;
            console.log('GN單元格 colspan 設為 5');
            
            // 第二個單元格（BGN）：隱藏J欄後從4變成3
            cells[1].colSpan = 3;
            console.log('BGN單元格 colspan 設為 3');
        }
    }
    
    // 修正卦名更新邏輯 - 覆寫 updateGuaNames 函數
    if (typeof updateGuaNames === 'function' && !window.originalUpdateGuaNames) {
        console.log('覆寫 updateGuaNames 函數以適配新的表格結構');
        window.originalUpdateGuaNames = updateGuaNames;
        
        window.updateGuaNames = function(guaData) {
            console.log('使用修正版 updateGuaNames:', guaData);
            
            if (!guaData || !guaData.gn) {
                console.log('卦名數據無效');
                return;
            }
            
            const table = document.querySelector('.main-table');
            if (!table) {
                console.log('找不到卦表');
                return;
            }
            
            const headerRow = table.querySelector('tr.blue-header');
            if (headerRow) {
                const cells = headerRow.querySelectorAll('td, th');
                if (cells.length >= 2) {
                    // 更新主卦名
                    if (guaData.gn && guaData.gn !== 'GN') {
                        cells[0].textContent = guaData.gn;
                        console.log('已更新主卦名為:', guaData.gn);
                    }
                    
                    // 更新變卦名
                    if (guaData.bgn && guaData.bgn !== 'BGN') {
                        cells[1].textContent = guaData.bgn;
                        console.log('已更新變卦名為:', guaData.bgn);
                    }
                }
            }
        };
    }
}

// 跳轉到專業頁面
function goToProfessional() {
    window.location.href = 'index.html';
}

// 簡易解卦函數
function showSimpleInterpretation() {
    // 檢查是否已完成起卦
    const mainTableSection = document.getElementById('main-table-section');
    if (!mainTableSection || mainTableSection.classList.contains('hidden')) {
        alert('請先完成起卦');
        return;
    }

    // 獲取當前問題類型
    const questionSelect = document.getElementById('question-type');
    const currentQuestion = questionSelect ? questionSelect.value : '';
    
    if (!currentQuestion) {
        alert('請選擇要問的問題');
        return;
    }

    // 顯示Modal
    const modal = document.getElementById('simple-interpretation-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 生成解卦內容
        generateInterpretation(currentQuestion);
    }
}

// 關閉簡易解卦Modal
function closeSimpleInterpretation() {
    const modal = document.getElementById('simple-interpretation-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 生成解卦內容
function generateInterpretation(questionType) {
    const questionTexts = {
        'love-female': '感情/問女方',
        'love-male': '感情/問男方',
        'parents': '問父母',
        'children': '問子女',
        'career': '問事業',
        'health': '問健康',
        'wealth': '問財富',
        'partnership': '問合作合夥',
        'lawsuit': '問官司'
    };

    const yongshenTexts = {
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

    const questionText = questionTexts[questionType] || '未知問題';
    const yongshenText = yongshenTexts[questionType] || '未知';

    // 嘗試獲取卦名
    let mainGuaName = '未知卦';
    let changeGuaName = '';
    
    try {
        const gnCells = document.querySelectorAll('.main-table tr.blue-header td');
        if (gnCells.length >= 2) {
            mainGuaName = gnCells[0].textContent.trim() || '未知卦';
            changeGuaName = gnCells[1].textContent.trim() || '';
        }
    } catch (e) {
        console.log('無法獲取卦名:', e);
    }

    // 顯示載入中
    const contentDiv = document.getElementById('simple-interpretation-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="loading-interpretation">
                <div class="loading-spinner"></div>
                <div class="loading-text">正在分析卦象...</div>
            </div>
        `;
        
        // 2秒後顯示解卦結果
        setTimeout(() => {
            const interpretationHTML = `
                <div class="question-indicator">問題：${questionText}</div>
                
                <div class="gua-result">
                    <div class="gua-name">${mainGuaName}</div>
                    <div class="gua-description">這是您問「${questionText}」所得到的卦象</div>
                </div>
                
                ${changeGuaName && changeGuaName !== 'BGN' && changeGuaName !== 'GN' ? `
                <div class="gua-result">
                    <div class="gua-name">變卦：${changeGuaName}</div>
                    <div class="gua-description">卦象變化顯示事情的發展趨勢</div>
                </div>
                ` : ''}
                
                <div class="interpretation-section">
                    <h4>取用神：${yongshenText}</h4>
                    <p>在${questionText}的問題中，主要以「${yongshenText}」為參考依據來進行分析。</p>
                    ${getYongshenDescription(yongshenText)}
                </div>
                
                <div class="interpretation-section">
                    <h4>基本分析</h4>
                    <p>根據當前${mainGuaName}的卦象，${getBasicAnalysis(questionType, mainGuaName)}</p>
                </div>
                
                <div class="interpretation-section">
                    <h4>建議</h4>
                    <p>${getAdvice(questionType)}</p>
                    <p style="margin-top: 10px; font-style: italic; color: #888;">
                        ※ 本解卦僅供參考，如需更詳細的分析，建議諮詢專業卦師。
                    </p>
                </div>
            `;
            
            contentDiv.innerHTML = interpretationHTML;
        }, 2000);
    }
}

// 取用神說明
function getYongshenDescription(yongshen) {
    const descriptions = {
        '妻財': '<p>妻財代表金錢、財物、妻子、女友等。在感情或財運問題中，妻財的旺衰直接影響結果。</p>',
        '官鬼': '<p>官鬼代表官職、工作、丈夫、男友、疾病、阻礙等。在事業或男性感情問題中，官鬼是關鍵因素。</p>',
        '父母': '<p>父母代表父母長輩、房屋、文書、學業、庇護等。父母爻的狀態反映相關事務的發展。</p>',
        '子孫': '<p>子孫代表子女、下屬、醫藥、娛樂、技藝等。子孫爻旺相通常預示吉祥平安。</p>',
        '兄弟': '<p>兄弟代表兄弟姊妹、朋友、同事、合作伙伴等。在合作事務中，兄弟爻的狀態很重要。</p>',
        '世爻': '<p>世爻代表求卦者自己的狀態和運勢。世爻強旺，通常表示自身狀況良好，所問之事較為順利。</p>'
    };
    return descriptions[yongshen] || '<p>需要根據具體情況分析用神的作用。</p>';
}

// 基本分析
function getBasicAnalysis(questionType, guaName) {
    const analyses = {
        'love-female': '在感情方面，需要觀察女方的心意和態度變化',
        'love-male': '在感情方面，需要關注男方的想法和行動意向',
        'parents': '關於父母長輩的事情，宜多考慮家庭和諧與孝道',
        'children': '子女相關事務，應注意引導和教育的方式方法',
        'career': '事業工作方面，需要評估當前的發展機會和阻礙',
        'health': '健康狀況需要重視，注意身心的調養和保健',
        'wealth': '財運方面，應該謹慎理財，把握適當的投資時機',
        'partnership': '合作合夥事宜，需要注意彼此的誠意和利益平衡',
        'lawsuit': '官司訴訟情況，宜謹慎應對，最好尋求專業法律建議'
    };
    return analyses[questionType] || '需要根據具體卦象進行深入分析';
}

// 建議
function getAdvice(questionType) {
    const advices = {
        'love-female': '在感情問題上，建議以真誠溝通為主，不要急於求成，給彼此時間和空間。',
        'love-male': '感情發展需要耐心，建議多站在對方角度思考，用心經營這段關係。',
        'parents': '與父母相關的事情，建議多關心長輩的身心健康，保持良好的溝通。',
        'children': '子女教育問題，建議循循善誘，以身作則，給予適當的關愛和引導。',
        'career': '事業發展建議穩紮穩打，提升自身能力，把握合適的機會。',
        'health': '健康方面建議注意作息規律，適當運動，保持身心平衡。如有不適應及時就醫。',
        'wealth': '財務管理建議理性投資，避免投機取巧，腳踏實地創造財富。',
        'partnership': '合作事宜建議事前做好詳細規劃，明確雙方責任和利益分配。',
        'lawsuit': '法律問題建議諮詢專業律師，準備充分的證據材料，依法維護自身權益。'
    };
    return advices[questionType] || '建議保持理性思考，根據實際情況做出明智的決定。';
}