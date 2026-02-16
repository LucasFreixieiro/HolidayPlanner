export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt?: number;
}

export class CacheService {
    private cache = new Map<string, CacheEntry<any>>();
    private storageKey = 'holidayplanner_cache';
    private useLocalStorage = false;
    constructor(useLocalStorage = false) {
        this.useLocalStorage = useLocalStorage;
        if (useLocalStorage) {
            this.loadFromStorage();
        }
    }

    /**
     * Get data from cache
     * @param key Cache Key
     * @returns Cached data or null if not found or expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
    * Set data in cache
    * @param key Cache key
    * @param data Data to cache
    * @param ttl Time to live in milliseconds (optional)
    */
    set<T>(key: string, data: T, ttl?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            expiresAt: ttl ? Date.now() + ttl : undefined,
        };

        this.cache.set(key, entry);

        if (this.useLocalStorage) {
            this.saveToStorage();
        }
    }

    /**
    * Check if key exists in cache
    */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
    * Delete specific cache entry
    */
    delete(key: string): boolean {
        const result = this.cache.delete(key);
    
        if (this.useLocalStorage) {
            this.saveToStorage();
        }
    
        return result;
    }

    /**
    * Clear all cache entries
    */
    clear(): void {
        this.cache.clear();
    
        if (this.useLocalStorage) {
            localStorage.removeItem(this.storageKey);
        }
    }

    /**
    * Clear cache entries matching a pattern
    * @param pattern String or RegExp to match keys
    */
    clearPattern(pattern: string | RegExp): void {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }

        if (this.useLocalStorage) {
            this.saveToStorage();
        }
    }

    /**
    * Get all cache keys
    */
    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
    * Load cache from localStorage
    */
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const entries = JSON.parse(stored);
                this.cache = new Map(entries);
            }
        } catch (error) {
            console.error('Failed to load cache from storage:', error);
        }
    }

    /**
    * Save cache to localStorage
    */
    private saveToStorage(): void {
        try {
            const entries = Array.from(this.cache.entries());
            localStorage.setItem(this.storageKey, JSON.stringify(entries));
        } catch (error) {
            console.error('Failed to save cache to storage:', error);
        }
    }
}

// Create singleton instances
export const sessionCache = new CacheService(false); // Memory only
export const persistentCache = new CacheService(true); // With localStorage