import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Joi from 'joi-browser';
import Moment from "moment";
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as locationService from '../../../../../../services/locationService';
import * as examServices from '../../../../../../services/examServices';
import * as studentService from '../../../../../../services/studentService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as reportService from '../../../../../../services/reportService';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import BulkUpload from './BulkUpload';
import auth from '../../../../../../services/authService';
import ReactExport from "react-data-export";
import moment from "moment";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { DatePicker } from '@material-ui/pickers';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

var fileDownload = require('js-file-download');

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [newmodal, setNewModal] = useState(false)
  const [viewmodal, setViewModal] = useState(false)
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({})
  const [studname, setStudName] = useState('');
  const [studlname, setStudLName] = useState('');
  const [studfname, setFName] = useState('');
  const [studpass, setPass] = useState('');
  const [studregno, setRegno] = useState('');
  const [studemail, setEmail] = useState('');
  const [ipaddress, setIp] = useState('');
  const [studmobile, setMobile] = useState('');
  const [mobotp, setOtp] = useState('');
  const [studgender, setGender] = useState('');
  const [pincode, setPincode] = useState('');
  const [studdate, setDate] = useState('');
  const [studstatus, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [studrows, setStudrows] = useState([]);
  const [selectedStud, setSelectedstud] = useState({ "stud_id": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [studitems, setStudItems] = useState([]);
  const [stud_id, setStudId] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [rowsdata, setRowsData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [selectedStu, setselectedStu] = useState({});
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showBulkUploadBtn, setShowBulkUploadBtn] = useState(false);
  const [categoryitems, setCategoryItems] = useState([]);
  const [mainCategoryitems, setMainCategoryItems] = useState([]);
  const [subCategoryitems, setSubCategoryItems] = useState([]);
  const [masterCategoryId, setMasterCategoryId] = useState('');
  const [mainCategoryId, setMainCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [ipaddr, setIpAddr] = useState('');
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');
  const publicIp = require('public-ip');
  const [reporttype, setReporttype] = useState('');
  const [periodtype, setPeriodtype] = useState('');
  const [showOverall, setShowoverall] = useState(false);
  const [showMaincat, setShowmaincat] = useState(false);
  const [showTestcat, setShowtestcat] = useState(false);
  const [showOverallmain, setShowoverallmain] = useState(false);
  const [startDate, setStartdate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [endDate, setEnddate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [studentStartDate, setStudentStartdate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [studentEndDate, setStudentEnddate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [showStudentReport, setShowStudentReport] = useState(false);
  const [studentReportData, setStudentReportData] = useState([]);

  const [qcCategoryItems, setQCCategoryItems] = useState([]);
  const [qcSubCategoryItems, setQCSubCategoryItems] = useState([]);
  const [scMainCayegory, setSCMainCayegory] = useState('');
  const [qcMainCayegory, setQCMainCayegory] = useState('');
  const [qcSubCayegory, setQCSubCayegory] = useState('');
  const [user, setUser] = useState({});

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Main Category',
      field: 'maincategory',
      width: 100,
    },
    {
      label: 'Sub Category',
      field: 'subcategory',
      width: 100,
    },
    {
      label: 'Subcategory code',
      field: 'subcategorycode',
      width: 50,
    },
    {
      label: 'Total Questions uploaded',
      field: 'uploaded',
      width: 50,
    },
    {
      label: 'Total Questions waiting',
      field: 'waiting',
      width: 50,
    },
    {
      label: 'Total Questions active',
      field: 'active',
      width: 50,
    },
    {
      label: 'Total Questions inactive',
      field: 'inactive',
      width: 5,
    },
  ]
  const columns2 = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Main Category',
      field: 'categoryname',
      width: 100,
    },
    {
      label: 'Total Questions uploaded',
      field: 'total',
      width: 50,
    },
    {
      label: 'Total Questions waiting',
      field: 'waiting',
      width: 50,
    },
    {
      label: 'Total Questions active',
      field: 'active',
      width: 50,
    },
    {
      label: 'Total Questions inactive',
      field: 'inactive',
      width: 5,
    },
  ]
  const columns3 = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Master Category',
      field: 'mastercategory',
      width: 100,
    },
    {
      label: 'Main Category',
      field: 'maincategory',
      width: 50,
    },
    {
      label: 'Sub Category',
      field: 'subcategory',
      width: 50,
    },
    {
      label: 'Exam name',
      field: 'examname',
      width: 50,
    },
    {
      label: 'Exam code',
      field: 'examcode',
      width: 50,
    },
    {
      label: 'Exam Type',
      field: 'examtypename',
      width: 50,
    },
    {
      label: 'No.of Questions',
      field: 'examques',
      width: 5,
    },
    {
      label: 'Test generated by',
      field: 'staffname',
      width: 50,
    },
    {
      label: 'Exam date and Time',
      field: 'examdateList',
      width: 50,
    },
  ]
  const columns4 = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Master Category',
      field: 'mastercategory',
      width: 100,
    },
    {
      label: 'Main Category',
      field: 'maincategory',
      width: 100,
    },
    {
      label: 'Sub Category',
      field: 'subcategory',
      width: 100,
    },
    {
      label: 'Total Questions assigned',
      field: 'totalquestions',
      width: 50,
    },
    {
      label: 'No.of topic wise tests',
      field: 'topicwisereports',
      width: 50,
    },
    {
      label: 'No.of full tests',
      field: 'fulltests',
      width: 50,
    },
    {
      label: 'No.of sectional subject tests',
      field: 'secsubject',
      width: 5,
    },
    {
      label: 'No.of sectional timing tests',
      field: 'sectiming',
      width: 5,
    },
  ]

  const studentReportColumns = [
    {
      label: 'Student Name',
      field: 'studentName',
      width: 100,
    },
    {
      label: 'Student Email',
      field: 'studentEmail',
      width: 100,
    },
    {
      label: 'Student Mobile No',
      field: 'studentMobileNumber',
      width: 100,
    },
    {
      label: 'Exam',
      field: 'examName',
      width: 50,
    },
    {
      label: 'Total Questions',
      field: 'totalQuestion',
      width: 50,
    },
    {
      label: 'Total Attend Question',
      field: 'totalAttendQuestion',
      width: 50,
    },
    {
      label: 'Total Not Attend Question',
      field: 'totalNotAttendQuestion',
      width: 5,
    },
    {
      label: 'Total Correct Answer',
      field: 'totalCrtAnswer',
      width: 5,
    },
    {
      label: 'Total Wrong Answer',
      field: 'totalWrongAnswer',
      width: 5,
    },
    {
      label: 'Total Mark',
      field: 'totalMark',
      width: 5,
    },
  ]


  const dataSet1 = [
    {
      stud_regno: "",
      stud_fname: "",
      stud_lname: "",
      stud_mobile: "",
      stud_email: "",
      stud_gender: ""
    }
  ];


  const handleStudChange = (event, value) => {
    setStudId(event.target.value);
  }
  const handleCountryChange = (event, value) => {
    setGender(event.target.value);
  }
  const handleRefresh = async () => {
    setLoader(true);
    //let ip = await publicIp.v4();
    //setIpAddr(ip);
    setSelectAll(false);
    const { data: res } = await studentService.getAllActiveStudent('Y');
    const { Student: Studentss } = res;
    setActiveCount(Studentss.length);
    setData(Studentss);
    setRowsData(Studentss);

    const { data: Studentresult } = await studentService.getAllActiveStudent('N');
    const { Student: Studentses } = Studentresult;
    const { count: inactivecount } = Studentresult;
    setInactiveCount(inactivecount);
    let itemArr = [];
    for (let Student of Studentses) {
      itemArr.push(<MenuItem value={Student.stud_id}>{Student.stud_name}</MenuItem>)
    }
    setStudItems(itemArr);
    let user = auth.getCurrentUser();
    setUser(user);
    if (user.user.logintype === 'I') {
      setShowBulkUploadBtn(true);
    }

    let { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    let { category: categories } = maincategoryres;
    if(user && user.user && user.user.master_category_id && (user.user.op_type === "S" || user.user.op_type === "C")){
      let master_category_id_arr = user.user.master_category_id.includes(',') ? user.user.master_category_id.split(',') : [user.user.master_category_id];
      categories = categories.filter( s => master_category_id_arr.indexOf(String(s.exa_cat_id)) >= 0);
    }else if(user && user.user && !user.user.master_category_id && (user.user.op_type === "S" || user.user.op_type === "C")){
      categories = [];
    }
    setCategoryItems(categories);

    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const schema = {
    RegNo: Joi.string().required(),
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    Email: Joi.string().required().regex(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g),
    IPAddress: Joi.string().required(),
    Mobile: Joi.string().required(),
  }

  useEffect(() => {
    if (reporttype === 'overall')
      mapRows(data);
    else if (reporttype === 'maincat')
      mapRows2(data);
    else if (reporttype === 'test')
      mapRows3(data);
    else if (reporttype === 'overallmain')
      mapRows4(data);
  }, [data])

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])


  let rowcount = 0;
  const mapRows = (rows) => {
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))
    let studrows = rows.map((obj, index) => {
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.uploaded = <div style={{ textAlign: 'center' }}>{row.uploaded}</div>
      row.waiting = <div style={{ textAlign: 'center' }}>{row.waiting}</div>
      row.active = <div style={{ textAlign: 'center' }}>{row.active}</div>
      row.inactive = <div style={{ textAlign: 'center' }}>{row.inactive}</div>
      return row;
    })
    setStudrows(studrows);
  }

  const mapRows2 = (rows) => {
    let rowFields = []// fields in required order
    columns2.forEach(column => rowFields.push(column.field))
    let studrows = rows.map((obj, index) => {
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.total = <div style={{ textAlign: 'center' }}>{row.total}</div>
      row.waiting = <div style={{ textAlign: 'center' }}>{row.waiting}</div>
      row.active = <div style={{ textAlign: 'center' }}>{row.active}</div>
      row.inactive = <div style={{ textAlign: 'center' }}>{row.inactive}</div>
      return row;
    });
    setStudrows(studrows);
  }

  const mapRows3 = (rows) => {
    let rowFields = []// fields in required order
    columns3.forEach(column => rowFields.push(column.field))
    let studrows = rows.map((obj, index) => {
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.examques = <div style={{ textAlign: 'center' }}>{row.examques}</div>
      var examtimeschedule = new Date(Date(obj.examdate)).getHours() + ':' + new Date(obj.examdate).getMinutes();
      row.examdateList = moment(new Date(obj.examdate)).format('DD-MM-yyyy') + ' ' + moment(examtimeschedule, "H:mm").format("h:mm a");
      return row;
    });
    setStudrows(studrows);
  }

  const mapRows4 = (rows) => {
    let rowFields = []// fields in required order
    columns4.forEach(column => rowFields.push(column.field))
    let studrows = rows.map((obj, index) => {
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.totalquestions = <div style={{ textAlign: 'center' }}>{row.totalquestions}</div>
      row.topicwisereports = <div style={{ textAlign: 'center' }}>{row.topicwisereports}</div>
      row.fulltests = <div style={{ textAlign: 'center' }}>{row.fulltests}</div>
      row.secsubject = <div style={{ textAlign: 'center' }}>{row.secsubject}</div>
      row.sectiming = <div style={{ textAlign: 'center' }}>{row.sectiming}</div>
      return row;
    });
    setStudrows(studrows);
  }

  const valiadateProperty = (e) => {
    let { name, value, className } = e.currentTarget;
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })

    if (error)
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
    else
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"
  }

  const handleMasterCategoryChange = async (value) => {
    let { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(value);
    let { category: subCategories } = subcategoryres;
    let user = auth.getCurrentUser();
    if(user && user.user && user.user.main_category_id && (user.user.op_type === "S" || user.user.op_type === "C")){
      let main_category_id_arr = user.user.main_category_id.includes(',') ? user.user.main_category_id.split(',') : [user.user.main_category_id];
      subCategories = subCategories.filter( s => main_category_id_arr.indexOf(String(s.exa_cat_id)) >= 0);
    }
    setMainCategoryItems(subCategories);
    setMasterCategoryId(value);
    setMainCategoryId('');
    setSubCategoryId('');
  }

  const handleMainCategoryChange = async (value) => {
    let { data: subcategoryres } = await exammainCategoryService.getExamSubSubCategoryById(value);
    let { category: subCategories } = subcategoryres;
    let user = auth.getCurrentUser();
    if(user && user.user && user.user.sub_category_id && (user.user.op_type === "S" || user.user.op_type === "C")){
      let sub_category_id_arr = user.user.sub_category_id.includes(',') ? user.user.sub_category_id.split(',') : [user.user.sub_category_id];
      subCategories = subCategories.filter( s => sub_category_id_arr.indexOf(String(s.exa_cat_id)) >= 0);
    }
    setSubCategoryItems(subCategories);
    setMainCategoryId(value);
    setSubCategoryId('');
  }

  const handleSubCategoryChange = async (value) => {
    setSubCategoryId(value);
  }

  const handleSCMainCategoryChange = async (value) => {
    let result = await examServices.getQCExams();
    let finded = categoryitems.find( c => c.exa_cat_id === value );
    let qcCategory = [];
    if(result && result.data && result.data.category && result.data.category.length){
      let { category } = result.data;
      if(finded.qc_exams_id){
        qcCategory = category.filter( c => finded.qc_exams_id.split(',').map(Number).indexOf(c.exa_cat_id) >= 0 );
      }
    }
    setQCCategoryItems(qcCategory);
    setSCMainCayegory(value);
    setQCMainCayegory('');
    setQCSubCayegory('');
  }

  const handleQCMainCategoryChange = async (value) => {
    let { data: subcategoryres } = await examServices.getQCSubExams(value);
    let { subcategory: subCategories } = subcategoryres;
    setQCSubCategoryItems(subCategories);
    setQCMainCayegory(value);
    setQCSubCayegory('');
  }

  const handleQCSubCategoryChange = async (value) => {
    setQCSubCayegory(value);
  }

  const saveState = async () => {
    if (studregno && studfname && studlname && studemail && studmobile && studgender) {
      let data = {
        category_id: mainCategoryId,
        stud_fname: studfname,
        stud_lname: studlname,
        stud_regno: studregno,
        stud_email: studemail,
        stud_mobile: studmobile,
        stud_gender: studgender,
        ipaddress: ipaddr,
      }
      await studentService.createStudent(data);
      setAlertMessage('Student Added Successfully');
      await handleRefresh();
      setShowMessage(true);
      setNewModal(false);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      setAlertMessage('Please Give All Required Fields');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const editState = async () => {
    if (studregno && studfname && studlname && studemail && studmobile && studgender) {
      let data = {
        category_id: mainCategoryId,
        stud_lname: studlname,
        stud_fname: studfname,
        stud_regno: studregno,
        stud_email: studemail,
        stud_mobile: studmobile,
        stud_gender: studgender,
        ipaddress: ipaddress,
      }
      await studentService.updateStudent(data, stud_id);
      setAlertMessage('Student Updated Successfully');
      await handleRefresh();
      setShowMessage(true);
      setNewModal(false);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      setAlertMessage('Please Give All Required Fields');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const onModalClose = () => {
    setNewModal(false);
  };

  const onViewModalClose = () => {
    setViewModal(false);
  };
  const edit = {
    marginTop: '-5%',

  };
  const text = {
    marginTop: '-5px',

  };

  const searchReports = async (state) => {
    if (state) {
      // Report search api and reports view.
      if (reporttype && startDate && endDate) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          setShowMessage(true);
          setAlertMessage('Start Date should be less than or equal to End Date');
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
        else {
          const searchContent = {};
          setLoader(true);
          if (reporttype === 'overall') {
            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            const { data: activeres } = await reportService.getOverall(searchContent);
            const { qdata: quedata } = activeres;
            setData(quedata);
            setShowoverall(true);
            setShowmaincat(false);
            setShowtestcat(false);
            setShowoverallmain(false);
            setShowStudentReport(false);
          }
          else if (reporttype === 'maincat') {
            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            const { data: activeres } = await reportService.getMaincat(searchContent);
            const { data: quedata } = activeres;
            setData(quedata);
            setShowmaincat(true);
            setShowoverall(false);
            setShowtestcat(false);
            setShowoverallmain(false);
            setShowStudentReport(false);
          }
          else if (reporttype === 'test') {
            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            const { data: activeres } = await reportService.getTestcat(searchContent);
            const { qdata: quedata } = activeres;
            setData(quedata);
            setShowtestcat(true);
            setShowoverall(false);
            setShowmaincat(false);
            setShowoverallmain(false);
            setShowStudentReport(false);
          }
          else if (reporttype === 'overallmain') {
            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            const { data: activeres } = await reportService.getOverallmain(searchContent);
            const { qdata: quedata } = activeres;
            setData(quedata);
            setShowoverallmain(true);
            setShowoverall(false);
            setShowmaincat(false);
            setShowtestcat(false);
            setShowStudentReport(false);
          }
          setTimeout(() => {
            setLoader(false);
          }, 1000);
        }
      }
      else {
        setShowMessage(true);
        setAlertMessage('Select all the mandatory fields');
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    }
  }

  const searchStudentReports = async () => {
    let user = auth.getCurrentUser();
    if(masterCategoryId && mainCategoryId && subCategoryId && studentStartDate && studentEndDate ){
      if( Date.parse(studentStartDate) > Date.parse(studentEndDate) ){
        setShowMessage(true);
        setAlertMessage('Start Date should be less than or equal to End Date');
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }else{
        let data ={
          masterCategory : masterCategoryId,
          mainCategory : mainCategoryId,
          subCategory : subCategoryId,
          startDate : studentStartDate,
          endDate : studentEndDate,
          schoolId : user.user.schoolid
        }
        const result = await reportService.getSchoolReport(data);
        if(result && result.data && result.data.data && result.data.data.length){
          setStudentReportData(result.data.data);
        }else{
          setStudentReportData([]);
        }
        setShowStudentReport(true);
        setShowoverall(false);
        setShowmaincat(false);
        setShowtestcat(false);
        setShowoverallmain(false);
      }
    }else{
      setShowMessage(true);
      setAlertMessage('Select all the mandatory fields');
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const searchStudentQCReports = async () => {
    let user = auth.getCurrentUser();
    if(qcMainCayegory && qcSubCayegory && studentStartDate && studentEndDate && scMainCayegory ){
      if( Date.parse(studentStartDate) > Date.parse(studentEndDate) ){
        setShowMessage(true);
        setAlertMessage('Start Date should be less than or equal to End Date');
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }else{
        let data = {
          scMainCayegory,
          qcMainCayegory,
          qcSubCayegory,
          startDate : studentStartDate,
          endDate : studentEndDate,
          schoolId : user.user.schoolid
        };
        const result = await reportService.getSchoolQCReport(data);
        if(result && result.data && result.data.data && result.data.data.length){
          setStudentReportData(result.data.data);
        }else{
          setStudentReportData([]);
        }
        setShowStudentReport(true);
        setShowoverall(false);
        setShowmaincat(false);
        setShowtestcat(false);
        setShowoverallmain(false);
      }
    }else{
      setShowMessage(true);
      setAlertMessage('Select all the mandatory fields');
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const downloadReport = async () => {
    let user = auth.getCurrentUser();
    if(masterCategoryId && mainCategoryId && subCategoryId && studentStartDate && studentEndDate ){
      if( Date.parse(studentStartDate) > Date.parse(studentEndDate) ){
        setShowMessage(true);
        setAlertMessage('Start Date should be less than or equal to End Date');
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }else{
        let data ={
          masterCategory : masterCategoryId,
          mainCategory : mainCategoryId,
          subCategory : subCategoryId,
          startDate : studentStartDate,
          endDate : studentEndDate,
          schoolId : user.user.schoolid,
          isExcel : true
        }
        const result = await reportService.downloadReport(data);
        fileDownload(result, 'Report.xls');
        setShowStudentReport(true);
        setShowoverall(false);
        setShowmaincat(false);
        setShowtestcat(false);
        setShowoverallmain(false);
      }
    }else{
      setShowMessage(true);
      setAlertMessage('Select all the mandatory fields');
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const downloadQCReport = async () => {
    let user = auth.getCurrentUser();
    if(qcMainCayegory && qcSubCayegory && studentStartDate && studentEndDate && scMainCayegory ){
      if( Date.parse(studentStartDate) > Date.parse(studentEndDate) ){
        setShowMessage(true);
        setAlertMessage('Start Date should be less than or equal to End Date');
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }else{
        let data ={
          scMainCayegory,
          qcMainCayegory,
          qcSubCayegory,
          startDate : studentStartDate,
          endDate : studentEndDate,
          schoolId : user.user.schoolid,
          isExcel : true
        }
        const result = await reportService.downloadQCReport(data);
        fileDownload(result, 'Report.xls');
        setShowStudentReport(true);
        setShowoverall(false);
        setShowmaincat(false);
        setShowtestcat(false);
        setShowoverallmain(false);
      }
    }else{
      setShowMessage(true);
      setAlertMessage('Select all the mandatory fields');
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const handleFromDateChange = (date) => {
    let fromdate = Moment(date).format('YYYY-MM-DD');
    setStartdate(fromdate);
  }

  const handleEndDateChange = (date) => {
    let todate = Moment(date).format('YYYY-MM-DD');
    setEnddate(todate);
  }

  const handleStudentFromDateChange = (date) => {
    let fromdate = Moment(date).format('YYYY-MM-DD');
    setStudentStartdate(fromdate);
  }

  const handleStudentEndDateChange = (date) => {
    let todate = Moment(date).format('YYYY-MM-DD');
    setStudentEnddate(todate);
  }

  const PDFview = async (state) => {
    if (state) {
      if (reporttype && startDate && endDate) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          setAlertMessage('Enter valid start and end date');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
        else {
          const searchContent = {};
          setLoader(true);

          // PDF set
          // Set PDF content.
          const doc = new jsPDF({
            orientation: "portrait"
          });

          doc.page = 1;
          doc.setFont('arial');
          doc.setFontSize(25);
          doc.setLineWidth(0.5);
          doc.rect(5, 5, 200, 287);

          doc.text(76, 15, 'Question Cloud');
          doc.setFont('times');
          var current_date = moment().format('MMM Do, YYYY');
          doc.setFontSize(11);
          doc.text(175, 10, current_date);
          doc.setFontSize(12);
          doc.text(84, 23, "(India's Widest Online Test Portal)");

          doc.setFontSize(14);
          doc.text(77, 32, 'Questions Status Report');

          var startdatedisplay = new Date(startDate);
          var dd1 = String(startdatedisplay.getDate()).padStart(2, '0');
          var mm1 = String(startdatedisplay.getMonth() + 1).padStart(2, '0');
          var yyyy1 = startdatedisplay.getFullYear();
          startdatedisplay = dd1 + '/' + mm1 + '/' + yyyy1;

          var enddatedisplay = new Date(endDate);
          var dd2 = String(enddatedisplay.getDate()).padStart(2, '0');
          var mm2 = String(enddatedisplay.getMonth() + 1).padStart(2, '0');
          var yyyy2 = enddatedisplay.getFullYear();
          enddatedisplay = dd2 + '/' + mm2 + '/' + yyyy2;

          doc.setFontSize(13);
          doc.text(75, 40, 'From ' + startdatedisplay + ' to ' + enddatedisplay);
          // Different Reports.
          if (reporttype === 'overall') {
            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            let activerespdf = await reportService.getOverallPDF(searchContent);
            fileDownload(activerespdf.data, 'Overall report.pdf');
            setLoader(false);
            return;
          }else if (reporttype === 'maincat') {
            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            let activerespdf = await reportService.getMaincatPDF(searchContent);
            fileDownload(activerespdf.data, 'Main Category report.pdf');
            setLoader(false);
            return;
          }else if (reporttype === 'test') {
            // Landscape
            const doc1 = new jsPDF({
              orientation: "landscape"
            });
            doc1.page = 1;
            doc1.setFont('arial');
            doc1.setFontSize(25);
            doc1.setLineWidth(0.5);
            //doc1.rect(5, 5, 200, 287);

            doc1.text(121, 15, 'Question Cloud');
            doc1.setFont('times');
            var current_date = moment().format('MMM Do, YYYY');
            doc1.setFontSize(11);
            doc1.text(260, 10, current_date);
            doc1.setFontSize(12);
            doc1.text(129, 23, "(India's Widest Online Test Portal)");

            doc1.setFontSize(14);
            doc1.text(122, 32, 'Tests Status Report');

            var startdatedisplay = new Date(startDate);
            var dd1 = String(startdatedisplay.getDate()).padStart(2, '0');
            var mm1 = String(startdatedisplay.getMonth() + 1).padStart(2, '0');
            var yyyy1 = startdatedisplay.getFullYear();
            startdatedisplay = dd1 + '/' + mm1 + '/' + yyyy1;

            var enddatedisplay = new Date(endDate);
            var dd2 = String(enddatedisplay.getDate()).padStart(2, '0');
            var mm2 = String(enddatedisplay.getMonth() + 1).padStart(2, '0');
            var yyyy2 = enddatedisplay.getFullYear();
            enddatedisplay = dd2 + '/' + mm2 + '/' + yyyy2;

            doc1.setFontSize(13);
            doc1.text(120, 40, 'From ' + startdatedisplay + ' to ' + enddatedisplay);

            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            let activerespdf = await reportService.getTestcatPDF(searchContent);
            fileDownload(activerespdf.data, 'Test Category report.pdf');
            setLoader(false);
            return;
          }else if (reporttype === 'overallmain') {
            // Landscape
            const doc1 = new jsPDF({
              orientation: "landscape"
            });
            doc1.page = 1;
            doc1.setFont('arial');
            doc1.setFontSize(25);
            doc1.setLineWidth(0.5);
            //doc1.rect(5, 5, 200, 287);

            doc1.text(121, 15, 'Question Cloud');
            doc1.setFont('times');
            var current_date = moment().format('MMM Do, YYYY');
            console.log(current_date);
            doc1.setFontSize(11);
            doc1.text(260, 10, current_date);
            doc1.setFontSize(12);
            doc1.text(129, 23, "(India's Widest Online Test Portal)");

            doc1.setFontSize(14);
            doc1.text(122, 32, 'Questions Status Report');

            var startdatedisplay = new Date(startDate);
            var dd1 = String(startdatedisplay.getDate()).padStart(2, '0');
            var mm1 = String(startdatedisplay.getMonth() + 1).padStart(2, '0');
            var yyyy1 = startdatedisplay.getFullYear();
            startdatedisplay = dd1 + '/' + mm1 + '/' + yyyy1;

            var enddatedisplay = new Date(endDate);
            var dd2 = String(enddatedisplay.getDate()).padStart(2, '0');
            var mm2 = String(enddatedisplay.getMonth() + 1).padStart(2, '0');
            var yyyy2 = enddatedisplay.getFullYear();
            enddatedisplay = dd2 + '/' + mm2 + '/' + yyyy2;

            doc1.setFontSize(13);
            doc1.text(120, 40, 'From ' + startdatedisplay + ' to ' + enddatedisplay);

            searchContent.period = 'all';
            searchContent.startdate = startDate;
            searchContent.enddate = endDate;
            let activerespdf = await reportService.getOverallmainPDF(searchContent);
            fileDownload(activerespdf.data, 'Overall Main Category report.pdf');
            setLoader(false);
            return;
          }
          setTimeout(() => {
            setLoader(false);
          }, 1000);
        }
      }
    }
  }

  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Reports</h2>
      </div>
      <div className="col-12" style={{ padding : 10 }}>
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {!loader &&
          <div class="jr-card">
            <div class="jr-card-body ">
              <div class="row">
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Report Type</InputLabel>
                    <Select value={reporttype} onChange={(event, value) => {
                      setReporttype(event.target.value)
                    }} >
                      <MenuItem value={'overall'}>Overall</MenuItem>
                      <MenuItem value={'maincat'}>Main Category</MenuItem>
                      <MenuItem value={'test'}>Test Category</MenuItem>
                      <MenuItem value={'overallmain'}>Overall main Category</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-4" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="From Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={startDate}
                    onChange={handleFromDateChange}
                    animateYearScrolling={false}
                    style={{ width : '100%'}}
                  />
                </div>
                <div class="col-lg-4" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="End Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={endDate}
                    onChange={handleEndDateChange}
                    animateYearScrolling={false}
                    style={{ width : '100%'}}
                  />
                </div>
                {/*
                <div class="col-lg-3" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Interval period</InputLabel>
                    <Select value={periodtype} onChange={(event, value) => periodtypeselection(event.target.value)} >
                      <MenuItem value={'overall'}>From the beginning</MenuItem>
                      <MenuItem value={'yearly'}>Yearly</MenuItem>
                      <MenuItem value={'monthly'}>Monthly</MenuItem>
                      <MenuItem value={'weekly'}>Weekly</MenuItem>
                      <MenuItem value={'last6weeks'}>Last Six weeks</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                */}
              </div>
              <div class="row" style={{justifyContent : 'center'}}>
                <div class="col-lg-2" style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button onClick={() => searchReports(true)} variant="contained" color="primary" className="jr-btn">
                    <span>Search</span>
                    <i className="zmdi zmdi-search-in-page zmdi-hc-fw" />
                  </Button>
                </div>
                <div class="col-lg-2" style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button onClick={() => PDFview(true)} variant="contained" className="jr-btn bg-primary text-white">
                    <i className="zmdi zmdi-collection-pdf zmdi-hc-fw" />
                    <span>View in PDF</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        {!loader && user && user.user &&user.user.logintype !== "G" &&
          <div class="jr-card">
            <div class="jr-card-body">
              <div class="row">
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Master Category *</InputLabel>
                    <Select value={masterCategoryId} onChange={(event) => { handleMasterCategoryChange(event.target.value)}} >
                      {categoryitems && categoryitems.length > 0 &&
                        categoryitems.map( c =>{
                          return(<MenuItem value={c.exa_cat_id}>{c.exa_cat_name}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Main Category  *</InputLabel>
                    <Select value={mainCategoryId} onChange={(event) => { handleMainCategoryChange(event.target.value)}} >
                      {mainCategoryitems && mainCategoryitems.length > 0 &&
                        mainCategoryitems.map( c =>{
                          return(<MenuItem value={c.exa_cat_id}>{c.exa_cat_name}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Sub Category *</InputLabel>
                    <Select value={subCategoryId} onChange={(event) => { handleSubCategoryChange(event.target.value)}}> 
                      {subCategoryitems && subCategoryitems.length > 0 &&
                        subCategoryitems.map( c =>{
                          return(<MenuItem value={c.exa_cat_id}>{c.exa_cat_name}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-4" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="From Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={studentStartDate}
                    onChange={handleStudentFromDateChange}
                    animateYearScrolling={false}
                    style={{ width : '100%'}}
                  />
                </div>
                <div class="col-lg-4" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="End Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={studentEndDate}
                    onChange={handleStudentEndDateChange}
                    animateYearScrolling={false}
                    style={{ width : '100%'}}
                  />
                </div>
              </div>
              <div class="row" style={{justifyContent : 'center'}}>
                <div class="col-lg-2" style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button onClick={() => searchStudentReports()} variant="contained" color="primary" className="jr-btn">
                    <span>Search</span>
                    <i className="zmdi zmdi-search-in-page zmdi-hc-fw" />
                  </Button>
                </div>
                <div class="col-lg-2" style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button onClick={() => downloadReport()} variant="contained" className="jr-btn bg-primary text-white">
                    <i className="download" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        {!loader && user && user.user &&user.user.logintype !== "G" &&
          <div class="jr-card">
            <div class="jr-card-body ">
              <div class="row">
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Class *</InputLabel>
                    <Select value={scMainCayegory} onChange={(event) => { handleSCMainCategoryChange(event.target.value)}} >
                      {categoryitems && categoryitems.length > 0 &&
                        categoryitems.map( c =>{
                          return(<MenuItem value={c.exa_cat_id}>{c.exa_cat_name}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">QC Category *</InputLabel>
                    <Select value={qcMainCayegory} onChange={(event) => { handleQCMainCategoryChange(event.target.value)}}> 
                      {qcCategoryItems && qcCategoryItems.length > 0 &&
                        qcCategoryItems.map( c =>{
                          return(<MenuItem value={c.exa_cat_id}>{c.exa_cat_name}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-4" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">QC SubCategory *</InputLabel>
                    <Select value={qcSubCayegory} onChange={(event) => { handleQCSubCategoryChange(event.target.value)}}> 
                      {qcSubCategoryItems && qcSubCategoryItems.length > 0 &&
                        qcSubCategoryItems.map( c =>{
                          return(<MenuItem value={c.exa_cat_id}>{c.exa_cat_name}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="From Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={studentStartDate}
                    onChange={handleStudentFromDateChange}
                    animateYearScrolling={false}
                    style={{ width : '100%'}}
                  />
                </div>
                <div class="col-lg-4" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="End Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={studentEndDate}
                    onChange={handleStudentEndDateChange}
                    animateYearScrolling={false}
                    style={{ width : '100%'}}
                  />
                </div>
              </div>
              <div class="row" style={{justifyContent : 'center'}}>
                <div class="col-lg-2" style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button onClick={() => searchStudentQCReports()} variant="contained" color="primary" className="jr-btn">
                    <span>Search</span>
                    <i className="zmdi zmdi-search-in-page zmdi-hc-fw" />
                  </Button>
                </div>
                <div class="col-lg-2" onClick={() => downloadQCReport()} style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button  variant="contained" className="jr-btn bg-primary text-white">
                    <i className="download" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        {!loader && showOverallmain &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[10, 20, 25, 50, 100, 1000]}
              entries={10}
              hover
              data={{ rows: studrows, columns: columns4 }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
          </div>
        }
        {!loader && showTestcat &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[10, 20, 25, 50, 100, 1000]}
              entries={10}
              hover
              data={{ rows: studrows, columns: columns3 }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
          </div>
        }
        {!loader && showMaincat &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[10, 20, 25, 50, 100, 1000]}
              entries={10}
              hover
              data={{ rows: studrows, columns: columns2 }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
          </div>
        }
        {!loader && showOverall &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[ 10, 20, 25, 50, 100, 1000 ]}
              entries={10}
              hover
              data={{ rows: studrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
            <Modal className="modal-box" backdrop={"static"} openview={onViewModalClose} isOpen={viewmodal}>
              {/* <ModalHeader className="modal-box-header bg-primary text-white">
              {isView === false ? " Operator" :
                "View "}
            </ModalHeader> */}

              <div className="row no-gutters">
                <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                  <h1>View</h1>
                </div>
                <div style={{ padding: '1%' }} className="col-lg-1 d-flex flex-column order-lg-1">
                  <Button onClick={onViewModalClose} variant="contained" color="primary" className="jr-btn">
                    <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                    <span>Back</span>
                  </Button>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Register No :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studregno}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Name:</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studfname}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Email :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{studemail}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Password :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studpass}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Mobile :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studmobile}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Mobile OTP:</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{mobotp}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Gender :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studgender}
                </div>
              </div>
              {/* <div className="row no-gutters">
                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                            <h4>Student Profile Photo :</h4>
                        </div>
                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                          
                        </div>
                    </div> */}
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Country :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {/* <div>{ contactPerson }</div> */}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>State :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {/* <div>{ totalStudents }</div> */}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>City :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {/* <div>{ totalStudents }</div> */}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Pincode :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{pincode}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Date :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{studdate}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>IpAddress :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{ipaddress}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Status :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{studstatus}</div>
                </div>
              </div>
            </Modal>

            <Modal className="modal-box" backdrop={"static"} openview={onModalClose} isOpen={newmodal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit === false ? "Add Student" :
                  "Edit Student"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1" style={edit}>
                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                      <Select onChange={(event, value) => {
                        handleMainCategoryChange(event, value)
                      }} value={mainCategoryId} >
                        {categoryitems}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id="required"
                      label={'Reg No'}
                      name={'RegNo'}
                      onChange={(event) => setRegno(event.target.value)}
                      defaultValue={studregno}
                      value={studregno}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['RegNo']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'First Name'}
                      name={'FirstName'}
                      onChange={(event) => setFName(event.target.value)}
                      defaultValue={studfname}
                      value={studfname}
                      style={text}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['FirstName']}</h6></div>
                    <TextField
                      required
                      id="required"
                      style={text}
                      label={'Last Name'}
                      name={'LastName'}
                      onChange={(event) => setStudLName(event.target.value)}
                      defaultValue={studlname}
                      value={studlname}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['LastName']}</h6></div>

                    <TextField
                      required
                      id="required"
                      label={'Email'}
                      style={text}
                      name={'Email'}
                      onChange={(event) => setEmail(event.target.value)}
                      defaultValue={studemail}
                      value={studemail}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Email']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Mobile'}
                      name={'Mobile'}
                      type="tel"
                      style={text}
                      onChange={(event) => setMobile(event.target.value)}
                      defaultValue={studmobile}
                      value={studmobile}
                      maxlength={10}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                      }}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Mobile']}</h6></div>
                    <div>
                      <RadioGroup row aria-label="position" defaultValue={studgender} name="Gender">
                        <FormControlLabel value="MALE" defaultValue={studgender} onChange={(event, value) => {
                          handleCountryChange(event, value)
                        }} control={<Radio color="primary" />} label="MALE" />
                        <FormControlLabel value="FEMALE" defaultValue={studgender} onChange={(event, value) => {
                          handleCountryChange(event, value)
                        }} control={<Radio color="primary" />} label="FEMALE" />
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              {<ModalFooter>
                {isEdit === false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveState()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editState()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div>}
              </ModalFooter>}
            </Modal>
          </div>
        }
        {!loader && showBulkUpload &&
          <BulkUpload />
        }
        {!loader && showStudentReport &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[10, 20, 25, 50, 100, 1000]}
              entries={10}
              hover
              data={{ rows: studentReportData, columns: studentReportColumns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
          </div>
        }
        <Snackbar
          className="mb-3 bg-info"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={showMessage}
          message={alertMessage}
        />
      </div>
    </>
  );
};

export default DataTable;