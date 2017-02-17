var helpers = require('./app/util/helpers');

exports.bindings = {
    state: true,
    project: true
};

exports.actions = {
    'change month': 'changeMonth',
    'click book': 'book'
};

exports.events = {
    'click rule': 'showRule',
    'change arriveDate': 'changeArriveDate'
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
            backDate;
        arriveLong = new Date(arriveDate);
        arriveLong.setDate(arriveLong.getDate() + project.data.days + 1);
        backDate = helpers.date(arriveLong);
        this.$('backDate').value = backDate;
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
    book: function(payload) {
        var arriveDate = payload.arriveDate,
            backDate = payload.backDate;
        if (arriveDate === '') {
            this.app.message.alert('请选择报道日');
            return false;
        }
        if (backDate === '') {
            this.app.message.alert('请选择返程日');
            return false;
        }
        return payload;
    },
};

exports.actionCallbacks = {
    book: function(data) {
        var d = data[0];
        if (d.result === 'ok') {
            this.module.renderOptions.callback(d.arriveDate, d.backDate);
            this.app.viewport.closeModal();
        } else {
            this.app.message.alert(d.message);
        }
    }
};
