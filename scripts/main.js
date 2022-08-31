let myImages = document.querySelectorAll('img');

// myImages[0].onclick = function() {
//     let mySrc = myImages[0].getAttribute('src');
//     if(mySrc === 'images/hanemoji0.gif') {
//       myImages[0].setAttribute('src','images/hanemoji1.gif');
//     } else {
//       myImages[0].setAttribute('src','images/hanemoji0.gif');
//     }
// }

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
    let myName = prompt('あなたの名前を入力してください。');
    if(!myName) {
        setUserName();
      } else {
        localStorage.setItem('name', myName);
        myHeading.textContent = 'Mozilla is cool, ' + myName;
      }
  }

if(!localStorage.getItem('name')) {
setUserName();
} else {
let storedName = localStorage.getItem('name');
myHeading.textContent = '数学はすばらしいよ、' + storedName;
}

myButton.onclick = function() {
    setUserName();
  }

// 垂直方向
const scrollNum = document.querySelector('.scroll-num');

window.onscroll = scrollAnimation
window.onload = scrollAnimation


for(let i=0;i<myImages.length;i++){
  myImages[i].top=myImages[i].getBoundingClientRect().top
}

const width = window.innerWidth
const height = window.innerHeight

function scrollAnimation(){
  const y = window.pageYOffset
  scrollNum.textContent = y;
  console.log(y)
  // console.log("w: "+w)
  for(let i=0;i<myImages.length;i++){    
    myImages[i].style.transform = 
    `scale(${myImages[i].scrollBetween(height/2,height,1,10)})
    translatey(-${myImages[i].scrollBetween(height/2,height,0,200)}px) 
    translatey(-${width}px) 
    rotateZ(${myImages[i].scrollBetween(height/6,height/3,-90*(i%2*2-1),0)}deg) 
    translatey(${width}px)`
  }
}

// console.log(myImages[0].getBoundingClientRect().top)

HTMLElement.prototype.scrollBetween = function(start,end,startV,endV){
  const startS = this.top-window.innerHeight+start
  const intervalV = endV-startV
  const y = window.pageYOffset
  const yV = intervalV*(y-startS)/(end-start)+startV
  if(intervalV>=0){  
    return Math.max(startV,Math.min(endV,yV))
  }else{
    return Math.min(startV,Math.max(endV,yV))
  }
  
}




// // init controller
// var scene = new ScrollMagic.Controller();

// // create a scene
// new ScrollMagic.Scene({
//     triggerElement: "aisatu",
//     duration: 100, // the scene should last for a scroll distance of 100px
//     offset: 50 // start this scene after scrolling for 50px
// })
//     .setPin("aisatu") // pins the element for the the scene's duration
//     .addTo(scene); // assign the scene to the controller



