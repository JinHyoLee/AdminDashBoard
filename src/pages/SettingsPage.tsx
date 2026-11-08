import PageHeader from '../components/common/PageHeader';
import Placeholder from '../components/common/Placeholder';

const SECTIONS = [
  { title: '관리자 프로필', desc: '프로필 사진, 이름, 이메일' },
  { title: '회사 정보', desc: '회사명, 로고, 소개, 연락처' },
  { title: '알림 설정', desc: '신규 주문, 신규 가입, 재고 부족 알림' },
  { title: '비밀번호 변경', desc: '현재 비밀번호, 새 비밀번호, 확인' },
];

export default function SettingsPage() {
  return (
    <section>
      <PageHeader title="Settings" />

      {SECTIONS.map((s) => (
        <div key={s.title} className="settings-row">
          <div>
            <h2>{s.title}</h2>
            <p className="muted">{s.desc}</p>
          </div>
          <Placeholder label={`${s.title} 폼`} height={100} />
        </div>
      ))}
    </section>
  );
}
