(function($) {
    //placeholder修复，只修复不支持html5 placeholder属性的标签
    $.fn.placeholder=function(opt) {
    	var opt = opt;
		var def = {
			type:"normal",
			zIndex:99,//层叠索引
			cssWrapperAdd:"",//wrapper附加的样式
			cssUpperAdd:""//placeholder附加的样式
		}
		var opt=$.extend(def,opt);
        return this.each(function() {

			var cssUpperAdd = opt.cssUpperAdd,
			cssWrapperAdd = opt.cssWrapperAdd;
				var hasPlaceholderSupport = function(){
					var attr = "placeholder";
					var input = document.createElement("input");
					return attr in input;
				}
				var _this = $(this);
				var placeholdVal = _this.attr("placeholder");
				var tagName = _this.get(0).tagName.toLowerCase();
				switch (tagName){
					case "input":
					var lineHeight = $(this).innerHeight();
					break;
					case "textarea":
					var lineHeight = parseInt(_this.css('line-height'));
					lineHeight = lineHeight + parseInt(_this.css('padding-top'))/2;
					break;
					default:
					break;
				}
				if(_this.css("float") != 'none'){
					cssWrapperAdd += ";float:"+_this.css("float");
				}
				var w = _this.innerWidth();	
				if(hasPlaceholderSupport() || !placeholdVal) return;
				var wraper = $('<span style="position:relative; display:inline-block; width:'+w+'px;height:auto;'+cssWrapperAdd+'"></span>');
				var upper = $('<span style="position:absolute; left:5px; top:1px; color:#ccc; whiteSpace:nowrap; line-height:'+lineHeight+'px;'+cssUpperAdd+'">'+placeholdVal+'</span>');
				upper.click(function(){
					_this.focus();
					
				});
				_this.focus(function(){
					if(_this.val()){
						upper.hide()
					}
				}).blur(function(){
					if(!$.trim(_this.val())){
						upper.show();
					}
				}).keyup(function(){
					_this.val($.trim(_this.val()));
					if(_this.val()){
						upper.hide();
					}
					else{
						upper.show();
					}
				});
				/*_this.wrap(wraper);*/
				//console.log(upper);							
				//wraper.append(upper);
				_this.wrap(wraper);
				upper.insertAfter(_this);
				if(_this.val()){
					upper.hide();
				}
            });
        }
    //}); 
})(jQuery);

