var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    topics: true,
    search: 'searchChange'
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.data);
};

exports.events = {
    'click select_*': 'checkTopic'
};
exports.handlers = {
    checkTopic: function(value, events, element) {
        var member = _.find(this.bindings.topics.data,
            function(o) {
                return o.id === value;
            });
        var state;
        $(element).toggleClass('active');
        state = $(element).hasClass('active');
        this.module.renderOptions.callback(member, state).then(function(flag) {
            if (flag === false) {
                $(element).removeClass('active');
            }
        });
    }
};
exports.dataForTemplate = {
    topics: function(data) {
        var ids = this.module.renderOptions.ids;
        if (ids) {
            _.map(data.topics || [], function(x) {
                var m = x || {};
                if ((ids + ',').indexOf(m.id + ',') !== -1) {
                    m.checked = true;
                    m.checkStyle = 'active';
                }
            });
        }
        return data.topics;
    }
};
