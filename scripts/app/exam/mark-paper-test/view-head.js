exports.bindings = {
    state: true,
    exam: false
};

exports.dataForTemplate = {
    anonymityMark: function() {
        return Number(this.bindings.exam.data.anonymityMark) === 0;
    }
};