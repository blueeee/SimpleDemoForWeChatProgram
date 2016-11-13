var dataAdapter = require('weatherDataAdapter.js').weather;

Page({
    data: {
    },
    onLoad :function(){
      console.log("MainPage onLoad");
      var url = getApp().globalData.weatherQueqyUrl + '?cityname=上海&key=' + getApp().globalData.weatherAPIKey;
        var thisthis = this;
        //数据绑定
        var dataBind = function(data) {
          //数据转换
          console.log(data);
          var newdata = dataAdapter.weatherDataAdapter(data);
          console.log(newdata);
          thisthis.setData(newdata);
        }
        //进行网络请求
        wx.request({
          url: url,
          data: {
          },
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res){
            // success
            console.log("request success");
            var resData = res.data.result.data;
            dataBind(resData);
            var temperatures = dataAdapter.temperatureDataAdapter(resData);
            //绘制温度曲线
            drawTemperature(temperatures);
          },
          fail: function() {
            // fail
            console.log("request fail");
          },
          complete: function() {
            // complete
            console.log("request complete");
          }
        });
    },
    onShow :function(option){
      console.log("MainPage onShow");
      if(getApp().globalData.queryCityInfo !== null){
        var newdata = dataAdapter.weatherDataAdapter(getApp().globalData.queryCityInfo);
        this.setData(newdata);
        var temperatures = dataAdapter.temperatureDataAdapter(getApp().globalData.queryCityInfo);
        drawTemperature(temperatures);
      }
    },
    onReady: function() {
      console.log("MainPage onReady");
    },
    onHide :function(){
      console.log("MainPage onHide");
    },
});

function drawTemperature(temperatures){
  var dayTemperature = temperatures.dayTemperature;
  var nightTemperature = temperatures.nightTemperature;
  //准备数据
  var ratio;
  wx.getSystemInfo({
    success: function(res) {
      ratio = 750/res.windowWidth;
    }
  })
  var canvasHeight = 320/ratio;
  var canvasHeightCenter = canvasHeight/2;
  var canvasHeightRange = canvasHeight/2.5;
  var canvasHeightOrigin = canvasHeightCenter - canvasHeightRange/2;
  var canvasWidth = 750/ratio;
  var canvasWidthGap = canvasWidth/5;
  var canvasWidthOrigin = canvasWidthGap/2

  var maxTemperature = -1000,minTemperature = 1000;
  dayTemperature.forEach(function (element, index, array){
    if (element < minTemperature) {
      minTemperature = element;
    }
    if (element > maxTemperature) {
      maxTemperature = element;
    }
  });
  nightTemperature.forEach(function (element, index, array){
    if (element < minTemperature) {
      minTemperature = element;
    }
    if (element > maxTemperature) {
      maxTemperature = element;
    }
  });
  var  canvasHeightGap = canvasHeightRange/(maxTemperature - minTemperature);
  //绘图
  var context = wx.createContext();
  //day
  
  dayTemperature.forEach(function (element, index, array){
    var x = canvasWidthOrigin + canvasWidthGap*index;
    var y = (maxTemperature -dayTemperature[index])*canvasHeightGap +canvasHeightOrigin;
    if (index == 0) {
      context.moveTo(x,y);
    } else{
      //绘制温度曲线
      context.setStrokeStyle("#d9ac0f");
      context.setLineWidth(1);
      context.lineTo(x,y);
      context.stroke();
    }
    //绘制温度文字
    context.setFontSize(12)
    context.setFillStyle('#ffffff');   
    context.fillText(dayTemperature[index]+"℃", x - 6, y-10);
  });
  
  //night
  context.beginPath();
  context.setStrokeStyle("#20bcfa");
  context.setLineWidth(1);
  nightTemperature.forEach(function (element, index, array){
    var x = canvasWidthOrigin + canvasWidthGap*index;
    var y = (maxTemperature -nightTemperature[index])*canvasHeightGap +canvasHeightOrigin;
    if (index == 0) {
      context.moveTo(x,y);
    } else{
      context.lineTo(x,y);
    }
    context.setFontSize(12)
    context.setFillStyle('#ffffff');   
    context.fillText(nightTemperature[index]+"℃", x - 6, y + 20);
  });
  context.stroke();
  
  wx.drawCanvas({
    canvasId: 'forecastCanvas',
    actions: context.getActions() //获取绘图动作数组
    });
}