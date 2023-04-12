const base_url = "http://localhost:8000/api/v1/titles/";

let bestMovie = document.getElementById("best-movie");
let image = document.getElementById("cover");
let btn1 = document.getElementsByClassName("btn1")[0];
let description = document.getElementsByClassName("description")[0];

async function fetchData(url) {
  const res = await fetch(url);
  const data = await res.json();

  return data;
}

fetchData(base_url + "?sort_by=-imdb_score")
  .then((data) => {
    bestMovie.innerHTML = data["results"][0]["title"];
    image.src = data["results"][0]["image_url"];
    image.alt = "best movie cover";
    let url = data["results"][0]["url"];
    fetchData(url).then((res) => {
      description.innerHTML = res["description"];
    });
    btn1.addEventListener("click", function (e) {
      e.preventDefault;
      openModal(url);
    });
  })
  .catch((err) => console.log(err));

let modal = document.getElementById("modal");
let btnClose = document.getElementsByClassName("btn-close")[0];
let overLay = document.getElementsByClassName("overlay")[0];

const openModal = (url) => {
  modal.classList.remove("hidden");
  overLay.classList.remove("hidden");
  btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    closeModal();
  });
  overLay.addEventListener("click", function (e) {
    e.preventDefault();
    closeModal();
  });
  fetchModalData(url);
};

const closeModal = () => {
  modal.classList.add("hidden");
  overLay.classList.add("hidden");
};

let modalImg = document.getElementsByClassName("modal-image")[0];
let modalCoverImage = document.createElement("img");
modalImg.appendChild(modalCoverImage);

let modalTitle = document.getElementById("modal-title");
let genres = document.getElementsByClassName("genres")[0];
let date = document.getElementsByClassName("date")[0];
let rated = document.getElementsByClassName("rated")[0];
let imdbScore = document.getElementsByClassName("imdb-score")[0];
let directors = document.getElementsByClassName("directors")[0];
let actors = document.getElementsByClassName("actors")[0];
let duration = document.getElementsByClassName("duration")[0];
let country = document.getElementsByClassName("country")[0];
let boxOffice = document.getElementsByClassName("box-office")[0];
let modalDescription = document.getElementsByClassName("modal-description")[0];

const getRatedStar = (ratedStar) => {
  const star = document.getElementsByClassName("star")[0];
  if (ratedStar == "Not rated or unkown rating") {
    return ratedStar;
  } else {
    star.classList.add("yellow");
  }
  return star;
};

const fetchModalData = (url) => {
  fetchData(url)
    .then((data) => {
      modalCoverImage.src = data["image_url"];
      modalTitle.innerHTML = data["title"];
      genres.innerHTML = data["genres"];
      date.innerHTML = data["date_published"];
      rated.innerHTML = getRatedStar(data["rated"]);
      imdbScore.innerHTML = data["imdb_score"];
      imdbScore.style.fontWeight = "600";
      directors.innerHTML = data["directors"];
      actors.innerHTML = data["actors"];
      duration.innerHTML = data["duration"];
      country.innerHTML = data["countries"];
      money = data["worldwide_gross_income"] + data["budget_currency"];
      if (data["worldwide_gross_income"] === null) {
        boxOffice.innerHTML = "N/A";
      } else {
        boxOffice.innerHTML = money;
      }
      modalDescription.innerHTML = data["long_description"];
    })
    .catch((err) => console.log(err));
};

const carousel = document.getElementsByClassName("carousel")[0];

const getCategory = async (name, total = 7) => {
  url = `${base_url}?sort_by=-imdb_score&genre=${name}`;
  const data = await fetchData(url);
  let movies = Array(...data.results);
  console.log("movies " + movies.length);
  if (name === "") {
    movies = movies.slice(1, total + 1);
  }
  if (movies.length < total) {
    const res = await fetchData(data.next);
    movies.push(...Array(...res.results));
    movies = movies.slice(0, total);
  }

  console.log(movies);

  return movies;
};
const buildCarousel = async (category, name) => {
  carousel.setAttribute("id", "categories");
  const carouselSlider = document.createElement("div");
  const carouselTitle = document.createElement("h2");
  const carouselList = document.createElement("div");
  carouselSlider.classList.add("carousel-slider");
  carouselTitle.classList.add("carousel-title");
  carouselList.classList.add("carousel-list");
  carouselSlider.appendChild(carouselTitle);

  carousel.appendChild(carouselSlider);

  carouselSlider.appendChild(carouselList);

  carouselTitle.innerHTML = `${category} movies`;
  carouselSlider.setAttribute("id", `${name}-movies`);
  let category_name = name;
  if (name === "best") {
    category_name = "";
  }

  const movies = await getCategory(category_name);
  console.log("movies " + movies);
  let i = 0;
  movies.forEach((movie) => {
    const carouselItem = document.createElement("div");
    const carouselImg = document.createElement("img");

    carouselList.appendChild(carouselItem);
    carouselItem.appendChild(carouselImg);

    carouselItem.classList.add("carousel-item");
    carouselItem.setAttribute("id", `${name}${i + 1}`);
    carouselImg.src = movie.image_url;
    carouselImg.setAttribute("alt", `${movie.title}`);
    const box = document.createElement("div");
    carouselItem.appendChild(box);
    const movieTitle = document.createElement("h4");
    modalTitle.innerHTML = movie.title;
    box.appendChild(movieTitle);
    carouselImg.addEventListener("click", function (e) {
      e.preventDefault;
      openModal(movie.url);
    });
    i++;
  });
  /*Create slide button*/
  const carouselBtn1 = document.createElement("button");
  carouselBtn1.setAttribute("type", "button");
  carouselBtn1.setAttribute("id", "moveLeft");
  carouselBtn1.classList.add("btn-nav");
  carouselBtn1.innerHTML = "ᐊ";
  carouselList.prepend(carouselBtn1);
  const carouselBtn2 = document.createElement("button");
  carouselBtn2.setAttribute("type", "button");
  carouselBtn2.setAttribute("id", "moveRight");
  carouselBtn2.classList.add("btn-nav");
  carouselBtn2.innerHTML = "ᐅ";
  carouselList.appendChild(carouselBtn2);
  let activeIndex = 0;

  carouselBtn1.addEventListener("click", (e) => {
    let movieWidth = carouselList.getBoundingClientRect().width;
    let scrollDistance = movieWidth * 2;
    carouselList.scrollBy({
      top: 0,
      left: -scrollDistance,
      behavior: "smooth",
    });
    activeIndex = activeIndex - 1;
  });

  carouselBtn2.addEventListener("click", (e) => {
    let movieWidth = carouselList.getBoundingClientRect().width;
    let scrollDistance = movieWidth * 2;
    if (activeIndex == 2) {
      carouselList.scrollBy({
        top: 0,
        left: +scrollDistance,
        behavior: "smooth",
      });
      activeIndex = 0;
    } else {
      carouselList.scrollBy({
        top: 0,
        left: +scrollDistance,
        behavior: "smooth",
      });
      activeIndex = activeIndex + 1;
    }
  });
};

buildCarousel("Best-rated", "best");
buildCarousel("Comedy", "comedy");
buildCarousel("Family", "family");
buildCarousel("Sport", "sport");
