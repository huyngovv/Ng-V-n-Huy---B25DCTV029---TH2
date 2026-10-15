export default function GenreFilter({ genres, selected, onSelect }) {
  return (
    <div className="genres">
      <button className={selected === "" ? "on" : ""} onClick={() => onSelect("")}>Tất cả</button>
      {genres.map((g) => (
        <button key={g} className={selected === g ? "on" : ""} onClick={() => onSelect(g)}>{g}</button>
      ))}
    </div>
  );
}
