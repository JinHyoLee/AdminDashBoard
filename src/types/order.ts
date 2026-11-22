export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'done';

/** 상태 진행 순서: 앞으로만 한 단계씩 바뀜 */
export const STATUS_FLOW: OrderStatus[] = ['pending', 'paid', 'shipping', 'done'];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '대기',
  paid: '결제',
  shipping: '배송',
  done: '완료',
};

/**
 * 주문 상품 한 줄.
 * 상품명·단가는 주문 시점의 값을 복사해 둠 → 나중에 상품이 바뀌거나 삭제돼도 주문은 그대로
 */
export interface OrderItem {
  productId: string;
  productName: string;
  price: number; // 주문 당시 단가
  quantity: number;
}

/** 주문 한 건 */
export interface Order {
  id: string; // 예: ORD-0001
  userId: string;
  customerName: string; // 주문 당시 고객명 (복사본)
  items: OrderItem[];
  createdAt: string; // 주문일 YYYY-MM-DD
  status: OrderStatus;
}

/** 결제금액은 저장하지 않고 계산함: 단가 × 수량의 합 */
export const orderTotal = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

/** 다음 상태. 이미 '완료'면 null */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(status);
  return STATUS_FLOW[i + 1] ?? null;
}
