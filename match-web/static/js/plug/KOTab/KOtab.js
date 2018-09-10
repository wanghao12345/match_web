;(function($, window, undefined) {
  var KOcode = function(options, element) {
    this.$el = $(element);
    this._init(options);
  };
  KOcode.defaults = {
    animate: true,
    btn:true,//是否显示按钮
    prevButton:'.button-prev',
    nextButton:'.button-next',
    autoplay:1000,//自动切换延迟
    autoplayDOI: false,//用户操作后停止播放
    swiper:false,//是否使用swiper切换
    spaceBetween:0,//标题间隔
    slidesPerView:5,//swiper模式下，标题显示数量
    mousewheelControl:false,//swiper模式下，能使用鼠标滚轮滑动
    callback:function($el,ind){}
  };
  KOcode.prototype = {
    _init: function(options) {
      this.options = $.extend(true, {}, KOcode.defaults, options);
      this._initEvents();
    },
    _initEvents: function() {
      var _this = this,options = _this.options,$el = _this.$el;
      var ind = $el.find("dt.current").index();
      _this.$tabtt = $el.find(".tab-tt").eq(0);
      _this.$tabcn = $el.find(".tab-cn").eq(0);
      _this.$tabttDl = _this.$tabtt.children().eq(0);
      _this.$tabcnDl = _this.$tabcn.children().eq(0);
      _this.tabLength = _this.$tabttDl.children().length;
      ind = ind>0?ind:0;
      if($el.css("position")=="static"){$el.css("position","relative")}
      if(options.swiper && typeof Swiper =="function"){
        $tabttDl.addClass("swiper-wrapper");
        $tabttDl.children().addClass("swiper-slide");
        $tabcnDl.addClass("swiper-wrapper");
        $tabcnDl.children().addClass("swiper-slide");
        var Swiper_tabtt = new Swiper(_this.$tabtt,{
          spaceBetween:options.spaceBetween,
          slidesPerView :options.slidesPerView,
        }),Swiper_tabcn = new Swiper(_this.$tabcn,{      
         mousewheelControl:options.mousewheelControl,
         autoplay:options.autoplay,
         prevButton:options.prevButton,
         nextButton:options.nextButton,
         autoplayDisableOnInteraction : options.autoplayDOI,
         onSlideChangeStart:function(swiper){
            var _ind = swiper.activeIndex;
            _this.setCurrent(_this.$tabttDl.children().eq(_ind),"current");
            if(typeof options.callback === "function") {
              options.callback($el,_ind);
            }
          }
        });
        Swiper_tabcn.params.control = Swiper_tabtt;
        _this.$tabttDl.on('click', '.swiper-slide', function(event) {
          Swiper_tabcn.slideTo($(this).index());
        });
        _this.$tabttDl.children().eq(ind).trigger("click",true);
        if(options.autoplay){Swiper_tabcn.startAutoplay()}

      }else{
        _this.$tabcnDl.addClass("switch-main");
        if(options.animate&&!_this.isIE()){
          _this.$tabcnDl.children().addClass("switch-box switch-dd");
        }else{
          _this.$tabcnDl.children().addClass("switch-dd");
        }
        
        if(options.btn){
          if($el.css("position")=="static"){$el.css("position","relative")}
          if(_this.$prevbtn = _this.getQueay(options.prevButton)){
            _this.$prevbtn.on('click.KOtab',function(event) {
              event.preventDefault();
              _this.goNext(0);
            });
          }
          if(_this.$nextbtn = _this.getQueay(options.nextButton)){
            _this.$nextbtn.on('click.KOtab',function(event) {
              event.preventDefault();
              _this.goNext(1);
            });
          }
        }
        $el.off('click.KOtab').on('click.KOtab', 'dt:not(.current)', function(event,auto) {
          if(!$(this).parent().is(_this.$tabttDl)){
            return false;
          }
          var ind = $(this).index(),
          $curdd = $el.find("dd.switch-dd").eq(ind),
          $prevdd = _this.$tabcn.find(".current"),
          prevInd = $prevdd.index()>0?$prevdd.index():0;

          _this.setCurrent($(this),"current");
          _this.setCurrent($curdd,"current");

          if(options.animate&&!_this.isIE()){
            _this.setCurrent($prevdd,"prev-dd");
            _this.$tabcnDl.addClass("change-animate");
            if(prevInd>ind){
              _this.$tabcnDl.addClass("left-change");
            }else{
              _this.$tabcnDl.addClass("right-change");
            }
            setTimeout(function(){//动画效果300毫秒
              _this.$tabcnDl.removeClass("change-animate right-change left-change");
              $prevdd.removeClass("prev-dd");
            },300);
          }
          if(typeof options.callback === "function") {
            options.callback($el,ind);
            }
          if(_this.options.autoplay){
            _this.stopPlay();
            if(auto||!_this.options.autoplayDOI){
              _this.autoPlay();
            }
          }
        });
        _this.autoPlay();
        _this.setCurrent(_this.$tabttDl.children().eq(ind),"current");
        _this.setCurrent(_this.$tabcnDl.children().eq(ind),"current");
      }
      $el.trigger("initEnd");
    },
    setCurrent:function($q,cla){
      $q.addClass(cla).siblings().removeClass(cla);
    },
    getQueay:function(q){
      if(q){
        if((typeof q =="string" && $(q).length>0)||q instanceof jQuery){
          return typeof q =="string"?$(q):q;
        }
        return false;
      }
      return undefined;
    },
    autoPlay:function(){
      var _this = this;
      if(_this.options.autoplay){
          _this.autoInterval = setInterval(function(){
            _this.goNext(1,true);
          },_this.options.autoplay);
        }
    },
    stopPlay:function(){
      clearInterval(this.autoInterval);
    },
    goNext:function(ind,auto){
      var $curDt = this.$tabttDl.children(".current");
      if(ind){
        if($curDt.next().length){
           $curDt.next().trigger("click",auto);
        }else{
          this.$tabttDl.children().eq(0).trigger("click",auto);
        }
      }else{
        if($curDt.prev().length){
          $curDt.prev().trigger("click",auto);
        }else{
          this.$tabttDl.children().eq(this.tabLength-1).trigger("click",auto);
        }
      }
    },
    destroy:function(){
      this.$el.off("click.KOtab");
      this.$btn.remove();
      this.$btn = "";
      this.$el.data(KOcode.name,"");
    },
    isIE:function(){
      return (window.navigator.userAgent.indexOf("MSIE")>=1)?true:false;
    }
  }
  if(!$.fn.transform){
    $.fn.transform = function(transform){
        for (var i = 0; i < this.length; i++) {
           var elStyle = this[i].style;
           elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
      }
    }
  $.fn.KOtab = function(options) {
    var dataName = 'KOtab',instance = [];
    if(typeof options === 'string'){    
      var args = Array.prototype.slice.call(arguments, 1);  
      this.each(function(i){
        instance[i] = $(this).data(dataName)
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
      this.each(function(i){
        instance[i] = $(this).data(dataName)
        if (instance[i]) {
          instance[i]._init(options);
        }else {
          instance[i] = new KOcode(options, this);
          KOcode.name = dataName;
          $(this).data(dataName, instance[i]);
        }
      });
    }
    return instance.length>1?instance:instance[0];
  };

})(jQuery, window);