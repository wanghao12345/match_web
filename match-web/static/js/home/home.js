$(function () {
    /**
     * 星球重新排序
     */
    initStarPoint();
    /**
     * 倒计时
     */
    countTime("2018-09-14 17:08:00");
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
        if ($('input#isEntrySec').val() == '1'){
            //显示第一页隐藏的星球
            $('.star-box' + first_random_point).css('display','block');
            //显示返回按钮
            $('a#back-btn').css('display', 'block');
            //点击进入第二页的标志
            $('input#isEntrySec').val(2);
            //去掉进度条
            $('.grap-box .star-box .star-bottom .progress').css('display', 'none');
            //进入第二页星球分布
            getSecPoint($(this).parents('.star-box').find('p.name').html());
        }
    })
    /**
     * 返回第一页
     */
    $('a#back-btn').on('click', function () {
        //恢复a
        $('.star-box').find('a').attr('href', 'javascript:;');
        //恢复所有的星球名字
        for(var i = 2; i < 8; i++){
            $('.star-box' + i).find('p.name').html(starName[i -2]);
        }
        //显示所有的星球
        $('.star-box').css('display','block');
        //隐藏第一页隐藏的星球
        $('.star-box' + first_random_point).css('display','none');
        //隐藏返回按钮
        $('a#back-btn').css('display', 'none');
        //点击进入第二页的标志
        $('input#isEntrySec').val(1);
        //进度条
        $('.grap-box .star-box .star-bottom .progress').css('display', 'block');
    })

    /**
     * 鼠标悬浮显示弹框
     */
    $('.star-box').hover(function () {
        var category = $(this).find('p.name').html();
        var $isShing = $(this).find('.star-top').hasClass('star-shining');
        var $isEntrySec = $('input#isEntrySec').val();
        if($isShing && $isEntrySec == '1'){
            requestPopupData(category, this);
            //给目标元素添加弹框
            var $popup = $('.popup-tip');
            $popup.css('display', 'none');
            $(this).find('.star-bottom').append($popup);
        }
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
    window.setInterval(function () {
        requestScoreList();
    }, 10000);

    /**
     * 答题动态
     */
    requestDynamic();
    //10秒后加载答题动态
    window.setInterval(function () {
        requestDynamic();
    }, 10000);
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
                        arr.push('<li class="rank-item">\n' +
                            '    <div class="rank">\n' +
                            '        <img src="../../static/img/home/img_no'+(i+1)+'.png" alt="第一">\n' +
                            '    </div>\n' +
                            '    <div class="name">\n' +
                            '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                            '    </div>\n' +
                            '</li>');
                    }else{
                        arr.push('<li class="rank-item">\n' +
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
            $('#rank-scroll').textScroll({
                itemBox:'.rank-item',
                outBox: '#score-rank-list'
            });
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
                 * 答题动态
                 */
                $('#textScroll').textScroll({
                    itemBox:'.scroll-item',
                    outBox: '#scroll-item-content'
                });
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
//星球固定分布
// var point = [[500, 250],[230, 235],[620, 120],[130, 380],[170, 88],[700, 460]];
var point = [[230, 235],[620, 120],[130, 380],[170, 88],[700, 460],[420, 470]];
var starName = [];
//存储第一次刷新的随机分布
var first_random = [];
//存储第一次刷新某个随机球不显示
var first_random_point = 7;
function initStarPoint(){

    // first_random_point = Math.floor(Math.random()*5 + 2);
    //隐藏掉第一页随机消失的星球
    $('.star-box' + first_random_point).css('display','none');

    for (var i = 2; i < 8; i++) {
        var index = Math.round(Math.random()*(point.length-1));
        first_random.push([point[index][0], point[index][1]]);
        starName.push($('.star-box' + i).find('p.name').html());
        $('.star-box' + i).css({
            left: point[index][0] + 'px',
            top: point[index][1] + 'px'
        })
        point.splice(index, 1);
    }
}
/**
 * 第二页的星球
 */
function getSecPoint(name){
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/?type='+name,
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                var item  = data.message;
                var len = data.message.length;
                $('.star-box').css('display', 'none');
                for (var i = 2; i < 2 + len; i++) {
                    $('.star-box' + i).css('display', 'block');
                    $('.star-box' + i).find('a').attr('href','http://127.0.0.1:8000/challenges/category/1/?id='+item[i-2].id);
                    $('.star-box' + i + ' p.name').html(item[i-2].name);
                }
            }else{
                $('.star-box').css('display', 'none');
                $('.star-box1').css('display', 'block');
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
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