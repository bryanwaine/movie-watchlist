const searchBtn = document.getElementById("search-button");
const searchInputEl = document.getElementById("search");
const movieListEl = document.getElementById("movies-container");
const paginationEl = document.getElementById("pagination");
const currentPageEl = document.getElementById("current-page");
const totalResultsEl = document.getElementById("total-results");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const watchlistBtn = document.getElementById("watchlist-btn");

let watchlist;

window.addEventListener("load", () => {
  searchInputEl.value = "";
});

searchBtn.addEventListener("click", () => {
  getMovie();
});

prevBtn.addEventListener("click", () => {
  const prevPage = Number(currentPageEl.textContent) - 1;
  getMovie(prevPage);
});

nextBtn.addEventListener("click", () => {
  const nextPage = Number(currentPageEl.textContent) + 1;
  getMovie(nextPage);
});

function addedToWatchlistCheck(id) {
  watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const matchingMovie = watchlist.find((movie) => movie.imdbID === id);
  return !matchingMovie
    ? `<span>
        <img src="images/add-icon.png" alt="add icon" />
        Watchlist
      </span>`
    : `<span class="added-to-watchlist" disabled>
      Added to Watchlist
    </span>`;
}

async function getMovie(page = 1) {
  try {
    if (searchInputEl.value === "") {
      return;
    }
    page === 1 ? (prevBtn.disabled = true) : (prevBtn.disabled = false);

    const searchTerm = searchInputEl.value.trim().replaceAll(" ", "+");
    const response = await fetch(
      `https://www.omdbapi.com/?s=${searchTerm}&apikey=22a26b42&page=${page}`
    );
    const data = await response.json();

    if (!data.Search) {
      movieListEl.innerHTML = `
      <div class="placeholder" id="placeholder">
      <p>Unable to find what you’re looking for. Please try another search.</p>
      </div>`;
      paginationEl.style.display = "none";
      return;
    }
    document.getElementById('search-results').textContent = `${data.totalResults} results found for "${searchTerm.replaceAll("+", " ")}"`;
    if (data.totalResults > 10) {
      paginationEl.style.display = "flex";
      currentPageEl.textContent = page;
      totalResultsEl.textContent = ` of ${Math.ceil(data.totalResults / 10)}`;
    }
      
    page * 10 === data.totalResults ||
    (page * 10 - data.totalResults < 10 && page * 10 - data.totalResults > 0)
      ? (nextBtn.disabled = true)
      : (nextBtn.disabled = false);

    movieListEl.innerHTML = "";
    data.Search.forEach((movie) => {
      fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=22a26b42`)
        .then((response) => response.json())
        .then((data) => {
          const { Poster, Title, imdbID, imdbRating, Runtime, Genre, Plot } =
            data;

          addedToWatchlistCheck(imdbID);

            movieListEl.innerHTML += `
                          <div class="movie">
                                      <img class="movie-img" src=${Poster} alt=${Title} />
                                      <div class="movie-info">
                                        <div class="top-info">
                                          <h2 id="movie-title">${Title}</h2>
                                          <div class="rating">
                                            <img src="images/star-icon.png" alt="star icon" id="movie-rating"/>
                                            <p>${imdbRating}</p>
                                          </div>
                                        </div>
                                        <div class="mid-info">
                                          <p class="movie-runtime" id="movie-runtime">${Runtime}</p>
                                          <p class="movie-genre">${Genre}</p>
                                          <button id="watchlist-btn" class="watchlist-btn"
                                            data-movie-id="${imdbID}">
                                            ${addedToWatchlistCheck(imdbID)}
                                          </button>
                                        </div>
                                        <div class="bottom-info">
                                          <p id="movie-plot">${Plot}</p>
                                        </div>
                                      </div>
                                    </div>
                                    `;

          document.querySelectorAll(".watchlist-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
              const movieId = btn.dataset.movieId;
              fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=22a26b42`)
                .then((response) => response.json())
                .then((data) => {
                  const {
                    Poster,
                    Title,
                    imdbID,
                    imdbRating,
                    Runtime,
                    Genre,
                    Plot,
                  } = data;
                  const movie = {
                    Poster,
                    Title,
                    imdbID,
                    imdbRating,
                    Runtime,
                    Genre,
                    Plot,
                  };
                  watchlist =
                    JSON.parse(localStorage.getItem("watchlist")) || [];
                  watchlist.push(movie);
                  localStorage.setItem(`watchlist`, JSON.stringify(watchlist));
                  btn.textContent = "Added to Watchlist";
                  btn.classList.add("added-to-watchlist");
                });
            });
          });
        });
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
