var D = require('drizzlejs');
exports.title = '选择试卷';

exports.large = true;

exports.items = {
    'search-param': 'search-param',
    'paper-list': 'paper-list'
};

exports.store = {
    models: {
        searchParam: {
            data: {},
            mixin: {
                getQueryParams: function() {
                    if (this.data.organizationId) {
                        return {
                            organizationId: this.data.organizationId
                        };
                    }
                    return {};
                }
            }
        },
        papers: {
            url: '../exam/paper-class',
            root: 'items',
            type: 'pageable'
        },
        paper: {
            url: '../exam/paper-class'
        },
        currentOrg: {
            url: '../human/organization/current',
            autoLoad: 'after'
        },
        options: {}
    },
    callbacks: {
        refreshList: function(options) {
            var data = D.assign({ status: 1 }, this.models.searchParam.getQueryParams(), options);
            this.models.papers.params = data;
            this.get(this.models.papers);
        },
        selectPaper: function(paperId) {
            var callback = this.module.renderOptions.callback,
                that = this;
            this.models.paper.set({ id: paperId });
            this.get(this.models.paper).then(function() {
                callback && callback(that.models.paper.data);
            });
        }
    }
};

exports.beforeRender = function() {
    this.store.models.options.set(this.renderOptions);
};

exports.mixin = {
    getData: function() {
        return this.store.models.paper.data;
    }
};
