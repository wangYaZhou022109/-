var D = require('drizzlejs');

exports.bindings = {
    entity: true
};

exports.dataForTemplate = {
    entity: function() {
        return this.bindings.entity.data[0];
    },
    config: function() {
        D.assign(this.module.renderOptions.extention, { notShow: !this.module.renderOptions.extention.isShow });
        return this.module.renderOptions.extention;
    },
    inputName: function() {
        return this.module.renderOptions.inputName;
    }
};

exports.components = [{
    id: 'datetime',
    name: 'pickadate'
}];
