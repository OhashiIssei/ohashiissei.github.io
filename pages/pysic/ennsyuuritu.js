// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// シミュレーション定数

const g = 1
const e = 1
const kabeKeisuu = 1
const numberOfBall = 2
const minSize=100;
const maxSize=100

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function Rect(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.weight = this.size**3
}

function diffVector(v1,v2){
  return [v1[0]-v2[0],v1[1]-v2[1]]
}

Rect.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.rect(this.x-this.size, this.y-this.size*0.55, this.size *2, this.size*1.5);
  ctx.fill();
}


Rect.prototype.update = function() {
  const migiAtaru = (this.x + this.size) >= width && (this.velX>0)
  const hidariAtaru = false//(this.x - this.size) <= 0 &&(this.velX<0)

  if (migiAtaru||hidariAtaru){
    this.velX *= -kabeKeisuu;
    syoutotuKaisuu += 1
    console.log("衝突回数: " + syoutotuKaisuu)
  }

  const shitaAtaru = (this.y + this.size) >= height && this.velY>0;
  const ueAtaru = (this.y - this.size) <= 0 && this.velY<0;

  if (shitaAtaru||ueAtaru) {
    this.velY *= -0.2;
  
  }
  this.x += this.velX;
  this.y += this.velY;
}



let rects = [];

while (rects.length < numberOfBall) {
  let size = random(minSize,maxSize);
  let ball = new Rect(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    randomRGB(),
    size
  );

  rects.push(ball);
}



let syoutotuKaisuu=0;

Rect.prototype.collisionDetect = function() {
  for (let j = 0; j < rects.length; j++) {
    if (!(this === rects[j])) {
      const dx = this.x - rects[j].x;
      const distance = Math.sqrt(dx * dx );
      const dvelX = this.velX - rects[j].velX;
      
      if ((distance < this.size + rects[j].size)&&(dvelX*dx<0)) {
        const v0 = this.velX
        const V0 = rects[j].velX
        const m0 = this.weight
        const M0 = rects[j].weight
        this.velX = ((m0-e*M0)*v0+M0*(1+e)*V0)/(m0+M0)
        rects[j].velX = (m0*(1+e)*v0+(M0-e*m0)*V0)/(m0+M0)
        syoutotuKaisuu++
        console.log("衝突回数: " + syoutotuKaisuu)
        // console.log("運動量: " + v0*m0+V0*M0)
      }else{
        this.velY +=g/numberOfBall
      }
    }
  }
}

rects[0].color = "red"
rects[0].velX = 0
rects[0].weight = 1
rects[0].size = 900
rects[1].velX = 1/10
rects[1].size = rects[0].size
rects[1].weight = rects[0].weight*100**4


rects[0].x = width*5/10
rects[1].x = -width*1/2
rects[0].y = height-rects[0].size
rects[1].y = height-rects[1].size

Rect.prototype.undouRyou = function(){
  return Math.sqrt(this.velX**2)*this.weight
 }

let k = 0;
let totalUndouRyou;

function loop() {
  width = window.innerWidth;
  height = window.innerHeight;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  totalUndouRyou = 0



  for (let i = 0; i < rects.length; i++) {
    // rects[i].y = height-rects[i].size
    rects[i].draw();
    rects[i].update();
    rects[i].collisionDetect();
    // totalUndouRyou += rects[i].undouRyou()
  }


  // if(k%180===0){
    // console.log("運動量: "+totalUndouRyou)
  // }
  // k++

  

  requestAnimationFrame(loop);
  }


loop()