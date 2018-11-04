window.onmousewheel = wheel;
var animating = null;
var wheelAnimate = null;

function getPageLenFormDom() {
   return document.querySelectorAll('.resume-page-box>section').length-1;
}


// 滚动计数器
var wheelCounter = (function(){
  var wheelcount = 0;
  var __timerCounter = function(){
    var precount = wheelcount;
    setTimeout(()=>{
      // 如果没有在按时内更改就归零
      if(precount == wheelcount){
        wheelcount = 0;
      }
    },1000)
  }
  return {
    addCounter(){
      if (wheelcount<=3){
        wheelcount++
      }
      __timerCounter()
      return wheelcount;
    },
    refreshCounter(){
      wheelcount = 0;
    },
    getCounter(){
      return wheelcount;
    }
  }
})();


var indexController = (function(){
  var index = 0;
  var end = getPageLenFormDom();
  return {
      getIndex(){
        return index;
      },
      changeIndex(fx){
      var preIndex = index;
      // 方向判断
      if (fx) {
        // 边界判断
        if (index < end) {
          index++;
        }
      } else {
        if (index > 0) {
          index--;
        } 
      }
      return {index, preIndex}
    }
  }
})();



function getTranslateYfromIndex(index) {
  return 'translateY('+(-index)+'%)';
}

function wheel() {

  var delta = 0;
  if( !event ) event = window.event;
  if( event.wheelDelta ) { // IE、Chrome只能在这里取
    delta = event.wheelDelta / 120;
    if( window.opera ) delta = -delta // Opera为正负相反的，需要矫正一致性
  } else if( event.detail ) {
    delta = -event.detail / 3;
  }

  clearTimeout(wheelAnimate);
  wheelAnimate = setTimeout(()=>{
      handle(delta);
  }, 100);
}

function handle(delta) {
  // 变更index
  var isAddOrReduce = !(delta > 0);
  var {index, preIndex} = indexController.changeIndex(isAddOrReduce);
  console.log(index)
  // 如果在当前位置就不需要移动了
  if(index == preIndex) {
    return;
  }
  moveAnimatePage(index, preIndex).then(()=>{
    
  })
}

function moveAnimatePage(end, start) {
  return new Promise((resolve, reject)=>{
    var pageContainer = document.querySelector('.resume-page-box');
    var fx = end > start;
    var startY = start * 100;
    var endY = end * 100;
    animating = setInterval(()=>{
      // 累加
      startY = fx? startY+2 : startY-2;
      var isNeedAnimate = fx? (startY < endY) : (startY > endY);
      if (isNeedAnimate){
        pageContainer.style.transform = getTranslateYfromIndex(startY);
      } else {
        pageContainer.style.transform = getTranslateYfromIndex(endY);
        clearAnimateTimer();
        resolve()
      }
    }, 60/1000)

    var clearAnimateTimer = function(){
      clearInterval(animating);
      animating = null;
    }
  })
  
  
}

