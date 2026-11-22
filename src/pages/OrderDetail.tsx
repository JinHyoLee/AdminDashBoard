import { useState } from 'react';
import { useOrderStore } from '../stores/orderStore';
import { useUserStore } from '../stores/userStore';
import { STATUS_FLOW, STATUS_LABEL, nextStatus, orderTotal } from '../types/order';
import { won } from '../utils/format';

interface Props {
  orderId: string;
  onBack: () => void;
}

/** 주문 상세: 고객 정보, 주문 상품, 진행 단계, 상태 변경 */
export default function OrderDetail({ orderId, onBack }: Props) {
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId));
  const advanceStatus = useOrderStore((s) => s.advanceStatus);
  const user = useUserStore((s) => s.users.find((u) => u.id === order?.userId));
  const [error, setError] = useState<string | null>(null);

  if (!order) {
    return (
      <section>
        <button className="btn-sm" onClick={onBack}>← 목록으로</button>
        <p className="empty">주문을 찾을 수 없어요.</p>
      </section>
    );
  }

  const next = nextStatus(order.status);
  const currentStep = STATUS_FLOW.indexOf(order.status);

  function handleAdvance() {
    if (!order || !next) return;
    const msg =
      `주문 상태를 '${STATUS_LABEL[next]}' 단계로 변경할까요?` +
      (next === 'paid' ? '\n결제 처리 시 주문 수량만큼 상품 재고가 차감돼요.' : '');
    if (!window.confirm(msg)) return;
    setError(advanceStatus(order.id)); // 실패하면 에러 문구, 성공하면 null
  }

  return (
    <section>
      <button className="btn-sm" onClick={onBack}>← 목록으로</button>

      <div className="page-header detail-header">
        <h1>주문 {order.id}</h1>
        <span className={`badge status-${order.status}`}>{STATUS_LABEL[order.status]}</span>
      </div>

      {/* 진행 단계 */}
      <div className="card">
        <ol className="stepper">
          {STATUS_FLOW.map((s, i) => (
            <li key={s} className={i <= currentStep ? 'done' : ''}>
              <span className="step-dot">{i < currentStep ? '✓' : i + 1}</span>
              {STATUS_LABEL[s]}
            </li>
          ))}
        </ol>
        <div className="stepper-actions">
          {next ? (
            <button className="btn-primary" onClick={handleAdvance}>
              다음 단계로: {STATUS_LABEL[next]}
            </button>
          ) : (
            <span className="muted">처리가 끝난 주문이에요.</span>
          )}
        </div>
        {error && <p className="error stepper-error">{error}</p>}
      </div>

      {/* 주문 · 고객 정보 */}
      <div className="card">
        <h2>주문 정보</h2>
        <dl className="detail">
          <dt>주문일</dt><dd>{order.createdAt}</dd>
          <dt>고객명</dt><dd>{order.customerName}</dd>
          <dt>고객 ID</dt><dd>{order.userId}</dd>
          <dt>이메일</dt><dd>{user ? user.email : <span className="muted">삭제된 사용자</span>}</dd>
        </dl>
      </div>

      {/* 주문 상품 */}
      <div className="card">
        <h2>주문 상품</h2>
        <table className="table">
          <thead>
            <tr>
              <th>상품</th>
              <th>단가</th>
              <th>수량</th>
              <th className="num">소계</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td className="muted-cell">{won(item.price)}</td>
                <td>{item.quantity}</td>
                <td className="num">{won(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>합계</td>
              <td className="num">{won(orderTotal(order))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
