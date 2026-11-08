import PageHeader from '../components/common/PageHeader';
import Placeholder from '../components/common/Placeholder';

export default function UsersPage() {
  return (
    <section>
      <PageHeader title="Users" actions={<button className="btn-primary">+ 사용자 추가</button>} />

      <div className="toolbar">
        <input className="input" placeholder="이름, 이메일 검색" />
      </div>

      <Placeholder label="사용자 목록 테이블 (이름 · 이메일 · 가입일 · 상태 · 권한 · 관리)" height={360} />
      <Placeholder label="페이지네이션" height={48} />
    </section>
  );
}
