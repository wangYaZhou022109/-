var _ = require('lodash/collection');

exports.bindings = {
    trainees: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'trainees' }
}];

exports.dataForTemplate = {
    trainees: function(data) {
        var trainees = data.trainees,
            pageNum = this.bindings.trainees.getPageInfo().page;
        _.map(trainees || [], function(trainee, i) {
            var e = trainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
            if (e.organizationLevel && e.organizationLevel <= 3) {
                e.companyName = e.organizationName;
                e.organizationName = '';
            }
        });
        return trainees;
    }
};
