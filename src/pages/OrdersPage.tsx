import PageHeader from '../components/common/PageHeader';
import Placeholder from '../components/common/Placeholder';

const STATUS_TABS = ['전체', '대기', '결제', '배송', '완료'];

export default function OrdersPage() {
  return (
    <section>
      <PageHeader title="Orders" />

      <div className="tabs">
        {STATUS_TABS.map((t, i) => (
          <button key={t} className={`tab ${i === 0 ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input className="input" placeholder="주문번호, 고객명 검색" />
      </div>

      <Placeholder label="주문 목록 테이블 (주문번호 · 고객명 · 주문일 · 결제금액 · 상태)" height={360} />
      <Placeholder label="주문 상세 (행 클릭 시 이동, 상태 변경)" height={80} />
    </section>
  );
}
