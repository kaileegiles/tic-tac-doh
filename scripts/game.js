// Thanks to freeCodeCamp.org tutorial for functionality support: https://www.youtube.com/watch?v=P2TcQ3h0ipQ

// Homer image credit: Radio times - https://www.radiotimes.com/news/tv/2018-08-21/someone-has-worked-out-what-homer-simpson-would-look-like-in-real-life-and-its-awful/

// Donut image credit: Ya Web Design - https://ya-webdesign.com/explore/the-simpsons-donut-png/

// Audio clips credit: The Sound Archive - https://www.thesoundarchive.com/simpsons.asp

let board;
let numberOfSquaresPlayed = 0;
let preventClick = false;

const huPlayer = new Image();
const aiPlayer = new Image();
huPlayer.src = "images/homer.png";
huPlayer.alt = "Homer Simpson";
aiPlayer.src = "images/donut.png";
aiPlayer.alt = "Pink donut";

const theme = new Audio("media/music/theme-cropped.mp3");
const champion = new Audio("media/music/champion.mp3");
const doh = new Audio("media/music/doh1.mp3");
const boring = new Audio("media/music/boring.mp3");

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();


// Play theme music

function removeSplash(){
    document.getElementById("btn-remove-splash").addEventListener('click');
    theme.play();
}

// Click to show 'X' and 'O' for human player and AI player

function turnClick(square) {
    if(preventClick) {
        return;
    }
    preventClick = true;
    numberOfSquaresPlayed++;
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, huPlayer)
        let gameWon = checkWin(board, huPlayer)
        if (gameWon) { 
            gameOver(gameWon);
            return; 
        }else if(numberOfSquaresPlayed === 9){
            gameOver({player: null});
            return;
        }
        setTimeout(function(){
            turn(bestSpot(), aiPlayer);
            preventClick = false;
            gameWon = checkWin(board, aiPlayer);
            if(gameWon) {
                gameOver(gameWon);
                return;
            }

        }, 800) 
    }
}

// Change 'X' and 'O' to homer and donut images

function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerHTML = `<img src="${player.src}" alt="${player.alt}" />`;
}

// Find every index that the player has played in and check win combos array

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

// Show win, lose, and tie card overlays, and play audio

function gameOver(gameWon) {
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    if (gameWon.player == huPlayer) {
        document.querySelector(".endgame").style.display = "block";
        document.querySelector(".endgame .text").innerText = "Woo hoo! You win!";
        champion.play();
    } else if (gameWon.player == aiPlayer) {
        document.querySelector(".endgame").style.display = "block";
        document.querySelector(".endgame .text").innerText = "Aaargh! You lose!";
        doh.play();
    } else {
        document.querySelector(".endgame").style.display = "block";
        document.querySelector(".endgame .text").innerText = "Boring! Tie game!";
        boring.play();
    }
    for (index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "black" : "black";
    }

    }

function emptySquares(){
    return board.filter(s => typeof s == 'number');
}

function bestSpot() {
    return emptySquares()[0];
}

// Clear the game board to start new game

function startGame() {
    preventClick = false;
    document.querySelector(".endgame").style.display = "none";
    board = Array.from(Array(9).keys());
    champion.pause();
    boring.pause();
    doh.pause();
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}
