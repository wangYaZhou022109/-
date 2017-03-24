var _ = require('lodash/collection');

exports.title = '相册';

exports.items = {
    pannel: 'pannel',
    upload: ''
};

exports.store = {
    models: {
        photo: {
            url: '../train/album/photo'
        },
        classPhoto: {
            url: '../train/album/photo'
        },
        deletePnoto: {
            url: '../train/album/photo'
        },
        updatePhoto: {
            url: '../train/album/update-photo'
        },
        img: {
            url: '../human/file/upload'
        },
        download: {
            url: '../human/file/download'
        },
        state: {
            data: {}
        }
    },
    callbacks: {
        init: function(options) {
            var photo = this.models.photo,
                classId = options.classId;
            this.models.state.data.classId = options.classId;
            photo.params = { classId: classId };
            this.get(photo);
        },
        addFile: function(payload) {
            var photoModel = this.models.photo,
                classPhotoModel = this.models.classPhoto,
                state = this.models.state.data,
                photos = [];
            _.forEach(payload || [], function(data) {
                var photo = data;
                photo.id = 'photo-' + new Date().getTime();
                photos.push(photo);
            });
            classPhotoModel.set({
                classId: state.classId,
                photos: JSON.stringify(photos)
            });
            return this.save(classPhotoModel).then(function(data) {
                classPhotoModel.clear();
                _.forEach(data[0] || [], function(photo) {
                    photoModel.data.push(photo);
                });
                photoModel.changed();
            });
        },
        remove: function(ids) {
            var deletePnoto = this.models.deletePnoto;
            deletePnoto.set({ ids: ids.join(',') });
            this.put(deletePnoto);
        },
        update: function(payload) {
            var updatePhoto = this.models.updatePhoto;
            updatePhoto.set(payload);
            return this.put(updatePhoto);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.state);
};
