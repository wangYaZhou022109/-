var helpers = require('./app/util/helpers');

exports.bindings = {
    state: true,
    project: true
};

exports.actions = {
    'change month': 'changeMonth'
};

exports.events = {
    'click rule': 'showRule',
    'change arriveDate': 'changeArriveDate',
    'click book': 'book'
};

exports.handlers = {
    showRule: function() {
        var me = this,
            model = me.module.items.tips;
        me.app.viewport.modal(model, {});
    },
    changeArriveDate: function() {
        var arriveDate = this.$('arriveDate').value,
            arriveLong,
            project = this.bindings.project,
            backDateNum,
            backDate;
        backDateNum = project.data.days - 1;
        arriveLong = new Date(arriveDate);
        arriveLong.setDate(arriveLong.getDate() + backDateNum);
        backDate = helpers.date(arriveLong);
        this.$('backDate').value = backDate;
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
    }
};

exports.components = [{
    id: 'month',
    name: 'flatpickr',
    options: {
        dateFormat: 'Y-m',
        defaultDate: new Date()
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
