function addPickRandomButton() {
    const list = document.querySelector('.actions-panel ul');

    if (list) {
        const pickRandomLiElement = document.createElement('li');
        pickRandomLiElement.classList.add('hide-for-empty-list');
    
        const pickRandomAElement = document.createElement('a');
        pickRandomAElement.innerText = 'Pick random movie';
        pickRandomAElement.setAttribute('href', '#');
        pickRandomLiElement.append(pickRandomAElement);
    
        pickRandomAElement.addEventListener('click', pickRandomMovie);
    
        list.appendChild(pickRandomLiElement);
    }
}

function getAllFilms() {
    const filmPostersElements = document.querySelectorAll('.film-poster');
    const films = Array.from(filmPostersElements).map((node) => {
        return {
            slug: node.getAttribute('data-film-slug'),
            link: node.getAttribute('data-target-link') || node.getAttribute('data-film-link'),
            name: node.querySelector('img').getAttribute('alt')
        }
    });
    return films;
}

function openRandomMovieDialog(movieData) {
    $.colorbox({
        width: '400px', 
        height: '300px', 
        html: '<div style="display: flex;height: 100%;justify-content: center;align-items: center;"><div>Preparing popcorn...</div></div>', 
        onLoad: () => {
            document.querySelector('button#cboxClose').style = 'background: transparent; border: none;'
        },
    });

    fetch(`https://letterboxd.com/ajax/poster/film/${movieData.slug}/std/230x345`).then((res) => res.text()).then((res) => {
        const element = document.createElement('div');
        element.insertAdjacentHTML('beforeend', res);
        const img = element.querySelector('img');

        const contentHtml = `
            <div style="padding: 30px; display: flex; gap: 20px;">
                <div class="poster">
                    ${img.outerHTML}
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center;">
                    <h1 class="title-2">${movieData.name}</h1>
                    <a style="font-size: 1.2rem; color: #bcd" onMouseOver="this.style.color = '#fff';" onMouseOut="this.style.color = '#bcd';" href="${movieData.link}">Go to movie page-></a>
                    <a href="#" id="another-movie" style="text-align: center; margin-top: 10px; width: fit-content;" class="button">Another!</a>
                </div>
            </div>
        `; 

        $.colorbox({
            html: contentHtml,
            overlayClose: false,
            onComplete: () => {
                document.querySelector('a#another-movie').addEventListener('click', pickRandomMovie);
            }
        });
    });
}

function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}

function pickRandomMovie(event) {
    event.preventDefault();
    const films = getAllFilms();
    const randomNum = getRandomNum(films.length);
    const randomMovie = films[randomNum];
    openRandomMovieDialog(randomMovie);
}

function isWatchlistPage(url) {
    return url.match(/(letterboxd.com)\/.+\/(watchlist)\//);
}

function listenUrlChanges() {
    let lastUrl = undefined;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (lastUrl !== currentUrl) {
            lastUrl = currentUrl;
            if (isWatchlistPage(lastUrl)) {
                addPickRandomButton();
            }
        }
    }).observe(document, { subtree: true, childList: true });
}

listenUrlChanges();