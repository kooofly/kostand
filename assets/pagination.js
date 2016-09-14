(function() {
    /*
     var pagination = new Pagination('#pagination', {
     // 见default参数
     }).render({total: 100})
     pagination.$element.on('change', function(e, i, size) {
     // 翻页 do something ...
     })
     */

    function Pagination(element, option) {
        var defaults = {
            size: 10, //每页显示条数
            total: null, //总数
            element: null, //挂在的元素
            current: 1, //默认页
            maxPagerCount: 5, //最多显示pager个数
            template: {
                def: '<div class="pagination-wrapper clearfix"><ul class="pagination pull-right"><li class="first disabled"><a href="javascript:;">首页</a></li><li class="prev disabled"><a href="javascript:;">上一页</a></li>{pagers}<li class="next"><a href="javascript:;">下一页</a></li><li class="last"><a href="javascript:;">尾页</a></li></ul><div class="pull-left mt7">共<var>{total}</var>条记录</div></div>'
            }
        }
        this.$element = $(element)
        this.option = $.extend({}, defaults, option);
        this.init();
    }

    Pagination.prototype = {
        init: function() {
            this.delegateEvent(this.option);
        },
        delegateEvent: function() {
            var self = this;
            var $element = this.$element;
            if(!$element.length) {
                console.error('[Pagination] 配置错误 找不到初始化元素')
                return;
            }

            $element.on('click', '.first', function() {
                if($(this).hasClass('disabled')) return;
                self.goToPage(1);
            })
            $element.on('click', '.prev', function() {
                if($(this).hasClass('disabled')) return;
                self.goToPage(self.option.current - 1);
            })
            $element.on('click', '.mypager', function() {
                if($(this).hasClass('disabled') || $(this).hasClass('active')) return;
                self.goToPage($(this).data('value'));
            })
            $element.on('click', '.next', function() {
                if($(this).hasClass('disabled')) return;
                self.goToPage(self.option.current + 1);
            })
            $element.on('click', '.last', function() {
                if($(this).hasClass('disabled')) return;
                self.goToPage(self.option.page);

            })
        },
        createPagers: function(page, maxPagerCount) {
            var ret = '',
                count = page > maxPagerCount ? maxPagerCount : page,
                current = this.option.current;


            //无省略号
            if(page <= maxPagerCount) {
                for (var i = 1, j = count + 1; i < j; i++) {
                    if(i === current) {
                        ret += '<li class="mypager active" data-value="' + i + '"><a href="javascript:;">' + i + '</a></li>'
                    } else{
                        ret += '<li class="mypager" data-value="' + i + '"><a href="javascript:;">' + i + '</a></li>'
                    }
                }
            } else {
                //包含省略号
                var halving = (maxPagerCount - 1) / 2,
                    prevCountOppositeCurrent = Math.floor(halving),
                    nextCountOppositeCurrent = Math.ceil(halving);
                var more = '<li class="pager_more"><a>…</a></li>';
                if(current - prevCountOppositeCurrent > 1) {
                    ret += more;
                }



                var i,j;

                if(current - prevCountOppositeCurrent <= 1) {
                    i = 1;
                    j = maxPagerCount;
                } else if(current + nextCountOppositeCurrent >= page) {
                    j = page;
                    i = page - maxPagerCount + 1;
                } else {
                    i = current - prevCountOppositeCurrent;
                    j = current + nextCountOppositeCurrent;
                }
                for (; i <= j; i++) {
                    if(i === current) {
                        ret += '<li class="mypager active" data-value="' + i + '"><a href="javascript:;">' + i + '</a></li>'
                    } else{
                        ret += '<li class="mypager" data-value="' + i + '"><a href="javascript:;">' + i + '</a></li>'
                    }
                }
                if(current + nextCountOppositeCurrent < page) {
                    ret += more;
                }
            }

            return ret;
        },
        render: function(option) {
            var op = this.option;
            $.extend(op, option || {});
            var total = this.option.total,
                size = this.option.size,
                maxPagerCount = this.option.maxPagerCount,
                $element = this.$element;
            //page 页数
            this.option.page = Math.ceil(total / size);
            var template = this.option.template[this.option.type] || this.option.template.def;

            template = template.replace(/\{total\}/g, total).replace(/\{pagers\}/g, this.createPagers(this.option.page, maxPagerCount))

            $element.html(template);
            this.renderRuleUI($element);
        },
        goToPage: function(index) {
            var $element = this.$element;
            this.option.current = index;
            $element.trigger('change', [index, this.option.size]);
            this.render();
        },
        //启用禁用按钮处理
        renderRuleUI: function($element) {
            var disabledList = this.renderRule();
            for (var key in disabledList) {
                var $item = $element.find('.' + key)
                if(disabledList[key]) {
                    $item.removeClass('disabled');
                } else {
                    $item.addClass('disabled');
                }
            }
        },
        renderRule: function() {
            var ret = {};
            var current = this.option.current,
                page = this.option.page;

            if(current === 1) {
                ret.first = 0
                ret.prev = 0
            } else {
                ret.first = 1
                ret.prev = 1
            }

            if(current === page) {
                ret.next = 0
                ret.last = 0
            } else {
                ret.next = 1
                ret.last = 1
            }

            if (this.option.total === 0) {
                ret.first = 0
                ret.prev = 0

                ret.next = 0
                ret.last = 0
            }
            return ret;
        }
    }

    $.plugs.Pagination = Pagination
})()