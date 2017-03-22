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
