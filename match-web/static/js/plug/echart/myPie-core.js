;
(function($, window, undefined) {

  var KOcode = function(options, element) {
    this.$el = $(element);
    this._init(options);
  };
  KOcode.defaults = {
    title: "", //标题
    dataArr: [], //二维数据数组
    dataName: [],//数据名称
    dataNumColor: ["#6CBEEA"], //数值颜色
    dataLineColor:["#6CBEEA"], //线颜色
    dataItemColor:["#6CBEEA"], //饼颜色
    textColor: "#6CBEEA", //全局文字颜色
    center:['50%', '50%'],//中心位置
    roseType : '',
    minAngle:0,
    unit:"",
    x_gap:[1,1],//x轴左右距离
    y_gap:[1,1],//y轴上下距离
    fontCorr: 1, //字号大小
    minFont: 0, //字号最小值
    radius: "50%",//图形占比
    ech_type: "radar", //雷达图
    echartHeight: 0.5, //图表的高宽比例，如果高是1，那么他的宽则为这个值乘以1
    customHeight: true, //使用原始高度,设置此项true，则echartHeight无效
    datalable: [], //线的名称
    noDateText: "暂无数据"
  };
  KOcode.prototype = {
    _init: function(options) {
      this.options = $.extend(true, {}, KOcode.defaults, options);
      this._initEvents();
    },
    _initEvents: function() {
      var _this = this,
        $el = _this.$el,
        options = _this.options;
      var font = parseInt($('html').css('font-size')) / 4 * options.fontCorr;
      _this.font = font;
      if (font < options.minFont) { font = options.minFont }
      var textColor = options.textColor,
        ttAlign = "center";
      if (options.dataArr.join(",").replace(/,/g, "") == "") {
        $el.html('<div class="no-data" style="position: absolute;top: 50%;left: 0;right: 0;text-align: center;margin-top: -.6em;opacity:0.8;font-size:'+font*options.fontCorr+'">' + options.noDateText + '</div>')
        return false;
      }
      _this.reloadChart();
      if(typeof $.fn.KOResize=="function"){
        $($(window).KOResize()).on('resize',function(event) {
          _this.reloadChart();
          if(_this.myChart){_this.myChart.resize()}
        });
      }else{
        $(window).on('resize',function(event) {
          _this.reloadChart();
          if(_this.myChart){_this.myChart.resize()}
        });
      }
    },
    getOption:function(){
      var _this = this,
        $el = _this.$el,
        options = _this.options;
      var font = parseInt($('html').css('font-size')) / 4 * options.fontCorr;
      _this.font = font;
      if (font < options.minFont) { font = options.minFont }
      var textColor = options.textColor,
        ttAlign = "center";
      var AllData = [];

      for (var i in options.dataArr) {
        AllData.push({
          value: options.dataArr[i],
          name: options.dataName[i],
          label: {
            normal: {
              formatter:'{c}'+options.unit,
              color: options.dataNumColor[i]
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: options.dataLineColor[i]
              }
            }
          },
          itemStyle: {
            normal: {
              color: options.dataItemColor[i]
            }
          },
        })
      }
      
      option = {
        title: {
          text: options.title,
          textStyle: {
            color: options.textColor
          }
        },
        textStyle:{fontSize:font*1.2,fontWeight:'normal',fontFamily:"microsoft yahei"},
        legend: {
          data: options.dataName,
          orient: 'vertical',
          //type: 'scroll',
          x: 'right',
          y: 'bottom',
          textStyle: {
            color: options.textColor
          },
        },
        series: [
          {
            type:'pie',
            radius : options.radius,
            center : options.center,
            roseType : options.roseType,
            minAngle:options.minAngle,
            data:AllData,
          }
        ],
        animationDuration:2000
      }
      return option;
    },
    arrayVal: function(val, i) {
      if (Object.prototype.toString.call(val) === '[object Array]') {
        return val[i];
      } else {
        return val;
      }
    },
    reloadChart : function(){
      var _this=this,$el = this.$el;
      if($el){

        if(!_this.options.customHeight||$el.height()==0){
          $el.height($el.width()*_this.options.echartHeight+(_this.options.y_gap[0]+_this.options.y_gap[1])*_this.font*1.2);
        }
      }
      if(typeof _this.myChart =="undefined"){
        _this.myChart = echarts.init($el[0]);
      }
      _this.myChart.setOption(_this.getOption());
    },
    refreshChart: function() {
      this.myChart.clear();
      this.reloadChart();
    },
    getNewData: function(newdata) { //传入含有"-"的数组，得到优化后的数组
      var j = 0;
      for (var i = 0; i < newdata.length; i++) {
        if (isNaN(newdata[i])) { newdata[i] = "-"; }
        if (newdata[i] == "-") {
          j = i;
          while (1) {
            if (newdata[++j] != "-") { break; };
          }
          newdata[i] = this.getFakeY(i - 1, newdata[i - 1], i, j, newdata[j]);
        }
      }
      return newdata;
    },
    getFakeY: function(x1, y1, x, x2, y2) { //传入前后点数据，得到中间没有值的数据
      var y = "-",
        y1 = parseFloat(y1),
        y2 = parseFloat(y2);
      if (y1 < y2) {
        y = parseFloat(((x - x1) * (y2 - y1) / (x2 - x1) + y1).toFixed(2));
      } else if (y1 >= y2) {
        y = parseFloat((y1 - (x - x1) * (y1 - y2) / (x2 - x1)).toFixed(2));
      }
      return y;
    },
    Divisible: function(a, b) {
      if (!isNaN(a)) {
        if (b == 1) {
          while (a % 3 !== 0) { a++; }
        } else if (b == 0) {
          while (a % 3 !== 0) { a--; }
        }
      }
      return a;
    }
  }

  $.fn.loadPie = function(options) {
    var dataName = 'Pie',instance = [];
    if(typeof options === 'string'){    
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
          instance[i] = new KOcode(options, this);
          $(this).eq(i).data(dataName, instance[i]);
        }
      });
    }
    return instance.length>1?instance:instance[0];
  };
})(jQuery, window);