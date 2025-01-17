/**
 * Setup function to initialize the application.
 * It retrieves all episodes, creates the page for episodes, sets up search functionality, and sets up episode selector.
 */
function setup() {
  // Retrieve all episodes
  const allEpisodes = getAllEpisodes();
  
  // Create the page for episodes
  makePageForEpisodes(allEpisodes);
  
  // Set up search functionality
  setupSearch(allEpisodes);
  
  // Set up episode selector
  setupEpisodeSelector(allEpisodes);
}

/**
 * Function to create the page for episodes.
 * It takes an array of episode objects as input and creates the HTML elements for each episode.
 * 
 * @param {Array} episodeList - An array of episode objects.
 */
function makePageForEpisodes(episodeList) {
  // Get the root element
  const rootElem = document.getElementById("root");
  
  // Create a container for episodes
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

  // Create HTML elements for each episode
  episodeList.forEach((episode) => {
    // Create a container for the episode card
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Create the title element
    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(
      episode.season,
      episode.number
    )}`;
    episodeCard.appendChild(title);

    // Create the image element
    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `${episode.name} image`;
    episodeCard.appendChild(image);

    // Create the summary element
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary; // Use innerHTML to retain formatting
    episodeCard.appendChild(summary);

    // Add the episode card to the episodes container
    episodesContainer.appendChild(episodeCard);
  });

  // Add the episodes container to the root element
  rootElem.appendChild(episodesContainer);

  // Populate dropdown and results count
  populateEpisodeSelector(episodeList);
  updateSearchResultCount(episodeList.length, episodeList.length);
}

/**
 * Function to format the episode code.
 * It takes the season and episode numbers as input and returns a formatted string.
 * 
 * @param {Number} season - The season number.
 * @param {Number} number - The episode number.
 * @returns {String} The formatted episode code.
 */
function formatEpisodeCode(season, number) {
  // Format the episode code as SXXEXX
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

/**
 * Function to set up search functionality.
 * It takes an array of episode objects as input and sets up the search button event listener.
 * 
 * @param {Array} allEpisodes - An array of episode objects.
 */
function setupSearch(allEpisodes) {
  // Get the search input and button elements
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  // Function to search episodes
  const searchEpisodes = () => {
    // Get the search term
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter episodes based on the search term
    const filteredEpisodes = allEpisodes.filter((episode) => {
      // Check if the episode name or summary contains the search term
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });

    // Create the page for filtered episodes
    makePageForEpisodes(filteredEpisodes);
    
    // Update the search result count
    updateSearchResultCount(filteredEpisodes.length, allEpisodes.length);
  };

  // Add event listener to the search button
  searchButton.addEventListener("click", searchEpisodes);
}

/**
 * Function to set up episode selector.
 * It takes an array of episode objects as input and sets up the episode selector event listener.
 * 
 * @param {Array} allEpisodes - An array of episode objects.
 */
function setupEpisodeSelector(allEpisodes) {
  // Get the episode selector and reset button elements
  const episodeSelect = document.getElementById("episode-select");
  const resetButton = document.getElementById("reset-button");

  // When a specific episode is selected
  episodeSelect.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "") {
      // Show all episodes if no specific episode is selected
      makePageForEpisodes(allEpisodes); 
      resetButton.style.display = "none"; // Hide reset button
      return;
    }

    // Extract season and episode number from the selected value
    const [selectedSeason, selectedEpisode] = selectedValue.split("-").map(Number);
    const selectedEpisodeData = allEpisodes.find(
      (episode) =>
        episode.season === selectedSeason && episode.number === selectedEpisode
    );

    // Show the selected episode
    makePageForEpisodes([selectedEpisodeData]); 
    resetButton.style.display = "inline-block"; // Show reset button
  });

  // Reset to show all episodes when the reset button is clicked
  resetButton.addEventListener("click", () => {
    makePageForEpisodes(allEpisodes);
    episodeSelect.value = ""; // Reset dropdown to default
    resetButton.style.display = "none"; // Hide reset button
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
  
  // Create an option for each episode
  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`; // Set value as season-episode
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`; // Display formatted code and name
    episodeSelect.appendChild(option); // Add option to the dropdown
  });
}

/**
 * Function to update the search result count display.
 * It takes the count of matching episodes and total episodes as input.
 * 
 * @param {Number} matchCount - The number of matching episodes.
 * @param {Number} totalEpisodes - The total number of episodes.
 */
function updateSearchResultCount(matchCount, totalEpisodes) {
  const resultCountElem = document.getElementById("search-result-count");
  resultCountElem.textContent = `Displaying ${matchCount} out of ${totalEpisodes} episode(s)`; // Update the display text
}

// Initialize the application when the window loads
window.onload = setup;  searchButton.addEventListener("click", searchEpisodes);


/**
 * Function to set up episode selector.
 * It takes an array of episode objects as input and sets up the episode selector event listener.
 * 
 * @param {Array} allEpisodes - An array of episode objects.
 */
function setupEpisodeSelector(allEpisodes) {
  // Get the episode selector and reset button elements
  const episodeSelect = document.getElementById("episode-select");
  const resetButton = document.getElementById("reset-button");

  // When a specific episode is selected
  episodeSelect.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "") {
      // Show all episodes if no specific episode is selected
      makePageForEpisodes(allEpisodes); 
      resetButton.style.display = "none"; // Hide reset button
      return;
    }

    // Extract season and episode number from the selected value
    const [selectedSeason, selectedEpisode] = selectedValue.split("-").map(Number);
    const selectedEpisodeData = allEpisodes.find(
      (episode) =>
        episode.season === selectedSeason && episode.number === selectedEpisode
    );

    // Show the selected episode
    makePageForEpisodes([selectedEpisodeData]); 
    resetButton.style.display = "inline-block"; // Show reset button
  });

  // Reset to show all episodes when the reset button is clicked
  resetButton.addEventListener("click", () => {
    makePageForEpisodes(allEpisodes);
    episodeSelect.value = ""; // Reset dropdown to default
    resetButton.style.display = "none"; // Hide reset button
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
  
  // Create an option for each episode
  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`; // Set value as season-episode
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`; // Display formatted code and name
    episodeSelect.appendChild(option); // Add option to the dropdown
  });
}

/**
 * Function to update the search result count display.
 * It takes the count of matching episodes and total episodes as input.
 * 
 * @param {Number} matchCount - The number of matching episodes.
 * @param {Number} totalEpisodes - The total number of episodes.
 */
function updateSearchResultCount(matchCount, totalEpisodes) {
  const resultCountElem = document.getElementById("search-result-count");
  resultCountElem.textContent = `Displaying ${matchCount} out of ${totalEpisodes} episode(s)`; // Update the display text
}

// Initialize the application when the window loads
window.onload = setup;