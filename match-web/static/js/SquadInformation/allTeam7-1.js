$(function(){
    /**
     * 回车查询
     */
    $('input#search-input').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            //回车执行查询
            if($(this).val()==''){
                myPage('http://s.hackcoll.com:3334/accounts/team-page');
            }else{
                myPage('http://s.hackcoll.com:3334/accounts/search-team');
            }
        }
    });

    myPage('http://s.hackcoll.com:3334/accounts/team-page');
})



/**
 * 分页
 * @type {*|jQuery}
 */
function myPage(url) {
    $('.j-my-page').pagination({
        pageCount: 0, //初始化页数
        showData: 15,//每页显示的条数
        callback: function (api) {
            var data = {
                name: $('input#search-input').val(),
                page: api.getCurrent(),
                show: 15
            };
            requestTable(url,data);
        }
    },function(api){
        api.$el.siblings("i.first").html("共"+api.getPageCount()+"页");
        var data = {
            name: $('input#search-input').val(),
            page: api.getCurrent(),
            show: 15
        };
        requestTable(url,data, api);
    });
}


/**
 * 分页数据处理
 * @param page
 */
function requestTable(myUrl,params, api) {
    $.ajax({
        url: myUrl,
        type: 'get',
        data:params,
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(api){
                api.setPageCount(Math.ceil(data.count/10));
                api.init();
            }
            if(data.code == 200){
                $('table#data tr.data-tr').remove();
                var tableData = data.message;
                var arr = [];
                for (var i = 0; i < 10; i++ ){
                    if(!tableData[i]){
                        break;
                    }
                    arr.push('<tr class="data-tr"><td>'+(i+1)+'</td>\n' +
                        '<td><a href="/accounts/team/'+i+'">'+tableData[i].name+'</a></td>\n' +
                        '<td>'+tableData[i].created_at+'</td>\n' +
                        '<td>'+tableData[i].users.join('、')+'</td>\n' +
                        '</tr>');
                }
                $('table#data').append(arr.join(''));
                onFooter();
            }
        },
        fail: function (err) {
            console.log(err)
        }
    })
}