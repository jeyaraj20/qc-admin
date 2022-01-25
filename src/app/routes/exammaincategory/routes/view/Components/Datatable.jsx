import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import { exammainCategoryImageDir } from "../../../../../../config";
import * as utilService from '../../../../../../services/utilService';
import Snackbar from '@material-ui/core/Snackbar';
import Joi from 'joi-browser';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.css';
import IconSelect from 'react-select';
import iconOptions from './options'
import StarRatingComponent from 'react-star-rating-component';

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [position, setPosition] = useState('');
  const [examdescription, setExamDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [savedisabled, setSavedisabled] = useState(false);
  const [editthumbs, setEditthumbs] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [paymentFlag, setPaymentFlag] = useState('');
  const [viewEditImg, setviewEditImg] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [categoryitems, setCategoryItems] = useState([]);
  const [maincategoryId, setMainCategoryId] = useState('');
  const [examcattype, setExamcattype] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ "catId": [] });
  const [action, setAction] = useState('');
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({})
  const [selectAll, setSelectAll] = useState(false);
  const [masterdisabled, setMasterDisabled] = useState(false);
  const [rowsdata, setRowsData] = useState([]);
  const [selectedCat, setselectedCat] = useState({});
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');

  const [selectedIcon, setSelectedIcon] = useState({ value: "" });
  const handleIconChange = (value) => {
    setSelectedIcon(value);
  }

  const [rating, setRating] = useState("");
  const onStarClick = (stars) => {
    setRating(stars)
  }

  let selectedCatArr = [];
  let posArr = [];
  const onSelectAll = e => {
    let selected = selectedCat;
    posArr = changePositionData.values;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.exa_cat_id)) {
        document.getElementById(row.exa_cat_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.exa_cat_status = 1
          else
            row.exa_cat_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.exa_cat_id);
          selected[row.exa_cat_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedCategory({ "catId": selectedCatArr });
          let postionObj = {};
          postionObj.catId = row.exa_cat_id;
          postionObj.position = row.exa_cat_pos;
          posArr.push(postionObj);
          console.log(posArr);
          console.log(selectedCatArr);
          setChangePositionData({ "values": posArr });
        } else {

          if (e.currentTarget.checked)
            row.exa_cat_status = 1
          else
            row.exa_cat_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] == row.exa_cat_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          if (posArr.length != 0) {
            for (var s = 0; s < posArr.length; s++) {
              if (posArr[s].catId == row.exa_cat_id) {
                posArr.splice(s, 1);
              }
            }
          }
          console.log(posArr);
          console.log(selectedCatArr);
          setSelectedCategory({ "catId": selectedCatArr });
          setChangePositionData({ "values": posArr });
          //console.log(selectedCategoryArr);
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
    if (e.currentTarget.checked)
      obj.exa_cat_status = 1
    else
      obj.exa_cat_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking

    console.log(e.currentTarget.checked);
    console.log(selectedCategoryArr);
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.exa_cat_id)
      let postionObj = {};
      for (var i = 0; i < changePosArr.length; i++) {
        if (changePosArr[i].catId == obj.exa_cat_id) {
          changePosArr.splice(i, 1);
        }
      }
      postionObj.catId = obj.exa_cat_id;
      postionObj.position = obj.exa_cat_pos;
      changePosArr.push(postionObj);
      //console.log(changePositionArr);
      setChangePositionData({ "values": changePosArr });
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] == obj.exa_cat_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
      if (changePosArr.length != 0) {
        for (var s = 0; s < changePosArr.length; s++) {
          if (changePosArr[s].catId == obj.exa_cat_id) {
            changePosArr.splice(s, 1);
          }
        }
      }
      console.log(changePositionData);
      setChangePositionData({ "values": changePosArr });
      //console.log(selectedCategoryArr);
    }
    setSelectedCategory({ "catId": selectedCategoryArr });
  }


  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,

    },
    {
      label: 'Master Category',
      field: 'MasterName',
      width: 150,
    },
    {
      label: 'Category',
      field: 'exa_cat_name',
      width: 150,
    },
    {
      label: 'Position',
      field: 'exa_cat_pos',
      width: 20,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 10,
    },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 10,
    },
  ]


  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
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
    setSelectAll(false);
    const { data: res } = await exammainCategoryService.getAllQuestionMainCategory('Y');
    const { category: categoryres } = res;
    console.log(categoryres);
    setActiveCount(categoryres.length);
    setData(categoryres);
    setRowsData(categoryres);
    const { data: inactiveres } = await exammainCategoryService.getAllQuestionMainCategory('N');
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

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));
  const valiadateProperty = (e) => {
    console.log(e);
    let { name, value, className } = e.currentTarget;
    console.log(name);
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })

    if (error)
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
    else
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"

    if (name == 'Title')
      onCheckAlreadyExists(e.target.value);
    if (name == 'Slug')
      onCheckSlugExists(e.target.value);
  }
  const schema = {
    Title: Joi.string().required(),
    Slug: Joi.string().required(),
    Position: Joi.string().required(),
    ExamDescription: Joi.string().required(),

  }

  const onCheckAlreadyExists = async (name) => {
    try {
      if (name != "") {
        let data = {};
        data.table = 'tbl__exam_category';
        data.field = 'exa_cat_name';
        data.type = examcattype;
        data.value = name;
        data.uniqueId = 'exaid';
        if (isEdit) {
          data.id = 'exa_cat_id';
          data.idvalue = categoryId;
        } else {
          data.id = 0;
          data.idvalue = 0;
        }
        data.uniqueValue = maincategoryId;
        data.statusField = 'exa_cat_status';
        console.log(data);
        const { data: response } = await utilService.checkAlreadyExistsExamMainCat(data);
        console.log(response.count);
        if (response.count > 0) {
          setSavedisabled(true);
          setErrors({ ...errors, ['Title']: 'Title already exists', "errordetails": null })
        }
        else {
          setSavedisabled(false);
          setErrors({ ...errors, ['Title']: '', "errordetails": null })
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
        console.log(response.count);
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

  useEffect(() => {

    //if (data && data.length)
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
      let checkedflg = false;
      if (obj.exa_cat_status == "1")
        checkedflg = true;

      let row = {}
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      if (row.MasterName == null) {
        row.MasterName = obj.exa_cat_name
        row.exa_cat_name = "---"
      }
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.exa_cat_id} id={obj.exa_cat_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.exa_cat_pos = <input type="text" name={'pos' + obj.exa_cat_id}
        onChange={event => onPositionChange(event, obj, index)}
        style={{ width: '50px', textAlign: 'center', padding: '0px' }}
        value={obj.exa_cat_pos}
        className="form-control form-control-lg" />
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

      return row;
    })
    setCategoryrows(categoryrows);
  }

  const handleMainCategoryChange = (event, value) => {
    console.log(event.target.value);
    if (event.target.value == '0') {
      setMainCategoryId('0');
      setExamcattype('M');
    } else {
      setMainCategoryId(event.target.value);
      setExamcattype('C');
    }
    console.log(examcattype);
  }



  const onPositionChange = (e, obj, index) => {
    obj.exa_cat_pos = e.target.value
    data[index] = obj
    setData([...data])
  }


  const onActionChange = async (event, value) => {
    setAction(event.target.value);
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
        console.log(selectedCategoryObj);
        if (selectedCategory.catId.length != 0) {
          await exammainCategoryService.inactiveCategory(selectedCategoryObj);
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
        console.log(selectedCategoryObj);
        if (selectedCategory.catId.length != 0) {
          await exammainCategoryService.inactiveCategory(selectedCategoryObj);
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
        selectedCategoryObj.status = 'D';
        console.log(selectedCategoryObj);
        if (selectedCategory.catId.length != 0) {
          await exammainCategoryService.inactiveCategory(selectedCategoryObj);
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
        await exammainCategoryService.changePosition(changePositionData);
        setAlertMessage('Position successfully updated.');
        setChangePositionData({ "values": [] });
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
    setErrors({});
    setModal(open);
    if (data) {
      setIsEdit(true);
      setviewEditImg(true);
      if (data.examcat_type == 'M') {
        setMasterDisabled(true)
      } else {
        setMasterDisabled(false)
      }
      let slug = (data.exa_cat_name).replace(/ /g, "-").toLowerCase();
      console.log(data.exaid);
      setMainCategoryId(data.exaid);
      setCategoryName(data.exa_cat_name);
      setPosition(data.exa_cat_pos);
      setExamcattype(data.examcat_type);
      setExamDescription(data.exa_cat_desc);
      setSlug(slug);
      setCategoryId(data.exa_cat_id);
      setPaymentFlag(data.payment_flag);
      if (data.exa_icon_image) {
        setSelectedIcon(iconOptions.find(e => e.value == data.exa_icon_image));
      } else {
        setSelectedIcon({ value: "" });
      }
      data.exa_rating ? setRating(data.exa_rating) : setRating("");
      const editthumbs = (
        <div style={thumb} key={data.exa_cat_image}>
          <div style={thumbInner}>
            <img alt={data.exa_cat_image}
              src={exammainCategoryImageDir + '/' + data.exa_cat_image}
              style={img}
            />
          </div>
        </div>
      );
      setEditthumbs(editthumbs);
    } else {
      let position = activeCount + inactiveCount + 1;
      setPosition(position);
      setExamcattype('M');
      setMasterDisabled(false)
      setMainCategoryId('0');
      setCategoryName('');
      setSlug('');
      setExamDescription('');
      setSelectedIcon({ value: "" });
      setRating("");
      setIsEdit(false);
      setviewEditImg(false);
      setSavedisabled(false);
      setFiles([]);
    }
    console.log(data);
  }
  const handleSaveButton = () => {
    console.log(errors['SubCategoryName'], errors['Slug'], errors['Position'], errors['ExamDescription'])
    if (errors['categoryName'] != null || errors['categoryName'] == undefined || errors['slug'] != null || errors['slug'] == undefined || errors['files[0]'] != null || errors['files[0]'] == undefined || errors['position'] != null || errors['position'] == undefined || errors['examdescription'] != null || errors['examdescription'] == undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };
  const saveExamMainCategory = async () => {
    if (categoryName && slug && position && files[0]) {
      console.log(examcattype);
      const formData = new FormData();
      formData.append("exa_cat_image_url", files[0]);
      // formData.append("exa_cat_id", MainCategoryId);
      formData.append("exa_cat_name", categoryName);
      formData.append("exa_cat_slug", slug);
      formData.append("exaid", maincategoryId);
      formData.append("exaid_sub", 0);
      formData.append("examcat_type", examcattype);
      formData.append("exa_cat_pos", position);
      formData.append("exa_cat_desc", examdescription);
      formData.append("exa_icon_image", selectedIcon.value);
      formData.append("exa_rating", rating);
      formData.append("payment_flag", 'N');
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      await exammainCategoryService.saveExamMainCategory(formData);
      setAlertMessage('ExamMain Category Added Successfully');
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


  const editExamMainCategory = async () => {
    if (categoryName && slug && position) {
      const formData = new FormData();
      console.log(files[0]);
      formData.append("exa_cat_image_url", files[0]);
      formData.append("exa_cat_name", categoryName);
      formData.append("exa_cat_slug", slug);
      formData.append("exaid", maincategoryId);
      formData.append("exaid_sub", 0);
      formData.append("examcat_type", examcattype);
      formData.append("exa_cat_pos", position);
      formData.append("exa_cat_desc", examdescription);
      formData.append("exa_icon_image", selectedIcon.value);
      formData.append("exa_rating", rating);
      formData.append("payment_flag", paymentFlag);
      await exammainCategoryService.editExamMainCategory(categoryId, formData);
      setAlertMessage('ExamMain Category Updated Successfully');
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
    setDataType('Inactive');
    setTxtClass('bg-danger text-white');
    setAction('');
    const { data: inactiveres } = await exammainCategoryService.getAllQuestionMainCategory('N');
    const { category: inactivedata } = inactiveres;
    setData(inactivedata);
    setRowsData(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    setDataType('Active');
    setTxtClass('bg-success text-white');
    setAction('');
    const { data: activeres } = await exammainCategoryService.getAllQuestionMainCategory('Y');
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


  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Exam Main Category</h2>
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
        {!loader &&
          <div>
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
              <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-6 col-sm-6 col-12">
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
                </div>
              </div>
            </form>
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Exam Main Category</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100]}
              entries={5}
              hover
              data={{ rows: categoryrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}

            />
            <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit == false ? "Add ExamMain Category" :
                  "Edit ExamMain Category"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1">

                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">Master Category</InputLabel>
                      <Select onChange={(event, value) => {
                        handleMainCategoryChange(event, value)
                      }} value={maincategoryId}
                        disabled={masterdisabled}
                      >
                        <MenuItem value={'0'}>--Master Category--</MenuItem>
                        {categoryitems}
                      </Select>
                    </FormControl>


                    <TextField
                      id="required"
                      label={'Title'}
                      name={'Title'}
                      autoComplete={'off'}
                      onChange={(event) => onCategoryNameChange(event.target.value)}
                      defaultValue={categoryName}
                      onBlur={valiadateProperty}
                      margin="none" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Title']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Slug'}
                      name={'Slug'}
                      autoComplete={'off'}
                      onChange={(event) => setSlug(event.target.value)}
                      defaultValue={slug}
                      value={slug}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Slug']}</h6></div>

                    <TextField
                      required
                      id="required"
                      label={'Position'}
                      name={'Position'}
                      onChange={(event) => setPosition(event.target.value)}
                      defaultValue={position}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Position']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Exam Description'}
                      name={'ExamDescription'}
                      onChange={(event) => setExamDescription(event.target.value)}
                      defaultValue={examdescription}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['ExamDescription']}</h6></div>

                    {maincategoryId != 0 ?
                      <>
                        <label>Category Icon</label>
                        <IconSelect
                          value={selectedIcon}
                          onChange={handleIconChange}
                          options={iconOptions}
                          isClearable
                        />
                      </>
                      :
                      <>
                        <label>Ratings</label>
                        <div style={{ fontSize: 20 }}>
                          <StarRatingComponent
                            name="ratings"
                            starCount={5}
                            value={rating}
                            onStarClick={e => onStarClick(e)}
                          />
                        </div>
                      </>}

                  </div>
                  <div className="col-lg-2 d-flex flex-column order-lg-1">
                    <div className="dropzone-card">
                      <div className="dropzone">
                        <label style={{ color: 'black', fontWeight: '300' }}>LOGO (100w*100h)</label>
                        <div {...getRootProps({ className: 'dropzone-file-btn' })}>
                          <input {...getInputProps()} />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                      </div>
                      {viewEditImg == false ? <div className="dropzone-content" style={thumbsContainer}>
                        {thumbs}
                      </div> :
                        <div className="dropzone-content" style={thumbsContainer}>
                          {editthumbs}
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
              <ModalFooter>
                {isEdit == false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveExamMainCategory()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editExamMainCategory()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div>}
              </ModalFooter>
            </Modal>
            <Snackbar
              className="mb-3 bg-info"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={showMessage}
              message={alertMessage}
            />
          </div >
        }
      </div>
    </>
  );
};

export default DataTable;