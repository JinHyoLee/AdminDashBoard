import { useState, type FormEvent } from 'react';
import Modal from '../components/common/Modal';
import { useUserStore } from '../stores/userStore';
import type { User, UserInput } from '../types/user';

interface Props {
  /** 수정할 사용자. 없으면 '추가' 모드 */
  user?: User;
  onClose: () => void;
}

type Errors = Partial<Record<'name' | 'email', string>>;

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserFormModal({ user, onClose }: Props) {
  const { users, addUser, updateUser } = useUserStore();
  const isEdit = Boolean(user);

  // 수정 모드면 기존 값, 추가 모드면 기본값으로 시작
  const [form, setForm] = useState<UserInput>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    status: user?.status ?? 'active',
    role: user?.role ?? 'user',
  });
  const [errors, setErrors] = useState<Errors>({});

  /** 입력값 하나 바꾸기 + 그 칸의 에러 지우기 */
  function change<K extends keyof UserInput>(key: K, value: UserInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    const email = form.email.trim().toLowerCase();

    if (!form.name.trim()) e.name = '이름을 입력해 주세요.';

    if (!email) e.email = '이메일을 입력해 주세요.';
    else if (!EMAIL_RULE.test(email)) e.email = '이메일 형식이 올바르지 않아요.';
    // 중복 검사: 수정 중일 때는 자기 자신은 제외
    else if (users.some((u) => u.email.toLowerCase() === email && u.id !== user?.id))
      e.email = '이미 사용 중인 이메일이에요.';

    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // 에러가 있으면 저장 안 함

    const input = { ...form, name: form.name.trim(), email: form.email.trim() };
    if (user) updateUser(user.id, input);
    else addUser(input);
    onClose();
  }

  return (
    <Modal title={isEdit ? '사용자 수정' : '사용자 추가'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>이름</span>
          <input
            className={`input ${errors.name ? 'invalid' : ''}`}
            value={form.name}
            onChange={(e) => change('name', e.target.value)}
            placeholder="홍길동"
            autoFocus
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>

        <label className="field">
          <span>이메일</span>
          <input
            className={`input ${errors.email ? 'invalid' : ''}`}
            value={form.email}
            onChange={(e) => change('email', e.target.value)}
            placeholder="name@example.com"
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </label>

        <div className="field-row">
          <label className="field">
            <span>상태</span>
            <select
              className="input"
              value={form.status}
              onChange={(e) => change('status', e.target.value as UserInput['status'])}
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </label>

          <label className="field">
            <span>권한</span>
            <select
              className="input"
              value={form.role}
              onChange={(e) => change('role', e.target.value as UserInput['role'])}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="btn-primary">
            {isEdit ? '저장' : '추가'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
