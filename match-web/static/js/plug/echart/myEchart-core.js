;(function($, window, undefined){ 

  var Echart = function(options, element){
    this.$el = $(element);
    this._init(options);
  };
  Echart.defaults = {
    title: "",//标题
    dataArr:[],//二维数据数组
    Yarr:[],//y轴数据
    textColor:"#9FD7FF",//全局文字颜色
    fontCorr:1,//字号大小
    maxMin_val:[],//最大最小值，接受2个参数，第一个是最小值，第二个最大值
    Y_val:[],//y轴最大最小值
    minFont:0,//字号最小值
    x_gap:[1,1],//x轴左右距离
    y_gap:[1,1],//y轴上下距离
    weather:false,//true：天气线图按三段y轴平分
    MaxMinLine:false,//用于天气查询的最大值最小值线图,把最小值的数值定位到下方
    bound:true,//是否从0坐标开始
    symbol:"circle",//标识图形
    XYnumShow:true,//xy轴的数字是否显示
    numShow:true,//数据数值是否显示
    numUnit:"",//数据单位
    lineWeight:1,//线的宽度
    dianWeight:4,//点的宽度
    XWeight:true,//x轴线是否显示
    YWeight:true,//y轴线是否显示
    areaLineShow:true,//图标中间区域的线是否显示
    splitLine:true,
    arealinecolor:"rgba(255,255,255,0.2)",//横坐标区域线的颜色
    splitLineColor:"rgba(0,0,0,0)",//纵坐标区域线的颜色
    areaStyle:false,//画线区域是否填色
    areaColor:[],//指定画线区域要填充的颜色
    linecolor:["#01FFFF","#FFAA00"],//线的颜色
    diancolor:["#01FFFF","#FFAA00"],//点的颜色
    numcolor:["#01FFFF","#FFAA00"],//点上字的颜色
    markAreaColor:'rgba(0,0,0,0.1)',
    ech_type:"line",//线图还是饼图还是别的
    smooth:true,//是否是圆滑的线
    barWidth:0,//柱形图柱子宽度
    barCategoryGap:null,//
    barBorderRadius:[0],//柱状图的圆角
    longX:false,//当x轴文字超级长的情况会用到这个
    barPosition:'top',//标签的位置，可选：'inside','top','left','right','bottom',其他请参阅Echart...
    axisTickX:false,
    axisTickY:false,
    spNum:0,//y轴坐标分几段
    spInt:3,//强制分段
    inRange:'#43ba76',
    outRange:"#c00",
    Xunit:"",//x轴单位
    Yunit:"",//y轴单位
    XColor:"#333",//x轴线颜色
    YColor:"#333",//y轴线颜色
    XNameColor:"#01FFFF",//x轴线文字颜色
    YNameColor:"#01FFFF",//y轴线文字颜色
    echartHeight:0.5,//图表的高宽比例，如果高是1，那么他的宽则为这个值乘以1
    customHeight:false,//使用原始高度,设置此项true，则echartHeight无效
    datalable:[],//线的名称
    newUnit:false,//新的单位显示方式（y轴单位显示在左下，x轴单位显示在右下）
    noDateText:"暂无数据"
  };
  Echart.prototype = {
    _init : function(options){
      this.options = $.extend(true, {}, Echart.defaults, options);
      this._initEvents();
    },
    _initEvents : function(){
      var _this = this,$el = _this.$el,options= _this.options;
      _this.font=parseInt($('html').css('font-size'))/4*options.fontCorr;
      if(Object.prototype.toString.call(options.dataArr)!='[object Array]'){console.log("你传入的:"+options.dataArr+",为空或不是数组类型的数据，请传入数组类型的数据！");return false;}
      _this.Xarr = [].concat(options.Yarr);
      _this.echartData = _this.dataCorrection(options.dataArr);
      if(_this.echartData == false){
        this.$el.addClass("no-data").css({"text-align":"center","color":"#aaa"}).text("暂无数据");
      }else{
        this.$el.removeClass("no-data");
        _this.myChart = echarts.init($el[0]);
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
      var _this = this,$el = _this.$el,options= _this.options;
      var font = this.font;
      if(font<options.minFont){font=options.minFont}
      var textColor=options.textColor,ttAlign="center";
      var labletip = [],seriesArr_line=[],seriesArr_dian=[],seriesArr_All=[];
      if(options.ech_type=="bar"){var bound=true}else{var bound=options.bound};
      if(options.spInt){
        var all_arr=_this.echartData.join(",").split(",");
        for(var i in all_arr){
          if(all_arr[i]=="-"){all_arr[i]=0};
        }
        var maxnum = Math.ceil(Math.max.apply(null,all_arr));
        var minnum = Math.floor(Math.min.apply(null,all_arr));
        var Ymax = _this.Divisible(maxnum,1);
        var Ymin = _this.Divisible(minnum,0);
        if(Ymax==Ymin){Ymax=Ymax+options.spInt;}
      }
      if(_this.echartData.length>0&&options.datalable){
          labletip = options.datalable;
          ttAlign = "6";
      }
      var as = null,emphasis = {
            shadowBlur: 10,
            shadowColor: 'rgba(255,255,255,0.5)'
          }
      for(var i in _this.echartData){
        if(options.areaStyle){
          as = {normal:{opacity:0.5}}
          if(options.areaColor[i]){
            as.normal.color = options.areaColor[i];
          }
        }
        seriesArr_line[i] = {name:labletip[i],type:options.ech_type,smooth: options.smooth,data:_this.echartData[i],itemStyle:{normal:{label:{show:false},color:_this.arrayVal(options.linecolor,i),lineStyle:{width:options.lineWeight}}},symbol:"none",axisLine:{show:true,width:30},zlevel: 1,areaStyle:as};
        seriesArr_dian[i] = {name:labletip[i],type:options.ech_type,smooth: options.smooth,data:_this.echartData[i],label:{normal:{distance:10,position:options.barPosition,show:_this.arrayVal(options.numShow,i),formatter:"{c}"+options.numUnit,textStyle:{color:_this.arrayVal(options.numcolor,i),fontSize:font*1.1}}},itemStyle:{normal:{label:{show:true},color:_this.arrayVal(options.diancolor,i),lineStyle:{width:0},barBorderRadius:options.barBorderRadius},emphasis:emphasis},symbol:options.symbol,symbolSize:options.ech_type=="pictorialBar"?null:options.dianWeight,barCategoryGap:options.barCategoryGap,axisLine:{show:true,width:30},barWidth:font*options.barWidth,zlevel:1};
        if(options.MaxMinLine&&i==1){
          seriesArr_dian[i].label.normal.position = "bottom";
          seriesArr_dian[i].label.normal.distance = 6;
        }
        if(options.ech_type=="line"){
          seriesArr_All = seriesArr_line.concat(seriesArr_dian);
        }else{
          seriesArr_All = seriesArr_dian;
        }
      }
      
      /*当x轴字太长 S*/
      if(options.longX){
        for(var i in _this.Xarr){
          if(Xarr[i].split("").length > options.y_gap[1]){options.y_gap[1] = _this.Xarr[i].split("").length;}
        }
      }
      /*当x轴字太长 E*/
      var option={color:textColor,title:{text:options.title,left:ttAlign,show:options.title,textStyle:{fontSize:font*1.2,fontWeight:'normal',fontFamily:"microsoft yahei"}},legend: {data:labletip,textStyle:{color:textColor,fontSize:font,fontStyle:"normal",fontFamily:"microsoft yahei"},x:"right"},grid:{x:(2+options.x_gap[0])*font+5,y:(2+_this.y_gap[0])*font,x2:(options.x_gap[1])*font*1.2,y2:(2+_this.y_gap[1])*font*1.25,borderWidth:0},calculable:false,xAxis:{nameTextStyle:{color:options.XNameColor,align:"left"},show:options.XYnumShow,name:options.newUnit?"":options.Xunit,verticalAlign:"bottom",type:"category",nameGap:6,boundaryGap:bound,data:_this.Xarr,textStyle:{color:textColor,fontSize:font,fontStyle:"normal",fontFamily:"microsoft yahei"},splitLine:{show:options.splitLine,lineStyle:{color:options.splitLineColor}},axisLine:{show:1,lineStyle:{width:options.XWeight,color:options.XColor}},axisTick:{show:options.axisTickX},axisLabel:{formatter:function(val,ind){if(val){return options.longX?val.split("").join("\n"):val}else{return ""}},textStyle:{color:textColor,fontSize:font*1.1},interval:0,rotate:0,color:textColor}},yAxis:{nameTextStyle:{color:options.YNameColor,align:"left"},interval:options.interval,splitNumber:options.spNum,nameLocation:options.newUnit?"start":"end",nameGap:font*0.7,show:options.XYnumShow,name:options.Yunit+(options.newUnit?"\t\t\t\t\t\t\t\t":""),type:"value",splitLine:{show:options.areaLineShow,lineStyle:{color:options.arealinecolor}},axisLabel:{formatter:"{value}",textStyle:{color:textColor,fontSize:font*1.1}},axisTick:{show:options.axisTickY},axisLine:{show:1,lineStyle:{width:options.YWeight,color:options.YColor}}},series:seriesArr_All,animation:true,animationDuration:2000};
      if(options.weather){
        option.yAxis.min = Ymin;
        option.yAxis.max = Ymax;
        option.yAxis.interval = (Ymax-Ymin)/options.spInt;
      }
      if(options.Y_val.length>0){
        option.yAxis.min = options.Y_val[0];
        option.yAxis.max = options.Y_val[1];
      }
      if(options.maxMin_val.length>0){
        var min_val = options.maxMin_val[0]?parseInt(options.maxMin_val[0]):Math.floor(Ymin/100)*100;
        var max_val = options.maxMin_val[1]?parseInt(options.maxMin_val[1]):Math.ceil(Ymax/100)*100;
        option.visualMap = {
          show: false,
          pieces: [{
            min: min_val,
            max: max_val,
            color: options.inRange
          }],
          outOfRange: {
              color: options.outRange
            }
        }
        option.graphic= [{
          type: 'text',
          bounding: 'raw',
          left: "90%",
          bottom: "11.5%",
          invisible:!options.newUnit,
          style: {
            align:"left",
            fill: options.XColor,
            text: options.Xunit?"("+options.Xunit+")":"",
            font: font
          },
          zlevel: 5
        }];
        option.series[0].markArea = {
          data: [[{
                yAxis: min_val
            },{
                yAxis: max_val
            }]],
          itemStyle:{
            normal:{color:options.markAreaColor}
          }
        }
      }

      return option;
    },
    setOption: function(option, value) {
      if(value) this.options[option] = value;
      else return this.options[option];
    },
    reloadChart : function(){
      var _this=this,$el = _this.$el,options=_this.options;
      /*当x轴字太长 S*/
      var max_gap = 0;
      _this.y_gap=options.y_gap;
      if(options.longX){
        for(var i in _this.Xarr){
          if(_this.Xarr[i].split("").length > max_gap){
            max_gap = _this.Xarr[i].split("").length;
          }
        }
      }
      _this.y_gap[1] = options.y_gap[1] + max_gap;
      if($el){
        if(!_this.options.customHeight||$el.height()==0){
          var h = $el.width()*_this.options.echartHeight+(_this.y_gap[0]+_this.y_gap[1])*_this.font*1.2;
          $el.height(h).css("line-height",h+"px");
        }
      }
      if(_this.echartData){
        this.myChart.setOption(this.getOption());
        if(this.myChart){this.myChart.resize()}
      }
    },
    refreshChart: function() {
      this.myChart.clear();
      this.reloadChart();
    },
    arrayVal:function(val,i){
      if(Object.prototype.toString.call(val)==='[object Array]'){
          return val[i];
        }else{
          return val;
        }
    },
    dataCorrection : function(data){
      var hasData = false,newData = [];
      for(var i in data){
        newData[i] = [].concat(data[i]);
        for(var j in newData[i]){
          if(!isNaN(parseFloat(newData[i][j]))){
            newData[i][j] = parseFloat(newData[i][j]);
          }else{
            newData[i][j] = "-";
          }
        }
        newData[i] = this.getNewData(newData[i]);
        if(newData[i]){
          hasData = true;
        }
      }
      if(hasData){
        return newData;
      }else{
        return false;
      }
    },
    getNewData : function(newdata){//传入含有"-"的数组，得到优化后的数组
      var j=0,noData=0;
      for(var i=0;i<newdata.length;i++){
        if(newdata[i]=="-"){
          j=i;
          noData++;
          while(1){
            if(newdata[++j]!="-"){break;};
          }
          newdata[i] = this.getFakeY(i-1,newdata[i-1],i,j,newdata[j]);
        }
      }
      if(newdata.length==noData){
        return false;
      }
      return newdata;
    },
    getFakeY : function(x1,y1,x,x2,y2){//传入前后点数据，得到中间没有值的数据
      var y = "-",y1 = parseFloat(y1),y2 = parseFloat(y2);
      if(y1<y2){
        y = parseFloat(((x-x1)*(y2-y1)/(x2-x1)+y1).toFixed(2));
      }else if(y1>=y2){
        y = parseFloat((y1-(x-x1)*(y1-y2)/(x2-x1)).toFixed(2));
      }
      return y;
    },
    Divisible : function(a,b){
      if(!isNaN(a)){
          if(b==1){
              while(a%this.options.spInt!==0){a++;}
          }else if(b==0){
              while(a%this.options.spInt!==0){a--;}
          }
      }
      return a;
    }
  }

  $.fn.loadEchart = function(options) {
    var dataName = 'Echart',instance = [];
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
          instance[i] = new Echart(options, this);
          $(this).eq(i).data(dataName, instance[i]);
        }
      });
    }
    return instance.length>1?instance:instance[0];
  };
})(jQuery, window);

function getScolor(arr){
  return new echarts.graphic.LinearGradient(
      0, 0, 0, 1,
      [
        {offset: 0, color: arr[0]},
        {offset: 1, color: arr[1]}
      ]
    )
}