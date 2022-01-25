import React, { Component, useEffect, useState } from 'react';
import CKEditor from 'ckeditor4-react';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import * as questionService from '../../../../../services/questionService';
import { useDropzone } from "react-dropzone";
import Snackbar from '@material-ui/core/Snackbar';
import { questionImageDir, schoolquestionImageDir } from "../../../../../config";
import CircularProgress from '@material-ui/core/CircularProgress';
import auth from '../../../../../services/authService';
import { useHistory } from "react-router-dom";
import * as QueryString from "query-string"

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

const AddEditQuestion = (props) => {

  const history = useHistory();

  const [loader, setLoader] = useState("block");
  const [unloader, setUnLoader] = useState("none");
  const [scriptcount, setScriptCount] = useState(0)
  const [question, setQuestion] = useState('');
  const [questionNo, setQuestionNo] = useState('');
  const [questionType, setQuestionType] = useState('T');
  const [questionTypeData, setQuestionTypeData] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questionDesc, setQuestionDesc] = useState('');
  const [option1Type, setOption1Type] = useState('T');
  const [option2Type, setOption2Type] = useState('T');
  const [option3Type, setOption3Type] = useState('T');
  const [option4Type, setOption4Type] = useState('T');
  const [option5Type, setOption5Type] = useState('T');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [option5, setOption5] = useState('');
  const [files, setFiles] = useState([]);
  const [opt1files, setOpt1Files] = useState([]);
  const [opt2files, setOpt2Files] = useState([]);
  const [opt3files, setOpt3Files] = useState([]);
  const [opt4files, setOpt4Files] = useState([]);
  const [opt5files, setOpt5Files] = useState([]);
  const [viewQuesImg, setviewQuesImg] = useState(false);
  const [editQuesImg, setEditQuesImg] = useState(false);
  const [viewQuesDropzone, setQuesDropzone] = useState(true);
  const [viewOpt1Img, setviewOpt1Img] = useState(false);
  const [viewOpt1Dropzone, setOpt1Dropzone] = useState(true);
  const [editOpt1Img, setEditOpt1Img] = useState(false);
  const [viewOpt2Img, setviewOpt2Img] = useState(false);
  const [viewOpt2Dropzone, setOpt2Dropzone] = useState(true);
  const [editOpt2Img, setEditOpt2Img] = useState(false);
  const [viewOpt3Img, setviewOpt3Img] = useState(false);
  const [viewOpt3Dropzone, setOpt3Dropzone] = useState(true);
  const [editOpt3Img, setEditOpt3Img] = useState(false);
  const [viewOpt4Img, setviewOpt4Img] = useState(false);
  const [viewOpt4Dropzone, setOpt4Dropzone] = useState(true);
  const [editOpt4Img, setEditOpt4Img] = useState(false);
  const [viewOpt5Img, setviewOpt5Img] = useState(false);
  const [viewOpt5Dropzone, setOpt5Dropzone] = useState(true);
  const [editOpt5Img, setEditOpt5Img] = useState(false);
  const [opt, setOpt] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [screenmode, setMode] = useState("");
  const [ipaddr, setIpAddr] = useState('');
  const publicIp = require('public-ip');
  const [questiontextstyle, setQuestionTextStyle] = useState("block");
  const [questionimagestyle, setQuestionImageStyle] = useState("none");
  const [opt1textstyle, setOpt1TextStyle] = useState("block");
  const [opt1imagestyle, setOpt1ImageStyle] = useState("none");
  const [opt2textstyle, setOpt2TextStyle] = useState("block");
  const [opt2imagestyle, setOpt2ImageStyle] = useState("none");
  const [opt3textstyle, setOpt3TextStyle] = useState("block");
  const [opt3imagestyle, setOpt3ImageStyle] = useState("none");
  const [opt4textstyle, setOpt4TextStyle] = useState("block");
  const [opt4imagestyle, setOpt4ImageStyle] = useState("none");
  const [opt5textstyle, setOpt5TextStyle] = useState("block");
  const [opt5imagestyle, setOpt5ImageStyle] = useState("none");
  const [ckeditorflag, setCkeditorFlag] = useState(false);
  const [questiondata, setQuestionData] = useState();
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [datatype, setDataType] = useState('');
  const [txtclass, setTxtClass] = useState('');
  const [maincategoryname, setMainCategoryName] = useState("");
  const [subcategoryname, setSubCategoryName] = useState("");


  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: '100%',
    height: 150,
    padding: 4,
    boxSizing: 'border-box'
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

  const navigateTo = () => {
/*    localStorage.setItem('categoryId', categoryId);
    localStorage.setItem('subcategoryId', subcategoryId);
    if (datatype == 'Waiting') {
      localStorage.setItem('status', 'W');
      localStorage.setItem('mode', 'Waiting');
    }
    if (datatype == 'Active') {
      localStorage.setItem('status', 'Y');
      localStorage.setItem('mode', 'Active');
    }
    if (datatype == 'Inactive') {
      localStorage.setItem('status', 'N');
      localStorage.setItem('mode', 'Inactive');
    }
    
   history.push({
    pathname: "/app/questionsview/view?categoryId="+categoryId
    +"&subcategoryId="+subcategoryId+"&datatype="+datatype
});
*/
let path="/app/questionsview/view?categoryId="+categoryId
+"&subcategoryId="+subcategoryId+"&datatype="+datatype;

//window.open(path, "_self")

history.push({
  pathname: "/app/questionsview/view",
  search:"?categoryId="+categoryId
  +"&subcategoryId="+subcategoryId+"&datatype="+datatype
});

}

  const handleRefresh = async () => {
    let catId = "";
    let subcatId = "";
    let qid = "";
    let mode = "";
    let type = "";
    let mainname="";
    let subcatname="";
    if(props.location.search){
      const params = QueryString.parse(props.location.search);
      catId=params.categoryId;
      subcatId=params.subcategoryId;
      qid=params.questionid;
      mode=params.mode;
      type=params.type;
      mainname=params.maincategory;
      subcatname=params.subcategory;
      
   }

   /* let catId = localStorage.getItem('categoryId');
    let subcatId = localStorage.getItem('subcategoryId');
    let qid = localStorage.getItem('questionid');
    let mode = localStorage.getItem('mode');
    let type = localStorage.getItem('type'); */
    if (type == 'Waiting') {
      setStatus('W')
    }
    if (type == 'Active') {
      setStatus('Y')
    }
    if (type == 'Inactive') {
      setStatus('N')
    }
    setCategoryId(catId);
    setSubcategoryId(subcatId);
    setMainCategoryName(mainname);
    setSubCategoryName(subcatname);
    setDataType(type);
    console.log(qid);
    var list = document.getElementById("jsforckeditor");
    if (list.hasChildNodes()) {
      list.removeChild(list.childNodes[0]);
    }
    setMode(mode);
    let ip = await publicIp.v4();
    setIpAddr(ip);
    if (mode != 'Edit') {
      let getdata = {
        "cat_id": catId,
        "sub_id": subcatId
      }
      const { data: res } = await questionService.getQuestionId(getdata);
      console.log(res);
      const { questionNo: quesNo } = res;
      setQuestionType('T');
      setQuestion('');
      setOption1Type('T');
      setOption2Type('T');
      setOption3Type('T');
      setOption4Type('T');
      setOption5Type('T');
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setOption5("");
      setQuestionNo(quesNo);
      setCkeditorFlag(true);
    } else {
      const { data: questdetail } = await questionService.getQuestionById(qid);
      setQuestionData(questdetail.question);
      let questiondatadetail = questdetail.question;
      setQuestionNo(questiondatadetail.question_code)
      setQuestionId(questiondatadetail.qid);
      let user = auth.getCurrentUser();
      let questionImageDirfinal = questionImageDir;
      if (user.user.logintype != 'G') {
        questionImageDirfinal = schoolquestionImageDir;
      }

      if (questiondatadetail.q_type == 'I') {
        let file = {
          name: questiondatadetail.question,
          preview: questionImageDirfinal + '/' + questiondatadetail.question
        }
        let filearray = [];
        filearray.push(file);
        setFiles(filearray);
        setQuestionImageStyle("block");
        setQuestionTextStyle("none");
        setQuesDropzone(false);
        setviewQuesImg(true);
      }
      else {
        let questionvalue = entities.decode(questiondatadetail.question);
        setQuestion(questionvalue);
        setQuestionImageStyle("none");
        setQuestionTextStyle("block");
      }
      if (questiondatadetail.opt_type1 == 'I') {
        let opt1file = {
          name: questiondatadetail.opt_1,
          preview: questionImageDirfinal + '/' + questiondatadetail.opt_1
        }
        let opt1array = [];
        opt1array.push(opt1file);
        setOpt1Files(opt1array);
        setOpt1ImageStyle("block");
        setOpt1TextStyle("none");
        setOpt1Dropzone(false);
        setviewOpt1Img(true);
      }
      else {
        let option1value = entities.decode(questiondatadetail.opt_1);
        setOption1(option1value);
        setOpt1ImageStyle("none");
        setOpt1TextStyle("block");
      }
      if (questiondatadetail.opt_type2 == 'I') {
        let opt2file = {
          name: questiondatadetail.opt_2,
          preview: questionImageDirfinal + '/' + questiondatadetail.opt_2
        }
        let opt2array = [];
        opt2array.push(opt2file);
        setOpt2Files(opt2array);
        setOpt2ImageStyle("block");
        setOpt2TextStyle("none");
        setOpt2Dropzone(false);
        setviewOpt2Img(true);
      }
      else {
        let option2value = entities.decode(questiondatadetail.opt_2);
        setOption2(option2value);
        setOpt2ImageStyle("none");
        setOpt2TextStyle("block");
      }
      if (questiondatadetail.opt_type3 == 'I') {
        let opt3file = {
          name: questiondatadetail.opt_3,
          preview: questionImageDirfinal + '/' + questiondatadetail.opt_3
        }
        let opt3array = [];
        opt3array.push(opt3file);
        setOpt3Files(opt3array);
        setOpt3ImageStyle("block");
        setOpt3TextStyle("none");
        setOpt3Dropzone(false);
        setviewOpt3Img(true);
      }
      else {
        let option3value = entities.decode(questiondatadetail.opt_3);
        setOption3(option3value);
        setOpt3ImageStyle("none");
        setOpt3TextStyle("block");
      }
      if (questiondatadetail.opt_type4 == 'I') {
        let opt4file = {
          name: questiondatadetail.opt_4,
          preview: questionImageDirfinal + '/' + questiondatadetail.opt_4
        }
        let opt4array = [];
        opt4array.push(opt4file);
        setOpt4Files(opt4array);
        setOpt4ImageStyle("block");
        setOpt4TextStyle("none");
        setOpt4Dropzone(false);
        setviewOpt4Img(true);
      }
      else {
        let option4value = entities.decode(questiondatadetail.opt_4);
        setOption4(option4value);
        setOpt4ImageStyle("none");
        setOpt4TextStyle("block");
      }
      if (questiondatadetail.opt_type5 == 'I') {
        let opt5file = {
          name: questiondatadetail.opt_5,
          preview: questionImageDirfinal + '/' + questiondatadetail.opt_5
        }
        let opt5array = [];
        opt5array.push(opt5file);
        setOpt5Files(opt5array);
        setOpt5ImageStyle("block");
        setOpt5TextStyle("none");
        setOpt5Dropzone(false);
        setviewOpt5Img(true);
      }
      else {
        let option5value = entities.decode(questiondatadetail.opt_5);
        setOption5(option5value);
        setOpt5ImageStyle("none");
        setOpt5TextStyle("block");
      }
      setQuestionDesc(questiondatadetail.quest_desc);
      setQuestionType(questiondatadetail.q_type);
      setOption1Type(questiondatadetail.opt_type1);
      setOption2Type(questiondatadetail.opt_type2);
      setOption3Type(questiondatadetail.opt_type3);
      setOption4Type(questiondatadetail.opt_type4);
      setOption5Type(questiondatadetail.opt_type5);
      setCorrectAnswer(questiondatadetail.crt_ans);
      setDifficultyLevel((questiondatadetail.quest_level).toString());
      setCkeditorFlag(true);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (questionTypeData == 'I') {
      //loadCkeditorfuncion()
    }
  }, [questionTypeData])


  /*
  const onQuestionChange = (evt) => {
      const newContent = evt.editor.getData();
      console.log(newContent);
      setQuestion(newContent)
  };
  */

  const onOpt1Change = (evt) => {
    const newContent = evt.editor.getData();
    console.log(newContent);
    setOption1(newContent)
  };

  const onOpt2Change = (evt) => {
    const newContent = evt.editor.getData();
    console.log(newContent);
    setOption2(newContent)
  };

  const onOpt3Change = (evt) => {
    const newContent = evt.editor.getData();
    console.log(newContent);
    setOption3(newContent)
  };

  const onOpt4Change = (evt) => {
    const newContent = evt.editor.getData();
    console.log(newContent);
    setOption4(newContent)
  };

  const onOpt5Change = (evt) => {
    const newContent = evt.editor.getData();
    console.log(newContent);
    setOption5(newContent)
  };

  const handleQuestionType = (e, opt) => {
    setQuestionType(e.target.value);
    setOpt(opt);
    if (e.target.value == 'I') {
      setQuestionImageStyle("block");
      setQuestionTextStyle("none");
    }
    else {
      setQuestionImageStyle("none");
      setQuestionTextStyle("block");
    }
  };

  const handleOptionType1 = (e, opt) => {
    setOption1Type(e.target.value);
    setOpt(opt);
    if (e.target.value == 'I') {
      setOpt1ImageStyle("block");
      setOpt1TextStyle("none");
    }
    else {
      setOpt1ImageStyle("non3");
      setOpt1TextStyle("block");
    }
  };

  const handleOptionType2 = (e, opt) => {
    setOption2Type(e.target.value);
    setOpt(opt);
    if (e.target.value == 'I') {
      setOpt2ImageStyle("block");
      setOpt2TextStyle("none");
    }
    else {
      setOpt2ImageStyle("non3");
      setOpt2TextStyle("block");
    }
  };
  const handleOptionType3 = (e, opt) => {
    setOption3Type(e.target.value);
    setOpt(opt);
    if (e.target.value == 'I') {
      setOpt3ImageStyle("block");
      setOpt3TextStyle("none");
    }
    else {
      setOpt3ImageStyle("non3");
      setOpt3TextStyle("block");
    }
  };
  const handleOptionType4 = (e, opt) => {
    setOption4Type(e.target.value);
    setOpt(opt);
    if (e.target.value == 'I') {
      setOpt4ImageStyle("block");
      setOpt4TextStyle("none");
    }
    else {
      setOpt4ImageStyle("non3");
      setOpt4TextStyle("block");
    }
  };
  const handleOptionType5 = (e, opt) => {
    setOption5Type(e.target.value);
    setOpt(opt);
    if (e.target.value == 'I') {
      setOpt5ImageStyle("block");
      setOpt5TextStyle("none");
    }
    else {
      setOpt5ImageStyle("non3");
      setOpt5TextStyle("block");
    }
  };


  const handleDifficultyLevel = (e) => {
    setDifficultyLevel(e.target.value);
  };

  const onCorrectAnsChange = (e) => {
    setCorrectAnswer(e.target.value);
    console.log(correctAnswer);
  };

  const onDescriptionchange = (e) => {
    setQuestionDesc(e.target.value);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      if (opt == 'question') {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewQuesImg(true);
        setQuesDropzone(false);
      }
      if (opt == 'opt1') {
        console.log(acceptedFiles);
        setOpt1Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt1Img(true);
        setOpt1Dropzone(false);
      }
      if (opt == 'opt2') {
        setOpt2Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt2Img(true);
        setOpt2Dropzone(false);
      }
      if (opt == 'opt3') {
        setOpt3Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt3Img(true);
        setOpt3Dropzone(false);
      }
      if (opt == 'opt4') {
        setOpt4Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt4Img(true);
        setOpt4Dropzone(false);
      }
      if (opt == 'opt5') {
        setOpt5Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt5Img(true);
        setOpt5Dropzone(false);
      }
    }
  });

  const questionThumb = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  const opt1Thumb = opt1files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  const opt2Thumb = opt2files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  const opt3Thumb = opt3files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  const opt4Thumb = opt4files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  const opt5Thumb = opt5files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  const deleteImage = (type) => {

    if (type == 'question') {
      setviewQuesImg(false);
      setQuesDropzone(true);
    }
    if (type == 'opt1') {
      setviewOpt1Img(false);
      setOpt1Dropzone(true);
    }
    if (type == 'opt2') {
      setviewOpt2Img(false);
      setOpt2Dropzone(true);
    }
    if (type == 'opt3') {
      setviewOpt3Img(false);
      setOpt3Dropzone(true);
    }
    if (type == 'opt4') {
      setviewOpt4Img(false);
      setOpt4Dropzone(true);
    }
    if (type == 'opt5') {
      setviewOpt5Img(false);
      setOpt5Dropzone(true);
    }
  }

  const saveQuestion = async () => {
    console.log(correctAnswer);
    setLoader("block");
    setUnLoader("none");
    try {
      const formdata = new FormData();
      formdata.append("cat_id", categoryId);
      formdata.append("sub_id", subcategoryId);
      formdata.append("q_type", questionType);
      if (questionType == 'I') {
        console.log(files[0]);
        if (files[0] != undefined) {
          formdata.append("question", files[0]);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Question is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      } else {
        if (window.getQuestionvalue() != '') {
          let questionvalue = window.getQuestionvalue();
          questionvalue = entities.encode(questionvalue);
          formdata.append("question", questionvalue);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Question is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      }
      formdata.append("quest_desc", questionDesc);
      formdata.append("opt_type1", option1Type);
      if (option1Type == 'I') {
        if (opt1files[0] != undefined) {
          formdata.append("opt_1", opt1files[0]);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 1 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      } else {
        if (window.getOption1value() != '') {
          let opt1value = window.getOption1value();
          opt1value = entities.encode(opt1value);
          formdata.append("opt_1", opt1value);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 1 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      }
      formdata.append("opt_type2", option2Type);
      if (option2Type == 'I') {
        if (opt2files[0] != undefined) {
          formdata.append("opt_2", opt2files[0]);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 2 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      } else {
        if (window.getOption2value() != '') {
          let opt2value = window.getOption2value();
          opt2value = entities.encode(opt2value);
          formdata.append("opt_2", opt2value);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 2 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      }
      formdata.append("opt_type3", option3Type);
      if (option3Type == 'I') {
        if (opt3files[0] != undefined) {
          formdata.append("opt_3", opt3files[0]);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 3 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      } else {
        if (window.getOption3value() != '') {
          let opt3value = window.getOption3value();
          opt3value = entities.encode(opt3value);
          formdata.append("opt_3", opt3value);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 3 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      }
      formdata.append("opt_type4", option4Type);
      if (option4Type == 'I') {
        if (opt4files[0] != undefined) {
          formdata.append("opt_4", opt4files[0]);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 4 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      } else {
        if (window.getOption4value() != '') {
          let opt4value = window.getOption4value();
          opt4value = entities.encode(opt4value);
          formdata.append("opt_4", opt4value);
        } else {
          setLoader("none");
          setUnLoader("block");
          setAlertMessage('Option 4 is required');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 1500);
          return false;
        }
      }
      formdata.append("opt_type5", option5Type);
      if (option5Type == 'I') {
        formdata.append("opt_5", opt5files[0]);
      } else {
        let opt5value = window.getOption5value();
        opt5value = entities.encode(opt5value);
        formdata.append("opt_5", opt5value);
      }
      if (correctAnswer != '') {
        formdata.append("crt_ans", correctAnswer);
      } else {
        setLoader("none");
        setUnLoader("block");
        setAlertMessage('Correct answer is required');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 1500);
        return false;
      }
      if (difficultyLevel != '') {
        formdata.append("quest_level", difficultyLevel);
      } else {
        setLoader("none");
        setUnLoader("block");
        setAlertMessage('Level is required');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 1500);
        return false;
      }
      formdata.append("quest_pos", "0");
      formdata.append("quest_ipaddr", ipaddr);
      for (var pair of formdata.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      if (screenmode != 'Edit') {
        await questionService.saveQuestion(formdata);
        setAlertMessage('Question Added Successfully');
      }
      else {
        await questionService.updateQuestion(questionId, formdata);
        setAlertMessage('Question Updated Successfully');
      }
      setShowMessage(true);
      /*localStorage.setItem('categoryId', categoryId);
      localStorage.setItem('subcategoryId', subcategoryId);
      if (datatype == 'Waiting') {
        localStorage.setItem('status', 'W');
      }
      if (datatype == 'Active') {
        localStorage.setItem('status', 'Y');
      }
      if (datatype == 'Inactive') {
        localStorage.setItem('status', 'N');
      }
      //localStorage.setItem('status', status);
      history.push('/app/questionsview');
      */

      history.push({
        pathname: "/app/questionsview/view",
        search:"?categoryId="+categoryId
        +"&subcategoryId="+subcategoryId+"&datatype="+datatype
      });
      setTimeout(() => {
        setShowMessage(false);
        setLoader("none");
        setUnLoader("block");
      }, 1500);
    } catch (ex) {
      console.log(ex.response);
      setAlertMessage('Something went wrong. Please try later');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  }


  const handleRequestClose = () => {
    setShowMessage(false)
  };

  const appendScript = (scriptToAppend) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    document.body.appendChild(script);
  }

  const removeScript = (scriptToremove) => {
    let allsuspects = document.getElementsByTagName("script");
    for (let i = allsuspects.length; i >= 0; i--) {
      if (allsuspects[i] && allsuspects[i].getAttribute("src") !== null
        && allsuspects[i].getAttribute("src").indexOf(`${scriptToremove}`) !== -1) {
        allsuspects[i].parentNode.removeChild(allsuspects[i])
      }
    }
  }
  useEffect(() => {
    if (ckeditorflag == true) {
      setLoader("none");
      setUnLoader("block");
    }
    else {
      setLoader("block");
      setUnLoader("none");
    }
  }, [ckeditorflag])


  const loadCkeditorfuncion = () => {
    if (scriptcount == 0) {
      appendScript("/test.js");
      setScriptCount(scriptcount + 1);
      return (<div></div>)
    } else {
      return (<div></div>)
    }

  }
  return (
    <>
      <div style={{ display: loader }} >
        <div className="loader-view w-100"
          style={{ height: 'calc(100vh - 120px)' }}>
          <CircularProgress />
        </div>
      </div>
      <div style={{ display: unloader }} >
        <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
          <div className="row">
            <div className="col-lg-10 col-sm-10 col-10">
              <h4 style={{ padding: '0.5%' }}>{screenmode} Questions for ({maincategoryname } - {subcategoryname})</h4>
            </div>
            <div className="col-lg-2 col-sm-2 col-2">
              <Button onClick={() => navigateTo()} variant="contained" color="primary" className="jr-btn">
                <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                <span>Back</span>
              </Button>
            </div>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <TextField
              label={'Question ID'}
              value={questionNo}
              margin="normal" />
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Question Type</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="questiontype"
                name="questiontype"
                value={questionType}
                onChange={(e) => handleQuestionType(e, 'question')}
              >
                <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                <FormControlLabel value="I" control={<Radio color="primary" />} label="Image" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <div style={{ display: questiontextstyle }} >
              <h5>Question <span style={{ color: 'red' }}>*</span></h5>
              <textarea
                value={question}
                onChange={() => window.getQuestionvalue()}
                class="ckeditor form-control  validate[required]" rows="4"
                placeholder="Question" id="questionname" name="questionname"></textarea>

            </div>
            <div style={{ display: questionimagestyle }} >
              {questionType == 'I' &&
                <>
                  <h5>Question Image<span style={{ color: 'red' }}>*</span></h5>
                  <div className="dropzone-card">
                    {viewQuesDropzone &&
                      <div className="dropzone">
                        <div className="dropzone-file-btn" style={{ width: '100%' }} {...getRootProps({
                          onClick: event => setOpt('question')
                        }
                        )}>
                          <input {...getInputProps()} />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                      </div>
                    }
                    {viewQuesImg &&
                      <div>
                        <div className="dropzone-content" style={thumbsContainer}>
                          {screenmode == 'Edit' ? questionThumb : questionThumb}
                        </div>
                        <Button onClick={() => deleteImage('question')} variant="contained" className="jr-btn bg-danger text-white">
                          <i className="zmdi zmdi-delete zmdi-hc-fw" />
                        </Button>
                      </div>
                    }
                  </div>
                </>
              }
            </div>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <h5>Question Description</h5>
            <textarea
              id="required" className="border-1 form-control chat-textarea"
              onChange={(e) => onDescriptionchange(e)}
              value={questionDesc}
              placeholder="Question Description"
            />
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Option Type 1</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="optiontype1"
                name="optiontype1"
                value={option1Type}
                onChange={(e) => handleOptionType1(e, 'opt1')}
              >
                <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                <FormControlLabel value="I" control={<Radio color="primary" />} label="Image" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <div style={{ display: opt1textstyle }} >
              <h5>Option 1 <span style={{ color: 'red' }}>*</span></h5>
              <textarea
                value={option1}
                class="ckeditor form-control  validate[required]" rows="4"
                placeholder="Option 1" id="opt_1" name="opt_1"></textarea>
            </div>
            <div style={{ display: opt1imagestyle }} >
              {option1Type == 'I' &&
                <>
                  <h5>Image Option 1<span style={{ color: 'red' }}>*</span></h5>
                  <div className="dropzone-card">
                    {viewOpt1Dropzone &&
                      <div className="dropzone">
                        <div className='dropzone-file-btn' style={{ width: '100%' }}
                          {...getRootProps({ onClick: event => setOpt('opt1') })}>
                          <input {...getInputProps()} />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                      </div>
                    }
                    {viewOpt1Img &&
                      <div>
                        <div className="dropzone-content" style={thumbsContainer}>
                          {screenmode == 'Edit' ? opt1Thumb : opt1Thumb}
                        </div>
                        <Button onClick={() => deleteImage('opt1')} variant="contained" className="jr-btn bg-danger text-white">
                          <i className="zmdi zmdi-delete zmdi-hc-fw" />
                        </Button>
                      </div>
                    }
                  </div>
                </>
              }
            </div>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Option Type 2</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="optiontype2"
                name="optiontype2"
                value={option2Type}
                onChange={(e) => handleOptionType2(e, 'opt2')}
              >
                <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                <FormControlLabel value="I" control={<Radio color="primary" />} label="Image" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <div style={{ display: opt2textstyle }} >
              <h5>Option 2 <span style={{ color: 'red' }}>*</span></h5>
              <textarea
                value={option2}
                class="ckeditor form-control  validate[required]" rows="4"
                placeholder="Option 2" id="opt_2" name="opt_2"></textarea>
            </div>
            {option2Type == 'I' &&
              <div style={{ display: opt2imagestyle }} >
                <h5>Image Option 2<span style={{ color: 'red' }}>*</span></h5>
                <div className="dropzone-card">
                  {viewOpt2Dropzone &&
                    <div className="dropzone">
                      <div className='dropzone-file-btn' style={{ width: '100%' }} {...getRootProps({ onClick: event => setOpt('opt2') })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                      </div>
                    </div>
                  }
                  {viewOpt2Img &&
                    <div>
                      <div className="dropzone-content" style={thumbsContainer}>
                        {screenmode == 'Edit' ? opt2Thumb : opt2Thumb}
                      </div>
                      <Button onClick={() => deleteImage('opt2')} variant="contained" className="jr-btn bg-danger text-white">
                        <i className="zmdi zmdi-delete zmdi-hc-fw" />
                      </Button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Option Type 3</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="optiontype3"
                name="optiontype3"
                value={option3Type}
                onChange={(e) => handleOptionType3(e, 'opt3')}
              >
                <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                <FormControlLabel value="I" control={<Radio color="primary" />} label="Image" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <div style={{ display: opt3textstyle }} >
              <h5>Option 3 <span style={{ color: 'red' }}>*</span></h5>
              <textarea
                value={option3}
                class="ckeditor form-control  validate[required]" rows="4"
                placeholder="Option 3" id="opt_3" name="opt_3"></textarea>
            </div>
            {option3Type == 'I' &&
              <div style={{ display: opt3imagestyle }} >
                <h5>Image Option 3<span style={{ color: 'red' }}>*</span></h5>
                <div className="dropzone-card">
                  {viewOpt3Dropzone &&
                    <div className="dropzone">
                      <div className='dropzone-file-btn' style={{ width: '100%' }} {...getRootProps({ onClick: event => setOpt('opt3') })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                      </div>
                    </div>
                  }
                  {viewOpt3Img &&
                    <div>
                      <div className="dropzone-content" style={thumbsContainer}>
                        {screenmode == 'Edit' ? opt3Thumb : opt3Thumb}
                      </div>
                      <Button onClick={() => deleteImage('opt3')} variant="contained" className="jr-btn bg-danger text-white">
                        <i className="zmdi zmdi-delete zmdi-hc-fw" />
                      </Button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Option Type 4</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="questiontype"
                name="questiontype"
                value={option4Type}
                onChange={(e) => handleOptionType4(e, 'opt4')}
              >
                <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                <FormControlLabel value="I" control={<Radio color="primary" />} label="Image" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <div style={{ display: opt4textstyle }} >
              <h5>Option 4 <span style={{ color: 'red' }}>*</span></h5>
              <textarea
                value={option4}
                class="ckeditor form-control  validate[required]" rows="4"
                placeholder="Option 4" id="opt_4" name="opt_4"></textarea>
            </div>
            {option4Type == 'I' &&
              <div style={{ display: opt4imagestyle }} >
                <h5>Image Option 4<span style={{ color: 'red' }}>*</span></h5>
                <div className="dropzone-card">
                  {viewOpt4Dropzone &&
                    <div className="dropzone">
                      <div className='dropzone-file-btn' style={{ width: '100%' }} {...getRootProps({ onClick: event => setOpt('opt4') })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                      </div>
                    </div>
                  }
                  {viewOpt4Img &&
                    <div>
                      <div className="dropzone-content" style={thumbsContainer}>
                        {screenmode == 'Edit' ? opt4Thumb : opt4Thumb}
                      </div>
                      <Button onClick={() => deleteImage('opt4')} variant="contained" className="jr-btn bg-danger text-white">
                        <i className="zmdi zmdi-delete zmdi-hc-fw" />
                      </Button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Option Type 5</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="questiontype"
                name="questiontype"
                value={option5Type}
                onChange={(e) => handleOptionType5(e, 'opt5')}
              >
                <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                <FormControlLabel value="I" control={<Radio color="primary" />} label="Image" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <div style={{ display: opt5textstyle }} >
              <h5>Option 5 <span style={{ color: 'red' }}>*</span></h5>
              <textarea
                value={option5}
                class="ckeditor form-control  validate[required]" rows="4"
                placeholder="Option 5" id="opt_5" name="opt_5"></textarea>
            </div>
            {option5Type == 'I' &&
              <div style={{ display: opt5imagestyle }} >
                <h5>Image Option 5<span style={{ color: 'red' }}>*</span></h5>
                <div className="dropzone-card">
                  {viewOpt5Dropzone &&
                    <div className="dropzone">
                      <div className='dropzone-file-btn' style={{ width: '100%' }} {...getRootProps({ onClick: event => setOpt('opt5') })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                      </div>
                    </div>
                  }
                  {viewOpt5Img &&
                    <div>
                      <div className="dropzone-content" style={thumbsContainer}>
                        {screenmode == 'Edit' ? opt5Thumb : opt5Thumb}
                      </div>
                      <Button onClick={() => deleteImage('opt5')} variant="contained" className="jr-btn bg-danger text-white">
                        <i className="zmdi zmdi-delete zmdi-hc-fw" />
                      </Button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div style={{ paddingTop: '2%' }} className="col-lg-12 col-sm-6 col-12">
          {/*<input onChange={(e) => onCorrectAnsChange(e)} defaultValue={correctAnswer} type="text" placeholder="Correct Answer" className="form-control form-control-lg" />*/}
            <TextField
              autoComplete="off"
              required
              label={"Correct Answer"}
              onChange={(event) => setCorrectAnswer(event.target.value)}
              value={correctAnswer}
              defaultValue={correctAnswer}
              margin="normal"
            />
          </div>
          <div style={{ paddingTop: '2%' }} className="col-lg-12 col-sm-6 col-12">
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Difficulty Level</FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label="difficultylevel"
                name="difficultylevel"
                value={difficultyLevel}
                onChange={(e) => handleDifficultyLevel(e)}
              >
                <FormControlLabel value="1" control={<Radio color="primary" />} label="Level 1" />
                <FormControlLabel value="2" control={<Radio color="primary" />} label="Level 2" />
                <FormControlLabel value="3" control={<Radio color="primary" />} label="Level 3" />
                <FormControlLabel value="4" control={<Radio color="primary" />} label="Level 4" />
              </RadioGroup>
            </FormControl>
          </div>
          <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
            <Button onClick={() => saveQuestion()} variant="contained" color="primary" className="jr-btn text-white">
              Submit
                </Button>
          </div>
          <Snackbar
            className="mb-3 bg-info"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={showMessage}
            autoHideDuration={3000}
            onClose={() => handleRequestClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={alertMessage}
          />
          <div id="jsforckeditor">
            {ckeditorflag &&
              <>
                {
                  loadCkeditorfuncion()
                }
              </>
            }
          </div>
        </div>
      </div>
    </>
  )
};

export default AddEditQuestion;
