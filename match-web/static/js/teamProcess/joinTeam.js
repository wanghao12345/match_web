$(function () {
    /**
     * 分页
     */
    $('.page-nav').page({
        leng: 66,//分页总数
        activeClass: 'activP' , //active 类样式定义
        clickBack:function(page){
            //page 所选页码
            console.log(page)
        }
    })




})