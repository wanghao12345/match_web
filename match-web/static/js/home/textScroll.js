(function(global, factory, plug){
    factory.call(global, global.jQuery, plug);

}(typeof window === 'undefined' ? this : window, function($, plug){
    //默认配置
    var __defs__ = {
        outBox: '',
        itemBox: '',
        speed: 1000
    }

    $.fn[plug] = function (ops) {
        //扩展默认值
        var that = $.extend(this, __defs__, ops);





    }







}, "textScroll"));