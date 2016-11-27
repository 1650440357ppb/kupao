function person(canvas,cobj,run,jump) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.run=run;
    this.jump=jump;
    this.x=0;
    this.y=450;
    this.width=110;
    this.height=110;
    this.speedx=6;
    this.status="run";
    this.state=0;
    this.num=0;
    this.life=3;

}
person.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,220,220,0,0,this.width,this.height);
        this.cobj.restore();

    },
    update:function () {
        this.x+=this.speedx;
    }

}


// 障碍物
function finder(canvas,cobj,finder) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.finder=finder;
    this.x=this.canvas.width-20;
    this.y=460;
    this.width=70;
    this.height=70;
    this.state=0 ;
}
finder.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.finder[this.state],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
}

// 子弹
function zidan(canvas,cobj,zhi) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.zhi=zhi;
    this.x=0;
    this.y=0;
    this.width=80;
    this.height=80;
    this.color="green";
    this.speedx=5;
    this.jia=1;
    this.state=0;
}
zidan.prototype = {
    draw:function () {
        // var cobj=this.cobj;
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.zhi[this.state],0,0,400,400,0,0,this.width,this.height);
        this.cobj.restore();
    }
}

// xue
function lizi(canvas,cobj,person) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=person.x+person.width/2;
    this.y=person.y+person.height/2;
    this.r=1+2*Math.random();
    this.sheepx=6*Math.random()-3;
    this.sheepy=6*Math.random()-3;
    this.zhongli=0.3;
    this.sheepr=0.1;
    this.color="red";
}
lizi.prototype={
    draw:function () {
        var cobj=this.cobj;
        cobj.save();
        cobj.beginPath();
        cobj.translate(this.x,this.y);
        cobj.fillStyle=this.color;
        cobj.arc(0,0,this.r,0,2*Math.PI);
        cobj.fill();
        cobj.restore();
    },
    update:function () {
        this.x+=this.sheepx;
        this.sheepy+=this.zhongli;
        this.y+=this.sheepy;
        this.r-=this.sheepr;
    }
}
function xue(canvas,cobj,person) {
    var arr=[];
    for(var i=0;i<30;i++){
        var obj=new lizi(canvas,cobj,person)
        arr.push(obj);
    }
    var t=setInterval(function () {
        for(var i=0;i<arr.length;i++){
            arr[i].draw();
            arr[i].update();
            if(arr[i].r<0){
                arr.splice(i,1)
            }
        }
        if(arr.length==0){
            clearInterval(t)
        }
    },40)
}


// 游戏主类
function game(canvas,cobj,run,jump,finder,zhi,lif,jifen,runa,hita,zidana,jumpa) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.finder=finder;
    this.lif=lif;
    this.jifen=jifen;
    this.runa=runa;
    this.hita=hita;
    this.jumpa=jumpa;
    this.zidana=zidana;
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.num=0;
    this.back=0;
    this.backspeed=6;
    this.score=0;//积分
    this.person=new person(canvas,cobj,run,jump);
    this.finderarr=[];
    this.isfire=false;
    this.flag=true;
    this.zidan=new zidan(canvas,cobj,zhi);
    this.num=0;
    this.rand=(4+Math.ceil(6*Math.random()))*1000;
 // 速度加快
    this.current=0;
    this.step=1;
    this.stepsteep=2;
}
game.prototype= {
    play:function (strat,zhezhao) {
        strat.css("animation","strat1 2s ease forwards");
        zhezhao.css("animation","zhezhao1 2s ease forwards");
        this.run();
        this.key();
        this.mouse();
    },
    run:function () {
        var that=this;
        that.name=prompt("请输入姓名","perte")
        setInterval(function () {
         that.move()
        },50)
    },
    move:function () {
        var that=this
        that.runa.play();
        that.num+=50;
        that.cobj.clearRect(0,0,that.width,that.height);
        that.person.num++;
        if(that.person.status=="run"){
            that.person.state=that.person.num%8;
        }else{
            that.person.state=0;
        }
        //人物的x发生变化,
        that.person.x+=that.person.speedx;
        if(that.person.x>that.width/3){
            that.person.x=that.width/3;
        }
        that.person.draw();
        //操作障碍物
        if( that.num%  that.rand==0){
            that.rand=(4+Math.ceil(6*Math.random()))*1000;
            // 障碍物出现的时间
            that.num=0;
            var obj=new finder(that.canvas,that.cobj,that.finder);
            obj.state=Math.floor(Math.random()*that.finder.length);
            that.finderarr.push(obj);
        }
        for(var i=0;i<that.finderarr.length;i++){
            that.finderarr[i].x-=that.backspeed;
            that.finderarr[i].draw();
            // 人碰到障碍物
            if(hitPix(that.canvas,that.cobj,that.person,that.finderarr[i])){
                if(!that.finderarr[i].flag){
                    xue(that.canvas,that.cobj,that.person);
                    that.person.life--;
                    that.hita.play();
                    // 碰撞声音
                    that.lif.style.width=100-(that.person.life)*33+"%";
                    if(that.person.life==0){
                        that.lif.style.width=100+"%";
                        // 排名榜
                        var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
                        var temp={name:that.name,score:that.score};
                        // 排序
                        messages.sort(function (a,b) {
                            return a.score<b.score;
                        })
                        if(messages.length>0){
                            if(temp.score>messages[messages.length-1].score){
                                if(messages.length==5){
                                    messages[messages.length-1]=temp;
                                }else if(messages.length<5){
                                    messages.push(temp);
                                }
                            }
                        }else{
                            messages.push(temp);
                        }

                        localStorage.messages=JSON.stringify(messages);
                        location.reload();
                    }
                    that.finderarr[i].flag=true;
                }
            }
            if(that.person.x>that.finderarr[i].x+that.finderarr[i].width){
                if(!that.finderarr[i].flag&&!that.finderarr[i].flag1){
                    that.score++;
                    that.jifen.innerHTML=that.score;
                    that.finderarr[i].flag1=true;
                }
            }
            // 子弹碰到障碍物
            if(hitPix(that.canvas,that.cobj,that.zidan,that.finderarr[i])){
                if(!that.finderarr[i].flag){
                    that.finderarr.splice(i,1)
                    that.score++;
                    // 速度加快
                    that.current++;
                    if(that.current%that.step==0){
                        that.backspeed+=1;
                        that.current=0;
                        that.step+=that.stepsteep;
                    }
                    that.jifen.innerHTML=that.score;
                    that.finderarr[i].flag=true;
                }
            }
        }

        // 操作子弹
        if(that.isfire){
            that.zidan.speedx+=that.zidan.jia;
            that.zidan.x+=that.zidan.speedx;
            that.zidan.draw();
        }

        // 背景图
        that.back-=that.backspeed;
        that.canvas.style.backgroundPositionX=that.back+"px";
    },
    key:function () {
        var that=this;
        var flag=true;
        document.onkeydown=function (e) {
          if(!flag){
              return;
          }
            flag=false;
            if(e.keyCode==32){
                that.runa.pause();
                that.jumpa.play();
                // 角度
                var init=0;
                var speeda=5;
                var r=100;
                var y=that.person.y;
                var t=setInterval(function () {
                    that.person.status="jump";
                    init+=speeda;
                    if(init>180){
                        clearInterval(t);
                        that.runa.play();
                        that.person.status="run";
                        that.person.y=y;
                        flag=true
                    }else{
                        var top=Math.sin(init*Math.PI/180)*r;
                        that.person.y=y-top;
                    }
                },50)
            }
        }
    },
    mouse:function () {
        var that=this;

        document.querySelector(".zhezhao").onclick=function () {
            that.zidana.play();
            that.zidan.x=that.person.x+that.person.y/2;
            that.zidan.y=that.person.y+that.person.height/3;
            that.zidan.speedx=10;
            that.isfire=true;
        }
    }
}