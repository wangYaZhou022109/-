exports.bindings = {
    section: true,
    sectionProgress: true,
    time: false
};

exports.dataForTemplate = {
    url: function(data) {
        var url = data.section.url;
        if (!url.startsWith('http')) {
            url = '//' + url;
        }
        return url;
    }
};

exports.beforeClose = function() {
    var me = this,
        beginTime = me.bindings.time.data,
        endTime = 0,
        studyTime = 0;
    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        studyTime = (endTime - beginTime) / 1000;
        me.module.dispatch('updatePregress', {
            beginTime: beginTime,
            commitTime: endTime,
            studyTime: Math.ceil(studyTime),
            lessonLocation: Math.ceil(studyTime)
        });
    });
};
