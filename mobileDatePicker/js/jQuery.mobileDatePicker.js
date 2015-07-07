/*
 * 移动端双日历组件。
 */
;(function ($) {
    $.extend({
        mobileDatePicker: function (opt) {
            //配置项
            var defaults = {
                picker: "calendar",		        //生成的日期控件的ID  目前，每个页面只能生成一个日期控件
                FromFeild: "#indate",			//开始日期input ID
                ToFeild: "#outdate",		    //结束日期input ID
                dateNow: "",				    //今天日期(建议传入服务器的日期格式：2015-02-03)，默认为获取当前设备的日期
                getDateFrom: "",   				//获取url的get方式的日期传参
                getDateTo: "",				    //获取url的get方式的日期传参
                dayLimit:0,                     //区间限制，选完开始时间，结束时间会自动选好，请配数字， 如 1、2 目前只做1
                callBack:0
            }

            var option = $.extend(defaults, opt);
            var picker = option.picker,
                FromFeild = $(option.FromFeild),
                ToFeild = $(option.ToFeild),
                dateNow = option.dateNow,
                getDateFrom = getQueryString(option.getDateFrom),
                getDateFrom = /^\d+\-\d+\-\d+$/.test(getDateFrom) ? getDateFrom : "",
                getDateTo = getQueryString(option.getDateTo),
                getDateTo = /^\d+\-\d+\-\d+$/.test(getDateTo) ? getDateTo : "",
                inputFromV = FromFeild.val(),
                inputToV = ToFeild.val(),
                dayLimit = option.dayLimit,
                callBack = opt.callBack,
            //优先级 get > input >(系统时间||服务器时间);
                fromVal = getDateFrom || inputFromV || getDateNow(),
                toVal = getDateTo || inputToV || DateTomorow(getDateNow());
            FromFeild.val(fromVal);
            ToFeild.val(toVal);
            //插件样式
            if(!$('.styleCalendar').length){
                var cssString = '.calendarHeader{position:relative;height:2.5rem; line-height: 2.5rem; font-size:1.25rem; font-family: "Microsoft Yahei", Verdana; color:#eb7836; background-color:#f2f1ef; text-align:center; border-bottom:2px #eb7836 solid;}'+
                    '.calendarHeader .back{position:absolute; display:block; cursor:pointer; width:2rem; height:100%; left:0; top:0; background-repeat:no-repeat; background-position: center center; background-size: auto 100%;-webkit-background-size: auto 100%; background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACHCAYAAACRZlKjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3QUFEQ0Y4M0IyNjBFNDExODZCQ0I0NDk3MDA5MUYzOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2NkQ2NjVGQjYwRDQxMUU0OTU1N0JFMDRGMjA1NzVDOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NkQ2NjVGQTYwRDQxMUU0OTU1N0JFMDRGMjA1NzVDOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QUFEQ0Y4M0IyNjBFNDExODZCQ0I0NDk3MDA5MUYzOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QUFEQ0Y4M0IyNjBFNDExODZCQ0I0NDk3MDA5MUYzOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjigqVMAAAR/SURBVHja7N1hpN9VHMfxs27icokpRlxGLDFilFK6SmmKlKWU5U7pwSyllCaW9uROKaWU0pRSSiOllBI3ZVkaMSJGXOJSIo2I/Pt+/c598t+5z/7nv3Rfbz4Pds6Tu6+33+9/zu/8vr9No9GoAGeKs5QABAQBAQKCgAABQUCAgCAgQEAQECAgCAgQEAQECAgCAgQEAQECgoAAAUFAgIAgIEBAEBAgIAgIEBAEBAgIAoKAAAFBQICA2FicvVH/47/tv+w/9fect3TMFRAg4P+b2chLkT8j30d2uAVjWmyOfBy5vP475Xs7chEB0Zv5yOeRbY1xt2B0ZXvkaEO+5C0CoidXR76OXLCOfPcTEL3YVW+75zbmno7cHfmbgOjBvsj7kXMac3nVe1SJLEJ6sRR5rDGeV7u7IkeUiIA9yKvdK5HFxtypyE2Rr5SJgD2Yq7fcGxpzq5HrIyeUiYA9OL8MG8yXNuZ+qvKtKJNFSA+2lmGPryXft5EryEfAXuyo8l3YmPsocm3kd2UiYA+uiSxHtjTmDkdujfylTATswZ2RT+vCY5yDkXsj/yiTRUgPHoo80xhP4fZGXlUiAvbiucgDjfG81d5Rf/eBgBMnN5hfr7fecXKRcXPkG2UiYA/yd96HddExTm6v7Iz8qEwE7MGWuti4pDF3osr3izJZBfcg9/aOrSNfPs+9inwE7EU+1cgN5tZx+SP1yveHMhGwB3mYYLkMz3fHebGudm0wE7ALi2U4VDDbmNtfhoOkNpgJ2IU8QJpbLTNj43mIdE/kkBJZBfeUb6kxnrfafKb7mRIRsCePN8Z+LcMJ5u+Uxy24NzONMb/1CDg1DjbGchP6y8h1ykPA3hyqq9xx5uqqeLcSEXAaEu5p3HrzIMKbkUeUiIC9eaMuPFobzU9FXlAiAvYmt1wW6ip4nOx28G5pdzsAASdGbr3k22w/N+ZuL0O/lzllImBPTlYJjzfmsuPV0dJ+IQkEnBir9Xb8RWMue/7lca1tykTAnqz1dHmnMTdf1n8pHQScGGtdrZ5tzGXf5+XIjcpEwN48HHmwMZ7Ht/K9kXuUiIC9eb4Mh1LHO5vm8+TXIgeUiIC9ea8MHa9ONeaeLEOPwBllImBP1l5MWm3M3VeGXoGzykTAnvwQyQ/OnWzM3VKGDevNykTAnqxUCVsHV68swyca5pWJgD3J9hwLkU8acxeXYa9wuzIRsCd5giZ7xBxuzOVHapbL8AgPBOxGniXM3oCtE9b5WzDbfOxSJgL25oky9AocP9yaq+I8zrVPiQjYm5cjt5XTD7fm/mAebF1SIgL25oMybFi3GpWv9yI8ATFRsnFlbli3PtWwWIavpxMQXckGlnm4tfWlpN0ExDTIXoIL5fRvxa0QENMifwvurAuUPMhwvC5UNjR6w0yXXBXvrYErIM40m0ajkSrAFRAEBAgIAgIEBAEBAoKAAAFBQICAICBAQBAQICAICBAQBAQICAICBAQBAQKCgAABQUCAgCAgQEAQECAgCAgCAgQEAQECgoAAAbEB+FeAAQDLvqF8zUBhjgAAAABJRU5ErkJggg==");}'+
                    '.datetb{border-collapse: collapse; font-size: 12pt;} .datetb td, .datetb th{text-align: center; line-height: 2.5; vertical-align: middle; color: black; border: 1px #eee solid;} .datetb th{background-color: #eee; border-color: #fff;} .datetb td{padding: 5pt 0 8pt 0; line-height: 1.5;} .datetb td.indate{color: #fff; background-image: url(images/bg_dateselect_in.png); background-repeat: no-repeat; background-position: center top; background-size: auto 100%;} .datetb td.outdate{color: #fff; background-image: url(images/bg_dateselect_out.png); background-repeat: no-repeat; background-position: center top; background-size: auto 100%;} .datetb td.selected{background-color: #999; color: #fff} .datetb .disable{color: #999;} .datetb .disabel1{color: #999;}.calendarHeader span{position:relative;}.calendarInner{height:100%;overflow-y:scroll}.bodyOfCalendar{overflow:hidden}@media screen and (min-width: 359px) and (max-width: 413px){.calendarHeader{padding:.25rem 0}.calendarHeader .back{width: 2.5rem;}}@media screen and (min-width: 413px){ .calendarHeader{padding:.5rem 0;font-size: 1.5rem}.calendarHeader .back{width: 3rem;}}';
                $('body').append('<style class="styleCalendar">'+cssString+'</style>');
            }
            $("body").append('<div style="max-width: 480px; margin:0 auto;"><div id="' + picker + '" style="position:fixed; display:none; left:auto; top:0; z-index:999; width:100%; max-width:480px; background:#fff; height:100%;"><div class="calendarInner"><div class="calendarHeader"><a class="back" href="javascript:void(0)"></a><span></span></div></div></div></div>');
            var _thisCalendar = $('#' + option.picker);
            function compareDate(f, t) {//日期比较大小
                var d1 = new Date(f.replace(/\-/g, "\/"));
                var d2 = new Date(t.replace(/\-/g, "\/"));
                return d1 >= d2;
            };
            function getQueryString(name) {//获取get 请求日期
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return (r[2]);
                return null;
            }

            function getNextMonth(date) {//获取下月1号
                var arr = date.split('-');
                var year = arr[0];
                var month = arr[1];
                var year2 = year;
                var month2 = parseInt(month) + 1;
                if (month2 == 13) {
                    year2 = parseInt(year2) + 1;
                    month2 = 1;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }

                var t2 = year2 + '-' + month2 + '-' + "01";
                return t2;
            }

            function CreateTable(dateStr) {
                var matchArr = dateStr.match(/(\d+)\-(\d+)\-(\d+)/);
                var yyyy = matchArr[1];
                var mm = matchArr[2];
                var dd = matchArr[3];
                var date = new Date(), date1 = new Date();
                date.setFullYear(yyyy, mm - 1, dd);
                date1.setFullYear(yyyy, mm - 1, 1);
                var day = date1.getDay();
                day = day ? day : 7;
                var days = 31;
                var mNow = (new Date()).getMonth() + 1;
                var dNow = (new Date()).getDate();
                if (mm / 1 == 4 || mm / 1 == 6 || mm / 1 == 9 || mm / 1 == 11) {
                    days = 30;
                }
                if (mm / 1 == 2) {
                    days = 28;
                    if ((yyyy % 4 == 0 && yyyy % 100 != 0) || (yyyy % 100 == 0 && yyyy % 400 == 0)) days = 29;
                }
                var str = '<table class="datetb" cellpadding="0" cellspacing="0" width="100%"><tr><th colspan="7">';
                str += yyyy + "年" + mm / 1 + "月";
                str += '</th></tr><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr><tr>';

                for (j = 1; j < day; j++) {
                    str += '<td class="disable"></td>';
                }
                for (i = 1; i <= days; i++) {

                    if (i < dd) {
                        str += '<td class="disable" val="' + i + '">' + i + '</td>'
                    }
                    else {
                        if ((mm == mNow) && (i == dNow)) {
                            str += '<td class="indate" val="' + i + '">' + i + '</td>'
                        }
                        else {
                            str += '<td val="' + i + '">' + i + '</td>'
                        }
                    }
                    if ((day + i - 1) % 7 == 0) {
                        str += "</tr>";
                        if (i < days) {
                            str += "<tr>";
                        }
                    }
                }
                str += "</table>";
                $("#" + picker+' .calendarInner').append(str);
            }
            var dateDevice = new Date();

            function getDateNow() {
                var dateDevice = new Date();
                var y = dateDevice.getFullYear();
                var m = dateDevice.getMonth() + 1;
                m = m > 9 ? m : "0" + m;
                var d = dateDevice.getDate();
                d = d > 9 ? d : "0" + d;
                return dateNow ? dateNow : y + "-" + m + "-" + d;
            }

            CreateTable(getDateNow());//今天
            CreateTable(getNextMonth(getDateNow()));//下个月1号起
            $("#" + picker).css({"min-height": $(window).height()});
            function DateTomorow(dateStr) {//获取指定日期的明天
                var date = new Date(dateStr.replace(/([\-]|[\/])/g, "\/"));
                dd = parseInt(dateStr.match(/\d+([\-]|[\/])\d+([\-]|[\/])(\d+)/)[3]);
                date.setDate(dd + 1);
                var m = date.getMonth() + 1;
                m = m > 9 ? m : "0" + m;
                var d = date.getDate();
                d = d > 9 ? d : "0" + d;
                return date.getFullYear() + "-" + m + "-" + d;
            }

            //table上根据入住日选择明天
            function selectTomorrrow() {
                var inindex = $(".datetb td").index($(".datetb .indate").eq(0));
                for (i = 1; i <= 7; i++) {
                    if (!($(".datetb td").eq(inindex + i).hasClass("disable"))) {
                        $(".datetb .outdate").removeClass("outdate");
                        $(".datetb td").eq(inindex + i).addClass("outdate");
                        break;
                    }
                }
            }
            //返回事件
            _thisCalendar.find('.back').click(function(){
                _thisCalendar.hide();
            });
            function markAsSelect(dateStr, cName) {//标记某日期为入住或者离店
                var arr = dateStr.match(/(\d+)\-(\d+)\-(\d+)/);
                var y = arr[1];
                var m = parseInt(arr[2]);
                var d = parseInt(arr[3]);
                var reg = new RegExp(y + "年" + m);
                $(".datetb ." + cName).removeAttr("style").removeClass(cName);
                $(".datetb th").each(function () {
                    if (reg.test($(this).text())) {
                        $(this).parents(".datetb").find("td[val=" + d + "]").addClass(cName);
                        //alert(1);
                    }
                });
            }
            //根据td的选择填充日期值到input
            function fillDateToInput(className) {
                var tddate = $("." + className);
                var fulldate = tddate.parent().parent().find("th").eq(0).text();
                var year = fulldate.slice(0, 4);
                var pose = fulldate.indexOf("月");
                var month = parseInt(fulldate.slice(5, pose));
                month = month > 9 ? month : "0" + month;
                var day = parseInt(tddate.attr("val"));
                day = day > 9 ? day : "0" + day;
                var fulldate = year + "-" + month + "-" + day;
                if (className == "indate") {
                    FromFeild.val(fulldate);
                } else {
                    ToFeild.val(fulldate);
                }
            }

            /*TD click事件 绑定*/
            $(".datetb td").on('click', function(){
                if(_thisCalendar.attr('locked')){
                    return;
                }
                var _this = $(this),
                    indateTdObj = $(".datetb .indate"),
                    outdateTdObj = $(".datetb .outdate");
                if(_this.hasClass('disable')){
                    return;
                }
                //限制区间日数，自动选择结束日期时。
                if(dayLimit){
                    indateTdObj.removeClass('indate');
                    outdateTdObj.removeClass('outdate');
                    _this.addClass('indate');
                    selectTomorrrow();
                    _thisCalendar.attr('locked','1');
                }
                //正常双日历开始日期入口
                if(indateTdObj.length && outdateTdObj.length && !dayLimit){
                    indateTdObj.removeClass('indate');
                    outdateTdObj.removeClass('outdate');
                    _this.addClass('indate');
                    $('.calendarHeader span').animate({top:-60,opacity:0},300, function(){
                        $('.calendarHeader span').html("请选离店日期").animate({top:0,opacity:1},300);
                    });
                    return;
                }
                if(indateTdObj.length && !outdateTdObj.length){
                    if($('.datetb td').index(_this) > $('.datetb td').index($('.datetb .indate').eq(0))){
                        _this.addClass('outdate');
                        _thisCalendar.attr('locked','1');
                    }
                }
                fillDateToInput("indate");
                fillDateToInput("outdate");
                setTimeout(function(){
                    _thisCalendar.hide();
                    $('body').removeClass('bodyOfCalendar');
                    var run = callBack?callBack() : 0;
                    _thisCalendar.removeAttr('locked');
                },400);

            });
            //开始日期点击事件
            FromFeild.click(function () {
                var span = $('.calendarHeader span');
                $(this).blur();
                span.html("请选入住日期");
                if(!dayLimit){
                    span.css({top:-60,opacity:0});
                    _thisCalendar.show();
                    span.animate({top:0,opacity:1},300);
                }
                else{
                    _thisCalendar.show();
                }
                $('body').addClass('bodyOfCalendar');
                markAsSelect(FromFeild.val(), "indate");
                markAsSelect(ToFeild.val(), "outdate");
            });
        }
    })
})(jQuery);
