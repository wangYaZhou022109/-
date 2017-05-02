var _ = require('lodash/collection'),
    types = [
        { id: 1, type: 1, name: '单选' },
        { id: 2, type: 2, name: '多选' },
        { id: 3, type: 3, name: '判断' },
        { id: 4, type: 8, name: '排序' },
        // { id: 5, type: 7, name: '连线' },
        { id: 6, type: 4, name: '填空' },
        { id: 7, type: 5, name: '问答' },
        { id: 8, type: 6, name: '阅读理解' }
    ];

exports.bindings = {
    paper: true,
    summary: true
};

exports.dataForTemplate = {
    summary: function() {
        var data = this.bindings.summary.data,
            rows = data.rows,
            remote = _.map(_.orderBy(types, ['id', 'asc']), function(t) {
                return {
                    total: {
                        amount: '-',
                        score: '-'
                    },
                    type: t.type,
                    typeName: t.name
                };
            });

        rows = _.map(remote, function(r) {
            var obj = _.find(rows, ['type', r.type]);
            if (obj) {
                return obj;
            }
            return r;
        });
        return { rows: rows };
    }
};
