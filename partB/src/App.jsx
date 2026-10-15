import { useEffect, useState } from "react";
import { books } from "./data.js";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import BookList from "./components/BookList.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [favorites, setFavorites] = useState([]); // mảng id
  const [genre, setGenre] = useState("");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const genres = [...new Set(books.map((b) => b.genre))];
  const shown = genre ? books.filter((b) => b.genre === genre) : books;

  function toggleFavorite(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <>
      <Header
        favoriteCount={favorites.length}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
      />
      <main className="wrap">
        <Section title="Thể loại">
          <GenreFilter genres={genres} selected={genre} onSelect={setGenre} />
        </Section>
        <Section title={`Đang hiển thị ${shown.length} / ${books.length} cuốn`}>
          <BookList books={shown} favorites={favorites} onToggleFavorite={toggleFavorite} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
