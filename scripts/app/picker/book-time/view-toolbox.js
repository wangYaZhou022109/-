
exports.bindings = {

};

exports.actions = {
    'change month': 'changeMonth'
};

exports.events = {
    'click rule': 'showRule',
    'click book': 'book'
};

exports.handlers = {
    showRule: function() {
        var me = this,
            model = me.module.items.tips;
        me.app.viewport.modal(model, {});
    },
    book: function() {
        var arriveDate = this.$('arriveDate').value,
            backDate = this.$('backDate').value,
            arriveDateObj,
            backDateObj;
        if (arriveDate === '') {
            this.app.message.alert('请选择报道日');
            return false;
        }
        if (backDate === '') {
            this.app.message.alert('请选择返程日');
            return false;
        }
        arriveDateObj = new Date(arriveDate);
        backDateObj = new Date(backDate);
        if (arriveDateObj.getTime() > backDateObj.getTime()) {
            this.app.message.alert('报道日不能晚于返程日');
            return false;
        }
        this.module.renderOptions.callback(arriveDate, backDate);
        this.app.viewport.closeModal();
        return true;
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
}, {
    id: 'backDate',
    name: 'flatpickr',
    options: {
        minDate: new Date()
    }
}];

exports.actionCallbacks = {

};
