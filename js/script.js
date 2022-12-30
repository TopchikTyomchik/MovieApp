const API_KEY = '250a9f41-dc4f-4c61-b014-216dffe658bd';
const API_URL_TOP100 = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_KEYWORD = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_ID = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const moviesRowElem = document.querySelector('.movies__row');
const formElem = document.querySelector('.header__form');
const inputElem = document.querySelector('.header__input');
const modalElem = document.querySelector('.modal-window');


getMovies(API_URL_TOP100);

async function getMovies(url) {
   const resp = await fetch(url, {
      method: 'GET',
      headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
      },
  });
  const respData = await resp.json();
  
  displayMovies(respData);
}

function displayMovies(data) {
   moviesRowElem.innerHTML = "";
   data.films.forEach(movie => {
      moviesRowElem.insertAdjacentHTML(
         'beforeend',
         `<div class="movies__column">
         <a href="" class="movies__card movie-card">
           <div class="movie-card__image">
             <img src="${movie.posterUrl}" alt="${movie.nameRu}">
           </div>
           <div class="movie-card__info">
             <div class="movie-card__name">${movie.nameRu}</div>
             <div class="movie-card__genre"><p>${movie.genres.map(elem => ` ${elem.genre}`).join(',')}</p></div>
             <div class="movie-card__avarage movie-card__avarage_${getRatingColor(getRating(movie.rating))}">${getRating(movie.rating)}</div>
             <span class="movie-card__id">${movie.filmId}</span>
           </div>
         </a>
       </div>`
      );
      

   })
}

function getRating(rate) {
   if (rate.includes('%')) {
      return (parseFloat(rate)/10).toFixed(2);
   } else if (rate == "null"){
      return "-"
   } else {
     return rate
   }
}

 function getRatingColor(rate) {
   if (rate >= 7) {
      return "green"
   } else if (rate > 5) {
      return "yellow"
   } else  {
      return "red"
   }
} 




formElem.addEventListener('submit', event => {
   event.preventDefault();
   const apiSearchUrl = API_URL_KEYWORD + inputElem.value;

   if (inputElem.value == "") {
      getMovies(API_URL_TOP100);
   } else {
      getMovies(apiSearchUrl);
   }
   window.scrollTo(0, 0)
   inputElem.value ="";
})

// Modal

moviesRowElem.addEventListener('click', (event) => {
   event.preventDefault()
   const id = event.target.closest('.movie-card').querySelector('.movie-card__id').innerHTML;
   
   if (event.target.closest('.movie-card')) {
      openModal(id)
   }
})

async function openModal(id) {
   modalElem.classList.add('modal-window_show');
   document.body.classList.add('stop-scrolling');

   const respID = await fetch(API_URL_ID + id, {
      method: 'GET',
      headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
      },
  });
  const respDataID = await respID.json();
  
 

   modalElem.innerHTML = `
      <div class="modal_window__body">
                  <div class="modal-window__top">
                     <div class="modal-window__row">
                        <div class="modal-window__column modal-window__column_image">
                           <div class="modal__window__image">
                           <img src="${respDataID.posterUrl}" alt="${respDataID.nameRu}">
                           </div>
                        </div>
                        <div class="modal-window__column modal-window__column_info">
                        <p class="modal-window__name"><span class="name-word">Название:</span><span class="year-number">${respDataID.nameRu}</span></p>
                        <p class="modal-window__year"><span class="year-word">Год:</span><span class="year-number">${respDataID.year}</span></p>
                        <p class="modal-window__country"><span class="country-word">Страна:</span><span class="country-name">${respDataID.countries.map(elem => ` ${elem.country}`)}</span></p>
                        <p class="modal-window__genre"><span class="genre-word">Жанр:</span><span class="country-name">${respDataID.genres.map(elem => ` ${elem.genre}`)}</span></p>
                        <p class="modal-window__length"><span class="length-word">Прододжительность:</span><span class="country-name">${respDataID.filmLength ? respDataID.filmLength : "-"}</span></p>
                        </div>
                     </div>
                  </div>
                  <div class="modal-window__bottom">
                     <p class="modal-window__url"><span class="url-word">Сайт: </span><a href="${respDataID.webUrl}" class="url-modal" target="_blank">${respDataID.webUrl}</a></p>
                     <p class="modal-window__description">
                        ${respDataID.description}</br>
                        ${respDataID.shortDescription ?  respDataID.shortDescription : ""} 
                     </p>
                  </div>
                  <section class="button">
                     <button class="btn">Закрыть</button>
                  </section>
                  </div>
   `;
   const modalBtn = document.querySelector('.button .btn');
   modalBtn.addEventListener('click', closeModal);
   console.log(respDataID.filmLength);
   console.log(respDataID);
}

function closeModal() {
   modalElem.classList.remove('modal-window_show');
   modalElem.innerHTML = '';
   document.body.classList.remove('stop-scrolling');
}

window.addEventListener('keyup', (event) => {
   if (event.code === "Escape") closeModal();
})
window.addEventListener('click', (event) => {
   if (event.target === modalElem) closeModal();
})