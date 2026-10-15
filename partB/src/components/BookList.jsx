import BookCard from "./BookCard.jsx";

export default function BookList({ books, favorites, onToggleFavorite }) {
  return (
    <ul className="grid">
      {books.map((b) => (
        <BookCard key={b.id} book={b} isFavorite={favorites.includes(b.id)} onToggleFavorite={onToggleFavorite} />
      ))}
    </ul>
  );
}
