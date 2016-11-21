var storageService = require('../../utils/storageService.js').storageService;
var touchStartX = 0;
var searchInputValue = "";
Page({
    data: {
        cities : [],
        inputValue:searchInputValue
    },
    onLoad :function(){
        storageService.getSearchCitiesStorage(function(res){
            this.setData({
                cities : res
            });
        }.bind(this),function(res){
            this.setData({
                cities : []
            });
        }.bind(this));
    },
    //实现左滑退出
    touchStart: function(event) {
        touchStartX = event.changedTouches[0].clientX;
    },
    touchEnd: function(event) {
        if (event.changedTouches[0].clientX - touchStartX > 100){
            console.log(event.changedTouches[0].clientX - touchStartX);
            wx.navigateBack();
        }
        touchStartX = 0;
    },
    //点击搜素
    tapSearchIcon: function(event) {
    //进行网络请求
    if(searchInputValue.length == 0){
        showIKnowModal("请输入城市名称");
    } else {
        requestCityWeather(searchInputValue, function(resData){
            //本地存储城市
            storageService.setSearchCityStorage(resData.realtime["city_name"]);
            //反向传递数据
            getApp().globalData.queryCityInfo = resData;
            wx.navigateBack();
        });
    } 
        
    },
    //点击清除input
    tapClearIcon: function(event) {
        this.setData({
            inputValue: " "
        });
        this.setData({
            inputValue: ""
        });
        searchInputValue = "";
    },
    inputChanged: function(event) {
        searchInputValue = event.detail.value;   
    },
    //点击清除城市记录
    tapClearCities: function(event) {
        storageService.removeSearchCityStorage(function(){
            this.setData({
                cities : []
            });
        }.bind(this));
    },
    tapCityItem: function(event) {
        console.log(event);
        requestCityWeather(event.target.dataset.searchCity,function(resData){
            //本地存储城市
            storageService.setSearchCityStorage(resData.realtime["city_name"]);
            //反向传递数据
            getApp().globalData.queryCityInfo = resData;
            wx.navigateBack();
        });
    }
});
//请求input中的城市数据
function requestCityWeather(city,onSuccess){
     wx.showToast({
            title: '搜索中',
            icon: 'loading',
        });
    wx.request({
        url: getApp().globalData.weatherQueqyUrl + "?cityname=" + city + "&key=" + getApp().globalData.weatherAPIKey,
        data: {
        },
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        },
        success: function(res){
            // success
            console.log("search page - request success");
            if (res.data["error_code"] != 0){
                showIKnowModal("请输入正确的城市名称");
            } else {
                var resData = res.data.result.data;
                console.log(resData);
                onSuccess(resData)
            }
        },
        fail: function() {
            // fail
            console.log("search page - request fail");
            showIKnowModal("网络错误");
        },
        complete: function() {
            // complete
            console.log("search page - request complete");
            wx.hideToast()
        }
    });
}

function showIKnowModal(text){
    wx.showModal({
        content: text,
        confirmText:'知道了',
        confirmColor:"#000000",
        showCancel:false,	
        success: function(res) {
            if (res.confirm) {
            }
        }
    });
}