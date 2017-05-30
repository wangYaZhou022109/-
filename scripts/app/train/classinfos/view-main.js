var _ = require('lodash/collection');

exports.bindings = {
    classinfos: true
};

exports.components = [{
    id: 'pager',
    name: 'pager',
    options: { model: 'classinfos' }
}];

exports.dataForTemplate = {
    classinfos: function(data) {
        var classinfos = data.classinfos,
            timestamp = new Date().getTime();
        _.forEach(classinfos, function(classinfo) {
            var e = classinfo;
            if (e.arriveDate === '' || timestamp < e.arriveDate) {
                e.status = '未实施';
            } else if (timestamp > e.arriveDate && timestamp < e.returnDate) {
                e.status = '实施中';
            } else if (timestamp > e.returnDate) {
                e.status = '已实施';
            }
        });
        return classinfos;
    }
};
