
// exports.items = {
//     left: 'left',
//     right: 'right'
// };
// exports.store = {
//     models: {
//         leftstate: { data: { menu: 'myquiz' } },
//         rightstate: { }
//     },
//     callbacks: {
//         init: function() {
//         }
//     }
// };

// exports.afterRender = function() {
// };
exports.items = {
    left: 'left',
   // right: 'right'
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        leftstate: { data: { menu: 'myquiz' } },
        topstate: {},
        middlestate: {},
        bottomstate: {}
    },
    callbacks: {
        // refresh: function() {
        //     this.models.middlestate.changed();
        // },
        leftrefresh: function() {
            this.models.leftstate.changed();
        }
    }
};


exports.afterRender = function() {
};
