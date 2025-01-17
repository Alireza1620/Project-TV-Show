function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
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

  // Update the results count
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

function updateSearchResultCount(matchCount, totalEpisodes) {
  const resultCountElem = document.getElementById("search-result-count");
  resultCountElem.textContent = `Displaying ${matchCount} out of ${totalEpisodes} episode(s)`;
}

window.onload = setup;
