import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductInput } from '../types/product';

interface ProductState {
  products: Product[];
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
}

/** 기존 id 중 가장 큰 번호 + 1 → PRD-0016 같은 형식 */
function nextId(products: Product[]) {
  const max = products.reduce((m, p) => Math.max(m, Number(p.id.replace('PRD-', ''))), 0);
  return `PRD-${String(max + 1).padStart(4, '0')}`;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: createSampleProducts(),

      addProduct: (input) =>
        set((state) => ({
          products: [...state.products, { ...input, id: nextId(state.products) }],
        })),

      updateProduct: (id, input) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...input } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    // 브라우저 localStorage에 저장 → 새로고침해도 유지됨
    { name: 'admin-products' },
  ),
);

/* ---------- 샘플 데이터 (15개, 이미지 없음) ----------
 * 처음 실행할 때만 들어감. 다시 넣으려면 Local Storage의 'admin-products'를 삭제.
 */
function createSampleProducts(): Product[] {
  const rows: [string, Product['category'], number, number][] = [
    ['무선 이어폰', '전자제품', 89000, 120],
    ['스마트 워치', '전자제품', 210000, 35],
    ['블루투스 스피커', '전자제품', 59000, 0],
    ['기계식 키보드', '전자제품', 129000, 48],
    ['니트 스웨터', '의류', 45000, 0],
    ['데님 자켓', '의류', 79000, 22],
    ['기본 티셔츠', '의류', 15000, 300],
    ['유기농 원두 1kg', '식품', 32000, 64],
    ['수제 그래놀라', '식품', 12000, 150],
    ['제주 감귤 5kg', '식품', 28000, 0],
    ['극세사 이불', '생활용품', 69000, 17],
    ['스테인리스 텀블러', '생활용품', 18000, 210],
    ['디퓨저 세트', '생활용품', 25000, 9],
    ['리액트 실전 가이드', '도서', 32000, 40],
    ['타입스크립트 입문', '도서', 27000, 55],
  ];
  return rows.map(([name, category, price, stock], i) => ({
    id: `PRD-${String(i + 1).padStart(4, '0')}`,
    name,
    category,
    price,
    stock,
    image: null,
  }));
}
