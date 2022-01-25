import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import CardBox from "components/CardBox/index";

import {
  MDBDataTable, MDBIcon, MDBBtn, MDBInput,
  MDBCard,
  MDBCardHeader,
  MDBCardBody, MDBRow, MDBCol
} from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import * as qbankSubCategoryService from '../../../../../../services/qbankSubCategoryService';
import * as qbankCategoryService from '../../../../../../services/qbankCategoryService';
import * as utilService from '../../../../../../services/utilService';
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
  const [selectedCategory, setSelectedCategory] = useState({ "catId": [] });
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
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
      if (document.getElementById(row.cat_id)) {
        document.getElementById(row.cat_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.cat_status = 1
          else
            row.cat_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.cat_id);
          selected[row.cat_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedCategory({ "catId": selectedCatArr });
          let postionObj = {};
          postionObj.catId = row.cat_id;
          postionObj.position = row.cat_pos;
          posArr.push(postionObj);
          console.log(posArr);
          console.log(selectedCatArr);
          setChangePositionData({ "values": posArr });
        } else {

          if (e.currentTarget.checked)
            row.cat_status = 1
          else
            row.cat_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] == row.cat_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          if (posArr.length != 0) {
            for (var s = 0; s < posArr.length; s++) {
              if (posArr[s].catId == row.cat_id) {
                posArr.splice(s, 1);
              }
            }
          }
          setSelectedCategory({ "catId": selectedCatArr });
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
    selectedCategoryArr = selectedCategory.catId;
    changePosArr = changePositionData.values;
    if (e.currentTarget.checked) {
      obj.cat_status = 1;
      setMainCategoryId(obj.pid);
      setSubCategoryId(obj.cat_id);
    }
    else
      obj.cat_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.cat_id)
      let postionObj = {};
      for (var i = 0; i < changePosArr.length; i++) {
        if (changePosArr[i].catId == obj.cat_id) {
          changePosArr.splice(i, 1);
        }
      }
      postionObj.catId = obj.cat_id;
      postionObj.position = obj.cat_pos;
      changePosArr.push(postionObj);
      //console.log(changePositionArr);
      setChangePositionData({ "values": changePosArr });
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] == obj.cat_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
      if (changePosArr.length != 0) {
        for (var s = 0; s < changePosArr.length; s++) {
          if (changePosArr[s].catId == obj.cat_id) {
            changePosArr.splice(s, 1);
          }
        }
      }
      console.log(changePositionData);
      setChangePositionData({ "values": changePosArr });
    }
    setSelectedCategory({ "catId": selectedCategoryArr });
  }

  const onPositionChange = (e, obj, index) => {
    obj.cat_pos = e.target.value
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
      label: 'Main Category Name',
      field: 'MainCategory',
      width: 100,
    },
    {
      label: 'Sub Category Name',
      field: 'cat_name',
      width: 100,
    },
    {
      label: 'unique Code',
      field: 'cat_code',
      width: 50,
    },
    {
      label: 'Description',
      field: 'cat_desc',
      width: 50,
    },
    {
      label: 'Position',
      field: 'cat_pos',
      sort: 'asc',
      width: 10,
    },
    {
      label: 'Questions',
      field: 'questions',
      width: 50,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 10,
    },
    {
      label: 'View in PDF',
      field: 'pdfList',
      width: 10,
    },
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
    const { data: res } = await qbankSubCategoryService.getAllQuestionSubCategory('Y');
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
    const { data: inactiveres } = await qbankSubCategoryService.getAllQuestionSubCategoryCount('N');
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    const { data: maincategoryres } = await qbankCategoryService.getAllQuestionMainCategoryAsc();
    const { category: categories } = maincategoryres;
    let itemArr = [];
    for (let category of categories) {
      itemArr.push(<MenuItem value={category.cat_id}>{category.cat_name}</MenuItem>)
    }
    setCategoryItems(itemArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const valiadateProperty = (e) => {
    let { name, value, className } = e.currentTarget;
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })

    if (name == 'Unique')
      onCheckCodeExists(e.target.value);

    if (error)
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
    else
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"
  }
  const schema = {
    SubCategoryName: Joi.string().required(),
    Unique: Joi.string().required(),
    // Description: Joi.string().required(),
  }

  const onCheckCodeExists = async (code) => {
    try {
      if (code != "") {
        let data = {};
        data.table = 'tbl__category';
        data.field = 'cat_code';
        data.value = code;
        data.uniqueId = 'cat_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'cat_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
        console.log(response.count);
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
    if (data && data.length || data.length == 0)
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
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))

    let categoryrows = rows.map((obj, index) => {
      let checkedflg = false;
      if (obj.cat_status == "1")
        checkedflg = true;

      let row = {}
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>

      let categoryfiltered = category.filter(maincat => maincat.cat_id == obj.pid);
      let activefiltered = qactiveCount.filter(active => active.sub_id == obj.cat_id);
      let waitingfiltered = qwaitingCount.filter(waiting => waiting.sub_id == obj.cat_id);
      console.log(activefiltered);
      if (categoryfiltered.length > 0) {
        row.MainCategory = categoryfiltered[0].cat_name;
      } else {
        row.MainCategory = "---";
      }
      let activeqcount = 0;
      let waitingqcount = 0;
      if (activefiltered.length > 0) {
        activeqcount = activefiltered[0].activecount;
      }
      if (waitingfiltered.length > 0) {
        waitingqcount = waitingfiltered[0].waitingcount;
      }
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.cat_id} id={obj.cat_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.cat_pos = <input type="text" name={'pos' + obj.exa_cat_id}
        onChange={event => onPositionChange(event, obj, index)}
        style={{ width: '50px', textAlign: 'center', padding: '0px' }}
        value={obj.cat_pos}
        className="form-control form-control-lg" />
      row.questions = (<><Button style={{ width: '100%' }} onClick={() => openQuestions(true, obj.pid, obj.cat_id)} variant="contained" color="primary">
        Questions&nbsp;&nbsp;<Badge color="warning" pill>{waitingqcount}<Badge color="success" pill>{activeqcount}</Badge></Badge>
      </Button></>);
      row.pdfList = <IconButton onClick={() => subpdf(true, obj)} className="icon-btn"><i className="zmdi zmdi-collection-pdf zmdi-hc-fw" /></IconButton>;

      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

      return row;
    })
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

  const handleAction = async () => {
    let selectedCategoryObj = selectedCategory;
    if (action == '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action == 'Inactive') {
        selectedCategoryObj.status = 'N';
        if (selectedCategory.catId.length != 0) {
          await qbankSubCategoryService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully inactivated.');
          setSelectedCategory({ "catId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one category');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action == 'Active') {
        selectedCategoryObj.status = 'Y';
        if (selectedCategory.catId.length != 0) {
          await qbankSubCategoryService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully activated.');
          setSelectedCategory({ "catId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one category');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action == 'Delete') {
        if (selectedCategory.catId.length != 0) {
          await qbankSubCategoryService.deleteCategory(selectedCategory);
          setAlertMessage('Data successfully deleted.');
          setSelectedCategory({ "catId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one category');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
    }
    if (action == 'Position') {
      console.log(changePositionData);
      if (changePositionData.values.length != 0) {
        await qbankSubCategoryService.changePosition(changePositionData);
        setAlertMessage('Position successfully updated.');
        await handleRefresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
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
    console.log(data);
    setModal(open);
    setErrors({});
    if (data) {
      setIsEdit(true);
      setMainCategoryId(data.pid);
      setSubCategoryId(data.cat_id);
      console.log(data.pid, data.cat_id);
      setCategoryName(data.cat_name);
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
    if (errors['categoryName'] != null || errors['categoryName'] == undefined || errors['uniquecode'] != null || errors['uniquecode'] == undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };
  const saveSubCategory = async () => {
    if (categoryName && uniquecode && maincategoryId != '0') {
      const saveObj = {};
      saveObj.cat_name = categoryName;
      saveObj.cat_code = uniquecode;
      saveObj.cat_desc = description;
      saveObj.pid = maincategoryId;
      await qbankSubCategoryService.saveSubCategory(saveObj);
      setAlertMessage('Qbank Sub Category Added Successfully');
      await handleRefresh();
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
      const editObj = {};
      editObj.cat_name = categoryName;
      editObj.cat_code = uniquecode;
      editObj.cat_desc = description;
      editObj.pid = maincategoryId;
      await qbankSubCategoryService.editQbankCategory(subcategoryId, editObj);
      setAlertMessage('Qbank Sub Category Updated Successfully');
      await handleRefresh();
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
    const { data: inactiveres } = await qbankSubCategoryService.getAllQuestionSubCategory('N');;
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
    const { data: activeres } = await qbankSubCategoryService.getAllQuestionSubCategory('Y');;
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
    const { data: subcategoryres } = await qbankSubCategoryService.getSubCategoryById(event.target.value);
    const { subcategory: subcategories } = subcategoryres;
    let itemArr = [];
    for (let subcat of subcategories) {
      itemArr.push(<MenuItem value={subcat.cat_id}>{subcat.cat_name}</MenuItem>)
    }
    setSubCategoryItems(itemArr);
  }

  const handleSubCategoryChange = async (event, value) => {
    console.log(event.target.value);
    setSubCategoryId(event.target.value);
  }

  const handleSearch = async () => {
    setLoader(true);
    let searchdata = {};
    searchdata.cat_id = searchcategoryId;
    searchdata.subcat_id = subcategoryId;
    searchdata.searchString = searchString;
    if (datatype == 'Active') {
      searchdata.status = 'Y';
    } else {
      searchdata.status = 'N';
    }
    const { data: searchresultres } = await qbankSubCategoryService.getSearchResult(searchdata);
    const { category: categoryres } = searchresultres;
    const { subcategory: searchresult } = searchresultres;
    const { activequestioncount: activeres } = searchresultres;
    const { waitingquestioncount: waitingres } = searchresultres;
    setQActiveCount(activeres);
    setQWaitingCount(waitingres);
    setCategory(categoryres);
    console.log(searchresult);
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
      console.log("True");
      if (obj.pid && obj.cat_id) {
        console.log("Both Id here");
        // Set PDF content.
        const doc = new jsPDF({
          orientation: "landscape"
        });

        doc.page = 1;
        doc.setFont('arial');
        doc.setFontSize(25);
        doc.setLineWidth(0.5);
        //doc.rect(5, 5, 200, 287);

        doc.text(121, 13, 'QuestionCloud');
        doc.setFont('times');

        doc.setFontSize(12);
        doc.text(129, 20, 'Subcategory Questions');

        // Enter Here
        setLoader(true);
        const searchdata = {};
        searchdata.maincat = obj.pid; // main category
        searchdata.subcat = obj.cat_id; //sub category
        let activeres = await qbankSubCategoryService.getSubCategoryQuestionForPDF(searchdata);
        console.log(activeres.data);
        fileDownload(activeres.data, 'Bank Subcategory Questions.pdf');

        doc.output('blob');
        setLoader(false);

        //window.open(doc.output('bloburl'), '_blank');
        //doc.save("Bank Subcategory Questions.pdf");

        return;

        const { qdata: questiondetail } = activeres;
        console.log(questiondetail);

        doc.text(10, 30, "Main Category Name : ");
        doc.text(50, 30, "" + questiondetail[0].maincatname);
        doc.text(10, 40, "Sub Category Name : ");
        doc.text(50, 40, "" + questiondetail[0].subcatname);

        let question_count = 1;
        var question_height = 40;
        var option_height = 50;

        let overall_col = [
          { dataKey: 'overall_count', header: 'S.no' },
          { dataKey: 'c1', header: 'Question' },
          { dataKey: 'c2', header: 'Option 1' },
          { dataKey: 'c3', header: 'Option 2' },
          { dataKey: 'c4', header: 'Option 3' },
          { dataKey: 'c5', header: 'Option 4' },
        ];
        var overall_options = {
          theme: 'grid',
          columnStyles: {
            overall_count: { columnWidth: 25, halign: 'center' },
            c1: { columnWidth: 70 },
            c2: { columnWidth: 45 },
            c3: { columnWidth: 45 },
            c4: { columnWidth: 45 },
            c5: { columnWidth: 45 }, //275
          },
          headStyles: {
            fillColor: '#FFFFFF', textColor: '#222222', lineWidth: 0.05,
            lineColor: [200, 200, 200]
          },
          style: { cellWidth: 'auto' },
          margin: { top: 50, horizontal: 10 },
        };
        let overall_count = 1;
        let reqAmount, appAmount;
        let overall_initialloannextRow = [];
        if (questiondetail.length > 0) {
          for (const [index, value] of questiondetail.entries()) {

            // Entity Process
            let questionvalue = entities.decode(value.question);
            let mainquestion = <div dangerouslySetInnerHTML={{ __html: questionvalue }}></div>
            console.log(mainquestion);

            overall_initialloannextRow.push({
              overall_count: overall_count,
              c1: mainquestion,
              c2: value.opt_1,
              c3: value.opt_2,
              c4: value.opt_3,
              c5: value.opt_4,
            });
            overall_count++;
          }
        }
        doc.autoTable(overall_col, overall_initialloannextRow, overall_options);

        /*
        for (const [index, value] of questiondetail.entries()) {
          console.log("Question ", question_height);
          if (option_height > 1300) {
            console.log("Arrives next page");
            doc.addPage();
            question_height = 40;
            option_height = 50;
          }
          doc.text(10, question_height += 10, "Question " + question_count + " : ");
          console.log("Question ", question_height);
          doc.text(40, question_height, "" + value.question);
          console.log("Option ", option_height);
          doc.text(10, option_height += 10, "Options: ");
          console.log("Option ", option_height);
          doc.text(40, option_height, "" + value.opt_1);
          doc.text(40, option_height, "" + value.opt_2);
          doc.text(40, option_height, "" + value.opt_3);
          doc.text(40, option_height, "" + value.opt_4);

          question_count++;
          question_height = question_height + 10;
          option_height = option_height + 10;
        }
        */

        window.open(doc.output('bloburl'), '_blank');
        //doc.save("Bank Subcategory Questions.pdf");
      }
    }
  }

  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Question Bank Sub Category</h2>
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
          <div className="col-12">
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">Actions</InputLabel>
                  {datatype == 'Active' &&
                    <Select onChange={(event, value) => {
                      onActionChange(event, value)
                    }} >
                      <MenuItem value={'Inactive'}>Inactive</MenuItem>
                      <MenuItem value={'Position'}>Position</MenuItem>
                      <MenuItem value={'Delete'}>Delete</MenuItem>
                    </Select>
                  }
                  {datatype == 'Inactive' &&
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Q Bank Sub Category</h4>
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
              entriesOptions={[5, 10, 20, 25, 50, 100]}
              entries={50}
              hover
              data={{ rows: categoryrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true} />
            <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit == false ? "Add Sub Category" :
                  "Edit Sub Category"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-12 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Main Category</InputLabel>
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
                      label={'Unique Code (Ex: ENTGUS)'}
                      name={'Unique'}
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
                {isEdit == false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveSubCategory()} variant="contained" disabled={savedisabled} color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editSubCategory()} variant="contained" disabled={savedisabled} color="primary">Update</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div>}
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
        }
        {showQuestions && !loader &&
          <QuestionsView categoryId={categoryId} subcategoryId={subcategoryId} openQuestions={openQuestions} />
        }
      </div >
    </>
  );
};

export default DataTable;