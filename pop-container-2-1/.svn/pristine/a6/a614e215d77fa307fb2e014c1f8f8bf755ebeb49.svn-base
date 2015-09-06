/***
*作者:陈堂宋
*日期:2013-5-31
*个人网站:www.uinote.cn
*插件说明:把你要弹出的东西都写在一个div(定宽度)里面。
*$(selector).pop_container();就可以调用了，插件简单可扩展性强，广大网友有兴趣可以帮我完善
***/
(function($){
    $.fn.pop_container =function(options){
		/*默认参数设置*/
		var defaults ={
			btnClose 		 :"",           //设置其他关闭按钮 			如:"#btnClose, .close1" 
			toggle    		 :true, 		//是否显示右上角关闭    	建议你自己定义个样式  
			scrollWith		 :true,			//随滚动条滚动？
			bdColor			 :"#000",		//边框颜色
			bdOpacity	   	 :0.4,			//边框透明度
			hasBg			 :true,		   	//是否显示背景遮罩
			bgColor			 :"#000",		//背景色
			bgOpacity		 :0.4,			//背景透明度，1为不透明
			zIndex			 :9997,			//最外层索引(背景遮罩)
			dragble			 :true,			//是否可拖动
			dragHandle		 :""			//拖动触发点，默认是本身
			};
		//IE6判断 IE8以下
		var isIE = $.browser.msie && ($.browser.version <= "8.0");
		var isie6 =$.browser.msie && ($.browser.version == "6.0") && !$.support.style;	
		var options =$.extend(defaults,options);
		//if(!options.hasBg) options.bgOpacity=0;
		var zNum =options.zIndex;
		var hStr="<div id='pop_container' style='position:absolute;z-index:"+(zNum+2)+";opacity:0;filter:alpha(opacity=0)'><div id='pop_relative'style='position:relative;z-index:"+(zNum+3)+"'><div id='pop_transparent' style='border-radius:3px; box-shadow:0 0 18px #000;background-color:"+options.bdColor+";opacity:"+options.bdOpacity+";filter:alpha(opacity="+options.bdOpacity*100+");left:0;top:0;z-index:"+(zNum+2)+"'></div></div></div>";
		if(options.hasBg) hStr+="<div id='pop_back' style='display:none;position:absolute; top: 0px; left: 0px; z-index:"+(zNum+1)+"; background-color:"+options.bgColor+"; opacity:"+options.bgOpacity+"; filter:alpha(opacity="+(options.bgOpacity*100)+")'></div>";
		$("body").append(hStr);
		if(options.toggle){
			$("#pop_container").append('<span onmouseover="this.style.borderColor=\'#999\';this.style.color=\'black\'"  onmouseout="this.style.borderColor=\'#c9c9c9\';this.style.color=\'#666\'"  id="pop_close" style="width:15px; height:15px; border:1px #c9c9c9 solid; line-height:15px; color:#666; cursor:pointer; position:absolute; right:6px; top:6px; text-decoration:none; display:block; text-align:center; z-index:'+(zNum+4)+';font:bold 12px/15px \'宋体\';" title="关闭">&times;</span>');
		}
		if(isie6){
			$("body").append("<iframe id='pop_back_ie6' style='filter:alpha(opacity=1);background-color:#fff;position:absolute; z-index:"+zNum+";left:0; top:0; border:0;filter:alpha(opacity=1);'></iframe>");
			//$("body").css("overflow-x","hidden");
			};
		var thisobj = $(this);
		thisobj.attr("style",(thisobj.attr("style")? thisobj.attr("style")+";" : "")+"position:absolute; left:5px; top:5px; z-index:"+(zNum+1)+"; background-color:white;").show();
		$("#pop_relative").append($(this));

		$("#pop_container").css("margin-top","-50px");
		$("#pop_container").animate({marginTop:0, opacity:1}, 600)//.css("flter","Alpha(Opacity=100)");
		if(isIE) {thisobj.animate({opacity:0},1, function(){thisobj.animate({opacity:1},500)})}
		//var op= document.getElementById("pop_container");
		//关闭按钮的处理
		//var closeBtn='';
		var action_btn=options.btnClose;
		if(options.toggle){
			action_btn+=",#pop_close"
		};
		$(action_btn).live("click",function(){disContain()});
		//弹窗宽度初始化
		var outerwidth = $(this).outerWidth()+10;
		var outerheight = $(this).outerHeight()+10;
		$("#pop_container,#pop_transparent").css({"width":outerwidth,"height":outerheight});
		//居中函数
		function center(obj){
		   var windowWidth = document.documentElement.clientWidth;  
		   var windowHeight = document.documentElement.clientHeight;  
		   var popupHeight = $(obj).height();  
		   var popupWidth = $(obj).width();   
		   $(obj).css({  
			"top": (windowHeight-popupHeight)/2+$(document).scrollTop(),  
			"left": (windowWidth-popupWidth)/2  
		   }); 
		   var output_back =  "#pop_back";
		   if(isie6){output_back+=",#pop_back_ie6"}
			$(output_back).css({  
			"height": ($(document).height())/1,  
			"width": ($(document).width())/1  
		   }).fadeTo(600,options.bgOpacity);
		};		
		//居中弹窗以及改变浏览器窗口时自定义
		center("#pop_container");
		//if(options.scrollEnable){
		//	 大窗口滚动条是否禁用
		//	 }
		if(options.scrollWith){
			if(isie6){
				$(window).scroll(function(){center("#pop_container")})
			}
			else{
				var fixTop=$("#pop_container").position().top-(document.documentElement.scrollTop||document.body.scrollTop);
				$("#pop_container").css({"position":"fixed","top":fixTop+"px"});
			}
		}		
		//$(window).resize(function(){center("#pop_container")})
	
		//删除弹窗，保留原DOM
		function disContain(){
			$("#pop_container,#pop_back,#pop_back_ie6").fadeOut(600,function(){
			$("body").append(thisobj);
			thisobj.hide();
			$("#pop_container,#pop_back,#pop_back_ie6").replaceWith("");			
			});
			}
		var moveObj=$("#pop_container");//移动的元素
		var focuEle= options.dragHandle ?$(options.dragHandle) : $("#pop_transparent");//拖动时抓住的元素
		var beDraging = false;//是否在被拖动
		var dragParams = {
				initDiffX : '',
				initDiffY : '',
				moveX : '',
				moveY : ''};

		function mouseCoords(ev){
			if(ev.pageX || ev.pageY){
				return {x:ev.pageX, y:ev.pageY};}
			return {
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:ev.clientY + document.body.scrollTop  - document.body.clientTop};
		}
		//点下事件
		function fnMousedown(e){                		
			beDraging = true;//标记开始移动	        
			//$(this).css({'cursor':'move'});//改变鼠标形状
			if($(this).get(0).setCapture){//捕获事件。（该用法，还有个好处，就是防止移动太快导致鼠标跑出被移动元素之外） 
			$(this).get(0).setCapture();} 	
			dragParams.initDiffX = mouseCoords(e).x - moveObj.position().left;
			dragParams.initDiffY = mouseCoords(e).y - moveObj.position().top;
			dragParams.sTop=(isie6||!options.scrollWith) ? 0:(document.documentElement.scrollTop||document.body.scrollTop);			
			//alert(dragParams.sTop);
			$("body").bind('mousemove',fnMove).css("cursor","move");
			//$("body,document").bind('focus', function(){$(this).blur();})
			}
		//移动过程
		function fnMove(e){
			if(beDraging){    
			//被移动元素的新位置，实际上鼠标当前位置与原位置之差
			//实际上，被移动元素的新位置，也可以直接是鼠标位置，这也能体现拖拽，但是元素的位置就不会精确。
			dragParams.moveX = mouseCoords(e).x - dragParams.initDiffX;
			dragParams.moveY = mouseCoords(e).y - dragParams.initDiffY - dragParams.sTop;//
			//移动
			moveObj.css({'left':dragParams.moveX,'top':dragParams.moveY});
			}
		}
		function fnMouseup(){
			$("body").unbind("mousemove",fnMove).css("cursor","default");
			//$(this).css("cursor","default")
			beDraging=false;
			/*moveObj.css({'cursor':'default'});*/
			if(focuEle.get(0).releaseCapture){
				focuEle.get(0).releaseCapture();
				}
		}
		if(options.dragble){
			focuEle.live({"mousedown":fnMousedown,"mouseup":fnMouseup});
			if(options.dragHandle=="") {focuEle.css("cursor","move")};
			oStyle=$("body").attr("style")||";";
			if (oStyle.indexOf("overflow-x:hidden") == -1){
				$("body").attr("style",$("body").attr("style")+";overflow-x:hidden");
			}
			if (oStyle.indexOf("position:relative") == -1){
				$("body").attr("style",$("body").attr("style")+";*position:relative");
			}
		}

};
	$.fn.kill_container = function(){
		$(this).appendTo("body").hide();
		$("#pop_container,#pop_back,pop_back_ie6").remove();
		}	

})(jQuery);



