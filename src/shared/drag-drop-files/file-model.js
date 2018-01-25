class FileModel {
  constructor() {
    this.id = null;
    this.field = null;
    this.name = null;
    this.extension = null;
    this.isLoadedFile = null;
    this.url = null;
    this.file = null;
    this.uploaded = null;
    this.isUploading = null;
    this.uploadError = null;
  }

  initDroppedFile(file) {
    let name = file.name;
    let extension = name.substring(name.lastIndexOf('.') + 1, name.length);
    this.field = name + '_' + Math.random() * 10001;
    this.id = name + '_' + Math.random() * 10001;
    this.name = name;
    this.id = null;
    this.extension = extension.toLowerCase();
    this.url = file.preview;
    this.file = file;
    this.uploaded = false;
    this.isUploading = false;
    this.toUpload = true;
    this.uploadError = '';
    this.init=true;
    return this;
  }

  initLoadedFile(file) {
    let id = file.id;
    let name = file.name;
    let url = file.url;
    let extension;
    if(name) extension = name.substring(name.lastIndexOf('.') + 1, name.length);
    this.id = id;
    this.name = name;
    this.uploaded = true;
    this.isUploading = false;
    this.toUpload = false;
    this.init=true;
    this.url = url;
    if(extension) this.extension = extension.toLowerCase();
    return this;
  }
}

module.exports = FileModel;
