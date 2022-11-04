const topRange = 7
const sortedMovies = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
const sortedCategory1Movies = "http://localhost:8000/api/v1/titles/?genre=Family&sort_by=-imdb_score"
const sortedCategory2Movies = "http://localhost:8000/api/v1/titles/?genre=Sport&sort_by=-imdb_score"
const sortedCategory3Movies = "http://localhost:8000/api/v1/titles/?genre=Thriller&sort_by=-imdb_score"
const descriptionItems = [
    "title",
    "genres",
    "date_published",
    "rated",
    "imdb_score",
    "directors",
    "actors",
    "duration",
    "countries",
    "worldwide_gross_income",
    "description"
]

async function getBestMovie(url){
    try {
        let response = await fetch(url);
        let movies = await response.json();
        let bestMovie = movies["results"][0];
        let movie = await getMovieData(bestMovie["url"]);
        return movie;
    } catch (error) {
        console.log(error);
    }
}

async function getMovieData(url){
    try {
        let response = await fetch(url);
        let movieData = await response.json();
        return movieData;
    
    } catch (error) {
        console.log(error)
    }
}

async function getTopMovies(url, range=topRange){
    try {
        let movies = []
        let page = 1
        while (movies.length < range){
            let response = await fetch(url + "&page=" + page);
            let moviesList = await response.json();
            for (let index = 0; index < moviesList["results"].length; index++) {
                if (movies.length < topRange) {
                    let movieData = await getMovieData(moviesList["results"][index]["url"]);
                    movies.push(movieData);
                } else {
                    break
                }
            }
            page ++;
        }
        return movies;
    
    } catch (error) {
        console.log(error)
    }
}

function displayBestMovie(movie){
    let title = document.getElementById("best-movie-title");
    title.textContent = movie["title"];
    let description = document.getElementById("best-movie-description");
    description.textContent = movie["long_description"];
    let img = document.createElement("img");
    img.id = "best-movie-image";
    img.src = movie["image_url"];
    img.addEventListener("error", function(event) {
        event.target.src = "img/not_found.jpg"
        event.onerror = null
    })
    img.addEventListener("click", function(){
    displayModal(movie);
    });
    let blockPoster = document.getElementById("poster");
    blockPoster.append(img);
}

function displayBestMovies(movies, container){
    let block = document.getElementById(container);
    let slider = document.createElement("div");
    slider.className = "slider";
    let buttonPrev = document.createElement("button");
    let buttonNext = document.createElement("button");
    buttonNext.textContent = ">";
    buttonNext.className = "btn btn-next";
    buttonPrev.textContent = "<";
    buttonPrev.className = "btn btn-prev";
    for (let index in movies){
        let slide = document.createElement("div");
        slide.className = "slide";
        let img = document.createElement("img");
        img.className = "slide-img";
        img.src = movies[index]["image_url"];
        img.addEventListener("error", function(event) {
            event.target.src = "img/not_found.jpg"
            event.onerror = null
          })
        img.addEventListener("click", function(){
            displayModal(movies[index]);
        });
        slide.append(img);
        slider.append(slide);
    }
    block.append(slider);
    slider.append(buttonNext,buttonPrev)
    buttonNext.addEventListener("click", function() {nextSlide(slider)});
    buttonPrev.addEventListener("click", function() {prevSlide(slider)});

    
}

function nextSlide(slider){
    console.log("Move to next slide");
    let slides = slider.getElementsByClassName("slide");
    for (let index=0; index<7; index ++){
    slides[index].style.translate = "-888px";
    }
}

function prevSlide(slider){
    console.log("Move to next slide")
    let slides = slider.getElementsByClassName("slide");
    for (let index=0; index<7; index ++){
    slides[index].style.translate = "0px";
    }
}

function displayModal(movie){
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    modal.getElementsByTagName("img")[0].src = movie["image_url"];
    for (item of descriptionItems){
        let container = document.getElementsByClassName("description")[0];
        let content = document.getElementById(item);
        content.textContent = item + ": " + movie[item];
    }
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    } 
}


getBestMovie(sortedMovies).then((data) => displayBestMovie(data));
getTopMovies(sortedMovies).then((data) => displayBestMovies(data, "BestMovies"));
getTopMovies(sortedCategory1Movies).then((data) => displayBestMovies(data, "MovieCategory1"));
getTopMovies(sortedCategory2Movies).then((data) => displayBestMovies(data, "MovieCategory2"));
getTopMovies(sortedCategory3Movies).then((data) => displayBestMovies(data, "MovieCategory3"));

