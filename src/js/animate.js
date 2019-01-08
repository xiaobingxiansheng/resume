function pageAnimateStart(section){
  var animateElem = $(section).find('[animate]');
  for(let item of animateElem) {
    var jq_item = $(item);
    animateTimer(jq_item)
  }
}

function animateTimer(jq_item){
  var addClass = jq_item.attr('animate') ;
  jq_item.addClass([addClass, 'animated'])  
  return new Promise((resolve,rejct)=>{
    setTimeout(()=>{
      jq_item.removeClass([addClass, 'animated'])
      resolve();
    }, 2000)
  })
}


function resumeNameAnimate(){
  const text = `我是一个前端学习者，曾就职于某特科技有限公司，负责公众号应用开发，拥有1年的项目经验，目前正在学习流行的框架，可以使用Vue、React做一些小Demo，
  熟悉ES6，接触过Gulp、Webpack、yeoman等自动化构建工具。本页面也是利用本人使用的yeoman脚手架生成，技术使用原生JavaScript和HTML5+CSS3。`
  var index = 0;

  setTimeout(function(){
    var randSpeed = Math.floor(Math.random() * 20) + 70;
    var splitText = text.substring(0, index++);
    console.log(splitText);
    $(".resume-job-inline").html(splitText);

    if(splitText.length < text.length){
      setTimeout(arguments.callee, randSpeed);
    }
  }, 70)
}

