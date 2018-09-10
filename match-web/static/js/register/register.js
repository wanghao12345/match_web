$(function () {
    /**
     * 选择性别动画
     */
    $('input[name="sex"]').on('click', function () {
        $(this).shake(1, 7, 500);
    })


    /**
     * 选择技能
     */
    $('#skill').on('click', 'li', function () {
        var $status = $(this).attr('data-select');
        if($status=='false'){
            $(this).attr('data-select', 'true');
            $(this).css('background','#009688');
        }else{
            $(this).attr('data-select', 'false');
            $(this).css('background','#a2a2a2');
        }

        var $li = $('ul#skill-list li');
        var str = '';
        for (var i = 0; i< $li.length; i++){
            if($($li[i]).attr('data-select')=='true'){
                str += $($li[i]).text() + ',';
            }
        }
        $('input#skills').val(str.substring(0, str.length-1));

    })

    /**
     * 选择图片
     */
    $('button#selectPic input').on('change', function (e) {
        // $('.headImgInput').text($(this).val());
        $('.headImgInput').val(e.currentTarget.files[0].name);
    })

})


/**
 * 抖动
 * @param intShakes 次数
 * @param intDistance 距离
 * @param intDuration 时常
 * @returns {jQuery}
 */
jQuery.fn.shake = function (intShakes, intDistance, intDuration) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({position: 'relative'});
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({top: (intDistance * -1)}, (((intDuration / intShakes) / 4)))
                .animate({top: intDistance}, ((intDuration / intShakes) / 2))
                .animate({top: 0}, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
}