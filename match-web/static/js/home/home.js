$(function () {
    /**
     * 倒计时
     */
    countTime("2018-09-04 23:23:23");

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
        $('input#isShowPopup').val(1);
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
        var category = $(this).find('p.name').html();
        if(category && parseInt($('input#isShowPopup').val()) != -1){

            requestPopupData(category, this);
        }
        // $(this).find('.popup-tip').fadeIn();
    }, function () {
        $(this).find('.popup-tip').fadeOut();
    })
    /**
     * 广告滚动
     */
    noticeRolling();
    /**
     * 积分榜
     */
    requestScoreList();
    /**
     * 答题动态
     */
    requestDynamic();
    window.setInterval(function () {
        requestDynamic();
    }, 10000) // 10s请求一次

})

/**
 * 积分榜请求
 */
function requestScoreList() {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/users_ranking/',
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            var arr = [];
            $('ul#score-rank-list').html('');
            for(var i = 0; i < 10; i++){
                if(data[i]){
                    if(i<3){
                        arr.push('<li>\n' +
                            '    <div class="rank">\n' +
                            '        <img src="../../static/img/home/img_no'+(i+1)+'.png" alt="第一">\n' +
                            '    </div>\n' +
                            '    <div class="name">\n' +
                            '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                            '    </div>\n' +
                            '</li>');
                    }else{
                        arr.push('<li>\n' +
                            '    <div class="rank">\n' +
                            '        NO.'+(i+1)+'\n' +
                            '    </div>\n' +
                            '    <div class="name">\n' +
                            '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                            '    </div>\n' +
                            '</li>');
                    }
                }else{
                    break;
                }


            }
            $('ul#score-rank-list').append(arr.join(''));
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 答题动态请求
 */

function requestDynamic() {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/solved/?id=' + $('input#Dynamic-Id').val(),
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if (data.code == 200){
                $('input#Dynamic-Id').val(data.first_id);
                $('ul#scroll-item-content').html('');
                var item = data.message;
                var arr = [];
                item.forEach(function (value, index) {
                    arr.push('<li class="scroll-item">' +
                            '<div class="content">' +
                            '<i>'+value.name+'</i>完成'+value.challenge_name+'题，获得' +
                            '<i>'+value.points+'分</i>，当前累积得分' +
                            '<i>'+value.total_points+'分</i>，团队总分' +
                            '<i>'+value.total_points+'分</i>' +
                            '</div>' +
                            '</li>');
                })
                $('ul#scroll-item-content').append(arr.join(''));
                /**
                 * 大体动态
                 */
                $('#textScroll').textScroll({
                    itemBox:'.scroll-item',
                    outBox: '#scroll-item-content'
                })
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 弹窗数据
 */
function requestPopupData(category, _this){
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/category_ranking/?category='+category,
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            $('ul#popup-rank-list').html('');
            var arr = [];
            for(var i = 0; i < 3; i++){
                if(data[i]){
                    arr.push('<li>'+data[i]+'</li>');
                }else{
                    break;
                }

            }
            $('ul#popup-rank-list').append(arr.join(''));
            if(data[0]){
                $(_this).find('.popup-tip').fadeIn();
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}












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