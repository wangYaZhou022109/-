var _ = require('lodash/collection'),
    remoteBackGround = 'images/default-cover/default_exam.jpg';

exports.bindings = {
    exam: true,
    down: true,
    relatedExams: true
};

exports.dataForTemplate = {
    relatedExams: function() {
        var me = this,
            relatedExams = this.bindings.relatedExams.data;
        if (relatedExams) {
            _.map(relatedExams, function(e) {
                var t = e;
                if (e.coverId) {
                    t.img = me.bindings.down.getFullUrl() + '?id=' + e.coverId;
                } else {
                    t.img = remoteBackGround;
                }
                return t;
            });
        }
        return relatedExams;
    }
};
