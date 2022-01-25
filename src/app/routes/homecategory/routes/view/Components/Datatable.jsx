import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as homeCategoryService from '../../../../../../services/homeCategoryService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as utilService from '../../../../../../services/utilService';
import { homeCategoryImageDir } from "../../../../../../config";
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Joi from 'joi-browser';

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [position, setPosition] = useState('');
  const [files, setFiles] = useState([]);
  const [editthumbs, setEditthumbs] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [viewEditImg, setviewEditImg] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ "catId": [] });
  const [categorystatus, setCategorystatus] = useState([]);
  const [testTypesRow, setTestTypesRow] = useState([]);
  const [categoryitems, setCategoryItems] = useState([]);
  const [categoriesdata, setCategoriesData] = useState([]);
  const [action, setAction] = useState('');
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [catstateId, setCatstateId] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [posValue, setPosValue] = useState({});
  const [account, setAccount] = useState({});
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(true);
  const [selectedmaster, setSelectedMaster] = useState('');
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');

  const [myMap, setMyMap] = useState(new Map());
  const updateMap = (k, v) => {
    setMyMap(new Map(myMap.set(k, v)));
  }
  const changeMap = useCallback((k, v) => {
    setMyMap(myMap.set(k, v));
    setMyMap(state => { return state })
    console.log(categoryrows);
  }, [])

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

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,

    },
    {
      label: 'Category',
      field: 'exa_cat_name',
      width: 230,


    },
    {
      label: 'Position',
      field: 'exa_cat_pos',
      sort: 'asc',
      width: 10,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 5,
    },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px', marginLeft: '0px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 5,
    },
  ]

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    //marginTop: 16,
    margin: '30%'
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
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

  const schema = {
    Title: Joi.string().required(),
    Position: Joi.number().required(),
    Slug: Joi.string().required(),
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
    setSelectAll(false);
    const { data: res } = await homeCategoryService.getHomeCategory();
    const { category: categoryres } = res;
    const { count: activecount } = res;
    setActiveCount(activecount);
    setData(categoryres)
    const { data: inactiveres } = await homeCategoryService.getInactiveHomeCategory();
    const { category: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  let selectedFeatureArr = [];
  const onMenuSelect = (event, obj, index) => {
    console.log(selectedmaster);
    selectedFeatureArr = JSON.parse("[" + selectedmaster + "]");
    if (event.currentTarget.checked)
      obj.checked = true
    else
      obj.checked = false
    categoryitems[index] = obj
    setCategoryItems([...categoryitems])
    let str;
    if (event.currentTarget.checked) {
      selectedFeatureArr.push(event.target.value)
      str = selectedFeatureArr.toString();
    } else {
      for (var i = 0; i < selectedFeatureArr.length; i++) {
        if (selectedFeatureArr[i] == obj.exa_cat_id) {
          selectedFeatureArr.splice(i, 1);
          str = selectedFeatureArr.toString();
        }
      }
    }
    setSelectedMaster(str);
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

  const mapMasterCategory = (rows) => {
    let itemArr = [];
    let categoryrowsdata = rows.map((obj, index) => {
      if (obj.checked)
        itemArr.push(<div className="col-lg-4"><Checkbox color="primary" id={'feat' + obj.exa_cat_id} checked={obj.checked} onChange={(e) => { onMenuSelect(e, obj, index) }} value={obj.exa_cat_id} />  <span>{obj.exa_cat_name}</span></div>);
      else
        itemArr.push(<div className="col-lg-4"><Checkbox color="primary" id={'feat' + obj.exa_cat_id} checked={false} onChange={(e) => { onMenuSelect(e, obj, index) }} value={obj.exa_cat_id} />  <span>{obj.exa_cat_name}</span></div>);
      setCategoriesData(itemArr);
    })
  }



  useEffect(() => {
    if (categoryitems && categoryitems.length)
      mapMasterCategory(categoryitems);
  }, [categoryitems])

  useEffect(() => {

    //if (data && data.length)
    mapRows(data);
  }, [data])

  useEffect(() => () => {
    //handleRefresh();
    console.log("use effect");

    files.forEach(file => window.webkitURL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => () => {
    //handleRefresh();
    console.log(checked);

  }, [checked]);


  useEffect(() => {
    console.log("use effect");
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])


  let rowcount = 0;
  const mapRows = (rows) => {
    console.log(rows);
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))

    let categoryrowsdata = rows.map((obj, index) => {

      let checkedflg = false;
      if (obj.exa_cat_status == "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order

      row.select = <MDBInput style={{ marginTop: '0px', width: '20px', marginLeft: '0px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.exa_cat_id} id={obj.exa_cat_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;



      row.sno = <span>{rowcount}</span>
      row.exa_cat_pos = <input type="text" name={'pos' + obj.exa_cat_id}
        onChange={event => onPositionChange(event, obj, index)}
        style={{ width: '50px', textAlign: 'center', padding: '0px' }}
        value={obj.exa_cat_pos}
        className="form-control form-control-lg" />
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      return row;
    })
    setCategoryrows(categoryrowsdata);
  }



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

  const onPositionChange = (e, obj, index) => {
    obj.exa_cat_pos = e.target.value
    data[index] = obj
    setData([...data])
  }


  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }

  const deleteImage = () => {
    setviewEditImg(false);
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
          await homeCategoryService.inactiveCategory(selectedCategoryObj);
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
      if (action == 'Active') {
        selectedCategoryObj.status = 'Y';
        console.log(selectedCategoryObj);
        if (selectedCategory.catId.length != 0) {
          await homeCategoryService.inactiveCategory(selectedCategoryObj);
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
      if (action == 'Delete') {
        console.log(selectedCategory);
        if (selectedCategory.catId.length != 0) {
          await homeCategoryService.deleteCategory(selectedCategory);
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
    if (action == 'Position') {
      console.log(changePositionData);
      if (changePositionData.values.length != 0) {
        await homeCategoryService.changePosition(changePositionData);
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

  const toggle = async (open, data) => {
    setSelectedMaster('');
    setErrortext(false);
    setErrors({});
    setModal(open);
    if (data) {
      console.log(data);
      setIsEdit(true);
      setviewEditImg(true);
      let slug = (data.exa_cat_name).replace(/ /g, "-").toLowerCase();
      setCategoryName(data.exa_cat_name);
      setPosition(data.exa_cat_pos);
      setSlug(slug);
      setCategoryId(data.exa_cat_id);
      const { data: mastercategoryres } = await exammainCategoryService.getHomeExamMasterCategory(data.exa_cat_id);
      const { mastercategory: mastercategories } = mastercategoryres;
      var catArr = '';
      if (mastercategoryres.count > 0) {
        catArr = JSON.parse("[" + mastercategories[0].exa_cat_id + "]");
        console.log(catArr);
        setSelectedMaster(catArr);
      }
      const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
      const { category: categories } = maincategoryres;
      if (catArr != '') {
        for (let i = 0; i < catArr.length; i++) {
          for (let s = 0; s < categories.length; s++) {
            if (catArr[i] == categories[s].exa_cat_id) {
              categories[s].checked = true
            }
          }
        }
      }
      setCategoryItems(categories);
      const editthumbs = (
        <div style={thumb} key={data.exa_cat_image}>
          <div style={thumbInner}>
            <img alt={data.exa_cat_image}
              src={homeCategoryImageDir + '/' + data.exa_cat_image}
              style={img}
            />
          </div>
        </div>
      );
      setEditthumbs(editthumbs);
    } else {
      let position = activeCount + inactiveCount + 1;
      setPosition(position);
      setCategoryName('');
      setSlug('');
      setIsEdit(false);
      const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
      const { category: categories } = maincategoryres;
      for (let s = 0; s < categories.length; s++) {
        categories[s].checked = false
      }
      setCategoryItems(categories);
      setviewEditImg(false);
      setSavedisabled(false);
      setFiles([]);
    }
  }

  const saveHomeCategory = async () => {
    if (categoryName && slug && position && files[0]) {
      const formData = new FormData();
      console.log(files[0]);
      formData.append("exa_cat_image_url", files[0]);
      formData.append("exa_cat_name", categoryName);
      formData.append("exa_cat_slug", slug);
      formData.append("exaid", 0);
      formData.append("exaid_sub", 0);
      formData.append("examcat_type", 'M');
      formData.append("exa_cat_pos", position);
      formData.append("exa_cat_desc", '');
      formData.append("exa_cat_id", selectedmaster);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      await homeCategoryService.saveHomeCategory(formData);
      setAlertMessage('Home Category Added Successfully');
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

  const editHomeCategory = async () => {
    if (categoryName && slug && position) {
      if (!setviewEditImg && !files[0]) {
        setAlertMessage('Please Give All Required Fields');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
      else {
        const formData = new FormData();
        console.log(files[0]);
        formData.append("exa_cat_image_url", files[0]);
        formData.append("exa_cat_name", categoryName);
        formData.append("exa_cat_slug", slug);
        formData.append("exaid", 0);
        formData.append("exaid_sub", 0);
        formData.append("examcat_type", 'M');
        formData.append("exa_cat_pos", position);
        formData.append("exa_cat_desc", '');
        formData.append("exa_cat_id", selectedmaster);
        await homeCategoryService.editHomeCategory(categoryId, formData);
        setAlertMessage('Home Category Updated Successfully');
        await handleRefresh();
        setShowMessage(true);
        setModal(false);
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

  const valiadateProperty = (e) => {
    console.log(e);
    let { name, value, className } = e.currentTarget;
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })
    //handleSaveButton();
    // if (errors)
    // setSavedisabled(true);
    // else
    // setSavedisabled(false);
    if (name == 'Title')
      onCheckCategoryExists(e.target.value);
    if (name == 'Slug')
      onCheckSlugExists(e.target.value);
  }

  const handleSaveButton = () => {
    console.log(errors['Title'], errors['Position'])
    if (errors['Title'] != null || errors['Title'] == undefined || errors['Position'] != null || errors['Position'] == undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };

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
    const { data: inactiveres } = await homeCategoryService.getInactiveHomeCategory();
    const { category: inactivedata } = inactiveres;
    setData(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    setDataType("Active");
    setTxtClass('bg-success text-white');
    const { data: activeres } = await homeCategoryService.getHomeCategory();
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

  const onCheckCategoryExists = async (name) => {
    try {
      if (name != "") {
        let data = {};
        data.table = 'tbl__home_category';
        data.field = 'exa_cat_name';
        data.value = name;
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
          setErrortext(true);
        }
        else {
          setSavedisabled(false);
          setErrortext(false);
        }
      }
    } catch (err) {
      if (err) {
        setSavedisabled(false);
        setErrortext(false);
      }
    }
  }

  const onCheckSlugExists = async (slug) => {
    try {
      if (slug != "") {
        let data = {};
        data.table = 'tbl__home_category';
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
          setErrortext(false);
        }
      }
    } catch (err) {
      if (err) {
        setSavedisabled(false);
        setErrortext(false);
      }
    }
  }


  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Home Category</h2>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Homecategory</h4>
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
                {isEdit == false ? "Add Home Category" :
                  "Edit Home Category"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1">
                    <TextField
                      id="required"
                      label={'Title'}
                      name={'Title'}
                      autoComplete={'off'}
                      onChange={(event) => onCategoryNameChange(event.target.value)}
                      //onBlur={(event) => onCheckCategoryExists(event.target.value)}
                      onBlur={valiadateProperty}
                      defaultValue={categoryName}
                      margin="none" />
                    {errortext && !isEdit &&
                      <h6 style={{ color: 'red', paddingTop: '1%' }}>Home Category already exists</h6>
                    }
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Title']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Slug'}
                      name={'Slug'}
                      autoComplete={'off'}
                      onChange={(event) => setSlug(event.target.value)}
                      onBlur={valiadateProperty}
                      defaultValue={slug}
                      value={slug}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Slug']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Position'}
                      name={'Position'}
                      onChange={(event) => setPosition(event.target.value)}
                      onBlur={valiadateProperty}
                      defaultValue={position}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Position']}</h6></div>
                  </div>
                  <div className="col-lg-2 d-flex flex-column order-lg-1">
                    <div className="dropzone-card">
                      {!viewEditImg &&
                        <div style={{ margin: '30%' }} className="dropzone">
                          <label style={{ color: 'black', fontWeight: '300' }}>LOGO (100w*100h)</label>
                          <div {...getRootProps({ className: 'dropzone-file-btn' })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                          </div>
                        </div>
                      }
                      {viewEditImg == false ? <div className="dropzone-content" style={thumbsContainer}>
                        {thumbs}
                      </div> :
                        <div className="dropzone-content" style={thumbsContainer}>
                          {editthumbs}
                          <Button onClick={() => deleteImage()} variant="contained" className="jr-btn bg-danger text-white">
                            <i className="zmdi zmdi-delete zmdi-hc-fw" />
                          </Button>
                          <label style={{ color: 'black', fontWeight: '600' }}>LOGO (100w*100h)</label>
                        </div>}
                    </div>
                  </div>
                </div>
                <div className="row no-gutters">
                  {
                    categoriesdata
                  }
                </div>
              </div>
              <ModalFooter>
                {isEdit == false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveHomeCategory()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editHomeCategory()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
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
          </div>
        }
      </div>
    </>
  );
};

export default DataTable;