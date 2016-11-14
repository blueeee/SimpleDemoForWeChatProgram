//异步获取搜索的城市
function getSearchCitiesStorage(onSuccess,onFail) {
    wx.getStorage({
        key: 'seatchCitiesKey',
        success: function(res) {
            if(res.data == undefined){
                onFail();
            } else if(res.data.length == 0) {
                onFail();
            }else {
                onSuccess(res.data);
            }
        },
        fail:function(res) {
            onFail();
        } 
    })
}
//异步存储搜索的城市:若城市存在，将城市移动到最前端，若不存在，则将城市存储在最前端
function setSearchCityStorage(city){
    var allCities;
    getSearchCitiesStorage(function(res){
        allCities = res;
        if (allCities.includes(city)){
            //若城市存在，将城市移动到最前端
            allCities = allCities.filter(function(element){
                return element !== city;
            });
            allCities.unshift(city);
        } else {
            //若不存在，则将城市存储在最前端
            allCities.unshift(city);
        }
        wx.setStorage({
            key:"seatchCitiesKey",
            data:allCities
        })
    }, function(){
        allCities = [city];
        wx.setStorage({
            key:"seatchCitiesKey",
            data:allCities
        })
    });
}
//异步清除搜索的城市
function removeSearchCityStorage(onSuccess){
    wx.removeStorage({
        key: 'seatchCitiesKey',
        success: function(res) {
            onSuccess();
        } 
    });
}
module.exports.storageService = {
    setSearchCityStorage:setSearchCityStorage,
    getSearchCitiesStorage:getSearchCitiesStorage,
    removeSearchCityStorage:removeSearchCityStorage
}