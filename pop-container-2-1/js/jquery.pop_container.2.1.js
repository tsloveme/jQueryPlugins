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
			dragHandle		 :"",			//拖动触发点，默认是本身
			animate			 :true			//加强动画
			};
		$(this).kill_container();
		//IE6判断 IE8以下
		var isIE = $.browser.msie && ($.browser.version <= "8.0");
		var isie6 =$.browser.msie && ($.browser.version == "6.0") && !$.support.style;	
		var options =$.extend(defaults,options);
		//if(!options.hasBg) options.bgOpacity=0;
		var currentHeight=$(document).height()/1;
		var zNum =options.zIndex;
		var hStr="<div id='pop_container' style='position:absolute;z-index:"+(zNum+2)+";opacity:0;filter:alpha(opacity=0)'><div id='pop_relative'style='position:relative;z-index:"+(zNum+3)+"'><div id='pop_transparent' style='border-radius:3px; box-shadow:0 0 18px #000;background-color:"+options.bdColor+";opacity:"+options.bdOpacity+";filter:alpha(opacity="+options.bdOpacity*100+");left:0;top:0;z-index:"+(zNum+2)+"'></div></div></div>";
		if(options.hasBg) hStr+="<div id='pop_back' style='display:none;position:absolute; top: 0px; left: 0px; height:100%; z-index:"+(zNum+1)+"; background-color:"+options.bgColor+"; opacity:"+options.bgOpacity+"; filter:alpha(opacity="+(options.bgOpacity*100)+")'></div>";
		$("body").append(hStr);
		if(options.toggle){
			$("#pop_container").append('<span onmouseover="this.style.borderColor=\'#999\';this.style.color=\'black\'"  onmouseout="this.style.borderColor=\'#c9c9c9\';this.style.color=\'#666\'"  id="pop_close" style="width:15px; height:15px; border:1px #c9c9c9 solid; line-height:15px; color:#666; cursor:pointer; position:absolute; right:6px; top:6px; text-decoration:none; display:block; text-align:center; z-index:'+(zNum+4)+';font:bold 12px/15px \'宋体\';" title="关闭">&times;</span>');
		}
		if(isie6){
			$("body").append("<iframe id='pop_back_ie6' style='filter:alpha(opacity=1); height:100%;background-color:#fff;position:absolute; z-index:"+zNum+";left:0; top:0; border:0;filter:alpha(opacity=1);'></iframe>");
			//$("body").css("overflow-x","hidden");
			};
		var thisobj = $(this);
		/*thisobj.unbind("dblclick").dblclick(function(){
			return false;
			})*/
		thisobj.attr("style",(thisobj.attr("style")? thisobj.attr("style")+";" : "")+"position:absolute; left:5px; top:5px; z-index:"+(zNum+3)+"; background-color:white;").show();
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
		//遮罩淡入动画
		var output_back = "#pop_back";
		if(isie6){output_back+=",#pop_back_ie6"}
		$(output_back).css({  
			"height": currentHeight,  
			"width": ($(document).width())/1  
		})
		if(options.animate){
			$(output_back).fadeTo(600,options.bgOpacity);
		}
		else{
			$(output_back).fadeTo(200,options.bgOpacity);
		}
		//弹窗入位淡入
		$("#pop_relative").append($(this));
		if(options.animate){
			$("#pop_container").css("margin-top","-50px");
			$("#pop_container").animate({marginTop:0, opacity:1}, 600)//.css("flter","Alpha(Opacity=100)");
			if(isIE) {thisobj.animate({opacity:0},1, function(){thisobj.animate({opacity:1},500)})}
		}
		else{
			$("#pop_container").animate({opacity:1}, 200);
		}

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
		$(window).resize(function(){
			$(output_back).css({  
			"height": ($(document).height())/1,  
			"width": ($(document).width())/1  
		   });
		if(options.scrollWith){
			if(isie6){
				$(window).scroll(function(){center("#pop_container")})
			}
			else{
				var fixTop=($(window).height()-$("#pop_container").outerHeight())/2;
				var fixLeft=($(window).width()-$("#pop_container").outerWidth())/2;
				$("#pop_container").css({"position":"fixed","left":fixLeft+"px","top":fixTop+"px"});
			}
		}
		})
	
		//删除弹窗，保留原DOM
		function disContain(){
			var anmTime=200;
			if(options.animate) anmTime=600;
			$("#pop_container,#pop_back,#pop_back_ie6").fadeOut(anmTime,function(){
			$("body").append(thisobj);
			thisobj.hide();
			$("#pop_container,#pop_back,#pop_back_ie6").replaceWith("");			
			});
			}
		//拖动时抓住的元素
		var focuEle= options.dragHandle ?$(options.dragHandle) : $("#pop_transparent");
		var curPos=null;
		//绑定事件
		function addEvent(obj, type, fn, mode) {
			if (obj.addEventListener)
				obj.addEventListener(type, fn, mode);
			else if (obj.attachEvent) {
				obj["e"+type+fn] = fn;
				obj[type+fn] = function() { return obj["e"+type+fn](window.event); }
				obj.attachEvent("on"+type, obj[type+fn]);
			}
		}
		//取消绑定
		function removeEvent(obj, type, fn, mode) {
			if (obj.removeEventListener)
				obj.removeEventListener(type, fn, mode);
			else if (obj.detachEvent) {
				obj.detachEvent("on"+type, obj[type+fn]);
				obj[type+fn] = null;
				obj["e"+type+fn] = null;
			}
		}
		//开始拖动
		function dragStart(event) {
			if (!curPos) {
				curPos = { 
					//el: this,
					oleft: parseInt(moveEle.style.left) || 0,
					otop: parseInt(moveEle.style.top) || 0,
					ox: event.pageX || event.screenX,
					oy: event.pageY || event.screenY
				};
				var curPosSelf = curPos;
				addEvent(document, 'mouseup', dragStop, true);
				addEvent(document, 'mousemove', dragProcess, true);
			}
			if (event.stopPropagation) event.stopPropagation();
			if (event.preventDefault) event.preventDefault();
			return false;
		}
		//处理拖动
		function dragProcess(event) {
			if (!event) var event = window.event;
			var curPosSelf = curPos;
			moveEle.style.left = (curPosSelf.oleft + (event.pageX || event.screenX) - curPosSelf.ox) + 'px';
			moveEle.style.top = (curPosSelf.otop + (event.pageY || event.screenY) - curPosSelf.oy) + 'px';
			if(focuEle.get(0).setCapture){//捕获事件。（该用法，还有个好处，就是防止移动太快导致鼠标跑出被移动元素之外） 
			focuEle.get(0).setCapture();} 
			if (event.stopPropagation) event.stopPropagation();
			if (event.preventDefault) event.preventDefault();
			return false;
		}
		//拖动停止
		function dragStop(event) {
			var curPosSelf = curPos;
			if(focuEle.get(0).releaseCapture){//捕获事件。（该用法，还有个好处，就是防止移动太快导致鼠标跑出被移动元素之外） 
			focuEle.get(0).releaseCapture();} 
			removeEvent(document, 'mousemove', dragProcess, true);
			removeEvent(document, 'mouseup', dragStop, true);
			curPos = null;
			if (event.stopPropagation) event.stopPropagation();
			if (event.preventDefault) event.preventDefault();
			return false;
		}
		//是否拖动	
		if(options.dragble){
			focuEle.css("cursor","move");
			var moveEle=document.getElementById("pop_container");
			addEvent(focuEle.get(0),"mousedown",dragStart,false);
			var oStyle=$("body").attr("style")||";";
			if (oStyle.indexOf("overflow-x:hidden") == -1){
				$("body").attr("style",$("body").attr("style")+";overflow-x:hidden;*overflow-x:visible;_overflow-x:hidden;");
			}
			if (((oStyle.indexOf("height:100%") == -1)||($("html").css("height")!="100%"))&&($.browser.msie && ($.browser.version < "8.0"))){
				$("html").css("height","100%");
				$("body").attr("style",$("body").attr("style")+";height:100%;");
				$(window).resize();
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




