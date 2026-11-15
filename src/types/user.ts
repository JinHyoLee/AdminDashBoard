export type UserStatus = 'active' | 'inactive';
export type UserRole = 'admin' | 'user';

/** 사용자 한 명의 데이터 */
export interface User {
  id: string; // 예: USR-0001 (자동 생성)
  name: string;
  email: string;
  joinedAt: string; // 가입일 YYYY-MM-DD (자동 입력)
  status: UserStatus;
  role: UserRole;
}

/** 추가·수정 폼에서 입력받는 값 (id, 가입일은 자동이라 제외) */
export type UserInput = Omit<User, 'id' | 'joinedAt'>;
