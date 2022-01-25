// Copyright (c) 2015, Fujana Solutions - Moritz Maleck. All rights reserved.
// For licensing, see LICENSE.md

CKEDITOR.plugins.add( 'imageuploader', {
  init: function( editor ) {
    editor.config.filebrowserBrowseUrl = 'https://imageupload.questioncloud.in/';
    //editor.config.filebrowserBrowseUrl = 'http://127.0.0.1/MyAdmin/ckeditor/plugins/imageuploader/imgbrowser.php';
  }
});
