/**
 * Created by wanghao on 2018/9/7
 */

$(function(){
    /**
     * 题目详情框
     * @type {*|jQuery}
     */
    var Pop_rule = $(".win-subject").popUp({"visible":false,"width":800});
    /**
     * 初始化题目列表
     */
    // requestSubjectList(Pop_rule);
    myPage('http://s.hackcoll.com:3334/challenges/api/category/', Pop_rule)
    /**
     * 关闭右上角信息框
     */
    // $("body").on('click', '.j-msg-con .end', function(event) {
    //     $(this).parent('.j-msg-con').remove();
    // });
    //
    // $(".win-subject").on('click', '.j-open .title', function(event) {
    //     event.preventDefault();
    //     var $this = $(this),$tip = $this.closest(".j-open");
    //     if($tip.hasClass("open")){
    //         $tip.removeClass("open");
    //     }else{
    //         $tip.addClass("open");
    //     }
    // });
    /**
     * 打开题目详情框
     */
    $(".j-show-subject-ul").on('click','li', function(event) {
        var cid = $(this).find('input#cid').val();
        var point = $(this).find('input#point').val();
        var status = $(this).find('input#answer-status').val();
        $('input#sub-key').val('');
        $('input#opera-restart').css('display', 'none');
        $('input#opera-topic').css('display', 'inline-block');
        $('#opera-result').html('');
        getSubjectDetail(cid, point, Pop_rule, status);

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
     * 倒计时
     */
    countTime("2018-09-17 17:08:00");
    /**
     * 下发题目
     */
    $('.win-popUp').on('click', 'input#opera-topic', function () {
        $('#opera-result').html('下发题目中...');
        sendSubject('topic');
    });
    /**
     * 延长时间
     */
    $('.win-popUp').on('click', 'input#opera-delay', function () {

        if($(this).attr('data-delayStatus')=='1'){
            $('.answer-result-restart').html($('#opera-result').html());
            $('#opera-result').html('延长时间中...');
            sendSubject('delay');
        }
    });
    /**
     * 重新下发
     */
    $('.win-popUp').on('click', 'input#opera-restart', function () {
        $('.answer-result-restart').html($('#opera-result').html());
        $('#opera-result').html('正在重启中...');
        // $('input#opera-delay').attr('data-delayStatus', '0');
        // $('input#opera-delay').css({
        //     'cursor':'no-drop',
        //     'color':'#cfcbcb',
        //     'border-color':'#c9c2c2'
        // });
        sendSubject('restart');
    });

    /**
     * 发送答案key
     */
    $('.win-popUp').on('click', 'a#sub-sendKey', function () {
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
    $('.win-popUp').on('click', 'a#sub-submit', function () {
        var data = {
            shallenge: $(this).find('input#sub-shallenge').val(),
            key: $('input#sub-key').val()
        }
        if(data.key == ''){
            layer.alert('Flag不能为空！');
        }else{
            sendKey(data);
        }
    });




})

/**
 * 分页
 * @type {*|jQuery}
 */
function myPage(url, Pop_rule) {
    $('.j-my-page').pagination({
        pageCount: 0, //初始化页数
        showData: 10,//每页显示的条数
        callback: function (api) {
            var data = {
                type: $('#subject-type').html(),
                page: api.getCurrent()
            };
            requestTable(url,data,'',Pop_rule);
        }
    },function(api){
        api.$el.siblings("i.first").html("共"+api.getPageCount()+"页");
        var data = {
            type: $('#subject-type').html(),
            page: api.getCurrent()
        };
        requestTable(url,data, api, Pop_rule);
    });
}
/**
 * 分页数据处理
 * @param page
 */
function requestTable(myUrl,params, api, Pop_rule) {
    $.ajax({
        url: myUrl,
        type: 'get',
        data:params,
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(api){
                api.setPageCount(Math.ceil(data.count/10));
                api.init();
            }
            if(data.code == 200){
                var item = data.message;
                var arr = [];
                $('ul#subject-list').html('');
                item.forEach(function (value) {
                    arr.push('<li id="subject-item'+value.id+'">\n' +
                        '  <input type="hidden" value="'+value.id+'" id="cid">\n' +
                        '  <input type="hidden" value="'+value.point+'" id="point">\n' +
                        '  <div class="lump">\n' +
                        '    <div class="lump-inner">\n' +
                        '      <div class="top-lump">\n' +
                        '        <h2>题目类型:' + $('#subject-type').html() + '</h2>\n' +
                        '        <h3>分值:'+value.point+'pt</h3>');
                    if(value.status){
                        arr.push('<h4><i class="i-icon i-ok"></i>');
                        arr.push('<input type="hidden" id="answer-status" value="1">');
                    }else if(value.prompt){
                        arr.push('<h4><i class="i-icon i-tip"></i>');
                        arr.push('<input type="hidden" id="answer-status" value="0">');
                    }else{
                        arr.push('<h4><i class="i-icon"></i>');
                        arr.push('<input type="hidden" id="answer-status" value="0">');
                    }
                    if(value.status){
                        arr.push('<span>完成</span></h4>');
                    }else if(value.prompt){
                        arr.push('<span>提示</span></h4>');
                    }else{
                        arr.push('<span></span></h4>');
                    }
                    arr.push('</div>\n' +
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
                //判断是否弹出框
                isOpenDetail(Pop_rule);
            }
        },
        fail: function (err) {
            console.log(err)
        }
    })
}




/**
 * 请求题目列表
 */
function requestSubjectList(Pop_rule) {
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
                    arr.push('<li id="subject-item'+value.id+'">\n' +
                        '  <input type="hidden" value="'+value.id+'" id="cid">\n' +
                        '  <input type="hidden" value="'+value.point+'" id="point">\n' +
                        '  <div class="lump">\n' +
                        '    <div class="lump-inner">\n' +
                        '      <div class="top-lump">\n' +
                        '        <h2>题目类型:' + $('#subject-type').html() + '</h2>\n' +
                        '        <h3>分值:'+value.point+'pt</h3>');
                    if(value.status){
                        arr.push('<h4><i class="i-icon i-ok"></i>');
                        arr.push('<input type="hidden" id="answer-status" value="1">');
                    }else if(value.prompt){
                        arr.push('<h4><i class="i-icon i-tip"></i>');
                        arr.push('<input type="hidden" id="answer-status" value="0">');
                    }else{
                        arr.push('<h4><i class="i-icon"></i>');
                        arr.push('<input type="hidden" id="answer-status" value="0">');
                    }
                    if(value.prompt){
                        arr.push('<span>提示</span></h4>');
                    }else{
                        arr.push('<span></span></h4>');
                    }
                    arr.push('</div>\n' +
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
                //判断是否弹出框
                isOpenDetail(Pop_rule);
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
function getSubjectDetail(cid, point, Pop_rule, status) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/des/?type=' + $('#subject-type').html() + '&cid=' + cid,
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                if(data.message.type == '1'){
                    subjectType1(data, point, Pop_rule, status);
                }
                if(data.message.type == '2'){
                    subjectType2(data, point, Pop_rule, status);
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
function subjectType1(data, point, Pop_rule, status) {
    var item = data.message;
    $('#sub-type').html('题目类型:' + $('#subject-type').html());
    $('#sub-point').html('分值:'+point+'pt');

    $('#sub-shallenge').val(item.id);
    var popup_content_tab1 = '<div class="m-subject-text">\n' +
                        '  <div class="row row-horizontal">\n' +
                        '    <div class="name">题目名称：</div>\n' +
                        '    <div class="content">'+item.name+'</div>\n' +
                        '  </div>\n' +
                        '  <div class="row row-horizontal">\n' +
                        '    <div class="name">题目描述：</div>\n' +
                        '    <div class="content">'+item.description+'</div>\n' +
                        '  </div>';

                        if(item.prompt){
                            popup_content_tab1 +='  <div class="row-tip m-tip-box j-open open sub-type1" id="sub-prompt-box">\n' +
                                '    <div class="title">提示</div>\n' +
                                '    <div class="content">\n' +
                                '      <div class="msg">'+item.prompt+'</div>\n' +
                                '    </div>\n' +
                                '  </div>';
                        }

    popup_content_tab1 +='  <div class="row-href sub-type2-result" id="opera-result">\n' +
                        '  </div>';


                        if(status == 1){ //已回答过
                            popup_content_tab1 +='  <div class="row row-vertical has-answer" style="display: none;">\n' +
                                '    <div class="name" id="input-key">Flag：</div>\n' +
                                '    <input class="content" style="border: 0;width: 720px;height: 40px;padding: 0 5px;margin-top: 10px;" type="text" id="sub-key">\n' +
                                '  </div>\n' +
                                '  <div class="row-feedback">';
                            popup_content_tab1 +='    <div class="correct answer-correct" style="display: none">你已答对本题！请再接再厉！</div>\n' +
                                '    <div class="error answer-error" style="display: none;">抱歉，答案错误，请重新输入</div>\n' +
                                '    <div class="error answer-hasd">您或您的队友已回答过该题目</div>';
                        }else{
                            popup_content_tab1 +='  <div class="row row-vertical has-answer">\n' +
                                '    <div class="name" id="input-key">Key：</div>\n' +
                                '    <input class="content" style="border: 0;width: 720px;height: 40px;padding: 0 5px;margin-top: 10px;" type="text" id="sub-key">\n' +
                                '  </div>\n' +
                                '  <div class="row-feedback">';
                            popup_content_tab1 +='    <div class="correct answer-correct" style="display: none">你已答对本题！请再接再厉！</div>\n' +
                                '    <div class="error answer-error" style="display: none;">抱歉，答案错误，请重新输入</div>\n' +
                                '    <div class="error answer-hasd" style="display: none;">您或您的队友已回答过该题目</div>';
                        }

                        if(status == 1){ //已经回答
                            popup_content_tab1 +='  </div>\n' +
                                '  <div class="row-end has-answer has-answer1" style="display: none">\n' +
                                '    <a href="javascript:;" class="i-btn" id="sub-sendKey">\n' +
                                '      <input type="hidden" id="sub-shallenge" value="'+item.id+'">\n' +
                                '      Send Key</a>\n' +
                                '  </div>\n' +
                                '</div>';
                        }else{
                            popup_content_tab1 +='  </div>\n' +
                                '  <div class="row-end has-answer has-answer1">\n' +
                                '    <a href="javascript:;" class="i-btn" id="sub-sendKey">\n' +
                                '      <input type="hidden" id="sub-shallenge" value="'+item.id+'">\n' +
                                '      Send Key</a>\n' +
                                '  </div>\n' +
                                '</div>';
                        }

    $('#subject-tab-content').html(popup_content_tab1);
    var popup_content_tab2 = '<tr>\n' +
                             '  <th>序号</th>\n' +
                             '  <th>用户名</th>\n' +
                             '  <th>队伍</th>\n' +
                             '  <th>时间</th>\n' +
                             '</tr>';


    var rankArr = item.ranking;
    rankArr.forEach(function (value, index, arr) {
        popup_content_tab2 += '<tr>' +
            '<td>' + (index+1) + '</td>' +
            '<td>' + value.name + '</td>' +
            '<td>' + value.team + '</td>' +
            '<td>' + value.datetime + '</td>' +
            '</tr>';
    })

    $('#complete-tab-content').html(popup_content_tab2);
    Pop_rule.showPop();
}
/**
 * 题目类型2
 * @param data
 */
function subjectType2(data, point, Pop_rule, status) {
    var item = data.message;
    $('#sub-type').html('题目类型:' + $('#subject-type').html());
    $('#sub-point').html('分值:'+point+'pt');

    var popup_content_tab1 = '<div class="m-subject-text">\n' +
        '  <div class="row row-horizontal">\n' +
        '    <div class="name">题目名称：</div>\n' +
        '    <div class="content">'+item.name+'</div>\n' +
        '  </div>\n' +
        '  <div class="row row-horizontal">\n' +
        '    <div class="name">题目描述：</div>\n' +
        '    <div class="content">'+item.description+'</div>\n' +
        '  </div>';

    if(item.prompt){
        popup_content_tab1 +='  <div class="row-tip m-tip-box j-open open sub-type1" id="sub-prompt-box">\n' +
            '    <div class="title">提示</div>\n' +
            '    <div class="content">\n' +
            '      <div class="msg">'+item.prompt+'</div>\n' +
            '    </div>\n' +
            '  </div>';
    }

    if(item.url){ //有url
        popup_content_tab1 += '<div class="row-button sub-type2" style="margin-top: 30px;">\n' +
            '  <input type="button" id="opera-restart" class="i-button" value="重新下发">\n' +
            '  <input type="button" id="opera-topic" class="i-button" style="display: none;" value="下发题目">\n' +
            '  <input type="button" id="opera-delay" data-delayStatus="1" class="i-button" value="延长时间">\n' +
            '</div>';
        popup_content_tab1 +='  <div class="row-href sub-type2-result" id="opera-result">'+item.url+'</div>';
        popup_content_tab1 += '<div class="row-progress j-progress sub-type2-progress" style="display: none">\n' +
            '  <div class="name">下发进度</div>\n' +
            '  <div class="progress"><i style="width:0%"></i></div>\n' +
            '  <div class="num">0%</div>\n' +
            '</div>';
    }else{
        popup_content_tab1 += '<div class="row-button sub-type2" style="margin-top: 30px;">\n' +
            '  <input type="button" id="opera-restart" class="i-button" value="重新下发" style="display: none">\n' +
            '  <input type="button" id="opera-topic" class="i-button" value="下发题目">\n' +
            '  <input type="button" id="opera-delay" data-delayStatus="0" style="cursor: no-drop;color: #cfcbcb;border-color: #c9c2c2;" class="i-button" value="延长时间">\n' +
            '</div>';
        popup_content_tab1 +='  <div class="row-href sub-type2-result" id="opera-result"></div>';
        popup_content_tab1 += '<div class="row-progress j-progress sub-type2-progress">\n' +
            '  <div class="name">下发进度</div>\n' +
            '  <div class="progress"><i style="width:0%"></i></div>\n' +
            '  <div class="num">0%</div>\n' +
            '</div>';
    }

    if(status == 1){ //已回答过
        popup_content_tab1 +='  <div class="row row-vertical has-answer" style="display: none">\n' +
            '    <div class="name" id="input-key">Flag：</div>\n' +
            '    <input class="content" style="border: 0;width: 720px;height: 40px;padding: 0 5px;margin-top: 10px;" type="text" id="sub-key">\n' +
            '  </div>\n' +
            '  <div class="row-feedback">';
        popup_content_tab1 +='    <div class="correct answer-correct" style="display: none">你已答对本题！请再接再厉！</div>\n' +
            '    <div class="error answer-error" style="display: none;">抱歉，答案错误，请重新输入</div>\n' +
            '    <div class="error answer-hasd">您或您的队友已回答过该题目</div>';
    }else{
        popup_content_tab1 +='  <div class="row row-vertical has-answer">\n' +
            '    <div class="name" id="input-key">Flag：</div>\n' +
            '    <input class="content" style="border: 0;width: 720px;height: 40px;padding: 0 5px;margin-top: 10px;" type="text" id="sub-key">\n' +
            '  </div>\n' +
            '  <div class="row-feedback">';
        popup_content_tab1 +='    <div class="correct answer-correct" style="display: none">你已答对本题！请再接再厉！</div>\n' +
            '    <div class="error answer-error" style="display: none;">抱歉，答案错误，请重新输入</div>\n' +
            '    <div class="error answer-hasd" style="display: none;">您或您的队友已回答过该题目</div>';
    }
    if(status == 1){ //已经回答
        popup_content_tab1 +='  </div>\n' +
            '  <div class="row-end has-answer has-answer1" style="display: none">\n' +
            '    <a href="javascript:;" class="i-btn" id="sub-sendKey">\n' +
            '      <input type="hidden" id="sub-shallenge" value="'+item.id+'">\n' +
            '      提交</a>\n' +
            '  </div>\n' +
            '</div>';
    }else{
        popup_content_tab1 +='  </div>\n' +
            '  <div class="row-end has-answer has-answer1">\n' +
            '    <a href="javascript:;" class="i-btn" id="sub-sendKey">\n' +
            '      <input type="hidden" id="sub-shallenge" value="'+item.id+'">\n' +
            '      提交</a>\n' +
            '  </div>\n' +
            '</div>';
    }

    $('#subject-tab-content').html(popup_content_tab1);
    var popup_content_tab2 = '<tr>\n' +
        '  <th>序号</th>\n' +
        '  <th>用户名</th>\n' +
        '  <th>队伍</th>\n' +
        '  <th>时间</th>\n' +
        '</tr>';


    var rankArr = item.ranking;
    rankArr.forEach(function (value, index, arr) {
        popup_content_tab2 += '<tr>' +
            '<td>' + (index+1) + '</td>' +
            '<td>' + value.name + '</td>' +
            '<td>' + value.team + '</td>' +
            '<td>' + value.datetime + '</td>' +
            '</tr>';
    })

    $('#complete-tab-content').html(popup_content_tab2);
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
                        $('input#opera-delay').attr('data-delayStatus', '1');
                        $('input#opera-delay').css({
                            'cursor':'pointer',
                            'color':'#0ff',
                            'border-color':'#6EC5C3'
                        });
                    })
                }else if(opera == 'restart'){
                    // $('input#opera-restart').css('display', 'none');
                    // $('input#opera-topic').css('display', 'inline-block');

                    $('#opera-result').html(data.message);
                    setTimeout(function () {
                        $('#opera-result').html($('.answer-result-restart').html());
                    }, 2000);

                }else{
                    $('#opera-result').html(data.message);
                    setTimeout(function () {
                        $('#opera-result').html($('.answer-result-restart').html());
                    }, 2000);
                }
            }
            if(data.code == 201){
                if(opera == 'topic'){
                    window.setTimeout(function () {
                        sendSubject('topic');
                    }, 1000)
                }
                if(opera == 'restart'){
                    window.setTimeout(function () {
                        sendSubject('restart');
                    }, 1000)
                }
                if(opera == 'delay'){
                    window.setTimeout(function () {
                        sendSubject('delay');
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
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/solve-challenge/',
        type: 'post',
        data:param,
        dataType: 'json',
        crossDomain: true,
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){ //正确
                $('.answer-correct').html('你已答对本题！请再接再厉！');
                $('.answer-correct').css('display', 'block');
                $('.answer-error').css('display', 'none');
                window.setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }else if(data.code == 412){
                $('.answer-correct').html('你已答过本题！请回答下一道题！');
                $('.answer-correct').css('display', 'block');
                $('.answer-error').css('display', 'none');
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
 * 判断是否自动打开题目
 */
function isOpenDetail(Pop_rule) {
    var subject_id = getQueryString('id');
    if(subject_id != null){
        var cid    = $('li#subject-item'+subject_id).find('input#cid').val();
        var point  = $('li#subject-item'+subject_id).find('input#point').val();
        var status = $('li#subject-item'+subject_id).find('input#answer-status').val();
        $('input#sub-key').val('');
        $('input#opera-restart').css('display', 'none');
        $('input#opera-topic').css('display', 'inline-block');
        $('#opera-result').html('');
        getSubjectDetail(cid, point, Pop_rule, status);
    }
}
/**
 * 获取url中的参数
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
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










