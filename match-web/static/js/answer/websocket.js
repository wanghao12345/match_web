// 初始化一个 WebSocket 对象
var ws = new WebSocket("ws://s.hackcoll.com:3334/ctf_channels");

// 建立 web socket 连接成功触发事件
ws.onopen = function () {
    // 使用 send() 方法发送数据
    ws.send("发送数据");
    console.log("数据发送中...");
};

// 接收服务端数据时触发事件
ws.onmessage = function (evt) {
    var received_msg = evt.data;
    console.log("数据已接收...");
};

// 断开 web socket 连接成功触发事件
ws.onclose = function () {
    console.log("连接已关闭...");
};