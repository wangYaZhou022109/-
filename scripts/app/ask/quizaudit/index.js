exports.items = {
    audit: 'audit'
};
exports.store = {
    models: {
        state: {},
        params: { data: { isOverdue: '1' } },
        audit: { url: '../ask-bar/questionReviewed' },
        pass: { url: '../ask-bar/pending-audit/pass' },
        // audit: {
        //     url: '../ask-bar/questionReviewed',
        //     mixin: {
        //         getData: function() {
        //            // var audit;
        //            // console.log(this.data);
        //             // _.forEach(this.data, function(d) {
        //             //     if (d.id === id) {
        //             //         audit = d;
        //             //     }
        //             // });
        //             return this.data;
        //         }
        //     }
        // },
        out: { url: '../ask-bar/pending-audit/out' },
    },
    callbacks: {
        init: function(paylaod) {
            // var au = this,
            var audit = this.models.audit;
            audit.set({ id: paylaod.id });
            return this.get(audit);
            // .then(function() {
            //     // console.log(111111111);
            //     audit = au.models.audit.getData();
            //     console.log(audit);
            //     $('.questiontitle').text(audit.question.title);
            //     $('.questioncontent').text(audit.question.content);
            //     $('.memberfullName').text(audit.member.fullName);
            //    // $('.questioncontent').text(audit.createTime);
            //     $('.topicStr').text(audit.topicStr);
            //     $('.id').val(audit.id);
            //     $('.questionId').val(audit.question.id);
            // });
        },
        pass: function(payload) {           // 审核通过
            this.models.pass.clear();
            this.models.pass.set(payload);
            return this.put(this.models.pass);
        },
        out: function(payload) {           // 审核拒绝
            this.models.out.clear();
            this.models.out.set(payload);
            return this.put(this.models.out);
        },
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.title = '提问审核';
exports.buttons = [{
    text: '拒绝',
    fn: function(data) {
        var params = data;
        params.auditStatus = 2;
        params.auditType = 1;
        return this.dispatch('out', params);
    }
}, {
    text: '通过',
    fn: function(data) {
        var params = data;
        params.auditStatus = 1;
        params.auditType = 1;
        return this.dispatch('pass', params);
    }

}];

