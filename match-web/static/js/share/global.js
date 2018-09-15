$(function(){
  onFooter()
  $(window).on('resize', function(event) {
    onFooter()
  });
})
function onFooter(){
  var winH =  $(window).height();
  var footH = $(".footer-box").height();
  var domH = $(document).height();
  if(winH  == domH){
    $(".footer-box").addClass("layout-bottom");
  }else{
    $(".footer-box").removeClass("layout-bottom");
  }
}