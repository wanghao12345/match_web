$(function(){
  var $body = $(".j-p-body");
	$body.on('click', '.j-pannel-btn', function(event) {
		event.preventDefault();
		if($body.hasClass("pannel-open")){
			$body.removeClass("pannel-open");
		}else{
			$body.addClass("pannel-open");
		}
	});
	$body.on('click', '.j-pannel-btn2', function(event) {
		event.preventDefault();
		if($body.hasClass("pannel-open2")){
			$body.removeClass("pannel-open2");
		}else{
			$body.addClass("pannel-open2");
		}
	});

	$(".j-pannel-tab").KOtab({autoplay:false})

	var $book = $(".j-book-slide");
	$book.on('click', '.book-title', function(event) {
		event.preventDefault();
		var $li = $(this).closest("li");
		if($li.hasClass("i-open")){
			$li.removeClass("i-open");
			$li.find(".book-content").slideUp();
		}else{
			$li.addClass("i-open");
			$li.find(".book-content").slideDown();
		}
	});

	$(".j-expand").on('click', function(event) {
		event.preventDefault();
		if($(this).hasClass("i-open")){
			$(this).removeClass("i-open")
			$book.find("li").removeClass("i-open");
			$book.find(".book-content").slideUp();
		}else{
			$(this).addClass("i-open")
			$book.find("li").addClass("i-open");
			$book.find(".book-content").slideDown();
		}
	});

	$(".j-delete").on('click', function(event) {
		jConfirm("销毁实验机，将无法保留实验机内已进行的所有操作，确认释放么？", "提示",function(result){
			if(result){
				console.log("删除")
			}
		});
	});
	setDate();
  setInterval(setDate,1000);

  setTimeout(function () {
	  $('.loading').css('display', 'none');
  }, 5000)

})

function setDate(){
  var T = new Date().toArray();
  $('.j-date').html(addZero(T[3])+":"+addZero(T[4])+":"+addZero(T[5])+"");
}
function addZero(num){
    if(num<10){
      return "0"+num;
    }else{
      return num;
    }
  }

Date.prototype.toArray = function()  
{   
    var myDate = this;  
    var myArray = Array();  
    myArray[0] = myDate.getFullYear();  
    myArray[1] = myDate.getMonth()+1;  
    myArray[2] = myDate.getDate();  
    myArray[3] = myDate.getHours();  
    myArray[4] = myDate.getMinutes();  
    myArray[5] = myDate.getSeconds();  
    return myArray;  
} 