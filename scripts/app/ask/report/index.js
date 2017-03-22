
exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        report: { url: '../ask-bar/accuse-record/report' }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.id = payload.id;
            this.models.state.objectType = payload.objectType;
        },
        report: function(payload) {
            var report = this.models.report;
            var data = payload;
            data.id = this.models.state.id;
            data.objectType = this.models.state.objectType;
            report.set(data);
            return this.save(report).then(function() {
                this.app.message.success('举报成功！');
            });
        }

    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.title = '举报';
exports.buttons = [{
    text: '提交',
    fn: function(payload) {
        var data = payload,
            type = [];
        if (data.input1 === 'on') {
            data.type = '1,';
            type.push(1);
        }
        if (data.input2 === 'on') {
            data.type = '1,';
            type.push(2);
        }
        if (data.input3 === 'on') {
            data.type = '1,';
            type.push(3);
        }
        if (data.input4 === 'on') {
            data.type = '1,';
            type.push(4);
        }
        data.type = type.toString();
        return this.dispatch('report', data);
    }
}];

exports.small = true;
