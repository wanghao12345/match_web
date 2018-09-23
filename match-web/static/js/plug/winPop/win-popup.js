/*自定义弹层模块 S*/ ;
(function($, window, undefined) {

  var KOcode = function(options, element) {
    this.$el = $(element);
    this._init(options);
  };
  KOcode.defaults = {
    visible: true, //初始化的时候是否立即显示
    fullScreen: false, //是否默认全屏显示
    removePop: false, //关闭后是否彻底删除弹层(点击背景部分和关闭按钮都会移除)
    coverClose: true, //是否允许点击背景部分关闭弹层
    width: 800, //弹层宽度
    none: false, //true:去掉弹窗默认装饰
    closeBtn:true,//关闭按钮
    visionBtn:false,//最大化按钮
    titleShow: true, //显示标题
    animate: true, //打开弹窗时是否有动画效果
    titleName: "", //标题名称
    HTML: "" //弹层内容html
  };
  function getInt(num){
    if(num){
      num2 = parseFloat(num);
      return Math.ceil(num2);
    }else{
      return 0;
    }
  }
  KOcode.prototype = {
    _init: function(options) {
      this.options = $.extend(true, {}, KOcode.defaults, options);
      this._initEvents();
    },
    _initEvents: function() {
      var _this = this,$el = _this.$el;
      var $popcover = $el.children(".popUp-cover"), $popTitle = $el.find(".popUp-title"), $popInner = $el.find(".popUp-inner");
      _this.$popbar = $el.children(".popUp-bar");
      if(_this.isMob()){
        $el.addClass("popUp-mobile");
      }else{
        $el.addClass("popUp-pc");
      }
      if(_this.options.none){
        $el.addClass("none");
      }
      if (_this.options.titleShow) {
        if (_this.options.titleName) { $popTitle.find(".pop-name").text(_this.options.titleName) }
      } else { $popTitle.remove() }
      if (_this.options.HTML) {
        $popInner.html(_this.options.HTML);
      }
      if (_this.options.visible) {
        _this.showPop();
      }
      var $vision = $el.find(".j-operat-vision");
      if (_this.options.fullScreen) { $vision.addClass("vision-max") } else { $vision.removeClass("vision-max") }
      $vision.off('click.fullScreen').on('click.fullScreen', function(event) {event.stopPropagation(); 
        if ($vision.hasClass("vision-max")) {
          _this.options.fullScreen = 0;
          $vision.removeClass("vision-max");
          _this._setPopPosition();
        } else {
          $vision.addClass("vision-max");
          _this.options.fullScreen = 1;
          _this._setPopPosition();
        }
      });
      var imglist = [];
      $el.find("img").each(function(index, el) {
        imglist.push($(this).attr("src"))
      });
      loadImg(imglist, function() {
        _this.resizePop()
      })
      $el.off('click.popCancel').on('click.popCancel',".operat-cancel,.j-operat-cancel", function(event) {
        event.stopPropagation(); 
        if (_this.options.removePop) {
          _this.removePop($el);
        } else {
          _this.hidePop();
          if(DownTime60s){
              window.clearInterval(DownTime60s);
          }
        }
      });
      if(!_this.options.closeBtn){
        $el.find(".operat-cancel,.o-close").hide();
      }
       if(!_this.options.visionBtn){
        $el.find(".operat-vision,.o-vision").hide();
      }
      if (_this.options.coverClose) {
        $popcover.off('click.removebg').on('click.removebg', function(event) {
          if (_this.options.removePop) {
            _this.removePop($el);
          } else {
            _this.hidePop();
            if(DownTime60s){
               window.clearInterval(DownTime60s);
            }
          }
        });
      }
      if (_this.options.animate) {
        $(window).on('resize.popUp', function() {
          _this.$popbar.addClass("ani-poptd");
          setTimeout(function() {
            _this.resizePop();
          }, 300)
        });
      } else {
        $(window).on('resize.popUp', function() {
          _this.resizePop();
        });
      }
      if ($.fn.draggabilly) {
        _this.$popbar.draggabilly({ handle: '.popUp-title',containment: true});
      }else if($.fn.draggable){
        _this.$popbar.draggable({ handle: '.popUp-title',containment: "parent"});
      }
    },
    _getPopObj: function() {
      var winH = getInt($(window).height()),
        _this = this,
        winW = getInt($(window).width()),
        $el = _this.$el;
      var paddingH = getInt(_this.$popbar.css('padding-top')) + getInt(_this.$popbar.css('padding-bottom')),
        paddingW = getInt(_this.$popbar.css('padding-left')) + getInt(_this.$popbar.css('padding-right')),
        popconH, popObj = {},ow = this.options.width;
        ow = this.isPercentage(ow)?ow.replace("%","")*winW/100:ow;
      if (ow) {
        if (ow > winW) {
          ow = winW - paddingW;
        }
        _this.$popbar.width(ow);
        popW = ow;
      } else {
        popW = _this.$popbar.width();
        if (popW > winW || popW < _this.options.width) {
          popW = winW - paddingW;
          _this.$popbar.width(popW)
        }
      }
      var $overcon = $el.find(".popUp-content");
      var titH = getInt($el.find(".popUp-title").height());
      var conH = getInt($el.find(".popUp-body").height());
      var overH = winH - titH - paddingH; //此为全屏弹窗补正，让弹窗和窗口顶部底部有一定距离
      if (conH > overH) {
        popconH = overH;
      } else {
        popconH = conH;
      }
      popObj.popW = popW;
      popObj.maxW = winW - paddingW;
      popObj.maxH = winH - paddingH;
      popObj.maxoverH = winH - paddingH - titH;
      popObj.popH = popconH + titH;
      popObj.popL = (winW - popW - paddingH) / 2;
      popObj.popT = (winH - popObj.popH - paddingH) / 2;
      popObj.popoverH = popconH; //补正
      return popObj;
    },
    _setPopPosition: function() {
      var obj = this._getPopObj();
      if (this.options.fullScreen) {
        this.$popbar.find(".popUp-content").css({ "height": obj.maxoverH });
        this.$popbar.css({ "width": obj.maxW, "height": obj.maxH, "left": 0, "top": 0 });
      } else {
        this.$popbar.find(".popUp-content").css({ "height": obj.popoverH });
        this.$popbar.css({ "width": obj.popW, "height": obj.popH, "left": obj.popL, "top": obj.popT });
      }
    },
    clearPopForm: function(){
      var _this = this,$el = _this.$el;
      $el.find("input,textarea").not(":button, :submit, :reset,.no-clear").val("").removeAttr("checked");
      $el.find("select").val(0).trigger('change');
      if($el.find(".j-KOCity:visible").length>0){$(".j-KOCity:visible").data("id","");$(".j-KOCity:visible").KOCityUpdate();}
      if($.uniform.update){
        $.uniform.update();
      }
      $el.find('select.chzn-select').trigger('chosen:updated');
    },
    showPop: function() {
      var _this = this,
        $el = _this.$el
      if($el.length){
        $el.show();
        $("html").css({ "overflow": "hidden" });
        _this._setPopPosition();
        if (_this.options.animate) {
          _this.$popbar.addClass("ani-duration ani-bounceIn");
          setTimeout(function() {
            _this.$popbar.removeClass("ani-duration ani-bounceIn");
            _this.$popbar.addClass("ani-poptd");
          }, 300);
        }
        _this.resizePop();
      }
    },
    hidePop: function() {
      var $el = this.$el;
      $("html").css({ "overflow-y": "auto" });
      if ($el) {
        $el.hide();
      } else {
        $(".win-popUp").hide()
      }
      $el.children(".popUp-bar").removeAttr("style");
      $el.children(".popUp-bar").removeClass("ani-poptd");
    },
    removePop: function() {
      var $el = this.$el;
      $("html").css({ "overflow-y": "auto" });
      if (!$el) {
        var $el = $(".win-popUp:visible");
      }
      $el.remove();
      $el.length = 0;
    },
    resizePop: function(w) {
      var _this = this;
      if (w) { this.options.width = w }
      _this._setPopPosition();
    },
    option : function(option, value) {
      if(value) this.options[option] = value;
      else return this.options[option];
    },
    destroy:function(){
      this.$el.data(KOcode.name,"");
      this.removePop();
    },
    isPercentage:function(val){
      return new RegExp(/^\d+\.{0,1}\d+%$/).test(val)
    },
    isMob:function(){
      if(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)){  
        return true;  
      }else{  
        return false;  
      }  
    }  
  };

  function loadImg(pics, callback) {
    var len = pics.length,
      img = new Image(),
      index = 0;
    var load = function() {
      img.src = pics[index];
      img.onload = function() {
        // 控制台显示加载图片信息
        index++;
        if (index < len) {
          load();
        } else {
          callback();
        }
      }
      return img;
    }
    if (len > 0) {
      load();
    }
  }
  $.fn.popUp = function(options) {
    var $this = this,dataName = "popUp",instance = [];
    if ($this.length == 0) {
      var selector = $this.selector;
      $this = $('<div class="win-popUp"><div class="popUp-bar"><div class="operat-btn"><div class="o-close ani-pulse-hover j-operat-cancel"></div><div class="o-vision ani-pulse-hover j-operat-vision " title="最大化"></div></div><div class="popUp-title"><span class="pop-name">弹窗</span></div><div class="popUp-content"><div class="popUp-body"><div class="popUp-inner"></div></div></div></div><div class="popUp-cover"></div></div>').appendTo("body");
      if(selector.charAt(0)==="."){
        $this.addClass(selector.slice(1));
      }else if(selector.charAt(0)==="#"){
        $this.attr("id",selector.slice(1));
      }
    }
    if(typeof options === 'string'){
      var args = Array.prototype.slice.call(arguments, 1);  
      $this.each(function(i){
        instance[i] = $(this).eq(i).data(dataName)
        if(!instance[i]){
          console.log("初始化之前无法在"+dataName+"上调用方法; 试图调用方法 '" + options + "'");
          return;
        }
        if (!$.isFunction(instance[i][options]) || options.charAt(0) === "_"){
          console.log(dataName+"实例没有这样的方法 '" + options);
          return;
        }
        instance[i][options].apply(instance[i], args);
      });
    } else {
      $this.each(function(i){
        instance[i] = $(this).eq(i).data(dataName)
        if (instance[i]) {
          instance[i]._init(options);
        }else {
          instance[i] = new KOcode(options, this);
          KOcode.name = dataName;
          $(this).eq(i).data(dataName, instance[i]);
        }
      });
    }
    return instance.length>1?instance:instance[0];
  };
})(jQuery, window);
/*自定义弹层模块 E*/