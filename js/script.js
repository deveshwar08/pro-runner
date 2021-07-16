var runner;
var canvas = document.createElement("canvas");
var gameArea = document.getElementById("game-area");
let c = canvas.getContext('2d');
let platformHeight = 80;
let holeWidth = 80;
let playerSize = 40;
let playerPosition = "down";
let holeSpeed = 5;
let timeGap = [1,2,3];
let time = timeGap[Math.round(Math.random() * timeGap.length)];
let currentTime = 0;
let score = 0;
let playerName;
let gameOver = false;
let gameStarted = false;
gameArea.appendChild(canvas);
canvas.height = gameArea.clientHeight;
canvas.width = gameArea.clientWidth;

function displayScore()
{
    document.getElementById("score-area").innerHTML = "";
    if(localStorage.getItem("HighScore") == null)
    {
        return;
    }
    let retrievedHighScore = JSON.parse(localStorage.getItem("HighScore"));
    let h1 = document.createElement("h1");
    let highScoreText = document.createTextNode("HIGH SCORE")
    h1.appendChild(highScoreText);
    let h21 = document.createElement("h2");
    let highScoreName = document.createTextNode("Name : " + retrievedHighScore[0]);
    let h22 = document.createElement("h2");
    let highScoreScore = document.createTextNode("Score : " + +(Math.round(retrievedHighScore[1] + "e+2")  + "e-2"))
    h21.appendChild(highScoreName);
    h22.appendChild(highScoreScore);
    document.getElementById("score-area").appendChild(h1);
    document.getElementById("score-area").appendChild(h21);
    document.getElementById("score-area").appendChild(h22);
}
function closePopup(){
    document.getElementById("overlay").classList.remove("active");
    document.getElementById("score-popup").classList.remove("active");
    document.getElementById("score-popup-body").innerText = ""; 
    location.reload();
    location.reload();
}

function popUpScore(){
    document.getElementById("overlay").classList.add("active");
    document.getElementById("score-popup").classList.add("active");
    document.getElementById("score-popup-body").innerText = "Score : " + +(Math.round(score + "e+2")  + "e-2"); 
    let highScore = [];
    highScore[0] = playerName;
    highScore[1] = +(Math.round(score + "e+2")  + "e-2");
    if(localStorage.getItem("HighScore") == null)
        localStorage.setItem("HighScore",JSON.stringify(highScore));
    else{
        let retrievedHighScore = JSON.parse(localStorage.getItem("HighScore"));
        if(retrievedHighScore[1] <= +(Math.round(score + "e+2")  + "e-2"))
        {
            localStorage.removeItem("HighScore");
            localStorage.setItem("HighScore",JSON.stringify(highScore));
        }
    }
}
function calculateScore(){
    score += 0.01;
    document.getElementById("live-score").innerHTML = +(Math.round(score + "e+2")  + "e-2");
    t = setTimeout(function() {
        calculateScore();
    }, 10);
}

function createPlatform() {
    c.fillStyle = 'rgba(22,22,22,255)';
    c.fillRect(0, 0, canvas.width, platformHeight);
    c.fillRect(0, canvas.height - platformHeight, canvas.width, platformHeight);
}

function createRunner() {
    c.fillStyle = 'rgba(37,136,212,255)';
    if(playerPosition == "up")
        c.fillRect(0, platformHeight, playerSize, playerSize);
    else
        c.fillRect(0, canvas.height - platformHeight - playerSize, playerSize, playerSize);
}
function updateRunner() {
    if (playerPosition == "up")
        c.clearRect(0, canvas.height - platformHeight - playerSize, playerSize, playerSize);
    else
        c.clearRect(0, platformHeight, playerSize, playerSize);
    createRunner();
}

function UpperHole(){
    this.x = canvas.width;
    this.draw = function(){
    c.fillStyle = 'rgba(54,54,54,255)';
    c.fillRect(this.x, 0, holeWidth, platformHeight);
    }
    this.update = function(){
        c.fillStyle = 'rgba(22,22,22,255)';
        c.fillRect(this.x, 0, holeWidth, platformHeight);
        this.x -= holeSpeed;
        this.draw();
    }
}
function LowerHole(){
    this.x = canvas.width;
    this.draw = function(){
    c.fillStyle = 'rgba(54,54,54,255)';
    c.fillRect(this.x, canvas.height - platformHeight, holeWidth, platformHeight);
    }
    this.update = function(){
        c.fillStyle = 'rgba(22,22,22,255)';
        c.fillRect(this.x, canvas.height - platformHeight, holeWidth, platformHeight);
        this.x -= holeSpeed;
        this.draw();
    }
}

function switchSide(){
    if(gameStarted == false)
    {
        gameStarted = true;
        calculateScore();
        updateTime();
        return;
    }
    if(playerPosition == "down")
        playerPosition = "up";
    else if(playerPosition == "up")
        playerPosition = "down";
    updateRunner();
}
function updateTime() {
    currentTime ++;
    if(currentTime >= time)
    {
        currentTime = 0;
        time = timeGap[Math.round(Math.random() * (timeGap.length-1))];
        let side = [0,1];
        let holeTemp;
        if(side[Math.round(Math.random() * 2)] == 1)
            holeTemp = new LowerHole();
        else
            holeTemp = new UpperHole();
        holeTemp.draw();
        animateHole(holeTemp);
    }
    if(gameOver == false){
        t = setTimeout(function() {
            updateTime();
        }, 1000);
    }
}

function animateHole(hole)
{
    animate();
    function animate()
        {
            if(hole.x > -holeWidth)
            {    
                if(isFallen(hole))
                {
                    playerName = prompt("What's your name?");
                    gameOver = true;
                    popUpScore();
                }
                if(gameOver == false){
                    requestAnimationFrame(animate);
                    hole.update();
                }
            }
        }
}

function isFallen(hole)
{
    if(hole.x <= playerSize && ((playerPosition == "up" && hole instanceof UpperHole)||(playerPosition == "down" && hole instanceof LowerHole)))
    {
        return true;
    }
    return false;
}
document.body.addEventListener('keydown', function(e) {
  if(e.target == document.body) {
    e.preventDefault();
  }
});

document.body.onkeyup = function(e){
    if(e.keyCode == 32)
        switchSide();
}
createRunner();
createPlatform();
displayScore();

