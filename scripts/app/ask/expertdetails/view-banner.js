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
            expert.member.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
        }
        return expert;
    }
};
