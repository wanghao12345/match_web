/**
 * Created by wanghao on 2018/9/7
 */

$(function(){
    /**
     * 关闭右上角信息框
     */
    $(".j-msg-con").on('click', '.end', function(event) {
        $(this).closest(".j-msg-con").KOTipHide();
    });

    $(".win-subject").on('click', '.j-open .title', function(event) {
        event.preventDefault();
        var $this = $(this),$tip = $this.closest(".j-open");
        if($tip.hasClass("open")){
            $tip.removeClass("open");
        }else{
            $tip.addClass("open");
        }
    });

    /**
     * 题目详情框
     * @type {*|jQuery}
     */
    var Pop_rule = $(".win-subject").popUp({"visible":false,"width":800});
    //打开
    $(".j-show-subject-ul").on('click','li', function(event) {
        var cid = $(this).find('input#cid').val();
        var point = $(this).find('input#point').val();
        $('input#sub-key').val('');
        $('input#opera-restart').css('display', 'none');
        $('input#opera-topic').css('display', 'inline-block');
        $('#opera-result').html('');

        getSubjectDetail(cid, point, Pop_rule);
        // Pop_rule.showPop();
    });
    $(".j-subject-tab").on('initEnd', function(event) {
        Pop_rule.resizePop()
    });
    //切换题目和完成队伍tab
    $(".j-subject-tab").KOtab({autoplay:0,callback:function($el){
            $el.find(".j-open").addClass("open");
            setTimeout(function(){
                Pop_rule.resizePop()
            },300)
    }});

    /**
     * 初始化题目列表
     */
    requestSubjectList();
    /**
     * 下发题目
     */
    $('input#opera-topic').on('click', function () {
        sendSubject('topic');
    });
    /**
     * 延长时间
     */
    $('input#opera-delay').on('click', function () {
        sendSubject('delay');
    });
    /**
     * 重新下发
     */
    $('input#opera-restart').on('click', function () {
        sendSubject('restart');
    });

    /**
     * 发送答案key
     */
    $('a#sub-sendKey').on('click', function () {
        var data = {
            shallenge: $(this).find('input#sub-shallenge').val(),
            key: $('input#sub-key').val()
        }
        if(data.key == ''){
            layer.alert('key不能为空！');
        }else{
            sendKey(data);
        }
    });
    /**
     * 提交答案Flag
     */
    $('a#sub-submit').on('click', function () {
        var data = {
            shallenge: $('input#sub-shallenge').val(),
            key: $('input#sub-key').val()
        }
        if(data.key == ''){
            layer.alert('key不能为空！');
        }else{
            sendKey(data);
        }
    });


})
/**
 * 请求题目列表
 */
function requestSubjectList() {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/?type=' + $('#subject-type').html(),
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                var item = data.message;
                var arr = [];
                $('ul#subject-list').html('');
                item.forEach(function (value) {
                    arr.push('<li>\n' +
                             '  <input type="hidden" value="'+value.id+'" id="cid">\n' +
                             '  <input type="hidden" value="'+value.point+'" id="point">\n' +
                             '  <div class="lump">\n' +
                             '    <div class="lump-inner">\n' +
                             '      <div class="top-lump">\n' +
                             '        <h2>题目类型:' + $('#subject-type').html() + '</h2>\n' +
                             '        <h3>分值:'+value.point+'pt</h3>\n' +
                             '        <h4><i class="i-icon i-tip"></i><span>提示</span></h4>\n' +
                             '      </div>\n' +
                             '      <div class="mid-lump">\n' +
                             '        <div class="cont">\n' +
                             '          题目名称:'+value.name+'' +
                             '        </div>\n' +
                             '      </div>\n' +
                             '      <div class="end-lump">\n' +
                             '        <h2>'+(value.ranking[0]==undefined? '' : '第一名:'+ value.ranking[0])+'</h2>\n' +
                             '        <h2>'+(value.ranking[1]==undefined? '' : '第二名:'+ value.ranking[1])+'</h2>\n' +
                             '        <h2>'+(value.ranking[2]==undefined? '' : '第三名:'+ value.ranking[2])+'</h2>\n' +
                             '      </div>\n' +
                             '    </div>\n' +
                             '    <i class="i-1"></i><i class="i-2"></i>\n' +
                             '  </div>\n' +
                             '</li>');
                });
                $('ul#subject-list').append(arr.join(''));

            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 题目详情
 * @param cid 题目id
 * @param Pop_rule 弹框
 */
function getSubjectDetail(cid, point, Pop_rule) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/des/?type=' + $('#subject-type').html() + '&cid=' + cid,
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                if(data.message.type == '1'){
                    subjectType1(data, point, Pop_rule);
                }
                if(data.message.type == '2'){
                    subjectType2(data, point, Pop_rule);
                }

            }else{
                layer.alert('题目详情获取失败！');
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 题目类型1
 * @param data
 */
function subjectType1(data, point, Pop_rule) {
    $('.win-popUp .sub-type1').css('display', 'block');
    $('.win-popUp .sub-type2').css('display', 'none');
    $('.win-popUp #input-key').html('Key:');

    var item = data.message;
    $('#sub-type').html('题目类型:' + $('#subject-type').html());
    $('#sub-point').html('题目类型:分值:'+point+'pt');
    $('#sub-name').html(item.name);
    if(item.prompt){
        $('#sub-prompt-box').css('display', 'block');
        $('#sub-prompt-box #sub-prompt').html(item.prompt);
    }else{
        $('#sub-prompt-box').css('display', 'none');
    }
    $('#sub-description').html(item.description);
    $('#sub-shallenge').val(item.id);

    $('table#sub-table tr.sub-tr').remove();
    var rankArr = item.ranking;
    var tableArr = [];
    rankArr.forEach(function (value, index, arr) {
        tableArr.push(' <tr class="sub-tr">\n' +
            '  <td>' + (index+1) + '</td>\n' +
            '  <td>' + value.name + '</td>\n' +
            '  <td>' + value.team + '</td>\n' +
            '  <td>' + value.datetime + '</td>\n' +
            '</tr>');
    })

    $('table#sub-table').append(tableArr.join(''));
    Pop_rule.showPop();
}
/**
 * 题目类型2
 * @param data
 */
function subjectType2(data, point, Pop_rule) {
    $('.win-popUp .sub-type1').css('display', 'none');
    $('.win-popUp .sub-type2').css('display', 'block');
    $('.win-popUp .sub-type2-progress').css('display', 'none');
    $('.win-popUp #input-key').html('Flag:');

    var item = data.message;
    $('#sub-type').html('题目类型:' + $('#subject-type').html());
    $('#sub-point').html('题目类型:分值:'+point+'pt');
    $('#sub-name').html(item.name);
    $('#sub-description').html(item.description);
    $('#sub-shallenge').val(item.id);

    $('table#sub-table tr.sub-tr').remove();
    var rankArr = item.ranking;
    var tableArr = [];
    rankArr.forEach(function (value, index, arr) {
        tableArr.push(' <tr class="sub-tr">\n' +
            '  <td>' + (index+1) + '</td>\n' +
            '  <td>' + value.name + '</td>\n' +
            '  <td>' + value.team + '</td>\n' +
            '  <td>' + value.datetime + '</td>\n' +
            '</tr>');
    })

    $('table#sub-table').append(tableArr.join(''));
    Pop_rule.showPop();
}

/**
 * 下发题目和延长时间
 * @param opera (topic: 下发题目， delay: 延时， restart: 重启)
 * @param uid 题目id
 */
function sendSubject(opera) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/control/topic/?opera='+opera+'&uid='+$('input#sub-shallenge').val(),
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            console.log(data);
            if(data.code == 200){
                if(opera == 'topic'){
                    setProgress(function () {
                        $('input#opera-restart').css('display', 'inline-block');
                        $('input#opera-topic').css('display', 'none');
                        $('#opera-result').html(data.message);
                    })
                }else if(opera == 'restart'){
                    $('input#opera-restart').css('display', 'none');
                    $('input#opera-topic').css('display', 'inline-block');
                    $('#opera-result').html(data.message);
                }else{
                    $('#opera-result').html(data.message);
                }
            }
            if(data.code == 201){
                if(opera == 'topic'){
                    window.setTimeout(function () {
                        sendSubject('topic');
                    }, 1000)
                }
            }

            if(data.code == 400){
                $('#opera-result').html(data.message);
            }

        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}
/**
 * 发送答案
 * @param param
 */
function sendKey(param) {
    var csrftoken = getCookie('X-CSRFToken');
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/solve-challenge/',
        type: 'post',
        data:param,
        dataType: 'json',
        crossDomain: true,
        headers:{
            'Cookie': 'sessionid=3oifovm4jjzdnppm4v3uzhiuw9i0o25s',
            'X-CSRFToken':'V8ReEEftaxCvZQdL7cPRpZlhdv9gWWgIUakk5yLTq4k9cJwIxhd0xLeeL3vneK8j'
        },
        timeout: 1000,
        success: function (data) {
            if(data.code == 200 || data.code == 412){ //正确
                $('.answer-correct').css('display', 'block');
                $('.answer-error').css('display', 'none');
                window.setTimeout(function () {
                    window.location.reload();
                }, 2000)
            }else{ //错误
                $('.answer-correct').css('display', 'none');
                $('.answer-error').css('display', 'block');
                window.setTimeout(function () {
                    $('.answer-correct').css('display', 'none');
                    $('.answer-error').css('display', 'none');
                }, 2000)
            }



        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 进度条
 * @param num
 */
function setProgress(callback){
    $('.sub-type2-progress').css('display', 'flex');
    var num = 0;
    var time = window.setInterval(function () {
        num += (Math.floor(Math.random()*10+1));
        if(num>=100){
            num = 100;
            $(".j-progress i").width(num + '%');
            $(".j-progress .num").html(num + '%');
            window.clearInterval(time);
            $('.sub-type2-progress').css('display', 'none');
            $(".j-progress i").width('0%');
            $(".j-progress .num").html('0%');
            callback();
        }else{
            $(".j-progress i").width(num + '%');
            $(".j-progress .num").html(num + '%');
        }
    }, 500)
}

/**
 * 获取Cookie
 * @param name
 * @returns {*}
 */
function getCookie(name) {
    // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) {
        return unescape(arr[2]);
    }
    return null;
}











