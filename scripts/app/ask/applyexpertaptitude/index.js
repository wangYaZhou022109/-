
exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        expertQualifications: { url: '../ask-bar/expert_qualification' }
    },
    callbacks: {
        init: function() {
            var expertQualifications = this.models.expertQualifications;
            return this.get(expertQualifications);
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};


exports.title = '专家资质';

exports.buttons = [{
    text: '同意',
    fn: function() {
        var view = this.module.items['ask/expertapply'],
            me = this;
        this.app.viewport.closeModal().then(function() {
            me.app.viewport.modal(view);
        });
        return false;
    }
}];
