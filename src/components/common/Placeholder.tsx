interface Props {
  label: string;
  height?: number;
}

/** 아직 구현되지 않은 영역을 표시하는 자리 표시자 */
export default function Placeholder({ label, height = 120 }: Props) {
  return (
    <div className="placeholder" style={{ height }}>
      {label}
    </div>
  );
}
