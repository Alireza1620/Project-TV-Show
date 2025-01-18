let allEpisodes = [];

// Fetch episodes from TVMaze API
function fetchEpisodes() {
  return fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      showError(error);
      throw error;
    });
}

// Show an error message if data fails to load
function showError(error) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
    <div>
      <p>There was an error loading the episodes. Please try again later.</p>
      <p>Error details: ${error.message}</p>
    </div>
  `;
}

function setup() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = '<p>Loading episodes...</p>';

  fetchEpisodes().then((episodes) => {
    allEpisodes = episodes;
    initializePage(allEpisodes);
  });
}

// Initialize the page
function initializePage(episodes) {
  createSearchUI();
  makePageForEpisodes(episodes);
  setupSearch();
  setupEpisodeSelector();
}

// Create the static search UI
function createSearchUI() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
    <div id="search-container">
      <input
        type="text"
        id="search-input"
        placeholder="Search episodes..."
        aria-label="Search episodes"
      />
      <button id="search-button">Search</button>
      <select id="episode-select">
        <option value="">Select an episode...</option>
      </select>
      <button id="reset-button" style="display: none;">Show All Episodes</button>
      <p id="search-result-count"></p>
    </div>
    <div id="episodes-container"></div>
  `;
}

/**
 * Function to create the page for episodes.
 * It takes an array of episode objects as input and creates the HTML elements for each episode.
 * 
 * @param {Array} episodeList - An array of episode objects.
 */
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Retain the search container and clear only the episodes container
  let episodesContainer = document.querySelector(".episodes-container");

  if (!episodesContainer) {
    episodesContainer = document.createElement("div");
    episodesContainer.className = "episodes-container";
    episodesContainer.style.display = "grid";
    episodesContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
    episodesContainer.style.gap = "16px";
    episodesContainer.style.marginTop = "20px";
    episodesContainer.style.padding = "10px";

    // Append the container to the root only if it doesn't already exist
    rootElem.appendChild(episodesContainer);
  }

  // Clear only the episodes content
  episodesContainer.innerHTML = "";

  // Create HTML elements for each episode
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
    episodeCard.appendChild(title);

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `${episode.name} image`;
    episodeCard.appendChild(image);

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;
    episodeCard.appendChild(summary);

    episodesContainer.appendChild(episodeCard);
  });

  // Update dropdown and search result count
  populateEpisodeSelector(allEpisodes);
  updateSearchResultCount(episodeList.length, allEpisodes.length);
}




/**
 * Function to format the episode code.
 * It takes the season and episode numbers as input and returns a formatted string.
 * 
 * @param {Number} season - The season number.
 * ```javascript
 * @param {Number} number - The episode number.
 * @returns {String} The formatted episode code.
 */
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const resetButton = document.getElementById("reset-button");

  const searchEpisodes = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );

    makePageForEpisodes(filteredEpisodes);
    resetButton.style.display = filteredEpisodes.length < allEpisodes.length ? "inline-block" : "none";
  };

  searchButton.addEventListener("click", searchEpisodes);

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    makePageForEpisodes(allEpisodes);
    resetButton.style.display = "none";
  });
}


/**
 * Function to set up episode selector.
 * It takes an array of episode objects as input and sets up the episode selector event listener.
 * 
 * @param {Array} allEpisodes - An array of episode objects.
 */
function setupEpisodeSelector() {
  const episodeSelect = document.getElementById("episode-select");
  const resetButton = document.getElementById("reset-button");

  episodeSelect.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "") {
      makePageForEpisodes(allEpisodes);
      resetButton.style.display = "none";
      return;
    }

    const [selectedSeason, selectedEpisode] = selectedValue.split("-").map(Number);
    const selectedEpisodeData = allEpisodes.find(
      (episode) =>
        episode.season === selectedSeason && episode.number === selectedEpisode
    );

    makePageForEpisodes([selectedEpisodeData]);
    resetButton.style.display = "inline-block";
  });
}

/**
 * Function to populate the episode selector dropdown.
 * It takes an array of episode objects as input and adds options to the dropdown.
 * 
 * @param {Array} episodeList - An array of episode objects.
 */
function populateEpisodeSelector(episodeList) {
  const episodeSelect = document.getElementById("episode-select");
  episodeSelect.innerHTML = '<option value="">Select an episode...</option>';

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

// Update the search result count
function updateSearchResultCount(matchCount, totalEpisodes) {
  const resultCountElem = document.getElementById("search-result-count");
  resultCountElem.textContent = `Displaying ${matchCount} out of ${totalEpisodes} episode(s)`;
}

// Initialize the app
window.onload = setup;
