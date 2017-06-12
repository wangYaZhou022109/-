exports.type = 'dynamic';
exports.bindings = {
    subject: false,
    styles: false,
    state: true
};

exports.events = {
    'click closeWindow': 'closeWindow'
};

exports.handlers = {
    closeWindow: function() {
        window.close();
    }
};

exports.getEntityModuleName = function(key) {
    return 'study/subject/detail/' + key;
};

exports.getEntity = function() {
    var subject = this.bindings.subject.data,
        styles = this.bindings.styles.data;
    return {
        subject: subject,
        styles: styles
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
