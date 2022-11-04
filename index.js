let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// 채우는 법

// ctx.fillRect(25, 25, 100, 100);
// ctx.clearRect(45, 45, 60, 60);
// ctx.strokeRect(50, 50, 50, 50);

// 색 정하고 그림 그리기 

// ctx.fillStyle = 'blue';
// ctx.strokeStyle = 'blue';

// ctx.beginPath();
// ctx.moveTo(25, 25);
// ctx.lineTo(105, 25);
// ctx.lineTo(25, 105);
// ctx.fill();
// ctx.closePath();

// ctx.strokeStyle = 'red';

// ctx.beginPath();
// ctx.moveTo(125, 125);
// ctx.lineTo(125, 45);
// ctx.lineTo(45, 125);
// ctx.closePath();
// ctx.stroke();

// 여우 그리기

// ctx.fillStyle = '#FFA500';
// ctx.strokeStyle = 'red';

// ctx.beginPath();
// ctx.moveTo(25, 25);
// ctx.lineTo(25, 100);
// ctx.lineTo(100, 100);
// ctx.closePath();
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(100, 100);
// ctx.lineTo(175, 25);
// ctx.lineTo(175, 100);
// ctx.closePath();
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(175, 100);
// ctx.lineTo(100, 220);
// ctx.lineTo(25, 100);
// ctx.closePath();
// ctx.stroke();

// 사각형 4개

// ctx.globalAlpha = 0.5;

// ctx.fillStyle = '#FFD400';
// ctx.beginPath();
// ctx.moveTo(25, 25);
// ctx.lineTo(45, 25);
// ctx.lineTo(45, 45);
// ctx.lineTo(25, 45);
// ctx.fill();

// ctx.fillStyle = 'red';
// ctx.beginPath();
// ctx.moveTo(45, 45);
// ctx.lineTo(65, 45);
// ctx.lineTo(65, 65);
// ctx.lineTo(45, 65);
// ctx.fill();

// 글씨 쓰기

// ctx.font = '12px serif';

// ctx.fillText('선린의 터를', 10, 50);
// ctx.clearRect(0, 0, canvas.width, canvas.height);

// 무한히 올라가는 숫자 카운트

// let count = 0;

// function run() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     if (count > 500) {
//         return
//     }
//     count += 1;
//     ctx.strokeText("시간: " + count, 10, 50);
//     requestAnimationFrame(run)
// }

// requestAnimationFrame(run)

// 공룡이 나오게 만들어보자

// let img = new Image()
// img.src = '/cookie.jpeg'

// img.onload = function() {
//     for (let i = 0; i < 5; i++) {
//         ctx.drawImage(img, 50 * i, 50 * i, 100, 100)
//     }
// 

var img = new Image();
img.src = '/cookie.png';

var x =0;
var y =0;

var downkeys = {};

window.addEventListener('keydown',onKeyDown);
window.addEventListener('keyup',onKeyUp);

function onKeyDown(event){
    downkeys[event.code]= true;
}
function onKeyUp(event){
    downkeys[event.code]= false;
}

function run(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,x,y,40,40);

    if(downkeys['ArrowLeft'])
        x-=10;
    if(downkeys['ArrowRight'])
        x+=10;
    if(downkeys['ArrowUp'])
        y-=10;
    if(downkeys['ArrowDown'])
        y+=10;
    
    requestAnimationFrame(run);
}
requestAnimationFrame(run);