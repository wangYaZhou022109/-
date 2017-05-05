var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        list: {
            url: '../exam/question-depot',
            mixin: {
                merge: function(list) {
                    var me = this,
                        obj = {};
                    _.forEach(list, function(l) {
                        me.data.unshift(l);
                    });
                    _.forEach(this.data, function(d) {
                        obj[d.id] = d;
                    });
                    this.data = _.map(obj, function(v) {
                        return v;
                    });
                }
            }
        },
        shareAndPublic: { url: '../exam/question-depot/share-public', cache: true }, //  上级允许下级的目录，和 所有公开的
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var me = this,
                list = this.models.list,
                shareAndPublic = this.models.shareAndPublic,
                state = this.models.state;

            if (payload.data) D.assign(state.data, payload.data);

            if (payload.params && payload.params.organizationId) {
                D.assign(list.params, payload.params);
                if (payload.params.share) {
                    return this.get(list).then(function() {
                        return me.get(shareAndPublic).then(function() {
                            list.merge(shareAndPublic.data);
                            me.models.state.changed();
                        });
                    });
                }
                return this.get(list).then(function() {
                    me.models.state.changed();
                });
            }
            return '';
        },
        selectChanged: function(payload) {
            var state = this.models.state;
            D.assign(state.data, {
                id: payload.id,
                name: payload.text,
                text: payload.text,
                path: payload.data.path || ''
            });
            state.data.selectChanged && state.data.selectChanged(payload);
            state.changed();
        },
        clear: function() {
            this.models.state.data.id = '';
            this.models.state.data.text = '';
            this.models.state.changed();
        }
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.data || {},
        inputName = this.renderOptions.inputName || 'questionDepotId';

    return this.dispatch('init', {
        params: this.renderOptions.params,
        data: {
            id: data.id,
            text: data.name,
            inputName: inputName,
            required: this.renderOptions.required,
            selectChanged: this.renderOptions.selectChanged
        }
    });
};

exports.mixin = {
    validate: function() {
        return this.items.main.validate();
    },
    getData: function() {
        var data = this.store.models.state.data;
        if (data.id) {
            return data;
        }
        return null;
    },
    clear: function() {
        return this.dispatch('clear');
    },
    reset: function(params) {
        return this.dispatch('init', { params: params });
    }
};
