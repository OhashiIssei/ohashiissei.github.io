let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/hanemoji0.gif') {
      myImage.setAttribute('src','images/hanemoji1.gif');
    } else {
      myImage.setAttribute('src','images/hanemoji0.gif');
    }
}

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
myHeading.textContent = 'Mozilla はすばらしいよ、' + storedName;
}

myButton.onclick = function() {
    setUserName();
  }