var ratio;
wx.getSystemInfo({
    success: function(res) {
        ratio = 750/res.windowWidth;
    }
});
var canvasWidth = 750/ratio;
var canvasHeight = 1250/ratio;
var context = wx.createContext();
var angleIndex = 0;
var angleGap =  Math.PI*2/100;

var textOpacity = 0;
Page({
    data: {
        innerCycleHidden: true,
        cloudOpacity: "opacity: 0",
        sunOpacity: "opacity: 0",
        welcomeText:"",
        postion:"点击获取当前位置",
        textOpacity: "opacity: 0",
    },
    //点击位置
    tapPositon:function (event){
        wx.chooseLocation({
            success:function(res){
                console.log(res);
            }
        })
    },
    //点击计入
    tapEnterButton:function (event){
        console.log('ss');
        wx.redirectTo({
            url: '../weatherMain/weatherMain?city=上海'
        })
    },
    onLoad :function(){
        var outerThis = this;
        //获取昵称
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        var nickName = res.userInfo.nickName;
                        outerThis.setData({
                            welcomeText:"欢迎，" +nickName
                        });
                    }
                });
            }
        })
        //获取地理位置
        wx.getLocation({
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                 wx.request({
                    url: "http://api.map.baidu.com/?qt=rgc&x="+latitude+
                        "&y="+longitude,
                    data: {
                    },
                    method: 'GET',
                    header: {
                        'Content-Type': 'application/javascript;charset=utf-8',
                        'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36'
                    },
                    success: function(res){
                        // success
                        console.log("request success");
                        console.log(res);   
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
            }
        });
    },
    onShow :function(){        
    },
    onReady: function () {
        this.interval = setInterval(this.drawOuterCycle, 6);
        this.showInnerCycle();
        this.showCloud();
        this.showSun();
        this.showSunshine();
        this.showText();
    },

    drawOuterCycle :function(){
        context.beginPath(0);
        context.arc(canvasWidth/2,canvasHeight/2 ,150 , 0, angleIndex * angleGap);
        context.setStrokeStyle('rgba(150, 150, 150, 1)');
        context.setLineWidth(25/ratio);
        context.setLineCap('round');
        context.stroke();
        wx.drawCanvas({
            canvasId: "welcomeCanvas",
            actions: context.getActions()
        });
        if (++angleIndex > 100){
            clearInterval(this.interval)
        }
    },
    showInnerCycle :function(){
        var innerCycleAnimation = wx.createAnimation({
            timingFunction: 'ease',
        });
        setTimeout(function() {
            this.setData({
                innerCycleHidden:false
            });
        }.bind(this), 200);
        setTimeout(function() {
            innerCycleAnimation.scale(530/ratio).step({ duration: 450 });
            this.setData({
                animation:{
                    innerCycle:innerCycleAnimation.export()
                }
            });
        }.bind(this), 300);
        
        var springArray = [];
        for (var i =0.1 ;i <= 0.8;i +=0.1){
            springArray.push({
                springFactor: 1- Math.pow(Math.E,-1*8*i)*Math.cos(30*i+Math.PI/2),
                duration: 80,
                timeout:750+(i-0.1)*800
            });
        }
        springArray.forEach(function(element, index, array){    
            setTimeout(function() {
                innerCycleAnimation.scale(element.springFactor*530/ratio).step({ duration: element.duration });
                this.setData({
                    animation:{
                        innerCycle:innerCycleAnimation.export()
                    }
                });
            }.bind(this), element.timeout);
        }.bind(this));

    },
    showCloud :function(){
        var cloudAnimation = wx.createAnimation({
            cloudAnimation: 'ease',
        });
        setTimeout(function() {
            this.setData({
                cloudOpacity:"opacity: 1"
            });
        }.bind(this), 1310);
        setTimeout(function() {
            cloudAnimation.scale(600/ratio,600/ratio).step({ duration: 300 });
            this.setData({
                animation:{
                    cloud:cloudAnimation.export()
                }
            });
        }.bind(this), 1310);

        var springArray = [];
        for (var i =0.1 ;i <= 0.8;i +=0.1){
            springArray.push({
                springFactor: 1- Math.pow(Math.E,-1*8*i)*Math.cos(30*i+Math.PI/2),
                duration: 80,
                timeout:1610+(i-0.1)*800
            });
        }

        springArray.forEach(function(element, index, array){    
            setTimeout(function() {
                cloudAnimation.scale(element.springFactor*600/ratio).step({ duration: element.duration });
                this.setData({
                    animation:{
                        cloud:cloudAnimation.export()
                    }
                });
            }.bind(this), element.timeout);
        }.bind(this));
    },

    showSun :function(){
        var sunAnimation = wx.createAnimation({
            sunAnimation: 'ease',
        });
        setTimeout(function() {
            this.setData({
                sunOpacity:"opacity: 1"
            });
        }.bind(this), 2170);
        setTimeout(function() {
            sunAnimation.scale(600/ratio,600/ratio).step({ duration: 300 });
            this.setData({
                animation:{
                    sun:sunAnimation.export()
                }
            });
        }.bind(this), 2170);

        var springArray = [];
        for (var i =0.1 ;i <= 0.8;i +=0.1){
            springArray.push({
                springFactor: 1- Math.pow(Math.E,-1*5*i)*Math.cos(30*i+Math.PI/2),
                duration: 80,
                timeout:2470+(i-0.1)*800
            });
        }

        springArray.forEach(function(element, index, array){    
            setTimeout(function() {
                sunAnimation.scale(element.springFactor*600/ratio).step({ duration: element.duration });
                this.setData({
                    animation:{
                        sun:sunAnimation.export()
                    }
                });
            }.bind(this), element.timeout);
        }.bind(this));
    },

    showSunshine :function(){
        var sunshineAnimation = wx.createAnimation({
            sunshineAnimation: 'ease',
        });
        setTimeout(function() {
            this.setData({
                sunshineOpacity:"opacity: 1"
            });
        }.bind(this), 3030);
        
        // setTimeout(function() {
        //     sunshineAnimation.rotateZ(36000).step({ duration: 100000 });
        //     this.setData({
        //         animation:{
        //             sunshine:sunshineAnimation.export()
        //         }
        //     });
        // }.bind(this), 3030);
    },

    showText :function(){
         setTimeout(function() {
             this.interval = setInterval(this.changeTextOpacity, 15);
        }.bind(this), 3200);
       
    },
    changeTextOpacity: function(){
        this.setData({
            textOpacity:"opacity:"+textOpacity
        });
        textOpacity += 0.01;
        if (textOpacity > 1){
            clearInterval(this.interval)
        }
    }
});