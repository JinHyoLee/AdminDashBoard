export default function Header() {
  return (
    <header className="header">
      <span className="logo">MY ADMIN</span>
      <div className="header-right">
        <button className="icon-btn" aria-label="알림">
          🔔
        </button>
        <span className="profile">Admin</span>
      </div>
    </header>
  );
}
