var TextScroll1 = null, TextScroll2 = null;

$(function () {
    /**
     * 星球初始化排序
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
    $('.grap-box').on('click','.star-top img',function () {
        var index = $(this).attr('data-index');
        if ($('input#isEntrySec').val() == '1' && index == undefined){
            //显示返回按钮
            $('a#back-btn').css('display', 'block');
            //点击进入第二页的标志
            $('input#isEntrySec').val(2);
            //进入第二页星球分布
            getSecPoint($(this).parents('.star-box').find('p.name').html());
        }
    });
    /**
     * 选择第一颗球
     */
    $('.grap-box').on('click','.star-box1',function () {

        $('.grap-box .star-box').remove();
        var secStarPointArr = [[400, 120], [400, 470], [750, 270], [120, 350], [10, 470], [300, 440], [600, 440]];
        var index = Math.round(Math.random()*(secStarPointArr.length-1));
        $('.grap-box').append('<div class="star-box star-box7 star-box-add" style="left: '+secStarPointArr[index][0]+'px;top: '+secStarPointArr[index][1]+'px;">\n' +
            '    <a target="_blank" href="http://www.baidu.com">\n' +
            '        <div class="star-top star-shining">\n' +
            '            <img class="normal" data-index="2" src="../../static/img/home/star/star_7_normal.png" alt="星球7">\n' +
            '            <img class="shining" data-index="2" src="../../static/img/home/star/star_7_shining.png" alt="星球7">\n' +
            '        </div>\n' +
            '        <div class="star-bottom">\n' +
            '            <p class="name">新增链接球</p>\n' +
            '        </div>\n' +
            '    </a>\n' +
            '</div>');

        //显示返回按钮
        $('a#back-btn').css('display', 'block');
    })
    /**
     * 返回第一页
     */
    $('a#back-btn').on('click', function () {
        //初始化第一页
        initStarPoint();
        //隐藏返回按钮
        $('a#back-btn').css('display', 'none');
        //点击进入第二页的标志
        $('input#isEntrySec').val(1);

    });
    /**
     * 广告滚动
     */
    noticeRolling();
    /**
     * 积分榜
     */
    requestScoreList();
    TextScroll1 = new TextScroll('#rank-scroll', '#score-rank-list', '.rank-item', 55);
    window.setInterval(function () {
        requestScoreList();
    }, 10000);

    /**
     * 答题动态
     */
    requestDynamic();
    TextScroll2 = new TextScroll('#textScroll', '#scroll-item-content', '.scroll-item', 50);
    //10秒后加载答题动态
    window.setInterval(function () {
        requestDynamic();
    }, 10000);
})
/**
 * 积分榜请求
 */
var ScoreRankList = [];
function requestScoreList() {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/users_ranking/',
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {

            if(compareLastScore(data, ScoreRankList)){
                ScoreListAppend(data);
            }



            // var arr = [];
            // var len = 1;
            // for (var i = 0; i < 10000; i++) {
            //     if(data[i]){
            //         if(len < 4){
            //             arr.push('<li class="rank-item" id="rank-item'+len+'">\n' +
            //                 '<div class="rank-item-content">' +
            //                 '<div class="rank-front">' +
            //                 '    <div class="rank">\n' +
            //                 '        <img src="../../static/img/home/img_no'+(len)+'.png" alt="第一">\n' +
            //                 '    </div>\n' +
            //                 '    <div class="name">\n' +
            //                 '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
            //                 '    </div>\n' +
            //                 '</div>' +
            //                 '<div class="rank-back">' +
            //                 '    <div class="rank">\n' +
            //                 '        <img src="../../static/img/home/img_no'+(len)+'.png" alt="第一">\n' +
            //                 '    </div>\n' +
            //                 '    <div class="name">\n' +
            //                 '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
            //                 '    </div>\n' +
            //                 '</div>\n' +
            //                 '</div>\n' +
            //                 '</li>');
            //
            //         }else{
            //             arr.push('<li class="rank-item" id="rank-item'+len+'">\n' +
            //                             '<div class="rank-item-content">' +
            //                             '<div class="rank-front">' +
            //                             '    <div class="rank">\n' +
            //                             '        NO.'+(len)+'\n' +
            //                             '    </div>\n' +
            //                             '    <div class="name">\n' +
            //                             '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
            //                             '    </div>\n' +
            //                             '</div>' +
            //                             '' +
            //                             '<div class="rank-back">' +
            //                             '    <div class="rank">\n' +
            //                             '        NO.'+(len)+'\n' +
            //                             '    </div>\n' +
            //                             '    <div class="name">\n' +
            //                             '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
            //                             '    </div>\n' +
            //                             '</div>\n'+
            //                             '</div>\n'+
            //                             '</li>');
            //         }
            //         len++;
            //     }else{
            //         break;
            //     }
            // }
            // $('ul#score-rank-list').html(arr.join(''));
            //
            // transformList(0);
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 对比往期排行
 */
function compareLastScore(data, ScoreRankList) {
    var flag = false;
    if(ScoreRankList.length != 0){
        for (var i = 0; i < 1000; i++){
            if(data[i]){
                if(data[i].nickname != ScoreRankList[i]){
                    flag = true;
                }
                ScoreRankList[i] = data[i].nickname;
            }else{
                break;
            }
        }
    }else{
        for (var i = 0; i < 1000; i++){
            if(data[i]){
                ScoreRankList[i] = data[i].nickname;
            }else{
                break;
            }
        }
        flag = true;
    }
    return flag;
}

/**
 * 积分榜列表渲染
 */
function ScoreListAppend(data) {

    var arr = [];
    var len = 1;
    for (var i = 0; i < 10000; i++) {
        if(data[i]){
            if(len < 4){
                arr.push('<li class="rank-item" id="rank-item'+len+'" style="display: none;">\n' +
                    '<div class="rank-item-content">' +
                    '<div class="rank-front">' +
                    '    <div class="rank">\n' +
                    '        <img src="../../static/img/home/img_no'+(len)+'.png" alt="第一">\n' +
                    '    </div>\n' +
                    '    <div class="name">\n' +
                    '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                    '    </div>\n' +
                    '</div>' +
                    '<div class="rank-back">' +
                    '    <div class="rank">\n' +
                    '        <img src="../../static/img/home/img_no'+(len)+'.png" alt="第一">\n' +
                    '    </div>\n' +
                    '    <div class="name">\n' +
                    '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                    '    </div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</li>');

            }else{
                arr.push('<li class="rank-item" id="rank-item'+len+'" style="display: none;">\n' +
                                '<div class="rank-item-content">' +
                                '<div class="rank-front">' +
                                '    <div class="rank">\n' +
                                '        NO.'+(len)+'\n' +
                                '    </div>\n' +
                                '    <div class="name">\n' +
                                '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                                '    </div>\n' +
                                '</div>' +
                                '' +
                                '<div class="rank-back">' +
                                '    <div class="rank">\n' +
                                '        NO.'+(len)+'\n' +
                                '    </div>\n' +
                                '    <div class="name">\n' +
                                '        '+data[i].nickname+'<br/><i>'+data[i].points+'</i>\n' +
                                '    </div>\n' +
                                '</div>\n'+
                                '</div>\n'+
                                '</li>');
            }
            len++;
        }else{
            break;
        }
    }
    $('ul#score-rank-list').html(arr.join(''));
    transformList(0);
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
                TextScroll2.stop();

                $('input#Dynamic-Id').val(data.first_id);
                // $('ul#scroll-item-content').html('');
                var item = data.message;
                var arr = [];
                item.forEach(function (value, index) {
                   /* arr.push('<li class="scroll-item">' +
                        '<div class="content">' +
                        '<i>'+value.name+'</i>完成'+value.challenge_name+'题，获得' +
                        '<i>'+value.points+'分</i>，当前累积得分' +
                        '<i>'+value.total_points+'分</i>，团队总分' +
                        '<i>'+value.total_points+'分</i>' +
                        '</div>' +
                        '</li>');*/
                    arr.push('<li class="scroll-item">' +
                        '<div class="content">' +
                        '<i class="dynamic-i-1">'+value.name+'</i>' +
                        '<i class="dynamic-i-2" style="color: rgba(1,255,255,0.54);">&nbsp;完成&nbsp;</i>' +
                        '<i class="dynamic-i-3" style="color: rgba(1,255,255,0.54);">'+value.challenge_name+'</i>' +

                        '<i class="dynamic-i-5">14:36</i>' +
                        '<i class="dynamic-i-4" ><img style="width: 17px;margin-right: 3px;" src="../../static/img/share/icon_ok.png" alt=""></i>' +
                        '</div>' +
                        '</li>');
                })
                $('ul#scroll-item-content').append(arr.join(''));
                /**
                 * 答题动态
                 */
                TextScroll2.start();
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
 * 随机初始化第一页星球布局
 */
function initStarRandomPoint(){
    var point = [[230, 235],[620, 120],[170, 450],[170, 88],[700, 460],[420, 470]];
    $('.grap-box .star-box').remove();
    var starArr = [];
    var starName = ['密码', 'WEB', 'PWN', '渗透', '逆向'];
    starArr.push('<div class="star-box star-box1">\n' +
        '    <a href="javascript:;">\n' +
        '        <div class="star-top star-normal">\n' +
        '            <img class="normal" src="../../static/img/home/star/star_1_normal.png" alt="星球1">\n' +
        '            <img class="shining" src="../../static/img/home/star/star_1_shining.png" alt="星球1">\n' +
        '        </div>\n' +
        '        <div class="star-bottom">\n' +
        '            <p>参赛队伍 50支</p>\n' +
        '            <p>参赛队员 2324人</p>\n' +
        '        </div>\n' +
        '    </a>\n' +
        '</div>');
    for (var i = 2; i < 7; i++){
        var index = Math.round(Math.random()*(point.length-1));
        starArr.push('<div class="star-box star-box'+i+'" style="left: '+point[index][0]+'px;top: '+point[index][1]+'px;">\n' +
            '    <a href="javascript:;">'
        );
        if(i % 2 == 0){
            starArr.push('        <div class="star-top star-shining">');
        }else{
            starArr.push('        <div class="star-top star-normal">');
        }
        starArr.push('            <img class="normal" src="../../static/img/home/star/star_'+i+'_normal.png" alt="星球'+i+'">\n' +
            '            <img class="shining" src="../../static/img/home/star/star_'+i+'_shining.png" alt="星球'+i+'">\n' +
            '        </div>\n' +
            '        <div class="star-bottom">\n' +
            '            <p class="name">'+starName[i-2]+'</p>\n' +
            '            <div class="progress">\n' +
            '                <span class="bar" style="width: 50%;"></span>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </a>\n' +
            '</div>');
        point.splice(index, 1);
    }
    $('.grap-box').append(starArr.join(''));
}

/**
 * 固定初始化第一页星球布局
 */
function initStarPoint() {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/api/index/',
        type: 'get',
        data:{},
        header:{
            'X-Requested-With':'XMLHttpRequest'
        },
        dataType: 'json',
        success: function (data) {

            // var point = [[230, 235],[620, 120],[170, 450],[170, 88],[700, 460],[420, 470]];
            var point = [['25%', 235],['70%', 120],['19%', 450],['21%', 88],['78%', 460],['50%', 470]];

            $('.grap-box .star-box').remove();
            var starArr = [];
            var starName = ['密码', 'WEB', 'PWN', '渗透', '逆向'];
            starArr.push('<div class="star-box star-box1" data-status="0">\n' +
                '    <a href="javascript:;">\n' +
                '        <div class="star-top star-shining">\n' +
                '            <img class="normal" data-index="1" src="../../static/img/home/star/star_1_normal.png" alt="星球1">\n' +
                '            <img class="shining" data-index="1" src="../../static/img/home/star/star_1_shining.png" alt="星球1">\n' +
                '        </div>\n' +
                '        <div class="star-bottom">\n' +
                '            <p>参赛队伍 '+data.team_count+'支</p>\n' +
                '            <p>参赛队员 '+data.people_count+'人</p>\n' +
                '        </div>\n' +
                '    </a>\n' +
                '</div>');
            for (var i = 2; i < 7; i++){
                starArr.push('<div class="star-box star-box'+i+'" style="left: '+point[i-2][0]+';top: '+point[i-2][1]+'px;">\n' +
                    '    <a href="javascript:;">'
                );
                if(data.category[i-2][1]){
                    starArr.push('        <div class="star-top star-shining">');
                }else{
                    starArr.push('        <div class="star-top star-normal">');
                }
                starArr.push('            <img class="normal" src="../../static/img/home/star/star_'+i+'_normal.png" alt="星球'+i+'">\n' +
                    '            <img class="shining" src="../../static/img/home/star/star_'+i+'_shining.png" alt="星球'+i+'">\n' +
                    '        </div>\n' +
                    '        <div class="star-bottom">\n' +
                    '            <p class="name">'+data.category[i-2][0]+'</p>\n' +
                    '            <div class="progress">\n' +
                    '                <span class="bar" style="width: '+data.category[i-2][2]+'%;"></span>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </a>\n' +
                    '</div>');
            }

            $('.grap-box').append(starArr.join(''));

        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}


/**
 * 第二页的星球
 */
function getSecPoint(name){
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/?type=' + name + '&show=5',
        type: 'get',
        data:{},
        header:{
            'X-Requested-With':'XMLHttpRequest'
        },
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            $('.grap-box .star-box').remove();
            if(data.code == 200){
                secRandomPoint(data);
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 随机第二页的星球
 */
function secRandomPoint(data){
    // var secStarPointArr = [[400, 120], [400, 470], [750, 270], [120, 350], [10, 470], [300, 440], [600, 440]];
    var secStarPointArr = [['45%', 120], ['45%', 470],['60%', 460],['28%', 495], ['28%', 127], ['83.5%', 270], ['13%', 350], ['1%', 470], ['-1%', 350], ['70%', 500]];
    var len = data.message.length;
    var item  = data.message;

    var starArr = [];

    for (var i = 2; i < len + 2; i++) {
        var index = Math.round(Math.random()*(secStarPointArr.length-1));

        starArr.push('<div class="star-box star-box'+i+'" data-left="'+secStarPointArr[index][0]+'" style="left: '+secStarPointArr[index][0]+';top: '+secStarPointArr[index][1]+'px;">\n' +
            '    <a href="http://127.0.0.1:8000/challenges/category/1/?id='+item[i-2].id+'">'
        );
        starArr.push('<input type="hidden" id="ranklist" value="'+item[i-2].ranking.join(',')+'">');
        if(i % 2 == 0){
            starArr.push('        <div class="star-top star-shining">');
        }else{
            starArr.push('        <div class="star-top star-normal">');
        }
        // var index1;
        // if(index == 0 || index == 1){
        //     index1 = 11;
        // }else{
        //     index1 = index;
        // }

        var index1 = (index == 1 || index == 0) ? 11 : index;
        starArr.push('            <img class="normal" src="../../static/img/home/star/star_'+(index1)+'_normal.png" alt="星球'+i+'">\n' +
            '            <img class="shining" src="../../static/img/home/star/star_'+(index1)+'_shining.png" alt="星球'+i+'">\n' +
            '        </div>\n' +
            '        <div class="star-bottom">\n' +
            '            <p class="name" style="font-size: 13px">'+item[i-2].name+'</p>\n' +
            '        </div>\n' +
            '    </a>\n' +
            '</div>');

        secStarPointArr.splice(index, 1);
    }
    $('.grap-box').append(starArr.join(''));
    //动态添加悬停效果
    $('.star-box').hover(function () {

        var dataLeft = $(this).attr('data-left');

        var ranklist = $(this).find('input#ranklist').val();
        //给目标元素添加弹框
        if(ranklist != ''){
            $('ul#popup-rank-list').html('');
            var rankArr = ranklist.split(',');
            var str = '';
            for (var i = 0; i < rankArr.length; i++) {
                str += '<li>'+rankArr[i]+'</li>';
            }

            if(parseInt(dataLeft) < 50){
                var $popup = $('<div class="popup-tip popup-tip2" style="display: block">\n' +
                    '    <div class="popup-content">\n' +
                    '        <h6>星球前3名</h6>\n' +
                    '        <ul id="popup-rank-list">'+str+'</ul>\n' +
                    '    </div>\n' +
                    '</div>');
                $(this).find('.star-bottom').append($popup);
            }else{
                var $popup = $('<div class="popup-tip popup-tip1" style="display: block">\n' +
                    '    <div class="popup-content">\n' +
                    '        <h6>星球前3名</h6>\n' +
                    '        <ul id="popup-rank-list">'+str+'</ul>\n' +
                    '    </div>\n' +
                    '</div>');
                $(this).find('.star-bottom').append($popup);
            }

        }else{
            $('ul#popup-rank-list').html('');

            if(parseInt(dataLeft) < 50){
                var $popup1 = $('<div class="popup-tip popup-tip2" style="display: block">\n' +
                    '    <div class="popup-content">\n' +
                    '        <h6>星球前3名</h6>\n' +
                    '        <div style="color: #01ffff;font-size: 12px;line-height: 30px;">暂无消息</div>\n' +
                    '    </div>\n' +
                    '</div>');
                $(this).find('.star-bottom').append($popup1);
            }else{
                var $popup1 = $('<div class="popup-tip popup-tip1" style="display: block">\n' +
                    '    <div class="popup-content">\n' +
                    '        <h6>星球前3名</h6>\n' +
                    '        <div style="color: #01ffff;font-size: 12px;line-height: 30px;">暂无消息</div>\n' +
                    '    </div>\n' +
                    '</div>');
                $(this).find('.star-bottom').append($popup1);
            }
        }

    }, function () {
        $(this).find('.popup-tip').remove();
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

/**
 * 获取列表
 * @type {jQuery|HTMLElement}
 */
// transformList(0);
function transformList(index) {
    var $liArr = $('ul#score-rank-list li.rank-item div.rank-item-content');
    if(index < $liArr.length){
        transform3D($liArr[index], index);
    }else{
        return;
    }
}
/**
 * 3d翻转
 */
function transform3D(DOM, index) {
    $('ul#score-rank-list li#rank-item'+(index+1)).css('display', 'block');
    var num = 0;
    var time = window.setInterval(function () {
        num += 10;
        if(num<180){
            $(DOM).css('transform', 'rotateY('+num+'deg)');

            $(DOM).find('.rank-front').fadeOut();
            $(DOM).find('.rank-back').fadeIn();

        }else{
            // $(DOM).css('transform', 'rotateY(0deg)');
            window.clearInterval(time);
            transformList(index + 1);
        }
    }, 50)
}
