var strings = require('./app/util/strings'),
    $ = require('jquery');
exports.type = 'form';
exports.buttons = [{
    text: strings.get('ok'),
    action: 'addSubmitTime'
}];

exports.dataForActions = {
    addSubmitTime: function(payload) {
        var data = payload;
        data.examRecordId = this.renderOptions.examRecordId;
        data.time = Number($(this.$$('[name="time"]')).val());
        return this.validate() ? data : false;
    }
};
