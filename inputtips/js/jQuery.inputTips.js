(function(){
	$.fn.inputTips=function(option){
		var def={
			type:"normal",//cellPhone:手机  telephone:电话机   identity:身份证   bankCard:银行卡（4位一隔） normal:原样输出
			cssText:"font-size:35px; line-height:1.2; font-family:'微软雅黑',arial,'黑体'; font-weight:normal; border:2px #ffae00 solid; color:black; background-color:#fffdd0;padding:8px; position:absolute; left:0;",
			zIndex:99,//层叠索引
			cssAdd:""//附加的样式
		}
		var opt=$.extend(def,option);
		return this.each(function() {
		var _this=$(this);
		var type=opt.type;
		var cssText=opt.cssText;
		var zIndex=opt.zIndex;
		var cssAdd=opt.cssAdd;
		var wrapSpan='<span style="z-Index:'+zIndex+'; position:relative; display:inline-block;"></span>';
		var wrapP='<p style="'+cssText+'z-Index:'+zIndex+';display:none;'+cssAdd+'" class="preview"><span style="visibility:hidden">9</span></p>';
		_this.wrap(wrapSpan);
		_this.parent().append(wrapP);
		var pObj=_this.siblings(".preview");
		pObj.css("top",-(pObj.outerHeight()+2)+"px");
		function formatCellphone(str){//手机号码处理函数
			var str =str.replace(/\s/g,"");
			var strLen=str.split("").length;
			if(strLen<=3){
				return str;
			}
			if((3<strLen)&&(strLen<8)){
				return str.substring(0,3)+"&nbsp;&nbsp;"+str.substring(3);
			}
			if(strLen>7){
				return str.substring(0,3)+"&nbsp;&nbsp;"+str.substring(3,7)+"&nbsp;&nbsp;"+str.substring(7);
			}
		}
		function formatIdentity(str){/*身份证处理函数*/
			var str =str.replace(/\s/g,"");
			var strLen=str.split("").length;
			if(strLen<=6){
			 return str;
			}
			if((strLen>6)&&(strLen<11)){
				return str.substring(0,6)+"&nbsp;&nbsp;"+str.substring(6);
			}
			if((strLen>10)&&(strLen<15)){
				 return str.substring(0,6)+"&nbsp;&nbsp;"+str.substring(6,10)+"&nbsp;&nbsp;"+str.substring(10);
			}
			if(strLen>14){
				return str.substring(0,6)+"&nbsp;&nbsp;"+str.substring(6,10)+"&nbsp;&nbsp;"+str.substring(10,14)+"&nbsp;&nbsp;"+str.substring(14);
			}
		}
		function formatBankCard(str){//四位一空处理函数
			return str.replace(/\s/g,'').replace(/(\d{4})/g,"$1"+"&nbsp;&nbsp;");
		}
		function dealVal(){
			switch(opt.type){
			case "cellPhone":
				pObj.html(formatCellphone(_this.val()));
				break;
			case "identity":
				pObj.html(formatIdentity(_this.val()));
				break;
			case "bankCard":
				pObj.html(formatBankCard(_this.val()));
				break;
			default:
				pObj.html(_this.val());
			}
		}
		_this.focus(function(){
			if (_this.val().replace(/\s/g,"")=="") return;
			dealVal();
			if(pObj.css("display")=="none")
			pObj.show();
		});
		_this.blur(function(){
			pObj.hide();
		});
		_this.keyup(function(){
			if (_this.val().replace(/\s/g,"")==""){
				pObj.hide();
				return;
			}
			dealVal();
			if(pObj.css("display")!="none") return;
			pObj.show();	
			
		})
	});
	}
})(jQuery)
