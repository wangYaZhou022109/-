var helpers = require('./app/util/helpers');

exports.bindings = {
    state: true,
    project: false,
    month: true,
    result: false
};

exports.actions = {

};

exports.events = {
    'change arriveDate': 'changeArriveDate',
    'click book': 'book',
    'change month': 'changeMonth'
};

exports.handlers = {
    changeArriveDate: function() {
        var arriveDate = this.$('arriveDate').value,
            arriveLong,
            project = this.bindings.project,
            result = this.bindings.result.data,
            backDateNum,
            backDate;
        backDateNum = project.data.days - 1;
        arriveLong = new Date(arriveDate);
        arriveLong.setDate(arriveLong.getDate() + backDateNum);
        backDate = helpers.date(arriveLong);
        this.$('backDate').value = backDate;
        result.arriveDate = arriveDate;
        result.returnDate = backDate;
    },
    book: function() {
        var arriveDate = this.$('arriveDate').value,
            backDate = this.$('backDate').value;
        if (arriveDate === '') {
            this.app.message.alert('请选择报道日');
            return;
        }
        if (backDate === '') {
            this.app.message.alert('请选择返程日');
            return;
        }
        this.module.renderOptions.callback(arriveDate, backDate);
        this.app.viewport.closeModal();
    },
    changeMonth: function() {
        var month = this.$('month').value,
            project = this.bindings.project.data;
        this.module.dispatch('changeMonth', { month: month, project: project });
    }
};

exports.dataForTemplate = {
    month: function() {
        var month = this.bindings.month.data;
        return month;
    }
};

exports.components = [{
    id: 'month',
    name: 'flatpickr',
    options: {
        dateFormat: 'Y-m'
    }
}, {
    id: 'arriveDate',
    name: 'flatpickr',
    options: {
        minDate: new Date()
    }
}];

exports.dataForActions = {

};

exports.actionCallbacks = {

};
