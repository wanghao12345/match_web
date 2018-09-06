(function(global, factory, plug){
    factory.call(global, global.jQuery, plug);

}(typeof window === 'undefined' ? this : window, function($, plug){
    //默认配置
    var __defs__ = {
        itemBox: '', //轮播子项
        outBox: '',  //轮播子项的外框
        speed: 1000 //轮播速度
    }

    $.fn[plug] = function (ops) {
        //扩展默认值
        var that = $.extend(this, __defs__, ops);
        //子项集合
        var item = $(that.itemBox);
        //轮播的子项个数
        var itemLen = item.length;
        //轮播的子项高度
        var itemHeight = item.height();
        //轮播框高度
        var scrollBoxHeight = that.height();
        //达到轮播的条件的最少轮播子项个数
        var isScrollLen = Math.ceil(scrollBoxHeight/itemHeight);
        //如果达到这个条件就滚动
        if (itemLen > isScrollLen && isScrollLen) {
            window.setInterval(function () {
                $(that.outBox).find(that.itemBox + ':first').animate({
                    marginTop: (itemHeight * (-1)) + 'px'
                }, 1000, function () {
                    var firstItem = $(that.outBox).children(that.itemBox).eq(0);
                    $(that.outBox).append(firstItem);
                    $(this).css({
                        marginTop: '0px'
                    })
                })

            }, 4000)
        }else{
            console.log('达不到滚动条件');
        }
    }







}, "textScroll"));