var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.title = '选择用户';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    'train/statistics/navigate-tree': { isModule: true, region: 'left' }
};

exports.store = {
    models: {
        members: { url: '../human/member/picker-for-train', type: 'pageable', root: 'items' },
        state: {
            data: {},
            mixin: {
                keepCheckedMembers: function(member, checked) {
                    var checkedMembers = this.data.checkedMembers || [];
                    checkedMembers.push({
                        member: member,
                        checked: checked
                    });
                    this.data.checkedMembers = checkedMembers;
                }
            }
        },
        search: {
            data: {},
            mixin: {
                getQueryParams: function() {
                    if (this.data.organizationId) return { organizationId: this.data.organizationId };
                    return {};
                }
            }
        }
    },
    callbacks: {
        refreshList: function(options) {
            var data = D.assign({
                    status: 1,
                }, this.models.search.getQueryParams(), options),
                model = this.models.members;
            model.params = data;
            this.get(model);
        }
    }
};

exports.mixin = {
    nodeChanged: function(node) {
        var model = this.store.models.search;
        model.data.organizationId = node.id;
        model.changed();
        this.dispatch('refreshList');
    }
};

exports.buttons = [{
    text: '确定',
    fn: function() {
        var callback = this.renderOptions.callback,
            checkedMembers = this.store.models.state.data.checkedMembers || [];
        if (callback) {
            _.forEach(checkedMembers, function(m) {
                callback(m.member, m.checked);
            });
        }
        this.store.models.state.data.checkedMembers = [];
    }
}];
