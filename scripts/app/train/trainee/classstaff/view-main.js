var _ = require('lodash/collection');

exports.bindings = {
    classstaffs: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'classstaffs' }
}];

exports.dataForTemplate = {
    classstaffs: function(data) {
        var classstaffs = data.classstaffs,
            pageNum = this.bindings.classstaffs.getPageInfo().page;
        _.map(classstaffs || [], function(classstaff, i) {
            var e = classstaff;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return classstaffs;
    }
};
