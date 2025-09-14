/**
 * 進階計算功能庫
 * 包含五行旺衰、神煞推算、64卦常數等功能
 */

/**
 * 進階計算器類
 */
class AdvancedCalculator {

// ========== 全域常數區域 ==========

/**
 * 基礎八卦二進制對照表（全域統一）
 */
static BAGUA_BINARY_MAP = {
    '111': '乾', '000': '坤', '100': '震', '011': '巽',
    '010': '坎', '101': '離', '001': '艮', '110': '兌'
};

/**
 * 五行基礎常數
 */
static WUXING_BASE = {
    // 地支對應五行
    DIZHI: {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    },
    // 五行生克關係
    RELATION: {
        '金': { generates: '水', destroys: '木' },
        '水': { generates: '木', destroys: '火' },
        '木': { generates: '火', destroys: '土' },
        '火': { generates: '土', destroys: '金' },
        '土': { generates: '金', destroys: '水' }
    }
};

/**
 * 八純卦基礎常數 (4×8)
 * 包含：二進制代碼、卦名、各爻地支、卦宮五行
 */
static BAGUA_PURE_CONSTANTS = {
    '乾': {
        binary: '111111',
        name: '乾為天',
        dizhi: ['子', '寅', '辰', '午', '申', '戌'],  // 從初爻到上爻
        wuxing: '金'
    },
    '坤': {
        binary: '000000', 
        name: '坤為地',
        dizhi: ['未', '巳', '卯', '丑', '亥', '酉'],
        wuxing: '土'
    },
    '震': {
        binary: '100100',
        name: '震為雷', 
        dizhi: ['子', '寅', '辰', '午', '申', '戌'],
        wuxing: '木'
    },
    '巽': {
        binary: '011011',
        name: '巽為風',
        dizhi: ['丑', '亥', '酉', '未', '巳', '卯'],
        wuxing: '木'
    },
    '坎': {
        binary: '010010',
        name: '坎為水',
        dizhi: ['寅', '辰', '午', '申', '戌', '子'],
        wuxing: '水'
    },
    '離': {
        binary: '101101', 
        name: '離為火',
        dizhi: ['卯', '丑', '亥', '酉', '未', '巳'],
        wuxing: '火'
    },
    '艮': {
        binary: '001001',
        name: '艮為山',
        dizhi: ['辰', '午', '申', '戌', '子', '寅'],
        wuxing: '土'
    },
    '兌': {
        binary: '110110',
        name: '兌為澤', 
        dizhi: ['巳', '卯', '丑', '亥', '酉', '未'],  // 檢查並確認兌卦地支配置
        wuxing: '金'
    }
};

/**
 * 64卦完整常數（整合版）
 * 包含：卦名、卦宮、五行、類型、世位、應位、地支五行
 * 根據京房八宮卦序排列
 */
static GUA_64_COMPLETE = {
    // 乾宮八卦（五行屬金）
    '111111': { name: '乾為天', palace: '乾', wuxing: '金', type: '八純卦', shi: 6, ying: 3, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '011111': { name: '天風姤', palace: '乾', wuxing: '金', type: '一世卦', shi: 1, ying: 4, dizhi: ['丑土', '亥水', '酉金', '午火', '申金', '戌土'] },
    '001111': { name: '天山遯', palace: '乾', wuxing: '金', type: '二世卦', shi: 2, ying: 5, dizhi: ['辰土', '午火', '申金', '午火', '申金', '戌土'] },
    '000111': { name: '天地否', palace: '乾', wuxing: '金', type: '三世卦', shi: 3, ying: 6, dizhi: ['未土', '巳火', '卯木', '午火', '申金', '戌土'] },
    '000011': { name: '風地觀', palace: '乾', wuxing: '金', type: '四世卦', shi: 4, ying: 1, dizhi: ['未土', '巳火', '卯木', '亥水', '酉金', '未土'] },
    '000001': { name: '山地剝', palace: '乾', wuxing: '金', type: '五世卦', shi: 5, ying: 2, dizhi: ['未土', '巳火', '卯木', '戌土', '子水', '寅木'] },
    '000101': { name: '火地晉', palace: '乾', wuxing: '金', type: '游魂卦', shi: 4, ying: 1, dizhi: ['未土', '巳火', '卯木', '酉金', '未土', '巳火'] },
    '111101': { name: '火天大有', palace: '乾', wuxing: '金', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['卯木', '丑土', '亥水', '午火', '申金', '戌土'] },

    // 兌宮八卦（五行屬金）
    '110110': { name: '兌為澤', palace: '兌', wuxing: '金', type: '八純卦', shi: 6, ying: 3, dizhi: ['巳火', '卯木', '丑土', '亥水', '酉金', '未土'] },
    '010110': { name: '澤水困', palace: '兌', wuxing: '金', type: '一世卦', shi: 1, ying: 4, dizhi: ['寅木', '辰土', '午火', '亥水', '酉金', '未土'] },
    '000110': { name: '澤地萃', palace: '兌', wuxing: '金', type: '二世卦', shi: 2, ying: 5, dizhi: ['未土', '巳火', '卯木', '亥水', '酉金', '未土'] },
    '001110': { name: '澤山咸', palace: '兌', wuxing: '金', type: '三世卦', shi: 3, ying: 6, dizhi: ['辰土', '午火', '申金', '亥水', '酉金', '未土'] },
    '001010': { name: '水山蹇', palace: '兌', wuxing: '金', type: '四世卦', shi: 4, ying: 1, dizhi: ['辰土', '午火', '申金', '申金', '戌土', '子水'] },
    '001000': { name: '地山謙', palace: '兌', wuxing: '金', type: '五世卦', shi: 5, ying: 2, dizhi: ['未土', '巳火', '卯木', '戌土', '子水', '寅木'] },
    '001100': { name: '雷山小過', palace: '兌', wuxing: '金', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '戌土', '子水', '寅木'] },
    '110100': { name: '雷澤歸妹', palace: '兌', wuxing: '金', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['卯木', '丑土', '亥水', '亥水', '酉金', '未土'] },

    // 離宮八卦（五行屬火）
    '101101': { name: '離為火', palace: '離', wuxing: '火', type: '八純卦', shi: 6, ying: 3, dizhi: ['卯木', '丑土', '亥水', '酉金', '未土', '巳火'] },
    '001101': { name: '火山旅', palace: '離', wuxing: '火', type: '一世卦', shi: 1, ying: 4, dizhi: ['辰土', '午火', '申金', '酉金', '未土', '巳火'] },
    '011101': { name: '火風鼎', palace: '離', wuxing: '火', type: '二世卦', shi: 2, ying: 5, dizhi: ['丑土', '亥水', '酉金', '酉金', '未土', '巳火'] },
    '010101': { name: '火水未濟', palace: '離', wuxing: '火', type: '三世卦', shi: 3, ying: 6, dizhi: ['寅木', '辰土', '午火', '酉金', '未土', '巳火'] },
    '010001': { name: '山水蒙', palace: '離', wuxing: '火', type: '四世卦', shi: 4, ying: 1, dizhi: ['寅木', '辰土', '午火', '戌土', '子水', '寅木'] },
    '010011': { name: '風水渙', palace: '離', wuxing: '火', type: '五世卦', shi: 5, ying: 2, dizhi: ['寅木', '辰土', '午火', '未土', '巳火', '卯木'] },
    '010111': { name: '天水訟', palace: '離', wuxing: '火', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '申金', '戌土', '子水'] },
    '101111': { name: '天火同人', palace: '離', wuxing: '火', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '酉金', '未土', '巳火'] },

    // 震宮八卦（五行屬木）- 按您提供的卦序
    '100100': { name: '震為雷', palace: '震', wuxing: '木', type: '八純卦', shi: 6, ying: 3, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '000100': { name: '雷地豫', palace: '震', wuxing: '木', type: '一世卦', shi: 1, ying: 4, dizhi: ['未土', '巳火', '卯木', '午火', '申金', '戌土'] },
    '010100': { name: '雷水解', palace: '震', wuxing: '木', type: '二世卦', shi: 2, ying: 5, dizhi: ['寅木', '辰土', '午火', '午火', '申金', '戌土'] },
    '011100': { name: '雷風恒', palace: '震', wuxing: '木', type: '三世卦', shi: 3, ying: 6, dizhi: ['丑土', '亥水', '酉金', '午火', '申金', '戌土'] },
    '011000': { name: '地風升', palace: '震', wuxing: '木', type: '四世卦', shi: 4, ying: 1, dizhi: ['丑土', '亥水', '酉金', '丑土', '亥水', '酉金'] },
    '011010': { name: '水風井', palace: '震', wuxing: '木', type: '五世卦', shi: 5, ying: 2, dizhi: ['丑土', '亥水', '酉金', '申金', '戌土', '子水'] },
    '011110': { name: '澤風大過', palace: '震', wuxing: '木', type: '游魂卦', shi: 4, ying: 1, dizhi: ['巳火', '卯木', '丑土', '未土', '巳火', '卯木'] },
    '100110': { name: '澤雷隨', palace: '震', wuxing: '木', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '亥水', '酉金', '未土'] },

    // 巽宮八卦（五行屬木）
    '011011': { name: '巽為風', palace: '巽', wuxing: '木', type: '八純卦', shi: 6, ying: 3, dizhi: ['丑土', '亥水', '酉金', '未土', '巳火', '卯木'] },
    '111011': { name: '風天小畜', palace: '巽', wuxing: '木', type: '一世卦', shi: 1, ying: 4, dizhi: ['子水', '寅木', '辰土', '未土', '巳火', '卯木'] },
    '101011': { name: '風火家人', palace: '巽', wuxing: '木', type: '二世卦', shi: 2, ying: 5, dizhi: ['卯木', '丑土', '亥水', '未土', '巳火', '卯木'] },
    '100011': { name: '風雷益', palace: '巽', wuxing: '木', type: '三世卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '未土', '巳火', '卯木'] },
    '100111': { name: '天雷無妄', palace: '巽', wuxing: '木', type: '四世卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '100101': { name: '火雷噬嗑', palace: '巽', wuxing: '木', type: '五世卦', shi: 5, ying: 2, dizhi: ['子水', '寅木', '辰土', '酉金', '未土', '巳火'] },
    '100001': { name: '山雷頤', palace: '巽', wuxing: '木', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '戌土', '子水', '寅木'] },
    '011001': { name: '山風蠱', palace: '巽', wuxing: '木', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['丑土', '亥水', '酉金', '戌土', '子水', '寅木'] },

    // 坎宮八卦（五行屬水）  <-- 補齊
    '010010': { name: '坎為水', palace: '坎', wuxing: '水', type: '八純卦', shi: 6, ying: 3, dizhi: ['寅木', '辰土', '午火', '申金', '戌土', '子水'] },
    '110010': { name: '水澤節', palace: '坎', wuxing: '水', type: '一世卦', shi: 1, ying: 4, dizhi: ['巳火', '卯木', '丑土', '申金', '戌土', '子水'] },
    '100010': { name: '水雷屯', palace: '坎', wuxing: '水', type: '二世卦', shi: 2, ying: 5, dizhi: ['子水', '寅木', '辰土',  '申金', '戌土', '子水'] },
    '101010': { name: '水火既齊', palace: '坎', wuxing: '水', type: '三世卦', shi: 3, ying: 6, dizhi: ['卯木', '丑土', '亥水', '申金', '戌土', '子水'] },
    '101110': { name: '澤火革', palace: '坎', wuxing: '水', type: '四世卦', shi: 4, ying: 1, dizhi: ['卯木', '丑土', '亥水','亥水',  '酉金', '未土'] },
    '101100': { name: '雷火豐', palace: '坎', wuxing: '水', type: '五世卦', shi: 5, ying: 2, dizhi: ['卯木', '丑土', '亥水', '午火', '申金', '戌土'] },
    '101000': { name: '地火明夷', palace: '坎', wuxing: '水', type: '游魂卦', shi: 4, ying: 1, dizhi: ['卯木', '丑土', '亥水', '丑土', '亥水', '酉金'] },
    '010000': { name: '地水師', palace: '坎', wuxing: '水', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['寅木', '辰土', '午火', '丑土', '亥水', '酉金'] },

    // 艮宮八卦（五行屬土）  <-- 補齊
    '001001': { name: '艮為山', palace: '艮', wuxing: '土', type: '八純卦', shi: 6, ying: 3, dizhi: ['辰土', '午火', '申金', '戌土', '子水', '寅木'] },
    '101001': { name: '山火賁', palace: '艮', wuxing: '土', type: '一世卦', shi: 1, ying: 4, dizhi: ['卯木', '丑土', '亥水', '戌土', '子水', '寅木'] },
    '111001': { name: '山天大畜', palace: '艮', wuxing: '土', type: '二世卦', shi: 2, ying: 5, dizhi: ['子水', '', '寅木', '辰土', '戌土', '子水', '寅木'] },
    '110001': { name: '山澤損', palace: '艮', wuxing: '土', type: '三世卦', shi: 3, ying: 6, dizhi: ['巳火', '卯木', '丑土', '戌土', '子水', '寅木'] },
    '110101': { name: '火澤暌', palace: '艮', wuxing: '土', type: '四世卦', shi: 4, ying: 1, dizhi: ['巳火', '卯木', '丑土', '酉金', '未土', '巳火'] },
    '110111': { name: '天澤覆', palace: '艮', wuxing: '土', type: '五世卦', shi: 5, ying: 2, dizhi: ['巳火', '卯木', '丑土', '午火', '申金', '戌土'] },
    '110011': { name: '風澤中孚', palace: '艮', wuxing: '土', type: '游魂卦', shi: 4, ying: 1, dizhi: ['巳火', '卯木', '丑土', '未土', '巳火', '卯木'] },
    '001011': { name: '風山漸', palace: '艮', wuxing: '土', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['辰土', '午火', '申金', '未土', '巳火', '卯木'] },

    // 坤宮八卦（五行屬土）
    '000000': { name: '坤為地', palace: '坤', wuxing: '土', type: '八純卦', shi: 6, ying: 3, dizhi: ['未土', '巳火', '卯木', '丑土', '亥水', '酉金'] },
    '100000': { name: '地雷復', palace: '坤', wuxing: '土', type: '一世卦', shi: 1, ying: 4, dizhi: ['子水', '寅木', '辰土', '丑土', '亥水', '酉金'] },
    '110000': { name: '地澤臨', palace: '坤', wuxing: '土', type: '二世卦', shi: 2, ying: 5, dizhi: ['巳火', '卯木', '丑土', '丑土', '亥水', '酉金'] },
    '111000': { name: '地天泰', palace: '坤', wuxing: '土', type: '三世卦', shi: 3, ying: 6, dizhi: ['子水', '寅木', '辰土', '丑土', '亥水', '酉金'] },
    '111100': { name: '雷天大壯', palace: '坤', wuxing: '土', type: '四世卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '午火', '申金', '戌土'] },
    '111110': { name: '澤天夬', palace: '坤', wuxing: '土', type: '五世卦', shi: 5, ying: 2, dizhi: ['子水', '寅木', '辰土', '亥水', '酉金', '未土'] },
    '111010': { name: '水天需', palace: '坤', wuxing: '土', type: '游魂卦', shi: 4, ying: 1, dizhi: ['子水', '寅木', '辰土', '申金', '戌土', '子水'] },
    '000010': { name: '水地比', palace: '坤', wuxing: '土', type: '歸魂卦', shi: 3, ying: 6, dizhi: ['未土', '巳火', '卯木', '申金', '戌土', '子水'] }
};


/**
 * 64卦簡化常數（查表專用）
 * 只保留基本信息，提升查詢效率
 */
static GUA_64_SIMPLE = {
    // 乾宮
    '111111': { name: '乾為天', palace: '乾', wuxing: '金', type: '八純卦', shi: 6, ying: 3 },
    '011111': { name: '天風姤', palace: '乾', wuxing: '金', type: '一世卦', shi: 1, ying: 4 },
    '001111': { name: '天山遯', palace: '乾', wuxing: '金', type: '二世卦', shi: 2, ying: 5 },
    '000111': { name: '天地否', palace: '乾', wuxing: '金', type: '三世卦', shi: 3, ying: 6 },
    '000110': { name: '風地觀', palace: '乾', wuxing: '金', type: '四世卦', shi: 4, ying: 1 },
    '000100': { name: '山地剝', palace: '乾', wuxing: '金', type: '五世卦', shi: 5, ying: 2 },
    '000101': { name: '火地晉', palace: '乾', wuxing: '金', type: '游魂卦', shi: 4, ying: 1 },
    '000001': { name: '火天大有', palace: '乾', wuxing: '金', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 坤宮
    '000000': { name: '坤為地', palace: '坤', wuxing: '土', type: '八純卦', shi: 6, ying: 3 },
    '100000': { name: '地雷復', palace: '坤', wuxing: '土', type: '一世卦', shi: 1, ying: 4 },
    '110000': { name: '地澤臨', palace: '坤', wuxing: '土', type: '二世卦', shi: 2, ying: 5 },
    '111000': { name: '地天泰', palace: '坤', wuxing: '土', type: '三世卦', shi: 3, ying: 6 },
    '111001': { name: '雷天大壯', palace: '坤', wuxing: '土', type: '四世卦', shi: 4, ying: 1 },
    '111011': { name: '澤天夬', palace: '坤', wuxing: '土', type: '五世卦', shi: 5, ying: 2 },
    '111010': { name: '水天需', palace: '坤', wuxing: '土', type: '游魂卦', shi: 4, ying: 1 },
    '111110': { name: '水地比', palace: '坤', wuxing: '土', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 震宮
    '100100': { name: '震為雷', palace: '震', wuxing: '木', type: '八純卦', shi: 6, ying: 3 },
    '110100': { name: '雷澤歸妹', palace: '震', wuxing: '木', type: '一世卦', shi: 1, ying: 4 },
    '010100': { name: '雷水解', palace: '震', wuxing: '木', type: '二世卦', shi: 2, ying: 5 },
    '011100': { name: '雷風恆', palace: '震', wuxing: '木', type: '三世卦', shi: 3, ying: 6 },
    '011101': { name: '風火家人', palace: '震', wuxing: '木', type: '四世卦', shi: 4, ying: 1 },
    '011001': { name: '風澤中孚', palace: '震', wuxing: '木', type: '五世卦', shi: 5, ying: 2 },
    '011010': { name: '風水渙', palace: '震', wuxing: '木', type: '游魂卦', shi: 4, ying: 1 },
    '011110': { name: '風雷益', palace: '震', wuxing: '木', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 巽宮
    '011011': { name: '巽為風', palace: '巽', wuxing: '木', type: '八純卦', shi: 6, ying: 3 },
    '001011': { name: '風山漸', palace: '巽', wuxing: '木', type: '一世卦', shi: 1, ying: 4 },
    '101011': { name: '風火鼎', palace: '巽', wuxing: '木', type: '二世卦', shi: 2, ying: 5 },
    '100011': { name: '風雷益', palace: '巽', wuxing: '木', type: '三世卦', shi: 3, ying: 6 },
    '100010': { name: '雷水解', palace: '巽', wuxing: '木', type: '四世卦', shi: 4, ying: 1 },
    '100110': { name: '雷澤歸妹', palace: '巽', wuxing: '木', type: '五世卦', shi: 5, ying: 2 },
    '100101': { name: '雷火豐', palace: '巽', wuxing: '木', type: '游魂卦', shi: 4, ying: 1 },
    '100001': { name: '雷山小過', palace: '巽', wuxing: '木', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 坎宮
    '010010': { name: '坎為水', palace: '坎', wuxing: '水', type: '八純卦', shi: 6, ying: 3 },
    '101010': { name: '水火既濟', palace: '坎', wuxing: '水', type: '一世卦', shi: 1, ying: 4 },
    '001010': { name: '水山蹇', palace: '坎', wuxing: '水', type: '二世卦', shi: 2, ying: 5 },
    '000010': { name: '水地比', palace: '坎', wuxing: '水', type: '三世卦', shi: 3, ying: 6 },
    '000011': { name: '地風升', palace: '坎', wuxing: '水', type: '四世卦', shi: 4, ying: 1 },
    '000001': { name: '地山謙', palace: '坎', wuxing: '水', type: '五世卦', shi: 5, ying: 2 },
    '000101': { name: '地火明夷', palace: '坎', wuxing: '水', type: '游魂卦', shi: 4, ying: 1 },
    '001101': { name: '山火賁', palace: '坎', wuxing: '水', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 離宮
    '101101': { name: '離為火', palace: '離', wuxing: '火', type: '八純卦', shi: 6, ying: 3 },
    '010101': { name: '火水未濟', palace: '離', wuxing: '火', type: '一世卦', shi: 1, ying: 4 },
    '110101': { name: '火澤睽', palace: '離', wuxing: '火', type: '二世卦', shi: 2, ying: 5 },
    '111101': { name: '火天大有', palace: '離', wuxing: '火', type: '三世卦', shi: 3, ying: 6 },
    '111100': { name: '天雷無妄', palace: '離', wuxing: '火', type: '四世卦', shi: 4, ying: 1 },
    '111110': { name: '天澤履', palace: '離', wuxing: '火', type: '五世卦', shi: 5, ying: 2 },
    '111011': { name: '風天小畜', palace: '離', wuxing: '火', type: '游魂卦', shi: 4, ying: 1 },
    '110011': { name: '澤風大過', palace: '離', wuxing: '火', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 艮宮
    '001001': { name: '艮為山', palace: '艮', wuxing: '土', type: '八純卦', shi: 6, ying: 3 },
    '110001': { name: '山澤損', palace: '艮', wuxing: '土', type: '一世卦', shi: 1, ying: 4 },
    '010001': { name: '山水蒙', palace: '艮', wuxing: '土', type: '二世卦', shi: 2, ying: 5 },
    '011001': { name: '山風蠱', palace: '艮', wuxing: '土', type: '三世卦', shi: 3, ying: 6 },
    '011000': { name: '風地觀', palace: '艮', wuxing: '土', type: '四世卦', shi: 4, ying: 1 },
    '011010': { name: '風水渙', palace: '艮', wuxing: '土', type: '五世卦', shi: 5, ying: 2 },
    '011101': { name: '風火家人', palace: '艮', wuxing: '土', type: '游魂卦', shi: 4, ying: 1 },
    '010101': { name: '水火既濟', palace: '艮', wuxing: '土', type: '歸魂卦', shi: 3, ying: 6 },
    
    // 兌宮
    '110110': { name: '兌為澤', palace: '兌', wuxing: '金', type: '八純卦', shi: 6, ying: 3 },
    '100110': { name: '澤雷隨', palace: '兌', wuxing: '金', type: '一世卦', shi: 1, ying: 4 },
    '000110': { name: '澤地萃', palace: '兌', wuxing: '金', type: '二世卦', shi: 2, ying: 5 },
    '010110': { name: '澤水困', palace: '兌', wuxing: '金', type: '三世卦', shi: 3, ying: 6 },
    '010111': { name: '水天需', palace: '兌', wuxing: '金', type: '四世卦', shi: 4, ying: 1 },
    '010011': { name: '水風井', palace: '兌', wuxing: '金', type: '五世卦', shi: 5, ying: 2 },
    '010001': { name: '水山蹇', palace: '兌', wuxing: '金', type: '游魂卦', shi: 4, ying: 1 },
    '011001': { name: '風山漸', palace: '兌', wuxing: '金', type: '歸魂卦', shi: 3, ying: 6 }
};

/**
 * 根據二進制直接查找卦象的地支五行（查表法）
 */
static calculateGuaDizhiWuxing(binary) {
    console.log('=== 直接查表法計算地支五行 ===');
    console.log('輸入二進制:', binary);
    
    const guaData = this.GUA_64_COMPLETE[binary];
    if (!guaData || !guaData.dizhi) {
        console.error('未找到對應卦象的地支五行數據:', binary);
        return Array(6).fill('--');
    }
    
    console.log('查表得到卦名:', guaData.name);
    console.log('查表得到地支五行:', guaData.dizhi);
    return guaData.dizhi;
}

// ========== 核心計算方法 ==========

/**
 * 計算六親關係（統一函數）
 */
static calculateLiuqin(myWuxing, targetWuxing) {
    if (myWuxing === targetWuxing) {
        return '兄弟';
    }
    
    const myRelation = this.WUXING_BASE.RELATION[myWuxing];
    if (!myRelation) return '--';
    
    if (myRelation.generates === targetWuxing) {
        return '子孫'; // 我生者為子孫
    }
    
    if (myRelation.destroys === targetWuxing) {
        return '妻財'; // 我克者為妻財
    }
    
    // 檢查生我者（父母）
    for (const [wuxing, relation] of Object.entries(this.WUXING_BASE.RELATION)) {
        if (relation.generates === myWuxing && wuxing === targetWuxing) {
            return '父母';
        }
        if (relation.destroys === myWuxing && wuxing === targetWuxing) {
            return '官鬼';
        }
    }
    
    return '--';
}

/**
 * 計算六親
 */
/**
 * 計算六親（允許指定卦宮五行）
 */
static calculateGuaLiuqin(binary) {
    console.log('計算六親關係');

    const guaData = this.GUA_64_COMPLETE[binary];
    if (!guaData) {
        return Array(6).fill('--');
    }

    const palaceWuxing = guaData.wuxing;
    const dizhiWuxing = this.calculateGuaDizhiWuxing(binary);

    const liuqin = dizhiWuxing.map(dizhiItem => {
        if (dizhiItem === '--') return '--';

        // 提取五行
        const yaoWuxing = dizhiItem.charAt(dizhiItem.length - 1);
        return this.calculateLiuqin(palaceWuxing, yaoWuxing);
    });

    console.log('各爻六親:', liuqin);
    return liuqin;
}

/**
 * 計算伏神
 */
static calculateFushen(binaryGua, currentLiuqin) {
    console.log('計算伏神，輸入:', { binaryGua, currentLiuqin });
    
    const guaData = this.GUA_64_COMPLETE[binaryGua];
    if (!guaData) {
        console.log('找不到對應卦宮');
        return Array(6).fill('');
    }
    
    const palace = guaData.palace;
    const palaceData = this.BAGUA_PURE_CONSTANTS[palace];
    
    console.log('卦宮:', palace);
    
    // 統計當前卦中已有的六親類型
    const existingLiuqin = new Set();
    currentLiuqin.forEach(lq => {
        if (lq && lq !== '--') {
            existingLiuqin.add(lq);
        }
    });
    
    console.log('已有六親:', Array.from(existingLiuqin));
    
    // 查找缺少的六親
    const allLiuqin = ['父母', '兄弟', '子孫', '妻財', '官鬼'];
    const missingLiuqin = allLiuqin.filter(lq => !existingLiuqin.has(lq));
    
    console.log('缺少的六親:', missingLiuqin);
    
    if (missingLiuqin.length === 0) {
        return Array(6).fill('');
    }
    
    // 從本宮首卦中找伏神
    const palaceWuxing = palaceData.wuxing;
    const palaceDizhi = palaceData.dizhi;
    
    const fushen = Array(6).fill('');
    
    // 為每個缺少的六親找到在首卦中的位置
    missingLiuqin.forEach(missing => {
        for (let i = 0; i < 6; i++) {
            const dizhi = palaceDizhi[i];
            const yaoWuxing = this.WUXING_BASE.DIZHI[dizhi];
            const liuqin = this.calculateLiuqin(palaceWuxing, yaoWuxing);
            
            if (liuqin === missing) {
                // 格式化伏神顯示：分行顯示，加粗，小字體
                fushen[i] = `<div style="font-weight: bold; font-size: 10px; line-height: 11px; text-align: center;">
                    <div>${missing}</div>
                    <div>${dizhi}${yaoWuxing}</div>
                </div>`;
                console.log(`伏神 ${missing} 伏於第 ${i + 1} 爻：${dizhi}${yaoWuxing}`);
                break;
            }
        }
    });
    
    console.log('計算得到的伏神:', fushen);
    return fushen;
}

/**
 * 完整計算某個卦象的地支五行和六親
 */
static calculateGuaComplete(binaryGua) {
    const dizhiWuxing = this.calculateGuaDizhiWuxing(binaryGua);
    const liuqin = this.calculateGuaLiuqin(binaryGua);
    const guaData = this.GUA_64_COMPLETE[binaryGua];
    
    return {
        dizhiWuxing: dizhiWuxing,
        liuqin: liuqin,
        palace: guaData ? guaData.palace : null,
        shiying: guaData ? { shi: guaData.shi, ying: guaData.ying } : null
    };
}

/**
 * 計算五行旺衰狀態
 */
static calculateWuxingState(monthZhi) {
    const seasonMap = {
        // 春季（寅卯辰月）：木旺火相水休金囚土死
        '寅': { wood: '旺', fire: '相', water: '休', metal: '囚', earth: '死' },
        '卯': { wood: '旺', fire: '相', water: '休', metal: '囚', earth: '死' },
        '辰': { wood: '旺', fire: '相', water: '休', metal: '囚', earth: '死' },
        
        // 夏季（巳午未月）：火旺土相木休水囚金死
        '巳': { fire: '旺', earth: '相', wood: '休', water: '囚', metal: '死' },
        '午': { fire: '旺', earth: '相', wood: '休', water: '囚', metal: '死' },
        '未': { fire: '旺', earth: '相', wood: '休', water: '囚', metal: '死' },
        
        // 秋季（申酉戌月）：金旺水相土休火囚木死
        '申': { metal: '旺', water: '相', earth: '休', fire: '囚', wood: '死' },
        '酉': { metal: '旺', water: '相', earth: '休', fire: '囚', wood: '死' },
        '戌': { metal: '旺', water: '相', earth: '休', fire: '囚', wood: '死' },
        
        // 冬季（亥子丑月）：水旺木相金休土囚火死
        '亥': { water: '旺', wood: '相', metal: '休', earth: '囚', fire: '死' },
        '子': { water: '旺', wood: '相', metal: '休', earth: '囚', fire: '死' },
        '丑': { water: '旺', wood: '相', metal: '休', earth: '囚', fire: '死' }
    };
    
    return seasonMap[monthZhi] || { wood: '--', fire: '--', earth: '--', metal: '--', water: '--' };
}

/**
 * 計算神煞
 */
static calculateShensha(ganZhiData) {
    const dayGan = ganZhiData.day.charAt(0);
    const dayZhi = ganZhiData.day.charAt(1);
    
    return {
        yima: this.getYima(dayZhi),
        guiren: this.getTianyiGuiren(dayGan),
        taohua: this.getTaohua(dayZhi),
        lucun: this.getLucun(dayGan)
    };
}

/**
 * 計算天乙貴人
 */
static getTianyiGuiren(dayGan) {
    const guirenMap = {
        '甲': '丑未', '戊': '丑未', '庚': '丑未',
        '乙': '子申', '己': '子申',
        '丙': '亥酉', '丁': '亥酉',
        '壬': '卯巳', '癸': '卯巳',
        '辛': '寅午'
    };
    return guirenMap[dayGan] || '--';
}

/**
 * 計算驛馬
 */
static getYima(dayZhi) {
    const yimaMap = {
        '申': '寅', '子': '寅', '辰': '寅',
        '寅': '申', '午': '申', '戌': '申',
        '巳': '亥', '酉': '亥', '丑': '亥',
        '亥': '巳', '卯': '巳', '未': '巳'
    };
    return yimaMap[dayZhi] || '--';
}

/**
 * 計算桃花（咸池）
 */
static getTaohua(dayZhi) {
    const taohuaMap = {
        '申': '酉', '子': '酉', '辰': '酉',
        '寅': '卯', '午': '卯', '戌': '卯',
        '巳': '午', '酉': '午', '丑': '午',
        '亥': '子', '卯': '子', '未': '子'
    };
    return taohuaMap[dayZhi] || '--';
}

/**
 * 計算祿存
 */
static getLucun(dayGan) {
    const lucunMap = {
        '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
        '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
        '壬': '亥', '癸': '子'
    };
    return lucunMap[dayGan] || '--';
}

/**
 * 六爻結果轉64卦名 - 保持正確順序
 */
static calculateGuaNames(liuyaoResults) {
    console.log('六爻結果輸入:', liuyaoResults);
    
    // 保持原始順序，不要反轉
    const originalBinary = liuyaoResults.map(result => {
        return (result === 1 || result === 3) ? '1' : '0';
    }).join('');
    
    console.log('本卦二進制:', originalBinary);
    
    // 檢查是否有動爻
    const hasMovingYao = liuyaoResults.some(result => result === 0 || result === 3);
    let bianBinary = '';
    
    if (hasMovingYao) {
        bianBinary = liuyaoResults.map(result => {
            if (result === 0) return '1'; // 老陰變陽
            if (result === 3) return '0'; // 老陽變陰
            return (result === 1) ? '1' : '0'; // 少陽少陰不變
        }).join('');
        console.log('變卦二進制:', bianBinary);
    }
    
    // 查找卦名
    const gnData = this.GUA_64_COMPLETE[originalBinary];
    const bgnData = bianBinary ? this.GUA_64_COMPLETE[bianBinary] : null;
    
    return {
        gn: gnData ? gnData.name : 'unknown',
        bgn: bgnData ? bgnData.name : '',
        originalBinary: originalBinary,
        bianBinary: bianBinary,
        hasMovingYao: hasMovingYao
    };
}

/**
 * 數字起卦轉64卦名
 */
static calculateNumberGuaNames(numberGuaResult) {
    console.log('數字起卦結果輸入:', numberGuaResult);
    
    // 從finalGua取得最終的六爻狀態
    const finalGua = numberGuaResult.finalGua;
    
    // 轉換為二進制（反轉順序）
    const originalBinary = numberGuaResult.originalGua.slice().map(code => {
        return (code === 1) ? '1' : '0'; // 1陽爻→1, 2陰爻→0
    }).join('');
    
    const bianBinary = finalGua.slice().map(code => {
        if (code === 3) return '1'; // 老陽→陽
        if (code === 0) return '0'; // 老陰→陰
        if (code === 1) return '1'; // 陽爻不變
        if (code === 2) return '0'; // 陰爻不變
        return '0';
    }).join('');
    
    console.log('數字起卦本卦二進制:', originalBinary);
    console.log('數字起卦變卦二進制:', bianBinary);
    
    // 查找卦名
    const originalGua = this.GUA_64_COMPLETE[originalBinary];
    const bianGua = this.GUA_64_COMPLETE[bianBinary];
    
    console.log('本卦查找結果:', originalGua);
    console.log('變卦查找結果:', bianGua);
    
    // 格式化卦名顯示
    const formatGuaName = (gua) => {
        if (!gua) return '未知卦';
        if (gua.type === '一般卦') {
            return gua.name; // 一般卦不顯示類型
        } else {
            return `${gua.name}(${gua.type})`; // 六沖、六合、歸魂、游魂卦顯示類型
        }
    };
    
    return {
        gn: formatGuaName(originalGua),
        bgn: formatGuaName(bianGua),
        originalBinary: originalBinary,
        bianBinary: bianBinary
    };
}

/**
 * 計算世應位置
 */
static calculateShiYing(binary) {
    console.log('計算世應位置，卦象:', binary);
    
    const guaData = this.GUA_64_COMPLETE[binary];
    if (!guaData) {
        console.log('找不到對應卦象');
        return { shi: null, ying: null };
    }
    
    console.log('找到世應位置:', { shi: guaData.shi, ying: guaData.ying });
    
    return {
        shi: guaData.shi,
        ying: guaData.ying
    };
}

/**
 * 完整計算所有進階數據
 */
static calculateAllAdvancedData(ganZhiData, divinationResult = null, divinationType = 'time') {
    // 計算五行旺衰
    const monthZhi = ganZhiData.month.charAt(1);
    const wuxingState = this.calculateWuxingState(monthZhi);
    
    // 計算神煞
    const shensha = this.calculateShensha(ganZhiData);
    
    let guaNames = null;
    let guaDetails = null;
    
    // 根據起卦方式計算卦名
    if (divinationType === 'liuyao' && divinationResult) {
        // 六爻起卦
        guaNames = this.calculateGuaNames(divinationResult);
        if (guaNames && guaNames.originalBinary) {
            guaDetails = this.calculateGuaComplete(guaNames.originalBinary);
        }
    } else if (divinationType === 'number' && divinationResult) {
        // 數字起卦
        guaNames = this.calculateNumberGuaNames(divinationResult);
        if (guaNames && guaNames.originalBinary) {
            guaDetails = this.calculateGuaComplete(guaNames.originalBinary);
        }
    }
    
    return {
        wuxingState: wuxingState,
        shensha: shensha,
        guaNames: guaNames,
        guaDetails: guaDetails
    };
}

}

// 導出為全局變量（兼容性）
if (typeof window !== 'undefined') {
    window.AdvancedCalculator = AdvancedCalculator;
}

// Node.js 模組導出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AdvancedCalculator
    };
}
