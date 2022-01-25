CKEDITOR.replace('questionname', {
    extraPlugins: 'eqneditor,imageuploader,ckeditor_wiris',
    height: 320
  });
  CKEDITOR.replace('opt_1', {
    height: 320
  });
  CKEDITOR.replace('opt_2', {
    height: 320
  });
  CKEDITOR.replace('opt_3', {
    height: 320
  });
  CKEDITOR.replace('opt_4', {
    height: 320
  });
  CKEDITOR.replace('opt_5', {
    height: 320
  });



  if (CKEDITOR.env.ie && CKEDITOR.env.version == 8) {
    document.getElementById('ie8-warning').className = 'tip alert';
  }
  function getQuestionvalue(){
    var desc = CKEDITOR.instances['questionname'].getData();
   return desc;
  }
  function getOption1value(){
    var desc = CKEDITOR.instances['opt_1'].getData();
   return desc;
  }
  function getOption2value(){
    var desc = CKEDITOR.instances['opt_2'].getData();
   return desc;
  }
  function getOption3value(){
    var desc = CKEDITOR.instances['opt_3'].getData();
   return desc;
  }
  function getOption4value(){
    var desc = CKEDITOR.instances['opt_4'].getData();
   return desc;
  }
  function getOption5value(){
    var desc = CKEDITOR.instances['opt_5'].getData();
   return desc;
  }
