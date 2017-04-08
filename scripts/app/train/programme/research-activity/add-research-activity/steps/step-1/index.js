var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        research: {},
        topics: {
            url: '../system/topic/ids'
        },
        img: { url: '../system/file/upload' }
    },
    callbacks: {
        init: function(payload) {
            var me = this;
            this.models.research.set(payload);
            this.models.topics.params = {
                ids: _.map(payload.topics, 'topicId').join(',')
            };
            if (this.models.topics.params.ids) {
                return this.get(this.models.topics).then(function() {
                    D.assign(me.models.research.data, {
                        topics: _.map(me.models.topics.data, function(t) {
                            return { value: t.id, text: t.name };
                        })
                    });
                });
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.research);
};

exports.mixin = {
    getData: function() {
        var components = this.items.main.components,
            map = {};

        Object.keys(components).forEach(function(k) {
            if (components[k].getData && components[k].getData()) {
                map[k] = components[k].getData();
            }
            if (k === 'questionary-detail') {
                map.questionaryDetail = components[k].getValue();
            }
        });

        return D.assign({}, map, this.items.main.getData());
    },
    isValidator: function() {
        return this.items.main.validate() && this.items.main.check();
    }
};
