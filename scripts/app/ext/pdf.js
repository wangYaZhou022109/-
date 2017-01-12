var D = require('drizzlejs'),
    viewer = require('pdfjs-dist/web/pdf_viewer'),
    pdfViewer,
    loadViewer;

D.ComponentManager.register('pdf', function(view, el, options) {
    var opt = options || {},
        pageNum = opt.pageNum,
        scale = opt.scale || 'auto',
        container = el,
        pdfWorkerPath = '/* @echo PDF_WORKER */',
        pdfApplication;

    pdfViewer = new viewer.PDFJS.PDFViewer({
        container: container
    });

    // @ifndef PDF_WORKER
    pdfWorkerPath = 'node_modules/pdfjs-dist/build/';
    // @endif

    viewer.PDFJS.workerSrc = pdfWorkerPath + 'pdf.worker.js';

    container.addEventListener('pagesinit', function() {
        pdfViewer.currentScaleValue = scale;
    });

    container.addEventListener('pagechange', function(evt) {
        if (opt.callbacks) {
            opt.callbacks.updatePage.call(this, window.parseInt(evt.pageNumber));
        }
    });

    // 获得PDF文件
    pdfApplication = viewer.PDFJS.getDocument(opt.url);

    // 加载进度处理
    pdfApplication.onProgress = function(progressData) {
        var progressNum = (Number(progressData.loaded) / Number(progressData.total)) * 100;
        if (opt.callbacks) {
            opt.callbacks.updateProgress.call(this, window.parseInt(progressNum));
        }
    };

    // 加载
    return pdfApplication.promise.then(function(pdfDocument) {
        pdfViewer.currentPageNumber = pageNum;
        pdfViewer.setDocument(pdfDocument);
        pdfViewer.numPages = pdfDocument.numPages;
        pdfViewer.reset = function(params) {
            loadViewer(params.pageNum, params.scale);
        };
        return pdfViewer;
    });
}, function(view, comp) {
    comp;
});

loadViewer = function(pageNum, scale) {
    pdfViewer.currentPageNumber = pageNum;
    pdfViewer.currentScaleValue = scale;
};
