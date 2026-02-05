"use strict";
// 通用工具函数
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = exports.throttle = exports.debounce = exports.formatPrice = exports.formatDate = void 0;
// 格式化日期
const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
};
exports.formatDate = formatDate;
// 格式化价格
const formatPrice = (price) => {
    return `¥${price.toFixed(2)}`;
};
exports.formatPrice = formatPrice;
// 防抖函数
const debounce = (func, delay) => {
    let timeoutId = null;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => func.apply(null, args), delay);
    };
};
exports.debounce = debounce;
// 节流函数
const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(null, args);
        }
    };
};
exports.throttle = throttle;
// 深拷贝
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(item => (0, exports.deepClone)(item));
    }
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = (0, exports.deepClone)(obj[key]);
        }
    }
    return cloned;
};
exports.deepClone = deepClone;
