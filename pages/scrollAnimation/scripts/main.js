let henemoji = document.querySelectorAll('img');
let jimaku = document.querySelectorAll('.hanemojis p');

window.onscroll = scrollAnime
window.onload = scrollAnime

for(let i=0;i<henemoji.length;i++){
  henemoji[i].top=henemoji[i].getBoundingClientRect().top
  jimaku[i].top=jimaku[i].getBoundingClientRect().top
}

const scrollNum = document.querySelectorAll('.scroll-num');

const w = window.innerWidth
const h = window.innerHeight

function scrollAnime(){
  const y = window.pageYOffset
  
  for(let i=0;i<henemoji.length;i++){    
    // scrollNum[0].textContent = y;
    // scrollNum[1].textContent = y;
    henemoji[i].style.transform = 
    `
     translateY(-${w}px) 
     rotateZ(${henemoji[i].scrollBetween(h/6,h/3,90*((-1)**i),0)}deg) 
     translatey(${w}px)
     translatey(${jimaku[i].scrollBetween(h/3,h,0,h*2/3)}px)
     `
  }
  for(let i=0;i<jimaku.length;i++){    
    jimaku[i].style.transform = 
    `translate(${jimaku[i].scrollBetween(h/6,h/3,w*((-1)**i),0)}px)
    translatey(${jimaku[i].scrollBetween(h/3,h,0,h*2/3)}px)
    translate(${jimaku[i].scrollBetween(h,2*h,0,-w*((-1)**i))}px)
    `
    // console.log(w+", "+h+", "+y+", "+i+", "+jimaku[i].scrollBetween(h/6,h/3,w/2+w*((-1)**i),w/2))
  }
}

// console.log(henemoji[0].getBoundingClientRect().top)

HTMLElement.prototype.scrollBetween = function(start,end,startV,endV){
  const startS = this.top-window.innerHeight*5/6+start
  const intervalV = endV-startV
  const y = window.pageYOffset
  const yV = intervalV*(y-startS)/(end-start)+startV
  if(intervalV>=0){  
    return Math.max(startV,Math.min(endV,yV))
  }else{
    return Math.min(startV,Math.max(endV,yV))
  }
}





