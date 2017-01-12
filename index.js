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
})(function($, Class, Util){
var int = parseInt;
var Overlay = Class.extend('Event', {
    initialize: function(options){
        this.options = $.extend({
            container: document.body,
            autoOpen: true,
            content: '',
            width: false,
            height: false,
            top: 0,
            left: 0,
            center: false,
            className: ''
        }, options || {});

        this.init();
    },

    init: function(){
        var self = this;
        var container = self.options.container;

        if(Overlay.isDocumentOrBody(container)){
            self.container = $(document.body);
        }else{
            self.container = $(container);
            !/fixed|absolute/.test(self.container.css('position')) && self.container.css('position', 'relative');
        }

        self.create();
        self.options.autoOpen && self.open();
        self.initEvent();
    },

    create: function(){
        var self = this, options = self.options;

        self.$ = $('<div class="ui3-overlay">').addClass(options.className).html(options.content);
        self.setSize(options.width, options.height);
        self.setPos(options.left, options.top);
    },

    initEvent: function(){
        var self = this;

        self.o2s(window, 'resize', function(){
            self.setPosCenter();
        });
    },

    css: function(name, value){
        return this.$.css(name, value);
    },

    setSize: function(width, height){
        width != null && this.css('width', width);
        height != null && this.css('height', height);
    },

    getSize: function(){
        return Overlay.getSize(this.$);
    },

    setPos: function(x, y){
        var self = this;

        if(self.options.center){
            return;
        }

        x != null && self.css('left', x);
        y != null && self.css('top', y);
    },

    setPosCenter: function(){
        var self = this;

        if(!self.options.center){
            return;
        }

        var container = Overlay.isDocumentOrBody(container) ? window : self.container, position;
        var size1 = Overlay.getSize(container), size2 = self.getSize();

        self.css({
            left: (size1.width - size2.width)/2,
            top: (size1.height - size2.height)/2
        });
    },

    open: function(){
        this.container.append(this.$);
        this.setPosCenter();
        this.trigger('open');
    },

    close: function(){
        this.$.remove();
        this.trigger('close');
    },

    show: function(){
        this.open();
    },

    hide: function(){
        this.close();
    },

    toggle: function(){
        this.$.is(':visible') ? this.hide() : this.show();
    },

    destroy: function(){
        var self = this;

        self.ofs(window, 'resize');
        self.$.remove();
        self.$ = null;
    }
});

Overlay.isDocumentOrBody = function(dom){
    dom = $(dom).get(0);
    return dom === document.body || dom === document;
};

Overlay.getSize = function(dom){
    if(Overlay.isDocumentOrBody(dom)){
        dom = document;
    }

    dom = $(dom);

    return {
        width: parseInt(dom.outerWidth()),
        height: parseInt(dom.outerHeight())
    };
}

return Overlay;

});