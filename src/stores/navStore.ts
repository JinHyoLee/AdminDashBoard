import { create } from 'zustand';

export type PageKey = 'dashboard' | 'users' | 'products' | 'orders' | 'statistics' | 'settings';

interface NavState {
  current: PageKey;
  setPage: (page: PageKey) => void;
}

/** 현재 선택된 메뉴(페이지) 상태 */
export const useNavStore = create<NavState>((set) => ({
  current: 'dashboard',
  setPage: (page) => set({ current: page }),
}));
