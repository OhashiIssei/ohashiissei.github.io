let balls = [];

const canvas = document.querySelector('.symurator');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
  

// シミュレーション定数

const Juuryoku=0

const g = 1
const boundKeisuu = 0.9
const kabeKeisuu = 0.9
const seisiMax = 2
const seisiHiritu = 1
const numberOfBall = 1000
const minSize = 3;
const maxSize = 3


// 感染者シミュレーション

const speed = 5 // 趣味レーション速度の調整
const velHani = 0.5*speed
const hajimeKansensyasuu = 1


// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}


 // 状態クラス

 function Joutai(name,color,arukuHayasa,kikan,kansenRitu){
  this.name = name 
  this.color = color
  this.arukuHayasa = arukuHayasa
  this.kikan = kikan*60/speed
  this.kansenRitu = kansenRitu
  this.total = 0
}


//状態登録

const mikansen = new Joutai("mikansen","green",1*velHani,0,0)
const koutaiKikanSyuuryou = new Joutai("koutaiKikanSyuuryou","green",1*velHani,0,0)
const koutaiAri = new Joutai("koutaiAri","blue",1*velHani,30*2,0)
const kansenTyu = new Joutai("kansenTyu","yellow",1*velHani,16,0.5)
const deKansenTyu = new Joutai("deKansenTyu","orange",1*velHani,12,2/3)
const omKansenTyu = new Joutai("omKansenTyu","red",1*velHani,8,1)

const Joutais = [mikansen,koutaiKikanSyuuryou,koutaiAri,kansenTyu,deKansenTyu,omKansenTyu]


// ボールクラス

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.weight = this.size**2;
  this.timer = 0
  this.joutai = mikansen
}

Ball.prototype.kansenTyuu = function(){
  return (this.joutai.kansenRitu>0)
}

Ball.prototype.koutaiAri = function(){
  return (this.joutai === koutaiAri)
}

// 描く

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// 壁衝突、進める

Ball.prototype.update = function() {
  const migiAtaru = (this.x + this.size) >= width && (this.velX>0)
  const hidariAtaru = (this.x - this.size) <= 0 &&(this.velX<0)

  if (migiAtaru||hidariAtaru){
    this.velX *= -kabeKeisuu;
  }

  const shitaAtaru = (this.y + this.size) >= height && this.velY>0;
  const ueAtaru = (this.y - this.size) <= 0 && this.velY<0;

  if (shitaAtaru||ueAtaru) {
    this.velY *= -kabeKeisuu;;
  
  }

  this.x += this.velX;
  this.y += this.velY;
}


Joutai.prototype.total = function(){
  let total = 0
  for (let i = 0; i < balls.length; i++) {
    if(balls[i].joutai === this){
      total +=1
    }
  }
  return total
}





//衝突判定

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const dvelX = this.velX - balls[j].velX;
      const dvelY = this.velY - balls[j].velY;
      
      
      //衝突時
      if ((distance < this.size + balls[j].size)&&(dvelX*dx+dvelY*dy<0)) {
        //濃厚接触時

        this.noukouSessyoku(balls[j])
        balls[j].noukouSessyoku(this)

        // 衝突計算
        const lambda = -2*(this.weight*balls[j].weight)/(this.weight+balls[j].weight)*(dvelX*dx+dvelY*dy)/distance
        this.velX += lambda/this.weight * dx/distance;
        this.velY += lambda/this.weight * dy/distance;
        balls[j].velX -= lambda/balls[j].weight * dx/distance;
        balls[j].velY -= lambda/balls[j].weight * dy/distance;
        this.velX *= boundKeisuu
        this.velY *= boundKeisuu
        balls[j].velX *= boundKeisuu
        balls[j].velY *= boundKeisuu
      }
    }
  }
}


// 濃厚接触する

Ball.prototype.noukouSessyoku = function(Aite){
  if(Aite.joutai.kansenRitu>0 && (this.joutai.kansenRitu===0)&&this.joutai!==koutaiAri){
    if(Math.random()<Aite.joutai.kansenRitu){
      this.joutai = Aite.joutai
      this.color = Aite.color
      this.timer = 1
      if(Math.random()<0.01){
        this.color = kansenTyu.color
        this.joutai = kansenTyu
      }
      if(Math.random()<0.01){
        this.color = deKansenTyu.color
        this.joutai = deKansenTyu
      }
      if(Math.random()<0.01){
        this.color = omKansenTyu.color
        this.joutai = omKansenTyu
      }
      this.joutai.total += 1
      console.log(kansenTyu.total+", "+deKansenTyu.total+", "+omKansenTyu.total+", "+koutaiAri.total)
    }
  }
}




// 状態経過

Ball.prototype.joutaiKeika = function() {

  // 感染の進行/回復期間

  if(this.timer >0){
    this.timer +=1
  }
  if(this.joutai.kansenRitu>0){
    if(this.timer === this.joutai.kikan){
      this.color = koutaiAri.color
      this.joutai = koutaiAri
      this.timer =-1
      this.joutai.total += 1
    }
  }

  //抗体期間

  if(this.timer <0){
    this.timer -=1
  }
  if(this.joutai === koutaiAri){
    if(this.timer === -this.joutai.kikan){
      this.color = koutaiKikanSyuuryou.color
      this.joutai = koutaiKikanSyuuryou
      this.timer = 0
    }
  }
}

// ループ条件

function loop() {
  // width = window.innerWidth;
  // height = window.innerHeight-menuHeight;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);


  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    balls[i].joutaiKeika();
    balls[i].collisionDetectToPath()
    balls[i].velY+=Juuryoku
  }

  

  requestAnimationFrame(loop);
}

loop()


  //ボールを量産する
  // function createManyBall(){
  //   while (balls.length < numberOfBall) {
  //     let size = random(minSize,maxSize);
  //     let ball = new Ball(
  //       random(0 + size,width - size),
  //       random(0 + size,height - size),
  //       random(-velHani,velHani),
  //       random(-velHani,velHani),
  //       mikansen.color,
  //       size
  //     );
  //     balls.push(ball);
  //   }
  //   // 初めの感染者数
  //   for (let i=0;i<hajimeKansensyasuu;i++){
  //     balls[i].color = kansenTyu.color
  //     balls[i].joutai = kansenTyu
  //     balls[i].timer = 1
  //   }
  //   loop()
  // }

function createBall(x, y, velX, velY, color, size){


  let ball = new Ball(x, y, velX, velY, color, size)
  balls.push(ball);
  console.log(ball)
}

value = 1

//"visiblePath"に衝突時
Ball.prototype.collisionDetectToPath = function() {
  for(let i=0;i<visibleCtx.pathes.length;i++){
    const thisPath = visibleCtx.pathes[i]
    const thisPoints = thisPath.points
    visibleCtx.lineWidth = Number(this.size*2)+Number(thisPath.lineWidth);
    if(visibleCtx.isPointInStroke(thisPath,this.x,this.y,"nonzero")){
      let minDistance = distance([this.x,this.y],[thisPoints[0][0],thisPoints[0][1]-menuHeight])
      let nearPoints = [thisPoints[0]]
      if(thisPoints.length<2){
        nearPoints = [thisPoints[0],thisPoints[0]]
      }else{
        let thisDistance = distance([this.x,this.y],[thisPoints[1][0],thisPoints[1][1]-menuHeight])
        if(thisDistance<minDistance){
          nearPoints.unshift(thisPoints[1])//1番目に入る
          minDistance = thisDistance
          // console.log("thisPoints[1]が最近、続いてthisPoints[0]")
        }else{
          nearPoints.push(thisPoints[1])//2番目に入る
          // console.log("thisPoints[0]が最近、続いてthisPoints[1]")
        }
        for(let j=2;j<thisPath.points.length;j++){
          thisDistance = distance([this.x,this.y],[thisPoints[j][0],thisPoints[j][1]-menuHeight])
          if(thisDistance<minDistance){
            nearPoints.unshift(thisPoints[j])//1番目に入る
            // console.log("thisPoints["+i+"]が最近になりました")
            minDistance = thisDistance
          }
        }
      }
      // console.log("nearPoints: "+nearPoints[0])
      let wallVec = diff(nearPoints[0],nearPoints[1])
      // this.x = Math.floor(this.x)
      // this.y = Math.floor(this.y)
      dX = this.x - nearPoints[0][0];
      dY = this.y - nearPoints[0][1]+menuHeight;
      // dX =  Math.floor(dX)
      // dY =  Math.floor(dY)
      // console.log("ボール位置: "+this.x+", "+this.y+", 最近点位置: "+nearPoints[0][0]+", "+nearPoints[0][1]+", 相対的位置, "+dX+", "+dY)
      // console.log("速度: "+ this.velX+ ", "+this.velY+",  内積"+(this.velX*dX+this.velY*dY))
      if(this.velX*dX+this.velY*dY<0){//Ballが最近点に近づいているときを判定
        if(nearPoints[0]===thisPoints[0]||nearPoints[0]===thisPoints[thisPoints.length-1]){
          wallVec = [dY,-dX]//最近点が端点のときは
        }else{
          console.log("wallVec: "+wallVec)
          let velVec = new DOMPoint(this.velX,this.velY)
          let r =new DOMMatrix()
          velVec = velVec.matrixTransform(r
            .rotateFromVector(wallVec[0],wallVec[1])
            .scale(1,-1)
            .rotateFromVector(wallVec[0],-wallVec[1])
          )
          this.velX = boundKeisuu*velVec.x
          this.velY = boundKeisuu*velVec.y
        }
        break
      }
    }
  }
}