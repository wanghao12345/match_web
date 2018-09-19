/**
 * Created by wanghao on 2018/9/18
 */
window.onload=function(){
    var canvas=document.getElementById('canvas');
    canvas.height=728;
    canvas.width=1024;
    var context=canvas.getContext('2d');
    context.fillStyle='#3ED4F4';
    context.beginPath();
    context.arc(800,300,35,0,2*Math.PI,true);
    context.closePath();
    context.fill();
    setInterval(function(){
        // run(context);
    }, 50);
};
var speed=0;
var startPoint=800;
function run(cxt){
    speed=-7;
    cxt.clearRect(0,0,1024,728);
    //cxt.top+=speed;
    startPoint+=speed;
    cxt.beginPath();
    cxt.arc(startPoint,300,30,0,2*Math.PI,true);
    cxt.closePath();
    cxt.fill();
}