exports.bindings = {
    knowledges: true,
    search: 'changeSearch',
};
exports.changeSearch = function() {
    var params = this.bindings.search.data;
    params.categoryId = params.menu2 || params.menu1;
    this.module.dispatch('searchKnowledges', { params: params });
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'knowledges' }
}];
