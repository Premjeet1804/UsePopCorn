import { useState, useEffect } from "react";
const KEY = "5679098f";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchmovies() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            ` http://www.omdbapi.com/?apikey=${KEY}&s=${query}
          `,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not Found");
          setMovies(data.Search);
          setError("");
          // console.log(data.Search);
        } catch (err) {
          console.log(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchmovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
