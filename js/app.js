/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const cards = document.querySelectorAll('.card');
const moves =  document.querySelector('.moves');
const gameContainer = document.querySelector('#gameContainer');
const cardContainer = document.querySelector('#cardContainer');
const timer =  document.getElementById("timer")
const stars = document.querySelector('.stars');
const totalMatches = 8;

let cardIcons = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-anchor","fa-leaf","fa-bicycle",
    "fa-diamond","fa-bomb","fa-leaf","fa-bomb","fa-bolt","fa-bicycle","fa-paper-plane-o","fa-cube"];
let openedCardsList = [];
let movesCount = 0;
let matchesCount = 0;
let starsCount = 3;
let gamesHasStarted = false;
let timerCount = 0;

/**
* @description shuffles and draws the cards
*/
function shuffleCards(){
    cardIcons = shuffle(cardIcons);
    cardContainer.innerHTML='';
    drawCards();
    openedCardsList = [];
    movesCount = 0;
    matchesCount = 0;
    starsCount = 3;
    timerCount = 0;
    moves.innerHTML = movesCount;
    timer.innerHTML = "00:00";
    for(let i=0; i<stars.children.length ; i++){
        stars.children[i].classList = "fa fa-star";
    }
}

/**
* @description displays the card symbol
*/
function displayCardSymbol(elm){
    elm.classList.add("show");
    elm.classList.add("open");
}

/**
* @description checks if the two open cards are a match
*/
function matchCardsToList(){
    if(openedCardsList.length === 2 ){
        let el1Classes =  openedCardsList[0].firstElementChild.classList;
        let el2Classes =  openedCardsList[1].firstElementChild.classList;
        return JSON.stringify(el1Classes) === JSON.stringify(el2Classes);
    } else {
        return false;
    }
}

/**
* @description adds card in the open card list
*/
function addToOpenCards(elm){
    openedCardsList.push(elm);
}


/**
* @description hides the card's symbol and removes the cards from the open card list 
*/
function removeFromOpenCards(){
    for(let i=0; i<openedCardsList.length; i++){
        openedCardsList[i].classList.remove("open");
        openedCardsList[i].classList.add("shake");
        openedCardsList[i].classList.add("notmatch");
    }
    setTimeout(function(){
        for(let i=0; i<openedCardsList.length; i++){
            openedCardsList[i].classList.remove("notmatch");
            openedCardsList[i].classList.remove("shake");
            openedCardsList[i].classList.remove("show");
        }
        openedCardsList = [];
    },500);
}

/**
* @description updates stars everytime match is found and checks if all cards are matched
*/
function updateStars(){
    matchesCount++;

    if(matchesCount === totalMatches ){
        let messageBox = document.createElement("div");
        messageBox.classList.add("container");
        messageBox.setAttribute("id", "message-container");
        messageBox.innerHTML = ' <div class="message-box"> '
        +'<h3>Congratulation you won with ' + movesCount +' moves  and ' + starsCount +  ' starts!!!</h3>'
        +'<button class="play-btn"onclick="startNewGame()">Play again</button>'
        +'</div>';
        gameContainer.style.display = "none";
        document.body.appendChild(messageBox);
    }
}

/**
* @description lock the cards in the open position by adding match class
*/
function lockCardPosition(){
    for(let i=0; i<openedCardsList.length; i++){
        openedCardsList[i].classList.add("match");
        openedCardsList[i].classList.add("shake");
    }
    setTimeout(function(){
        for(let i=0; i<openedCardsList.length; i++){
            openedCardsList[i].classList.remove("shake");
        }
        updateStars();
        openedCardsList = [];
    },500);
}

/**
* @description Updates the moves count and udpdates the stars
*/
function updateCounters() {
    moves.innerHTML = movesCount;
    movesCount++;
    if (movesCount === 20) {
        stars.children[2].classList = "fa fa-star-o";
        starsCount--;
    }
    if (movesCount === 30) {
        stars.children[1].classList = "fa fa-star-o";
        starsCount--;
    }
}

/**
* @description Used as callback function on onclick on the cards
*/
function cardsOnClick(evt){
    let targetElm = evt.target;

    //if the target of the click is the icon and not the li element
    if(evt.target.nodeName.toLowerCase() === 'i'){
        targetElm = evt.target.parentElement;
    }


    if(!targetElm.classList.contains("show") || !targetElm.classList.contains("open")){
        displayCardSymbol(targetElm);

        //add the card to a *list* of "open"
        addToOpenCards(targetElm);

        if(openedCardsList.length === 2){
            if(matchCardsToList()){
                lockCardPosition();
            } else {
                removeFromOpenCards();
            }

        }

        updateCounters();
      
        if(!gamesHasStarted){
          gamesHasStarted = true;
          startTimer();
        }
      
    }
}

/**
* @description starts new game shuffling and redrawind the cards
*/
function startNewGame(){
    shuffleCards();
    gamesHasStarted = false;
    timerCount = 0;
    timer.innerHTML = "00:00";
    if(document.getElementById("message-container")){
        document.getElementById("message-container").remove();
        gameContainer.style.display = "flex";
        cardContainer.innerHTML='';
        drawCards();
    }
}

/**
* @description draws the cards dynamically in the page
*/
function drawCards(){
    cardContainer.innerHTML="";
    for(let i=0; i<16 ; i++){
        let cardElement = document.createElement('li');
        cardElement.innerHTML = '<i class="fa '+cardIcons[i]+'"></i>';
        cardElement.classList.add("card");
        cardElement.addEventListener("click",cardsOnClick);
        cardContainer.appendChild(cardElement);
    }
}

/**
* @description starts the timer in seconds and displays it
*/
function startTimer(){
  setInterval(function(){
    timerCount +=1;
    timer.innerHTML = toHHMMSS(timerCount);
  }, 1000);
}

/**
* @description converts total number of seconds to hh:mm:ss format 
*/
function toHHMMSS(secs){
    var sec_num = parseInt(secs, 10)    
    var hours   = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60    
    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}


document.addEventListener('DOMContentLoaded', function () {
    shuffleCards();
    drawCards();
});



