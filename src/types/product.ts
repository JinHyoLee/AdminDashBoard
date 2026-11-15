export const CATEGORIES = ['전자제품', '의류', '식품', '생활용품', '도서'] as const;
export type Category = (typeof CATEGORIES)[number];

/** 상품 하나의 데이터 */
export interface Product {
  id: string; // 예: PRD-0001 (자동 생성)
  name: string;
  category: Category;
  price: number; // 원 단위
  stock: number;
  image: string | null; // 줄인 이미지(data URL). 없으면 null
}

/** 등록·수정 폼에서 입력받는 값 (id는 자동이라 제외) */
export type ProductInput = Omit<Product, 'id'>;

/** 상태는 저장하지 않고 재고로 계산함: 재고 0 → 품절 */
export const isSoldOut = (p: Product) => p.stock === 0;
