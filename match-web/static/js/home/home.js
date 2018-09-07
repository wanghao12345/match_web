$(function () {
    /**
     * 倒计时
     */
    countTime("2018-09-04 23:23:23");
    /**
     * 大体动态
     */
    $('#textScroll').textScroll({
        itemBox:'.scroll-item',
        outBox: '#scroll-item-content'
    })
    /**
     * 星球上下浮动
     */
    $('.star-shining').shake(1, 3, 2000);
    window.setInterval(function () {
        $('.star-shining').shake(1, 3, 2000);
    },2000)
    /**
     * 选择进入星球
     */
    $('.star-top img').on('click',function () {
        //星球重新排序
        initStarPoint();
        //去掉进度条
        $('.grap-box .star-box .star-bottom .progress').remove();
        //给目标元素添加弹框
        var $popup = $('.popup-tip');
        $popup.css('display', 'none');
        $(this).parents('.star-box').find('.star-bottom').append($popup);
    })

    /**
     * 鼠标悬浮显示弹框
     */
    $('.star-box').hover(function () {
        $(this).find('.popup-tip').fadeIn();
    }, function () {
        $(this).find('.popup-tip').fadeOut();
    })
    /**
     * 广告滚动
     */
    noticeRolling();
})


/**
 * 广告滚动
 */
function noticeRolling() {
    var $textArr = $('p#notice-rolling-content').html().split('');
    $textArr = $textArr.map(function (item) {
        return '<li>' + item + '</li>';
    });
    $('div#notice-rolling').html('<ul id="notice-rolling-ul" style="width: '+16 * $textArr.length+'px;">'+$textArr.join('')+'</ul>');

    var num = 0;
    setInterval(function(){
        if (num <= -(16 * $textArr.length)) {
            num = $('div#notice-rolling').width();
        }
        num -= 1;
        $("ul#notice-rolling-ul").css({
            left: num
        })
    }, 20);
}
/**
 * 初始化星球的位置
 */
function initStarPoint(){
    var point = [[500, 250],[230, 235],[620, 120],[130, 380],[170, 88],[700, 460]];
    for (var i = 1; i < 7; i++) {
        var index = Math.round(Math.random()*(point.length-1));
        $('.star-box' + i).css({
            left: point[index][0] + 'px',
            top: point[index][1] + 'px'
        })
        point.splice(index, 1);
    }
}
/**
 * 抖动
 * @param intShakes 次数
 * @param intDistance 距离
 * @param intDuration 时常
 * @returns {jQuery}
 */
jQuery.fn.shake = function (intShakes, intDistance, intDuration) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({position: 'relative'});
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({top: (intDistance * -1)}, (((intDuration / intShakes) / 4)))
                .animate({top: intDistance}, ((intDuration / intShakes) / 2))
                .animate({top: 0}, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
}