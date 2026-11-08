import type { ReactNode } from 'react';

interface Props {
  title: string;
  /** 제목 오른쪽 영역 (추가 버튼 등) */
  actions?: ReactNode;
}

export default function PageHeader({ title, actions }: Props) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
