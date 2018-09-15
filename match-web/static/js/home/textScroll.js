/**
 * Created by wanghao on 2018/9/16
 */

var TextScroll = function(scrollBox, outBox, itemBox, scrollHeight) {
    this.time = null;
    this.scrollBox = scrollBox;
    this.outBox = outBox;
    this.itemBox = itemBox;
    this.scrollHeight = scrollHeight;
}
/**
 * 初始化
 */
TextScroll.prototype.init = function () {
    var _this = this;
    //子项集合
    var item = $(this.itemBox);
    //轮播的子项个数
    var itemLen = item.length;
    //轮播的子项高度
    var itemHeight = item.height();
    //轮播框高度
    var scrollBoxHeight = $(this.scrollBox).height();
    //达到轮播的条件的最少轮播子项个数
    var isScrollLen = Math.ceil(scrollBoxHeight/_this.scrollHeight);
    //如果达到这个条件就滚动
    if (itemLen > isScrollLen && isScrollLen) {
        _this.time = window.setInterval(function () {

            $(_this.outBox).animate({
                marginTop: (_this.scrollHeight * (-1)) + 'px'
            }, 2000, function () {
                var firstItem = $(_this.outBox).children(_this.itemBox).eq(0);
                $(_this.outBox).append(firstItem);
                $(_this.outBox).css({
                    marginTop: '0px'
                })
            })
        }, 5000)
    }else{
        console.log('达不到滚动条件');
    }
};
/**
 * 启动
 */
TextScroll.prototype.start = function () {
    this.init();
};

/**
 * 暂停
 */
TextScroll.prototype.stop = function () {
    window.clearInterval(this.time);
};
