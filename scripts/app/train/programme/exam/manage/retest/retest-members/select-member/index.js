var D = require('drizzlejs');

exports.title = '选择用户';
exports.large = true;

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    'human/organization/navigate-tree': { isModule: true, region: 'left', uri: 'human/member' }
};

exports.store = {
    models: {
        members: { url: '../exam/exam/retest-members', type: 'pageable', root: 'items' },
        state: { data: {} },
        search: {
            data: {},
            mixin: { getQueryParams: function() {
                if (this.data.organizationId) return { organizationId: this.data.organizationId };
                return {};
            } }
        }
    },
    callbacks: {
        refreshList: function(options) {
            var data = D.assign({ examId: this.module.renderOptions.latestExamId },
                    this.models.search.getQueryParams(),
                    options
                ),
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
        return this.dispatch('refreshList');
    }
};
