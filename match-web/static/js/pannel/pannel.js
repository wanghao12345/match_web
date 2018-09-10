$(function(){
  var $body = $(".j-p-body");
	$body.on('click', '.pannel-btn', function(event) {
		event.preventDefault();
		if($body.hasClass("pannel-open")){
			$body.removeClass("pannel-open");
		}else{
			$body.addClass("pannel-open");
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






})