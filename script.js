let allShows = [];
let cachedEpisodes = new Map();
let currentShowEpisodes = [];

/**
 * Fetch all shows and cache them.
 */
function fetchShows() {
  return fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch shows.");
      }
      return response.json();
    })
    .catch((error) => {
      showError(error);
      throw error;
    });
}

/**
 * Fetch episodes for a specific show by ID.
 */
function fetchEpisodesForShow(showId) {
  if (cachedEpisodes.has(showId)) {
    return Promise.resolve(cachedEpisodes.get(showId));
  }
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch episodes for show ID: ${showId}`);
      }
      return response.json();
    })
    .then((episodes) => {
      cachedEpisodes.set(showId, episodes);
      return episodes;
    })
    .catch((error) => {
      showError(error);
      throw error;
    });
}

/**
 * Show an error message.
 */
function showError(error) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
    <div>
      <p>There was an error loading data. Please try again later.</p>
      <p>Error details: ${error.message}</p>
    </div>
  `;
}

/**
 * Populate the search bar.
 */
function setupSearchBar() {
  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredShows = allShows.filter((show) =>
      show.name.toLowerCase().includes(searchTerm)
    );
    renderShowBanners(filteredShows);
  });
}

/**
 * Render show banners on the page.
 */
function renderShowBanners(shows) {
  const bannerContainer = document.querySelector(".banner-container");
  bannerContainer.innerHTML = "";

  shows.forEach((show) => {
    const banner = document.createElement("div");
    banner.className = "show-banner";

    const title = document.createElement("h2");
    title.textContent = show.name;
    banner.appendChild(title);

    if (show.image && show.image.medium) {
      const image = document.createElement("img");
      image.src = show.image.medium;
      image.alt = `${show.name} image`;
      banner.appendChild(image);
    }

    const button = document.createElement("button");
    button.textContent = "View Episodes";
    button.addEventListener("click", () => {
      loadEpisodesForShow(show.id);
    });
    banner.appendChild(button);

    bannerContainer.appendChild(banner);
  });
}

/**
 * Load episodes for a specific show.
 */
function loadEpisodesForShow(showId) {
  fetchEpisodesForShow(showId).then((episodes) => {
    currentShowEpisodes = episodes;
    populateEpisodeSelector(episodes);
    makePageForEpisodes(episodes);

    // Hide the show banners and show the episode selector
    document.querySelector(".banner-container").style.display = "none";
    document.getElementById("show-selector").style.display = "none";
    document.getElementById("episode-select").style.display = "inline-block";
    document.getElementById("reset-button").style.display = "inline-block";
  });
}

/**
 * Populate the episode dropdown.
 */
function populateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-select");
  episodeSelector.innerHTML = '<option value="">Select an episode...</option>';
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  episodeSelector.addEventListener("change", (event) => {
    const [season, number] = event.target.value.split("-");
    const selectedEpisode = currentShowEpisodes.find(
      (episode) => episode.season == season && episode.number == number
    );
    if (selectedEpisode) {
      makePageForEpisodes([selectedEpisode]);
    }
  });
}

/**
 * Format the episode code.
 */
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

/**
 * Create episode cards.
 */
function makePageForEpisodes(episodeList) {
  const episodesContainer = document.querySelector(".episodes-container");
  episodesContainer.innerHTML = "";
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
    episodeCard.appendChild(title);

    const image = document.createElement("img");
    image.src = episode.image ? episode.image.medium : "";
    image.alt = `${episode.name} image`;
    episodeCard.appendChild(image);

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    episodeCard.appendChild(summary);

    episodesContainer.appendChild(episodeCard);
  });
}

/**
 * Reset the application state.
 */
function resetApp() {
  const showSelector = document.getElementById("show-selector");
  const episodeSelector = document.getElementById("episode-select");
  const resetButton = document.getElementById("reset-button");

  // Show the banners and hide episode selector
  document.querySelector(".banner-container").style.display = "flex";
  showSelector.style.display = "inline-block";
  episodeSelector.style.display = "none";
  resetButton.style.display = "none";

  // Clear episodes container
  const episodesContainer = document.querySelector(".episodes-container");
  episodesContainer.innerHTML = "";

  // Re-render all shows
  renderShowBanners(allShows);
}

/**
 * Initialize the application.
 */
function setup() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
    <div id="controls">
      <input id="search-bar" type="text" placeholder="Search shows..." />
      <select id="show-selector" style="display: none;"></select>
      <select id="episode-select" style="display: none;"></select>
      <button id="reset-button" style="display: none;">Reset</button>
    </div>
    <div class="banner-container"></div>
    <div class="episodes-container"></div>
  `;

  // Attach reset button event listener
  document.getElementById("reset-button").addEventListener("click", resetApp);

  // Fetch shows and setup the app
  fetchShows()
    .then((shows) => {
      allShows = shows;
      renderShowBanners(allShows);
      setupSearchBar();
    })
    .catch(showError);
}

// Initialize the app on window load
window.onload = setup;
