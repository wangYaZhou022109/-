var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.title = '选择用户';
exports.large = true;

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    'human/organization/navigate-tree': { isModule: true, region: 'left', uri: 'human/member' }
};

exports.store = {
    models: {
        members: { url: '../human/member', type: 'pageable', root: 'items' },
        state: {
            data: {},
            mixin: {
                keepCheckedMembers: function(member, checked) {
                    var checkedMembers = this.data.checkedMembers || [];
                    if (_.find(checkedMembers, function(item) { return item.member.id === member.id; })) {
                        _.forEach(checkedMembers, function(item) {
                            var i = item;
                            if (i.member.id === member.id) i.checked = checked;
                        });
                    } else {
                        checkedMembers.push({
                            member: member,
                            checked: checked
                        });
                    }
                    this.data.checkedMembers = checkedMembers;
                },
                getCheckedMembers: function() {
                    var checkedMembers = this.data.checkedMembers,
                        result = [];
                    _.forEach(checkedMembers, function(m) {
                        var isExits = _.find(result, function(r) {
                            return r.member.id === m.member.id;
                        });
                        if (!isExits) {
                            result.push(m);
                        } else {
                            result = _.reject(result, function(r) {
                                return r.member.id === m.member.id;
                            });
                            result.push(m);
                        }
                    });
                    return result;
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
            var data = D.assign({}, { status: 1 }, this.models.search.getQueryParams(), options),
                model = this.models.members;
            model.params = data;
            return this.get(model);
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
            singleCallback = this.renderOptions.singleCallback,
            checkedMembers = this.store.models.state.data.checkedMembers || [];
        if (singleCallback) {
            singleCallback(checkedMembers);
        }
        if (callback) {
            _.forEach(checkedMembers, function(m) {
                callback(m.member, m.checked);
            });
        }
        this.store.models.state.data.checkedMembers = [];
    }
}];
