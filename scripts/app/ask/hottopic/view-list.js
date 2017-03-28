
// var D = require('drizzlejs');
// var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    topic: true
};

exports.events = {
    'click topic-more': 'topicMore',
    'click topicDeal-*': 'topicDeal'
};

exports.handlers = {
    topicMore: function() {
        this.app.show('content', 'ask/topic');
    },
    topicDeal: function(id) {
        console.log(id);
        // var region;
        // var el = $(target).parents('.page-main')[0];
        // region = new D.Region(this.app, this.module, el, id);
        // region.show('ask/mymanage/topicdetail', { id: id });
        this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
    }
};

exports.dataForTemplate = {
};
