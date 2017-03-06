exports.bindings = {
    region: false,
    subject: false
};

exports.dataForTemplate = {
    contentValue: function(data) {
        var textAreas = data.subject.textAreas || [{}];
        return textAreas[0].content;
    }
};
