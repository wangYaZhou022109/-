var $ = require('jquery');

exports.title = '两个带来';

exports.bindings = {
    twoBrings: true,
    twoBringsResult: true,
    classId: true,
};

exports.events = {
    'click close': 'close',
};

exports.handlers = {
    close: function() {
        this.app.viewport.closeModal();
    }
};

exports.actions = {
    'click commit': 'commitTwoBrings',
};

exports.dataForActions = {
    commitTwoBrings: function() {
        var classId = this.bindings.classId.data;
        return {
            classId: classId.classId,
            title1: $(this.$$('[name="title1"]')).val(),
            content1: $(this.$$('[name="content1"]')).val(),
            title2: $(this.$$('[name="title2"]')).val(),
            content2: $(this.$$('[name="content2"]')).val(),
        };
    }
};

exports.actionCallbacks = {
    commitTwoBrings: function() {
        this.app.message.success('提交成功！');
        this.app.viewport.closeModal();
    }
};

exports.dataForTemplate = {
    twoBrings: function(data) {
        var twoBrings = data.twoBrings;
        return twoBrings;
    }
};
