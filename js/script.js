var runner = null;
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

gameArea.appendChild(canvas);
canvas.height = gameArea.clientHeight;
canvas.width = gameArea.clientWidth;

function createPlatform() {
    c.fillStyle = 'rgba(0,0,0,1)';
    c.fillRect(0, 0, canvas.width, platformHeight);
    c.fillRect(0, canvas.height - platformHeight, canvas.width, platformHeight);
}

function createRunner() {
    c.fillStyle = 'rgba(0,0,255,1)';
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
    c.fillStyle = 'rgba(255,255,255,1)';
    c.fillRect(this.x, 0, holeWidth, platformHeight);
    }
    this.update = function(){
        c.fillStyle = 'rgba(0,0,0,1)';
        c.fillRect(this.x, 0, holeWidth, platformHeight);
        this.x -= holeSpeed;
        this.draw();
    }
}
function LowerHole(){
    this.x = canvas.width;
    this.draw = function(){
    c.fillStyle = 'rgba(255,255,255,1)';
    c.fillRect(this.x, canvas.height - platformHeight, holeWidth, platformHeight);
    }
    this.update = function(){
        c.fillStyle = 'rgba(0,0,0,1)';
        c.fillRect(this.x, canvas.height - platformHeight, holeWidth, platformHeight);
        this.x -= holeSpeed;
        this.draw();
    }
}

function switchSide(){
    if(playerPosition == "down")
        playerPosition = "up";
    else if(playerPosition == "up")
        playerPosition = "down";
    updateRunner();
}
function updateTime() {
    currentTime += 0.1;
    if(currentTime >= time)
    {
        currentTime = 0;
        time = timeGap[Math.round(Math.random() * (timeGap.length-1))];
        console.log(time + "," + currentTime);
        let side = [0,1];
        let holeTemp;
        if(side[Math.round(Math.random() * 2)] == 1)
            holeTemp = new LowerHole();
        else
            holeTemp = new UpperHole();
        holeTemp.draw();
        animateHole(holeTemp);
    }

    t = setTimeout(function() {
        updateTime();
    }, 100);
}

function animateHole(hole)
{
    animate();
    function animate()
        {
            if(hole.x > -holeWidth)
            {    
                requestAnimationFrame(animate);
                hole.update();
                if(isFallen(hole))
                    alert("You fell");
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

document.body.onkeyup = function(e){
    if(e.keyCode == 32)
        switchSide();
}
createRunner();
createPlatform();
updateTime();