import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProductStore } from './productStore';
import { nextStatus, type Order, type OrderStatus } from '../types/order';

interface OrderState {
  orders: Order[];
  /**
   * 주문을 다음 단계로 바꿈 (대기 → 결제 → 배송 → 완료).
   * 성공하면 null, 바꿀 수 없으면 이유(에러 문구)를 돌려줌.
   */
  advanceStatus: (id: string) => string | null;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: createSampleOrders(),

      advanceStatus: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return '주문을 찾을 수 없어요.';

        const next = nextStatus(order.status);
        if (!next) return '이미 완료된 주문이에요.';

        // '결제'로 넘어갈 때만 재고를 확인하고 차감함
        if (next === 'paid') {
          const products = useProductStore.getState().products;
          const shortages: string[] = [];

          for (const item of order.items) {
            const product = products.find((p) => p.id === item.productId);
            // 이미 삭제된 상품은 재고를 확인할 수 없으므로 건너뜀
            if (product && product.stock < item.quantity) {
              shortages.push(`${item.productName} (필요 ${item.quantity}개, 재고 ${product.stock}개)`);
            }
          }
          if (shortages.length > 0) {
            return `재고가 부족해서 결제로 바꿀 수 없어요: ${shortages.join(', ')}`;
          }

          useProductStore.getState().decreaseStock(order.items);
        }

        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status: next } : o)),
        }));
        return null;
      },
    }),
    // 브라우저 localStorage에 저장 → 새로고침해도 유지됨
    { name: 'admin-orders' },
  ),
);

/* ---------- 샘플 데이터 (15건) ----------
 * 샘플 사용자·상품을 이용해 1월~11월에 걸쳐 만듦.
 * 14번 주문은 품절 상품(니트 스웨터)이 들어 있어서 '결제'로 넘어가지 않음 → 재고 부족 처리 확인용.
 * 다시 넣으려면 Local Storage의 'admin-orders'를 삭제.
 */
function createSampleOrders(): Order[] {
  // [상품 id, 상품명, 단가]
  const P = {
    earphone: ['PRD-0001', '무선 이어폰', 89000],
    watch: ['PRD-0002', '스마트 워치', 210000],
    keyboard: ['PRD-0004', '기계식 키보드', 129000],
    sweater: ['PRD-0005', '니트 스웨터', 45000],
    denim: ['PRD-0006', '데님 자켓', 79000],
    tshirt: ['PRD-0007', '기본 티셔츠', 15000],
    coffee: ['PRD-0008', '유기농 원두 1kg', 32000],
    granola: ['PRD-0009', '수제 그래놀라', 12000],
    blanket: ['PRD-0011', '극세사 이불', 69000],
    tumbler: ['PRD-0012', '스테인리스 텀블러', 18000],
    diffuser: ['PRD-0013', '디퓨저 세트', 25000],
    reactBook: ['PRD-0014', '리액트 실전 가이드', 32000],
    tsBook: ['PRD-0015', '타입스크립트 입문', 27000],
  } as const;
  type Key = keyof typeof P;

  // [주문일, 사용자 id, 고객명, [[상품, 수량], ...], 상태]
  const rows: [string, string, string, [Key, number][], OrderStatus][] = [
    ['2026-01-14', 'USR-0001', '김민수', [['earphone', 1]], 'done'],
    ['2026-02-03', 'USR-0002', '이서연', [['tshirt', 3], ['tumbler', 1]], 'done'],
    ['2026-03-19', 'USR-0003', '박지훈', [['keyboard', 1]], 'done'],
    ['2026-04-08', 'USR-0004', '최유나', [['watch', 1]], 'done'],
    ['2026-05-22', 'USR-0005', '정현우', [['coffee', 2], ['granola', 2]], 'done'],
    ['2026-06-11', 'USR-0006', '강하은', [['denim', 1]], 'done'],
    ['2026-07-02', 'USR-0007', '조민재', [['reactBook', 1], ['tsBook', 1]], 'done'],
    ['2026-08-17', 'USR-0008', '윤서아', [['blanket', 1]], 'done'],
    ['2026-09-05', 'USR-0009', '장도윤', [['earphone', 2]], 'shipping'],
    ['2026-10-13', 'USR-0010', '임지민', [['diffuser', 2]], 'shipping'],
    ['2026-11-03', 'USR-0011', '한예준', [['keyboard', 1], ['tumbler', 2]], 'paid'],
    ['2026-11-09', 'USR-0012', '오수빈', [['coffee', 1]], 'paid'],
    ['2026-11-12', 'USR-0013', '서지호', [['watch', 1]], 'pending'],
    ['2026-11-14', 'USR-0014', '신채원', [['sweater', 1]], 'pending'],
    ['2026-11-15', 'USR-0015', '권우진', [['tshirt', 2], ['granola', 1]], 'pending'],
  ];

  return rows.map(([createdAt, userId, customerName, items, status], i) => ({
    id: `ORD-${String(i + 1).padStart(4, '0')}`,
    userId,
    customerName,
    createdAt,
    status,
    items: items.map(([key, quantity]) => {
      const [productId, productName, price] = P[key];
      return { productId, productName, price, quantity };
    }),
  }));
}
