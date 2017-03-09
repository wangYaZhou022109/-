exports.bindings = {
    gensee: true,
};

exports.dataForTemplate = {
    liveUrl: function(data) {
        var genseeInfo = data.gensee,
            httpsUrl = '',
            liveUrl = '';
        if (genseeInfo.attendeeJoinUrl) {
            httpsUrl = genseeInfo.attendeeJoinUrl.replace('http://', 'https://');
            liveUrl = httpsUrl + '&nickName=' + encodeURIComponent(this.app.global.currentUser.name)
                + '&uid=' + encodeURIComponent(this.app.global.currentUser.id);
        }
        return liveUrl;
    },
};
