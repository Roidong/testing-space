import type { AppState, Order, Profile, Settings } from '../types';

const STORAGE_KEY = 'robexpress:v1';
const CURRENT_VERSION = 1;

function createDefaultState(): AppState {
  return {
    version: CURRENT_VERSION,
    orders: [],
    profile: {
      nickname: 'Kevin',
      phone: '',
    },
    settings: {
      speedMultiplier: 20,
    },
    lastTickAt: Date.now(),
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();

    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    return createDefaultState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

function migrate(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return createDefaultState();

  const data = raw as Record<string, unknown>;
  const version = (data.version as number) ?? 0;

  if (version > CURRENT_VERSION) {
    // 未来版本，降级处理
    return createDefaultState();
  }

  // v1 直接返回
  return {
    version: CURRENT_VERSION,
    orders: (data.orders as Order[]) ?? [],
    profile: (data.profile as Profile) ?? { nickname: 'Kevin', phone: '' },
    settings: (data.settings as Settings) ?? { speedMultiplier: 20 },
    lastTickAt: (data.lastTickAt as number) ?? Date.now(),
  };
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
