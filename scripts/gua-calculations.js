/**
 * 卦理計算庫
 * 包含旬空、六神、世應等卦中各項數據的計算功能
 */

/**
 * 卦理計算器
 */
class GuaCalculator {
    
    /**
     * 計算旬空（空亡）
     * 根據日干支確定所屬甲旬，返回該旬的空亡地支
     */
    static getXunKong(dayGanZhi) {
        const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        const ganIndex = tianGan.indexOf(dayGanZhi.charAt(0));
        const zhiIndex = diZhi.indexOf(dayGanZhi.charAt(1));
        
        // 計算在六十甲子中的位置（使用正確的公式）
        let ganZhiNumber = 0;
        for (let i = 0; i < 60; i++) {
            const currentGan = tianGan[i % 10];
            const currentZhi = diZhi[i % 12];
            if (currentGan === dayGanZhi.charAt(0) && currentZhi === dayGanZhi.charAt(1)) {
                ganZhiNumber = i;
                break;
            }
        }
        
        // 計算屬於哪個甲旬（0-5）
        const xunIndex = Math.floor(ganZhiNumber / 10);
        
        // 六個旬的旬空地支
        const xunKongTable = [
            ['戌', '亥'], // 甲子旬（0-9）：甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉
            ['申', '酉'], // 甲戌旬（10-19）：甲戌、乙亥、丙子、丁丑、戊寅、己卯、庚辰、辛巳、壬午、癸未
            ['午', '未'], // 甲申旬（20-29）：甲申、乙酉、丙戌、丁亥、戊子、己丑、庚寅、辛卯、壬辰、癸巳
            ['辰', '巳'], // 甲午旬（30-39）：甲午、乙未、丙申、丁酉、戊戌、己亥、庚子、辛丑、壬寅、癸卯
            ['寅', '卯'], // 甲辰旬（40-49）：甲辰、乙巳、丙午、丁未、戊申、己酉、庚戌、辛亥、壬子、癸丑
            ['子', '丑']  // 甲寅旬（50-59）：甲寅、乙卯、丙辰、丁巳、戊午、己未、庚申、辛酉、壬戌、癸亥
        ];
        
        console.log(`旬空計算：${dayGanZhi} -> 位置:${ganZhiNumber}, 甲旬:${xunIndex}, 旬空:${xunKongTable[xunIndex]?.join('、')}`);
        
        return xunKongTable[xunIndex];
    }
    
    /**
     * 獲取旬空顯示字串
     */
    static getXunKongDisplay(dayGanZhi) {
        const xunKong = this.getXunKong(dayGanZhi);
        return xunKong.join('、');
    }
    
    /**
     * 根據日干計算六獸（六神）
     * 口訣：甲乙起青龍，丙丁起朱雀，戊日起勾陳，己日起螣蛇，庚辛起白虎，壬癸起玄武
     */
    static getLiushen(dayGan) {
        const liushenTable = {
            '甲': ['青龍', '朱雀', '勾陳', '螣蛇', '白虎', '玄武'],
            '乙': ['青龍', '朱雀', '勾陳', '螣蛇', '白虎', '玄武'],
            '丙': ['朱雀', '勾陳', '螣蛇', '白虎', '玄武', '青龍'],
            '丁': ['朱雀', '勾陳', '螣蛇', '白虎', '玄武', '青龍'],
            '戊': ['勾陳', '螣蛇', '白虎', '玄武', '青龍', '朱雀'],
            '己': ['螣蛇', '白虎', '玄武', '青龍', '朱雀', '勾陳'],
            '庚': ['白虎', '玄武', '青龍', '朱雀', '勾陳', '螣蛇'],
            '辛': ['白虎', '玄武', '青龍', '朱雀', '勾陳', '螣蛇'],
            '壬': ['玄武', '青龍', '朱雀', '勾陳', '螣蛇', '白虎'],
            '癸': ['玄武', '青龍', '朱雀', '勾陳', '螣蛇', '白虎']
        };
        
        return liushenTable[dayGan] || liushenTable['甲'];
    }
    
    /**
     * 修正：計算世應位置（根據八宫卦理）
     */
    static calculateShiYing(binary) {
        console.log('計算世應位置，二進制:', binary);
        
        // 世應位置規律表（根據八宮卦理）
        const shiYingMap = {
            // 八純卦（本宮卦）- 世在六爻
            '111111': { shi: 6, ying: 3 }, // 乾為天
            '000000': { shi: 6, ying: 3 }, // 坤為地
            '100100': { shi: 6, ying: 3 }, // 震為雷
            '011011': { shi: 6, ying: 3 }, // 巽為風
            '010010': { shi: 6, ying: 3 }, // 坎為水
            '101101': { shi: 6, ying: 3 }, // 離為火
            '001001': { shi: 6, ying: 3 }, // 艮為山
            '110110': { shi: 6, ying: 3 }, // 兌為澤
            
            // 一世卦 - 世在初爻，應在四爻
            '111110': { shi: 1, ying: 4 }, // 乾宮一世
            '000001': { shi: 1, ying: 4 }, // 坤宮一世（山地剝）
            '100101': { shi: 1, ying: 4 }, // 震宮一世
            '011010': { shi: 1, ying: 4 }, // 巽宮一世
            '010011': { shi: 1, ying: 4 }, // 坎宮一世
            '101100': { shi: 1, ying: 4 }, // 離宮一世
            '001000': { shi: 1, ying: 4 }, // 艮宮一世
            '110111': { shi: 1, ying: 4 }, // 兌宮一世
            
            // 二世卦 - 世在二爻，應在五爻
            '111100': { shi: 2, ying: 5 }, // 乾宮二世
            '000011': { shi: 2, ying: 5 }, // 坤宮二世
            '100111': { shi: 2, ying: 5 }, // 震宮二世
            '011000': { shi: 2, ying: 5 }, // 巽宮二世
            '010001': { shi: 2, ying: 5 }, // 坎宮二世
            '101110': { shi: 2, ying: 5 }, // 離宮二世
            '001010': { shi: 2, ying: 5 }, // 艮宮二世
            '110101': { shi: 2, ying: 5 }, // 兌宮二世
            
            // 三世卦 - 世在三爻，應在六爻
            '111000': { shi: 3, ying: 6 }, // 乾宮三世
            '000111': { shi: 3, ying: 6 }, // 坤宮三世
            '100011': { shi: 3, ying: 6 }, // 震宮三世
            '011100': { shi: 3, ying: 6 }, // 巽宮三世
            '010101': { shi: 3, ying: 6 }, // 坎宮三世
            '101010': { shi: 3, ying: 6 }, // 離宮三世
            '001110': { shi: 3, ying: 6 }, // 艮宮三世
            '110001': { shi: 3, ying: 6 }, // 兌宮三世
            
            // 四世卦 - 世在四爻，應在初爻
            '011111': { shi: 4, ying: 1 }, // 乾宮四世
            '100000': { shi: 4, ying: 1 }, // 坤宮四世（地雷復）
            '011001': { shi: 4, ying: 1 }, // 震宮四世
            '100110': { shi: 4, ying: 1 }, // 巽宮四世
            '101010': { shi: 4, ying: 1 }, // 坎宮四世
            '010101': { shi: 4, ying: 1 }, // 離宮四世
            '110001': { shi: 4, ying: 1 }, // 艮宮四世
            '001110': { shi: 4, ying: 1 }, // 兌宮四世
            
            // 五世卦 - 世在五爻，應在二爻
            '001111': { shi: 5, ying: 2 }, // 乾宮五世
            '110000': { shi: 5, ying: 2 }, // 坤宮五世
            '001001': { shi: 5, ying: 2 }, // 震宮五世
            '110110': { shi: 5, ying: 2 }, // 巽宮五世
            '101011': { shi: 5, ying: 2 }, // 坎宮五世
            '010100': { shi: 5, ying: 2 }, // 離宮五世
            '110000': { shi: 5, ying: 2 }, // 艮宮五世
            '001111': { shi: 5, ying: 2 }, // 兌宮五世
            
            // 遊魂卦 - 世在四爻
            '000001': { shi: 4, ying: 1 }, // 遊魂卦通常世在四爻
            
            // 歸魂卦 - 世在三爻
            '111011': { shi: 3, ying: 6 }  // 歸魂卦通常世在三爻
        };
        
        // 如果直接找到，返回結果
        if (shiYingMap[binary]) {
            console.log('找到世應位置:', shiYingMap[binary]);
            return shiYingMap[binary];
        }
        
        // 默認計算（根據變爻數量判斷）
        const upperGua = binary.substring(3, 6);
        const lowerGua = binary.substring(0, 3);
        
        // 計算變爻數量來判斷世爻位置
        let changedYao = 0;
        const benchmarkGua = this.getPalaceBenchmark(binary);
        
        for (let i = 0; i < 6; i++) {
            if (binary[i] !== benchmarkGua[i]) {
                changedYao++;
            }
        }
        
        let shiPosition = 6; // 默認世在六爻（本宮卦）
        
        if (changedYao === 1) shiPosition = 1; // 一世
        else if (changedYao === 2) shiPosition = 2; // 二世
        else if (changedYao === 3) shiPosition = 3; // 三世
        else if (changedYao === 4) shiPosition = 4; // 四世
        else if (changedYao === 5) shiPosition = 5; // 五世
        
        const yingPosition = shiPosition <= 3 ? shiPosition + 3 : shiPosition - 3;
        
        console.log('計算得到的世應位置:', { shi: shiPosition, ying: yingPosition });
        
        return {
            shi: shiPosition,
            ying: yingPosition
        };
    }
    
    /**
     * 輔助函數：獲取宮的基準卦
     */
    static getPalaceBenchmark(binary) {
        const upperGua = binary.substring(3, 6);
        const lowerGua = binary.substring(0, 3);
        
        // 判斷屬於哪個宮（以主卦為準）
        if (upperGua === '111' || lowerGua === '111') return '111111'; // 乾宮
        if (upperGua === '000' || lowerGua === '000') return '000000'; // 坤宮
        if (upperGua === '100' || lowerGua === '100') return '100100'; // 震宮
        if (upperGua === '011' || lowerGua === '011') return '011011'; // 巽宮
        if (upperGua === '010' || lowerGua === '010') return '010010'; // 坎宮
        if (upperGua === '101' || lowerGua === '101') return '101101'; // 離宮
        if (upperGua === '001' || lowerGua === '001') return '001001'; // 艮宮
        if (upperGua === '110' || lowerGua === '110') return '110110'; // 兌宮
        
        return '111111'; // 默認乾宮
    }
    
    /**
     * 修正：根據二進制找卦名
     */
    static findGuaByBinary(binary) {
        // 將六爻二進制轉換為上下卦
        const upperGua = binary.substring(3, 6); // 上卦（四五上爻）
        const lowerGua = binary.substring(0, 3); // 下卦（初二三爻）
        
        console.log('查找卦名 - 上卦:', upperGua, '下卦:', lowerGua);
        
        // 八卦對應表
        const guaMap = {
            '111': '乾', '000': '坤', '100': '震', '011': '巽',
            '010': '坎', '101': '離', '001': '艮', '110': '兌'
        };
        
        const upperGuaName = guaMap[upperGua];
        const lowerGuaName = guaMap[lowerGua];
        
        if (!upperGuaName || !lowerGuaName) {
            console.error('無效的卦象:', { upperGua, lowerGua });
            return null;
        }
        
        // 組合卦名
        const combinedName = upperGuaName + lowerGuaName;
        
        // 64卦名對照表
        const guaNames = {
            '乾乾': '乾為天', '坤坤': '坤為地', '震震': '震為雷', '巽巽': '巽為風',
            '坎坎': '坎為水', '離離': '離為火', '艮艮': '艮為山', '兌兌': '兌為澤',
            '坤震': '地雷復', '艮坤': '山地剝', '乾震': '天雷無妄', '震乾': '雷天大壯',
            '坤乾': '地天泰', '乾坤': '天地否', '震坤': '雷地豫', '坤艮': '地山謙',
            '離艮': '火山旅', '艮離': '山火賁', '兌坎': '澤水困', '坎兌': '水澤節',
            '巽震': '風雷益', '震巽': '雷風恆', '巽坎': '風水渙', '坎巽': '水風井',
            '離坎': '火水未濟', '坎離': '水火既濟', '乾巽': '天風姤', '巽乾': '風天小畜',
            '坤兌': '地澤臨', '兌坤': '澤地萃', '艮坎': '山水蒙', '坎艮': '水山蹇',
            '離兌': '火澤睽', '兌離': '澤火革', '乾艮': '天山遯', '艮乾': '山天大畜',
            '坤離': '地火明夷', '離坤': '火地晉', '震艮': '雷山小過', '艮震': '山雷頤',
            '巽兌': '風澤中孚', '兌巽': '澤風大過', '巽離': '風火家人', '離巽': '火風鼎',
            '坎震': '水雷屯', '震坎': '雷水解', '乾離': '天火同人', '離乾': '火天大有',
            '坤巽': '地風升', '巽坤': '風地觀', '艮兌': '山澤損', '兌艮': '澤山咸',
            '坎乾': '水天需', '乾坎': '天水訟', '震離': '雷火豐', '離震': '火雷噬嗑',
            '巽艮': '風山漸', '艮巽': '山風蠱', '兌坤': '澤地萃', '坤兌': '地澤臨',
            '坎坤': '水地比', '坤坎': '地水師', '離艮': '火山旅', '艮離': '山火賁',
            '乾兌': '天澤履', '兌乾': '澤天夬', '震兌': '雷澤歸妹', '兌震': '澤雷隨',
            '巽坤': '風地觀', '坤巽': '地風升', '坎離': '水火既濟', '離坎': '火水未濟'
        };
        
        const fullName = guaNames[combinedName] || `${upperGuaName}${lowerGuaName}`;
        
        console.log('找到卦名:', fullName);
        
        return {
            name: fullName,
            upper: upperGuaName,
            lower: lowerGuaName,
            binary: binary
        };
    }
    
    /**
     * 計算世應位置（用於六爻卦）
     * 根據卦的類型確定世應爻位
     */
    static getShiYing(upperGua, lowerGua) {
        // 八純卦的世爻位置（從下往上數）
        const chunGuaShiWei = {
            '乾': 6, '坤': 6, '震': 4, '巽': 4,
            '坎': 3, '離': 3, '艮': 3, '兌': 3
        };
        
        // 如果是八純卦
        if (upperGua === lowerGua) {
            const shiWei = chunGuaShiWei[lowerGua] || 3;
            const yingWei = shiWei === 6 ? 3 : 6;
            return { shi: shiWei, ying: yingWei };
        }
        
        // 雜卦的世應計算（簡化版）
        // 這裡可以根據具體需求擴展
        return { shi: 3, ying: 6 };
    }
    
    /**
     * 完整的卦理數據計算
     * 結合干支信息計算卦中各項數據
     */
    static calculateGuaData(ganZhiData) {
        const dayGanZhi = ganZhiData.day;
        const dayGan = dayGanZhi.charAt(0);
        
        // 計算旬空
        const xunKong = this.getXunKongDisplay(dayGanZhi);
        
        // 計算六神
        const liuShen = this.getLiuShen(dayGan);
        
        return {
            xunKong: xunKong,
            liuShen: liuShen,
            dayGan: dayGan
        };
    }
}

// 導出為全局變量（兼容性）
if (typeof window !== 'undefined') {
    window.GuaCalculator = GuaCalculator;
}

// Node.js 模塊導出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GuaCalculator
    };
}