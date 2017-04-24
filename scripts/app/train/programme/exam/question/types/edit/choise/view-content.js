var maps = require('./app/util/maps'),
    _ = require('lodash/collection');

exports.type = 'form';

exports.bindings = {
    img: true,
    state: false
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}, {
    id: 'difficulty',
    name: 'selectize'
}];

exports.dataForTemplate = {
    showDiffculty: function() {
        return this.module.renderOptions.editMode === 2;
    },
    difficultys: function(data) {
        var difficultys = maps.get('question-difficultys');
        if (data.state) {
            _.map(difficultys, function(t) {
                var obj = t;
                if (Number(obj.key) === data.state.difficulty) {
                    obj.selected = true;
                }
            });
        }
        return difficultys;
    }
};
