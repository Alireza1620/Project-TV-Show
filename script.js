//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  // Create a container for all episodes
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  episodeList.forEach((episode) => {
    // Create a container for each episode
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Create and append episode title
    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
    episodeCard.appendChild(title);

    // Create and append episode image
    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `${episode.name} image`;
    episodeCard.appendChild(image);

    // Create and append episode summary
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary; // Use innerHTML to retain formatting
    episodeCard.appendChild(summary);

    // Append episode card to the container
    episodesContainer.appendChild(episodeCard);
  });

  // Append the container to the root element
  rootElem.appendChild(episodesContainer);
}

// Helper function to format episode code
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}


window.onload = setup;
