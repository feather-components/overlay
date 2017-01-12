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
            top: false,
            left: false,
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
    },

    create: function(){
        var self = this, options = self.options;

        self.$ = $('<div class="ui3-overlay">').addClass(options.className).html(options.content);
        self.setSize(options.width, options.height);
        self.setPos(options.left, options.top);
    },

    css: function(name, value){
        return this.$.css(name, value);
    },

    setSize: function(width, height){
        var container = this.container;

        if(Overlay.isDocumentOrBody(container)){
            container = $(document);
        }

        if(width === false){
            this.css('width', container.outerWidth());
        }else if(width != null){
            this.css('width', width);
        }

        if(height === false){
            this.css('height', container.outerHeight());
        }else if(height != null){
            this.css('height', height);
        }
    },

    getSize: function(){
        return {
            width: this.$.outerWidth(),
            height: this.$.outerHeight()
        };
    },

    setPos: function(x, y){
        var self = this;

        x != null && self.css('left', x);
        y != null && self.css('top', y);
    },

    open: function(){
        this.$.appendTo(this.container);
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

        self.$.remove();
        self.$ = null;
    }
});

Overlay.isDocumentOrBody = function(dom){
    dom = $(dom).get(0);
    return dom === document.body || dom === document;
};

return Overlay;

});