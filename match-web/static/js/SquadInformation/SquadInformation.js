$(function () {
    /**
     * 分页
     */
    $('.j-page-nav-1').page({
        leng: 66,//分页总数
        activeClass: 'activP' , //active 类样式定义
        clickBack:function(page){
            //page 所选页码
            requestTable(page);
        }
    })

    $('.j-page-nav-2').page({
        leng: 66,//分页总数
        activeClass: 'activP' , //active 类样式定义
        clickBack:function(page){
            //page 所选页码
            requestTable(page);
        }
    })


})
/**
 * 分页数据处理
 * @param page
 */
function requestTable(page) {
    ajax({
        url: myUrl,
        type: 'get',
        dataType: 'json',
        timeout: 1000,
        success: function (data, status) {
            console.log(data)
        },
        fail: function (err, status) {
            console.log(err)
        }
    })
}