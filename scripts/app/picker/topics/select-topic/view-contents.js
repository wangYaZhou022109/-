var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    topics: true
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
        var checked = this.$('hid_' + value).value,
            state = false;
        if (checked === 'true') {
            this.$('hid_' + value).value = false;
            state = false;
            $(element).removeClass('active');
        } else {
            this.$('hid_' + value).value = true;
            state = true;
            $(element).addClass('active');
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
                if (ids.indexOf(m.id) !== -1) {
                    m.checked = true;
                    m.checkStyle = 'active';
                }
            });
        }
        return data.topics;
    }
};
exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
