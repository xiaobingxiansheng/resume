var animating = null;
var wheelAnimate = null;
var isMiniScreen = $("body").innerWidth() <= 700;

function getPageLenFormDom() {
  return document.querySelectorAll('.resume-page-box>section').length - 1;
}


TODO: // 这个滚动计数器还没用使用，是当时用来计数用的。
  var wheelCounter = (function () {
    var wheelcount = 0;
    var __timerCounter = function () {
      var precount = wheelcount;
      setTimeout(() => {
        // 如果没有在按时内更改就归零
        if (precount == wheelcount) {
          wheelcount = 0;
        }
      }, 1000)
    }
    return {
      addCounter() {
        if (wheelcount <= 3) {
          wheelcount++
        }
        __timerCounter()
        return wheelcount;
      },
      refreshCounter() {
        wheelcount = 0;
      },
      getCounter() {
        return wheelcount;
      }
    }
  })();


var indexController = (function () {
  var index = 0;
  var end = getPageLenFormDom();
  return {
    getIndex() {
      return index;
    },
    changeIndex(fx) {
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
      return {
        index,
        preIndex
      }
    }
  }
})();



function getTranslateYfromIndex(index) {
  return 'translateY(' + (-index) + '%)';
}

function wheel() {
  var delta = 0;
  if (!event) event = window.event;
  if (event.wheelDelta) { // IE、Chrome只能在这里取
    delta = event.wheelDelta / 120;
    if (window.opera) delta = -delta // Opera为正负相反的，需要矫正一致性
  } else if (event.detail) {
    delta = -event.detail / 3;
  }
  if (wheelAnimate === null) {
    wheelAnimate = setTimeout(() => {
      handle(delta);
    }, 100);
  }
}

function handle(delta) {
  // 变更index
  var isAddOrReduce = !(delta > 0);
  var {
    index,
    preIndex
  } = indexController.changeIndex(isAddOrReduce);
  console.log(index)
  // 如果在当前位置就不需要移动了
  if (index == preIndex) {
    wheelAnimate = null;
    return;
  }
  moveAnimatePage(index, preIndex).then(() => {
    console.log("完成！")
    wheelAnimate = null;
    pageAnimateStart(getElemFromPageNum(index))
  })
}

function moveAnimatePage(end, start) {
  return new Promise((resolve, reject) => {
    var pageContainer = document.querySelector('.resume-page-box');
    var fx = end > start;
    var startY = start * 100;
    var endY = end * 100;
    var speed = 2;
    animating = setInterval(() => {
      // 累加
      startY = fx ? startY + speed : startY - speed;
      var isNeedAnimate = fx ? (startY < endY) : (startY > endY);
      if (isNeedAnimate) {
        pageContainer.style.transform = getTranslateYfromIndex(startY);
      } else {
        pageContainer.style.transform = getTranslateYfromIndex(endY);
        resolve()
        clearAnimateTimer();
      }
    }, 60 / 1000)

    var clearAnimateTimer = function () {
      clearInterval(animating);
    }
  })
}


function getElemFromPageNum(num) {
  return $(`.resume-page:eq(${num})`)[0];
}




// 一个开始就有动画
$(() => {
  pageAnimateStart(getElemFromPageNum(0))
  resumeNameAnimate();
  touchScrollPage();
  projectInfoAlert();
  !isMiniScreen && mouseMoveTip();
  window.onmousewheel = wheel;
})

function touchScrollPage() {
  var touchstartY = 0;
  var touchendY = 0;
  var diffTouch = 0;
  document.addEventListener('touchstart', function (e) {
    touchstartY = e.touches[0].clientY;
  })
  document.addEventListener('touchend', function (e) {
    touchendY = e.changedTouches[0].clientY;
    diffTouch = Math.abs(touchstartY - touchendY);
    // FIXME: // 这个没有正确的判断，我的意思是如果没有较大幅地进行滑动的话，不要出现翻页。
    let scrollDir = touchstartY > touchendY ? -1 : 1;
    console.log(diffTouch);
    if (diffTouch > 50) {
      handle(scrollDir);
    }
    // init
    initConfig();
  })

  var initConfig = function () {
    touchstartY = 0;
    touchendY = 0;
    diffTouch = 0;
  }

  var IteratorHrefElem = function (target) {
    var current = target
    while (current != null) {
      if (current.tagName === 'A') {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

}

function mouseMoveTip(x, y) {
  var tip = document.querySelector(".resume-tip");
  document.addEventListener("mousemove", function (e) {
    var x = e.clientX;
    var y = e.clientY - tip.clientHeight;
    tip.style.cssText = `left:${x}px; top:${y}px;`;
  })
}


function projectInfoAlert() {
  var href_parent = document.querySelector(".resume-project-contentWrap");
  var alerWrap = document.querySelector(".resume-alert-wrap");
  var alertButton = document.querySelector(".resume-alert-button");

  href_parent.addEventListener('touchstart', function (e) {
    var touchedElem = e.target;
    if (touchedElem.classList.contains('resume-minScr-href')) {
      var info = $(touchedElem).
      parent().siblings(".resume-project-description").find(".resume-project-info").text();

      var projectHref = $(touchedElem).siblings('a').attr("href") || '#';
      var buttonText = (projectHref != "#" ? '进入该项目' : '本项目不适合直接预览');
      $(".resume-alert-wrap").show().addClass(".resume-alert-wrap__active");

      $(".alert-inline-info").html(info);
      $(".resume-alert-button").html(`<a href="${projectHref}">${buttonText}</a>`)
    }
  })

  alerWrap.addEventListener('touchstart', function (e) {
    let touchedElem = $(e.target);
    if (!touchedElem) {
      return
    }

    let isNotalertInfo = !touchedElem.hasClass("resume-alert-info") &&
      touchedElem.parents(".resume-alert-info").length == 0;

    if (isNotalertInfo) {
      $(".resume-alert-wrap").removeClass(".resume-alert-wrap__active").hide();
      // 点击穿透
      e.preventDefault();
    }
  })


}