import fs from "fs";
import path from "path";
import { createInitialSeedData, SeedDatabase } from "./seed-data";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "gymhub-store.json");

let memoryCache: SeedDatabase | null = null;

function ensureStoreExists(): SeedDatabase {
  if (memoryCache) {
    return memoryCache;
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as SeedDatabase;
      memoryCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Khởi tạo lại store từ seed data:", err);
  }

  const initial = createInitialSeedData();
  memoryCache = initial;
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
  } catch {
    // Fallback to in-memory if filesystem is read-only
  }
  return initial;
}

export function getDb(): SeedDatabase {
  return ensureStoreExists();
}

export function saveDb(updated: SeedDatabase): void {
  memoryCache = updated;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch {
    // Keep in memory if write fails
  }
}

export function withTransaction<T>(fn: (db: SeedDatabase) => T): T {
  const current = JSON.parse(JSON.stringify(ensureStoreExists())) as SeedDatabase;
  const result = fn(current);
  saveDb(current);
  return result;
}

export function resetDemoDatabase(): SeedDatabase {
  const fresh = createInitialSeedData();
  saveDb(fresh);
  return fresh;
}

