var touchStartX = 0;
Page({
    touchStart: function(event) {
        touchStartX = event.changedTouches[0].clientX;
    },
    touchEnd: function(event) {
        if (event.changedTouches[0].clientX - touchStartX > 100){
            console.log(event.changedTouches[0].clientX - touchStartX);
            wx.navigateBack(1);
        }
        touchStartX = 0;
    }
});