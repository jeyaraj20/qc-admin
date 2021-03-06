import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
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
import * as QueryString from "query-string"
import { useHistory } from "react-router-dom";

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

const AddEditPassage = (props) => {
  const history = useHistory();
  const [data] = useState([])
  const [loader, setLoader] = useState("block");
  const [modal, setModal] = useState(false);
  const [isEdit] = useState(false);
  const [unloader, setUnLoader] = useState("none");
  const [scriptcount, setScriptCount] = useState(0)
  const [question, setQuestion] = useState('');
  const [questionNo, setQuestionNo] = useState('');
  const [questionType, setQuestionType] = useState('T');
  const [questionTypeData] = useState('');
  const [setQuestionId] = useState('');
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
  const [viewQuesDropzone, setQuesDropzone] = useState(true);
  const [viewOpt1Img, setviewOpt1Img] = useState(false);
  const [viewOpt1Dropzone, setOpt1Dropzone] = useState(true);
  const [viewOpt2Img, setviewOpt2Img] = useState(false);
  const [viewOpt2Dropzone, setOpt2Dropzone] = useState(true);
  const [viewOpt3Img, setviewOpt3Img] = useState(false);
  const [viewOpt3Dropzone, setOpt3Dropzone] = useState(true);
  const [viewOpt4Img, setviewOpt4Img] = useState(false);
  const [viewOpt4Dropzone, setOpt4Dropzone] = useState(true);
  const [viewOpt5Img, setviewOpt5Img] = useState(false);
  const [viewOpt5Dropzone, setOpt5Dropzone] = useState(true);
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
  const [passagequestionarr, setPassageQuestionArr] = useState([]);
  const [questionrows, setQuestionrows] = useState([]);
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [maincategoryname, setMainCategoryName] = useState("");
  const [subcategoryname, setSubCategoryName] = useState("");
  const [datatype, setDataType] = useState('');
  const [passageId, setPassageId] = useState('');
  const [editPassageObj, setEditPassageObj] = useState(null);


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
    let path = "/app/questionsview/view?categoryId=" + categoryId
      + "&subcategoryId=" + subcategoryId + "&datatype=" + datatype;

    //window.open(path, "_self")

    history.push({
      pathname: "/app/questionsview/view",
      search: "?categoryId=" + categoryId
        + "&subcategoryId=" + subcategoryId + "&datatype=" + datatype
    });

  }


  const columns = [
    {
      label: 'Question',
      field: 'question',
      width: 100,
    },
    {
      label: 'View',
      field: 'view',
      width: 10,
    },
    {
      label: 'Delete',
      field: 'delete',
      width: 10,
    },
  ]

  const deletePassageQuestion = async (obj) => {
    console.log(obj, passagequestionarr);
    const { data: questdetail } = await questionService.deletePassageQuestionById(obj.passage_question_id);
    console.log(questdetail);
    handleRefresh();
    /* for (let data of passagequestionarr) {
        if (data.index === index) {
            let delindex = passagequestionarr.indexOf(data);
            passagequestionarr.splice(delindex, 1);
            mapRows(passagequestionarr);
        }
    } */

  }

  const handleRefresh = async () => {
    let catId = "";
    let subcatId = "";
    let qid = "";
    let mode = "";
    let type = "";
    let mainname = "";
    let subcatname = "";
    if (props.location.search) {
      const params = QueryString.parse(props.location.search);
      catId = params.categoryId;
      subcatId = params.subcategoryId;
      qid = params.questionid;
      mode = params.mode;
      type = params.type;
      mainname = params.maincategory;
      subcatname = params.subcategory;
      setPassageId(qid);
    }

    /* let catId = localStorage.getItem('categoryId');
     let subcatId = localStorage.getItem('subcategoryId');
     let qid = localStorage.getItem('questionid');
     let mode = localStorage.getItem('mode');
     let type = localStorage.getItem('type'); */
    if (type === 'Waiting') {
      setStatus('W')
    }
    if (type === 'Active') {
      setStatus('Y')
    }
    if (type === 'Inactive') {
      setStatus('N')
    }
    setCategoryId(catId);
    setSubcategoryId(subcatId);
    setMainCategoryName(mainname);
    setSubCategoryName(subcatname);
    setDataType(type);
    var list = document.getElementById("jsforckeditor");
    if (list.hasChildNodes()) {
      list.removeChild(list.childNodes[0]);
    }
    setMode(mode);
    let ip = await publicIp.v4();
    setIpAddr(ip);
    if (mode !== 'Edit') {
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
      const { data: questdetail } = await questionService.getPassageQuestionById(qid);
      let questiondatadetail = questdetail.question[0];
      setQuestionNo(questiondatadetail.question_code)
      setQuestionId(questiondatadetail.qid);
      let user = auth.getCurrentUser();
      let questionImageDirfinal = questionImageDir;
      if (user.user.logintype !== 'G') {
        questionImageDirfinal = schoolquestionImageDir;
      }

      if (questiondatadetail.q_type === 'I') {
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
      if (questiondatadetail.opt_type1 === 'I') {
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
      if (questiondatadetail.opt_type2 === 'I') {
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
      if (questiondatadetail.opt_type3 === 'I') {
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
      if (questiondatadetail.opt_type4 === 'I') {
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
      if (questiondatadetail.opt_type5 === 'I') {
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
      setQuestionDesc(questdetail.question[0].quest_desc);
      setQuestionType(questdetail.question[0].q_type);
      setOption1Type(questdetail.question[0].opt_type1);
      setOption2Type(questdetail.question[0].opt_type2);
      setOption3Type(questdetail.question[0].opt_type3);
      setOption4Type(questdetail.question[0].opt_type4);
      setOption5Type(questdetail.question[0].opt_type5);
      setCorrectAnswer(questdetail.question[0].crt_ans);
      setDifficultyLevel((questdetail.question[0].quest_level).toString());
      setCkeditorFlag(true);

      console.log(questdetail.question[0].quest_level)
      let tempArr = [];
      for (let i = 0; i < questdetail.question.length; i++) {
        let passageobj = {};
        passageobj.index = i;
        passageobj.passage_question_id = questdetail.question[i].passage_question_id;
        passageobj.question_ref_id = questdetail.question[i].question_ref_id;
        passageobj.q_type = questdetail.question[i].passage_q_type;
        passageobj.question = questdetail.question[i].passage_question;
        passageobj.quest_desc = questdetail.question[i].passage_quest_desc;
        passageobj.opt_type1 = questdetail.question[i].passage_opt_type1;
        passageobj.opt_1 = questdetail.question[i].passage_opt_1;
        passageobj.opt_type2 = questdetail.question[i].passage_opt_type2;
        passageobj.opt_2 = questdetail.question[i].passage_opt_2;
        passageobj.opt_type3 = questdetail.question[i].passage_opt_type3;
        passageobj.opt_3 = questdetail.question[i].passage_opt_3;
        passageobj.opt_type4 = questdetail.question[i].passage_opt_type4;
        passageobj.opt_4 = questdetail.question[i].passage_opt_4;
        passageobj.opt_type5 = questdetail.question[i].passage_opt_type5;
        passageobj.opt_5 = questdetail.question[i].passage_opt_5;
        passageobj.crt_ans = questdetail.question[i].passage_crt_ans;
        passageobj.quest_pos = questdetail.question[i].passage_quest_pos;
        tempArr.push(passageobj);
      }
      setPassageQuestionArr(tempArr);
      mapRows(tempArr);
    }
  }

  const onModalClose = () => {
    setModal(false);
  };

  useEffect(() => {
    if (data && data.length || data.length === 0)
      mapRows(data);
  }, [data])

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (questionTypeData === 'I') {
      //loadCkeditorfuncion()
    }
  }, [questionTypeData])

  let rowcount = 0;
  const mapRows = (rows) => {
    console.log(rows);
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))

    let quesrows = rows.map((obj, index) => {
      console.log(obj);
      let row = {}
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      if (obj.q_type === 'I') {
        row.question = "Image Question"
      } else {
        let questionvalue = entities.decode(obj.question);
        row.question = <div dangerouslySetInnerHTML={{ __html: questionvalue }}></div>
      }

      row.view = (
        <IconButton onClick={() => showAddPassageQuestion(obj)} className="icon-btn">
          <i className="zmdi zmdi-eye zmdi-hc-fw" />
        </IconButton>
      );

      row.delete = (
        <IconButton onClick={() => deletePassageQuestion(obj)} className="icon-btn">
          <i className="zmdi zmdi-delete zmdi-hc-fw" />
        </IconButton>
      );

      return row;
    })
    setQuestionrows(quesrows);
  }


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
    if (e.target.value === 'I') {
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
    if (e.target.value === 'I') {
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
    if (e.target.value === 'I') {
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
    if (e.target.value === 'I') {
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
    if (e.target.value === 'I') {
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
    if (e.target.value === 'I') {
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
    const re = /^[0-9\b]+$/;
    if ( re.test(e.target.value) && Number(e.target.value) <= 5) {
      setCorrectAnswer(e.target.value);
    }else if(e.target.value === ''){
      setCorrectAnswer('');
    }
  };

  const onDescriptionchange = (e) => {
    setQuestionDesc(e.target.value);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      if (opt === 'question') {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewQuesImg(true);
        setQuesDropzone(false);
      }
      if (opt === 'opt1') {
        console.log(acceptedFiles);
        setOpt1Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt1Img(true);
        setOpt1Dropzone(false);
      }
      if (opt === 'opt2') {
        setOpt2Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt2Img(true);
        setOpt2Dropzone(false);
      }
      if (opt === 'opt3') {
        setOpt3Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt3Img(true);
        setOpt3Dropzone(false);
      }
      if (opt === 'opt4') {
        setOpt4Files(acceptedFiles.map(file => Object.assign(file, {
          preview: window.webkitURL.createObjectURL(file)
        })));
        setviewOpt4Img(true);
        setOpt4Dropzone(false);
      }
      if (opt === 'opt5') {
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

    if (type === 'question') {
      setviewQuesImg(false);
      setQuesDropzone(true);
    }
    if (type === 'opt1') {
      setviewOpt1Img(false);
      setOpt1Dropzone(true);
    }
    if (type === 'opt2') {
      setviewOpt2Img(false);
      setOpt2Dropzone(true);
    }
    if (type === 'opt3') {
      setviewOpt3Img(false);
      setOpt3Dropzone(true);
    }
    if (type === 'opt4') {
      setviewOpt4Img(false);
      setOpt4Dropzone(true);
    }
    if (type === 'opt5') {
      setviewOpt5Img(false);
      setOpt5Dropzone(true);
    }
  }

  const showAddPassageQuestion = (data) => {
    setModal(true);
    if (data) {
      console.log(data);
      setEditPassageObj(data);
      setQuestionType(data.q_type);
      setQuestionDesc(data.quest_desc);
      setQuestion(data.question);
      setOption1Type('T');
      setOption2Type('T');
      setOption3Type('T');
      setOption4Type('T');
      setOption5Type('T');
      setOption1(data.opt_1);
      setOption2(data.opt_2);
      setOption3(data.opt_3);
      setOption4(data.opt_4);
      setOption5(data.opt_5);
      setCorrectAnswer(data.crt_ans);
    } else {
      setQuestionType('T');
      setQuestionDesc('');
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
      setCorrectAnswer('');
    }
    loadCkeditorPassage()
  }

  const editQuestion = (open, data) => {
    console.log(data);
  }

  const saveQuestion = async () => {
    try {
      console.log(editPassageObj);
      let passageobj = {};
      passageobj.q_type = questionType;
      if (questionType === 'I') {
        console.log(files[0]);
        if (files[0] !== undefined) {
          passageobj.question = files[0];
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
        if (window.getPassageQuestionvalue() != '') {
          let questionvalue = window.getPassageQuestionvalue();
          questionvalue = entities.encode(questionvalue);
          passageobj.question = questionvalue;
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
      passageobj.quest_desc = questionDesc;
      passageobj.opt_type1 = option1Type;
      if (option1Type === 'I') {
        if (opt1files[0] !== undefined) {
          passageobj.opt_1 = opt1files[0];
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
          passageobj.opt_1 = opt1value;
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
      passageobj.opt_type2 = option2Type;
      if (option2Type === 'I') {
        if (opt2files[0] !== undefined) {
          passageobj.opt_2 = opt2files[0];
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
          passageobj.opt_2 = opt2value;
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
      passageobj.opt_type3 = option3Type;
      if (option3Type === 'I') {
        if (opt3files[0] !== undefined) {
          passageobj.opt_3 = opt3files[0];
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
          passageobj.opt_3 = opt3value;
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
      passageobj.opt_type4 = option4Type;
      if (option4Type === 'I') {
        if (opt4files[0] !== undefined) {
          passageobj.opt_4 = opt4files[0];
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
        if (window.getOption4value() !== '') {
          let opt4value = window.getOption4value();
          opt4value = entities.encode(opt4value);
          passageobj.opt_4 = opt4value;
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
      passageobj.opt_type5 = option5Type;
      if (option5Type === 'I') {
        passageobj.opt_5 = opt5files[0];
      } else {
        let opt5value = window.getOption5value();
        opt5value = entities.encode(opt5value);
        passageobj.opt_5 = opt5value;
      }
      if (correctAnswer !== '') {
        passageobj.crt_ans = correctAnswer;
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
      passageobj.index = editPassageObj.index;
      passageobj.quest_pos = 0;
      passageobj.quest_ipaddr = ipaddr;
      passageobj.question_ref_id = editPassageObj.question_ref_id;
      passageobj.quest_pos = editPassageObj.quest_pos;
      passageobj.passage_question_id = editPassageObj.passage_question_id;
      console.log(passageobj);

      let position = passagequestionarr.findIndex(x => x.index === editPassageObj.index);
      passagequestionarr.splice(position, 1);
      passagequestionarr.push(passageobj);
      setModal(false);
      //setData(passagequestionarr);
      mapRows(passagequestionarr);
      console.log(passagequestionarr);
    } catch (ex) {
      console.log(ex.response);
      setAlertMessage('Something went wrong. Please try later');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  }

  const savePassageQuestion = async () => {
    try {
      let passagedata = {};
      passagedata.cat_id = categoryId;
      passagedata.sub_id = subcategoryId;
      passagedata.q_type = "P";
      if (window.getQuestionvalue() !== '') {
        let questionvalue = window.getQuestionvalue();
        questionvalue = entities.encode(questionvalue);
        passagedata.question = questionvalue;
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
      passagedata.quest_desc = "";
      passagedata.opt_type1 = "";
      passagedata.opt_type2 = "";
      passagedata.opt_type3 = "";
      passagedata.opt_type4 = "";
      passagedata.opt_type5 = "";
      passagedata.opt_1 = "";
      passagedata.opt_2 = "";
      passagedata.opt_3 = "";
      passagedata.opt_4 = "";
      passagedata.opt_5 = "";
      passagedata.crt_ans = "";
      if (difficultyLevel !== '') {
        passagedata.quest_level = difficultyLevel;
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
      passagedata.quest_pos = "0";
      passagedata.quest_ipaddr = ipaddr;
      passagedata.passage_questions = passagequestionarr;
      await questionService.updatePassageQuestion(passageId, passagedata);
      setAlertMessage('Question Added Successfully');
      setShowMessage(true);
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
    if (ckeditorflag === true) {
      setLoader("none");
      setUnLoader("block");
    }
    else {
      setLoader("block");
      setUnLoader("none");
    }
  }, [ckeditorflag])


  const loadCkeditorfuncion = () => {
    if (scriptcount === 0) {
      console.log("script");
      appendScript("/test.js");
      setScriptCount(scriptcount + 1);
      return (<div></div>)
    } else {
      return (<div></div>)
    }

  }

  const loadCkeditorPassage = () => {
    console.log("script");
    appendScript("/passage.js");
    //setScriptCount(scriptcount + 1);
    return (<div></div>)

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
            <div className="col-lg-12 col-sm-6 col-12">
              <TextField
                label={'Question ID'}
                value={questionNo}
                margin="normal" />
            </div>
            <div className="col-lg-10 col-sm-10 col-10">
              <h4 style={{ padding: '0.5%' }}>Add New Passage for ({maincategoryname} - {subcategoryname})</h4>
            </div>
            <div className="col-lg-2 col-sm-2 col-2">
              <Button onClick={() => navigateTo()} variant="contained" color="primary" className="jr-btn">
                <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                <span>Back</span>
              </Button>
            </div>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <h5>Passage <span style={{ color: 'red' }}>*</span></h5>
            <textarea
              value={question}
              onChange={() => window.getQuestionvalue()}
              class="ckeditor form-control  validate[required]" rows="4"
              placeholder="Question" id="questionname" name="questionname"></textarea>
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
            <Button variant="contained" onClick={() => showAddPassageQuestion('')} color="primary" className="jr-btn text-white">
              Add Questions
            </Button>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <h3>Questions</h3>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
              entries={5}
              hover
              data={{ rows: questionrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true} />
          </div>
          <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
            <Button variant="contained" onClick={() => savePassageQuestion()} color="primary" className="jr-btn text-white">
              SAVE PASSAGE
            </Button>
          </div>
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
        <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
          <ModalHeader className="modal-box-header bg-primary text-white">
            {isEdit === false ? "Add Passage Question" :
              "Edit Passage Question"}
          </ModalHeader>

          <div className="modal-box-content">
            <div className="row no-gutters">
              <div className="col-lg-12 d-flex flex-column order-lg-1">
                <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-10">
                      <h4 style={{ padding: '0.5%' }}>Add New Question for ({maincategoryname} - {subcategoryname})</h4>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-2">
                      <Button onClick={() => setModal(false)} variant="contained" color="primary" className="jr-btn">
                        <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                        <span>Back</span>
                      </Button>
                    </div>
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
                        onChange={() => window.getPassageQuestionvalue()}
                        class="ckeditor form-control  validate[required]" rows="4"
                        placeholder="Question" id="passagequestion" name="passagequestion"></textarea>

                    </div>
                    <div style={{ display: questionimagestyle }} >
                      {questionType === 'I' &&
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
                                  {screenmode === 'Edit' ? questionThumb : questionThumb}
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
                        placeholder="Option 1" id="passage_opt_1" name="passage_opt_1"></textarea>
                    </div>
                    <div style={{ display: opt1imagestyle }} >
                      {option1Type === 'I' &&
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
                                  {screenmode === 'Edit' ? opt1Thumb : opt1Thumb}
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
                        placeholder="Option 2" id="passage_opt_2" name="passage_opt_2"></textarea>
                    </div>
                    {option2Type === 'I' &&
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
                                {screenmode === 'Edit' ? opt2Thumb : opt2Thumb}
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
                        placeholder="Option 3" id="passage_opt_3" name="passage_opt_3"></textarea>
                    </div>
                    {option3Type === 'I' &&
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
                                {screenmode === 'Edit' ? opt3Thumb : opt3Thumb}
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
                        placeholder="Option 4" id="passage_opt_4" name="passage_opt_4"></textarea>
                    </div>
                    {option4Type === 'I' &&
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
                                {screenmode === 'Edit' ? opt4Thumb : opt4Thumb}
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
                        placeholder="Option 5" id="passage_opt_5" name="passage_opt_5"></textarea>
                    </div>
                    {option5Type === 'I' &&
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
                                {screenmode === 'Edit' ? opt5Thumb : opt5Thumb}
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
                    <input onChange={(e) => onCorrectAnsChange(e)} value={correctAnswer} type="text" placeholder="Correct Answer" className="form-control form-control-lg" />
                  </div>

                  <div id="jsforckeditormodal">
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
            </div>
          </div>
          <ModalFooter>
            <div className="d-flex flex-row">
              <Button onClick={() => saveQuestion()} variant="contained" color="primary" className="jr-btn text-white">Save</Button>
              <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
            </div>
          </ModalFooter>
        </Modal>
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
      </div>
    </>
  )
};

export default AddEditPassage;
