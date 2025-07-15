const moviesWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

renderWatchlist(moviesWatchlist);

function renderWatchlist(watchlist) {
  const moviesContainer = document.getElementById("movies-container");
  if (watchlist.length === 0) {
    moviesContainer.innerHTML = `<div class="placeholder" id="placeholder">
      <p>Your watchlist is looking a little empty...</p>
      <a href="index.html"><span>
          <img src="images/add-icon.png" alt="add icon">
      </span>Let's add some movies!</a>
  </div>`;
    return;
  }
  let innerHTML = "";
  watchlist.forEach(
    ({ Poster, Title, imdbID, imdbRating, Runtime, Genre, Plot }) => {
      innerHTML += `<div class="movie" id="movie-${imdbID}">
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
            <button id="remove-btn-${imdbID}" class="remove-btn"
              data-movie-id="${imdbID}">
              <span data-movie-id="${imdbID}">
                <img src="images/remove-icon.png" alt="remove icon" data-movie-id="${imdbID}"/>
                Remove
                </span>
            </button>
          </div>
          <div class="bottom-info">
            <p id="movie-plot">${Plot}</p>
          </div>
        </div>
      </div>
      `;
    }
  );

  moviesContainer.innerHTML = innerHTML;
}

document.querySelectorAll(".remove-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const imdbID = btn.dataset.movieId;
    console.log(imdbID);

    const updatedWatchlist = moviesWatchlist.filter(
      (movie) => movie.imdbID !== imdbID
    );
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    renderWatchlist(updatedWatchlist);
    window.location.reload();
  });
});

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('fade-in')
      observer.unobserve(entry.target)
    } 
  })
}

const options = {
  threshold: 0.2
}

const observer = new IntersectionObserver(callback, options)

const animatedElements = document.querySelectorAll('.content')
animatedElements.forEach(el => observer.observe(el))