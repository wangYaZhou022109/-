exports.title = '选择目录';

exports.bindings = {
    list: true
};

exports.components = [{
    id: 'tree', name: 'tree', options: { model: 'list', openLevel: 4 }
}];
