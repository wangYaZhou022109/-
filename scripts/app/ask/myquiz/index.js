exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        question: { url: '' , type: 'items' , root: 'pageable' , pageSize: 10 }
    },
    callbacks: {
        init: function() {
            var question = this.models.question;
            return this.get(question);
        }
    }
};
