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
        studyTotalTime = 0;
    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        studyTotalTime = (data[0] - beginTime) / 1000;
        me.module.dispatch('updatePregress', {
            beginTime: beginTime,
            endTime: endTime,
            studyTotalTime: Math.ceil(studyTotalTime),
            completedRate: 100,
            lessonLocation: Math.ceil(studyTotalTime)
        });
    });
};
