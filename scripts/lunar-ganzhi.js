/**
 * 農曆干支計算庫
 * 包含農曆轉換和干支計算的核心功能
 */

// 天干地支數據
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 農曆轉換庫 - 基於香港天文台數據
const LunarCalendarLib = {
    madd: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    CalendarData: [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95],
    
    getBit: function(m, n) {
        return (m >> n) & 1;
    },
    
    solarToLunar: function(solarYear, solarMonth, solarDay) {
        if (solarYear < 1921 || solarYear > 2020) {
            return null;
        }
        
        let total = (solarYear - 1921) * 365 + Math.floor((solarYear - 1921) / 4) + 
                   this.madd[solarMonth - 1] + solarDay - 38;
                   
        if (solarYear % 4 == 0 && solarMonth > 2) {
            total++;
        }
        
        let isEnd = false;
        let m, n, k;
        
        for (m = 0; m < this.CalendarData.length; m++) {
            k = (this.CalendarData[m] < 0xfff) ? 11 : 12;
            for (n = k; n >= 0; n--) {
                if (total <= 29 + this.getBit(this.CalendarData[m], n)) {
                    isEnd = true;
                    break;
                }
                total = total - 29 - this.getBit(this.CalendarData[m], n);
            }
            if (isEnd) break;
        }
        
        const lunarYear = 1921 + m;
        let lunarMonth = k - n + 1;
        const lunarDay = total;
        
        if (k == 12) {
            if (lunarMonth == Math.floor(this.CalendarData[m] / 0x10000) + 1) {
                lunarMonth = 1 - lunarMonth;
            }
            if (lunarMonth > Math.floor(this.CalendarData[m] / 0x10000) + 1) {
                lunarMonth--;
            }
        }
        
        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: lunarMonth < 0
        };
    }
};

/**
 * 干支計算類
 */
class GanZhiCalculator {
    
    /**
     * 年干支計算 - 基準點：1984年甲子年
     */
    static getYearGanZhi(year) {
        const baseYear = 1984;
        const yearDiff = year - baseYear;
        
        const ganIndex = (yearDiff % 10 + 10) % 10;
        const zhiIndex = (yearDiff % 12 + 12) % 12;
        
        return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
    }
    
    /**
     * 月干支計算 - 根據節氣和年干
     */
    static getMonthGanZhi(yearGan, date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const yearGanIndex = TIAN_GAN.indexOf(yearGan);
        
        // 根據節氣確定干支月份（簡化版，基於陽曆月份）
        let ganzhiMonth;
        if (month == 1) ganzhiMonth = 12; // 丑月
        else if (month == 2) ganzhiMonth = 1; // 寅月（正月）
        else if (month == 3) ganzhiMonth = 2; // 卯月
        else if (month == 4) ganzhiMonth = 3; // 辰月
        else if (month == 5) ganzhiMonth = 4; // 巳月
        else if (month == 6) ganzhiMonth = 5; // 午月
        else if (month == 7) ganzhiMonth = 6; // 未月
        else if (month == 8) ganzhiMonth = 7; // 申月
        else if (month == 9) ganzhiMonth = 8; // 酉月
        else if (month == 10) ganzhiMonth = 9; // 戌月
        else if (month == 11) ganzhiMonth = 10; // 亥月
        else if (month == 12) ganzhiMonth = 11; // 子月
        
        // 五虎遁：根據年干確定正月天干
        let zhengYueTianGan;
        if (yearGanIndex == 0 || yearGanIndex == 5) { // 甲己
            zhengYueTianGan = 2; // 丙
        } else if (yearGanIndex == 1 || yearGanIndex == 6) { // 乙庚  
            zhengYueTianGan = 4; // 戊
        } else if (yearGanIndex == 2 || yearGanIndex == 7) { // 丙辛
            zhengYueTianGan = 6; // 庚
        } else if (yearGanIndex == 3 || yearGanIndex == 8) { // 丁壬
            zhengYueTianGan = 8; // 壬
        } else { // 戊癸
            zhengYueTianGan = 0; // 甲
        }
        
        // 計算月天干：從正月天干開始，順序推算
        const monthGanIndex = (zhengYueTianGan + ganzhiMonth - 1) % 10;
        
        // 計算月地支
        let monthZhiIndex;
        if (ganzhiMonth <= 10) {
            monthZhiIndex = ganzhiMonth + 1; // 寅=2開始
        } else if (ganzhiMonth == 11) {
            monthZhiIndex = 0; // 子
        } else {
            monthZhiIndex = 1; // 丑
        }
        
        return TIAN_GAN[monthGanIndex] + DI_ZHI[monthZhiIndex];
    }
    
    /**
     * 日干支計算 - 使用正確的基準日期
     */
    static getDayGanZhi(date) {
        // 1900年1月1日為甲戌日 (天干0，地支10)
        const baseDate = new Date(1900, 0, 1);
        const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
        
        const ganIndex = (0 + diffDays) % 10;
        const zhiIndex = (10 + diffDays) % 12;
        
        return TIAN_GAN[(ganIndex + 10) % 10] + DI_ZHI[(zhiIndex + 12) % 12];
    }
    
    /**
     * 時干支計算
     */
    static getTimeGanZhi(dayGan, hour) {
        const dayGanIndex = TIAN_GAN.indexOf(dayGan);
        
        // 確定時辰（地支）
        const shiZhiIndex = Math.floor((hour + 1) / 2) % 12;
        
        // 時干計算
        let timeGanStart;
        switch(dayGanIndex) {
            case 0: case 5: timeGanStart = 0; break; // 甲己日：甲子時起
            case 1: case 6: timeGanStart = 2; break; // 乙庚日：丙子時起
            case 2: case 7: timeGanStart = 4; break; // 丙辛日：戊子時起  
            case 3: case 8: timeGanStart = 6; break; // 丁壬日：庚子時起
            case 4: case 9: timeGanStart = 8; break; // 戊癸日：壬子時起
            default: timeGanStart = 0;
        }
        
        const timeGanIndex = (timeGanStart + shiZhiIndex) % 10;
        
        return {
            ganZhi: TIAN_GAN[timeGanIndex] + DI_ZHI[shiZhiIndex],
            shiChen: DI_ZHI[shiZhiIndex] + '時'
        };
    }
    
    /**
     * 獲取農曆年份（包含近似計算）
     */
    static getLunarYear(solarYear, solarMonth) {
        const lunar = LunarCalendarLib.solarToLunar(solarYear, solarMonth, 15);
        
        if (lunar) {
            return lunar.year;
        }
        
        // 農曆轉換失敗時的近似計算
        if (solarMonth <= 2) {
            return solarYear - 1;
        } else {
            return solarYear;
        }
    }
    
    /**
     * 完整計算指定日期的干支
     */
    static calculateGanZhi(date) {
        const solarYear = date.getFullYear();
        const solarMonth = date.getMonth() + 1;
        const solarDay = date.getDate();
        const hour = date.getHours();
        
        // 獲取農曆年份用於年干支計算
        const lunarYear = this.getLunarYear(solarYear, solarMonth);
        
        // 計算各項干支
        const yearGanZhi = this.getYearGanZhi(lunarYear);
        const yearGan = yearGanZhi.charAt(0);
        const monthGanZhi = this.getMonthGanZhi(yearGan, date);
        const dayGanZhi = this.getDayGanZhi(date);
        const dayGan = dayGanZhi.charAt(0);
        const timeResult = this.getTimeGanZhi(dayGan, hour);
        
        // 嘗試獲取完整農曆信息
        const lunar = LunarCalendarLib.solarToLunar(solarYear, solarMonth, solarDay);
        let lunarInfo = null;
        if (lunar) {
            lunarInfo = `農曆${lunar.year}年${lunar.isLeap ? '閏' : ''}${Math.abs(lunar.month)}月${lunar.day}日`;
        } else {
            lunarInfo = `農曆${lunarYear}年（近似）`;
        }
        
        return {
            year: yearGanZhi,
            month: monthGanZhi,
            day: dayGanZhi,
            time: timeResult.ganZhi,
            shiChen: timeResult.shiChen,
            lunarInfo: lunarInfo
        };
    }
}

// 導出為全局變量（兼容性）
if (typeof window !== 'undefined') {
    window.GanZhiCalculator = GanZhiCalculator;
    window.LunarCalendarLib = LunarCalendarLib;
}

// Node.js 模塊導出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GanZhiCalculator,
        LunarCalendarLib,
        TIAN_GAN,
        DI_ZHI
    };
}