exports.bindings = {
    time: false,
    state: false
};

exports.dataForTemplate = {
    url: function(data) {
        var url = data.state.section.url;
        if (!url.startsWith('http')) {
            url = '//' + url;
        }
        return url;
    }
};

exports.beforeClose = function() {
    var me = this,
        beginTime = this.bindings.time.data;
    me.module.dispatch('updatePregress', {
        sectionId: this.bindings.state.data.section.id,
        beginTime: beginTime,
        clientType: 0,
        finishStatus: 2, // 已完成
        completedRate: 100, // 已完成
    }).then(function(data) {
        me.module.renderOptions.callback(data);
    });
};
