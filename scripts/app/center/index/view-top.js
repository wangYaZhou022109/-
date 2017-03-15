exports.bindings = {
    member: true,
    img: false
};

exports.events = {
    'click edit-info': 'showEditInfo'
};

exports.handlers = {
    showEditInfo: function() {
        var model = this.module.items['center/edit'];
        this.app.viewport.modal(model);
    }
};

exports.dataForTemplate = {
    member: function() {
        var member = this.bindings.member.data,
            downUrl = this.bindings.img.getFullUrl();
        member.gradeCover = member.gradeCover == null ? '' : downUrl + member.gradeCover;
        return member;
    },
    photo: function() {
        var memberDetail = this.bindings.member.data.memberDetail,
            downUrl = this.bindings.img.getFullUrl();
        if (memberDetail && memberDetail.headPortrait) {
            return downUrl + memberDetail.headPortrait;
        }
        return 'images/default-userpic.png';
    }
};
