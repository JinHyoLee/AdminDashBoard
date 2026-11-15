import { useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import ProductFormModal from './ProductFormModal';
import { useProductStore } from '../stores/productStore';
import { CATEGORIES, isSoldOut, type Product } from '../types/product';

const PAGE_SIZE = 10;

type SortKey = 'name' | 'category' | 'price' | 'stock';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: '상품' },
  { key: 'category', label: '카테고리' },
  { key: 'price', label: '가격' },
  { key: 'stock', label: '재고' },
];

/** 89000 → ₩89,000 */
const won = (n: number) => `₩${n.toLocaleString('ko-KR')}`;

/** 이미지가 있으면 썸네일, 없으면 기본 아이콘 */
function Thumb({ src, size = 'sm' }: { src: string | null; size?: 'sm' | 'lg' }) {
  return (
    <div className={`thumb thumb-${size}`}>
      {src ? <img src={src} alt="" /> : <span className="thumb-empty">🖼</span>}
    </div>
  );
}

function StatusBadge({ product }: { product: Product }) {
  return isSoldOut(product) ? (
    <span className="badge badge-danger">품절</span>
  ) : (
    <span className="badge badge-success">판매 중</span>
  );
}

export default function ProductsPage() {
  const { products, deleteProduct } = useProductStore();

  // 화면 상태 (이 페이지 안에서만 사용)
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(''); // '' = 전체
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);

  // 1) 검색 + 카테고리 필터 → 2) 정렬
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = products.filter(
      (p) => p.name.toLowerCase().includes(q) && (category === '' || p.category === category),
    );
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      // 가격·재고는 숫자로, 나머지는 글자로 비교
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), 'ko');
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [products, search, category, sortKey, sortAsc]);

  // 3) 페이징
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

  function handleDelete(product: Product) {
    if (window.confirm(`'${product.name}' 상품을 삭제할까요?`)) deleteProduct(product.id);
  }

  return (
    <section>
      <PageHeader
        title="Products"
        actions={
          <button className="btn-primary" onClick={() => setEditing('new')}>
            + 상품 등록
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="input"
          placeholder="상품명 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="input select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">전체 카테고리</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <span className="muted toolbar-count">총 {filtered.length}개</span>
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
              <th>상태</th>
              <th className="col-actions">관리</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="product-cell">
                    <Thumb src={p.image} />
                    {p.name}
                  </div>
                </td>
                <td className="muted-cell">{p.category}</td>
                <td>{won(p.price)}</td>
                <td>{p.stock.toLocaleString('ko-KR')}</td>
                <td>
                  <StatusBadge product={p} />
                </td>
                <td className="col-actions">
                  <button className="btn-sm" onClick={() => setViewing(p)}>상세</button>
                  <button className="btn-sm" onClick={() => setEditing(p)}>수정</button>
                  <button className="btn-sm danger" onClick={() => handleDelete(p)}>삭제</button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  {search || category ? '조건에 맞는 상품이 없어요.' : '등록된 상품이 없어요.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />

      {/* 등록·수정 모달 */}
      {editing && (
        <ProductFormModal
          product={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {/* 상세 모달 */}
      {viewing && (
        <Modal title="상품 상세" onClose={() => setViewing(null)}>
          <Thumb src={viewing.image} size="lg" />
          <dl className="detail">
            <dt>ID</dt><dd>{viewing.id}</dd>
            <dt>상품명</dt><dd>{viewing.name}</dd>
            <dt>카테고리</dt><dd>{viewing.category}</dd>
            <dt>가격</dt><dd>{won(viewing.price)}</dd>
            <dt>재고</dt><dd>{viewing.stock.toLocaleString('ko-KR')}</dd>
            <dt>상태</dt><dd><StatusBadge product={viewing} /></dd>
          </dl>
        </Modal>
      )}
    </section>
  );
}
