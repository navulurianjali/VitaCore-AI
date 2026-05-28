import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

// Real Supabase Client Instance (only initialized if configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock database system interfaces that match typical Supabase queries
export interface MockDBResponse<T> {
  data: T | null;
  error: Error | null;
}

// LocalStorage-based Mock DB engine to ensure immediate out-of-the-box interaction
export class MockDatabase {
  private getStorage<T>(key: string, defaultVal: T[] = []): T[] {
    if (typeof window === "undefined") return defaultVal;
    const data = localStorage.getItem(`vitalcore_db_${key}`);
    return data ? JSON.parse(data) : defaultVal;
  }

  private setStorage<T>(key: string, data: T[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`vitalcore_db_${key}`, JSON.stringify(data));
  }

  public getTableData<T>(table: string): T[] {
    return this.getStorage<T>(table);
  }

  public insertRow<T>(table: string, row: T): T {
    const current = this.getStorage<T>(table);
    const newRow = { ...row, id: (row as any).id || crypto.randomUUID(), created_at: new Date().toISOString() };
    current.push(newRow);
    this.setStorage(table, current);
    return newRow;
  }

  public updateRows<T>(table: string, filters: Partial<T>, updates: Partial<T>): T[] {
    const current = this.getStorage<T>(table);
    const updated = current.map((row) => {
      const match = Object.entries(filters).every(([k, v]) => (row as any)[k] === v);
      return match ? { ...row, ...updates } : row;
    });
    this.setStorage(table, updated);
    return updated;
  }

  public deleteRows<T>(table: string, filters: Partial<T>): T[] {
    const current = this.getStorage<T>(table);
    const remaining = current.filter((row) => {
      return !Object.entries(filters).every(([k, v]) => (row as any)[k] === v);
    });
    this.setStorage(table, remaining);
    return remaining;
  }
}

export const mockDb = new MockDatabase();
