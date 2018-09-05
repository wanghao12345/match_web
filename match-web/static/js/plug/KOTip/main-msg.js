$(function(){
  $(".j-msg-con").KOTip();
  $(".j-msg-con").on('click', '.end', function(event) {
    $(this).closest(".j-msg-con").KOTipHide();
  });
})