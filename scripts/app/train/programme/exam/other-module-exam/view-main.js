
// exports.type = 'form';

exports.bindings = {
    exam: true
};

exports.components = [{
    id: 'startTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'endTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}];

exports.dataForTemplate = {
    paperShowRule: function(data) {
        return {
            single: data.exam.paperShowRule === 1,
            mutiple: data.exam.paperShowRule === 2,
        };
    }
};
