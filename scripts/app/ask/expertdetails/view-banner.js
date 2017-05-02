exports.bindings = {
    expert: true,
    down: false
};


exports.dataForTemplate = {
    expert: function(data) {
        var expert = data.expert,
            url = { };
        if (typeof expert.member !== 'undefined') {
            url = expert.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                expert.member.headPortrait = 'images/default-userpic.png';
            } else {
                expert.member.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
            }
        }
        return expert;
    }
};

