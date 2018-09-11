/**
 * Created by wanghao on 2018/9/7
 */

$(function () {


    myPage1('http://s.hackcoll.com:3334/accounts/myteam');
    myPage2('http://s.hackcoll.com:3334/accounts/myteamsloved');

})

/**
 * 小队信息分页
 * @type {*|jQuery}
 */
function myPage1(url) {
    $('.j-my-page1').pagination({
        pageCount: 0, //初始化页数
        showData: 10,//每页显示的条数
        callback: function (api) {
            var data = {
                page: api.getCurrent(),
                team_id: $('div#team_id h2').attr('id')
            };
            requestTeamTable(url,data);
        }
    },function(api){
        api.$el.siblings("i.first").html("共"+api.getPageCount()+"页");
        var data = {
            page: api.getCurrent(),
            team_id: $('div#team_id h2').attr('id')
        };
        requestTeamTable(url,data, api);
    });
}
/**
 * 解决分页
 * @type {*|jQuery}
 */
function myPage2(url) {
    $('.j-my-page2').pagination({
        pageCount: 0, //初始化页数
        showData: 10,//每页显示的条数
        callback: function (api) {
            var data = {
                page: api.getCurrent()
            };
            requestResolveTable(url,data);
        }
    },function(api){
        api.$el.siblings("i.first").html("共"+api.getPageCount()+"页");
        var data = {
            page: api.getCurrent()
        };
        requestResolveTable(url,data, api);
    });
}
/**
 * 小队信息分页数据处理
 * @param page
 */
function requestTeamTable(myUrl,params, api) {
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
                $('table#data1 tr.data-tr').remove();
                var tableData = data.message;
                var arr = [];
                for (var i = 0; i < 10; i++ ){
                    if(!tableData[i]){
                        break;
                    }
                    arr.push('<tr class="data-tr">\n' +
                        '    <td>'+(i+1)+'</td>\n' +
                        '    <td>'+tableData[i].username +'</td>\n' +
                        '    <td>'+tableData[i].nickname +'</td>\n' +
                        '    <td>'+tableData[i].email +'</td>\n' +
                        '    <td>'+tableData[i].points +'</td>\n' +
                        '</tr>');
                }
                $('table#data1').append(arr.join(''));
            }
        },
        fail: function (err) {
            console.log(err)
        }
    })
}

/**
 * 团队解决分页数据处理
 * @param myUrl
 * @param params
 * @param api
 */
function requestResolveTable(myUrl, params, api) {
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
                $('table#data2 tr.data-tr').remove();
                var tableData = data.message;
                var arr = [];
                for (var i = 0; i < 10; i++ ){
                    if(!tableData[i]){
                        break;
                    }
                    arr.push(' <tr class="data-tr">\n' +
                        '    <td>'+(i+1)+'</td>\n' +
                        '    <td>'+tableData[i].nickname+'</td>\n' +
                        '    <td>'+tableData[i].category+'</td>\n' +
                        '    <td>'+tableData[i].challenge+'</td>\n' +
                        '    <td>'+tableData[i].points+'</td>\n' +
                        '    <td>'+tableData[i].datetime+'</td>\n' +
                        '</tr>');
                }
                $('table#data2').append(arr.join(''));
            }
        },
        fail: function (err) {
            console.log(err)
        }
    })
}
function getDate(num){
    var date = new Date().getHours(),dateArr = [],d;
    for(var i=1;i<=num;i++){
        d = date-i
        if(d<0){d += num}

        dateArr[num-i] = addZero(d) + ":00";
    }
    return dateArr
}
function addZero(num){
    if(num<10){
        return "0"+num;
    }else{
        return num;
    }
}