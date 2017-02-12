
exports.bindings = {
    projectInfo: true
};

exports.events = {
    'click bookTime': 'book'
};

exports.handlers = {
    book: function() {
        var me = this,
            model = me.module.items.toolbox;

        me.app.viewport.ground(model);
    }
};

exports.actions = {
    'click submit': 'submit'
};

exports.dataForTemplate = {
    projectInfo: function(data) {
        var d = data.projectInfo;
        d.checked = false;
        d.checked = d.classInfo.isOutside === 1;
        return d;
    }
};

exports.dataForActions = {
    submit: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {

};
