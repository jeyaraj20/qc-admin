﻿import { jsPDF } from "jspdf"
var callAddFont = function () {
this.addFileToVFS('nirmala-ui-normal.ttf', font);
this.addFont('nirmala-ui-normal.ttf', 'nirmala-ui', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])