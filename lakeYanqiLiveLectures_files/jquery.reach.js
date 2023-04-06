/**
 * Web框架 js
 *
 * 依赖包清单：
 * 底层	     ：    <script type="text/javascript" src="${ctx}/js/jquery-1.6.2.min.js"></script>
 * 国际化	 ：    <script type="text/javascript" src="${ctx}/js/lang/message.${lang}.js"></script>
 * 日历控件   ：    <script type="text/javascript" src="${ctx}/js/DatePicker/WdatePicker.js"></script>
 * 表单验证   ：    <script type="text/javascript" src="${ctx}/js/validator.js"></script>
 * 漂浮层     ：    <script type="text/javascript" src="${ctx}/js/jquery.floatDialog.js"></script>
 * 悬浮提示   ：    <script type="text/javascript" src="${ctx}/js/cluetip/jquery.cluetip.js"></script>
 * 文件上传   ：    <script type="text/javascript" src="${ctx}/js/dhtmlxvault/dhtmlxvault.js"></script>
 * 可同时输入与选择的下拉框      ：    <script type="text/javascript" src="${ctx}/js/jquery.autocomplete.js"></script>
 *
 * v 1.0.0.3
 * 深圳市锐取软件技术有限公司


 */

/**
 * 无重复数据的数组对象
 */
var UniqueArray = function() {

    this.datas = new Array();

    // 新增data
    this.add = function(data) {
        if (!this.contains(data)) {
            this.datas.push(data);
        }
    };

    // 是否包含data
    this.contains = function(data) {
        for(var i=0; i<this.datas.length; i++) {
            if (this.datas[i] == data) {
                return true;
            }
        }
        return false;
    };

    // 通过索引移除data
    this.remove = function(index) {
        this.datas.splice(index, 1);
    };

    // 移除data
    this.removeData = function(data) {
        for(var i=0; i<this.datas.length; i++) {
            if (this.datas[i] == data) {
                this.datas.splice(i, 1);
                return;
            }
        }
    };

    // 通过索引获取data
    this.get = function(index) {
        return this.datas[index];
    };

    // 数组长度
    this.size = function() {
        return this.datas.length;
    };

    // 转换为以,隔开的字符串
    this.toString = function() {
        var str = "";
        for(var i=0; i<this.datas.length; i++) {
            str += this.datas[i] + ",";
        }
        if (str.length > 0) {
            str = str.substring(0, str.length - 1);
        }
        return str;
    };
};

/**
 *jquery扩展
 */
(function($) {

    /**
     * 局部默认配置，页面通过initConfig方法修改
     */
    var GlobalConfig = {
        ctx : "/",    // 项目名


        servlet : "login.jsp",    // 请求servet
        lang : "en_US",    // 国际化语言
        skin : "cyan",    // 皮肤
        validatorShow: 3,    // 表单验证错误信息提示方式
        DFFull: "yyyy-MM-dd HH:mm:ss",    // 日期+时间格式
        DFMonth: "yyyy-MM",    // 月份格式
        DFDate: "yyyy-MM-dd",    // 日期格式
        DFTime: "HH:mm:ss",    // 时间格式
        DFTimeMinute: "HH:mm",    // 分钟格式
        OptParam: "cmd",    // 操作判断参数名


        CMD_LIST: 10001,    // 显示数据列表操作代号
        CMD_ADD: 10002,    // 新增操作代号
        CMD_INPUT: 10003,    // 修改操作前获取数据代号


        CMD_UPDATE: 10004,    // 修改操作代号
        CMD_DEL: 10005,    // 删除操作代号
        pageCounts: [5, 10, 15, 20],    // 分页可选择每页显示数数组


        browser : "unknown",    // 浏览器类型



        menuPosDiv : "menuPosDiv",    // 菜单当前位置div.id

        loginPageTag : "<!-- loginPage -->",    // 登录页面识别字符串，用来判断是否ajax请求超时或权限不足导致的返回登录页面HTML，这时需要页面跳转到登录页面
        loginPageUrl : function() {return GlobalConfig.ctx + "backstage/login.jsp?lang=" + GlobalConfig.lang;},    // 返回登录页面url

        refreshListInit: function() {}    // 当刷新数据列表后需要初始化的操作


    };

    /**
     * 局部变量，页面无法访问
     */
    var GlobalVariable = {
        root: document,    // 根标签


        alertCallback : function(){}, //alert回调函数
        tabInfos: new Array(),    // tab信息储存数组
        pageInfos: new Array(),    // 分页信息储存数组
        selectJsons: new Array(),    // 下拉框信息储存数组


        cascadeSelects: new Array(),    // 级联下拉框信息储存数组


        cascadeSelectQueue: new Array()    // 级联下拉框队列

    };

    /**
     * 页面加载完(不包含图片，视频等资源加载)后执行function
     */
    $.onLoad = function(func) {
        $(function() {
            if (func) func();
        });
    };

    /**
     * 一些页面记载完成后必须执行事件
     */
    $(function() {
        // 屏蔽按键
        document.onkeydown = function(event) {
            event = event ? event : window.event;
            if (event.keyCode == 27) { //27:ESC
                return false;
            }
            return true;
        };
    });

    /**
     * 设置局部配置，页面上通过Config读取所有局部配置


     */
    $.initConfig = function(Config){
        if (Config) {
            $.extend(GlobalConfig, Config);
            $.extend(Config, GlobalConfig);
        };
    };

    /**
     * 获取浏览器类型
     */
    $.getBrowser = function() {
		var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie") != -1)
            GlobalConfig.browser = "ie";
        else if (ua.indexOf("firefox") != -1)
            GlobalConfig.browser = "firefox";
        else if (ua.indexOf("chrome") != -1)
            GlobalConfig.browser = "chrome";
        else if (ua.indexOf("opera") != -1)
            GlobalConfig.browser = "opera";
        else if (ua.indexOf("safari") != -1)
            GlobalConfig.browser = "safari";
        else
            GlobalConfig.browser = "unknown";
        return GlobalConfig.browser;
	};

	/**
     * 获取操作系统类型
     */
    $.getOS = function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf("windows")!= -1||ua.indexOf("win32")!= -1){
			return "windows";
		}
    	if(ua.indexOf("macintosh")!= -1||ua.indexOf("mac os x")!= -1){
			return "mac";
		}
    	if(ua.indexOf("linux")!= -1){
			return "linux";
		}
        return "windows";
	};

    /**
     * 整体初始化，大部分的方法必须先调用此方法初始化后才可正常使用
     * @param {Object} Config
     */
    $.initAll = function(Config) {
        $.initConfig(Config);    				// 设置局部配置


        $.getBrowser();            				// 获取浏览器类型


        $.initDatePicker();    					// 初始化日期控件


        $.initLabelText();    					// 初始化label标签
        $.initInputRadio();    					// 初始化单选框
        $.initInputCheckbox();   		 	// 初始化多选框
        $.initTextarea();    					 	// 初始化textarea
        $.initFocusStyle();    					// 初始化焦点事件


        $.initToggle();    						// 初始化伸展与合并事件
        $.initLoading();    						// 初始化等待画面


        $.initAlert();                                // 初始化提示画面


		$.initConfirm();                            // 初始化确认画面


        $.initMenuPos();                        // 初始化菜单位置


    };

    /**
     * 设置根标签，用于刷新数据列表时只处理刷新div所有子标签，


     * 避免重复标签的处理，默认为document
     * @param {Object} $root
     */
    $.setRoot = function($root) {
        if ($root) {
            GlobalVariable.root = $root;
        } else {
            GlobalVariable.root = document;
        }
    };

    /**
     * 初始化日期控件


     *
     * 当存在class组合的标签获取焦点时触发相应的日期选择
     */
    $.initDatePicker = function() {
        $.customDatePicker({
            inputE : ".Wdate.DFFull",
            dateFmt: GlobalConfig.DFFull,
            width : 155
        });
        $.customDatePicker({
            inputE : ".Wdate.DFMonth",
            dateFmt: GlobalConfig.DFMonth,
            width : 75
        });
        $.customDatePicker({
            inputE : ".Wdate.DFDate",
            dateFmt: GlobalConfig.DFDate,
            width : 95
        });
        $.customDatePicker({
            inputE : ".Wdate.DFTime",
            dateFmt: GlobalConfig.DFTime,
            width : 80
        });
        $.customDatePicker({
            inputE : ".Wdate.DFTimeMinute",
            dateFmt: GlobalConfig.DFTimeMinute,
            width : 60
        });
    };

    /**
     * 自定义初始化日期控件
     */
    $.customDatePicker = function(params){
        var finalParams = {
            inputE : "",    // 选择输入框标签


            dateFmt: GlobalConfig.DFFull,    // 选择日期格式
            lang : GlobalConfig.lang,    // 语言
            width : "src"    // 输入框宽度, src=不干预


        };
        if (params) $.extend(finalParams, params);

       var $es = $(finalParams.inputE).each(function(){
	   		this.onclick = function() {
				this["My97Mark"] = false;	// 解决input根据不同条件日期选择不同时日期选择错误BUG(预约录制)
				new WdatePicker({
					lang: finalParams.lang,
					dateFmt: finalParams.dateFmt
				});
			}
        });

		if (finalParams.width != "src") {
            $es.width(finalParams.width);
        }
    };

    /**
     * 初始化label标签
     *
     * 针对各种数据显示，简化代码


     */
    $.initLabelText = function() {
        // 当存在list属性时， 根据key属性，显示list中key对应得值，或者keys属性获取对应的值数组，用,隔开各值显示


        // 如果不存在对应的key/keys值并存在defaultValue属性时，显示defaultValue属性值，都不存在则显示空白


        $("label[list]", GlobalVariable.root).each(function() {
            var $this = $(this);
            refreshLabelText($this.attr("list"), $this)
        });

        // 同上，只是json数据来源于页面上已存在的多选标签


        $("label[listforname]", GlobalVariable.root).each(function() {
            var $this = $(this);
            var name = $this.attr("listforname");
            var list = "";
            $("*[name=" + name + "]").each(function() {
                switch (this.tagName) {
                case "SELECT":
                    $(this).find("option").each(function() {
                        if (this.value) {
                            list += "'" + this.value + "':'" + $.trim($(this).html()) + "',"
                        }
                    });
                    break;
                case "INPUT":
                    if (this.value) {
                        list += "'" + this.value + "':'" + $.trim($(this).next().text()) + "',"
                    }
                    break
                }
            });
            if (list.length > 0) {
                list = list.substring(0, list.length - 1)
            }
            refreshLabelText(list, $this)
        });

        // 刷新label值


        function refreshLabelText(list, $this) {
            if (list.charAt(0) != "{") {
                list = "{" + list + "}"
            }
            list = $.stringToJson(list);
            var key = $this.attr("key");
            var keys = $this.attr("keys");
            var defaultValue = $this.attr("defaultValue");
            var value = "";
            if (key) {
                value = list[key]
            } else if (keys) {
                if (keys.charAt(0) == "[") {
                    keys = keys.substring(1, keys.length - 1)
                }
                keys = keys.split(",");
                for (var i = 0; i < keys.length; i++) {
                    key = $.trim(keys[i]);
                    if (list[key]) {
                        value += list[key] + ", "
                    }
                }
                if (value.length > 0) {
                    value = value.substring(0, value.length - 2)
                }
            }
            if (value) {
                $this.html(value)
            } else if (defaultValue) {
                $this.html(defaultValue)
            } else {
                $this.html("")
            }
            $this.removeAttr("list");
            $this.removeAttr("lists");
            $this.removeAttr("key");
            $this.removeAttr("defaultValue");
        };

        // 对text属性值进行最长maxlength属性显示，超过则以..代替
        $("label[text][maxlength]", GlobalVariable.root).each(function() {
            var $this = $(this);
            var text = $.trim($this.attr("text"));
            var textlength = text.length;
            var maxlength = $this.attr("maxlength");
            $this.attr("title", text);
            var value;
            if (text.length <= maxlength) {
                value = text;
            } else {
                value = text.substring(0, maxlength - 2) + "..";
            }
            $this.html(value);
            $this.removeAttr("text");
            $this.removeAttr("maxlength");
        });

        // 对langstring属性值进行国际化显示，存在maxlength则同上


        $("label[langstring]", GlobalVariable.root).each(function() {
            var $this = $(this);
            var langString = $this.attr("langString");
            var value = "";
            var exp = /[$][{][\w\d_]+[}]/gi
            value = langString.replace(exp, function(key){
                key = key.substring(2, key.length - 1);
    			return Message[key];
    		});
            $this.attr("title", value);
            var maxlength = $this.attr("maxlength");
            if (maxlength) {
                if (value.length > maxlength) {
                    value = value.substring(0, maxlength - 2) + "..";
                }
            }
            $this.html(value);
            $this.removeAttr("langString");
            if (maxlength) {
                $this.removeAttr("maxlength");
            }
        });
    };

    /**
     * 转换字符串为json对象
     * @param {Object} string
     */
    $.stringToJson = function(string) {
        try {
            return eval(string.charAt(0) == "(" ? string: "(" + string + ")")
        } catch(e) {
            return string
        }
    };

    /**
     * 初始化单选框
     *
     * 主要针对图片单选框
     */
    $.initInputRadio = function() {
        $.refreshInputRadio();
        $("input[type=radio]", GlobalVariable.root).each(function() {
            var $this = $(this);
            var $label = $this.next();
            $this.click(function() {
                $.setInputRadio($this.attr("name"), $this.attr("value"))
                if (this.checked) {
                   $label.addClass("selected_font_color");
                } else {
                   $label.removeClass("selected_font_color");
                }
            });
            if ($this.hasClass("imgRadio")) {
                $label.addClass("imgRadio");
                $this.hide()
            }
        })
    };

    /**
     * 初始化多选框
     *
     * 主要针对图片多选框
     */
    $.initInputCheckbox = function() {
        $.refreshInputCheckBox();
        $("input[type=checkbox]", GlobalVariable.root).each(function() {
            var $this = $(this);
            var $label = $this.next();
            $this.click(function() {
                if (this.checked) {
                    $label.addClass("selected_font_color");
                    $.addInputCheckBox($this.attr("name"), $this.attr("value"))
                } else {
                    $label.removeClass("selected_font_color");
                    $.removeInputCheckBox($this.attr("name"), $this.attr("value"))
                }
            });
            if ($this.hasClass("imgCheckbox")) {
                $label.addClass("imgCheckbox");
                $this.hide()
            }
        })
    };

    /**
     * 初始化可同时输入和选择的下拉框或者浏览器自带下拉框


     * @param {Object} params
     */
    $.initSelect = function(params) {
         var finalParams = {
            canInput : false,    // 是否同时输入和选择的下拉框，false则为浏览器自带select
            tabE: "",    // 提交值标签，同时输入和选择的下拉框则为input标签，浏览器自带为select标签
            dataType: "json",    // 数据源类型


            data: {},    // 数据源


            initValue: "",    // 初始选择项值


            initValueAtt: "initValue",    // 初始选择项值


            clear : true,    // 清空已存在数据


            onSelect: function(value, text){}    // 选择后触发事件


        };
        if (params) $.extend(finalParams, params);

        $(finalParams.tabE).each(function() {
             var $tab = $(this);
             if (finalParams.canInput) {
                // 同时输入和选择的下拉框, $tab储存提交值，$_input页面展示选择文本值


                var $_input = $("<input />");
                $tab.hide().after($_input);
                $_input.autocomplete({
                    source: finalParams.data,
                    fillin: true,
                    $input: $tab,
                    onSelect: function() {
                        if (finalParams.onSelect) {
                            finalParams.onSelect($tab.val(), $_input.val());
                        }
                    }
                });
            } else {
                // 浏览器自带下拉框
                var value, text, initValue;
                if (finalParams.clear) {
                    $tab.html("");
                }
                $.each(finalParams.data, function(p1, p2) {
                    if (finalParams.dataType == "json") {
                        value = p1;
                        text = p2;
                    } else {
                        value = p2;
                        text = p2;
                    }

                    // 初始值



                    initValue = $tab.attr(finalParams.initValueAtt);
                    if (!initValue || initValue == "") {
                        initValue = finalParams.initValue;
                    }

                    $tab.append("<option value='" + value + "'" + (value == initValue ? " selected='selected'" : "") + ">" + text + "</option>");
                });
                $tab.change(function(){
                		finalParams.onSelect($tab.val(), $tab.find("option:selected").html());
                });
            }
        });
    };

    /**
     * 初始化textarea
     */
    $.initTextarea = function() {
        // 当存在maxchar属性时增加可输入剩余字节数显示
        var $ta = $("textarea[maxchar]", GlobalVariable.root);
        $ta.each(function() {
            var $this = $(this);
            $this.after("<div class='remain'>" + Message.dynamic("ta_maxCharTip", ["<span></span>"])
            + "</div>");
            var width = $this.innerWidth();
            if (width > 0) {
            	if (GlobalConfig.browser == "ie") {
            		$this.next("div[class='remain']").width(width - 4);
	            } else {
	            	$this.next("div[class='remain']").width(width - 6);
	            }
            }
            $.refreshTextarea($this);
            $this.bind("keyup keydown change",
            function() {
                $.refreshTextarea($(this))
            })
        })
    };

    /**
     * 获取字符串字节数，中文算2个字节


     * @param {Object} value
     */
    $.getStringLength = function(value){
        if (value) {
            return value.replace(/\n|[^\x00-\xff]/gi, 'ch').length;
        } else {
            return 0;
        }
    };

    /**
     * 获取字符串最大字节，多余部分截取掉


     * @param {Object} value
     * @param {Object} max
     */
    $.getStringByMaxLength = function(value, max){
       var len = $.getStringLength(value);
        if (len <= max) {
            return value;
        }
        var currLen = parseInt(max / 2);
        var currValue = value.substring(0, currLen);
        len = $.getStringLength(currValue);
        if (len == max) {
            return currValue;
        }
        while (len < max) {
            currLen++;
            currValue = value.substring(0, currLen);
            len = $.getStringLength(currValue);
        }
        if (len != max) {
        	currValue = value.substring(0, currLen - 1);
        }
        return currValue;
    };

    /**
     * 刷新textarea
     * @param {Object} $ta
     */
    $.refreshTextarea = function($ta) {
        var maxchar = $ta.attr("maxchar");
        var lens = $.getStringLength($ta.val());
        var remain = maxchar - lens;
        if (remain < 0) {
            $ta.val($.getStringByMaxLength($ta.val(), maxchar));
            remain = 0;
        }
        $ta.next().find("span").text(remain)
    };

    /**
     * 初始化焦点事件


     */
    $.initFocusStyle = function() {
        $("input[type=button], input[type=submit], input[type=reset]", GlobalVariable.root).addClass("inputButton");
        $("input[type=text],input[type=password],select", GlobalVariable.root).addClass("inputText").addClass("ac_blue_border").focus(function() {
            $(this).removeClass("ac_blue_border");
            $(this).addClass("ac_green_border")
        }).blur(function() {
            $(this).removeClass("ac_green_border");
            $(this).addClass("ac_blue_border")
        });
        $("textarea", GlobalVariable.root).addClass("ac_blue_border").focus(function() {
            $(this).removeClass("ac_blue_border");
            $(this).addClass("ac_green_border")
        }).blur(function() {
            $(this).removeClass("ac_green_border");
            $(this).addClass("ac_blue_border")
        });
        $(".tableHover tr").hover(function() {
            $(this).addClass("trHover");
        }, function() {
            $(this).removeClass("trHover");
        });
        $(".toolBlock").hover(function() {
            $(this).addClass("toolTrHover");
        }, function() {
            $(this).removeClass("toolTrHover");
        });
		$(".button").hover(function() {
            $(this).addClass("toolTrHover");
        }, function() {
            $(this).removeClass("toolTrHover");
        });
        $(".inputButton").hover(function() {
            $(this).addClass("inputButtonHover");
        }, function() {
            $(this).removeClass("inputButtonHover");
        });
    };

    /**
     * 设置标签disabled属性


     * @param {Object} disabled
     */
    $.fn.disabled = function(disabled) {
        var $list = $(this);
        $list.each(function(){
            this.disabled = disabled;
            var $this = $(this);
            if (disabled) {
                $this.addClass("inputDisabled");
            } else {
                $this.removeClass("inputDisabled");
            }
        });

        return $list;
    };

    /**
     * 设置input:text值


     * @param {Object} id
     * @param {Object} value
     */
    $.setInputText = function(id, value) {
        if (value != undefined) $("#" + id).val(value)
    };

    /**
     * 刷新图片单选框样式
     * @param {Object} $input
     */
    function refreshInputRadioStyle($input) {
        var $label = $input.next();
        if ($input.attr("checked")) {
            $label.addClass("selected_font_color");
            if ($input.hasClass("imgRadio")) {
                $label.addClass("imgRadio_checked")
            }
        } else {
            $label.removeClass("selected_font_color");
            if ($input.hasClass("imgRadio")) {
                $label.removeClass("imgRadio_checked")
            }
        }
    };

    /**
     * 去除单选框勾选


     * @param {Object} name
     */
    $.clearInputRadio = function(name) {
        $("input[name=" + name + "]").attr("checked", false).each(function() {
            refreshInputRadioStyle($(this))
        })
    };

    /**
     * 设置单选框值
     * @param {Object} name
     * @param {Object} value
     */
    $.setInputRadio = function(name, value) {
        $.clearInputRadio(name);
        if (value != undefined) {
            var $input = $("input[name=" + name + "][value='" + value + "']").attr("checked", true);
            refreshInputRadioStyle($input);
        }
    };

    /**
     * 通过label标签内容设置单选框值


     * @param {Object} name
     * @param {Object} label
     */
    $.setInputRadioByLabel = function(name, label) {
        $.clearInputRadio(name);
        if (label != undefined) {
            $("input[name=" + name + "]").next().each(function() {
                var $this = $(this);
                if ($.trim($this.html()) == label) {
                    var $input = $this.prev();
                    $input.attr("checked", true).change();
                    refreshInputRadioStyle($input);
                    return true
                }
            })
        }
    };

    /**
     * 刷新单选框
     */
    $.refreshInputRadio = function() {
        $("input[type=radio]", GlobalVariable.root).each(function() {
            refreshInputRadioStyle($(this))
        })
    };

    /**
     * 重置单选框
     * @param {Object} name
     */
    $.resetInputRadio = function(name) {
        $.clearInputRadio(name);
        var $input = $("input[name=" + name + "][defaultchecked]").attr("checked", true);
        $.setInputRadio(name, $input.val());
        refreshInputRadioStyle($input)
    };

    /**
     * 刷新图片多选框样式
     * @param {Object} $input
     */
    function refreshInputCheckBoxStyle($input) {
        var $label = $input.next();
        if ($input.attr("checked")) {
            $label.addClass("selected_font_color");
            if ($input.hasClass("imgCheckbox")) {
                $label.addClass("imgCheckbox_checked")
            }
        } else {
            $label.removeClass("selected_font_color");
            if ($input.hasClass("imgCheckbox")) {
                $label.removeClass("imgCheckbox_checked")
            }
        }
    }

    /**
     * 去掉多选框勾选


     * @param {Object} name
     */
    $.clearInputCheckBox = function(name) {
        $("input[name=" + name + "]").attr("checked", false).each(function() {
            refreshInputCheckBoxStyle($(this))
        })
    };

    /**
     * 设置多选框值


     * @param {Object} name
     * @param {Object} value
     */
    $.setInputCheckBox = function(name, value) {
        $.clearInputCheckBox(name);
        if (value != undefined) {
            if (value.charAt(0) == "[") {
                value = value.substring(1, value.length - 1)
            }
            var values = value.split(",");
            for (var i = 0; i < values.length; i++) {
                $.addInputCheckBox(name, $.trim(values[i]))
            }
        }
    };

    /**
     * 通过label标签内容设置多选框值


     * @param {Object} name
     * @param {Object} label
     */
    $.setInputCheckBoxByLabel = function(name, label) {
        $.clearInputCheckBox(name);
        if (label != undefined) {
            if (label.charAt(0) == "[") {
                label = label.substring(1, label.length - 1)
            }
            var labels = label.split(",");
            for (var i = 0; i < labels.length; i++) {
                $("input[name=" + name + "]").next().each(function() {
                    var $this = $(this);
                    if ($.trim($this.html()) == $.trim(labels[i])) {
                        var $input = $this.prev();
                        $.addInputCheckBox(name, $input.val())
                    }
                    return true
                })
            }
        }
    };

    /**
     * 勾选多选框
     * @param {Object} name
     * @param {Object} value
     */
    $.addInputCheckBox = function(name, value) {
        if (value != undefined) {
            var $input = $("input[name=" + name + "][value='" + value + "']").attr("checked", true);
            refreshInputCheckBoxStyle($input);
        }
    };

    /**
     * 去掉多选框勾选


     * @param {Object} name
     * @param {Object} value
     */
    $.removeInputCheckBox = function(name, value) {
        if (value != undefined) {
            var $input = $("input[name=" + name + "][value='" + value + "']").attr("checked", false);
            refreshInputCheckBoxStyle($input);
        }
    };

    /**
     * 改变多选框勾选


     * @param {Object} name
     * @param {Object} value
     */
    $.changeInputCheckBox = function(name, value) {
        if (value != undefined) {
            var $input = $("input[name=" + name + "][value='" + value + "']");
            if ($input.attr("checked")) {
                $.removeInputCheckBox(name, value)
            } else {
                $.addInputCheckBox(name, value)
            }
        }
    };

    /**
     * 刷新多选框
     */
    $.refreshInputCheckBox = function() {
        $("input[type=checkbox]", GlobalVariable.root).each(function() {
            refreshInputCheckBoxStyle($(this))
        })
    };

    /**
     * 重置多选框
     * @param {Object} name
     */
    $.resetInputCheckBox = function(name) {
        $.clearInputCheckBox(name);
        $("input[name=" + name + "][defaultchecked]").each(function() {
            $.addInputCheckBox(name, this.value)
        })
    };

    /**
     * 设置下拉框值


     * @param {Object} id
     * @param {Object} value
     */
    $.setSelect = function(id, value) {
        if (value != undefined) $("#" + id).val(value)
    };

    /**
     * 通过下拉框选择文字设置下拉框值


     * @param {Object} id
     * @param {Object} value
     */
    $.setSelectByLabel = function(id, label) {
        $("#" + id + " option").each(function() {
            var $this = $(this);
            if ($.trim($this.html()) == label) {
                $.setSelect(id, $this.attr("value"));
                return false;
            }
        });
    };

    /**
     * 设置textarea值


     * @param {Object} id
     * @param {Object} value
     */
    $.setTextArea = function(id, value) {
        if (value != undefined) {
            var $ta = $("#" + id);
            $ta.val(value);
            $.refreshTextarea($ta)
        }
    };

    /**
     * 表单重置
     * @param {Object} formId
     */
    $.formReset = function(formId) {
        var $form = $("#" + formId);
        $form[0].reset(); // 浏览器自带重置
        $("span.vfError", $form).remove(); // 移除所有表单验证错误信息
        // 初始化图片单选和多选
        $form.find("input[type=radio]", $form).each(function() {
            $.resetInputRadio($(this).attr("name"))
        });
        $form.find("input[type=checkbox]", $form).each(function() {
            //$.resetInputCheckBox($(this).attr("name"))
			$(this).attr("checked",false);
        });
        // 初始化级联下拉框
        $form.find("div.CascadeSelect", $form).each(function() {
            $.resetCascadeSelect($(this).attr("id"))
        });
        // 刷新textarea
        $form.find("textarea[maxchar]", $form).each(function() {
            $.refreshTextarea($(this))
        })
    };

    /**
     * 获取表单提示参数集
     *
     * $form.serialize() ：
     * 方法内是会过滤掉disabled标签值的，但实际上还是需要这些值的，需要修改jquery源码
     * 1     serializeArray: function() {
	 *	2     return this.map(function(){
	 *	3	    return this.elements ? jQuery.makeArray( this.elements ) : this;
	 *	4    })
	 *	5    .filter(function(){
	 *	6	    return this.name && !this.disabled 就是把这里的!this.disabled去掉
     *
     * @param {Object} formId
     */
    $.getFormParams = function(formId) {
        var $form = $("#" + formId);
        if ($form.length == 0) {
            return "";
        }
        var $Params = $form.serialize();
        var splits = $Params.split("&");
        var params = new Array();
        var param, name, value, isHave;

		/*
		 * 当有多选框select 时 单独处理
		 */
		$form.find(".Select2Select").each(function() {
			var $this =$(this);
			var mutiId = $this.attr("id");
			var mutiName = $this.attr("name");
			var sltSrc=document.getElementById(mutiId);
			var tmpParam = "";
			for(var i = 0 ; i < sltSrc.options.length ; i++){
				if(sltSrc.options[i].selected){
					//alert(i);
					//避免重复数据提交
				}else{
					tmpParam+=sltSrc.options[i].value;
					tmpParam+=","
				}

			}
			if(tmpParam.length > 0) tmpParam = tmpParam.substring(0,tmpParam.length-1);

			params.push(mutiName + "=" + tmpParam);
		});

        for (var i = 0; i < splits.length; i++) {
            param = splits[i].split("=");
            name = param[0];
            value = $.trim(param[1]);
            if (value.length == 0 || value == "+") {
                continue
            }
            isHave = false;
            for (var j = 0; j < params.length; j++) {
                if (params[j].indexOf(name + "=") != -1) {
                    isHave = true;
                    break
                }
            }
            if (isHave) {
				if(params[j].indexOf('=')==params[j].length-1) params[j] += value;
				else params[j] += "," + value;
            } else {
                params.push(name + "=" + value)
            }
        }

        if (params.length == 0) {
            return ""
        } else {
            return "&" + params.join("&")
        }
    };

    /**
     * 验证表单数据
     * @param {Object} formId
     */
    $.validateForm = function(formId, method) {
        if (!method) {
            method = GlobalConfig.validatorShow;
        }
        return Validator.Validate(document.getElementById(formId), method)
    };

    /**
     * 增加表单验证错误提示
     * @param {Object} id
     * @param {Object} msg
     */
    $.addValidateError = function(id, msg) {
        if (msg.charAt(0) == '#') {
            msg = Message[msg.substring(1)]
        }
        $("#" + id).after("<span id='__ErrorMessagePanel' class='vfError'>" + msg + "</span>")
    };

    $.clearValidateError = function() {
        $(".vfError").remove();
    };

    /**
     * ajax封装
     * @param {Object} params
     */
    $.gAjax = function(params) {
        var finalParams = {
            type : "post", // 提交方式
            cache : false,    // 是否使用缓存
            timeout : 60000,    // 超时时间，单位毫秒


            success : function(result) {    // 回调函数
                $.showAlert({
                    text : result
                });
                $.closeLoading();
            },
            statusCode : {
                404: function(){    //404错误时执行


                    $.showAlert({
                        text : "error_404"
                    });
                    $.closeLoading();
                },
                500: function(){    //500错误时执行


                    $.redirect(GlobalConfig.loginPageUrl(), true);
                }
            },
            error : function(xhr, error) {    // 超时时执行


                var msg = Message[error];
                if (msg) {
                    $.showAlert({
                        i18n: false,
                        text : msg
                    });
                }
                $.closeLoading();
            }
        };
        $.extend(finalParams, params);

        var success = finalParams.success;
        finalParams.success = function(result) {
             if (result.indexOf(GlobalConfig.loginPageTag) != -1) {
                  $.redirect(GlobalConfig.loginPageUrl(), true);
             } else {
                  success(result);
             }
        };

        $.ajax(finalParams);
    };

    /**
     * ajax检查某个属性


     * @param {Object} params
     */
    $.ajaxCheckOneValue = function(params) {
        var finalParams = {
            eventE : ".checkButton",    // 触发标签
            url : GlobalConfig.ctx + GlobalConfig.servlet, //请求url
            dataType : "data",    // 请求参数类型
            data : "",    // 字符串参数


            dynaData : function(data) {return data},    //动态拼接参数


            valueId : "",    // 检查值id
            callback : function(result){}    // 回调函数
        };
        $.extend(finalParams, params);

        $(finalParams.eventE).unbind("click").click(function() {
            var value = $.trim($("#" + finalParams.valueId).val());
            if (value.length == 0) {
                $.showAlert({
                    text : "vf_empty"
                });
                return
            }
            var data = "&" + finalParams.valueId + "=" + value;
            if (finalParams.dataType == "data") {
                data += finalParams.data;
            } else {
                data = finalParams.dynaData(data);
            }
            $.gAjax({
                url : finalParams.url,
                data : data,
                success: function(result) {
                	$.showAlert({
                        text : result,
                        callback : function(){
                        	if (finalParams.callback) finalParams.callback(result);
                        } // 关闭后回调函数
                    });
                    $.closeLoading();
                }
            })
        })
    };

    /**
     * ajax+漂浮层新增数据


     * @param {Object} params
     */
    $.ajaxFloatAddData = function(params) {
        var finalParams = {
            eventE : ".addButton", // 触发标签
            divId : "inputDiv",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型
            title : "",    // 漂浮层标题
            formId : "inputForm",     // 表单id
            submitE : ".submitButton",    // 表单提交标签
            refreshList : true,    // 是否刷新数据列表
            refreshEventE : ".queryButton",    // 刷新事件标签
            closeE : ".closeButton",    // 关闭漂浮层标签
            dataType : "data",    // 请求参数类型
            data : "",    //字符串参数
            dynaData : function(data) {return ""}, // 动态拼接参数
            beforeShow : function(){},    // 显示漂浮层前执行函数
            beforeClose : function(finalParams) {    // 关闭后执行函数
                return true;
            },
            callback : function(){ return true; }    // 新增成功后回调函数
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).floatdialog(finalParams.divId, {
            beforeClick: function($this) {

                $.setFloatTitle(finalParams, $this);

                $.formReset(finalParams.formId);

                finalParams.beforeShow();

                $("#" + finalParams.formId).find(finalParams.submitE).unbind("click").click(function() {
                    if ($.validateForm(finalParams.formId)) {
                        var data = GlobalConfig.OptParam + "=" + GlobalConfig.CMD_ADD
                                + $.getFormParams(finalParams.formId);
                        if (finalParams.dataType == "data") {
                            data += finalParams.data;
                        } else {
                            data = finalParams.dynaData(data);
                        }
                        $.showLoading();
                        $.gAjax({
                            url: GlobalConfig.ctx + GlobalConfig.servlet,
                            data : data,
                            success: function(result) {
                            	$.closeLoading();
                                var ret = finalParams.callback(result);
                                if (ret) {
                                    if (result == "success") {
                                        $.showAlert({
                                            text : "add_success"
                                        });
                                        if (finalParams.refreshList) {
                                            $(finalParams.refreshEventE).click();
                                        }
                                        $("#" + finalParams.formId).find(finalParams.closeE).click();
                                        return true;
                                    } else {
                                        $.showAlert({
                                            text : result
                                        });
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            }
                        })
                    } else {
                        return false
                    }
                })

            },
           beforeClose : function() {
               if (finalParams.beforeClose) {
                    return finalParams.beforeClose(finalParams);
                }
           }
        })
    };

    /**
     * 初始化漂浮层
     * @param {Object} params
     */
    $.initFloatDiv = function(params){
        var finalParams = {
            eventE : "", // 触发元素
            divId : "",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型

            title : "",    // 漂浮层标题

            beforeShow : function(){ return true; }    // 显示之前执行函数，返回false则不显示漂浮层


        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).floatdialog(finalParams.divId, {
            beforeClick: function($this) {
                $.setFloatTitle(finalParams, $this);
                if (finalParams.beforeShow) {
                    return finalParams.beforeShow($this, $("#" + finalParams.divId));
                } else {
               	    return true;
                }
           }
        });
    };

    /**
     * 初始化ajax+漂浮层表单提交


     * @param {Object} params
     */
    $.initAjaxFormFloatDiv = function(params){
        var finalParams = {
            eventE : "",    // 触发标签
            divId : "inputDiv",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型


            title : "",    // 漂浮层标题


            formId : "inputForm",    // 表单id
            submitE : ".submitButton",    // 表单提交标签
            closeE : ".closeButton",    //漂浮层关闭标签


            url : GlobalConfig.ctx + GlobalConfig.servlet,    //提交请求操作参数
            dataType : "data",    // 请求参数类型
            data : "",    // 字符串参数


            dynaData : function(data) { return data; }, // 动态拼接参数


            beforeShow : function($this){},    // 漂浮层显示前操作
            beforeSubmit : function(){return true;},    // 表单提交前操作，返回false则取消提交


            callback : function(result){}    // 回调函数
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).floatdialog(finalParams.divId, { beforeClick : function($this) {
            $.setFloatTitle(finalParams, $this);
            var $div = $("#" + finalParams.divId);
            $.formReset(finalParams.formId);
            if (finalParams.beforeShow) finalParams.beforeShow($this);
            $div.find(finalParams.submitE).unbind("click").click(function() {
                if ($.validateForm(finalParams.formId)) {
                    var data = $.getFormParams(finalParams.formId);
                    if (finalParams.dataType == "data") {
                        data += finalParams.data;
                    } else {
                        data = finalParams.dynaData(data);
                    }
                    if (finalParams.beforeSubmit()) {
                        $.gAjax({
                            url: finalParams.url,
                            data : data,
                            success: function(result) {
                                var ret = true;
                                if (finalParams.callback) ret = finalParams.callback(result);
                                if (ret) {
                                    $div.find(finalParams.closeE).click();
                                }
                            }
                        });
                    }
                }
            });
        }});
    };

    /**
     * 初始化通过多选方式显示漂浮层
     * @param {Object} params
     */
    $.initFloatDivByCheckBox = function(params){
        var finalParams = {
            eventE : ".floatButton",    //触发标签
            allSelectE : ".allSelectBox",    // 全选标签


            selectE : ".selectBox",    // 单选标签


            divId : "inputDiv",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型


            title : "",    // 漂浮层标题


            noSelectMsg : "look_noSelect",
            beforeShow : function() {},
            beforeClose : function(finalParams) {    // 漂浮层关闭后执行
                $(finalParams.selectE + ":checked").attr("checked", false);
                return true;
            }
        };
        if (params) $.extend(finalParams, params);

        $.relationCheckBox(finalParams.allSelectE, finalParams.selectE);
        $(finalParams.eventE).floatdialog(finalParams.divId, {
            beforeClick: function($this) {
                var ids = $.getCheckBoxValues(finalParams.selectE);
                if (ids.length == 0) {
                    $.showAlert({
                        text : finalParams.noSelectMsg
                    });
                    return false;
                } else if (ids.indexOf(",") != -1) {
                    $.showAlert({
                        text : "look_moreSelect"
                    });
                    return false;
                }

                $.setFloatTitle(finalParams, $(finalParams.selectE + ":checked"));
                if (finalParams.beforeShow) {
                    finalParams.beforeShow($(this), $("#" + finalParams.divId));
                }
                return true;
           },
           beforeClose : function() {
               if (finalParams.beforeClose) {
                    return finalParams.beforeClose(finalParams);
                }
           }
        });
    };

    /**
     * 设置漂浮层标题


     * @param {Object} divId
     * @param {Object} title
     */
    $.setFloatTitle = function(params, $event){
         var finalParams = {
            divId : "inputDiv",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型，title=国际化，dyna=动态
            title : "",    // 漂浮层标题
            dynaTitle : function($event) { return ""; } // 动态拼接漂浮层标题
        };
        if (params) $.extend(finalParams, params);

        var $div = $("#" + finalParams.divId + " .titleDiv .closeDiv");
        if (finalParams.titleType == "title") {
            $div.html(Message.dynamic(finalParams.title));
        } else {
            $div.html(finalParams.dynaTitle($event));
        }
    };

    /**
     * 关联多选框，使用于全选多选框
     * @param {Object} allSelectE
     * @param {Object} selectE
     */
    $.relationCheckBox = function(allSelectE, selectE) {
        $(allSelectE).change(function() {
            $(selectE + ":not(:disabled)").attr("checked", this.checked);
        });
        $(selectE).change(function() {
            if ($(selectE + ":checked").length == $(selectE).length) {
                $(allSelectE).attr("checked", true);
            } else {
                $(allSelectE).attr("checked", false);
            }
        }).change();
    };

    /**
     * 获取多选框的值


     * @param {Object} selectE
     */
    $.getCheckBoxValues = function(selectE) {
        var ids = "";
        $(selectE + ":checked").each(function() {
            ids += this.value + ","
        });
        if (ids.length > 0) {
            ids = ids.substring(0, ids.length - 1);
        }
        return ids;
    };

    /**
     * 获取单选框的值


     * @param {Object} selectE
     */
    $.getRadioValue = function(radioName) {
        return $("input[name='" + radioName + "']:checked").val();
    };

    /**
     * 通过多选方式ajax+漂浮层修改数据


     * @param {Object} params
     */
    $.ajaxFloatUpdateDataByCheckBox = function(params){
        var finalParams = {
			async :true,
            eventE : ".updateByBoxButton", // 触发标签
            allSelectE : ".allSelectBox",    // 全选标签
            selectE : ".selectBox",    // 单选标签
            divId : "inputDiv",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型
            title : "",    // 漂浮层标题
            formId : "inputForm",     // 表单id
            submitE : ".submitButton",  // 表单提交标签
            refreshList : true,    //是否刷新数据列表
            refreshEventE : ".queryButton",    // 查询标签
            closeE : ".closeButton",    // 关闭漂浮层标签
            dataType : "data",    // 请求url参数类型
            data : "",    //字符串参数
            dynaData : function() {return ""}, //动态拼接请求参数
            beforeShow : function(id){ return true; },    // 漂浮层显示前执行
            afterGetValue : function(){}, // 获取当前值后回调
            callback : function(result){ return true; } // 修改成功回调函数
        };
        if (params) $.extend(finalParams, params);

        $.relationCheckBox(finalParams.allSelectE, finalParams.selectE);

        $(finalParams.eventE).floatdialog(finalParams.divId, {
            beforeClick: function($this) {
                var id = $.getCheckBoxValues(finalParams.selectE);
                if (id.length == 0) {
                    $.showAlert({
                        text : "update_noSelect"
                    });
                    return false;
                } else if (id.indexOf(",") != -1) {
                    $.showAlert({
                        text : "update_moreSelect"
                    });
                    return false;
                }
                $.setFloatTitle(finalParams, $(finalParams.selectE + ":checked"));
                $.formReset(finalParams.formId);
                if (finalParams.beforeShow) {
                    if (!finalParams.beforeShow($(finalParams.selectE + ":checked"))) {
                        return false;
                    }
                }

                $.gAjax({
					async: finalParams.async,
                    url : GlobalConfig.ctx + GlobalConfig.servlet,
                    data : GlobalConfig.OptParam + "=" + GlobalConfig.CMD_INPUT + "&id=" + id,
                    success: function(json) {
                        finalParams.afterGetValue($.stringToJson(json))
                    }
                });
                $("#" + finalParams.formId).find(finalParams.submitE).unbind("click").click(function() {
                    if ($.validateForm(finalParams.formId)) {
                        var data = GlobalConfig.OptParam + "=" + GlobalConfig.CMD_UPDATE
                            + "&id=" + id + $.getFormParams(finalParams.formId);
                        if (finalParams.dataType == "data") {
                            data += finalParams.data;
                        } else {
                            data = finalParams.dynaData(data);
                        }
                        $.showLoading();
                        $.gAjax({
                            url: GlobalConfig.ctx + GlobalConfig.servlet,
                            data: data,
                            success: function(result) {
                            	$.closeLoading();
                                var ret = finalParams.callback(result);
                                if (ret) {
                                    if (result == "success") {
                                        $.showAlert({
                                            text : "update_success"
                                        });
                                        if (finalParams.refreshList) {
                                            $(finalParams.refreshEventE).click();
                                        }
                                        $("#" + finalParams.formId).find(finalParams.closeE).click();
                                        return true;
                                    } else {
                                        $.showAlert({
                                            text : result
                                        });
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            }
                        })
                    } else {
                        return false
                    }
                })

                return true;
            },
           beforeClose : function() {
              $(finalParams.selectE + ":checked").attr("checked", false);
              return true;
           }
        })
    };

     $.getSelectIdByBox = function(params){
         var finalParams = {
             selectE : ".selectBox"
         };
         if (params) $.extend(finalParams, params);

        var id = $.getCheckBoxValues(finalParams.selectE);
        if (id.length == 0) {
            $.showAlert({
                text : "update_noSelect"
            });
            return undefined;
        } else if (id.indexOf(",") != -1) {
            $.showAlert({
                text : "update_moreSelect"
            });
            return undefined;
        } else {
            return id;
        }
    };

    /**
     * ajax+漂浮层修改数据


     * @param {Object} params
     */
    $.ajaxFloatUpdateData = function(params) {
        var finalParams = {
            eventE : ".updateButton", // 触发标签
            divId : "inputDiv",    // 漂浮层div.id
            titleType : "title",    // 漂浮层标题类型
            title : "",    // 漂浮层标题
            formId : "inputForm",     // 表单id
            submitE : ".submitButton",    // 表单提交标签
            refreshList : true,    //是否刷新数据列表
            refreshEventE : ".queryButton",    // 查询标签
            closeE : ".closeButton",    // 关闭漂浮层标签
            dataType : "data",    // 请求url参数类型
            data : "",    //字符串参数
            dynaData : function() {return ""}, //动态拼接请求参数
            beforeShow : function(id){},    // 漂浮层显示前执行
            afterGetValue : function(json){}, // 获取当前值后回调
            callback : function(){ return true; } // 修改成功回调函数
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).floatdialog(finalParams.divId, {
            beforeClick: function($this) {
                var id = $this.attr("optid");

                $.setFloatTitle(finalParams, $this);
                $.formReset(finalParams.formId);
                if (finalParams.beforeShow) finalParams.beforeShow(id);
                $.gAjax({
                    url : GlobalConfig.ctx + GlobalConfig.servlet,
                    data : GlobalConfig.OptParam + "=" + GlobalConfig.CMD_INPUT + "&id=" + id,
                    success: function(json) {
                        finalParams.afterGetValue($.stringToJson(json))
                    }
                });
                $("#" + finalParams.formId).find(finalParams.submitE).unbind("click").click(function() {
                    if ($.validateForm(finalParams.formId)) {
                        var data = GlobalConfig.OptParam + "=" + GlobalConfig.CMD_UPDATE
                            + "&id=" + id + $.getFormParams(finalParams.formId);
                        if (finalParams.dataType == "data") {
                            data += finalParams.data;
                        } else {
                            data = finalParams.dynaData(data);
                        }
                        $.showLoading();
                        $.gAjax({
                            url: GlobalConfig.ctx + GlobalConfig.servlet,
                            data: data,
                            success: function(result) {
                            	$.closeLoading();
                                var ret = finalParams.callback(result);
                                if (ret) {
                                    if (result == "success") {
                                        $.showAlert({
                                            text : "update_success"
                                        });
                                        if (finalParams.refreshList) {
                                            $(finalParams.refreshEventE).click();
                                        }
                                        $("#" + finalParams.formId).find(finalParams.closeE).click();
                                        return true;
                                    } else {
                                        $.showAlert({
                                            text : result
                                        });
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            }
                        })
                    } else {
                        return false
                    }
                })

                return true;
            }
        })
    };

    /**
     * 通过多选框方式删除数据
     * @param {Object} params
     */
    $.ajaxDelDataByCheckBox = function(params) {
        var finalParams = {
            url : GlobalConfig.ctx + GlobalConfig.servlet,
            data : GlobalConfig.OptParam + "=" + GlobalConfig.CMD_DEL,    // 执行时会在后面追加ids=
            eventE : ".delByBoxButton",  // 触发标签
            allSelectE : ".allSelectBox",    // 全选标签
            selectE : ".selectBox",    // 单选标签
            addParams : function(){ return "";},    //追加请求参数
            refreshList : true,    // 是否刷新数据列表
            refreshEventE : ".queryButton",    // 查询标签
            beforeShow : function($this){return true;},    // 提示是否确认删除前执行，返回false则取消删除操作
            callback : function(){ return true; },    // 删除成功后回调函数
			confirmText :"del_confirm",
			successText :"del_success",
			noSelectText: "del_noSelect",
			loadText:"deleting"
        };
        if (params) $.extend(finalParams, params);

        $.relationCheckBox(finalParams.allSelectE, finalParams.selectE);
        $(finalParams.eventE).unbind("click").click(function() {
            var ids = $.getCheckBoxValues(finalParams.selectE);
            if (ids.length == 0) {
                $.showAlert({
                    text : finalParams.noSelectText
                });
            } else {
                if (finalParams.beforeShow) {
                    if (!finalParams.beforeShow($(finalParams.selectE + ":checked"))) {
                        return;
                    }
                }

			$.showConfirm(
				{
					text:finalParams.confirmText,
					callback: function(isConfirm){
						if(isConfirm){
                            $.showLoading({
                                text : finalParams.loadText
                            });
							  var data = finalParams.data + "&ids=" + ids + finalParams.addParams();
			                    $.gAjax({
			                        url: finalParams.url,
			                        data : data,
			                        success: function(result) {
			                            var ret = finalParams.callback(result);
			                            if (ret) {
			                                if (result == "success") {
			                                     $.showAlert({
			                                        text : finalParams.successText
			                                    });
			                                    if (finalParams.refreshList) {
			                                        $(finalParams.refreshEventE).click();
			                                    }
			                                    $("#" + finalParams.formId).find(finalParams.closeE).click();
			                                } else {
			                                     $.showAlert({
			                                        text : result
			                                    });
												if (finalParams.refreshList) {
			                                        $(finalParams.refreshEventE).click();
			                                    }
			                                }
			                            } else {
                                            $.closeLoading();
			                            }
			                        }
			                    })
						}
                        $(finalParams.allSelectE + ":checked").attr("checked", false);
                        $(finalParams.selectE + ":checked").attr("checked", false);
					}
				}
			);

            }
        })
    };

    /**
     * ajax删除数据
     * @param {Object} params
     */
    $.ajaxDelData = function(params) {
        var finalParams = {
            eventE : ".delByBoxButton", // 触发标签
            idAtt : "optid",    // id获取属性


            selectE : ".selectBox",    // 单选标签


            addParams : function(){ return "";},    // 追加请求参数
            refreshList : true,    // 是否刷新数据列表
            refreshEventE : ".queryButton",    // 查询标签
            callback : function(){ return true; }    // 删除成功回调函数
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).unbind("click").click(function() {
            var id = $(this).attr(finalParams.idAtt);
			$.showConfirm(
				{
					text:del_confirm,
					callback:function(isConfirm){
						if(isConfirm){
			                var data = GlobalConfig.OptParam + "=" + GlobalConfig.CMD_DEL + "&ids=" + id + finalParams.addParams();
			                $.gAjax({
			                    url: GlobalConfig.ctx + GlobalConfig.servlet,
			                    data : data,
			                    success: function(result) {
			                        var ret = finalParams.callback(result);
			                        if (ret) {
			                            if (result == "success") {
			                                $.showAlert({
			                                    text : "del_success"
			                                });
			                                if (finalParams.refreshList) {
			                                    $(finalParams.refreshEventE).click();
			                                }
			                                $("#" + finalParams.formId).find(finalParams.closeE).click();
			                                return true;
			                            } else {
			                                $.showAlert({
			                                    text : result
			                                });
			                                return false;
			                            }
			                        } else {
			                            return false;
			                        }
			                    }
			                })
						}
					}

				}
			);


        })
    };

    /**
     * 刷新div
     * @param {Object} params
     */
    $.refreshDiv = function(params) {
        var finalParams = {
             divId : "",	// div.id
             html : "", // html内容
    	     init : GlobalConfig.refreshListInit, // 刷新后初始化操作
             callback : function(){}	// 回调函数
        };
        if (params) $.extend(finalParams, params);

        var $div = $("#" + finalParams.divId);
        $div.html(finalParams.html);

        if (finalParams.callback) finalParams.callback();
        $.setRoot($div);
        $.initDatePicker();
        $.initLabelText();
        $.initInputRadio();
        $.initInputCheckbox();
        $.initTextarea();
        $.initFocusStyle();
        $.initToggle();
       	if (finalParams.init) finalParams.init();
        $.setRoot()
        $.closeLoading();
    };

	/**
	 * 只刷新上面的div而不进行任何初始化


	 * @param {Object} params
	 */
	$.refreshDivOnly = function(params) {
	    var finalParams = {
	         divId : "",	// div.id
	         html : ""// html内容
	    };
	    if (params) $.extend(finalParams, params);
	    var $div = $("#" + finalParams.divId);
	    $div.html(finalParams.html);
		finalParams.callback();
	    $.closeLoading();
	};

    /**
     * 分页信息对象
     * @param {Object} id
     * @param {Object} formId
     * @param {Object} listDivId
     * @param {Object} submitParams
     * @param {Object} data
     * @param {Object} params
     */
    function PageInfo(id, formId, listDivId, submitParams, url, data, params) {
        this.id = id;
        this.formId = formId;
        this.listDivId = listDivId;
        this.submitParams = submitParams;
        this.url = url;
        this.data = data;
        this.params = params;
    };

    /**
     * 获取分页提交参数
     * @param {Object} listDivId
     */
    function getPageSubmitParams(listDivId) {
        var pageInfo = GlobalVariable.pageInfos[listDivId];
        if (pageInfo) {
            return pageInfo.submitParams
        } else {
            return ""
        }
    };

    /**
     * 分页中输入页号后回车翻页事件
     * @param {Object} event
     * @param {Object} listDivId
     * @param {Object} page
     * @param {Object} pageCount
     */
    $.inputPage = function(event, listDivId, page, pageCount) {
        event = event ? event : window.event;
        if (event.keyCode == 13) {
            if (isNaN(page)) return;
            $.ajaxGoPage(listDivId, page, pageCount);
        }
    };

    /**
     * 初始化分页


     * @param {Object} params
     */
    $.initPage = function(params) {
        var finalParams = {
            pageDivId : "listPage",    //显示div.id
            hasForm : true,    // 是否存在form
            formId : "queryForm",    // form.id
            listDivId : "listDiv",    // 显示数据div.id
            selectPageCount : true,    // 是否提供每显示记录数选择
            pageCounts : GlobalConfig.pageCounts,    // 每页显示记录数数组
            url : GlobalConfig.ctx + GlobalConfig.servlet,  // 请求url
            data : GlobalConfig.OptParam + "=" + GlobalConfig.CMD_LIST,    // 翻页提交操作参数
            init : GlobalConfig.refreshListInit,    // 翻页后初始化操作
            beforeGo : function() {}    // 翻页前操作
        };
        if (params) $.extend(finalParams, params);

        var $this = $("#" + finalParams.pageDivId);
        var currPage = parseInt($this.attr("currPage"));
        if (isNaN(currPage)) currPage = 1;
        var lastPage = parseInt($this.attr("lastPage"));
        if (isNaN(lastPage)) lastPage = 1;
        var count = parseInt($this.attr("count"));
        if (isNaN(count)) count = 0;
        var pageCount = parseInt($this.attr("pageCount"));
        if (isNaN(pageCount)) pageCount = 10;

        var html = Message.page_total + count + Message.page_line + "&nbsp;" + Message.page_no
                + currPage + "/" + lastPage + Message.page_page + "&nbsp;&nbsp;" + Message.page_page
        if (currPage > 1) {
            html += " <a href='#' onclick='$.ajaxGoPage(\"" + finalParams.listDivId + "\", 1, " + pageCount
                + ");'><img alt='" + Message.page_firstPage + "' id='firstPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/page_first_a.gif' /></a>&nbsp;&nbsp;"
                + "<a href='#' onclick='$.ajaxGoPage(\"" + finalParams.listDivId + "\", " + (Number(currPage) - 1) + ", " + pageCount
                + ");'><img alt='" + Message.page_prevPage + "' id='prevPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/page_pre_a.gif' /></a>&nbsp;&nbsp;"
        } else {
            html += " <a href='#'><img alt='" + Message.page_firstPage + "' id='firstPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/page_first_b.gif' /></a>&nbsp;&nbsp;" + "<a href='#'><img alt='" + Message.page_prevPage
                + "' id='prevPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin + "/images/page_pre_b.gif' /></a>&nbsp;&nbsp;"
        }
        html += "<input type='text' class='HideMe' />";
        html += "<input type='text' style='width:30px;height:18px;line-height:14px;text-align:center' align='center' class='inputText  ac_blue_border' value='"
                + currPage + "' onkeypress='$.inputPage(event, \"" + finalParams.listDivId + "\", this.value, " + pageCount + ")'  /> ";
        if (currPage < lastPage) {
            html += "<a href='#' onclick='$.ajaxGoPage(\"" + finalParams.listDivId + "\", " + (Number(currPage) + 1) + ", " + pageCount
                + ");'><img alt='" + Message.page_nextPage + "' id='nextPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/page_next_a.gif'/></a>&nbsp;&nbsp;"
                + "<a href='#' onclick='$.ajaxGoPage(\"" + finalParams.listDivId + "\", " + lastPage + ", " + pageCount
                + ");'><img alt='" + Message.page_lastPage + "' id='lastPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/page_last_a.gif'/></a>";
        } else {
            html += "<a href='#'><img alt='" + Message.page_nextPage + "' id='nextPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/page_next_b.gif' /></a>&nbsp;&nbsp;" + "<a href='#'><img alt='" + Message.page_lastPage
                + "' id='lastPageButton' src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin + "/images/page_last_b.gif' /></a>";
        }
        if (finalParams.selectPageCount) {
            html += "&nbsp;&nbsp;" + Message.page_avgPage + "<select name='pageCount' id='selectPageCount' style='width:48px !important;' onchange='$.ajaxGoPage(\"" + finalParams.listDivId + "\", " + currPage + ", this.value);'>";
            for (var i = 0; i < finalParams.pageCounts.length; i++) {
                html += "<option value='" + GlobalConfig.pageCounts[i] + "' ";
                if (pageCount == finalParams.pageCounts[i]) {
                    html += " selected='selected' "
                }
                html += ">" + finalParams.pageCounts[i] + "</option>"
            }
            html += "</select>" + Message.page_line;
        }
        $this.html(html);

        var data = finalParams.data;
        if (finalParams.hasForm) {
            data += $.getFormParams(finalParams.formId);
        }
        GlobalVariable.pageInfos[finalParams.listDivId] =
                new PageInfo(finalParams.pageDivId, finalParams.formId, finalParams.listDivId, "&currPage=" + currPage + "&pageCount=" + pageCount, finalParams.url,  data, finalParams);
    };

    /**
     * ajax翻页
     * @param {Object} listDivId
     * @param {Object} page
     * @param {Object} pageCount
     */
    $.ajaxGoPage = function(listDivId, page, pageCount) {
        var pageInfo = GlobalVariable.pageInfos[listDivId];
        $.showLoading();
        if (pageInfo.params.beforeGo) pageInfo.params.beforeGo();
        $.gAjax({
            url: pageInfo.url,
            data: pageInfo.data + "&currPage=" + page + "&pageCount=" + pageCount,
            success: function(result) {
                $.refreshDiv({
                    divId : pageInfo.listDivId,
                    html : result,
                    init : pageInfo.params.init
                });
                $.initPage(pageInfo.params);
            }
        })
    };

    /**
     * ajax查询
     * @param {Object} params
     */
    $.ajaxQuery = function(params) {
        var finalParams = {
            eventE : ".queryButton",  // 查询标签
            formId : "queryForm",    // 查询form.id
            listDivId : "listDiv",    // 数据列表div.id
            url : GlobalConfig.ctx + GlobalConfig.servlet, // 请求url
            data : GlobalConfig.OptParam + "=" + GlobalConfig.CMD_LIST,    // 请求数据
            beforeQuery : function(data){},
            callback : function(){}    // 回调函数
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).unbind("click").click(function() {
            $.showLoading();
			//alert($.getFormParams(finalParams.formId));
			//alert(finalParams.formId);
            var data = finalParams.data + $.getFormParams(finalParams.formId) + getPageSubmitParams(finalParams.listDivId);
            finalParams.beforeQuery(data);
            $.gAjax({
                url: finalParams.url,
                data : data,
                success: function(result) {
                    $.refreshDiv({
                        divId : finalParams.listDivId,
                        html : result,
                        callback : finalParams.callback
                    });
                }
            })
        }).click()
    };

	/**
	 * 在漂浮层中的查询
	 * @param {Object} params
	 */
	$.ajaxQueryFloatDiv = function(params) {
        var finalParams = {
            eventE : ".queryButton",  // 查询标签
            formId : "queryForm",    // 查询form.id
            listDivId : "listDiv",    // 数据列表div.id
            url : GlobalConfig.ctx + GlobalConfig.servlet, // 请求url
            data : GlobalConfig.OptParam + "=" + GlobalConfig.CMD_LIST,    // 请求数据
            beforeQuery : function(){},
            callback : function(){}    // 回调函数
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).unbind("click").click(function() {
            $.showLoading();
            var data = finalParams.data + $.getFormParams(finalParams.formId);
			finalParams.beforeQuery();
			//alert("beforeQuery");
			$.gAjax({
                url: finalParams.url,
                data : data,
                success: function(result) {
                    $.refreshDivOnly({
                        divId : finalParams.listDivId,
                        html : result,
                        callback : finalParams.callback
                    });
                }
            })
        }).click()
    };


    /**
     * ajax刷新div
     * @param {Object} params
     */
    $.ajaxRefreshDiv = function(params) {
        var finalParams = {
            url : GlobalConfig.ctx + GlobalConfig.servlet,    // 请求操作参数
            dataType : "data",    // 请求参数类型
            data : "",    // 字符串参数

			async : true, //控制同步还是异步
            dynaData : function() {return "";}, // 动态拼接参数

            hasPage : true,    // 是否使用分页
            pageDivId : "listPage",    // 分页div.id
            listDivId : "listDiv",    // 数据列表div.id
            showLoading : true,    // 是否显示等待画面
            init : GlobalConfig.refreshListInit    // 刷新后初始化操作
        };
        if (params) $.extend(finalParams, params);

        if (finalParams.showLoading) {
            $.showLoading();
        }
        var data = "";
        if (finalParams.hasPage) {
            data += getPageSubmitParams(finalParams.pageDivId);
        }
        if (finalParams.dataType == "data") {
            data += finalParams.data;
        } else {
            data = finalParams.dynaData(data);
        }
        $.gAjax({
			async: finalParams.async,
            url: finalParams.url,
            data : data,
            success: function(result) {
                $.refreshDiv({
                    divId : finalParams.listDivId,
                    html : result,
                    init : finalParams.init
                });
            }
        });
    };

    /**
     * tab信息对象
     * @param {Object} tabDiv
     * @param {Object} tabContextId
     * @param {Object} maps
     * @param {Object} callback
     */
    function TabInfo(tabDiv, tabContextId, maps, type, init, callback, beforeChangeTab) {
        this.tabDiv = tabDiv;
        this.tabContextId = tabContextId;
        this.labels = new Array();
        this.contents = new Array();
        (function(maps, labels, contents) {
            $.each(maps,  function(label, content) {
                labels.push(label);
                contents.push(content)
            })
        })(maps, this.labels, this.contents);
        this.index = -1;
        this.type = type;
		this.init = init;
        this.callback = callback;
		this.beforeChangeTab = beforeChangeTab;
    };

    /**
     * 初始化水平tab
     * @param {Object} params
     */
    $.initTab = function(params) {
        var finalParams = {
            tabDivId: "tabDiv",  // tab选择区div.id
            tabContextId: "tabContext", // tab内容区div.id
            maps: {},    // tab映射
            initIndex: 0,    // 初始焦点索引, -1则不进行初始化，用于延迟获取
            width: "auto",    // 内容区宽度


            height: "auto",    // 内容区高度


            tabClass : "tab",    // tab样式
            callback: function(index, label){},    //回调函数 index:选择的索引 label:选择的标签名
            init : GlobalConfig.refreshListInit,	// 刷新div后初始化div内容
            beforeChangeTab:function(){} // tab触发之前调用
        };
        if (params) $.extend(finalParams, params);

        var $tabDiv = $("#" + finalParams.tabDivId);
        var $tabContext = $("#" + finalParams.tabContextId);
        var tabInfo = new TabInfo($tabDiv, finalParams.tabContextId, finalParams.maps, "L", finalParams.init, finalParams.callback,finalParams.beforeChangeTab);
        GlobalVariable.tabInfos[finalParams.tabDivId] = tabInfo;
        $tabDiv.addClass(finalParams.tabClass);
        $tabContext.addClass("tabBlock");
        if (finalParams.width != "auto") {
        	if (GlobalConfig.browser == "ie") {
        		$tabDiv.width((finalParams.width + 2));
            } else {
            	$tabDiv.width((finalParams.width + 8));
            }
            $tabContext.width(finalParams.width)
        }
        if (finalParams.height && finalParams.height != "auto") {
            $tabContext.height(finalParams.height)
        }
        var html = "<table align='left' style='width: auto; background-color: transparent;'><tr>";
        var index = 0;

			$.each(finalParams.maps, function(label, content) {
                html += "<td class='on' style='border:0px;'><a href='#' onclick=$.changeTabByIndex('"
                        + finalParams.tabDivId + "'," + index+ ") style='text-decoration:none;'><span id='"
                        + finalParams.tabDivId + "-" + index + "'>" + (finalParams.tabClass == "tab" ? "&nbsp;" : "")
                        + label + (finalParams.tabClass == "tab2D" ? "&nbsp;&nbsp;" : "") + "&nbsp;</span></a></td>";
                index++;
        	});


        $tabDiv.html(html);

		if(finalParams.beforeChangeTab) finalParams.beforeChangeTab();
        if (finalParams.initIndex >= 0) {
            $.changeTabByIndex(finalParams.tabDivId, finalParams.initIndex);
        }
    };

    /**
     * 通过索引改变tab焦点
     * @param {Object} tabDivId
     * @param {Object} index
     */
    $.changeTabByIndex = function(tabDivId, index) {
        var tabInfo = GlobalVariable.tabInfos[tabDivId];
        if (index == -1) {
            tabInfo.index = -1;
            return;
        }

        $.showLoading({
            text : "pageLoading"
        });
        var content = tabInfo.contents[index];
        if (content.charAt(0) == '#') { // 引用页面内部div内容
            refreshTabContent(tabInfo, index, $(content).html());
        } else { // ajax获取内容
        	tabInfo.beforeChangeTab();
             $.gAjax({
                url: content,
                success: function(data) {
                    refreshTabContent(tabInfo, index, data);
                }
            })
        }
    };

    /**
     * 刷新tab内容
     * @param {Object} tabInfo
     * @param {Object} html
     */
    function refreshTabContent(tabInfo, index, html) {
        if (tabInfo.type == "L") {
             tabInfo.tabDiv.find("td.on").removeClass("on");
             tabInfo.tabDiv.find("td:eq(" + index + ")").addClass("on");
        } else if (tabInfo.type == "V") {
            tabInfo.tabDiv.find("li.verticalTabFocus").removeClass("verticalTabFocus");
            tabInfo.tabDiv.find("li:eq(" + index + ")").addClass("verticalTabFocus");
        }

        tabInfo.index = index;
        $.refreshDiv({
            divId : tabInfo.tabContextId,
            html : html,
			init: tabInfo.init
        });
        if (tabInfo.callback) tabInfo.callback(index, tabInfo.labels[index]);
    }

    /**
     * 通过tab名改变tab焦点
     * @param {Object} tabDivId
     * @param {Object} label
     */
    $.changeTabByLabel = function(tabDivId, label) {
        var tabInfo = GlobalVariable.tabInfos[tabDivId];
        $.each(tabInfo.labels,
        function(_index, _label) {
            if (_label == label) {
                $.changeTabByIndex(tabDivId, _index);
                return false
            }
        })
    };

    /**
     * 刷新当前tab
     * @param {Object} tabDivId
     */
    $.refreshCurrTab = function(tabDivId) {
        $.changeTabByIndex(tabDivId, $.getTabIndex(tabDivId));
    };

    /**
     * 通过tab索引修改tab信息
     * @param {Object} tabDivId
     * @param {Object} index
     * @param {Object} json
     */
    $.updateTabByIndex = function(tabDivId, index, json) {
        var tabInfo = GlobalVariable.tabInfos[tabDivId];
        if (json.label) {
            $("#" + tabDivId + "-" + index).text(json.label);
            tabInfo.labels[index] = json.label
        }
        if (json.content) {
            tabInfo.contents[index] = json.content;
            /*if ($("#" + tabDivId + "-" + index).parent().parent().hasClass("on")) {
                $.changeTabByIndex(tabDivId, index)
            }*/
        }
    };

    /**
     * 获取tab当前焦点索引
     * @param {Object} tabDivId
     */
    $.getTabIndex = function(tabDivId) {
        return GlobalVariable.tabInfos[tabDivId].index;
    };

    /**
     * 获取tab当前焦点标签名


     * @param {Object} tabDivId
     */
    $.getTabLabel = function(tabDivId) {
        var tabInfo = GlobalVariable.tabInfos[tabDivId];
        return tabInfo.labels[tabInfo.index];
    };

    /**
     * 初始化垂直tab
     * @param {Object} params
     */
    $.initVerticalTab = function(params) {
        var finalParams = {
            tabDivId: "tabDiv",	// tab选择区div.id
	        tabContextId: "tabContext",	// tab内容区div.id
			maps : {}, // tab映射
			initIndex : 0, // 初始焦点索引, -1则不进行初始化，用于延迟获取
			labelWidth : "100", // 选项卡宽度
			width : "100", // 内容宽度
			height : "100", // 内容高度
			tabClass : "verticalTab",    // tab样式
			callback : function(index, label) {}, //回调函数
			beforeChangeTab:function(){}, // tab触发之前调用
			init : GlobalConfig.refreshListInit
        };
        if (params) $.extend(finalParams, params);

        var $tabDiv = $("#" + finalParams.tabDivId);
        $tabDiv.addClass(finalParams.tabClass);
        var $tabContext = $("#" + finalParams.tabContextId);
        $tabContext.addClass("tabBlock");
        $tabContext.css("float", "left");
        if (finalParams.width != "auto") {
            $tabContext.width(finalParams.width);
        }
        if (finalParams.height != "auto") {
            $tabContext.height(finalParams.height);
        }
        var tabInfo = new TabInfo($tabDiv, finalParams.tabContextId, finalParams.maps, "V", finalParams.init, finalParams.callback, finalParams.beforeChangeTab);
        GlobalVariable.tabInfos[finalParams.tabDivId] = tabInfo;
        var html = "<ul>";
        var index = 0;
        $.each(finalParams.maps, function(label, content) {
            html += "<li onclick=$.changeTabByIndex('"
                        + finalParams.tabDivId + "'," + index+ ")>" + label + "</li>";
            index++;
        });
        html += "</ul>";
        $tabDiv.html(html);

        if (finalParams.labelWidth != "auto") {
            $tabDiv.find("ul").width(finalParams.labelWidth);
        }
        $("li", $tabDiv).hover(function() {
            $(this).addClass("verticalTabHover");
        },function() {
            $(this).removeClass("verticalTabHover");
        })

         if (finalParams.initIndex >= 0) {
            $.changeTabByIndex(finalParams.tabDivId, finalParams.initIndex);
         }
    };

    /**
     * 初始化垂直表单tab，所有选项卡内容来自页面，表单提交时一起提交，用于通过选项卡设置权限


     * @param {Object} params
     */
    $.initVerticalFormTab = function(params) {
        var finalParams = {
            divE : "#verticalTab",    // 漂浮层div.id
            labelWidth : "100",    // 选项卡宽度

            divWidth : "100",    // 内容宽度
            divHeight : "100",    // 内容高度
            tabClass : "verticalTabULDiv",    // tab样式
            initIndex : 0,    // 初始tab索引, -1则不进行初始化，用于延迟获取
            labels : {}    // 选项卡配置
        };
        if (params) $.extend(finalParams, params);

        var $div = $(finalParams.divE);
        var ul = "<div class='" + finalParams.tabClass +"'><ul>";
        var $firstLabelDiv;
        $.each(finalParams.labels, function(labelDivId, beforeShow) {
            var $label = $("#" + labelDivId);
			if (finalParams.divWidth != "auto") {
				$label.width(finalParams.divWidth);
	        }
			//alert(finalParams.divHeight);
	        if (finalParams.divHeight != "auto") {
				$label.height(finalParams.divHeight);
	        }else{
				var cssObj = {
					//定义最小高度,超过则自动拉长

			      'height' : 'auto !important;260px',
			      'height' : '',
			      'min-height' : '260px'
			    }
				$label.css(cssObj);
			}


            if (!$firstLabelDiv) {
                $firstLabelDiv = $label;
            }
            ul += "<li rel='" + labelDivId + "'>" + $label.attr("label") + "&nbsp;</li>";
        });
        ul += "</ul></div>";
        $firstLabelDiv.before(ul);
        $("ul", $div).width(finalParams.labelWidth);
        $("li:first", $div).addClass("verticalTabFocus");
        $("li", $div).hover(function() {
            $(this).addClass("verticalTabHover");
        },function() {
            $(this).removeClass("verticalTabHover");
        }).click(function() {
            $this = $(this);
            var $beforeFocus = $("li.verticalTabFocus", $div);
            $("#" + $beforeFocus.attr("rel")).hide();
            $beforeFocus.removeClass("verticalTabFocus");

            $this.addClass("verticalTabFocus");
            finalParams.labels[$this.attr("rel")]();
            $("#" + $this.attr("rel")).show();
        });

         if (finalParams.initIndex >= 0) {
             $.setVerticalFormTab({
                 divE: finalParams.divE,
                 index: finalParams.initIndex
             });
         }
    };

	$.setVerticalFormTab = function(params){
        var finalParams = {
            divE: "#verticalTab",
            index: 0
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.divE + " li:eq(" + finalParams.index + ")").click();
    };

    /**
     * 刷新当前tab
     * @param {Object} tabDivId
     */
    $.refreshCurrVerticalTab = function(tabDivId) {
        $("#" + tabDivId + " .verticalTabFocus").click();
    };

    /**
     * 初始化伸展与合并事件
     */
    $.initToggle = function() {
        $(".subtitle, .subtitleClose", GlobalVariable.root).click(function() {
            var $this = $(this);
            var $tbody = $this.parent().parent().next();
            if ($this.hasClass("subtitle")) {
                $this.removeClass("subtitle");
                $this.addClass("subtitleClose");
                $tbody.hide();
            } else {
                $this.removeClass("subtitleClose");
                $this.addClass("subtitle");
                $tbody.show();
            }
        })
    };

    /**
     * 初始化级联下拉框
     * @param {Object} params
     */
    $.initCascadeSelect = function(params) {
         var finalParams = {
            divId: "",    //div.id
            config: {},    // 级联配置
            width : "self" // 下拉框宽度，self表示不干预


        };
        if (params) $.extend(finalParams, params);

        var html = "";
        var jsons = new Array();
        $.each(finalParams.config,  function(name, url) {
            html += "<select name='" + name + "'><option value=' '>" + Message.select_header + "</option></select>&nbsp;";
            jsons.push({
                "name": name,
                "url": url
            })
        });
        GlobalVariable.cascadeSelects[finalParams.divId] = jsons;
        var $div = $("#" + finalParams.divId);
        $div.addClass("CascadeSelect").html(html);
        $.each(jsons,
        function(index, json) {
            var $select = $("select[name=" + json.name + "]", $div);
            if (index != 0) $select.hide();
            if (finalParams.width != "self") $select.width(finalParams.width)
        });
        $.setRoot($div);
        $.initFocusStyle();
        $.setRoot();
        $.each(jsons,
        function(index, json) {
            var $select = $("select[name=" + json.name + "]", $div);
            if (index == 0) {
                var ajaxUrl = GlobalConfig.ctx;
                if (json.url.charAt(0) == "?") {
                    ajaxUrl += GlobalConfig.servlet + json.url
                } else {
                    ajaxUrl += json.url
                }
                $.gAjax({
                    url: ajaxUrl,
                    success: function(data) {
                        data = $.stringToJson(data);
                        $select.find("option:gt(0)").remove();
                        $.each(data,
                        function(key, value) {
                            $select.append("<option value='" + key + "'>" + value + "</option>")
                        })
                    }
                })
            } else {
                $select.prev().change(function() {
                    var $this = $(this);
                    if ($.trim($this.val()).length == 0) {
                        var $nextSelect = $this.next();
                        while ($nextSelect.length > 0) {
                            $nextSelect.hide();
                            $nextSelect = $nextSelect.next()
                        }
                        return true
                    }
                    var ajaxUrl = GlobalConfig.ctx;
                    if (json.url.charAt(0) == "?") {
                        ajaxUrl += GlobalConfig.servlet + json.url
                    } else {
                        ajaxUrl += json.url
                    }
                    var selectParam = "";
                    var $prevSelect = $this;
                    while ($prevSelect.length > 0) {
                        selectParam += "&" + $prevSelect.attr("name") + "=" + $.trim($prevSelect.val());
                        $prevSelect = $prevSelect.prev()
                    }
                    ajaxUrl += selectParam;
                    $.gAjax({
                        url: ajaxUrl,
                        success: function(data) {
                            data = $.stringToJson(data);
                            $select.find("option:gt(0)").remove();
                            $.each(data,
                            function(key, value) {
                                $select.append("<option value='" + key + "'>" + value + "</option>")
                            });
                            $select.show();
                            var $nextSelect = $select.next();
                            while ($nextSelect.length > 0) {
                                $nextSelect.hide();
                                $nextSelect = $nextSelect.next()
                            }
                            var queue = GlobalVariable.cascadeSelectQueue[finalParams.divId];
                            if (queue) {
                                $select.val(queue.shift());
                                $select.change()
                            }
                        }
                    })
                })
            }
        });
        $.resetCascadeSelect(finalParams.divId)
    };

    /**
     * 重置级联下拉框


     * @param {Object} divId
     */
    $.resetCascadeSelect = function(divId) {
        var jsons = GlobalVariable.cascadeSelects[divId];
        var $div = $("#" + divId);
        $.each(jsons,
        function(index, json) {
            if (index == 0) {
                $("select[name=" + json.name + "]", $div).val(" ")
            } else {
                $("select[name=" + json.name + "]", $div).hide()
            }
        })
    };

    /**
     * 设置级联下拉框


     * @param {Object} divId
     * @param {Object} value
     */
    $.setCascadeSelect = function(divId, value) {
        var jsons = GlobalVariable.cascadeSelects[divId];
        var $div = $("#" + divId);
        var $select = $("select[name=" + jsons[0].name + "]", $div);
        $select.val(value[0]);
        if (value.length > 1) {
            var queue = new Array();
            for (var i = 1; i < value.length; i++) {
                queue.push(value[i])
            }
        }
        GlobalVariable.cascadeSelectQueue[divId] = queue;
        $select.change()
    };

    /**
     * 初始化上传


     * @param {Object} params
     */
    $.initAjaxUpload = function(params) {
        var finalParams = {
            eventE : "",    // 触发标签
            url : "",    // 上传url
            doneMessage : Message.au_done,
            showId : "uploadFloatDiv",
            uploadDivId : "uploadDiv"
        };
        if (params) $.extend(finalParams, params);

        $(finalParams.eventE).parents("body").append("<div class='tabBlock floatDiv uploadFloatDiv' id='" + finalParams.showId + "'><div class='titleDiv'><div class='closeDiv'>"
                + Message.au_title + "</div>" + "<img src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin
                + "/images/close.gif' class='closeX closeButton' /></div><div id='"+finalParams.uploadDivId+"' class=''></div></div>");
        var vault = new dhtmlXVaultObject();
        vault.setImagePath(GlobalConfig.ctx + "js/dhtmlxvault/imgs/");
        vault.setServerHandlers(GlobalConfig.ctx + finalParams.url,
                                GlobalConfig.ctx + "js/dhtmlxvault/GetInfoHandler.jsp",
                                GlobalConfig.ctx + "js/dhtmlxvault/GetIdHandler.jsp");
		vault.setDoneMessage(finalParams.doneMessage);
        vault.create(finalParams.uploadDivId);
        $(finalParams.eventE).floatdialog(finalParams.showId);
    };

    /**
     * 初始化提示画面


     * @param {Object} params
     */
    $.initTipDiv = function(params) {
        var finalParams = {
            eventE : "",	// 触发标签
            tipDivE : "",    // 提示div
            leftOffset : 30,    // 显示左偏移像素


            topOffset : 30,    // 显示上偏移像素
            cluetipClass : 'cyan',    // 提示画面主题
            beforeCalPos : function($event, $tipDiv){}    // 移上去后显示提示画面前触发事件


        };
        if (params) $.extend(finalParams, params);

        var $tipDiv = $(finalParams.tipDivE);
        $tipDiv.show();
		$(finalParams.eventE).attr("rel", finalParams.tipDivE).cluetip(finalParams);
        $tipDiv.hide();
    };

    /**
     * 初始化等待画面


     */
    $.initLoading = function() {
        $(document.body).append("<div class='loadingMask HideMe'></div>"
                              + "<div class='loadingDiv HideMe'>"
                              + "<img src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin + "/images/loading.gif' />"
                              + "  <span id='loadingText'></span></div>");
        $(".loadingMask").css({
            opacity: '0.33'
        });
    };

    /**
     * 显示等待画面
     * @param {Object} params
     */
    $.showLoading = function(params) {
        var finalParams = {
            i18n: true,    // 是否启用国际化


            text: "float_loading",    // 国际化key/文本内容
            width: "auto"    // div宽度
        };
        if (params) $.extend(finalParams, params);

        if (finalParams.width != "auto") {
            $(".loadingDiv").width(finalParams.width);
        }

        $("#loadingText").html(finalParams.i18n ? Message[finalParams.text] : finalParams.text);

        $.hideAllVisableSelect();
        $(".loadingMask").fullSize().show();
        $(".loadingDiv").centerPos().show();
    };

    /**
     * 将标签大小设为页面尺寸


     */
    $.fn.fullSize = function() {
        var $doc = $(document);
        var $this =  $(this);
        $this.css({
            'width': $doc.width() + "px",
            'height': $doc.height() + "px"
        });
        return $this;
    };

    /**
     * 将标签移到屏幕正中位置


     */
    $.fn.centerPos = function() {
        var $window = $(window);
        var $doc = $(document);
        var $this =  $(this);
        $this.css({
            'left': ($doc.scrollLeft() + ($window.width() - $this.width()) / 2) + "px",
            'top': ($doc.scrollTop() + ($window.height() - $this.height()) / 2) + "px"
        });
        return $this;
    };

    /**
     * 关闭等待画面
     */
    $.closeLoading = function() {
        $.showAllVisableSelect();
        $(".loadingDiv").hide();
        $(".loadingMask").hide();
    };

    /**
     * IE6下隐藏所有显示的select，不隐藏会在漂浮层上面


     */
    $.hideAllVisableSelect = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie 6") != -1) {
            $("select:visible").addClass("ie6_float_hide").hide();
        }
    }

    /**
     * IE6下显示所有隐藏的select，漂浮层关闭后调用


     */
    $.showAllVisableSelect = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie 6") != -1) {
            $(".ie6_float_hide").removeClass("ie6_float_hide").show();
        }
    }

    /**
     * 初始化提示画面


     */
    $.initAlert = function() {
        $(document.body).append("<div class='alertMask HideMe'></div>"
                              + "<div class='alertDiv HideMe'>"
                              + "<table><tr><td align='right' style='height:20px;'>"
                              + "<img src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin + "/images/close.gif' class='alertCloseButton'/></td></tr>"
                              + "<tr><td align='center' valign='middle' class='alertMsg'><span id='alertText'></span>&nbsp;<span id='alertAutoCloseText'></span>"
                              + "<span id='alertAutoClose' class='HideMe'></span></td></tr>"
                              + "<tr><td align='center'><input type='button' class='alertSure alertCloseButton' value='" + Message.confirm_yes + "' /></td></tr>"
                              + "</table></div>");
        $(".alertMask").css({
            opacity: '0.33'
        });
        $(".alertCloseButton").click(function() {
             $.closeAlert();
        });
    };

    /**
     * 显示提示画面
     */
    $.showAlert = function(params) {
        var finalParams = {
            i18n: true, // 是否信息国际化


			width: "auto", // 提示画面宽度
			height: 100, // 提示画面高度
            text: "float_loading",  // 信息内容
            autoClose: 3,    // ?秒后自动关闭提示画面
            callback : function(){} // 关闭后回调函数


        };
        if (params) $.extend(finalParams, params);

        $("#alertText").html(finalParams.i18n ? Message[finalParams.text] : finalParams.text);
        $("#alertAutoClose").html(finalParams.autoClose);
        $("#alertAutoCloseText").html(Message.dynamic('auto_close', finalParams.autoClose));

        $.hideAllVisableSelect();
        $(".alertMask").fullSize().show();
		 if (finalParams.width != "auto") {
            $(".alertDiv").width(finalParams.width)
        }
		$(".alertDiv").height(finalParams.height).centerPos().show();
        GlobalVariable.alertCallback = finalParams.callback;
        setTimeout("$.refreshAlertAutoClose()", 1000);
    };

    /**
     * 刷新提示画面，用于自动关闭提示画面


     */
    $.refreshAlertAutoClose = function(finalParams) {
        if ($(".alertDiv:visible").length > 0) {    // 提示画面还在显示中时执行
            var second = $("#alertAutoClose").html();     //倒计时秒数


            if (second == 1) {
                 $.closeAlert();
            } else {
                second--;
                $("#alertAutoClose").html(second);
                $("#alertAutoCloseText").html(Message.dynamic('auto_close', second));
                setTimeout("$.refreshAlertAutoClose()", 1000);
            }
        }
    };

    /**
     * 关闭提示画面
     */
    $.closeAlert = function() {
        GlobalVariable.alertCallback();
        $.showAllVisableSelect();
        $(".alertDiv").hide();
        $(".alertMask").hide();
        $.closeLoading();    // 同时关闭加载画面
    };

    /**
     * 初始化警告画面


     */
    $.initWarn = function(params) {
        var finalParams = {
            viewDivId : "warnView",	    // 警告图标显示div.id
            beforeShow : function(){}    // 显示前触发事件


        };
        if (params) $.extend(finalParams, params);

        $("#" + finalParams.viewDivId).addClass("warnView").html("<img id='warnImg' src='" + GlobalConfig.ctx + "skins/"
                              + GlobalConfig.skin + "/images/warn.png' class='warnButton'/>"
                              + " <span id='warnCount' style='vertical-align : super;'>(0)</span>");

        $(document.body).append("<div class='tabBlock floatDiv' id='warnDiv' style='width:600px;'>"
                    			+ "<div class='filter'>"
                    				+ "<div class='closeDiv'></div>"
                    				+ "<img src='" + GlobalConfig.ctx + "skins/" + GlobalConfig.skin + "/images/close.gif' class='closeX closeButton'/>"
                    			+ "</div>"
                    			+ "<div class='dataGrid floatBottomFix' style='padding:10px;'>"
                                 	+ "<table class='authTable' style='color:red; text-align:center; width: 578px;'>"
                                        + "<tr><th width='30'>" + Message.text_no + "</th><th>" + Message.text_type + "</th><th>" + Message.text_info + "</th><th>" + Message.text_detail + "</th></tr>"
                                 	    + "<tbody id='warnMsgs' style='margin-top: 10px; margin-bottom: 10px;'>"
                                        + "<tr class='noWarnTr'><td colspan='4'>" + Message.no_warn + "</td></tr>"
                                        + "</tbody>"
                                    + "</table>"

                                    + "<div style='height:10px;'></div>"
                                    + "<center>"
                    				    + "<input type='button'class='imgButton inputButton closeButton' value='" + Message.confirm_yes + "'/>"
                    			    + "</center>"
                                + "</div>"
                    		+ "</div>");

        $.initFloatDiv({
            eventE : "#warnImg",
            divId : "warnDiv",
            title : "title_warn",
            beforeShow : finalParams.beforeShow
        });
    };

    /**
     * 新增警告信息
     * @param {Object} key
     * @param {Object} msg
     */
    $.setWarn = function(key,msgType, msg, info) {
        var $warMsgs = $("#warnMsgs");
        var $noWarnTr = $(".noWarnTr", $warMsgs);
        if ($noWarnTr.length > 0) {
            $noWarnTr.remove();
        }
        var $msg = $("tr[key='" + key + "']", $warMsgs);
        var count = $("tr", $warMsgs).length;
        if ($msg.length == 0) {
            count++;
            $warMsgs.append("<tr key='" + key + "'><td width='30'>" + count + "</td><td>" + msgType + "</td><td>" + msg + "</td><td>" + info + "</td></tr>");
        } else {
            $("td:last", $msg).html(msg);
        }
        $("#warnCount").html("(" + count + ")");
    };

    /**
     * 移除警告信息
     * @param {Object} key
     */
    $.removeWarn = function(key) {
        var $warMsgs = $("#warnMsgs");
        $("tr[key='" + key + "']", $warMsgs).remove();
        var count = $("tr", $warMsgs).length;
        $("#warnCount").html("(" + count + ")");
        if (count == 0) {
            $("#warnMsgs").html("<tr class='noWarnTr'><td colspan='3'>" + Message.no_warn + "</td></tr>");
        }
    };

    /**
     * 清空警告信息
     */
    $.clearWarn = function() {
        $("#warnMsgs").html("<tr class='noWarnTr'><td colspan='4'>" + Message.no_warn + "</td></tr>");
        $("#warnCount").html("(0)");
    };

    /**
     * 页面跳转
     * @param {String} url
     * @param {Boolean} withTop  top页面跳转
     */
    $.redirect = function(url, withTop) {
        if (withTop) {
            top.window.location.href = url;
        } else {
            window.location.href = url;
        }
    };


	/*
	 * 确认框初始化
	 */
	$.initConfirm = function(){
			$(document.body).append("<div class='confirmMask HideMe'></div>"
                              + "<div class='confirmDiv HideMe'>"
                              + "<table style='height:100%'><tr><td align='center'>"
                              + "<span id='confirmText'></span></td></tr>"
							  +"<tr style='height:50px'><td align='center'>"
							  +"<input type='button' class='confirmSure' value='" + Message.confirm_yes + "'/>"
							  +"<input type='button' class='confirmCancel' value='" + Message.confirm_no + "'/>"
							  +"</td></tr></table>"+"</div>");
			$(".confirmMask").css({
            	opacity: '0.33'
        	});

			$(".confirmCloseButton").click(
				function(){
					$.closeConfirm();
				}
			);
	};

	/*
	 * 确认框显示传入参数


	 */
	$.showConfirm = function(params){
		var finalParams = 	{
				i18n:true,    // 是否信息国际化


				text:"Do you confirm?",    // 信息内容
				width:400,    // 确认框宽度


				height:100,     // 确认框高度


				callback:function(yes) {}    // 确认框回调函数    yes=true(确认), false(取消或者X)
		};

		if(params){
			$.extend(finalParams, params);
		}
		$("#confirmText").html(finalParams.i18n ? Message[finalParams.text] : finalParams.text);
        $.hideAllVisableSelect();
        $(".confirmMask").fullSize().show();
		$(".confirmDiv").width(finalParams.width)
										.height(finalParams.height)
										.centerPos().show();

		$(".confirmSure").unbind("click").click(
		//点击确定以后调用回调函数
				function(){
					finalParams.callback(true);
					$.closeConfirm();
				}
			);
		$(".confirmCancel").unbind("click").click(
		//点击取消以后调用回调函数
				function(){
					finalParams.callback(false);
					$.closeConfirm();
				}
			);

	};

    $.closeConfirm = function() {
        $.showAllVisableSelect();
        $(".confirmDiv").hide();
        $(".confirmMask").hide();
    };

    /**
     * 修正2个span.button时自动适合td宽度排列问题
     */
    $.fixAfterButton= function() {
    	$(".afterButton").each(function() {
    		var $this = $(this);
    		var thisWidth = $this.width() + 12;
    		var $prevButton = $(this).prev();
    		var prevWidth = $prevButton.width() + 12;
    		var $td = $this.parent();
    		var tdWidth = $td.width();
    		if (thisWidth + prevWidth + 11 > tdWidth) {
                if ($.getBrowser() == "ie") {
                    $this.css({
                        "margin-left": "0px",
                        "margin-top": "3px"
                    });
                } else {
                    $td.height(55).css("padding-top", "6px");
    			    $this.before("<div style='height:8px;'></div>")
                        .css("margin-left", "0px");
                }
    		}
    	});
    };

    /**
     * 初始化自动显示隐藏提示


     */
    $.initToast = function() {
        if ($("#toastDiv", top.document.body).length == 0) {
            $(top.document.body).append("<div id='toastDiv' class='HideMe'>asd</div>");
        }
    };

    /**
     * 显示自动显示隐藏提示
     */
    $.showToast= function(params) {
        var finalParams = {
            i18n: true, // 是否信息国际化


			width: "auto",
			height: 50,
            text: "float_loading",  // 信息内容
            autoClose: 3000    // ?秒后自动关闭提示画面
        };
        if (params) $.extend(finalParams, params);

        var $div = $("#toastDiv", top.document.body).html(finalParams.i18n ? Message[finalParams.text] : finalParams.text);
        var $window = $(window);
        var $doc = $(top.document);
        $div.width(finalParams.width);
        $div.css({
            'left': ($doc.scrollLeft() + ($window.width() - $div.width()) / 2) + "px"
        }).fadeIn("fast").fadeOut("show");
    };

	/*
	 * select 多选列表插件


	 */
     $.initSelect2Select = function(params){
	 var finalParams = {
	 	 async:true,
	     containId:"",
	     width:150,
	     heigh:100,
	     select1Title:"",
	     select2Title:"",
	     url:""
	 };
	 if(params){
	     $.extend(finalParams, params);
	 }

	 var jsonRes ="";
	 var srcOptionHtml ="";
	 var targetOptionHtml ="";
         $.gAjax({
		 	 async : finalParams.async,
		     url: finalParams.url,
		     success: function(result){
			 //alert(result);
			 //alert(result.src.length);
			 jsonRes = $.stringToJson(result);
			 if(jsonRes.src!=null){
				 for(var i = 0 ; i < jsonRes.src.length ; i++){
				     srcOptionHtml += '<option value="'+jsonRes.src[i].value+'">';
				     srcOptionHtml += jsonRes.src[i].name;
				     srcOptionHtml += '</option>';
				 }
			 }
			 //alert(srcOptionHtml);
			 if(jsonRes.target!=null){
				 for(var i = 0 ; i < jsonRes.target.length ; i++){
				     targetOptionHtml += '<option value="'+jsonRes.target[i].value+'">';
				     targetOptionHtml += jsonRes.target[i].name;
				     targetOptionHtml += '</option>';
				 }
			 }
			 //alert(targetOptionHtml);

			 var html = "";

			 html += '<table class="selectTable" style="width:'+finalParams.width*2+'px"><tr>';
			 html += '<td align="center" style="width:'+finalParams.width+'px" >';
			 html += finalParams.select1Title;

			 html += '</td><td></td>';
			 html += '<td align="center" style="width:'+finalParams.width+'px" >';
			 html += finalParams.select2Title;
			 html += '</td></tr><tr>';

			 html += '<td  align="center" style="width:'+finalParams.width+'px">';
			 html += '<select  ondblclick="$.setSelectItem(\'sltSrc\',\'sltTarget\');" class="Select2Select inputText ac_blue_border" id="sltSrc" name="sltSrc" multiple="true" style="width:'+finalParams.width+'px;height:'+finalParams.height+'px;">';
			 html += srcOptionHtml;
			 html += '</select>';
			 html += '</td>';

			 html += '<td align="center" style="width:20px">';
			 html += '<img onclick="$.setSelectItem(\'sltTarget\',\'sltSrc\');" src=\'' + GlobalConfig.ctx + 'skins/' + GlobalConfig.skin + '/images/arrow_left.gif\' />';
			 html += '<img onclick="$.setSelectItem(\'sltSrc\',\'sltTarget\');" src=\'' + GlobalConfig.ctx + 'skins/' + GlobalConfig.skin + '/images/arrow_right.gif\' />';
			 html += '</td>';

			 html += '<td  align="center" style="width:'+finalParams.width+'px">';
			 html += '<select ondblclick="$.setSelectItem(\'sltTarget\',\'sltSrc\');" class="Select2Select inputText ac_blue_border" id="sltTarget" name="sltTarget" multiple="true" style="width:'+finalParams.width+'px;height:'+finalParams.height+'px;">';
			 html += targetOptionHtml;
			 html += '</select>';
			 html += '</td></tr></table>';

			 //alert(html);
			 //alert(finalParams.containId);
			 $(finalParams.containId).html(html);
		     }
		 });



     };

	/*
	 * 双击 设置 select item from to
	 */
    $.setSelectItem = function(srcId, targetId){
		//alert(123);
        var sltSrc = document.getElementById(srcId);
        var sltTarget = document.getElementById(targetId);

		var tmpArray = new Array();
        for (var i = 0; i < sltSrc.options.length; i++) {
            var tempOption = sltSrc.options[i];
			//alert(sltSrc.options.length);
			//alert(tempOption.text);
            if (tempOption.selected) {
				tmpArray.push(tempOption);

            }
        }

		for(var i = 0 ; i < tmpArray.length ; i++){
			sltSrc.removeChild(tmpArray[i]);
            sltTarget.appendChild(tmpArray[i]);
		}


    };

    /**
     * 初始化菜单位置


     */
    $.initMenuPos = function(){
           var $div = $("#" + GlobalConfig.menuPosDiv);
           if ($div.length > 0 && top.menuPos) {
              $div.prepend(top.menuPos);
           }
    };

})(jQuery);
