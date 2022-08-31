const canvases = document.querySelectorAll('canvas');
const layers= document.querySelector('.layers');
const ui2Layer = document.querySelector('.ui2-layer');
const uiLayer = document.querySelector('.ui-layer');
const activeLayer = document.querySelector('.active-layer');
const visibleLayer = document.querySelector('.visible-layer');
const backLayer = document.querySelector('.back-layer');
const ui2Ctx = ui2Layer.getContext('2d');
const uiCtx = uiLayer.getContext('2d');
const activeCtx = activeLayer.getContext('2d');
const visibleCtx = visibleLayer.getContext('2d');
const backCtx = backLayer.getContext("2d")

ui2Ctx.name = "ui2Ctx"
uiCtx.name = "uiCtx"
activeCtx.name =  "activeCtx"
visibleCtx.name = "visibleCtx"
backCtx.name = "backCtx"

const menuHeight = 85
const width = window.innerWidth;
const height = window.innerHeight;

for(let i=0;i<canvases.length;i++){
  canvases[i].width = width
  canvases[i].height = height
  // ツールバーの分をずらす
  canvases[i].getContext('2d').translate(0,-menuHeight)
  canvases[i].getContext('2d').lineJoin = 'round';
  canvases[i].getContext('2d').lineCap = 'round';
}

activeCtx.clearRect(-width/3,-height/3,width*4/3,height*4/3)

visibleCtx.fillStyle = 'rgb(0,0,0)';
visibleCtx.fillRect(-width/3,-height/3,width*4/3,height*4/3);


const colorPicker = document.querySelector('input[type="color"]');
const sizePicker = document.querySelector('.pensize');
const pensizeOutput = document.querySelector('.pensizeOutput');
const eraseSizePicker = document.querySelector('.erasesize');
const erasesizeOutput = document.querySelector('.erasesizeOutput');

let selectedPathes =[]

sizePicker.value = localStorage.getItem('size')
pensizeOutput.textContent = sizePicker.value
eraseSizePicker.value = localStorage.getItem('eraseSize')
erasesizeOutput.textContent = eraseSizePicker.value

colorPicker.value = localStorage.getItem('color')


// ||  ボタンの実装

sizePicker.addEventListener('input', function(){
  pensizeOutput.textContent = sizePicker.value
  localStorage.setItem('size',sizePicker.value)
});
eraseSizePicker.addEventListener('input', function(){
  erasesizeOutput.textContent = eraseSizePicker.value
  localStorage.setItem('eraseSize',eraseSizePicker.value)
});

colorPicker.addEventListener('chenge', function(){
  localStorage.setItem('color',colorPicker.value)
});

const Btns = document.querySelectorAll('button');

let pressed = false

let mode = "write"

function chengeToMode(m){
  mode = m
  for(let i=0;i<Btns.length-3;i++){
    Btns[i].setAttribute("status","off")
    }
  switch(m){
    case "write":
      Btns[0].setAttribute("status","on")
      break
    case "line":
    case "ellipse":
    case "curve":
      Btns[1].setAttribute("status","on")
      break
    case "erase":
      Btns[2].setAttribute("status","on")
      break
    case "select":
    case "selected":
    case "transform":
    case "translate":
    case "rotate":
    case "scale":
    case "copy":
      Btns[3].setAttribute("status","on")
      break
  }
  layers.setAttribute("class",m)
  console.log(m)
}

// clearBtn.addEventListener('click',zensyoukyo)

for(let i=0;i<Btns.length-3;i++){
  Btns[i].addEventListener("click",setMode)
  }

function setMode(e){
  nonActiveAll()
  chengeToMode(e.target.getAttribute("class"))
}

// Btns[3].removeEventListener("click",setMode)
// Btns[3].addEventListener("click",Kirikae)

//カーソルデザイン変更

// function Kirikae(e){
//   if(mode!=="sentaku"){
//     chengeToMode("sentaku"
//     canvas.setAttribute("class",mode)
//     e.target.textContent = "選択"
//   }else{
//     mode ="idou"
//     canvas.setAttribute("class",mode)
//     e.target.textContent =  "移動"
//   }
// }

// ||ショートカットキー

window.addEventListener("keydown",function(e){
  console.log(e.key)
  switch(e.key){
    case "z":Btns[0];
    break;
    case "x":Btns[1];
    break;
    case "c":Btns[2];
    break;
    case "a":Btns[3];
    break;
    case "s":Btns[4];
    break;
    case "d":Btns[5];
    break;
    case "f":Btns[6];
    break;
  }
})

// Btn[i].textContent += " (Z)"
// undoBtn.textContent += " (X)"
// clearBtn.textContent += " (C)"

// 関数集
function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function conj(p1){
  return [p1[0],-p1[1]]
}

function sum(p1,p2){
  return [p1[0]+p2[0],p1[1]+p2[1]]
}

function diff(p1,p2){
  return [p1[0]-p2[0],p1[1]-p2[1]]
}

function times(p1,p2){
  return [p1[0]*p2[0]-p1[1]*p2[1],p1[0]*p2[1]+p1[1]*p2[0]]
}

function dev(p1,p2){
  return [times(p1,conj(p2))[0]/(distance(p2,[0,0])**2),times(p1,conj(p2))[1]/(distance(p2,[0,0])**2)]
}

function innerProduct(p1,p2){
  return p1[0]*p2[0]+p1[1]*p2[1]
}

function crossProduct(p1,p2){
  return p1[0]*p2[1]-p1[1]*p2[0]
}


function distance(p1,p2){
  return Math.hypot(p1[0]-p2[0],p1[1]-p2[1])
}

function midPoint(p1,p2){
  return [(p1[0]+p2[0])/2,(p1[1]+p2[1])/2]
}

function symmetryPointAbout(p0,p){
  return diff([2*p0[0],2*p0[1]],p)
}




function norm(p){
  return Math.sqrt(p[0]**2+p[1]**2)
}

function denotedByComplex(p0,p1,p2){
  return dev(diff(p0,p1),diff(p2,p1))
}







// || 全消去

let massara = true

Btns[4].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  visibleCtx.clear()
  visibleCtx.fillStyle = 'rgb(0,0,0)';
  visibleCtx.fillRect(-width/3,-height/3,width*5/3,height*5/3);
  visibleCtx.pathes = []
  console.log("全消去")
});

// ||戻る

Btns[5].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  visibleCtx.restore()
  console.log("戻る")
})

// ||取り消す

Btns[6].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  console.log("取り消す")
})

// ||マウス座標データの蓄積

// let curX
// let curY

// function addStrokeP(e){
//   curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
//   curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
// }

//グローバルな可変変数

let path
let points = []

let inP = new DOMPoint()
let outP = new DOMPoint()
let complex = []

let minX
let minY
let maxX
let maxY

let dx = 0
let dy = 0

let w
let h
let s
let center

let deleteCount

let activeImage
let uiImage
let ui2Image

let timer1




// || 'pointerdown'の振る舞い
layers.addEventListener('pointerdown', function(e){
  e.preventDefault();
  pressed = true
  inP.x = minX = maxX = e.x;
  inP.y = minY = maxY = e.y;
  switch(mode){
  case "write":
    path = new Path2D();
    path.addId(colorPicker.value,sizePicker.value,[[e.x,e.y]])
    path.arc(e.x,e.y,path.lineWidth/100,0,Math.PI*2)
    activeCtx.display(path)
    timer1 = setTimeout(()=>{
      nonActiveAll()
      chengeToMode("select")
    },500)
    break;
    
  case "line":
    activeCtx.lineWidth = sizePicker.value
    activeCtx.strokeStyle  = colorPicker.value
    inP.x = tenHosei([e.x,e.y])[0]
    inP.y = tenHosei([e.x,e.y])[1]
    break

  case "erase":
    erase(e)
    break

  case "select":
    select(e)
    break;

  case "selected":
    activeImage = activeCtx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
    uiImage = uiCtx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
    backCtx.lineWidth = nagenawaWidth+Number(sizePicker.value);
    for(let i=0;i<activeCtx.pathes.length;i++){
      if(backCtx.isPointInStroke(activeCtx.pathes[i],e.x,e.y-menuHeight)){
        break
      }
      if(i===activeCtx.pathes.length-1){
        nonActiveAll()
        chengeToMode("select")
      }
    }
    break

  case "transform":
    switch(true){
    case uiCtx.isPointInPath(uiCtx.pathes[5],e.x,e.y-menuHeight,"nonzero"):
      uiCtx.clear()
      ui2Ctx.draw(uiCtx.pathes[5])
      ui2Image = ui2Ctx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
      uiCtx.pathes.pop()
      for(let i =0;i<uiCtx.pathes.length;i++){
        uiCtx.display(uiCtx.pathes[i])
      }
      chengeToMode("center")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[1],e.x,e.y-menuHeight,"nonzero"):
      activeCtx.clear()
      activeCtx.pathes = []
      uiCtx.clear()
      uiCtx.pathes = []
      console.log("deleteしました。")
      chengeToMode("select")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[2],e.x,e.y-menuHeight,"nonzero"):
      chengeToMode("rotate")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[3],e.x,e.y-menuHeight,"nonzero"):
      chengeToMode("scale")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[4],e.x,e.y-menuHeight,"nonzero"):
      activeImage = activeCtx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
      uiImage = uiCtx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
      for(let i=0;i<activeCtx.pathes.length;i++){
        const copy = activeCtx.pathes[i]
        copy.id = id;
        id++;
        visibleCtx.draw(copy)
      }
      chengeToMode("copy")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[0],e.x,e.y-menuHeight,"nonzero"):
      activeImage = activeCtx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
      uiImage = uiCtx.getImageData(-width/3,-height/3,width*5/3,height*5/3)
      mode ="translate"
      console.log(mode)
      break;
    default:
      nonActiveAll()
      chengeToMode("select")
    }
    break;
  }
  console.log(backCtx.pathes.length+", "+visibleCtx.pathes.length+", "+activeCtx.pathes.length+", "+uiCtx.pathes.length+", "+ui2Ctx.pathes.length+", "+mode+"での描き始め")
});




// Shape検出のルール

function chengeToShape(e) {
  const d = distance([inP.x,inP.y],[e.x,e.y])
  w = maxX-minX
  h = maxY-minY
  s = Math.sqrt(w**2+h**2)
  center = midPoint([minX,minY],[maxX,maxY])
  console.log(d+","+w+","+h+","+s)
  switch(true){
    case d/s>0.9:
      activeCtx.clear()
      activeCtx.beginPath()
      activeCtx.moveTo(inP.x,inP.y)
      activeCtx.lineTo(e.x,e.y)
      activeCtx.stroke()
      chengeToMode("line");
      break;
    case d/s<0.3:
      path = new Path2D()
      activeCtx.clear()
      if(Math.abs(w/h-1)<0.25){
        path.ellipse(center[0],center[1],(w+h)/4,(w+h)/4,0,0,2*Math.PI)  
      }else{
        path.ellipse(center[0],center[1],w/2,h/2,0,0,2*Math.PI)
      }
      activeCtx.draw(path)
      inP.x =e.x;
      inP.y =e.y;
      chengeToMode("ellipse");
      console.log(mode)
      break;
    case inP.x<minX+h/10||e.x<minX+h/10:
      const p = [inP.x,inP.y]
      const q = [e.x,e.y]
      const m = midPoint(p,q)
      let i = 0
      while(path.points[i][0]>m[0]){i++}
      const r = midPoint(path.points[i-1],path.points[i])
      const c = symmetryPointAbout(r,m)
      path = new Path2D()
      path.moveTo(p[0],p[1])
      path.quadraticCurveTo(c[0],c[1],q[0],q[1])
      activeCtx.clear()
      // path.addPath(colorPicker.value,sizePicker.value,[p,r,q])
      activeCtx.draw(path)
      inP.x =e.x;
      inP.y =e.y;
      chengeToMode("curve");
    // default:
    //   activeCtx.clear()
    //   path = smoothedPath(path,3)
    //   activeCtx.draw(path)
    //   chengeToMode("curve";
    //   console.log(mode)
  }
}

function displayCurvatureRadius(points) {
  const level = 10
  const n = points.length
  if(n>=level+3){
    while(points.length>n-level){
      let newpoints = []
      for(let i=0;i<points.length-1;i++){
        newpoints.push(midPoint(points[i],points[i+1]))
      }
      points = newpoints
    }
    const r = curvatureRadius(points[0],points[1],points[2])
    activeCtx.fillStyle = colorPicker.value
    activeCtx.fillRect(n-3,menuHeight*2,3,100/r)
  }
}

function curvatureRadius(p0,p1,p2){
  const a = diff(p0,p1);
  const b = diff(p2,p1);
  const cos = innerProduct(a,b)/norm(a)/norm(b)
  const theta = Math.acos(cos)
  const d = distance(p0,p2);
  const sgn =  Math.sign(crossProduct(a,b))
  const r = d/(2*Math.sin(theta))
  // console.log(r*sgn/d)
  return r*sgn/d
}





// || 'pointermove'の振る舞い
layers.addEventListener('pointermove', function(e){
  e.preventDefault();
  minX =  Math.min(minX,e.x)
  minY =  Math.min(minY,e.y)
  maxX =  Math.max(maxX,e.x)
  maxY =  Math.max(maxY,e.y)
  dx = e.x - inP.x 
  dy = e.y - inP.y
  if(pressed){
    console.log(mode+"で書いている")
    switch(mode){
    case "write":
      clearTimeout(timer1)
      path.writeTo(path.points[0],[e.x,e.y])
      path.points.unshift([e.x,e.y])
      activeCtx.display(path)
      timer1 = setTimeout(()=>{chengeToShape(e)},200)
      setTimeout(()=>{displayCurvatureRadius(path.points)})
      break
    case "line"://ShapeModeに移行したい
      activeCtx.clear()
      activeCtx.beginPath()
      activeCtx.moveTo(inP.x,inP.y)
      activeCtx.lineTo(e.x,e.y)
      activeCtx.stroke()
      break

    case "erase":
      erase(e)
      break

    case "select":
      select(e)
      break

    case "selected":
      if(distance([e.x,e.y],[inP.x,inP.y])>=5){
        chengeToMode("translate")
      }
      break
    
    case "translate":
    case "copy":
      activeCtx.clear() 
      activeCtx.putImageData(activeImage,dx,dy)    
      uiCtx.clear()
      uiCtx.putImageData(uiImage,dx,dy)     
      break

    case "center":
      ui2Ctx.clear()
      ui2Ctx.putImageData(ui2Image,dx,dy)
      break

    case "scale":
    case "rotate":
    case "ellipse"://ShapeModeに移行したい
    case "curve"://ShapeModeに移行したい
      let p = [e.x,e.y]
      complex = denotedByComplex(p,center,[inP.x,inP.y])
      if(mode==="scale"){
        complex = [norm(complex),0]
      }else if(mode==="rotate"){
        complex = [complex[0]/norm(complex),complex[1]/norm(complex)];
      }
      activeCtx.transformedPathes(center,complex)
      uiCtx.transformedPathes(center,complex)
      break;
    }
  }
});

let nagenawaWidth = 10

// || 'pointerup'の振る舞い
layers.addEventListener('pointerup', function(e){
  e.preventDefault();
  pressed = false
  const m = new DOMMatrix();
      m.a = 1; m.b = 0;
      m.c = 0; m.d = 1;
      m.e = dx ; m.f = dy;
  console.log(mode+"で描きおわる")
  switch(mode){
    case "write":
      clearTimeout(timer1)
      nonActiveAll()
      visibleCtx.draw(path)
      mode ="write";
      console.log(mode+" に戻る")
      break;
    case "line":
      outX = tenHosei([e.x,e.y])[0]
      outY = tenHosei([e.x,e.y])[1]
      path = new Path2D();
      path.moveTo(inP.x,inP.y)
      path.lineTo(outX,outY)
      path.addId(colorPicker.value,sizePicker.value,[[inP.x,inP.y],[outX,outY]])
      nonActiveAll()
      visibleCtx.draw(path)
      hoseitenGroup.push([inP.x,inP.y],[outX,outY])
      chengeToMode("write")
      break;

    case "ellipse":
    case "curve":
      path.addId(colorPicker.value,sizePicker.value,[[minX,minY],[maxX,maxY]])//ポイント情報が意味を成していない
      activeCtx.transformPathes(center,complex)
      activeCtx.pathes[0].lineWidth = sizePicker.value
      // nonActiveAll()
      chengeToMode("transform")
      createUi()
      break;

    case "erase":
      activeCtx.clear();
      if(deleteCount===0){
        chengeToMode("write")
      }else{
        deleteCount=0
      }
      break

    case "select":
      console.log(activeCtx.pathes)
      if(activeCtx.pathes.length!==0){
        chengeToMode("selected")
      }else{
        chengeToMode("write")
      }
      break

    case "selected":
      createUi()
      chengeToMode("transform")
      break


    case "scale":
    case "rotate":
      activeCtx.transformPathes(center,complex)
      uiCtx.transformPathes(center,complex)
      chengeToMode("transform")
      break

    case "center":
      uiCtx.draw(ui2Ctx.pathes[0].transformedByMatrix(m))
      ui2Ctx.clear()
      ui2Ctx.pathes = []
      center = [center[0]+dx,center[1]+dy]
      mode ="transform"
      console.log(mode+" に戻る")
      break;
    
    case "translate":
    case "copy":
      for(let i=0;i<activeCtx.pathes.length;i++){
        const newpath = activeCtx.pathes[i].transformedByMatrix(m)
        activeCtx.pathes.splice(i,1,newpath)
      }
      if(uiCtx.pathes.length!==0){
        for(let i=0;i<uiCtx.pathes.length;i++){
          const newpath = uiCtx.pathes[i].transformedByMatrix(m)
          uiCtx.pathes.splice(i,1,newpath)
          uiCtx.display(newpath)
        }
        // createUi()
        center = [center[0]+dx,center[1]+dy]
        chengeToMode("transform")
      }else{
        chengeToMode("selected")
      }
      break    
    

  }
  console.log(backCtx.pathes.length+", "+visibleCtx.pathes.length+", "+activeCtx.pathes.length+", "+uiCtx.pathes.length+", "+ui2Ctx.pathes.length+", "+mode)
});




// ポインターの位置"e"を変数とする関数
function erase(e){
  activeCtx.clear()
  activeCtx.fillStyle = "white"
  activeCtx.beginPath()
  activeCtx.arc(e.x,e.y,eraseSizePicker.value/2,0,2*Math.PI)
  activeCtx.fill()
  for(let i=0;i<visibleCtx.pathes.length;i++){
    backCtx.lineWidth = Number(eraseSizePicker.value)+Number(sizePicker.value);
    if(backCtx.isPointInStroke(visibleCtx.pathes[i],e.x,e.y-menuHeight,"nonzero")){
      visibleCtx.delete(visibleCtx.pathes[i])
      deleteCount++
      i--
    }
  }
}

function select(e){
  for(let i=0;i<visibleCtx.pathes.length;i++){
    backCtx.lineWidth = nagenawaWidth+Number(sizePicker.value);
    if(backCtx.isPointInStroke(visibleCtx.pathes[i],e.x,e.y-menuHeight,"nonzero")){
      visibleCtx.pathes[i].active()
      i--
    }
  }
}




// || "CanvasRenderingContext2D" のプロパティとメソッドを追加する

backCtx.pathes = []
visibleCtx.pathes = []
activeCtx.pathes = []
uiCtx.pathes = []
ui2Ctx.pathes = []


CanvasRenderingContext2D.prototype.display = function(path){
  this.lineWidth = path.lineWidth
  this.strokeStyle = path.strokeStyle
  this.fillStyle = path.fillStyle
  this.stroke(path)
}

CanvasRenderingContext2D.prototype.draw = function(path){
  this.display(path)
  this.pathes.push(path)
  console.log(path.id + "を" + this.name + "に draw しました")
}

CanvasRenderingContext2D.prototype.clear = function(){
  this.clearRect(-width/3,-height/3,width*5/3,height*5/3)
}

CanvasRenderingContext2D.prototype.delete =  function(path){
  const index = this.pathes.indexOf(path)
  this.pathes.splice(index,1)
  this.clear()
  this.fillStyle = 'rgb(0,0,0)';
  this.fillRect(-width/3,-height/3,width*5/3,height*5/3);
  for(let i=0;i<this.pathes.length;i++){
    this.display(this.pathes[i])
  }
  console.log(path.id+" を "+this.name+" から消しました。")
}

CanvasRenderingContext2D.prototype.transformedPathes = function(center,complex){
  const r = new DOMMatrix();
  r.a = 1; r.b = 0;
  r.c = 0; r.d = 1;
  r.e = -center[0]; r.f = -center[1];
  const p = new DOMMatrix();
  p.a = complex[0]; p.b = complex[1];
  p.c = -complex[1]; p.d = complex[0];
  p.e = center[0]; p.f = center[1];
  this.clear()
  let pathes =[]
  for(let i=0;i<this.pathes.length;i++){
    const newpath = this.pathes[i].transformedByMatrix(r).transformedByMatrix(p)
    pathes.push(newpath)
    this.display(newpath)
  }
  // console.log(center+"を中心にして" + this.name +"のPathesに"+complex+"をかけたものを描いています。")
  return pathes
}


// function denotedByMatrix(center,complex){
//   let p = new DOMMatrix();
//   p.translateSelf(complex)
//   p.scaleSelf()
//   p.a = complex[0]; p.b = complex[1];
//   p.c = -complex[1]; p.d = complex[0];
//   p.e = center[0]; p.f = center[1];
//   return p.multiplySelf(DOMMatrix([1,0,0,1,-center[0],-center[1]]))
// }


CanvasRenderingContext2D.prototype.transformPathes = function(center,complex){
  const r = new DOMMatrix();
  r.a = 1; r.b = 0;
  r.c = 0; r.d = 1;
  r.e = -center[0]; r.f = -center[1];
  const p = new DOMMatrix();
  p.a = complex[0]; p.b = complex[1];
  p.c = -complex[1]; p.d = complex[0];
  p.e = center[0]; p.f = center[1];
  this.clear()
  // let pathes =[]
  for(let i=0;i<this.pathes.length;i++){
    const newpath = this.pathes[i].transformedByMatrix(r).transformedByMatrix(p)
    // pathes.push(newpath)
    this.pathes.splice(i,1,newpath)
    this.display(newpath)
  }
  console.log(center+"を中心にして" + this.name +"のPathesを"+complex+"をかけたものに置き換えました")
}

// "Path2D"ののプロバティとメソッドを追加。

let id = 1

Path2D.prototype.addId =  function(strokeStyle,lineWidth,points){
  this.strokeStyle = strokeStyle
  this.lineWidth = lineWidth
  this.points = points
  this.id = id
  id++
  console.log("id : "+ this.id +" を登録しました")
  console.dir(this)
}

Path2D.prototype.active =  function(){
  activeCtx.strokeStyle = "rgba(255, 173, 105, 50)"
  activeCtx.lineWidth = Number(this.lineWidth)+nagenawaWidth
  activeCtx.stroke(this)
  visibleCtx.delete(this)
  activeCtx.draw(this)
  console.log(
    this.id+"を Active にしました。"
  )
}

Path2D.prototype.writeTo = function(p1,p2){
  const x = midPoint(p1,p2)[0]
  const y = midPoint(p1,p2)[1]
  this.quadraticCurveTo(p1[0],p1[1],x,y)
}


// "DOMMatrix"のメソッド追加

//DOMMatrixによるPathの変換
Path2D.prototype.transformedByMatrix = function(matrix){
  let newpath = new Path2D()
  newpath.addPath(this,matrix)
  newpath.points= []
  if(this.points){
    for(let j=0;j<this.points.length;j++){
      const x= this.points[j][0]
      const y= this.points[j][1]
      let point = new DOMPoint(x,y)
      point = point.matrixTransform(matrix)
      newpath.points.push([point.x,point.y])
    }
  }
  // const scale = Math.sqrt(matrix.det())
  newpath.strokeStyle = this.strokeStyle
  newpath.lineWidth = this.lineWidth//*scale //太さを維持するか
  newpath.id = this.id
  
  return newpath
}

  DOMMatrix.prototype.det = function(){
    return this.a*this.d-this.b*this.c
  }







// Active解除

function nonActiveAll() {
  uiCtx.clear()
  uiCtx.pathes = []
  if(activeCtx.pathes.length>0){
    for(let i=0;i<activeCtx.pathes.length;i++){
      const path = activeCtx.pathes[i]
      visibleCtx.draw(path)
    }
  }
  activeCtx.clear()
  activeCtx.pathes = []
  
}



// 変換UIの作成

uiCtx.strokeStyle = ui2Ctx.strokeStyle = "white"
uiCtx.fillStyle = ui2Ctx.fillStyle = "red"
uiCtx.lineWidth = ui2Ctx.lineWidth = 1
uiCtx.btnSize = ui2Ctx.btnSize = 15
uiCtx.pathes =ui2Ctx.pathes = []

function createUi() {
  if(activeCtx.pathes.length!==0){
    let minX = activeCtx.pathes[0].points[0][0]
    let minY = activeCtx.pathes[0].points[0][1]
    let maxX = minX
    let maxY = minY
    for(let i=0;i<activeCtx.pathes.length;i++){
      for(let j=0;j<activeCtx.pathes[i].points.length;j++){
        minX =  Math.min(minX,activeCtx.pathes[i].points[j][0]-activeCtx.pathes[i].lineWidth/2-nagenawaWidth/2)
        minY =  Math.min(minY,activeCtx.pathes[i].points[j][1]-activeCtx.pathes[i].lineWidth/2-nagenawaWidth/2)
        maxX =  Math.max(maxX,activeCtx.pathes[i].points[j][0]+activeCtx.pathes[i].lineWidth/2+nagenawaWidth/2)
        maxY =  Math.max(maxY,activeCtx.pathes[i].points[j][1]+activeCtx.pathes[i].lineWidth/2+nagenawaWidth/2)
      }
    }
    const w = maxX-minX
    const h = maxY-minY
    uiCtx.btnSize = (w+h)/40
    center = midPoint([minX,minY],[maxX,maxY])
    //四角
    path = new Path2D()
    path.rect(minX,minY,w,h)
    // path.closePath()
    uiCtx.draw(path)
    //削除ボタン
    path = new Path2D()
    path.arc(minX,minY,uiCtx.btnSize*1.4,0,2*Math.PI)
    path.moveTo(minX-uiCtx.btnSize,minY-uiCtx.btnSize)
    path.lineTo(minX+uiCtx.btnSize,minY+uiCtx.btnSize)
    path.moveTo(minX-uiCtx.btnSize,minY+uiCtx.btnSize)
    path.lineTo(minX+uiCtx.btnSize,minY-uiCtx.btnSize)
    // path.closePath()
    uiCtx.draw(path)
    //回転ボタン
    path = new Path2D()
    path.arc(minX,maxY,uiCtx.btnSize,0,2*Math.PI)
    path.arc(minX,maxY,uiCtx.btnSize*2/3,0,2*Math.PI)
    path.arc(minX,maxY,uiCtx.btnSize*4/3,0,2*Math.PI)
    // path.closePath()
    uiCtx.draw(path)
    //伸縮ボタン
    path = new Path2D()
    path.rect(maxX,maxY,uiCtx.btnSize*2,uiCtx.btnSize*2)
    path.rect(maxX,maxY,uiCtx.btnSize*2/3,uiCtx.btnSize*2/3)
    path.rect(maxX,maxY,uiCtx.btnSize*4/3,uiCtx.btnSize*4/3)
    // path.closePath()
    uiCtx.draw(path)
    //複製ボタン
    path = new Path2D()
    path.arc(maxX,minY,uiCtx.btnSize,0,2*Math.PI)
    path.arc(maxX-uiCtx.btnSize/3,minY-uiCtx.btnSize/3,uiCtx.btnSize,0,2*Math.PI)
    path.arc(maxX+uiCtx.btnSize/3,minY+uiCtx.btnSize/3,uiCtx.btnSize,0,2*Math.PI)
    // path.closePath()
    uiCtx.draw(path)
    //センターアンカー
    path = new Path2D()
    path.arc(center[0],center[1],uiCtx.btnSize,0,2*Math.PI)
    path.moveTo(center[0],center[1]-uiCtx.btnSize/2)
    path.lineTo(center[0],center[1]+uiCtx.btnSize/2)
    path.moveTo(center[0]-uiCtx.btnSize/2,center[1])
    path.lineTo(center[0]+uiCtx.btnSize/2,center[1])
    // path.closePath()
    uiCtx.draw(path)
    console.log(minX + "," + minY + "," +maxX + "," +maxY+ "の変換UIを表示しました")
  }
}








// 端点補正と補正点の記録

let hoseitenGroup =[] 

function tenHosei(point){ 
  let hoseiPoint= point
  for(let i = 1; i<hoseitenGroup.length;i++){
    let d = distance(hoseiPoint,hoseitenGroup[i])
    if((d>0)&&(d<20)){
      // return [thisX,thisY]
      hoseiPoint = hoseitenGroup[i]
      break;
    }
    // console.log(thisX+","+thisY)
  }
  hoseitenGroup.push(hoseiPoint)
  return hoseiPoint
}

// あたり判定がある場所
function atatterubasyo(){
  for(let k=0;k<visibleCtx.pathes.length;k++){
    for(let i=0;i<width;i+=10){
      for(let j=0;j<height;j+=10){
        if(backCtx.isPointInPath(deleteBtn,i,j-menuHeight)){
          visibleCtx.beginPath()
          visibleCtx.fillStyle ="yellow"
          visibleCtx.arc(i,j,5,0,2*Math.PI)
          visibleCtx.fill()
          visibleCtx.strokeStyle = colorPicker.value
        }
      }
    }
  }
  console.log("あたり判定がある場を所調べました")
}