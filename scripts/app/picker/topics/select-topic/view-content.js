var _ = require('lodash/collection'),
    $ = require('jquery');

exports.title = '选择话题';

exports.bindings = {
    topics: true
};

exports.events = {
    'click select_*': 'checkTopic'
};

exports.handlers = {
    checkTopic: function(value) {
        var member = _.find(this.bindings.topics.data,
            function(o) {
                return o.id === value;
            });
        var checked = $(this.$('hid_' + value)).val(),
            state = false;
        if (checked === 'true') {
            $(this.$('hid_' + value)).val(false);
            state = false;
        } else {
            $(this.$('hid_' + value)).val(true);
            state = true;
        }
        this.module.renderOptions.callback(member, state);
    }
};
exports.dataForTemplate = {
    topics: function(data) {
        var ids = this.module.renderOptions.ids;
        if (ids) {
            _.map(data.topics || [], function(x) {
                var m = x || {};
                if (ids.indexOf(m.id) !== -1) m.checked = true;
            });
        }
        return data.topics;
    }
};
exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
