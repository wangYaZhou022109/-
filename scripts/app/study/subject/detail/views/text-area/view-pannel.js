exports.bindings = {
    region: false,
    subject: false
};

exports.dataForTemplate = {
    contentValue: function(data) {
        var textAreas = data.subject.textAreas,
            textArea = {};
        if (textAreas && textAreas.length > 0) {
            textArea = textAreas[0];
        }
        return textArea.content;
    }
};
