/**
 * 倒计时
 * @param time 截至时间
 * 格式："2016-10-22 23:23:23"
 * 注意：time不能小于目前的时间，当time小于或等于现在的时间时，则倒计时置0
 */
function countTime(time) {
    //获取当前时间
    var date = new Date();
    var now = date.getTime();
    //设置截止时间
    var endDate = new Date(time);
    var end = endDate.getTime();
    //时间差
    if(end <= now){
        document.getElementById("counttime").innerHTML = '00:00:00';
        return;
    }
    var leftTime = end-now;
    //定义变量 d,h,m,s保存倒计时的时间
    var d,h,m,s;
    if (leftTime>=0) {
        h = Math.floor(leftTime/1000/60/60%24);
        m = Math.floor(leftTime/1000/60%60);
        s = Math.floor(leftTime/1000%60);
    }
    if(h == 0 && m == 0 && s == 0){
        document.getElementById("counttime").innerHTML = '00:00:00';
        return;
    }
    h = h<10? '0'+h:h;
    m = m<10? '0'+m:m;
    s = s<10? '0'+s:s;

    //将倒计时赋值到div中
    document.getElementById("counttime").innerHTML = h+':'+m+':'+s;
    //递归每秒调用countTime方法，显示动态时间效果
    setTimeout(function () {
        countTime(time)
    }, 1000)

}