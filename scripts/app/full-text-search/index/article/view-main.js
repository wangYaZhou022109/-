exports.bindings = {
    articles: true,
    state: false,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'articles' }
}];
