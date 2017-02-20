exports.bindings = {
    classinfos: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'classinfos' }
}];

exports.dataForTemplate = {
    classinfos: function(data) {
        return data.classinfos;
    }
};

