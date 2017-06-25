exports.bindings = {
    gensee: true,
};

exports.dataForTemplate = {
    liveUrl: function(data) {
        var genseeInfo = data.gensee,
            httpsUrl = '',
            liveUrl = '';
        if (genseeInfo.status === 2) { // 進行中
            httpsUrl = genseeInfo.attendeeJoinUrl.replace('http://', 'https://');
            liveUrl = httpsUrl + '&nickName=' + encodeURIComponent(this.app.global.currentUser.name)
                + '&uid=' + encodeURIComponent(this.app.global.currentUser.id);
        } else if (genseeInfo.status === 3) { // 已結束
            liveUrl = 'images/gensee_3.jpg';
        } else { // 未開始
            liveUrl = 'images/gensee_1.jpg';
        }
        return liveUrl;
    },
};
