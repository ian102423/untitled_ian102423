const URL = "https://api.soundcloud.com/tracks/";
const QUERY = "?q=";
const APIKEY = "client_id=8538a1744a7fdaa59981232897501e04";
var button = document.querySelector(".searchBtn");
var searchInput = document.querySelector(".searchBar");
var submitBtn = document.querySelector(".searchBtn");
var searchResultsContainer = document.querySelector(".searchResults");
var finalResults = [];
var trackContainers = [];

submitBtn.addEventListener("click", function() {
  clearResults();
  moveTitleUp();
  var userInput = searchInput.value.replace(/\s+/g, "-").toLowerCase();
  axios
    .get(URL + QUERY + userInput + "&" + APIKEY)
    .then(function(response) {
      finalResults = response.data;
      console.log(finalResults);
      for (let i = 0; i < finalResults.length; i++) {
        createTracks(finalResults[i]);
        for (let j = i; j < trackContainers.length; j++) {
          trackContainers[j].addEventListener("click", function() {
            var pickedSong = finalResults[i].stream_url + "?" + APIKEY;
            showElement("#audioController");
            playClickedSong(pickedSong);
            updateNowPlaying(
              finalResults[i].user.username,
              finalResults[i].title
            );
          });
        }
      }
    })
    .catch(function() {
      console.log("Nope");
    });
});

function createTracks(data) {
  function makeTrackWrapper() {
    var createTrackWrapper = document.createElement("div");
    createTrackWrapper.classList.add("trackWrapper");
    searchResultsContainer.appendChild(createTrackWrapper);
    trackContainers.push(createTrackWrapper);

    var createArtistImage = document.createElement("img");
    createArtistImage.classList.add("userImg");
    createTrackWrapper.appendChild(createArtistImage);
    if (!data.artwork_url) {
      createArtistImage.src =
        "http://waterfrontpropertiesofmaine.com/wp-content/themes/wfpm/images/user-icon.png";
    } else {
      createArtistImage.src = data.artwork_url;
    }

    var createSongTitle = document.createElement("p");
    createSongTitle.classList.add("songTitle");
    createTrackWrapper.appendChild(createSongTitle);
    createSongTitle.innerHTML = data.title;

    var createUserName = document.createElement("p");
    createUserName.classList.add("userName");
    createTrackWrapper.appendChild(createUserName);
    createUserName.innerHTML = data.user.username;
  }
  makeTrackWrapper();
  showElement(".resultsTitle");
}

function playClickedSong(song) {
  var audioSource = document.querySelector("#audioSource");
  audioSource.src = song;
  var audioController = document.querySelector("#audioController");
  audioController.load();
}

function updateNowPlaying(currentArtist, currentSong) {
  document.querySelector("#artistPlaying").innerHTML =
    "Now Playing:  " + currentArtist + " ";
  document.querySelector("#songPlayingNow").innerHTML = currentSong;
}

function clearResults() {
  searchResultsContainer.innerHTML = "";
}

function showElement(el) {
  var element = document.querySelector(el);
  element.classList.remove("hidden");
}

function moveTitleUp() {
  var title = document.querySelector(".title");
  title.style.margin = "4% 0 0 0";
}
