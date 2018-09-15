// 初始化一个 WebSocket 对象
var ws = new WebSocket("ws://s.hackcoll.com:3334/ctf_channels");

// 建立 web socket 连接成功触发事件
ws.onopen = function () {
    // 使用 send() 方法发送数据
    ws.send("发送数据");

    $('body').append('<div class="msg-tip-box" id="msg-tip-box">');

    console.log("数据发送中...");
};

// 接收服务端数据时触发事件
ws.onmessage = function (e) {
    // var received_msg = e.data;
    console.log("数据已接收...");
    try {
        var message = JSON.parse(e['data']);
        if ('event' in message && message['event'] in events_functions) {
            events_functions[message['event']](message);
        }
    }catch (e) {

    }

};
// 断开 web socket 连接成功触发事件
ws.onclose = function () {
    console.log("连接已关闭...");
};

/**
 * 不同的事件不同的处理
 * @type {{CHALLENGE_SOLVED: events_functions.CHALLENGE_SOLVED, JOIN_REQUEST: events_functions.JOIN_REQUEST, JOIN_REQUEST_APPROVED: events_functions.JOIN_REQUEST_APPROVED, JOIN_REQUEST_REJECTED: events_functions.JOIN_REQUEST_REJECTED, JOIN_REQUEST_DELETED: events_functions.JOIN_REQUEST_DELETED, GAME_START: events_functions.GAME_START, GAME_PAUSE: events_functions.GAME_PAUSE, GAME_RESUME: events_functions.GAME_RESUME, GAME_END: events_functions.GAME_END}}
 */
var events_functions = {
    ROUTINE_NOTICE: function(message){ //普通信息
        createNewNotification(
            message.message
        );
    },
    ROUTINE_NOTICE_WARNING : function(message){ //警告
        createNewNotification(
            message.message,
            'warning'
        );
    },

    JOIN_REQUEST_APPROVED: function(message){ //有队友加入
        createNewNotification(
            message.message
        );
    }
};

/**
 * 弹框
 * @param title 标题
 * @param text 内容
 * @param type 类型 1.success:成功   2.warning: 警告    3. error 错误
 */
function createNewNotification(text, type='success'){
    creatTip(text, type);

}

/**
 * 创建弹窗
 * @param text
 * @param type
 */
function creatTip(text, type) {
    var content = '';
    switch (type) {
        case "success":
            content = ' <div style="display: block !important;" class="msg-con1 effect-hidden j-msg-con j-msg-putong">\n' +
                '  <div class="cont">'+text+'</div>\n' +
                '  <div class="end">我知道了</div>\n' +
                '</div>';

            break;
        case "warning":
            content = ' <div style="display: block !important;" class="msg-con1 effect-hidden j-msg-con">\n' +
                '  <div class="cont">'+text+'</div>\n' +
                '  <div class="end">我知道了</div>\n' +
                '</div>';

            break;
        case "error":
            content = ' <div style="display: block !important;" class="msg-con1 effect-hidden j-msg-con j-msg-putong">\n' +
                '  <div class="cont">'+text+'</div>\n' +
                '  <div class="end">我知道了</div>\n' +
                '</div>';

            break;
    }
    if($('#msg-tip-box').length == 0){
        $('body').append('<div class="msg-tip-box" id="msg-tip-box">');
    }
    $('div#msg-tip-box').append(content);


    window.setTimeout(function () {
        $('div#msg-tip-box .j-msg-putong:first-child').remove();
    }, 1000)


}

/**
 * 关闭右上角信息框
 */

$(function () {
    $("body").on('click', '.j-msg-con .end', function(event) {
        $(this).parent('.j-msg-con').remove();
        if($('body #msg-tip-box').find('.msg-con1').length == 0){
            $('body #msg-tip-box').remove();
        }
    });
})
var removeTime = window.setInterval(function () {
    try {
        $('div#msg-tip-box').find('.j-msg-putong')[0].remove();
    }catch (e) {
        window.clearInterval(removeTime);
    }
    if($('body #msg-tip-box').find('.msg-con1').length == 0){
        $('body #msg-tip-box').remove();
    }
}, 2000)
