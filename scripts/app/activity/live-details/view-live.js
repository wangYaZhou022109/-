exports.bindings = {
    gensee: true,
};

exports.dataForTemplate = {
    liveUrl: function(data) {
        var genseeInfo = data.gensee,
            httpsUrl = '',
            liveUrl = '';
        // 進行中
        if (genseeInfo.status === 2) {
            httpsUrl = genseeInfo.attendeeJoinUrl.replace('http://', 'https://');
            liveUrl = httpsUrl + '&nickName=' + encodeURIComponent(this.app.global.currentUser.name)
                + '&uid=' + encodeURIComponent(this.app.global.currentUser.id);
        // 未開始
        } else if (genseeInfo.status === 1) {
            liveUrl = 'images/gensee_1.jpg';
        // 已結束
        } else if (genseeInfo.status === 3) {
            liveUrl = 'images/gensee_3.jpg';
        }
        return liveUrl;
    },
};
