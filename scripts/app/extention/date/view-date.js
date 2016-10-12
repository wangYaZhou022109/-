exports.bindings = {
    entity: true
};

exports.dataForTemplate = {
    entity: function() {
        return this.bindings.entity.data[0];
    },
    config: function() {
        return this.module.renderOptions.extention;
    },
    inputName: function() {
        return this.module.renderOptions.inputName;
    }
};

exports.components = [{
    id: 'date',
    name: 'pickadate'
}];
