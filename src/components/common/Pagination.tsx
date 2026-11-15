interface Props {
  page: number; // 현재 페이지 (1부터)
  totalPages: number;
  onChange: (page: number) => void;
}

/** 공통 페이지 이동 버튼: 이전 / 1 2 3 / 다음 */
export default function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="pagination">
      <button className="btn-sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`btn-sm ${n === page ? 'active' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button className="btn-sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        다음
      </button>
    </div>
  );
}
