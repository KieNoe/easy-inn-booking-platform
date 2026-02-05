export declare const formatDate: (date: string | Date, format?: string) => string;
export declare const formatPrice: (price: number) => string;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, delay: number) => ((...args: Parameters<T>) => void);
export declare const throttle: <T extends (...args: any[]) => any>(func: T, delay: number) => ((...args: Parameters<T>) => void);
export declare const deepClone: <T>(obj: T) => T;
