$(document).ready(() => {
    $('#searchForm').on('submit', (event) => {
        let searchText = $('#searchText').val();
        getMovies(searchText, 1);

        event.preventDefault();
    })

    sessionStorage.setItem('searchText', 'null');
    sessionStorage.setItem('numberOfPage', 'null');

    var x = window.matchMedia("(min-width:1199px)")
    if (x.matches) { 
        console.log('yes');
    } else {
        console.log('no');
    }
    console.log(window.innerWidth)

    let mediaQueryForFourColumns = window.matchMedia('(min-width:1200px) and (max-width:1920px)');
    function widthChangeCallback1(myMediaQuery) {
        if (myMediaQuery.matches) {
            colCount = 4;
            let text = sessionStorage.getItem('searchText');
            let page = sessionStorage.getItem('numberOfPage');
            console.log(text + ' ' + page);
            if(text == "null" || page == "null"){
                return;
            }
            getMovies(text, page);
        } 
        console.log(colCount);
    }
    mediaQueryForFourColumns.addEventListener('change', widthChangeCallback1);

    let mediaQueryForThreeColumns = window.matchMedia('(min-width:768px) and (max-width:1199px)');
    function widthChangeCallback2(myMediaQuery) {
        if (myMediaQuery.matches) {
            colCount = 3;
            let text = sessionStorage.getItem('searchText');
            let page = sessionStorage.getItem('numberOfPage');
            if(text == "null" || page == "null"){
                return;
            }
            getMovies(text, page);
        } 
        console.log(colCount);
    }
    mediaQueryForThreeColumns.addEventListener('change', widthChangeCallback2);

    let mediaQueryForTwoColumns = window.matchMedia('(min-width:576px) and (max-width:768px)');
    function widthChangeCallback3(myMediaQuery) {
        if (myMediaQuery.matches) {
            colCount = 2;
            let text = sessionStorage.getItem('searchText');
            let page = sessionStorage.getItem('numberOfPage');
            if(text == "null" || page == "null"){
                return;
            }
            getMovies(text, page);
        } 
        console.log(colCount);
    }
    mediaQueryForTwoColumns.addEventListener('change', widthChangeCallback3);

    let mediaQueryForOneColumns = window.matchMedia('(min-width:450px) and (max-width:576px)');
    function widthChangeCallback4(myMediaQuery) {
        if (myMediaQuery.matches) {
            colCount = 1;
            let text = sessionStorage.getItem('searchText');
            let page = sessionStorage.getItem('numberOfPage');
            if(text == "null" || page == "null"){
                return;
            }
            getMovies(text, page);
        } 
        console.log(colCount);
    }
    mediaQueryForOneColumns.addEventListener('change', widthChangeCallback4);
    widthChangeCallback1(window.matchMedia('(min-width:1200px) and (max-width:1920px)'));
    widthChangeCallback2(window.matchMedia('(min-width:768px) and (max-width:1199px)'));
    widthChangeCallback3(window.matchMedia('(min-width:576px) and (max-width:768px)'));
    widthChangeCallback4(window.matchMedia('(min-width:450px) and (max-width:576px)'));
    console.log(colCount);
})
let colCount = 0;

function getMovies(searchText, numberOfPage) {
    sessionStorage.setItem('searchText', searchText);
    sessionStorage.setItem('numberOfPage', numberOfPage);
    while ($('#Column1')[0].firstChild) {
        $('#Column1')[0].removeChild($('#Column1')[0].firstChild);
    }
    while ($('#Column2')[0].firstChild) {
        $('#Column2')[0].removeChild($('#Column2')[0].firstChild);
    }
    while ($('#Column3')[0].firstChild) {
        $('#Column3')[0].removeChild($('#Column3')[0].firstChild);
    }
    while ($('#Column4')[0].firstChild) {
        $('#Column4')[0].removeChild($('#Column4')[0].firstChild);
    }
    axios.get('http://www.omdbapi.com/?apikey=d21aaa48&page=' + numberOfPage + '&s=' + searchText)
        .then((response) => {
            console.log(response);
            let movies = response.data.Search;
            console.log(movies);
            if (movies == undefined) {
                alert("Нет результатов.");
            }
            let count = parseInt(response.data.totalResults);
            sessionStorage.setItem('countOfMovie', count);
            let output = '';
            $.each(movies, (index, movie) => {
                if (movie.Poster == "N/A") {
                    movie.Poster = 'image/no-poster.png'
                }
                movie.Poster = movie.Poster.replace('SX300', '');
                output = `
                <div class="well text-center">
                    <img src="${movie.Poster}">
                    <h5>${movie.Title}</h5>
                    <a onClick="selectMovie('${movie.imdbID}')" target="_blank"  class="btn btn-primary" href="#">Movie Details</a>
                </div>
                `;



                let height =
                    Math.min($('#Column1')[0].offsetHeight, $('#Column2')[0].offsetHeight,
                        $('#Column3')[0].offsetHeight, $('#Column4')[0].offsetHeight);
                if(colCount == 1){
                    height =
                    Math.min($('#Column1')[0].offsetHeight);
                }
                if(colCount == 2){
                    height =
                    Math.min($('#Column1')[0].offsetHeight, $('#Column2')[0].offsetHeight);
                }
                if(colCount == 3){
                    height =
                    Math.min($('#Column1')[0].offsetHeight, $('#Column2')[0].offsetHeight,
                        $('#Column3')[0].offsetHeight);
                }
                var columns = document.getElementsByClassName('col-md-3');
                var foundColumn;
                for (var i = 0; i < columns.length && i < colCount; i++) {
                    if (columns[i].offsetHeight == height) {
                        foundColumn = columns[i];
                        break;
                    }
                }

                $(foundColumn)[0].innerHTML += output;
            });

            let countOfPages = Math.ceil(count / 10);
            if (countOfPages < 1) {
                return;
            }
            console.log(countOfPages);
            let from = parseInt(numberOfPage) - 2;
            let to = parseInt(numberOfPage) + 2;
            console.log(from);
            console.log(to);
            if (from < 1) {
                from = 1;
                to = 5;
                if (to > countOfPages) {
                    to = countOfPages;
                }
            }
            if (to > countOfPages) {
                to = countOfPages;
                from = to - 4;
                if (from < 1) {
                    from = 1;
                }
            }
            console.log(from);
            console.log(to);
            if (numberOfPage == 1) {
                output = `
                    <li class="page-item disabled">
                        <a class="page-link" href="#" onclick="getMovies('${searchText}', '1');">&laquo;</a>
                    </li>
                `;
            } else {
                output = `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="getMovies('${searchText}', '1');">&laquo;</a>
                </li>
                `;
            }
            console.log(numberOfPage);
            console.log(countOfPages);
            for (let i = from; i <= to; i++) {
                output += `
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="paginationItemClick(this);">${i}</a>
                    </li>
                `
            }
            if (numberOfPage == countOfPages) {
                output += `
                    <li class="page-item disabled">
                        <a class="page-link" href="#" onclick="getMovies('${searchText}', '${countOfPages}');">&raquo;</a>
                    </li>
                    `;
            } else {
                output += `
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="getMovies('${searchText}', '${countOfPages}');">&raquo;</a>
                    </li>
                    `;
            }
            $('#moviePagination').html(output);
            var aTags = document.getElementsByTagName('a');
            var found;

            for (var i = 0; i < aTags.length; i++) {
                if (aTags[i].textContent == numberOfPage) {
                    found = aTags[i];
                    break;
                }
            }
            $(found).addClass('active');
        })
        .catch((error) => {
            console.log(error);
        });
}

function paginationItemClick(el) {
    if (el.classList.contains('active')) {
        return;
    }
    document.querySelectorAll('.page-link').forEach(item => {
        $(item).removeClass('active');
    });
    $(el).addClass('active');

    let search = sessionStorage.getItem('searchText');
    getMovies(search, el.text);
}

function selectMovie(id) {
    sessionStorage.setItem('movieId', id);
    window.open('movieInfo.html');
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    axios.get('http://www.omdbapi.com/?apikey=d21aaa48&page=1&i=' + movieId)
        .then((response) => {
            console.log(response);
            let movie = response.data;
            movie.Poster = movie.Poster.replace('SX300', '');
            let output = `
            <div class="container medium">
        <div id="info" class="row" style="min-height: 847px; background-color: #060606;">
            <label class="form-label"><strong>${movie.Title}</strong></label>
            <img class="backup_picture" src="${movie.Poster}"
                onerror="this.src='image/no-poster.png'">
            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Информация о фильме
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <ul class="list-group">
                                <li class="list-group-item"><strong>Жанр:</strong> ${movie.Genre}</li>
                                <li class="list-group-item"><strong>Режиссер:</strong> ${movie.Director}</li>
                                <li class="list-group-item"><strong>Язык:</strong> ${movie.Language}</li>
                                <li class="list-group-item"><strong>Время:</strong> ${movie.Runtime}</li>
                                <li class="list-group-item"><strong>Рейтинг:</strong> ${movie.Rated}</li>
                                <li class="list-group-item"><strong>Автор:</strong> ${movie.Writer}</li>
                                <li class="list-group-item"><strong>Актеры:</strong> ${movie.Actors}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingTwo">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Информация о кинопракате
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <ul class="list-group">
                                <li class="list-group-item"><strong>Кассовые сборы:</strong> ${movie.BoxOffice}</li>
                                <li class="list-group-item"><strong>Страна:</strong> ${movie.Country}</li>
                                <li class="list-group-item"><strong>Выход на DVD:</strong> ${movie.DVD}</li>
                                <li class="list-group-item"><strong>Metascore:</strong> ${movie.Metascore}</li>
                                <li class="list-group-item"><strong>Дата выхода:</strong> ${movie.Released}</li>
                                <li class="list-group-item"><strong>IMDB рейтинг:</strong> ${movie.imdbRating}</li>
                                <li class="list-group-item"><strong>IMDB оценок:</strong> ${movie.imdbVotes}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id="plotContainer" class="row">
                <div class="well">
                    <h3>Сюжет/Описание</h3>
                    <hr>
                    <div id="plot" class="container">
                        ${movie.Plot}
                    </div>
                    <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">Перейти на
                        IMDB.com</a>
                    <a href="index.html" class="btn btn-default">Вернуться к поиску</a>
                </div>
            </div>
        </div>
    </div>
            `
            $('#movie').after(output);
        })
        .catch((error) => {
            console.log(error);
        });
}
