var $ = require('jquery');

exports.bindings = {
    all: true,
    state: true,
};

exports.events = {
    'click closeTask': 'closeTask',
};

exports.handlers = {
    closeTask: function() {
        window.close();
    },
};

exports.actions = {
    'click approval': 'approval'
};

exports.dataForActions = {
    approval: function() {
        // var state = this.bindings.state.data,
        //     taskMemberId = state.id;
        // return {
        //     taskMemberId: taskMemberId,
        //     score: $(this.$('score')).val(),
        //     comment: $(this.$('comment')).val(),
        //     state: $(this.$$('[name="state"]:checked')).val(),
        // };
        var taskMemberId = this.bindings.state.data.id,
            model = this.module.items.side,
            score = $(model.$('score')).val(),
            comment = $(model.$('comment')).val(),
            state = $(model.$$('[name="state"]:checked')).val();
        return {
            taskMemberId: taskMemberId,
            score: score,
            comment: comment,
            state: state,
        };
    }
};
