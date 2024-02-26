import { useState, useEffect } from "react";
const KEY = "16fd33cc";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Funciton only be called if it exsits
    callback?.();
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);

        setError(""); //We Always reset error before fetching so if the data comes form the search query, Error resets and
        // And the data will show up if there's no error and we don't stay in the Error stage

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something went wrong with the fetching");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(data.Search);
        setError("");

        if (data.Search) {
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query, callback]);

  return { movies, isLoading, error };
}
