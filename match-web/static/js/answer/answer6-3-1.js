/**
 * Created by wanghao on 2018/9/7
 */

$(function(){

    $(".win-subject").on('click', '.j-open .title', function(event) {
        event.preventDefault();
        var $this = $(this),$tip = $this.closest(".j-open");
        if($tip.hasClass("open")){
            $tip.removeClass("open");
        }else{
            $tip.addClass("open");
        }
    });

    /**
     * 题目详情框
     * @type {*|jQuery}
     */
    var Pop_rule = $(".win-subject").popUp({"visible":false,"width":800});
    //打开
    $(".j-show-subject-ul").on('click','li', function(event) {
        var cid = $(this).find('input#cid').val();
        var point = $(this).find('input#point').val();
        getSubjectDetail(cid, point, Pop_rule);
        // Pop_rule.showPop();
    });
    $(".j-subject-tab").on('initEnd', function(event) {
        Pop_rule.resizePop()
    });
    //切换题目和完成队伍tab
    $(".j-subject-tab").KOtab({autoplay:0,callback:function($el){
            $el.find(".j-open").addClass("open");
            setTimeout(function(){
                Pop_rule.resizePop()
            },300)
    }});

    /**
     * 初始化题目列表
     */
    requestSubjectList();

    /**
     * 发送答案key
     */
    $('a#sub-sendKey').on('click', function () {
        var data = {
            shallenge: $(this).find('input#sub-shallenge').val(),
            key: $('input#sub-key').val()
        }
        if(data.key == ''){
            layer.alert('key不能为空！');
        }else{
            sendKey(data);
        }

    })


})

function setProgress(num){
    $(".j-progress i").width(num);
    $(".j-progress .num").html(num);
}


/**
 * 请求题目列表
 */
function requestSubjectList() {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/?type=' + $('#subject-type').html(),
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                var item = data.message;
                var arr = [];
                $('ul#subject-list').html('');
                item.forEach(function (value) {
                    arr.push('<li>\n' +
                             '  <input type="hidden" value="'+value.id+'" id="cid">\n' +
                             '  <input type="hidden" value="'+value.point+'" id="point">\n' +
                             '  <div class="lump">\n' +
                             '    <div class="lump-inner">\n' +
                             '      <div class="top-lump">\n' +
                             '        <h2>题目类型:' + $('#subject-type').html() + '</h2>\n' +
                             '        <h3>分值:'+value.point+'pt</h3>\n' +
                             '        <h4><i class="i-icon i-tip"></i><span>提示</span></h4>\n' +
                             '      </div>\n' +
                             '      <div class="mid-lump">\n' +
                             '        <div class="cont">\n' +
                             '          题目名称:'+value.name+'' +
                             '        </div>\n' +
                             '      </div>\n' +
                             '      <div class="end-lump">\n' +
                             '        <h2>第一名:'+value.ranking[0]+'</h2>\n' +
                             '        <h2>第二名:'+value.ranking[1]+'</h2>\n' +
                             '        <h2>第三名:'+value.ranking[2]+'</h2>\n' +
                             '      </div>\n' +
                             '    </div>\n' +
                             '    <i class="i-1"></i><i class="i-2"></i>\n' +
                             '  </div>\n' +
                             '</li>');
                });
                $('ul#subject-list').append(arr.join(''));

            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 题目详情
 * @param cid 题目id
 * @param Pop_rule 弹框
 */
function getSubjectDetail(cid, point, Pop_rule) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/challenges/api/category/des/?type=' + $('#subject-type').html() + '&cid=' + cid,
        type: 'get',
        data:{},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                var item = data.message;
                $('#sub-type').html('题目类型:' + $('#subject-type').html());
                $('#sub-point').html('题目类型:分值:'+point+'pt');
                $('#sub-name').html(item.name);
                $('#sub-description').html(item.description);
                $('#sub-shallenge').val(item.id);

                $('table#sub-table tr.sub-tr').remove();
                var rankArr = item.ranking;
                var tableArr = [];
                rankArr.forEach(function (value, index, arr) {
                    tableArr.push(' <tr class="sub-tr">\n' +
                                  '  <td>' + (index+1) + '</td>\n' +
                                  '  <td>' + value.name + '</td>\n' +
                                  '  <td>' + value.team + '</td>\n' +
                                  '  <td>' + value.datetime + '</td>\n' +
                                  '</tr>');
                })

                $('table#sub-table').append(tableArr.join(''));
                Pop_rule.showPop();
            }else{
                layer.alert('题目详情获取失败！');
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}

/**
 * 发送答案
 * @param param
 */
function sendKey(param) {
    $.ajax({
        url: 'http://s.hackcoll.com:3334/api/challenges/solve-challenge/',
        type: 'post',
        data:param,
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if(data.code == 200){
                layer.alert('答案正确！', function () {
                    window.location.reload();
                });
            }else if(data.code == 417){
                layer.alert('答案错误！');
            }else{
                layer.alert('发送失败！');
            }
        },
        fail: function (err) {
            layer.alert(err);
        }
    })
}