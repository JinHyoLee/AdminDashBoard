import PageHeader from '../components/common/PageHeader';
import Placeholder from '../components/common/Placeholder';

const PERIODS = ['7일', '30일', '3개월', '올해'];

export default function StatisticsPage() {
  return (
    <section>
      <PageHeader
        title="Statistics"
        actions={
          <div className="tabs compact">
            {PERIODS.map((p, i) => (
              <button key={p} className={`tab ${i === 1 ? 'active' : ''}`}>
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="chart-grid">
        <Placeholder label="월별 매출 그래프" height={240} />
        <Placeholder label="사용자 증가 그래프" height={240} />
        <Placeholder label="상품별 판매량" height={240} />
        <Placeholder label="카테고리별 매출 비율" height={240} />
      </div>
    </section>
  );
}
