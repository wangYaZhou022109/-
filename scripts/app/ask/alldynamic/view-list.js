var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
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
    trends: function(data) {
        var trends = data.trends;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        // data.trends =
        console.log(trends);
        return trends;
    }
};
