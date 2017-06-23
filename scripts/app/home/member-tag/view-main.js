var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    topics: true,
    selectedTopics: true
};
exports.events = {
    'click cancel-*': 'cancelSelected',
    'click selected-*': 'selected',
    'click change': 'changeTopics',
};

exports.handlers = {
    cancelSelected: function(id) {
        var topics = this.bindings.topics.data,
            payload = _.find(topics, ['id', id]);
        this.module.dispatch('cancelSelected', payload);
    },
    selected: function(id) {
        var topics = this.bindings.topics.data,
            payload = _.find(topics, ['id', id]);
        this.module.dispatch('selected', payload);
    },
    changeTopics: function() {
        var topics = this.bindings.topics.data;
        if (topics.enough) {
            this.module.dispatch('refreshTopics');
        } else {
            $(this.$('enough')).show();
        }
    }
};

exports.dataForTemplate = {
    topics: function(data) {
        var topics = data.topics || [],
            selectedTopics = this.bindings.selectedTopics.data || [];
        _.map(topics, function(item) {
            var r = item,
                t = _.find(selectedTopics, ['id', r.id]);
            if (t) {
                r.selected = true;
            } else {
                r.selected = false;
            }
        });
        return topics;
    }
};
