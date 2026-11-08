import PageHeader from '../components/common/PageHeader';
import Placeholder from '../components/common/Placeholder';

const STATS = ['Users', 'Orders', 'Revenue', 'Products'];

export default function DashboardPage() {
  return (
    <section>
      <PageHeader title="Dashboard" />

      <div className="stat-grid">
        {STATS.map((label) => (
          <div key={label} className="stat-card">
            <p className="stat-label">{label}</p>
            <p className="stat-value">-</p>
          </div>
        ))}
      </div>

      <Placeholder label="월별 매출 차트" height={220} />
      <Placeholder label="최근 주문 테이블" height={180} />
    </section>
  );
}
