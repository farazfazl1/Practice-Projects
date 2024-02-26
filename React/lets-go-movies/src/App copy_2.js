import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
const KEY = "16fd33cc";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// =================================================================================
// =============================================
// Structural Components (Only responsibole for layout of the applicaiton)
// =============================================

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

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

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  // Custome hook destructring the values that we need for the Return
  const { movies, isLoading, error } = useMovies(query);

  // let tempQuery = "hobbit";

  // [] as the dependency value will make useEffect to run only run once when App Component re renders

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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
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
  // Provide a fallback value (e.g., 0) if imdbRating or userRating is null/undefined
  const formattedImdbRating = movie.imdbRating?.toFixed(2) ?? "N/A";
  const formattedUserRating = movie.userRating?.toFixed(2) ?? "N/A";

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
          <span>{formattedImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{formattedUserRating}</span>
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
  const inputEl = useRef(null);

  useEffect(() => {
    console.log(inputEl.current);

    function callback(e) {
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus(); //allows focusing on the search as soon as we load the application for better user experience
        setQuery("");
      }
    }

    document.addEventListener("keydown", callback);
    return () => document.addEventListener("keydown", callback);
  }, [setQuery]);

  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
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
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID} // Ensure the key prop is here
          handleSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}

function MovieDetail({ selectedMovieId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
    console.log(countRef.current);
  }, [userRating]);

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
      countRatingDecisions: countRef.current,
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
