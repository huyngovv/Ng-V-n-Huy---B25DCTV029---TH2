export default function Header({ favoriteCount, theme, onToggleTheme }) {
  return (
    <header><div className="wrap">
      <h1>Thư viện lớp</h1>
      <div className="header-actions">
        <span>♥ {favoriteCount} yêu thích</span>
        <button type="button" onClick={onToggleTheme} aria-pressed={theme === "dark"}>
          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        </button>
      </div>
    </div></header>
  );
}
