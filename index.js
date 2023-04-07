/*function carousel() {
  let carouselSlider = document.querySelector(".carousel-slider");
  let list = document.querySelector(".carousel-list");
  let item = document.querySelector(".carousel-item");

  const speed = 1;
  const width = list.offsetwidth;
  let x = 0;
  let x2 = width;

  function clone() {
    list2 = list.cloneNode(true);
    carouselSlider.appendChild(list2);
    list2.style.left = `${width}px`;
  }
  function moveFirst() {
    x -= speed;
    if (width >= Math.abs(x)) {
      list.style.left = `${x}px`;
    } else {
      x = width;
    }
  }
  function moveSecond() {
    x2 -= speed;
    if (list.offsetwidth >= Math.abs(x2)) {
      list2.style.left = `${x2}px`;
    } else {
      x2 = width;
    }
  }
  function hover() {
    clearInterval(a);
    clearInterval(b);
  }

  function unhover() {
    a = setInterval(moveFirst, 10);
    b = setInterval(moveSecond, 10);
  }
  clone();
  let a = setInterval(moveFirst, 10);
  let b = setInterval(moveSecond, 10);

  carouselSlider.addEventListener("mouseenter", hover);
  carouselSlider.addEventListener("mouseenter", unhover);
}
carousel();*/

const base_url = "http://localhost:8000/api/v1/titles/";

let bestMovie = document.getElementById("best-movie");
let image = document.getElementById("cover");
let btn1 = document.getElementsByClassName("btn1")[0];
let description = document.getElementsByClassName("description")[0];

const fetchBestMovie = async () => {
  await fetch(base_url + "?sort_by=-imdb_score")
    .then((res) => {
      if (res.ok) {
        console.log(res.clone().json());
        return res.json();
      }
    })
    .then(async (data) => {
      bestMovie.innerHTML = data["results"][0]["title"];
      image.src = data["results"][0]["image_url"];
      image.alt = "best movie cover";
      let url = data["results"][0]["url"];
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          description.innerHTML = data["description"];
        });
      btn1.addEventListener("click", function (e) {
        e.preventDefault;
        openModal(url);
      });
    });
};

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

const fetchModalData = async (url) => {
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      modalCoverImage.src = data["image_url"];
      document.getElementById("modal-title").innerHTML = data["title"];
      document.getElementsByClassName;
    });
};

fetchBestMovie();
