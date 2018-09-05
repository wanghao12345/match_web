;(function($, window, undefined){ 
  var KOCode = function(options, element){
    var _this = this;
    _this.$el = $(element);
    _this._init(options);
  };
  var is={types:["Array","Boolean","Date","Number","Object","RegExp","String","Window","HTMLDocument"]};for(var i=0,c;c=is.types[i++];){is[c]=(function(type){return function(obj){return Object.prototype.toString.call(obj)=="[object "+type+"]"}})(c)}
  KOCode.defaults = {
    time:0,
    animateTime:400,
    animateType:""
  };
  KOCode.prototype = {
    _init : function(options){
      this.options = $.extend(true, {}, KOCode.defaults, options);
      this._initEvents();
    },
    _initEvents : function(){
      var _this = this,options = _this.options,$el = _this.$el;

      _this.animateIn($el);
      if(options.time&&options.time>0){
        setTimeout(function(){
          _this.animateOut($el)
        },options.time)
      }
    },
    fadeIn : function(){
      var $el = this.$el,options = this.options;
      $el.removeClass('effect-hidden').addClass("effect-fadeOut");
      if ($el.hasClass('effect-fadeIn')) {
        return;
      }
      setTimeout(function() {
          $el.addClass('effect-fade effect-fadeIn').removeClass('effect-fadeOut');
        },0);
      setTimeout(function() {
          $el.removeClass('effect-hidden');
        },options.animateTime);
    },
    fadeOut : function() {
      var $el = this.$el,options = this.options;
      if ($el.hasClass('effect-hidden')) {
        return;
      }
      $el.addClass("effect-fade effect-fadeOut");
      $el.removeClass('effect-fadeIn');
      setTimeout(function() {
          $el.addClass("effect-hidden");
        },options.animateTime);
    },
    animateIn : function(){
      var $el = this.$el,options = this.options;
      $el.removeClass('effect-hidden').addClass("effect-fadeOut");
      if ($el.hasClass('effect-fadeIn')) {
        return;
      }
      setTimeout(function() {
          $el.addClass('effect-fade effect-fadeIn effect-'+options.animateType+'In').removeClass('effect-fadeOut effect-'+options.animateType+'Out');
        },0);
      setTimeout(function() {
          $el.removeClass('effect-hidden');
        },options.animateTime);
    },
    animateOut : function() {
      var $el = this.$el,options = this.options;
      if ($el.hasClass('effect-hidden')) {
        return;
      }
      $el.addClass('effect-fade effect-fadeOut effect-'+options.animateType+'Out');
      $el.removeClass('effect-fadeIn effect-'+options.animateType+'In');
      setTimeout(function() {
        $el.addClass("effect-hidden");
        $el.removeClass('effect-fade effect-fadeOut effect-'+options.animateType+'Out');
      },options.animateTime);
    }
  }
  $.fn.KOTipHide = function(){
    var instance = [];
    this.each(function(i){
      instance[i] = $(this).eq(i).data('KOTip');
      if(instance[i]){
        instance[i].animateOut(instance[i].$el)
      }
    })
  }
  $.fn.KOTip = function(options) {
    var dataName = 'KOTip',instance = [];
    if(is.String(options)){    
      var args = Array.prototype.slice.call(arguments, 1);  
      this.each(function(i){
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
      this.each(function(i){
        instance[i] = $(this).eq(i).data(dataName)
        if (instance[i]) {
          instance[i]._init(options);
        }else {
          instance[i] = new KOCode(options, this);
          $(this).eq(i).data(dataName, instance[i]);
        }
      });
    }
    return instance.length>1?instance:instance[0];
  };
})(jQuery, window);