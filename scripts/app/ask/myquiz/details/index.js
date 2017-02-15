exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        details: {
            url: '../ask-bar/myquiz/myQuizDetails'
        },
        discuss: { url: '../ask-bar/myquiz/question-discuss' },
        reply: { url: '../ask-bar/myquiz/question-reply' },
        state: { data: {} }
    },
    callbacks: {
        refreshrelpy: function() {
            this.models.state.changed();
        },
        init: function(payload) {
            var question = payload.question;
            this.models.details.set(question);
        },
        questionDetails: function(payload) {
            var details = this.models.details,
                data = payload;
            details.set({ id: data.question.id });
            return this.get(details);
        },
        details: function(payload) {
            var details = this.models.details;
            details.set(payload);
            return this.get(details);
        },
        refresh: function(payload) {
            var details = this.models.details,
                data = {};
            data.id = payload[0].id;
            details.set(data);
            return this.get(details);
        },
        close: function(payload) {
            var close = this.models.details;
            close.set(payload);
            return this.del(close);
        },
        boutique: function(payload) {
            var boutique = this.models.details;
            boutique.set(payload);
            return this.save(boutique);
        },
        discuss: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        },
        discussdel: function(payload) {
            var discussdel = this.models.discuss;
            discussdel.set(payload);
            return this.del(discussdel);
        },
        discusstop: function(payload) {
            var discusstop = this.models.discuss;
            var data = payload;
            data.topsStatus = 1;
            discusstop.set(data);
            return this.post(discusstop);
        },
        discussboutique: function(payload) {
            var data = payload;
            var discussboutique = this.models.discuss;
            data.essenceStatus = 1;
            discussboutique.set(data);
            return this.post(discussboutique);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('questionDetails', this.renderOptions);
};

