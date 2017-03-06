exports.bindings = {
    gensee: true,
};

exports.dataForTemplate = {
    liveUrl: function(data) {
        var genseeInfo = data.gensee,
            liveUrl = '';
        if (genseeInfo.attendeeJoinUrl) {
            liveUrl = genseeInfo.attendeeJoinUrl + '&nickName=' + encodeURIComponent(this.app.global.currentUser.name);
        }
        return liveUrl;
    },
};
