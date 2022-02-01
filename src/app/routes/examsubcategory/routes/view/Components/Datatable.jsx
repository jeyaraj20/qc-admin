import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBInput } from 'mdbreact';
import { Spin } from 'antd';
import IconButton from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as examSubCategoryService from '../../../../../../services/examSubCategoryService';
import * as qbankSubCategoryService from '../../../../../../services/qbankSubCategoryService';
import auth from '../../../../../../services/authService';
import * as utilService from '../../../../../../services/utilService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Badge } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ExamsDatatable from './ExamsDatatable';
import Joi from 'joi-browser';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

const DataTable = (props) => {
  const history = useHistory();
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [savedisabled, setSavedisabled] = useState(false);
  const [examdescription, setExamDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [viewEditImg, setviewEditImg] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [categoryitems, setCategoryItems] = useState([]);
  const [subcategoryitems, setSubCategoryItems] = useState([]);
  const [maincategoryId, setMainCategoryId] = useState('');
  const [subcategoryId, setSubCategoryId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ "catId": [] });
  const [action, setAction] = useState('');
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [testTypesRow, setTestTypesRow] = useState([]);
  const [chapTypesRow, setChapTypesRow] = useState([]);
  const [chaptdelarr, setChaptDelArr] = useState([]);
  const [typedelarr, setTypeDelArr] = useState([]);
  const [showExamsTable, setShowExamsTable] = useState(false);
  const [showExamSubCategory, setShowExamSubCategory] = useState(true);
  const [examType, setExamType] = useState('');
  const [subId, setId] = useState('');
  const [errors, setErrors] = useState({});
  const [examData, setExamData] = useState({});
  const [searchcategoryId, setSearchCategoryId] = useState('');
  const [searchString, setSearchString] = useState('');
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');
  const [subid, setSubId] = useState('');
  const [paymentFlag, setPaymentFlag] = useState('N');
  const [user, setUser] = useState({});

  const renderTestTypes = () => {
    let rowNum = 1;
    return testTypesRow.map((row, index) => {
      rowNum = rowNum + 1;
      const { name, typeId, rowsNo, addtype } = row //destructuring
      return (
        <TableRow key={index}>
          <TableCell>{rowsNo}</TableCell>
          <TableCell><input value={name} onChange={(e) => onRowValueChange(e, index)} onBlur={(e) => validateType(e, index)} ></input></TableCell>
          <TableCell>{addtype ?
            <IconButton onClick={() => addTestType(rowNum)} className="icon-btn">
              <i className="zmdi zmdi-plus zmdi-hc-fw" />
            </IconButton> :
            <IconButton onClick={() => removeTestType(rowsNo, typeId)} className="icon-btn">
              <i className="zmdi zmdi-delete zmdi-hc-fw" />
            </IconButton>}
          </TableCell>
        </TableRow>
      )
    })
  }

  const validateType = (e, index) => {
    if (e.target.value === '') {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  }

  const renderChapTypes = () => {
    let rowNum = 1;
    return chapTypesRow.map((row, index) => {
      rowNum = rowNum + 1;
      const { name, chaptId, rowsNo, addtype, deltype } = row //destructuring
      return (
        <TableRow key={index}>
          <TableCell>{rowsNo}</TableCell>
          <TableCell><input value={name} onChange={onChapterTypeChange(index)} onBlur={(e) => validateType(e, index)} ></input></TableCell>
          <TableCell>{addtype ?
            <IconButton onClick={() => addChapType(rowNum)} className="icon-btn">
              <i className="zmdi zmdi-plus zmdi-hc-fw" />
            </IconButton> :
            <IconButton onClick={() => removeChapType(rowsNo, chaptId)} className="icon-btn">
              <i className="zmdi zmdi-delete zmdi-hc-fw" />
            </IconButton>}
          </TableCell>
        </TableRow>
      )
    })
  }

  const onRowValueChange = (e, index) => {
    let newArr = [...testTypesRow]; // copying the old datas array
    newArr[index].name = e.target.value; // replace e.target.value with whatever you want to change it to
    setTestTypesRow(newArr); // ??
  }

  const onChapterTypeChange = index => e => {
    let newArr = [...chapTypesRow]; // copying the old datas array
    newArr[index].name = e.target.value; // replace e.target.value with whatever you want to change it to
    setChapTypesRow(newArr); // ??
  }

  let selectedCatArr = [];
  const onSelectAll = e => {
    let selected = selectedCat;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.exa_cat_id)) {
        document.getElementById(row.exa_cat_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {
          if (e.currentTarget.checked)
            row.isChecked = true;
          else
            row.isChecked = false;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.exa_cat_id);
          selected[row.exa_cat_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedCategory({ "catId": selectedCatArr });
        } else {
          if (e.currentTarget.checked)
            row.isChecked = true;
          else
            row.isChecked = false;
          data[rowcount] = row
          setData([...data])
          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] === row.exa_cat_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          setSelectedCategory({ "catId": selectedCatArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedCat(selected);
      rowcount = rowcount + 1;
    }
  };

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Master Category',
      field: 'Mastercategory',
      width: 100
    },
    {
      label: 'Main Category',
      field: 'category',
      sort: 'asc',
      width: 100,
    },
    {
      label: 'Sub Category',
      field: 'exa_cat_name',
      width: 100
    },
    {
      label: 'Description',
      field: 'exa_cat_desc',
      width: 100
    },
    {
      label: 'Common Exams',
      field: 'commonexams',
      width: 50
    },
    {
      label: 'Bank Exams',
      field: 'bankexams',
      width: 50
    },
    {
      label: 'Sectional Exams',
      field: 'sectionalexams',
      width: 50
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 10,
    },
    // {
    //   label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
    //   field: 'select',
    //   width: 50,
    // },
  ]

  if (user && (!user.op_type || user.op_type !== "S")) {
    columns.push({
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 50,
    });
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: window.webkitURL.createObjectURL(file)
      })));
      setviewEditImg(false);
    }
  });

  const handleRefresh = async () => {
    setLoader(true);
    let user = auth.getCurrentUser();
    setUser(user.user);
    let { data: res } = await examSubCategoryService.getAllExamSubCategory('Y');
    let { category: categoryres } = res;
    if (user && user.user && (user.user.op_type === "C" || user.user.op_type === "S")) {
      if (user.user.op_type === "C" && user.user.master_category_id) {
        let masterCat = user.user.master_category_id.includes(',') ? user.user.master_category_id.split(',') : [user.user.master_category_id];
        categoryres = categoryres.filter(c => { return masterCat.indexOf(String(c.exaid)) >= 0 });
      }
      if (user.user.op_type === "S" && user.user.master_category_id) {
        let masterCat = user.user.master_category_id.includes(',') ? user.user.master_category_id.split(',') : [user.user.master_category_id];
        categoryres = categoryres.filter(c => { return masterCat.indexOf(String(c.exaid)) >= 0 });
      }
      if (user.user.op_type === "S" && user.user.main_category_id) {
        let mainCat = user.user.main_category_id.includes(',') ? user.user.main_category_id.split(',') : [user.user.main_category_id];
        categoryres = categoryres.filter(c => { return mainCat.indexOf(String(c.exaid_sub)) >= 0 });
      }
      if (user.user.op_type === "S" && user.user.sub_category_id) {
        let subCat = user.user.sub_category_id.includes(',') ? user.user.sub_category_id.split(',') : [user.user.sub_category_id];
        categoryres = categoryres.filter(c => { return subCat.indexOf(String(c.exa_cat_id)) >= 0 });
      }
    }

    setActiveCount(categoryres.length);
    setData(categoryres);
    const { data: inactiveres } = await examSubCategoryService.getAllExamSubCategory('N');
    const { category: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    const { category: categories } = maincategoryres;
    let itemArr = [];
    for (let category of categories) {
      itemArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
    }
    setCategoryItems(itemArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  useEffect(() => {
    if (data && data.length || data.length === 0)
      mapRows(data);
  }, [data])

  useEffect(() => () => {
    //handleRefresh();
    files.forEach(file => window.webkitURL.revokeObjectURL(file.preview));
  }, [files]);

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
      let row = {}
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.commonexams = (<><Button style={{ width: '100%' }} onClick={() => openExams(true, 'C', obj)} variant="contained" color="primary">
        Exams&nbsp;&nbsp;<Badge color="warning" pill>{obj.cWaitingCount}<Badge color="success" pill>{obj.cActiveCount}</Badge></Badge>
      </Button></>);
      row.bankexams = (<><Button style={{ width: '100%' }} onClick={() => openExams(true, 'B', obj)} variant="contained" color="primary">
        Exams&nbsp;&nbsp;<Badge color="warning" pill>{obj.bWaitingCount}<Badge color="success" pill>{obj.bActiveCount}</Badge></Badge>
      </Button></>);
      row.sectionalexams = (<><Button style={{ width: '100%' }} onClick={() => openExams(true, 'D', obj)} variant="contained" color="primary">
        Exams&nbsp;&nbsp;<Badge color="warning" pill>{obj.dWaitingCount}<Badge color="success" pill>{obj.dActiveCount}</Badge></Badge>
      </Button></>)
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={obj.isChecked}
        name={obj.exa_cat_id} id={obj.exa_cat_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

      return row;
    })
    setCategoryrows(categoryrows);
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
    if (name === 'SubCategoryName')
      onCheckAlreadyExists(e.target.value);
    if (name === 'Slug')
      onCheckSlugExists(e.target.value);
  }

  const onCheckAlreadyExists = async (name) => {
    try {
      if (name != "") {
        let data = {};
        data.table = 'tbl__exam_category';
        data.field = 'exa_cat_name';
        data.value = name;
        data.exaId = 'exaid';
        data.exaIdValue = maincategoryId;
        data.exaIdSub = 'exaid_sub';
        data.exaIdSubValue = subcategoryId;
        if (isEdit) {
          data.exacatid = 'exa_cat_id';
          data.exacatidvalue = subid;
        } else {
          data.exacatid = 0;
          data.exacatidvalue = 0;
        }
        data.statusField = 'exa_cat_status';
        const { data: response } = await utilService.checkAlreadyExistsExamSubCat(data);
        if (response.count > 0) {
          setSavedisabled(true);
          setErrors({ ...errors, ['SubCategoryName']: 'Sub Category already exists', "errordetails": null })
        }
        else {
          setSavedisabled(false);
          setErrors({ ...errors, ['SubCategoryName']: '', "errordetails": null })
        }
      }
    } catch (err) {
      if (err) {
        setSavedisabled(false);
      }
    }
  }

  const onCheckSlugExists = async (slug) => {
    try {
      if (slug != "") {
        let data = {};
        data.table = 'tbl__exam_category';
        data.field = 'exa_cat_slug';
        data.value = slug;
        data.uniqueId = 'exa_cat_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'exa_cat_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
        if (response.count > 0) {
          setSavedisabled(true);
          setErrors({ ...errors, ['Slug']: 'Slug already exists', "errordetails": null })
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

  const schema = {
    SubCategoryName: Joi.string().required(),
    Slug: Joi.string().required(),
    Description: Joi.string().required(),
  }

  const handleMainCategoryChange = async (event, value) => {
    setMainCategoryId(event.target.value);
    const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(event.target.value);
    const { category: categories } = subcategoryres;
    let itemArr = [];
    for (let subcategory of categories) {
      itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
    }
    setSubCategoryItems(itemArr);
  }

  const handleMainCategorySearch = (event, value) => {
    setSearchCategoryId(event.target.value);
  }

  const handleSubCategoryChange = async (event, value) => {
    setSubCategoryId(event.target.value);
  }

  const openExams = async (open, type, data) => {
    setExamType(type);
    if (data) {
      setId(data.exa_cat_id);
      setExamData(data);
    }
    if (open) {
      setShowExamsTable(true);
      setShowExamSubCategory(false);
    } else {
      await handleRefresh();
      setShowExamsTable(false);
      setShowExamSubCategory(true);
    }

  }

  let selectedCategoryArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedCategoryArr = selectedCategory.catId;
    if (e.currentTarget.checked)
      obj.isChecked = true;
    else
      obj.isChecked = false;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.exa_cat_id)
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] === obj.exa_cat_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
    }
    setSelectedCategory({ "catId": selectedCategoryArr });
  }

  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }

  const handleAction = async () => {
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
          await exammainCategoryService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully inactivated.');
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
      if (action === 'Active') {
        selectedCategoryObj.status = 'Y';
        if (selectedCategory.catId.length != 0) {
          await exammainCategoryService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully activated.');
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
      if (action === 'Delete') {
        selectedCategoryObj.status = 'D';
        if (selectedCategory.catId.length != 0) {
          await exammainCategoryService.inactiveCategory(selectedCategoryObj);
          setAlertMessage('Data successfully deleted.');
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
    if (action === 'Position') {
      if (changePositionData.length != 0) {
        await exammainCategoryService.changePosition(changePositionData);
        setAlertMessage('Position successfully updated.');
        await handleRefresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    }
  }

  const toggle = async (open, data) => {
    setErrors({});
    setModal(open);
    setTestTypesRow([
      { rowsNo: 1, typeId: '', name: '', addtype: true, deltype: false }
    ]);
    setChapTypesRow([
      { rowsNo: 1, chaptId: '', name: '', addtype: true, deltype: false }
    ]);
    if (data) {
      setChaptDelArr([]);
      setTypeDelArr([]);
      setIsEdit(true);
      let slug = (data.exa_cat_name).replace(/ /g, "-").toLowerCase();
      setMainCategoryId(data.exaid);
      setSubId(data.exa_cat_id);
      setCategoryName(data.exa_cat_name);
      setSlug(slug);
      setExamDescription(data.exa_cat_desc);
      setPaymentFlag(data.payment_flag);
      const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(data.exaid);
      const { category: categories } = subcategoryres;
      let itemArr = [];
      for (let subcategory of categories) {
        itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
      }
      setSubCategoryItems(itemArr);
      setSubCategoryId(data.exaid_sub);
      const { data: chapres } = await examSubCategoryService.getExamSubCategoryChapters(data.exa_cat_id);
      const { chapterrows: chapterRow } = chapres;
      if (chapterRow.length > 0) {
        let chapArr = [];
        let chapcount = 1;
        for (let chapter of chapterRow) {
          let chapObj = {};
          chapObj.name = chapter.chapter_name;
          chapObj.chaptId = chapter.chapt_id;
          if (chapcount === 1) {
            chapObj.addtype = true;
            chapObj.deltype = false;
          } else {
            chapObj.addtype = false;
            chapObj.deltype = true;
          }
          chapObj.rowsNo = chapcount;
          chapArr.push(chapObj);
          chapcount = chapcount + 1;
        }
        setChapTypesRow(chapArr);
      } else {
        setChapTypesRow([
          { rowsNo: 1, chaptId: '', name: '', addtype: true, deltype: false }
        ]);
      }
      const { data: typeres } = await examSubCategoryService.getExamSubCategoryType(data.exa_cat_id);
      const { typerows: typeRow } = typeres;
      if (typeRow.length > 0) {
        let typeArr = [];
        let typecount = 1;
        for (let type of typeRow) {
          let typeObj = {};
          typeObj.name = type.extest_type;
          typeObj.typeId = type.extype_id;
          if (typecount === 1) {
            typeObj.addtype = true;
            typeObj.deltype = false;
          } else {
            typeObj.addtype = false;
            typeObj.deltype = true;
          }
          typeObj.rowsNo = typecount;
          typeArr.push(typeObj);
          typecount = typecount + 1;
        }
        setTestTypesRow(typeArr);
      } else {
        setTestTypesRow([
          { rowsNo: 1, typeId: '', name: '', addtype: true, deltype: false }
        ]);
      }
    } else {
      setMainCategoryId('');
      setSubCategoryId('');
      setCategoryName('');
      setSlug('');
      setIsEdit(false);
      setExamDescription('');
      setPaymentFlag('N');
    }
  }

  const saveExamMainCategory = async () => {
    if (categoryName && slug) {
      setSaveLoader(true);
      let typesArr = [];
      let chapArr = [];
      for (let type of testTypesRow) {
        if (type.name != "") {
          typesArr.push(type.name);
        }
      }
      for (let chapter of chapTypesRow) {
        if (chapter.name != "") {
          chapArr.push(chapter.name);
        }
      }
      if (typesArr.length > 0 || chapArr.length > 0) {
        if (typesArr[0] != "" || chapArr[0] != "") {
          let data = {};
          data.exaid = maincategoryId;
          data.exaid_sub = subcategoryId;
          data.examcat_type = "S";
          data.exa_cat_slug = slug;
          data.exa_cat_desc = examdescription;
          data.typeList = typesArr;
          data.chapterList = chapArr;
          data.exa_cat_name = categoryName;
          data.payment_flag = 'N';
          await examSubCategoryService.saveExamSubCategory(data);
          setAlertMessage('Exam Sub Category Added Successfully');
          await handleRefresh();
          setSaveLoader(false);
          setShowMessage(true);
          setModal(false);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      } else {
        setAlertMessage('Give atleast one Type/Chapter');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    } else {
      setAlertMessage('Please Give All Required Fields');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const updateExamMainCategory = async () => {
    if (categoryName && slug) {
      setSaveLoader(true);
      let typesArr = [];
      let chapArr = [];
      for (let type of testTypesRow) {
        if (type.name != "") {
          let typeobj = {};
          typeobj.name = type.name;
          typeobj.typeId = type.typeId;
          typesArr.push(typeobj);
        }
      }
      for (let chapter of chapTypesRow) {
        if (chapter.name != "") {
          let chaptobj = {};
          chaptobj.name = chapter.name;
          chaptobj.chaptId = chapter.chaptId;
          chapArr.push(chaptobj);
        }
      }
      if (typesArr[0] != "" || chapArr[0] != "") {
        let data = {};
        data.exaid = maincategoryId;
        data.exaid_sub = subcategoryId;
        data.examcat_type = "S";
        data.exa_cat_slug = slug;
        data.exa_cat_desc = examdescription;
        data.typeList = typesArr;
        data.chapterList = chapArr;
        data.delarr = chaptdelarr;
        data.typedelarr = typedelarr;
        data.exa_cat_name = categoryName;
        data.payment_flag = paymentFlag;
        await examSubCategoryService.editExamSubCategory(subid, data);
        setAlertMessage('Exam Sub Category Updated Successfully');
        setChaptDelArr([]);
        setTypeDelArr([]);
        await handleRefresh();
        setSaveLoader(false);
        setShowMessage(true);
        setModal(false);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      } else {
        setAlertMessage('Give atleast one Type/Chapter');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    } else {
      setAlertMessage('Please Give All Required Fields');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const handleSearch = async () => {
    setLoader(true);
    let status = ''
    if (datatype === 'Active') {
      status = 'Y'
    }
    if (datatype === 'Inactive') {
      status = 'N'
    }
    let searchdata = {};
    searchdata.exa_cat_id = searchcategoryId;
    searchdata.searchString = searchString;
    searchdata.status = status;
    const { data: searchresultres } = await examSubCategoryService.getSearchResult(searchdata);
    const { category: searchresult } = searchresultres;
    setData(searchresult);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const handleReset = async () => {
    setSearchCategoryId("");
    setSearchString("");
    await handleRefresh();
  }

  const onModalClose = () => {
    setModal(false);
  };

  const getAllInactive = async () => {
    setLoader(true);
    setDataType('Inactive');
    setTxtClass('bg-danger text-white');
    setSearchCategoryId("");
    setSearchString("");
    const { data: inactiveres } = await examSubCategoryService.getAllExamSubCategory('N');
    const { category: inactivedata } = inactiveres;
    setData(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    setDataType('Active');
    setTxtClass('bg-success text-white');
    setSearchCategoryId("");
    setSearchString("");
    const { data: activeres } = await examSubCategoryService.getAllExamSubCategory('Y');
    const { category: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const onCategoryNameChange = (name) => {
    let slug = (name).replace(/ /g, "-").toLowerCase();
    setSlug(slug);
    setCategoryName(name)
  }

  const onSearchStringChange = (name) => {
    setSearchString(name);
  }

  const addTestType = (index) => {
    let nextRow = { rowsNo: index, name: '', addtype: false, deltype: true };
    setTestTypesRow(state => [...state, nextRow])
  }

  const removeTestType = (index, typeId) => {
    typedelarr.push(typeId);
    setTestTypesRow(testTypesRow.filter(item => item.rowsNo !== index));
  }

  const addChapType = (index) => {
    let nextRow = { rowsNo: index, name: '', addtype: false, deltype: true };
    setChapTypesRow(state => [...state, nextRow])
  }

  //let chapdelarray = [];
  const removeChapType = (index, chaptId) => {
    chaptdelarr.push(chaptId);
    setChapTypesRow(chapTypesRow.filter(item => item.rowsNo !== index));
  }


  return (
    <>
      <div>
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {showExamSubCategory && !loader &&
          <>
            <Spin spinning={saveLoader} tip={'Loading...'}>
              <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                <h2 className="title mb-3 mb-sm-0">Exam Sub Category</h2>
                <IconButton onClick={() => handleRefresh()} className="icon-btn">
                  <i className="zmdi zmdi-refresh" />
                </IconButton>
              </div>
              <div className="col-12">
                <form className="row" autoComplete="off">
                  {(!user.op_type || user.op_type !== "S") &&
                    <div className="col-lg-3 col-sm-6 col-12">
                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Actions</InputLabel>
                        {datatype === 'Active' &&
                          <Select onChange={(event, value) => {
                            onActionChange(event, value)
                          }} >
                            <MenuItem value={'Inactive'}>Inactive</MenuItem>
                            <MenuItem value={'Delete'}>Delete</MenuItem>
                          </Select>
                        }
                        {datatype === 'Inactive' &&
                          <Select onChange={(event, value) => {
                            onActionChange(event, value)
                          }} >
                            <MenuItem value={'Active'}>Active</MenuItem>
                            <MenuItem value={'Delete'}>Delete</MenuItem>
                          </Select>
                        }
                      </FormControl>
                    </div>
                  }
                  {(!user.op_type || user.op_type !== "S") &&
                    <div style={{ paddingTop: '2%' }} className="col-lg-2 col-sm-6 col-12">
                      <Button onClick={() => handleAction()} variant="contained" color="primary" className="jr-btn">
                        <i className="zmdi zmdi-flash zmdi-hc-fw" />
                        <span>Go</span>
                      </Button>
                    </div>
                  }
                  <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-6 col-sm-6 col-12">
                    <div className="jr-btn-group">
                      {(!user.op_type || user.op_type !== "S") &&
                        <Button onClick={() => toggle(true, '')} variant="contained" color="primary" className="jr-btn">
                          <i className="zmdi zmdi-plus zmdi-hc-fw" />
                          <span>Add</span>
                        </Button>
                      }
                      <Button onClick={() => getAllActive()} variant="contained" className="jr-btn bg-success text-white">
                        <i className="zmdi zmdi-check zmdi-hc-fw" />
                        <span>Active ({activeCount})</span>
                      </Button>
                      <Button onClick={() => getAllInactive()} variant="contained" className="jr-btn bg-danger text-white">
                        <i className="zmdi zmdi-block zmdi-hc-fw" />
                        <span>Inactive ({inactiveCount})</span>
                      </Button>
                    </div>
                  </div>
                </form>
                <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Exam Sub Category</h4>
                <AppBar position="static" color="inherit" className="jr-border-radius">
                  <Toolbar>
                    <div className="col-lg-4 d-flex flex-column order-lg-1">
                      <FormControl className="w-100 mb-12">
                        <InputLabel htmlFor="age-simple">Master Category</InputLabel>
                        <Select onChange={(event, value) => {
                          handleMainCategorySearch(event, value)
                        }} value={searchcategoryId}
                        >
                          <MenuItem value={'M'}>--Master Category--</MenuItem>
                          {categoryitems}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-lg-4 d-flex flex-column order-lg-1">
                      <TextField
                        id="searchstring"
                        label={'Search'}
                        name={'searchstring'}
                        onChange={(event) => onSearchStringChange(event.target.value)}
                        defaultValue={searchString}
                        margin="normal" />
                    </div>
                    <div className="col-lg-2 d-flex flex-column order-lg-1">
                      <Button onClick={() => handleSearch()} variant="contained" color="primary" className="jr-btn">
                        <i className="zmdi zmdi-search zmdi-hc-fw" />
                        <span>Search</span>
                      </Button>
                    </div>
                    <div className="col-lg-2 d-flex flex-column order-lg-1">
                      <Button onClick={() => handleReset()} variant="contained" color="primary" className="jr-btn">
                        <i className="zmdi zmdi-format-clear-all zmdi-hc-fw" />
                        <span>Reset</span>
                      </Button>
                    </div>
                  </Toolbar>
                </AppBar>
                <MDBDataTable
                  striped
                  bordered
                  entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
                  entries={100}
                  hover
                  data={{ rows: categoryrows, columns }}
                  small
                  responsive
                  noBottomColumns
                  disableRetreatAfterSorting={true} />
                <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
                  <Spin spinning={saveLoader} tip={'Loading...'}>
                    <ModalHeader className="modal-box-header bg-primary text-white">
                      {isEdit === false ? "Add Exam Sub Category" :
                        "Edit Exam Sub Category"}
                    </ModalHeader>
                    <div className="modal-box-content">
                      <div className="row no-gutters">
                        <div className="col-lg-12 d-flex flex-column order-lg-1">

                          <FormControl className="w-100 mb-2">
                            <InputLabel htmlFor="age-simple">Master Category</InputLabel>
                            <Select onChange={(event, value) => {
                              handleMainCategoryChange(event, value)
                            }} value={maincategoryId}
                            >
                              <MenuItem value={'M'}>--Master Category--</MenuItem>
                              {categoryitems}
                            </Select>
                          </FormControl>

                          <FormControl className="w-100 mb-2">
                            <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                            <Select onChange={(event, value) => {
                              handleSubCategoryChange(event, value)
                            }} value={subcategoryId}
                            >
                              <MenuItem value={'M'}>--Select Main Category--</MenuItem>
                              {subcategoryitems}
                            </Select>
                          </FormControl>

                          <TextField
                            id="required"
                            label={'Sub Category Name'}
                            name={'SubCategoryName'}
                            onChange={(event) => onCategoryNameChange(event.target.value)}
                            defaultValue={categoryName}
                            onBlur={valiadateProperty}
                            margin="none" />
                          <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['SubCategoryName']}</h6></div>
                          <TextField
                            required
                            id="required"
                            label={'Slug'}
                            name={'Slug'}
                            onChange={(event) => setSlug(event.target.value)}
                            defaultValue={slug}
                            value={slug}
                            onBlur={valiadateProperty}
                            margin="normal" />
                          <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Slug']}</h6></div>
                          <TextField
                            required
                            id="required"
                            label={'Description'}
                            name={'Description'}
                            onChange={(event) => setExamDescription(event.target.value)}
                            defaultValue={examdescription}
                            onBlur={valiadateProperty}
                            margin="normal" />
                          <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Description']}</h6></div>
                        </div>
                        <div className="col-lg-12 d-flex flex-column order-lg-1">
                          <h3>Test Types (Except Previous Year Test)</h3>
                          <Table>
                            <TableBody>
                              {renderTestTypes()}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="col-lg-12 d-flex flex-column order-lg-1">
                          <h3>Chapter Types</h3>
                          <Table>
                            <TableBody>
                              {renderChapTypes()}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                    <ModalFooter>
                      {isEdit === false ?
                        <div className="d-flex flex-row">
                          <Button style={{ marginRight: '5%' }} onClick={() => saveExamMainCategory()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                          <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                        </div> :
                        <div className="d-flex flex-row">
                          <Button style={{ marginRight: '5%' }} onClick={() => updateExamMainCategory()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
                          <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                        </div>}
                    </ModalFooter>
                  </Spin>
                </Modal>
                <Snackbar
                  className="mb-3 bg-info"
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={showMessage}
                  message={alertMessage}
                />
              </div >
            </Spin>
          </>
        }
        {showExamsTable && !loader &&
          <ExamsDatatable examdata={examData} subId={subId} examtype={examType} openExams={openExams} />
        }
      </div>
    </>
  );
};

export default DataTable;