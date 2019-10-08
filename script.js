let key = 'afdac39a';
let baseUrl = `http://www.omdbapi.com/?apikey=${key}&`;

let xhttp = new XMLHttpRequest();

function get(url, parseData) {
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                parseData(myArr["Search"]); // Very important - when we use s= omdb parameter, the content will be output within an object named Search, which we need to access
            } else {
                console.log("Ooops, there was an error...");
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function searchByTitle(title) {
    return get(`${baseUrl}s=${title}&type=movie`, parseTitleResponse); // By adding &type=movie into our query, we avoid searching for other types of media
}

function parseTitleResponse(data) {
    document.getElementById("searchResults").classList.remove("d-none");
    // This will loop through our data (the JSON get request), which is an object and therefore has length
    if (data != undefined) {
        for (let i = 0; i < data.length; i++) {
            if (data[i]["Poster"] === "N/A") {
                // If you want to show something when the poster is missing (which happens), use a placeholder image instead
                // data[i]["Poster"] = "https://i.imgur.com/U2Aq7wg.png"; 

                return; // If the poster is missing, simply do not show the result at all, since it's usually trying to show some unknown data anyway.
            }
            // We call our card generator function inside the loop, so we can target the parameters with the loop counter number (i), which simply points to the object on that position
            outputDataCard(data[i]["Poster"], data[i]["Title"], data[i]["Year"]);
        }
    } else{
        outputCardList.innerHTML = "No results were found for your search.";
    }
}

// This function is responsible to assemble and fill the bootstrap card with provided information
let outputCardList = document.getElementById("outputCardList");

function outputDataCard(poster, title, year) {
    let cardContainer = document.createElement("DIV");
    cardContainer.setAttribute("class", "card");

    let movieImage = document.createElement("IMG");
    movieImage.setAttribute("class", "card-img-top");
    movieImage.setAttribute("src", poster);
    cardContainer.appendChild(movieImage);

    let cardBody = document.createElement("DIV");
    cardBody.setAttribute("class", "card-body");
    cardContainer.appendChild(cardBody);

    let cardTitle = document.createElement("H5");
    cardTitle.setAttribute("class", "card-title");
    let titleNode = document.createTextNode(title);
    cardTitle.appendChild(titleNode);
    cardBody.appendChild(cardTitle);

    let cardText = document.createElement("P");
    cardText.setAttribute("class", "card-text");
    let yearNode = document.createTextNode(year);
    cardText.appendChild(yearNode);
    cardBody.appendChild(cardText);

    outputCardList.appendChild(cardContainer);
}

// This functions checks if there are any existing list elements and removes them for a fresh search, otherwise they'd get appended
function clearPreviousSearch() {
    while (outputCardList.hasChildNodes()) {
        outputCardList.removeChild(outputCardList.firstChild);
    }
}

// Event listeners for clicking or pressing enter
let searchInput = document.getElementById("searchInput");

document.getElementById("searchButton").addEventListener("click", function (event) {
    event.preventDefault();
    clearPreviousSearch();
    searchByTitle(searchInput.value);
});

searchInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        clearPreviousSearch();
        searchByTitle(searchInput.value);
    }
});