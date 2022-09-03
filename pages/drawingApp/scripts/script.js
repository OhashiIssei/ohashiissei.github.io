const canvases = document.querySelectorAll('canvas');
const layers= document.querySelector('.layers');

//Layerは
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

//consoleのためにnameをつけておく
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
  canvases[i].getContext('2d').translate(0,-menuHeight);// ツールバーの分をずらす
  canvases[i].getContext('2d').lineJoin = 'round';// stroke繋ぎ目のデザイン
  canvases[i].getContext('2d').lineCap = 'round';// stroke端のデザイン
}

backCtx.fillStyle = 'rgb(0,0,0)';//背景は黒
backCtx.fillRect(-width/3,-height/3,width*4/3,height*4/3);

//色とサイズの取得
const colorPicker = document.querySelector('input[type="color"]');
const sizePicker = document.querySelector('.pensize');
const pensizeOutput = document.querySelector('.pensizeOutput');
const eraseSizePicker = document.querySelector('.erasesize');
const erasesizeOutput = document.querySelector('.erasesizeOutput');

let selectedPathes =[]


//ローカルストレージから履歴を取得
sizePicker.value = localStorage.getItem('size')
pensizeOutput.textContent = sizePicker.value
eraseSizePicker.value = localStorage.getItem('eraseSize')
erasesizeOutput.textContent = eraseSizePicker.value

colorPicker.value = localStorage.getItem('color')


// ||  ボタンの実装

sizePicker.addEventListener('input', function(){
  pensizeOutput.textContent = sizePicker.value
  if(activeCtx.pathes.length>0){//ペンサイズの再設定
    activeCtx.clear()
    for(let i=0;i<activeCtx.pathes.length;i++){
      activeCtx.pathes[i].lineWidth = sizePicker.value
      activeCtx.display(activeCtx.pathes[i])
      console.log(activeCtx.pathes[i].id+"の太さを"+sizePicker.value+"に再設定しました")
    }
    // sizePicker.value = localStorage.getItem('size')
    // pensizeOutput.textContent = sizePicker.value
  }
  localStorage.setItem('size',sizePicker.value)//保存
});
eraseSizePicker.addEventListener('input', function(){
  erasesizeOutput.textContent = eraseSizePicker.value
  localStorage.setItem('eraseSize',eraseSizePicker.value)//保存
});

colorPicker.addEventListener('change', function(){
  if(activeCtx.pathes.length>0){//色の再設定
    for(let i=0;i<activeCtx.pathes.length;i++){
      activeCtx.pathes[i].strokeStyle = colorPicker.value
      activeCtx.display(activeCtx.pathes[i])
      console.log(activeCtx.pathes[i].id+"の色を"+colorPicker.value+"に再設定しました")
    }
    colorPicker.value = localStorage.getItem('color')
  }
  localStorage.setItem('color',colorPicker.value)//保存
});

const modeBtns = document.querySelectorAll('.modebar button');
const otherBtns = document.querySelectorAll('.rightbar button');
const Btns = document.querySelectorAll('button');

let pressed = false

let mode = "write"

function changeToMode(m){
  mode = m
  for(let i=0;i<modeBtns.length;i++){
    modeBtns[i].setAttribute("status",NaN)
    }
  switch(m){
    case "write":
      modeBtns[0].setAttribute("status","on")
      break
    case "line":
    case "ellipse":
    case "curve":
      modeBtns[1].setAttribute("status","on")
      break
    case "erase":
      modeBtns[2].setAttribute("status","on")
      break
    case "select":
    case "selected":
    case "transform":
      modeBtns[3].setAttribute("status","on")
      break
    case "graph":
      modeBtns[4].setAttribute("status","on")
      break
  }
  layers.setAttribute("class",m)
  console.log(m)
}

// addAxis([width/2,height/2],width/4,height/4,width*3/4,height*3/4)
// drawGraph(scale)
// checkAxisLines()

//ボタンをクリックしてモード切り替え
for(let i=0;i<modeBtns.length;i++){
  Btns[i].addEventListener("click",setMode)
  }

//ボタン以外でも切り替えられるように関数を定義
function setMode(e){
  nonActiveAll()
  changeToMode(e.target.getAttribute("class"))
}

//"operater"の管理
let operate=NaN

function startOperate(operateName){
  operate = operateName
  console.log("startOperate: "+operate)
}

function  endOperate(){
  console.log("endOperate: "+operate)
  operate = NaN
}

// ||ショートカットキー
const keys = ["a","s","d","f","g","z","x","c","v","b","n","m"]
for(let i=0;i<Btns.length;i++){
  Btns[i].textContent += " ("+keys[i].charAt(0).toUpperCase()+")"
}
window.addEventListener("keydown",function(e){
  if(pressed){
    console.log("描画中はコマンド無効")
  }else{
    console.log(e.key)
    for(let i=0;i<Btns.length;i++){
      if(e.key===keys[i]){
        nonActiveAll()
        changeToMode(Btns[i].getAttribute("class"))
        break
      }
    }
  }
})



//グラフ生成

Btns[4].addEventListener("click",function(){
  changeToMode("graph")
  originP = [width/2,height/2]
  addAxis([width/2,height/2],width/4,height/4,width*3/4,height*3/4)
  graphAsk()
  createUi()
  drawGraph(scale)
})



// || 全消去


Btns[6].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  visibleCtx.clear()
  visibleCtx.pathes = []
  console.log("全消去")
  changeToMode("write")
});

// ||戻る

Btns[7].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  visibleCtx.restore()
  console.log("戻る")
})

// ||取り消す

Btns[8].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  console.log("取り消す")
})


// シミュレーション開始
let symurate=false

Btns[9].addEventListener("click",function(e){
  e.preventDefault();
  nonActiveAll()
  if(symurate){
    symurate=false
    console.log("ボールOFF")
  }else{
    symurate=true
    createManyBall()
    console.log("ボールON")
  }
  // console.log("ボール")
})

// ||マウス座標データの蓄積



// function addStrokeP(e){
//   curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
//   curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
// }

//グローバルな可変変数

let path
let points = []

let inP = new DOMPoint()
let outP = new DOMPoint()
let curX
let curY
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
  inP.x = e.x;
  inP.y = e.y;
  switch(mode){
  case "write":
    minX = maxX = e.x;
    minY = maxY = e.y;
    path = new Path2D();
    path.addId(colorPicker.value,sizePicker.value,[[e.x,e.y]])
    path.arc(e.x,e.y,path.lineWidth/100,0,Math.PI*2)
    activeCtx.beginPath()
    activeCtx.display(path)
    timer1 = setTimeout(()=>{
      changeToMode("select")
      selectStart(e)
      },500)
    
  case "line":
    activeCtx.lineWidth = sizePicker.value
    activeCtx.strokeStyle  = colorPicker.value
    inP.x = crrection(e)[0]
    inP.y = crrection(e)[1]
    break

  case "ball":
    activeCtx.lineWidth = sizePicker.value/4
    activeCtx.strokeStyle  = colorPicker.value
    break

  case "erase":
    erase(e)
    break

  case "select":
    selectStart(e)
    break

  case "selected":
    if(uiCtx.isPointInPath(path,e.x,e.y-menuHeight)){
    }else{
      changeToMode("select")
      selectStart(e)
    }
    break

  case "transform":
  case "graph":
    switch(true){
    case uiCtx.isPointInPath(uiCtx.pathes[5],e.x,e.y-menuHeight,"nonzero"):
      ui2Ctx.pathes = [uiCtx.pathes[5]]
      ui2Ctx.display(uiCtx.pathes[5])
      uiCtx.pathes.pop()
      uiCtx.clear()
      for(let i =0;i<uiCtx.pathes.length;i++){
        uiCtx.display(uiCtx.pathes[i])
      }
      startOperate("changeCenter")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[1],e.x,e.y-menuHeight,"nonzero"):
      activeCtx.clear()
      activeCtx.pathes = []
      uiCtx.clear()
      uiCtx.pathes = []
      console.log("deleteしました。")
      changeToMode("select")
      selectStart(e)
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[2],e.x,e.y-menuHeight,"nonzero"):
      startOperate("rotate")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[3],e.x,e.y-menuHeight,"nonzero"):
      startOperate("scale")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[4],e.x,e.y-menuHeight,"nonzero"):
      if(mode!=="graph"){
        for(let i=0;i<activeCtx.pathes.length;i++){
          const copy = activeCtx.pathes[i]
          copy.id = id;
          id++;
          visibleCtx.draw(copy)
        }
      }
      startOperate("copy")
      break;
    case uiCtx.isPointInPath(uiCtx.pathes[0],e.x,e.y-menuHeight,"nonzero"):
      startOperate("translate")
      break;
    default:
      changeToMode("select")
      selectStart(e)
    }
    break;
  }
  console.log(backCtx.pathes.length+", "+visibleCtx.pathes.length+", "+activeCtx.pathes.length+", "+uiCtx.pathes.length+", "+ui2Ctx.pathes.length+", "+mode+", "+operate+"での描き始め")
});


function selectStart(e){
  nonActiveAll()
  path = new Path2D();
  path.addId("blue",selectLineWidth,[[e.x,e.y]])
  // path.arc(e.x,e.y,path.lineWidth/100,0,Math.PI*2)
  uiCtx.draw(path)
}

// Shape検出のルール

function changeToShape(e) {
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
      changeToMode("line");
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
      changeToMode("ellipse");
      startOperate("scale")
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
      changeToMode("curve");
      startOperate("scale")
    // default:
    //   activeCtx.clear()
    //   path = smoothedPath(path,3)
    //   activeCtx.draw(path)
    //   changeToMode("curve";
    //   console.log(mode)
  }
}

// function displayCurvatureRadius(points) {
//   const level = 10
//   const n = points.length
//   if(n>=level+3){
//     while(points.length>n-level){
//       let newpoints = []
//       for(let i=0;i<points.length-1;i++){
//         newpoints.push(midPoint(points[i],points[i+1]))
//       }
//       points = newpoints
//     }
//     const r = curvatureRadius(points[0],points[1],points[2])
//     activeCtx.fillStyle = colorPicker.value
//     activeCtx.fillRect(n-3,menuHeight*2,3,100/r)
//   }
// }

// function curvatureRadius(p0,p1,p2){
//   const a = diff(p0,p1);
//   const b = diff(p2,p1);
//   const cos = innerProduct(a,b)/norm(a)/norm(b)
//   const theta = Math.acos(cos)
//   const d = distance(p0,p2);
//   const sgn =  Math.sign(crossProduct(a,b))
//   const r = d/(2*Math.sin(theta))
//   // console.log(r*sgn/d)
//   return r*sgn/d
// }



// || 'pointermove'の振る舞い
layers.addEventListener('pointermove', function(e){
  e.preventDefault();
  // minX =  Math.min(minX,e.x)
  // minY =  Math.min(minY,e.y)
  // maxX =  Math.max(maxX,e.x)
  // maxY =  Math.max(maxY,e.y)
  dx = e.x - inP.x 
  dy = e.y - inP.y
  if(pressed){
    console.log(mode+"で書いている")
    switch(mode){
    case "write":
      minX = Math.min(minX,e.x)
      maxX = Math.max(maxX,e.x)
      minY = Math.min(minY,e.y)
      maxY = Math.max(maxY,e.y)
      clearTimeout(timer1)
      path.writeTo(path.points[0],[e.x,e.y])
      path.points.unshift([e.x,e.y])
      activeCtx.display(path)
      timer1 = setTimeout(()=>{changeToShape(e)},200)
      // setTimeout(()=>{displayCurvatureRadius(path.points)})
      break
    case "line"://ShapeModeに移行したい
      activeCtx.clear()
      activeCtx.beginPath()
      activeCtx.moveTo(inP.x,inP.y)
      outX = crrection(e)[0]
      outY = crrection(e)[1]
      activeCtx.lineTo(outX,outY)
      activeCtx.stroke()
      break
    
    case "ball":
      activeCtx.clear()
      activeCtx.fillStyle = colorPicker.value
      activeCtx.beginPath()
      activeCtx.moveTo(inP.x,inP.y)
      activeCtx.lineTo(e.x,e.y)
      activeCtx.stroke()//直線を引く
      activeCtx.beginPath()
      activeCtx.arc(e.x,e.y,sizePicker.value/2,0,2*Math.PI)
      activeCtx.fill()//ボールをかく
      break

    case "erase":
      activeCtx.clear()
      activeCtx.fillStyle = "white"
      activeCtx.beginPath()
      activeCtx.arc(e.x,e.y,eraseSizePicker.value/2,0,2*Math.PI)
      activeCtx.fill()
      erase(e)//arcに触れるvisibleCtxのpathをdeleteする。
      break

    case "select":
      path.lineTo(e.x,e.y)
      path.arc(e.x,e.y,path.lineWidth/100,0,Math.PI*2)
      uiCtx.display(path)
      break
    
    case "ellipse":
    case "curve":

    case "selected":
    case "transform":
    case "graph":
      switch(operate){
      case "translate":
        activeLayer.style.transform = `translatex(${dx}px) translatey(${dy}px)`
        if(mode!=="graph"){
          uiLayer.style.transform = `translatex(${dx}px) translatey(${dy}px)`
        }
        break
      case "copy":
        uiLayer.style.transform = `translatex(${dx}px) translatey(${dy}px)` 
        activeLayer.style.transform = `translatex(${dx}px) translatey(${dy}px)`
        break

      case "changeCenter":
        ui2Layer.style.transform = `translatex(${dx}px) translatey(${dy}px)`
        break

      case "scale":
      case "rotate":
        let p = [e.x,e.y]
        complex = denotedByComplex(p,center,[inP.x,inP.y])
        switch(operate){
        case "scale":complex = [norm(complex),0];break;
        case "rotate":complex = [complex[0]/norm(complex),complex[1]/norm(complex)];break;
        }
        activeLayer.transformElement(center,complex)
        if(mode!=="graph"){
          uiLayer.transformElement(center,complex)
        }
        break;
      default:
        if(distance([e.x,e.y],[inP.x,inP.y])>=5){
          startOperate("translate")
        }
      }
    }
  }
});

let selectLineWidth = 2
let axisLines = []

// || 'pointerup'の振る舞い
layers.addEventListener('pointerup', function(e){
  e.preventDefault();
  pressed = false
  dx = e.x - inP.x 
  dy = e.y - inP.y
  const m = new DOMMatrix().translate(dx,dy);
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
    if([e.x,e.y]===[inP.x,inP.y]){
      changeToMode("write")
    }else{
      outX = crrection(e)[0]
      outY = crrection(e)[1]
      dx = outX - inP.x 
      dy = outY - inP.y
      path = new Path2D();
      path.moveTo(inP.x,inP.y)
      path.addId(colorPicker.value,sizePicker.value,[])
      const n = Math.max(dx,dy)
      for(let i=1;i<Math.max(dx,dy)+1;i++){
        path.lineTo(inP.x+i/n*dx,inP.y+i/n*dy)  
        path.points.push([inP.x+i/n*dx,inP.y+i/n*dy])
      }
      activeCtx.clear()
      visibleCtx.draw(path)
      hoseitenGroup.push([inP.x,inP.y],[outX,outY])
      checkAxisLines()
    }
    break;

  case "ball":
    createBall(e.x,e.y-menuHeight,(inP.x-e.x)/10,(inP.y-e.y)/10,colorPicker.value,sizePicker.value/2)
    activeCtx.clear()
    break

  case "ellipse":
  case "curve":
    path.addId(colorPicker.value,sizePicker.value,[])//ポイント情報が意味を成していない
    activeCtx.transformPathes(center,complex)
    activeCtx.pathes[0].lineWidth = sizePicker.value
    nonActiveAll()
    changeToMode("write")
    // createUi()
    break;

  case "erase":
    activeCtx.clear();
    if(deleteCount===0){
      changeToMode("write")
    }else{
      deleteCount=0
    }
    break

  case "select":
    path.closePath()
    uiCtx.display(path)
    select(e)
    if(activeCtx.pathes.length!==0){
      changeToMode("selected")
    }else{
      nonActiveAll()
      changeToMode("write")
    }
    break

  case "transform":
  case "selected"://実際にはtranlateの可能性しかない。
    switch(operate){
    case "scale":
    case "rotate":
      activeCtx.transformPathes(center,complex)
      uiCtx.transformPathes(center,complex)
      break

    case "changeCenter":
      ui2Ctx.clear()
      ui2Layer.style.removeProperty("transform")
      const newpath = ui2Ctx.pathes[0].transformedByMatrix(m)
      ui2Ctx.pathes = []
      uiCtx.draw(newpath)
      center = [center[0]+dx,center[1]+dy]
      break;
    
    case "translate":
    case "copy":
      //uiCtxの移動か、selectPathの移動か
      
      activeCtx.clear()//activeCtxの変換
      activeCtx.canvas.style.removeProperty("transform")
      for(let i=0;i<activeCtx.pathes.length;i++){
        const newpath = activeCtx.pathes[i].transformedByMatrix(m)
        activeCtx.pathes.splice(i,1,newpath)
        activeCtx.display(newpath)
      }
      center = [center[0]+dx,center[1]+dy]
      uiCtx.clear()//uiCtxの変換
      uiCtx.canvas.style.removeProperty("transform");
      for(let i=0;i<uiCtx.pathes.length;i++){
        path = uiCtx.pathes[i].transformedByMatrix(m)
        uiCtx.pathes.splice(i,1,path)
        uiCtx.display(path)
      }
      break;
    default:
      uiCtx.delete(path)
      createUi()
      changeToMode("transform")
    }
    break

    case "graph":
      switch(operate){
      case "scale":
      case "rotate":
        activeCtx.canvas.style.removeProperty("transform")
        activeCtx.canvas.style.removeProperty("transformOrigin")
        // activeCtx.transformPathes(center,complex)
        //originPの移動
        console.log(originP)
        const p = new DOMPoint(originP[0],originP[1])
        const r = new DOMMatrix()
          .translate(center[0],center[1])
          .rotateFromVector(complex[0],complex[1])
          .scale(norm(complex))
          .translate(-center[0],-center[1])
        console.log(r)
        let newpoint = p.matrixTransform(r)
        console.log(newpoint)
        originP = [newpoint.x,newpoint.y]
        console.log(originP)
        scale = scale*norm(complex)
        redrawGraph(scale)
        break
  
      case "changeCenter":
        ui2Ctx.clear()
        ui2Layer.style.removeProperty("transform")
        const newpath = ui2Ctx.pathes[0].transformedByMatrix(m)
        ui2Ctx.pathes = []
        uiCtx.draw(newpath)
        center = [center[0]+dx,center[1]+dy]
        break;
      
      case "translate"://drawGraphの変換
        activeCtx.canvas.style.removeProperty("transform")
        originP = [originP[0]+dx,originP[1]+dy]
        redrawGraph(scale)
        break;

      case "copy"://"transform"の時と同じ
        activeCtx.clear()//activeCtxの変換
        activeCtx.canvas.style.removeProperty("transform")
        for(let i=0;i<activeCtx.pathes.length;i++){
          const newpath = activeCtx.pathes[i].transformedByMatrix(m)
          activeCtx.pathes.splice(i,1,newpath)
          activeCtx.display(newpath)
        }
        center = [center[0]+dx,center[1]+dy]
        originP = [originP[0]+dx,originP[1]+dy]

        uiCtx.clear()//uiCtxの変換
        uiCtx.canvas.style.removeProperty("transform");
        for(let i=0;i<uiCtx.pathes.length;i++){
          path = uiCtx.pathes[i].transformedByMatrix(m)
          uiCtx.pathes.splice(i,1,path)
          uiCtx.display(path)
        }
        minX+=dx
        minY+=dy
        maxX+=dx
        maxY+=dy
        break;
    }
    break
  }
  console.log(backCtx.pathes.length+", "+visibleCtx.pathes.length+", "+activeCtx.pathes.length+", "+uiCtx.pathes.length+", "+ui2Ctx.pathes.length+", "+mode+", "+operate+"で描きおわり")
  endOperate()
});


// ポインターの位置"e"を変数とする関数
let hoseitenGroup =[] 

function crrection(e){ 
  const r = Math.abs((e.y-inP.y)/(e.x-inP.x))
  switch(true){}
    if(r>10){curX = inP.x}else{curX=e.x}
    if(r<0.1){curY = inP.y}else{curY=e.y}
  let hoseiPoint=[curX,curY]
  for(let i = 1; i<hoseitenGroup.length;i++){
    let d = distance(hoseiPoint,hoseitenGroup[i])
    if((d>0)&&(d<10)){
      // return [thisX,thisY]
      hoseiPoint = hoseitenGroup[i]
      break;
    }
    // console.log(thisX+","+thisY)
  }
  return hoseiPoint
}


function erase(e){
  for(let i=0;i<visibleCtx.pathes.length;i++){
    visibleCtx.lineWidth = Number(eraseSizePicker.value)+Number(sizePicker.value);
    if(visibleCtx.isPointInStroke(visibleCtx.pathes[i],e.x,e.y-menuHeight,"nonzero")){
      visibleCtx.delete(visibleCtx.pathes[i])
      deleteCount++
      i--
    }
  }
  for(let i=0;i<balls.length;i++){
    const d = distance([balls[i].x,balls[i].y],[e.x,e.y-menuHeight])
    if(d < Number(eraseSizePicker.value/2)+Number(balls[i].size)){
      const index=balls.indexOf(balls[i])
      balls.splice(index,1)
      deleteCount++
      i--
    }
  }
}

function select(e){
  for(let i=0;i<visibleCtx.pathes.length;i++){
    for(let j=0;j<visibleCtx.pathes[i].points.length;j++){
      const p = visibleCtx.pathes[i]
      const x=p.points[j][0]
      const y=p.points[j][1]
      if(visibleCtx.isPointInPath(path,x,y-menuHeight,"nonzero")){
        visibleCtx.delete(p)
        activeCtx.draw(p)
        console.log(p.id+"を Active にしました。")
        // visibleCtx.pathes[i].active()
        i--
        break
      }
    }
  }
}


// || "CanvasRenderingContext2D" のプロパティとメソッドを追加する

backCtx.pathes = []
visibleCtx.pathes = []
activeCtx.pathes = []
uiCtx.pathes = []
ui2Ctx.pathes = []

//Path2Dの設定でstoroke
CanvasRenderingContext2D.prototype.display = function(path){
  this.lineWidth = path.lineWidth
  this.strokeStyle = path.strokeStyle
  this.fillStyle = path.fillStyle
  this.stroke(path)
}

//displayとPathesへの追加
CanvasRenderingContext2D.prototype.draw = function(path){
  this.display(path)
  this.pathes.push(path)
  console.log(path.id + "を" + this.name + "に draw しました")
}

//透過名画像を上書きして消す
CanvasRenderingContext2D.prototype.clear = function(){
  this.clearRect(-width/3,-height/3,width*5/3,height*5/3)
}

//対象のPath2DだけPathesから除いた上で、他を再描画
CanvasRenderingContext2D.prototype.delete =  function(path){
  const index = this.pathes.indexOf(path)
  this.pathes.splice(index,1)
  this.clear()
  // this.fillStyle = 'rgb(0,0,0)';
  // this.fillRect(-width/3,-height/3,width*5/3,height*5/3);
  for(let i=0;i<this.pathes.length;i++){
    this.display(this.pathes[i])
  }
  console.log(path.id+" を "+this.name+" から消しました。")
}


//"pointerup"によるpathesの変換  //元からMatrixを変数に取りたいところ
CanvasRenderingContext2D.prototype.transformPathes = function(center,complex){
  this.canvas.style.removeProperty("transform")
  this.canvas.style.removeProperty("transform-originP")
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
  zoom = Math.sqrt(matrix.det())
  newpath.strokeStyle = this.strokeStyle
  newpath.lineWidth = this.lineWidth//*zoom //太さを維持するか
  newpath.id = this.id
  
  return newpath
}

  DOMMatrix.prototype.det = function(){
    return this.a*this.d-this.b*this.c
  }





//"HTMLElement"のメソッド

//"pointermove"時に用いるCSSによる変換
HTMLElement.prototype.transformElement = function(center,complex){
  this.style.transform = `
    matrix(
      ${complex[0]},${complex[1]},
      ${-complex[1]},${complex[0]},
      0,0)
    `
  this.style.transformOrigin = `${center[0]}px ${center[1]-menuHeight}px`
    }



// activeCtx.pathesの中身を全てvisibleCtxに移す

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
  graphFunction = NaN
  axisX = NaN
  axisY = NaN
}



// uiCtx.pathesの生成

// uiCtx.strokeStyle = ui2Ctx.strokeStyle = "white"
// uiCtx.fillStyle = ui2Ctx.fillStyle = "red"
// uiCtx.lineWidth = ui2Ctx.lineWidth = 1
// uiCtx.btnSize = ui2Ctx.btnSize = 15
// uiCtx.pathes = ui2Ctx.pathes = []
//よくわからないが外にも必要みたい、、、

function createUi() {
  uiCtx.strokeStyle =  "white"
  uiCtx.lineWidth = 1
  uiCtx.btnSize = 15
  uiCtx.pathes =  []
  ui2Ctx.strokeStyle =  "white"
  ui2Ctx.lineWidth = 1
  ui2Ctx.btnSize = 15
  ui2Ctx.pathes =  []
  if(activeCtx.pathes.length!==0){
    if(mode==="graph"){
      uiCtx.strokeStyle = ui2Ctx.strokeStyle = "cyan"
      minX = axisX.points[0][0]
      maxX = axisX.points[1][0]
      minY = axisY.points[0][1]
      maxY = axisY.points[1][1]
      console.log("graphのUIを作っています")
    }else{
      minX = activeCtx.pathes[0].points[0][0]
      minY = activeCtx.pathes[0].points[0][1]
      maxX = minX
      maxY = minY
      for(let i=0;i<activeCtx.pathes.length;i++){
        for(let j=0;j<activeCtx.pathes[i].points.length;j++){
          minX =  Math.min(minX,activeCtx.pathes[i].points[j][0]-activeCtx.pathes[i].lineWidth/2-selectLineWidth/2)
          minY =  Math.min(minY,activeCtx.pathes[i].points[j][1]-activeCtx.pathes[i].lineWidth/2-selectLineWidth/2)
          maxX =  Math.max(maxX,activeCtx.pathes[i].points[j][0]+activeCtx.pathes[i].lineWidth/2+selectLineWidth/2)
          maxY =  Math.max(maxY,activeCtx.pathes[i].points[j][1]+activeCtx.pathes[i].lineWidth/2+selectLineWidth/2)
        }
      }
      console.log("transformのUIを作っています")
    }
    center = midPoint([minX,minY],[maxX,maxY])
    w = maxX-minX
    h = maxY-minY
    uiCtx.btnSize = (w+h)/40
      
    
    //四角
    path = new Path2D()
    path.rect(minX,minY,w,h)
    uiCtx.draw(path)

    //削除ボタン
    path = new Path2D()
    path.arc(minX,minY,uiCtx.btnSize*1.4,0,2*Math.PI)
    path.moveTo(minX-uiCtx.btnSize,minY-uiCtx.btnSize)
    path.lineTo(minX+uiCtx.btnSize,minY+uiCtx.btnSize)
    path.moveTo(minX-uiCtx.btnSize,minY+uiCtx.btnSize)
    path.lineTo(minX+uiCtx.btnSize,minY-uiCtx.btnSize)
    uiCtx.draw(path)

    //回転ボタン
    path = new Path2D()
    path.arc(minX,maxY,uiCtx.btnSize,0,2*Math.PI)
    path.arc(minX,maxY,uiCtx.btnSize*2/3,0,2*Math.PI)
    path.arc(minX,maxY,uiCtx.btnSize*4/3,0,2*Math.PI)
    uiCtx.draw(path)

    //伸縮ボタン
    path = new Path2D()
    path.rect(maxX,maxY,uiCtx.btnSize*2,uiCtx.btnSize*2)
    path.rect(maxX,maxY,uiCtx.btnSize*2/3,uiCtx.btnSize*2/3)
    path.rect(maxX,maxY,uiCtx.btnSize*4/3,uiCtx.btnSize*4/3)
    uiCtx.draw(path)

    //複製ボタン
    path = new Path2D()
    path.arc(maxX,minY,uiCtx.btnSize,0,2*Math.PI)
    path.arc(maxX-uiCtx.btnSize/3,minY-uiCtx.btnSize/3,uiCtx.btnSize,0,2*Math.PI)
    path.arc(maxX+uiCtx.btnSize/3,minY+uiCtx.btnSize/3,uiCtx.btnSize,0,2*Math.PI)
    uiCtx.draw(path)

    //センターアンカー
    path = new Path2D()
    path.arc(center[0],center[1],uiCtx.btnSize,0,2*Math.PI)
    path.moveTo(center[0],center[1]-uiCtx.btnSize/2)
    path.lineTo(center[0],center[1]+uiCtx.btnSize/2)
    path.moveTo(center[0]-uiCtx.btnSize/2,center[1])
    path.lineTo(center[0]+uiCtx.btnSize/2,center[1])
    uiCtx.draw(path)

    console.log(minX + "," + minY + "," +maxX + "," +maxY+ "の変換UIを表示しました")
  }
}

// あたり判定がある場所
function atatterubasyo(){
  for(let k=0;k<visibleCtx.pathes.length;k++){
    for(let i=0;i<width;i+=10){
      for(let j=0;j<height;j+=10){
        if(backCtx.isPointInPath(path,i,j-menuHeight)){
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



// Graph
let axisX
let axisY
let originP

// line mode 終了時、水平/垂直のpathを書いているかどうかを調べる。
function checkAxisLines(){
  if(inP.y===outY){
    axisX = path
    console.log("x軸を記録")
  }else if(inP.x===outX){
    axisY = path
    console.log("y軸を記録")
    if(axisX){
      changeToMode("graph")
      visibleCtx.delete(axisY)
      visibleCtx.delete(axisX)
      activeCtx.draw(axisY)
      activeCtx.draw(axisX)
      graphAsk()
      createUi()
      drawGraph(scale)
    }
  }
}


function graphAsk(){
  const p = prompt('引数xの関数の式をJS形式で入力してください。y=?');
  graphFunction = new Function("x","return "+p)
  originP = [axisY.points[0][0],axisX.points[0][1]]
  scale = 100
}

let scale =100
let graphFunction = NaN

//graphFunctionを描く（originP,minX,minY,maxX,maxYに対して）
function drawGraph(scale){
  path = new Path2D()
  path.addId(colorPicker.value,sizePicker.value,[[minX,graphFunction(minX)]])
  path.moveTo(minX,-graphFunction((minX-originP[0])/scale)*scale+originP[1])
  let isInAxisY = true
  for(let x=minX+1;x<=maxX;x++){
    const graphY =-graphFunction((x-originP[0])/scale)*scale+originP[1]
    if(graphY){
      if(graphY>=minY&&graphY<=maxY){
        if(isInAxisY){
          path.lineTo(x,graphY)
        }else{
          path.moveTo(x,graphY)
          isInAxisY=true
        }
        path.points.push([x,graphY])
        console.log("内")
      }else{
        isInAxisY=false
        console.log("外")
      }
    }
  }
  activeCtx.draw(path)
}

//axisX,axisYを作って描く（originP,minX,minY,maxX,maxYに対して）
function addAxis(point,minX,minY,maxX,maxY){
  axisX = new Path2D();//x軸
  axisX.moveTo(minX,point[1])
  axisX.lineTo(maxX,point[1])
  axisX.addId(colorPicker.value,sizePicker.value,[[minX,point[1]],[maxX,point[1]]])
  activeCtx.draw(axisX)
  axisY = new Path2D();//y軸
  axisY.moveTo(point[0],minY)
  axisY.lineTo(point[0],maxY)
  axisY.addId(colorPicker.value,sizePicker.value,[[point[0],minY],[point[0],maxY]])
  activeCtx.draw(axisY)
  console.log("addAxis")
}

//"scale"時のための再描画
function redrawGraph(scale){
  activeCtx.delete(axisX)
  activeCtx.delete(axisY)
  activeCtx.delete(path)
  addAxis(originP,minX,minY,maxX,maxY)
  drawGraph(scale)
}

