module.exports = {
    items: {
        advertising: 'advertising'
    },
    beforeRender: function() {
        this.dispatch('init');
    },
    store: {
        models: {
            adverts: { url: '../system/operation/advertisement/list' },
            down: { url: '../human/file/download' }
        },
        callbacks: {
            init: function() {
                this.models.adverts.params = {
                    client: 1
                };
                return this.get(this.models.adverts);
            }
        }
    }
};
