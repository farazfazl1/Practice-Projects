import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// =================================================================================
// =============================================
// Structural Components (Only responsibole for layout of the applicaiton)
// =============================================

const KEY = "16fd33cc";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedMovieId((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // let tempQuery = "hobbit";

  // [] as the dependency value will make useEffect to run only run once when App Component re renders
  useEffect(() => {
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
    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} /> {/* Component Composition */}
      </Navbar>

      {/* Component Composition {Children} */}
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedMovieId ? (
            <MovieDetail
              selectedMovieId={selectedMovieId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeletekWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>📛</span> {message}
    </p>
  );
}

// Navbar Component
function Navbar({ children }) {
  return (
    <>
      <nav className="nav-bar">{children}</nav>
    </>
  );
}

// Main Component
function Main({ children }) {
  return <main className="main">{children}</main>;
}
// =================================================================================

// =================================================================================
// =============================================
// Presentational Component (Stateless)
// =============================================

// Logo Component
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>LetsGoMovies</h1>
    </div>
  );
}

// NumResults Compononent
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// Movie Component
function Movie({ movie, handleSelectMovie }) {
  return (
    <>
      <li onClick={() => handleSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  );
}

// Watched Summary Componentk
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// WatchedMoviesList Component
function WatchedMoviesList({ watched, onDeletekWatchedMovie }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie
            movie={movie}
            key={movie.imdbID}
            onDeletekWatchedMovie={onDeletekWatchedMovie}
          />
        ))}
      </ul>
    </>
  );
}

// WatchedMovie Component
function WatchedMovie({ movie, onDeletekWatchedMovie }) {
  function onDeleteWatched() {
    onDeletekWatchedMovie(movie.imdbID);
  }

  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={onDeleteWatched}>
          X
        </button>
      </div>
    </li>
  );
}

// =================================================================================
// =============================================
// Stateful Component
// =============================================

// Search Componennt
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// ListBox Comopnent
function Box({ children }) {
  const [isOpen, setisOpen] = useState(true);

  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setisOpen((open) => !open)}
        >
          {isOpen ? "–" : "+"}
        </button>
        {isOpen && children}
      </div>
    </>
  );
}

//MovieList Component
function MovieList({ movies, handleSelectMovie }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <>
            <Movie
              key={movie.imdbID}
              movie={movie}
              handleSelectMovie={handleSelectMovie}
            />
          </>
        ))}
      </ul>
    </>
  );
}

function MovieDetail({ selectedMovieId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedMovieId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedMovieId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    function escKeydown(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }

    document.addEventListener("keydown", escKeydown);

    return function () {
      document.removeEventListener("keydown", escKeydown);
    };
  }, [onCloseMovie]);

  useEffect(
    function () {
      setIsLoading(true);
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`
        );

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedMovieId]
  );

  useEffect(() => {
    if (!title) return;
    document.title = title || "Movie"; // This will set a temporary title if 'title' is not yet defined

    return function () {
      document.title = "Lets Go Movies";
    };
  }, [title]);

  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            {/* <p>{avgRating}</p> */}

            <section>
              <>
                <div className="rating">
                  {!isWatched ? (
                    <>
                      <StarRating
                        maxRating={10}
                        size={24}
                        onSetRating={setUserRating}
                      />
                      {userRating ? (
                        <button className="btn-add" onClick={handleAdd}>
                          Add To List
                        </button>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <p>You have rated this movie at {watchedUserRating}⭐</p>
                  )}
                </div>
              </>

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}

// =================================================================================
