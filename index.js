;(function(factory){
if(typeof define == 'function' && define.amd){
    //seajs or requirejs environment
    define(['jquery', 'class'], factory);
}else if(typeof module === 'object' && typeof module.exports == 'object'){
    module.exports = factory(
        require('jquery'),
        require('class')
    );
}else{
    window.jQuery.overlay = factory(window.jQuery, window.jQuery.klass);
}
})(function($, Class){
var doc = document;

return Class.extend('Event', {
    initialize: function(options){
        this.options = $.extend({
            container: doc.body,
            autoOpen: true,
            content: '',
            width: '100%',
            height: false,
            top: false,
            left: false,
            center: true, 
            className: ''
        }, options || {});

        this.init();
    },

    init: function(){
        var self = this;
        var $container = self.container = $(self.options.container);

        if($container[0] != doc.body){
            !/fixed|absolute/.test($container.css('position')) && $container.css('position', 'relative');
        }

        self.create();
        self.initEvent();
        self.options.autoOpen && self.open();
    },

    create: function(){
        var self = this, options = self.options;

        self.dom = $('<div class="ui3-overlay">').addClass(options.className).hide().append(options.content).appendTo(options.container);
        self.setSize(options.width, options.height);
        self.setPos(options.left, options.top);
    },

    css: function(name, value){
        return this.dom.css(name, value);
    },

    initEvent: function(){
        var self = this;

        self.o2s(window, 'resize', function(){
            self.setPosCenter();
        });
    },

    setSize: function(width, height){
        width != null && this.css('width', width);
        height != null && this.css('height', height);
    },

    setPos: function(x, y){
        var self = this;

        if(!self.isPosCenter()){
            x != null && self.css('left', x);
            y != null && self.css('top', y);
        }
    },

    setPosCenter: function(){
        var self = this;

        if(self.isPosCenter()){
            var container = self.container.get(0), position;

            if(container === doc.body){
                position = 'fixed';
                container = window;
            }else{
                position = 'absolute';
            }

            self.css({
                left: parseInt(($(container).outerWidth() - self.dom.outerWidth())/2),
                top: parseInt(($(container).outerHeight() - self.dom.outerHeight())/2),
                position: position
            });
        }
    },

    isPosCenter: function(){
        return this.options.center;
    },

    open: function(){
        this.setPosCenter();
        this.dom.show();
        this.trigger('open');
    },

    close: function(){
        this.dom.hide();
        this.trigger('close');
    },

    destroy: function(){
        var self = this;

        self.dom.remove();
        self.dom = null;
        self.ofs(window, 'resize');
    }
});
});