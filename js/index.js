const API_KEY = "AIzaSyBLLgAtE2CfXNLz0p89pkpL6JA84AVDyiE";
const MAX_RESULTS = 10;
const URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=${MAX_RESULTS}&type=video`;

let nextPageToken;
let prevPageToken;
let q;


const settings = {
    method : 'GET',
    referrer: "https://ivanmuniz.github.io/youtube-app"
};

const displayVideos = (responseJSON) => {
    const results = document.getElementById("results");
    results.innerHTML = "";
    for(let i = 0 ; i < responseJSON.items.length ; i++) {
        results.innerHTML += `
            <div class="border">
                <a href="https://www.youtube.com/watch?v=${responseJSON.items[i].id.videoId}" target="_blank">
                    <div class="videoBox">
                        <img class="thumbnail" src="${responseJSON.items[i].snippet.thumbnails.default.url}" alt="Thumbnail"/>
                        <p>${responseJSON.items[i].snippet.title}</p>
                    </div>
                </a>
            </div>`;
    }
}


const fetchVideos = (URL) => {
    fetch(URL, settings)
        .then( (response) => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( (responseJSON) => {
            console.log(responseJSON);
            displayVideos(responseJSON)
            if(responseJSON.nextPageToken) {
                nextPageToken = `&pageToken=${responseJSON.nextPageToken}`;
            } else {
                nextPageToken = '';
            }
            if(responseJSON.prevPageToken) {
                prevPageToken = `&pageToken=${responseJSON.prevPageToken}`;
            } else {
                prevPageToken = '';
            }
            document.getElementById("pg-buttons").classList.remove("hide");
            window.scrollTo({ top: 0 });
        })
        .catch( err => {
            console.log(err);
        });
}

const watchButtons = (text) => {
    const btnNext = document.getElementById("next");
    const btnPrev = document.getElementById("prev");
    btnNext.addEventListener("click", () => {
        if(nextPageToken) {
            fetchVideos(URL + q + nextPageToken);
        }
    });

    btnPrev.addEventListener("click", () => {
        if(prevPageToken) {
            fetchVideos(URL + q + prevPageToken);
        }
    });
}

const  watchForm = () => {
    const form = document.getElementById("form");
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const text = form["search"].value;
        if(text.trim() == "") {
            return;
        }
        q = `&q=${text}`;
        fetchVideos(URL + q);
    });
}

const init = () => {
    watchForm();
    watchButtons();
}

init();