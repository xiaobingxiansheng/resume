function animateStart(section){
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