$(function(){

   var timeM=$(".time .m")
   var timeH=$(".time .h")
   var t=0
   var h=0
   var grade=0
   var TLcount=0
   var pre;
   var show=$(".box .grade .show")
   var sjL=$(".sjL")
   var sjR=$(".sjR")

   sjL.each(function(i,v){
      $(this).css({top:i*50+65})
   })
   sjR.each(function(i,v){
      $(this).css({top:i*50+65})
   })

    //定时器函数
   setInterval(function(){
      t++
      if (t==60) {
         h++
         t=0
      };
      if (t<10) {
        var T="0"+t
      }else{
         var T=t
      }
      if (h<10) {
        var H="0"+h
      }else{
         var H=h
      }
      timeM.html(T)
      timeH.html(H)
   },1000)
    //动画函数
   setInterval(function(){
      sjL.each(function(){
         var sjLW=Math.round(Math.random()*180+25) 
         $(this).animate({width:sjLW})
      })
       sjR.each(function(){
         var sjRW=Math.round(Math.random()*180+25) 
         $(this).animate({width:sjRW})
      })
   },500)

   //重置按钮
   var reBtn=$(".rebtn")
   reBtn.on("click",function(){
      var reAn=confirm("确定要重置吗？")
      if (reAn) {
         if (grade!=0) {
         alert("你当前成绩为"+grade+"分")
         };
         $(".pai").remove()
         makePoker()
         t=0
         h=0
         grade=0
         TLcount=0
         show.html("00")
         timeH.html("")
         timeM.html("")
      }else{
         alert("那就继续加油吧!")
      }
      
   })

    //结束按钮函数
  var end=$(".endbtn")
  end.on("click",function(){
      var eAn=confirm("你确定要结束游戏吗?")
      if(eAn){
          alert("你当前成绩是:"+grade+"分")
          $(".login").show()
          $(".pai").remove()
          $(".box").hide()
          t=0
          h=0
          grade=0
          TLcount=0
          pre=null;
      }

   }) 

   //随机生成牌
  function makePoker(){
       var poker=[]
       var biao={}
       var color=["c","d","s","h"] 
       while(poker.length!==52){
       
       var n=Math.ceil(Math.random()*13)
       var cn=Math.floor(Math.random()*4)
       var c=color[cn]
       v={color:c,number:n}

       if (!biao[c+n]) {
         poker.push(v)
         biao[c+n]=true
       };

      }
      putPoker(poker)
  }
  //将随机牌布局
  function putPoker(poker){ 
       var dict={
         1:"A",
         2:2,
         3:3,
         4:4,
         5:5,
         6:6,
         7:7,
         8:8,
         9:9,
         10:"T",
         11:"J",
         12:"Q",
         13:"K"
         }
         var count=0
         for (var i = 0; i < 7; i++) {
          for (var j = 0; j < i+1; j++) {
            $("<div>").addClass("pai")
                .appendTo(".box")
                .attr("num",poker[count].number)
                .attr("id",i+"-"+j)
                .css({"background-image":"url(image/"+dict[poker[count].number]+poker[count].color+".png)"})
                .delay(count*100)
                .animate({
                  top:i*50+20,
                  left:j*106+(7-i)*53+70,
                  opacity:1
                },500)
                      count++
          }  
         }
         for (; count < poker.length;count++) {
           $("<div>").addClass("pai left")
                .attr("num",poker[count].number)
                .appendTo(".box")
                .css({"background-image":"url(image/"+dict[poker[count].number]+poker[count].color+".png)"})
                .delay(count*100)
                .animate({
                  top:505,
                  left:264,
                  opacity:1
                },500)

          }
   }
   

  var start=$(".start")
  start.on("click",function(){
    $(".login").hide()
    $(".box").show()
      if($(".pai")){
        $(".pai").remove()
      }
    makePoker()
  }) 
  
 
  var btnTR=$(".btnTR")
  var btnTL=$(".btnTL")
  
  btnTR.on("click",(function(){
       var zIndex=0
       return function(){
      
          if (pre && !(pre.attr("id"))) {
             pre=null
          }
         if ($(".left").length==0) {
            alert("貌似左边已经没牌了！")
            return
         };
          $(".left").last().css({zIndex:zIndex++,marginTop:0})
                    .animate({
                       left:640
                    })
                    .queue(function(){
                      $(this).removeClass("left")
                      .addClass("right")
                      .dequeue()
                    })
          }
   })())
 
  btnTL.on("click",(function(){

      return function(){
       if ($(".left").length) {
         alert("左侧还有扑克")
         return
       }
       TLcount++
       if (TLcount>3) {
         alert("只可点击三次")
         var TLan=confirm("只可点击三次\n是否进行重置")
         if (TLan) {
            reBtn.trigger("click")
            return;
         }else{
           if ($(".pai[id]").length!==0) {
              alert("当前游戏已经结束\n你的成绩是"+grade+"分")
              return
        };
        }
       }
       $(".right").each(function(i,v){
         $(this).css({zIndex:0,marginTop:0})
         .delay(i*50)
                .animate({
                 left:264
                })
                .queue(function(){
                  $(this).removeClass("right")
                   .addClass("left")
                   .dequeue()
                })
       })
      }
  })())

  var fpbtn=$(".fpbtn")
  fpbtn.on("click",function(){
       if ($(".pai[id]").length) {
        alert("当前的牌还未消完\n不可发牌")
        return
       };
       $(".pai").remove()
       makePoker()
  })


  function getNum(el){
     return parseInt(el.attr("num"))
  }
  $(".box").on("click",".pai",function(){
       if(checkUp()){
         pre=null
         $(".pai").remove()
         makePoker()
       }

       if($(this).attr("id")&&!CanClick($(this))){
         return;
       }


       
       if (pre) {
           if($(this).hasClass("left") && ($(this)!==$(".left").last())){
               return;
           }else{
               $(this).animate({
                   marginTop:-20
               })
               if(getNum($(this))+getNum(pre)==13){
                   $(this).add(pre)
                       .animate({
                           top:0,
                           left:900,
                           opacity:0
                       })
                       .queue(function(){
                           $(this).detach().dequeue()
                       })
                   grade++
                   grade=grade<10 ? "0"+grade : grade;
                   show.html(grade)
                   if ($(".pai").length==0 && ($(".pai").length)==$(".pai[id]").length) {
                       alert("你的成绩是"+grade+"分")
                   };
               }else{
                   $(this).add(pre).animate({
                       marginTop:0
                   })
               }
               pre=null
               return
           }
       }else{
         pre=$(this)
           $(this).animate({
               marginTop:-20
           })
       }
       if (getNum(pre)==13) {
           $(this).animate({
             top:0,
             left:900,
             opacity:0
           })
           .queue(function(){
             $(this).detach().dequeue()
           })
           grade++
           grade=grade<10 ? "0"+grade : grade;
           show.html(grade)
           pre=null
           if ($(".pai").length==0) {
            alert("你的成绩是"+grade+"分")
           };
           return
         };
     })
     
     //上边还有没有牌
  function checkUp(){
       var upPai=$(".pai[id]")
       if (upPai.length==0 && $(".pai").length!==0) {
           return true
       }else{
            return false
       }
  }

  function CanClick(el){
          var x=parseInt(el.attr("id").split("-")[0])
          var y=parseInt(el.attr("id").split("-")[1])
          if ($("#"+(x+1)+"-"+y).length || $("#"+(x+1)+"-"+(y+1)).length ) {
            return false
          }else{
            return true
          }
  }

  $(document).on("click mousedown",false)


})