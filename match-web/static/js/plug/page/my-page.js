$(function(){
  var myPage = $('.j-my-page').pagination({
      totalData: 100,//数据总条数
      showData: 12,//每页显示的条数
      callback: function (api) {
        var data = {
            page: api.getCurrent()
        };
        console.log("加载第"+api.getCurrent()+"页数据")
        /*$.getJSON('https://www.easy-mock.com/mock/58fff7a5739ac1685205ad5d/example/pagination#!method=get', data, function (json) {
            console.log(json);
        });*/
      }
  },function(api){
    api.$el.siblings("i.first").html("共"+api.getPageCount()+"页");
    console.log("初始化","加载第"+api.getCurrent()+"页数据")
  });
})
