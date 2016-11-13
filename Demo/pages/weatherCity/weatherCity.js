var touchStartX = 0;
var searchInputValue = "";
var allCities = [];
Page({
    data: {
        cities : allCities,
        inputValue:searchInputValue
    },
    //
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
        wx.showToast({
            title: '搜索中',
            icon: 'loading',
        });
        wx.request({
        url: getApp().globalData.weatherQueqyUrl + "?cityname=" + searchInputValue + "&key=" + getApp().globalData.weatherAPIKey,
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
                getApp().globalData.queryCityInfo = resData;
                wx.navigateBack();
            }
            // var resData = res.data.result.data;
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
    
        // if(searchInputValue.length > 0){
        //     if (allCities.includes(searchInputValue)){
        //         allCities = allCities.filter(function(element){
        //             return element !== searchInputValue;
        //         });
        //         allCities.unshift(searchInputValue);
        //     } else {
        //         allCities.unshift(searchInputValue);
        //     }
        //     this.setData({
        //         cities : allCities
        //     }); 
        // }
        
    },
    //点击清楚
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
    }
});

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
    })
}