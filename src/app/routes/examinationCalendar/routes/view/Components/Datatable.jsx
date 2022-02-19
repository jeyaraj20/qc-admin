import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import CardBox from "components/CardBox/index";
import { Spin } from 'antd';
import { Modal as AntdModal } from 'antd';

import {
  MDBDataTable, MDBIcon, MDBBtn, MDBInput,
  MDBCard,
  MDBCardHeader,
  MDBCardBody, MDBRow, MDBCol
} from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import * as ExaminationCalendarService from '../../../../../../services/examinationCalendarService';
import * as qbankCategoryService from '../../../../../../services/qbankCategoryService';
import * as utilService from '../../../../../../services/utilService';
import auth from '../../../../../../services/authService';

import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionsView from './QuestionsView';
import Joi from 'joi-browser';
import { Badge } from 'reactstrap';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { SdCard } from '@material-ui/icons';

const Entities = require('html-entities').XmlEntities;

var fileDownload = require('js-file-download');

const entities = new Entities();

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [category, setCategory] = useState([])
  const [modal, setModal] = useState(false)
  const [categoryName, setCategoryName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubCategoryId] = useState('');
  const [savedisabled, setSavedisabled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ "examId": [] });
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [categoryitems, setCategoryItems] = useState([]);
  const [subcategoryitems, setSubCategoryItems] = useState([]);
  const [maincategoryId, setMainCategoryId] = useState('');
  const [uniquecode, setUniqueCode] = useState('');
  const [description, setDescription] = useState('');
  const [showSubCategory, setShowSubCategory] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [errors, setErrors] = useState({})
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [searchcategoryId, setSearchCategoryId] = useState('');
  const [searchString, setSearchString] = useState('');
  const [datatype, setDataType] = useState('');
  const [txtclass, setTxtClass] = useState('');
  const [qactiveCount, setQActiveCount] = useState([]);
  const [qwaitingCount, setQWaitingCount] = useState([]);

  let selectedCatArr = [];
  let posArr = [];
  const onSelectAll = e => {
    let selected = selectedCat;
    posArr = changePositionData.values;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.exam_id)) {
        document.getElementById(row.exam_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {
          if (e.currentTarget.checked)
            row.isSelected = true;
          else
            row.isSelected = false;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.exam_id);
          selected[row.exam_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedCategory({ "examId": selectedCatArr });
          let postionObj = {};
          postionObj.examId = row.exam_id;
          postionObj.position = row.exam_pos;
          posArr.push(postionObj);
          setChangePositionData({ "values": posArr });
        } else {
          if (e.currentTarget.checked)
            row.isSelected = true;
          else
            row.isSelected = false;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] === row.exam_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          if (posArr.length != 0) {
            for (var s = 0; s < posArr.length; s++) {
              if (posArr[s].examId === row.exam_id) {
                posArr.splice(s, 1);
              }
            }
          }
          setSelectedCategory({ "examId": selectedCatArr });
          setChangePositionData({ "values": posArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedCat(selected);
      rowcount = rowcount + 1;
    }
  };

  let selectedCategoryArr = [];
  let changePosArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedCategoryArr = selectedCategory.examId;
    changePosArr = changePositionData.values;
    if (e.currentTarget.checked) {
      obj.isSelected = true;
      setMainCategoryId(obj.pid);
      setSubCategoryId(obj.exam_id);
    } else {
      obj.isSelected = false;
    }
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.exam_id)
      let postionObj = {};
      for (var i = 0; i < changePosArr.length; i++) {
        if (changePosArr[i].examId === obj.exam_id) {
          changePosArr.splice(i, 1);
        }
      }
      postionObj.examId = obj.exam_id;
      postionObj.position = obj.exam_pos;
      changePosArr.push(postionObj);
      setChangePositionData({ "values": changePosArr });
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] === obj.exam_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
      if (changePosArr.length != 0) {
        for (var s = 0; s < changePosArr.length; s++) {
          if (changePosArr[s].examId === obj.exam_id) {
            changePosArr.splice(s, 1);
          }
        }
      }
      setChangePositionData({ "values": changePosArr });
    }
    setSelectedCategory({ "examId": selectedCategoryArr });
  }

  const onPositionChange = (e, obj, index) => {
    obj.exam_pos = e.target.value
    data[index] = obj
    setData([...data])
  }

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,

    },
    {
      label: 'maincategoryId',
      field: 'exam_main_name',
      width: 100,
    },
    {
      label: 'ExamName',
      field: 'exam_name',
      width: 100,
    },
    // {
    //   label: 'Examslug',
    //   field: 'exam_slug',
    //   width: 100,
    // },
    // {
    //   label: 'NotificationDate',
    //   field: 'notification_Date',
    //   width: 50,
    // },
    // {
    //   label: 'ExaminationDate',
    //   field: 'examination_Date',
    //   width: 50,
    // },
    {
      label: 'Position',
      field: 'exam_pos',
      sort: 'asc',
      width: 10,
    },
    {
      label: 'Examination',
      field: 'exam_name',
      width: 50,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 10,
    },
    // {
    //   label: 'View in PDF',
    //   field: 'pdfList',
    //   width: 10,
    // },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 10,
    },
  ]

  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    setDataType('Active');
    setTxtClass('bg-success text-white');
    const { data: res } = await ExaminationCalendarService.getAllexamination('Y');
    const { category: categoryres } = res;
    const { subcategory: subcategoryres } = res;
    const { activequestioncount: activeres } = res;
    const { waitingquestioncount: waitingres } = res;
    let activecount = 0;
    if (subcategoryres) {
      activecount = subcategoryres.length;
    }
    setActiveCount(activecount);
    setQActiveCount(activeres);
    setQWaitingCount(waitingres);
    setCategory(categoryres);
    setData(subcategoryres);
    //const { data: inactiveres } = await ExaminationCalendarService.getAllgetAllexaminationCount('N');
    //const { count: inactivecount } = inactiveres;
   // setInactiveCount(inactivecount);
    // const { data: maincategoryres } = await qbankCategoryService.getAllQuestionMainCategoryAsc();
    // const { category: categories } = maincategoryres;
    let itemArr = [];
    // for (let category of categories) {
    //   itemArr.push(<MenuItem value={category.exam_id}>{category.exam_name}</MenuItem>)
    // }
    setCategoryItems(itemArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const valiadateProperty = (e) => {
    //console.log(schema)
    let { name, value, className } = e.currentTarget;
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })

    if (name === 'Unique')
      onCheckCodeExists(e.target.value);

    if (error)
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
    else
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"
  }
  const schema = {
    ExamName: Joi.string().required(),
    Position: Joi.number().required(),
    Slug: Joi.string().required(),
    ExamStatus: Joi.string().required(),
    ExamMainName: Joi.string().required(),
    NotificationDate: Joi.number().required(),
    ExaminationDate: Joi.number().required(),
  }

  const onCheckCodeExists = async (code) => {
    console.log(data)
    try {
      if (code != "") {
        let data = {};
        data.table = 'tbl__examinationCalendar';
        data.field = 'exam_name';
        data.value = code;
        data.uniqueId = 'exam_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'cat_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
        if (response.count > 0) {
          setSavedisabled(true);
          setErrors({ ...errors, ['Unique']: 'Code already exists', "errordetails": null })
        }
        else {
          setSavedisabled(false);
        }
      }
    } catch (err) {
      if (err) {
        setSavedisabled(false);
      }
    }
  }

  useEffect(() => {
    console.log("123",data)
  if (!data)
      mapRows(data);
  }, [data])

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])


  let rowcount = 0;
  const mapRows = (rows) => {
    //console.log("jai")
    let rowFields = []// fields in required order
   // console.log(rowFields,"jai")
    columns.forEach(column => rowFields.push(column.field))
    
    // let categoryrows = rows.map((obj, index) => {
    //   let checkedflg = false;
    //   if (obj.exam_status === "1")
    //     checkedflg = true;

    //   let row = {}
    //   rowcount = rowcount + 1;
    //   for (let fieldName of rowFields)
    //     row[fieldName] = obj[fieldName] // fetching required fields in req order
    //     row.sno = <span>{rowcount}</span>

    //   // let categoryfiltered = category.filter(maincat => maincat.exam_id === obj.pid);
    //   // let activefiltered = qactiveCount.filter(active => active.sub_id === obj.exam_id);
    //   // let waitingfiltered = qwaitingCount.filter(waiting => waiting.sub_id === obj.exam_id);
    //   // if (categoryfiltered.length > 0) {
    //   //   row.MainCategory = categoryfiltered[0].exam_name;
    //   // } else {
    //   //   row.MainCategory = "---";
    //   // }
    //   // let activeqcount = 0;
    //   // let waitingqcount = 0;
    //   // if (activefiltered.length > 0) {
    //   //   activeqcount = activefiltered[0].activecount;
    //   // }
    //   // if (waitingfiltered.length > 0) {
    //   //   waitingqcount = waitingfiltered[0].waitingcount;
    //   // }
    //   row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
    //     label="." type="checkbox"
    //     checked={obj.isSelected}
    //     name={obj.exam_id} id={obj.exam_id}
    //     onChange={(e) => { onCategorySelect(e, obj, index) }}
    //   />;
    //   row.exam_pos = <input type="text" name={'pos' + obj.exam_id}
    //     onChange={event => onPositionChange(event, obj, index)}
    //     style={{ width: '50px', textAlign: 'center', padding: '0px' }}
    //     value={obj.exam_pos}
    //     className="form-control form-control-lg" />
    //   row.questions = (<><Button style={{ width: '100%' }} onClick={() => openQuestions(true, obj.exam_id, obj.exam_id)} variant="contained" color="primary">
    // {/* Exams&nbsp;&nbsp;<Badge color="warning" pill>{waitingqcount}<Badge color="success" pill>{activeqcount}</Badge></Badge> */}
    //   </Button></>);
    //   row.questions = <IconButton onClick={() => subpdf(true, obj)} className="icon-btn"><i className="zmdi zmdi-collection-pdf zmdi-hc-fw" /></IconButton>;

    //   row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

    //   return row;
    // })
    setCategoryrows(categoryrows);
  }
 

  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }

  const openQuestions = (open, categoryId, subCatId) => {
    setCategoryId(categoryId);
    setSubCategoryId(subCatId);
    localStorage.removeItem('categoryId');
    localStorage.removeItem('subcategoryId');
    localStorage.removeItem('status');
    localStorage.removeItem('mode');
    localStorage.setItem('main', true);
    if (open) {
      setShowQuestions(true);
      setShowSubCategory(false);
    } else {
      setShowSubCategory(true);
      setShowQuestions(false);
    }
  }

  const handleMainCategoryChange = (event, value) => {
    setMainCategoryId(event.target.value);
  }

  const handleAction = async (id) => {
    let selectedCategoryObj = selectedCategory;
    if (action === '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action === 'Inactive') {
        selectedCategoryObj.status = 'N';
        if (selectedCategory.catId.length != 0) {
          AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to Inactive this DashboardCategory.',
            okText: 'Yes',
            onOk: () => Inactive(id),
            cancelText: 'No',
          });
          const Inactive = async () => {
          await ExaminationCalendarService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully inactivated.');
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
        } else {
          setAlertMessage('Please select atleast one category');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action === 'Active') {
        selectedCategoryObj.status = 'Y';
        if (selectedCategory.catId.length != 0) {
          AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to Active this DashboardCategory.',
            okText: 'Yes',
            onOk: () => Active(id),
            cancelText: 'No',
          });
          const Active = async () => {
          await ExaminationCalendarService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully activated.');
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
        } else {
          setAlertMessage('Please select atleast one category');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action === 'Delete') {
        if (selectedCategory.catId.length != 0) {
          AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to Delete this DashboardCategory.',
            okText: 'Yes',
            onOk: () => Delete(id),
            cancelText: 'No',
          });
          const Delete = async () => {
            await ExaminationCalendarService.deleteCategory(selectedCategory);
            setAlertMessage('Data successfully deleted.');
            await handleRefresh();
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false)
            }, 1500);
          }
        }
        else {
          setAlertMessage('Please select atleast one category');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
    }
    if (action === 'Position') {
      if (changePositionData.values.length != 0) {
        AntdModal.confirm({
          title: 'Confirm',
          content: 'Do you want to updated this Position.',
          okText: 'Yes',
          onOk: () => Position(id),
          cancelText: 'No',
        });
        const Position = async () => {
        await ExaminationCalendarService.changePosition(changePositionData);
        setAlertMessage('Position successfully updated.');
        await handleRefresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
      } else {
        setAlertMessage('Please select atleast one category');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    }
  }

  const toggle = (open, data) => {
    setModal(open);
    setErrors({});
    console.log(open, data, "open, data")
    if (data) {
      setIsEdit(true);
      setMainCategoryId(data.pid);
      setSubCategoryId(data.exam_id);
      setCategoryName(data.exam_name);
      setUniqueCode(data.cat_code);
      setDescription(data.cat_desc);
    } else {
      setMainCategoryId('0');
      setCategoryName('');
      setUniqueCode('');
      setDescription('');
      setSavedisabled(false);
      setIsEdit(false);
    }
  }
  const handleSaveButton = () => {
    if (errors['categoryName'] != null || errors['categoryName'] === undefined || errors['uniquecode'] != null || errors['uniquecode'] === undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };
  const saveSubCategory = async () => {
    if (categoryName && uniquecode && maincategoryId != '0') {
      setSaveLoader(true);
      const saveObj = {};
      saveObj.exam_name = categoryName;
      saveObj.cat_code = uniquecode;
      saveObj.cat_desc = description;
      saveObj.pid = maincategoryId;
      await ExaminationCalendarService.saveSubCategory(saveObj);
      setAlertMessage('Qbank Sub Category Added Successfully');
      await handleRefresh();
      setSaveLoader(false);
      setShowMessage(true);
      setModal(false);
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

  const editSubCategory = async () => {
    if (categoryName && uniquecode && maincategoryId != '0') {
      setSaveLoader(true);
      const editObj = {};
      editObj.exam_name = categoryName;
      editObj.cat_code = uniquecode;
      editObj.cat_desc = description;
      editObj.pid = maincategoryId;
      await ExaminationCalendarService.editQbankCategory(subcategoryId, editObj);
      setAlertMessage('Qbank Sub Category Updated Successfully');
      await handleRefresh();
      setSaveLoader(false);
      setShowMessage(true);
      setModal(false);
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

  const handleRequestClose = () => {
    setShowMessage(false)
  };

  const onModalClose = () => {
    setModal(false);
    setSavedisabled(false);
  };

  const getAllInactive = async () => {
    setLoader(true);
    setDataType("Inactive");
    setTxtClass('bg-danger text-white');
    const { data: inactiveres } = await ExaminationCalendarService.getAllexamination('N');;
    const { subcategory: inactivedata } = inactiveres;
    setData(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    setDataType("Active");
    setTxtClass('bg-success text-white');
    const { data: activeres } = await ExaminationCalendarService.getAllexamination('Y');;
    const { subcategory: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const onSearchStringChange = (name) => {
    setSearchString(name);
  }

  const handleMainCategorySearch = async (event, value) => {
    setSearchCategoryId(event.target.value);
    const { data: subcategoryres } = await ExaminationCalendarService.getSubCategoryById(event.target.value);
    const { subcategory: subcategories } = subcategoryres;
    let itemArr = [];
    for (let subcat of subcategories) {
      itemArr.push(<MenuItem value={subcat.exam_id}>{subcat.exam_name}</MenuItem>)
    }
    setSubCategoryItems(itemArr);
  }

  const handleSubCategoryChange = async (event, value) => {
    setSubCategoryId(event.target.value);
  }

  const handleSearch = async () => {
    setLoader(true);
    let searchdata = {};
    searchdata.exam_id = searchcategoryId;
    searchdata.subexam_id = subcategoryId;
    searchdata.searchString = searchString;
    if (datatype === 'Active') {
      searchdata.status = 'Y';
    } else {
      searchdata.status = 'N';
    }
    const { data: searchresultres } = await ExaminationCalendarService.getSearchResult(searchdata);
    const { category: categoryres } = searchresultres;
    const { subcategory: searchresult } = searchresultres;
    const { activequestioncount: activeres } = searchresultres;
    const { waitingquestioncount: waitingres } = searchresultres;
    setQActiveCount(activeres);
    setQWaitingCount(waitingres);
    setCategory(categoryres);
    setData(searchresult);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const handleReset = async () => {
    setSearchCategoryId("");
    setSubCategoryId("");
    setSearchString("");
    await handleRefresh();
  }

  const subpdf = async (state, obj) => {
    if (state) {
      if (obj.pid && obj.exam_id) {
        const doc = new jsPDF({
          orientation: "landscape"
        });

        doc.page = 1;
        doc.setFont('arial');
        doc.setFontSize(25);
        doc.setLineWidth(0.5);
        doc.text(121, 13, 'QuestionCloud');
        doc.setFont('times');
        doc.setFontSize(12);
        doc.text(129, 20, 'Subcategory Questions');
        setLoader(true);
        const searchdata = {};
        let user = auth.getCurrentUser();
        if (user.user.logintype === 'G') {
          searchdata.isQcAdmin = true;
        } else {
          searchdata.isSchoolAdmin = true;
        }
        searchdata.maincat = obj.pid; // main category
        searchdata.subcat = obj.exam_id; //sub category
        doc.output('blob');
        setLoader(false);
        return;
      }
    }
  }

  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Examination Calender</h2>
        <IconButton onClick={() => handleRefresh()} className="icon-btn">
          <i className="zmdi zmdi-refresh" />
        </IconButton>
      </div>
      <div className="col-12">
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {showSubCategory && !loader &&
          <Spin spinning={saveLoader} tip='Loading...'>
            <div className="col-12">
              <form className="row" autoComplete="off">
                <div className="col-lg-3 col-sm-6 col-12">
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Actions</InputLabel>
                    {datatype === 'Active' &&
                      <Select onChange={(event, value) => {
                        onActionChange(event, value)
                      }} >
                        <MenuItem value={'Inactive'}>Inactive</MenuItem>
                        <MenuItem value={'Position'}>Position</MenuItem>
                        <MenuItem value={'Delete'}>Delete</MenuItem>
                      </Select>
                    }
                    {datatype === 'Inactive' &&
                      <Select onChange={(event, value) => {
                        onActionChange(event, value)
                      }} >
                        <MenuItem value={'Active'}>Active</MenuItem>
                        <MenuItem value={'Position'}>Position</MenuItem>
                        <MenuItem value={'Delete'}>Delete</MenuItem>
                      </Select>
                    }
                  </FormControl>
                </div>
                <div style={{ paddingTop: '2%' }} className="col-lg-2 col-sm-6 col-12">
                  <Button onClick={() => handleAction()} variant="contained" color="primary" className="jr-btn">
                    <i className="zmdi zmdi-flash zmdi-hc-fw" />
                    <span>Go</span>
                  </Button>
                </div>
                <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-7 col-sm-7 col-12">
                  <div className="jr-btn-group">
                    <Button onClick={() => toggle(true, '')} variant="contained" color="primary" className="jr-btn">
                      <i className="zmdi zmdi-plus zmdi-hc-fw" />
                      <span>Add</span>
                    </Button>
                    <Button onClick={() => getAllActive()} variant="contained" className="jr-btn bg-success text-white">
                      <i className="zmdi zmdi-check zmdi-hc-fw" />
                      <span>Active ({activeCount})</span>
                    </Button>
                    <Button onClick={() => getAllInactive()} variant="contained" className="jr-btn bg-danger text-white">
                      <i className="zmdi zmdi-block zmdi-hc-fw" />
                      <span>Inactive ({inactiveCount})</span>
                    </Button>
                    <Button onClick={() => subpdf(true)} variant="contained" color="primary" className="jr-btn text-white" style={{ "float": "right" }}>
                      <i className="zmdi zmdi-collection-pdf zmdi-hc-fw" />
                      <span>View in PDF</span>
                    </Button>
                  </div>
                </div>
              </form>
              <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Examination Calender</h4>
              <CardBox styleName="col-12" cardStyle=" p-0">
                <MDBCardBody  >
                  <MDBRow>

                    <MDBCol md="3">
                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Select Category</InputLabel>
                        <Select onChange={(event, value) => {
                          handleMainCategorySearch(event, value)
                        }} value={searchcategoryId}
                        >
                          {categoryitems}
                        </Select>
                      </FormControl>
                    </MDBCol>
                    <MDBCol md="3">
                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Sub Category</InputLabel>
                        <Select onChange={(event, value) => {
                          handleSubCategoryChange(event, value)
                        }} value={subcategoryId}
                        >
                          <MenuItem value={'M'}>Select Sub Category</MenuItem>
                          {subcategoryitems}
                        </Select>
                      </FormControl>
                    </MDBCol>
                    <MDBCol md="3">
                      <TextField
                        id="searchstring"
                        fullWidth={true}
                        label={'Search'}
                        name={'searchstring'}
                        onChange={(event) => onSearchStringChange(event.target.value)}
                        defaultValue={searchString}
                        margin="none" />
                    </MDBCol>
                    <MDBCol md="1">
                      <Button onClick={() => handleSearch()} style={{ marginTop: '25%' }} variant="contained" color="primary" className="jr-btn">
                        <i className="zmdi zmdi-search zmdi-hc-fw" />
                      </Button>
                    </MDBCol>
                    <MDBCol md="1">
                      <Button onClick={() => handleReset()} style={{ marginTop: '25%' }} variant="contained" color="primary" className="jr-btn">
                        <i className="zmdi zmdi-format-clear-all zmdi-hc-fw" />
                        <span>Reset</span>
                      </Button>
                    </MDBCol>

                  </MDBRow>
                </MDBCardBody>
              </CardBox>
              <MDBDataTable
                striped
                bordered
                entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
                entries={50}
                hover
                data={{ rows: categoryrows, columns }}
                small
                responsive
                noBottomColumns
                disableRetreatAfterSorting={true} />
              <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
                <Spin spinning={saveLoader} tip='Loading...'>
                  <ModalHeader className="modal-box-header bg-primary text-white">
                    {isEdit === false ? "Add Examination Calendar" :
                      "Edit Examination Calendar"}
                  </ModalHeader>
                  <div className="modal-box-content">
                    <div className="row no-gutters">
                      <div className="col-lg-12 d-flex flex-column order-lg-1">
                        <div className="">
                          <FormControl className="w-100 mb-2">
                            <InputLabel htmlFor="age-simple">1234567</InputLabel>
                            <Select onChange={(event, value) => {
                              handleMainCategoryChange(event, value)
                            }} value={maincategoryId}
                            >

                              {categoryitems}

                            </Select>
                          </FormControl>
                        </div>
                        <TextField
                          required
                          id="required"
                          label={'Sub Category Name'}
                          name={'SubCategoryName'}
                          onChange={(event) => setCategoryName(event.target.value)}
                          defaultValue={categoryName}
                          onBlur={valiadateProperty}
                          margin="normal" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['SubCategoryName']}</h6></div>
                        <TextField
                          required
                          id="required"
                          label={'Position'}
                          name={'Position'}
                          onChange={(event) => setUniqueCode(event.target.value)}
                          defaultValue={uniquecode}
                          onBlur={valiadateProperty}
                          margin="normal" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Unique']}</h6></div>
                        <TextField
                          id="required"
                          label={'Description'}

                          onChange={(event) => setDescription(event.target.value)}
                          defaultValue={description}

                          margin="normal" />
                        {/* <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Description']}</h6></div> */}
                      </div>
                    </div>
                  </div>
                  <ModalFooter>
                    {isEdit === false ?
                      <div className="d-flex flex-row">
                        <Button style={{ marginRight: '5%' }} onClick={() => saveSubCategory()} variant="contained" disabled={savedisabled} color="primary">Save</Button>
                        <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                      </div> :
                      <div className="d-flex flex-row">
                        <Button style={{ marginRight: '5%' }} onClick={() => editSubCategory()} variant="contained" disabled={savedisabled} color="primary">Update</Button>
                        <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                      </div>}
                  </ModalFooter>
                </Spin>
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
          </Spin>
        }
        {showQuestions && !loader &&
          <QuestionsView categoryId={categoryId} subcategoryId={subcategoryId} openQuestions={openQuestions} />
        }
      </div >
    </>
  );
};

export default DataTable;