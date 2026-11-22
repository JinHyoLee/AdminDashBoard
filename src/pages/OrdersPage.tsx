import { useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import OrderDetail from './OrderDetail';
import { useOrderStore } from '../stores/orderStore';
import { STATUS_FLOW, STATUS_LABEL, orderTotal, type OrderStatus } from '../types/order';
import { won } from '../utils/format';

const PAGE_SIZE = 10;

type SortKey = 'id' | 'createdAt' | 'total';

export default function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);

  // 화면 상태 (이 페이지 안에서만 사용)
  const [tab, setTab] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false); // 기본: 최근 주문순
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null); // 상세로 볼 주문

  // 탭별 건수 (검색과 상관없이 전체 기준)
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const s of STATUS_FLOW) c[s] = orders.filter((o) => o.status === s).length;
    return c;
  }, [orders]);

  // 1) 상태 탭 + 검색 → 2) 정렬
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = orders.filter(
      (o) =>
        (tab === 'all' || o.status === tab) &&
        (o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)),
    );
    result.sort((a, b) => {
      const cmp =
        sortKey === 'total' ? orderTotal(a) - orderTotal(b) : a[sortKey].localeCompare(b[sortKey]);
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [orders, tab, search, sortKey, sortAsc]);

  // 3) 페이징
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // 주문을 고르면 목록 대신 상세 화면을 보여줌 (목록의 검색·탭·페이지 상태는 그대로 유지)
  if (selectedId) {
    return <OrderDetail orderId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(key !== 'createdAt'); // 주문일은 최근순부터
    }
  }

  const sortMark = (key: SortKey) =>
    sortKey === key && <span className="sort-mark">{sortAsc ? ' ▲' : ' ▼'}</span>;

  return (
    <section>
      <PageHeader title="Orders" />

      <div className="tabs">
        {(['all', ...STATUS_FLOW] as const).map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
          >
            {t === 'all' ? '전체' : STATUS_LABEL[t]} <span className="tab-count">{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="주문번호, 고객명 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <span className="muted toolbar-count">총 {filtered.length}건</span>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('id')}>주문번호{sortMark('id')}</th>
              <th>고객명</th>
              <th className="sortable" onClick={() => handleSort('createdAt')}>주문일{sortMark('createdAt')}</th>
              <th className="sortable num" onClick={() => handleSort('total')}>결제금액{sortMark('total')}</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((o) => (
              <tr key={o.id} className="clickable" onClick={() => setSelectedId(o.id)}>
                <td>{o.id}</td>
                <td>{o.customerName}</td>
                <td className="muted-cell">{o.createdAt}</td>
                <td className="num">{won(orderTotal(o))}</td>
                <td>
                  <span className={`badge status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">조건에 맞는 주문이 없어요.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
    </section>
  );
}
