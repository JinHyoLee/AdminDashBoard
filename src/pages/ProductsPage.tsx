import PageHeader from '../components/common/PageHeader';
import Placeholder from '../components/common/Placeholder';

export default function ProductsPage() {
  return (
    <section>
      <PageHeader title="Products" actions={<button className="btn-primary">+ 상품 등록</button>} />

      <div className="toolbar">
        <input className="input" placeholder="상품명 검색" />
        <select className="input select" defaultValue="">
          <option value="">전체 카테고리</option>
        </select>
      </div>

      <Placeholder label="상품 목록 테이블 (이미지 · 상품명 · 카테고리 · 가격 · 재고 · 상태)" height={360} />
      <Placeholder label="페이지네이션" height={48} />
    </section>
  );
}
