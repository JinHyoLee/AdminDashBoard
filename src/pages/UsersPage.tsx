import { useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import UserFormModal from './UserFormModal';
import { useUserStore } from '../stores/userStore';
import type { User } from '../types/user';

const PAGE_SIZE = 10;

type SortKey = 'name' | 'email' | 'joinedAt' | 'status' | 'role';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: '이름' },
  { key: 'email', label: '이메일' },
  { key: 'joinedAt', label: '가입일' },
  { key: 'status', label: '상태' },
  { key: 'role', label: '권한' },
];

export default function UsersPage() {
  const { users, deleteUser } = useUserStore();

  // 화면 상태 (스토어가 아니라 이 페이지 안에서만 사용)
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('joinedAt');
  const [sortAsc, setSortAsc] = useState(false); // 기본: 최근 가입순
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<User | 'new' | null>(null); // 폼 모달
  const [viewing, setViewing] = useState<User | null>(null); // 상세 모달

  // 1) 검색 → 2) 정렬
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
    result.sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey], 'ko');
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [users, search, sortKey, sortAsc]);

  // 3) 페이징 (삭제로 페이지가 줄어들면 마지막 페이지로 맞춤)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleDelete(user: User) {
    if (window.confirm(`'${user.name}' 사용자를 삭제할까요?`)) deleteUser(user.id);
  }

  return (
    <section>
      <PageHeader
        title="Users"
        actions={
          <button className="btn-primary" onClick={() => setEditing('new')}>
            + 사용자 추가
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="input"
          placeholder="이름, 이메일 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // 검색어가 바뀌면 1페이지로
          }}
        />
        <span className="muted toolbar-count">총 {filtered.length}명</span>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className="sortable" onClick={() => handleSort(c.key)}>
                  {c.label}
                  {sortKey === c.key && <span className="sort-mark">{sortAsc ? ' ▲' : ' ▼'}</span>}
                </th>
              ))}
              <th className="col-actions">관리</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td className="muted-cell">{u.email}</td>
                <td className="muted-cell">{u.joinedAt}</td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status === 'active' ? '활성' : '비활성'}
                  </span>
                </td>
                <td>{u.role === 'admin' ? 'Admin' : 'User'}</td>
                <td className="col-actions">
                  <button className="btn-sm" onClick={() => setViewing(u)}>상세</button>
                  <button className="btn-sm" onClick={() => setEditing(u)}>수정</button>
                  <button className="btn-sm danger" onClick={() => handleDelete(u)}>삭제</button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  {search ? '검색 결과가 없어요.' : '등록된 사용자가 없어요.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />

      {/* 추가·수정 모달 */}
      {editing && (
        <UserFormModal
          user={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {/* 상세 모달 */}
      {viewing && (
        <Modal title="사용자 상세" onClose={() => setViewing(null)}>
          <dl className="detail">
            <dt>ID</dt><dd>{viewing.id}</dd>
            <dt>이름</dt><dd>{viewing.name}</dd>
            <dt>이메일</dt><dd>{viewing.email}</dd>
            <dt>가입일</dt><dd>{viewing.joinedAt}</dd>
            <dt>상태</dt><dd>{viewing.status === 'active' ? '활성' : '비활성'}</dd>
            <dt>권한</dt><dd>{viewing.role === 'admin' ? 'Admin' : 'User'}</dd>
          </dl>
        </Modal>
      )}
    </section>
  );
}
