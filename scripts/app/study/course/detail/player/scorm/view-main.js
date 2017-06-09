// var helper = require('./app/util/helpers'),
var _ = require('lodash/collection'),
    $ = require('jquery');
var rootUrl = 'http://localhost/zxy-scorm/scorm_api.jsp?';
var viewScorm;
exports.bindings = {
    scormTree: true,
    section: true,
    attachment: true
};
exports.large = true;

exports.title = function() {
    return this.bindings.section.data.name;
};


exports.components = [{
    id: 'tree',
    name: 'tree',
    options: {
        model: 'scormTree',
        textKey: 'title'
    }
}];

exports.events = {
    'change tree': 'nodeChanged'
};

exports.handlers = {
    nodeChanged: function() {
        var node = this.components.tree.getSelectedNode()[0].data;
        viewScorm.call(this, node);
    }
};
viewScorm = function(node) {
    var section = this.bindings.section.data;
    var path = this.bindings.attachment.data.path;
    var params = {},
        url = rootUrl;
    if (!node.href) return;
    params.scoUrl = 'http://localhost' + path + '/' + node.href;
    params.courseId = section.courseId;
    params.scormId = section.referenceId || section.id;
    params.scormItemId = node.id;
    params.userId = this.app.global.currentUser.id;
    // params.execute = 'preview';
    _.each(params, function(v, k) {
        url += k + '=' + v + '&';
    });
    url = url.substr(0, url.length - 1);
    this.$('frame').src = url;
};

exports.afterRender = function() {
    var trees = this.bindings.scormTree.data;
    var node;

    if (trees.length === 1) {
        node = trees[0];
        $('.content-left').remove();
        $('.content-main').css('margin-left', '0px');
    } else {
        node = this.components.tree.selectByIndex(0, 0).data;
    }
    viewScorm.call(this, node);
};

exports.beforeClose = function() {
    var callback = this.module.renderOptions.updateProgress;
    setTimeout(callback, 3000);
};
