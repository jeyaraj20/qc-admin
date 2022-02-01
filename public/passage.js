CKEDITOR.replace('passagequestion', {
    extraPlugins: 'eqneditor,imageuploader,ckeditor_wiris',
    height: 320
});

CKEDITOR.replace('passage_opt_1', {
    height: 320
});
CKEDITOR.replace('passage_opt_2', {
    height: 320
});
CKEDITOR.replace('passage_opt_3', {
    height: 320
});
CKEDITOR.replace('passage_opt_4', {
    height: 320
});
CKEDITOR.replace('passage_opt_5', {
    height: 320
});

if (CKEDITOR.env.ie && CKEDITOR.env.version === 8) {
    document.getElementById('ie8-warning').className = 'tip alert';
}
function getPassageQuestionvalue() {
    var desc = CKEDITOR.instances['passagequestion'].getData();
    return desc;
}
function getOption1value() {
    var desc = CKEDITOR.instances['passage_opt_1'].getData();
    return desc;
}
function getOption2value() {
    var desc = CKEDITOR.instances['passage_opt_2'].getData();
    return desc;
}
function getOption3value() {
    var desc = CKEDITOR.instances['passage_opt_3'].getData();
    return desc;
}
function getOption4value() {
    var desc = CKEDITOR.instances['passage_opt_4'].getData();
    return desc;
}
function getOption5value() {
    var desc = CKEDITOR.instances['passage_opt_5'].getData();
    return desc;
}