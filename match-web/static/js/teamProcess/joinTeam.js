$(function(){
    /**
     * 回车查询
     */
    $('input#search-input').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            //回车执行查询
            myPage();
        }
    });
    $('table#data').on('click', 'tr td a.join', function () {
        var data = {
            id: $(this).attr('data-id')
        }
        joinTeam(data);
    })


    myPage();
})



/**
 * 分页
 * @type {*|jQuery}
 */
function myPage(num) {
    $('.j-my-page').pagination({
        pageCount: 0, //初始化页数
        showData: 10,//每页显示的条数
        callback: function (api) {
            var data = {
                name: $('input#search-input').val(),
                page: api.getCurrent()
            };
            requestTable(data);
        }
    },function(api){
        api.$el.siblings("i.first").html("共"+api.getPageCount()+"页");
        var data = {
            name: $('input#search-input').val(),
            page: api.getCurrent()
        };
        requestTable(data, api);
    });
}


/**
 * 分页数据处理
 * @param page
 */
function requestTable(params, api) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/accounts/team-page/?page=1',
        type: 'get',
        data:{},
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
                tableData.forEach(function (item,index) {
                    arr.push('<tr class="data-tr"><td>'+index+'</td>\n' +
                        '<td>'+item.name+'</td>\n' +
                        '<td>'+item.created_at+'</td>\n' +
                        '<td>'+item.users.join(' ')+'</td>\n' +
                        '<td><a class="join" data-id="'+item.id+'">申请加入</a></td>\n' +
                        '</tr>');
                })
                $('table#data').append(arr.join(''));
            }
        },
        fail: function (err) {
            console.log(err)
        }
    })
}

/**
 * 加入队伍请求
 * @param params
 */
function joinTeam(params) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/accounts/team/request/create',
        type: 'post',
        data:params,
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                layer.alert(data.message, function () {

                });
            }
            if(data.code == 400){
                layer.alert(data.message);
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}