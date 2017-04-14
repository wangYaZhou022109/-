exports.items = {
    content: 'content'
};

exports.store = {
    models: {
        settlement: {
            url: '../train/settlement/get'
        },
        save: {
            url: '../train/settlement'
        }
    },
    callbacks: {
        settlement: function(options) { // 数据结算
            var settlement = this.models.settlement;
            settlement.params = { id: options.classId };
            return this.get(settlement);
        },
        save: function(payload) {
            var saveManage = this.models.save;
            saveManage.clear();
            saveManage.set(payload);
            return this.save(saveManage);
        },
    }
};
exports.beforeRender = function() {
    this.dispatch('settlement', { classId: this.renderOptions.state.classId });
};
