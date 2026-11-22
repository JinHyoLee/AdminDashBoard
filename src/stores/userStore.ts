import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserInput } from '../types/user';

interface UserState {
  users: User[];
  addUser: (input: UserInput) => void;
  updateUser: (id: string, input: UserInput) => void;
  deleteUser: (id: string) => void;
}

/** 오늘 날짜를 YYYY-MM-DD로 */
function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** 기존 id 중 가장 큰 번호 + 1 → USR-0026 같은 형식 */
function nextId(users: User[]) {
  const max = users.reduce((m, u) => Math.max(m, Number(u.id.replace('USR-', ''))), 0);
  return `USR-${String(max + 1).padStart(4, '0')}`;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: createSampleUsers(),

      addUser: (input) =>
        set((state) => ({
          users: [...state.users, { ...input, id: nextId(state.users), joinedAt: today() }],
        })),
 
      updateUser: (id, input) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...input } : u)),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
    }),
    // 브라우저 localStorage에 저장 → 새로고침해도 유지됨
    { name: 'admin-users' },
  ),
);

/* ---------- 샘플 데이터 (25명) ----------
 * 처음 실행할 때만 들어감. 지우려면 개발자도구 > Application > Local Storage에서
 * 'admin-users' 항목을 삭제하고, 위의 createSampleUsers()를 [] 로 바꾸면 됨.
 */
function createSampleUsers(): User[] {
  const names = [
    '김민수', '이서연', '박지훈', '최유나', '정현우', '강하은', '조민재', '윤서아', '장도윤',
    '임지민', '한예준', '오수빈', '서지호', '신채원', '권우진', '황다은', '안시우', '송하린',
    '전준서', '홍지아', '유건우', '고은채', '문태윤', '양소율', '배주원',
  ];
  return names.map((name, i): User => {
    const month = String((i % 10) + 1).padStart(2, '0');
    const day = String(((i * 7) % 27) + 1).padStart(2, '0');
    return {
      id: `USR-${String(i + 1).padStart(4, '0')}`,
      name,
      email: `user${String(i + 1).padStart(2, '0')}@example.com`,
      joinedAt: `2026-${month}-${day}`,
      status: i % 4 === 3 ? 'inactive' : 'active',
      role: i % 6 === 0 ? 'admin' : 'user',
    };
  });
}
