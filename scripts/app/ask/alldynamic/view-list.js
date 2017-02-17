var D = require('drizzlejs');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click dynamic-*': 'toggleMore'
};

exports.handlers = {
    dynamic: function() {
        // this.app.show('content', 'ask/index');
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.pull-left')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/question', { id: id });
       // console.log($(target).parents('.pull-left'));

       // this.module.dispatch('changeState', { typeIndex: Number(id) });
      //  $(target).find('.min-btn-groups').slideToggle();
       // $(target).siblings().find('.min-btn-groups').slideUp();
    }
};

exports.dataForTemplate = {
};
