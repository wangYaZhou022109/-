var D = require('drizzlejs');

exports.items = {
    side: 'side',
    'research-tips': ''
};

exports.store = {
    models: {
        researchRecord: {
            url: '../exam/research-record/get-by-research'
        }
    },
    callbacks: {
        getRecordByResearch: function(id) {
            this.models.researchRecord.clear();
            D.assign(this.models.researchRecord.params, { researchId: id });
            return this.get(this.models.researchRecord);
        }
    }
};
