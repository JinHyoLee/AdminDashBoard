import { useNavStore, type PageKey } from '../../stores/navStore';

const MENUS: { key: PageKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'users', label: 'Users' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'statistics', label: 'Statistics' },
  { key: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const { current, setPage } = useNavStore();

  return (
    <nav className="sidebar">
      <p className="sidebar-title">메뉴</p>
      {MENUS.map((m) => (
        <button
          key={m.key}
          className={`nav-item ${current === m.key ? 'active' : ''}`}
          onClick={() => setPage(m.key)}
        >
          {m.label}
        </button>
      ))}
    </nav>
  );
}
