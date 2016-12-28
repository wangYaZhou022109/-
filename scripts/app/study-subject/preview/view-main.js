exports.type = 'dynamic';
exports.bindings = {
    subject: false,
    styles: false,
    state: true
};

exports.getEntityModuleName = function(key) {
    return 'study-subject/detail/' + key;
};

exports.getEntity = function() {
    var subject = this.bindings.subject.data,
        styles = this.bindings.styles.data;
    return {
        subject: subject,
        styles: styles,
        state: {
            type: 'preview'
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
