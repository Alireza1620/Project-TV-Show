function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  setupEpisodeSelector(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Clear previous content
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
  `;

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(
      episode.season,
      episode.number
    )}`;
    episodeCard.appendChild(title);

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `${episode.name} image`;
    episodeCard.appendChild(image);

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary; // Use innerHTML to retain formatting
    episodeCard.appendChild(summary);

    episodesContainer.appendChild(episodeCard);
  });

  rootElem.appendChild(episodesContainer);

  // Populate dropdown and results count
  populateEpisodeSelector(episodeList);
  updateSearchResultCount(episodeList.length, episodeList.length);
}

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

function setupSearch(allEpisodes) {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  const searchEpisodes = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });

    makePageForEpisodes(filteredEpisodes);
    updateSearchResultCount(filteredEpisodes.length, allEpisodes.length);
  };

  searchButton.addEventListener("click", searchEpisodes);
}

function setupEpisodeSelector(allEpisodes) {
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
    resetButton.style.display = "inline";
  });

  resetButton.addEventListener("click", () => {
    makePageForEpisodes(allEpisodes);
    resetButton.style.display = "none";
  });
}

function populateEpisodeSelector(episodeList) {
  const episodeSelect = document.getElementById("episode-select");
  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

function updateSearchResultCount(matchCount, totalEpisodes) {
  const resultCountElem = document.getElementById("search-result-count");
  resultCountElem.textContent = `Displaying ${matchCount} out of ${totalEpisodes} episode(s)`;
}

window.onload = setup;
