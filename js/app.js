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

let openedCardsList = [];

function matchCardsToList(){
    if(openedCardsList.length === 2 ){
        let el1Classes =  openedCardsList[0].firstElementChild.classList;
        let el2Classes =  openedCardsList[1].firstElementChild.classList;
       return JSON.stringify(el1Classes) === JSON.stringify(el2Classes);
    } else {
        return false;
    }
};

function lockCardPosition(elements){
    for(let i=0; i<elements.length; i++){
        elements[i].classList.add("open");
    }
};

function removeCardsFromList(){
    for(let i=0; i<openedCardsList.length;i++){
        openedCardsList[i].classList.remove("show");
    }
    openedCardsList = [];
};

function addToOpenCards(elm){
    openedCardsList.push(elm);
    if(openedCardsList.length === 2){
        if(matchCardsToList()){
            lockCardPosition(openedCardsList);
            openedCardsList = [];
        } else {
            removeCardsFromList();
        }
    }
};

function displayCardSymbol(element){
    element.classList.add("show");
    setTimeout(function(){
        addToOpenCards(element);
    },1000);
};

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card')

    for(let i=0; i<cards.length; i++){
        cards[i].addEventListener('click', function (evt) {
            if (evt.target.nodeName.toLowerCase() === 'li') {
                displayCardSymbol(evt.target);
            } else if(evt.target.nodeName.toLowerCase() === 'i'){
                displayCardSymbol(evt.target.parentElement);
            }
        });
    };
});