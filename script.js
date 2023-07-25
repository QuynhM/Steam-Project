// Helper Functions
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// GET DATA
// genre titles
const getGenreNames = async () => {
  try {
    const url = "https://steam-api-mass.onrender.com/genres?limit=6";
    const res = await fetch(url);
    const { data } = await res.json();
    const genres = data.map(({ name }) => name);
    return genres;
  } catch (error) {
    console.log("Error:", error);
  }
};

// data of all games
let genre = "";
let page = 1;
const search = document.getElementById("searchForm");

const getAllGamesData = async () => {
  try {
    let queryString = `limit=12&page=${page}`;

    if (genre) {
      queryString += `&genres=${genre}`;
    }

    if (search.value) {
      queryString += `&q=${search.value}`;
    }

    const url = `https://steam-api-mass.onrender.com/games?${queryString}`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
    // console.log()
  } catch (error) {
    console.log("Error:", error);
  }
};

// get the games detail
const getGameDetail = async (appid) => {
  try {
    const url = `https://steam-api-mass.onrender.com/single-game/${appid}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log("Error:", error);
  }
};


//DISPLAY
const displayGame = (gameData) => {
  //Container
  const gameDiv = document.createElement("div");
  gameDiv.className = "game";
  gameDiv.id = `${gameData.appid}`;
  //Image
  const imgElement = document.createElement("img");
  imgElement.src = gameData.header_image;
  imgElement.alt = gameData.name;
  gameDiv.appendChild(imgElement);
  //Name
  const titleElement = document.createElement("h3");
  titleElement.className = "title";
  titleElement.textContent = gameData.name;
  gameDiv.appendChild(titleElement);
  //Price
  const priceElement = document.createElement("span");
  priceElement.className = "price";
  if (gameData.price === 0) {
    priceElement.textContent = "Free";
  } else {
    priceElement.textContent = "$" + gameData.price;
  }
  gameDiv.appendChild(priceElement);
  //Genre
  const genreElement = document.createElement("span");
  genreElement.className = "genre";
  genreElement.textContent = gameData.genres;
  gameDiv.appendChild(genreElement);

  const backBtn = document.getElementById("back-btn");
  backBtn.style.display = "none";

  const moreBtn = document.getElementById("load-more-btn");
  moreBtn.style.display = "flex";

  return gameDiv;
};

const displayGameDetail = async (gameData) => {
  const appid = gameData.appid;

  // Create game detail container
  const detailDiv = document.createElement("div");
  detailDiv.className = "gameDetails";
  detailDiv.dataset.appid = appid;

  // Fetch game detail using getGameDetail
  const gameDetail = await getGameDetail(appid);

  // Access the properties of gameDetail and add them to detailDiv
  const titleElement = document.createElement("h3");
  titleElement.textContent = gameDetail.name;
  titleElement.id = "genre-name";
  detailDiv.appendChild(titleElement);

  const imgElement = document.createElement("img");
  imgElement.src = gameDetail.header_image;
  imgElement.alt = gameDetail.name;
  detailDiv.appendChild(imgElement);

  const priceElement = document.createElement("span");
  priceElement.className = "price";
  if (gameDetail.price === 0) {
    priceElement.textContent = "Free to play";
  } else {
    priceElement.textContent = "$" + gameDetail.price;
  }
  detailDiv.appendChild(priceElement);

  const genreElement = document.createElement("span");
  genreElement.className = "genre";

  let genresText = gameDetail.genres.map(toTitleCase);
  genresText = genresText.join(", ");
  genreElement.textContent = genresText;
  detailDiv.appendChild(genreElement);

  const gameDesciption = document.createElement("span");
  gameDesciption.textContent = gameDetail.description;
  gameDesciption.className = "description";
  detailDiv.appendChild(gameDesciption);

  // const backBtn = document.createElement("button");
  // backBtn.id = "back-btn";
  // backBtn.textContent = "Back";
  // detailDiv.appendChild(backBtn);
  const backBtn = document.getElementById("back-btn");
  backBtn.style.display = "flex";

  const moreBtn = document.getElementById("load-more-btn");
  moreBtn.style.display = "none";

  return detailDiv;
};

// Button More Games
const loadMoreGames = async () => {
  page++;
  const data = await getAllGamesData();
  const ulGameGallery = document.getElementById("game-gallery");
  data.forEach((gameData) => {
    const gameDiv = displayGame(gameData);
    ulGameGallery.append(gameDiv);

    gameDiv.addEventListener("click", async () => {
      const gameSection = document.getElementById("game-gallery");
      gameSection.innerHTML = "";
      const genreName = document.getElementById("genre-name");
      genreName.innerHTML = "";
      const detailData = await getGameDetail(gameData.appid);
      const detailDiv = await displayGameDetail(detailData);
      gameSection.appendChild(detailDiv);
    });
  });

  if (data.length < 12) {
    // Hide the "Load More" button when there are no more games to load
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.style.display = "none";
  }
};

document.getElementById("load-more-btn").addEventListener("click", () => {
  loadMoreGames();
});

const displaySearchBar = (genre) => {
  const genresButton = document.createElement("li");
  genresButton.className = "genre";
  genresButton.id = `${genre}`;
  genresButton.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
  return genresButton;
};

//INTEGRATION
const renderGames = async () => {
  //Change page title
  const title = document.getElementById("genre-name");
  title.textContent = "GAMES";
  //Get data
  const data = await getAllGamesData();

  //Display All Game (AUTO)
  const ulGameGallery = document.getElementById("game-gallery");
  ulGameGallery.innerHTML = "";
  data.forEach((gameData) => {
    // Display
    const gameDiv = displayGame(gameData);
    ulGameGallery.append(gameDiv);

    // Event Handler
    gameDiv.addEventListener("click", async () => {
      const gameSection = document.getElementById("game-gallery");
      gameSection.innerHTML = "";
      //Erase Genre Name
      const genreName = document.getElementById("genre-name");
      genreName.innerHTML = "";
      const detailData = await getGameDetail(gameData.appid);
      const detailDiv = await displayGameDetail(detailData);
      gameSection.appendChild(detailDiv);
    });
  });
};

const renderSearchGames = async () => {
  //Change page title
  const title = document.getElementById("genre-name");
  title.textContent = "GAMES";
  //Get data
  const data = await getAllGamesData();

  //Display All Game (AUTO)
  const ulGameGallery = document.getElementById("game-gallery");
  ulGameGallery.innerHTML = "";
  data.forEach((gameData) => {
    // Display
    const gameDiv = displayGame(gameData);
    ulGameGallery.append(gameDiv);

    // Event Handler
    gameDiv.addEventListener("click", async () => {
      const gameSection = document.getElementById("game-gallery");
      gameSection.innerHTML = "";
      //Erase Genre Name
      const genreName = document.getElementById("genre-name");
      genreName.innerHTML = "";
      const detailData = await getGameDetail(gameData.appid);
      const detailDiv = await displayGameDetail(detailData);
      gameSection.appendChild(detailDiv);
    });
  });
};
document.getElementById("search-icon").addEventListener("click", () => {
  renderSearchGames();
});

const renderSearchBar = async () => {
  //Get data
  const genreNames = await getGenreNames();

  //Display Navbar
  const genreGroup = document.getElementById("genreGroup"); //Navbar container
  genreNames.forEach((genreName) => {
    const genresButton = displaySearchBar(genreName);
    //Click Event
    genresButton.addEventListener("click", async () => {
      genre = genreName;
      //Change title in game section
      const title = document.getElementById("genre-name");
      title.textContent = genre.toUpperCase();

      // const genreData = await (genreName);

      const genreData = await getAllGamesData();

      // Clear the current game gallery
      const ulGameGallery = document.getElementById("game-gallery");
      ulGameGallery.innerHTML = "";

      // Display games from the selected genre
      genreData.forEach((gameData) => {
        const gameDiv = displayGame(gameData);
        ulGameGallery.append(gameDiv);

        //Add detail click event to each display
        gameDiv.addEventListener("click", async () => {
          const gameSection = document.getElementById("game-gallery");
          gameSection.innerHTML = "";
          const genreTitle = document.getElementById("genre-name");
          genreTitle.innerHTML = "";
          const detailData = await getGameDetail(gameData.appid);
          const detailDiv = await displayGameDetail(detailData);
          gameSection.appendChild(detailDiv);
        });
      });
    });
    genreGroup.appendChild(genresButton);
  });
};

renderGames();
renderSearchBar();

// Back button to go back to All games page
document.getElementById("back-btn").addEventListener("click", () => {
  renderGames();
});

