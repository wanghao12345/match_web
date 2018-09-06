
$(function(){
  $(".win-subject").on('click', '.j-open .title', function(event) {
    event.preventDefault();
    var $this = $(this),$tip = $this.closest(".j-open");
    if($tip.hasClass("open")){
      $tip.removeClass("open");
    }else{
      $tip.addClass("open");
    }
  });
  
})

function setProgress(num){
  $(".j-progress i").width(num);
  $(".j-progress .num").html(num);
}