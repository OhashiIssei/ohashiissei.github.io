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