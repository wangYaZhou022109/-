var progressBar;

exports.bindings = {
    state: false
};

exports.components = [function() {
    var me = this,
        state = me.bindings.state.data;
    return {
        id: 'viewerContainer',
        name: 'pdf',
        options: {
            url: state.pdfUrl,
            pageNum: state.pageNum,
            scale: state.scale,
            callbacks: {
                updateProgress: function(data) {
                    progressBar(me, data);
                },
                updatePage: function(data) {
                    me.module.dispatch('updatePage', {
                        pageNum: data
                    });
                }
            }
        }
    };
}];


exports.afterRender = function() {
    var viewer = this.components.viewerContainer;
    this.module.dispatch('updatePage', {
        pageCount: viewer.numPages,
        pageNum: viewer.currentPageNumber
    });
};

progressBar = function(view, loadNum) {
    var loadingText = loadNum + '%',
        loadLabel = view.$('progressLabel'),
        loadProgress = view.$('progress');
    if (loadNum < 100) {
        loadProgress.style.display = 'block';
        loadLabel.innerText = loadingText;
        loadProgress.style.width = loadingText;
    } else {
        loadLabel.style.display = 'none';
        loadProgress.style.display = 'none';
    }
};
