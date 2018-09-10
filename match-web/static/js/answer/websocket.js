// 初始化一个 WebSocket 对象
var ws = new WebSocket("ws://s.hackcoll.com:3334/ctf_channels");

// 建立 web socket 连接成功触发事件
ws.onopen = function () {
    // 使用 send() 方法发送数据
    ws.send("发送数据");
    console.log("数据发送中...");
};

// 接收服务端数据时触发事件
ws.onmessage = function (e) {
    // var received_msg = e.data;
    console.log("数据已接收...");
    var message = JSON.parse(e['data']);
    if ('event' in message && message['event'] in events_functions) {
        events_functions[message['event']](message);
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
    CHALLENGE_SOLVED: function(message){
        createNewNotification(
            message['team_id'] == my_team ? "恭喜！" : "你的队友答对了一道题目",
            `${message['team_name']} 的 ${message['user_name']} 答对一道题目 ${message['challenge_id']}`,
            message['team_id'] == my_team ? "success" : "success"
        );
    },
    JOIN_REQUEST: function(message){
        $('#badge_join').text(message['num_pending_requests']);
        createNewNotification(
            '有人请求加入你的队伍',
            `用户 ${message['user_name']} 想要加入到你的队伍`,
            'warning'
        );
    },
    JOIN_REQUEST_APPROVED: function(message){
        $('#badge_join').text(message['num_pending_requests']);
        createNewNotification(
            '你的请求正在处理中',
            `你有一条队伍请求处理 ${message['team_name']}`,
            'success'
        );
    },
    JOIN_REQUEST_REJECTED: function(message){
        $('#badge_join').text(message['num_pending_requests']);
        createNewNotification(
            '请求加入队伍被拒绝',
            `你的队伍请求被拒绝 ${message['team_name']}`,
            'error'
        );
    },
    JOIN_REQUEST_DELETED: function(message){
        $('#badge_join').text(message['num_pending_requests']);
        createNewNotification(
            '加入请求删除',
            `用户 ${message['user_name']} 取消加入队伍请求`,
            'warning'
        );
    },

    // GAME STATUS NOTIFICATIONS
    GAME_START: function(message){
        createNewNotification(
            'GAME START',
            'game start text',
            'success'
        );
    },

    GAME_PAUSE: function(message){
        createNewNotification(
            'GAME PAUSE',
            'game pause text',
            'warning'
        );
    },

    GAME_RESUME: function(message){
        createNewNotification(
            'GAME RESUME',
            'game resume text',
            'success'
        );
    },

    GAME_END: function(message){
        createNewNotification(
            'GAME END',
            'game end text',
            'error'
        );
    },
};

/**
 * 弹框
 * @param title 标题
 * @param text 内容
 * @param type 类型
 */
function createNewNotification(title, text, type='success'){
    $('.msg-con .cont').html(text);
    switch (type) {
        case "success":
            $('.msg-con').css('border-color', '#e91e63');
            break;
        case "warning":
            $('.msg-con').css('border-color', '#FFC107');
            break;
        case "error":
            $('.msg-con').css('border-color', '#01FFFF');
            break;
    }
    $(".j-msg-con").KOTip();
    window.setTimeout(function () {
        $(".j-msg-con").KOTipHide();
    }, 2000)
}

