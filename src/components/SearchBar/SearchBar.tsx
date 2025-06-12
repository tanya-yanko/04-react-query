import css from "./SearchBar.module.css";
import toast, { Toaster } from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    if (formData.get("query") === "") {
      notifyError();
      return;
    }
    const query = formData.get("query") as string;
    onSubmit(query);
  };
  const notifyError = () =>
    toast.error("Please enter your search query.", {
      style: { background: "rgba(244, 129, 130, 0.8)" },
    });
  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form action={handleSubmit} className={css.form}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
          <Toaster />
        </form>
      </div>
    </header>
  );
}