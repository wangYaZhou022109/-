var _ = require('lodash/collection');
exports.items = {
    list: 'list',
    'ask/followme': { isModule: true }
};

exports.store = {
    models: {
        down: { url: '../human/file/download' },
        member: { url: '../ask-bar/concern/followMe' },
        page: {
            data: [],
            params: { page: 1, size: 20 },
            mixin: {
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
                }
            }
        }
    },
    callbacks: {
        init: function() {
            var member = this.models.member;
            var params = this.models.page.params;
            params.id = 'me';
            member.set(params);
            return this.post(member);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
