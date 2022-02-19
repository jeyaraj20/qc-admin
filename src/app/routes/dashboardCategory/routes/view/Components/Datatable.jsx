import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as DashboardCategoryService from '../../../../../../services/dashboardCategoryService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as utilService from '../../../../../../services/utilService';
import { Modal as AntdModal } from 'antd';
//import { getdashboardCategory } from 'actions/dashboardCategory';
//import { DashboardCategoryImageDir } from "../../../../../../config";
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Joi from 'joi-browser';

const DataTable = (props) => {
  const [CatImage, setImage] = useState('');
  const [data, setData] = useState([])
  const [catId, setcatId] = useState('')
  const [CatDesc, setCatDesc] = useState('0');
  const [modal, setModal] = useState(false)
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [position, setPosition] = useState('');
  const [files, setFiles] = useState([]);
  const [editthumbs, setEditthumbs] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [deletedashboard, setdelete] = useState(false);//
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
  }, [])

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
            row.isSelected = true;
          else
            row.isSelected = false;
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
          setChangePositionData({ "values": posArr });
        } else {

          if (e.currentTarget.checked)
            row.isSelected = 1
          else
            row.isSelected = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] === row.cat_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          if (posArr.length != 0) {
            for (var s = 0; s < posArr.length; s++) {
              if (posArr[s].catId === row.cat_id) {
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


  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,

    },
    {
      label: 'Category',
      field: 'cat_name',
      width: 230
    },
    {
      label: 'Position',
      field: 'cat_pos',
      sort: 'asc',
      width: 10,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 5,
    },
    {
      label: 'Delete',
      field: 'delete',
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
    onDrop: async acceptedFiles => {
      const formData = new FormData();
      formData.append('dashboard', acceptedFiles[0]);
      let result = await DashboardCategoryService.imageUpload(formData);
      if (result && result.data && result.data.statusCode && result.data.statusCode === 200) {
        setImage(result.data.data);
      }
    }
  });

  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    const { data: res } = await DashboardCategoryService.getDashboardCategory();
    const { category: categoryres } = res;
    const { count: activecount } = res;
    setActiveCount(activecount);
    setData(categoryres)
    const { data: inactiveres } = await DashboardCategoryService.getInactiveDashboardCategory();
    const { category: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  let selectedFeatureArr = [];
  const onMenuSelect = (event, obj, index) => {
    selectedFeatureArr = JSON.parse("[" + selectedmaster + "]");
    let str = ''
    let array = [...categoryitems]
    if (event.currentTarget.checked){
      selectedFeatureArr.push(event.target.value)
      str = selectedFeatureArr.toString();
      obj.checked = true
    }else{
      obj.checked = false
      for (var i = 0; i < selectedFeatureArr.length; i++) {
        if (selectedFeatureArr[i] === obj.cat_id) {
          selectedFeatureArr.splice(i, 1);
          str = selectedFeatureArr.toString();
        }
      }
    }
    array[index] = obj
    setCategoryItems([...array])
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
    rows.map((obj, index) => {
      if (obj.checked)
        itemArr.push(<div className="col-lg-4"><Checkbox color="primary" checked={obj.checked} onChange={(e) => { onMenuSelect(e, obj, index) }} value={obj.exa_cat_id} />  <span>{obj.exa_cat_name}</span></div>);
      else
        itemArr.push(<div className="col-lg-4"><Checkbox color="primary" checked={false} onChange={(e) => { onMenuSelect(e, obj, index) }} value={obj.exa_cat_id} />  <span>{obj.exa_cat_name}</span></div>);
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
    files.forEach(file => window.webkitURL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => () => {
  }, [checked]);

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
    let categoryrowsdata = rows.map((obj, index) => {
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px', marginLeft: '0px' }}
        label="." type="checkbox"
        checked={obj.isSelected}
        name={obj.cat_id} id={obj.cat_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.cat_pos = <input type="text" name={'pos' + obj.cat_id}
        onChange={event => onPositionChange(event, obj, index)}
        style={{ width: '50px', textAlign: 'center', padding: '0px' }}
        value={obj.cat_pos}
        className="form-control form-control-lg" />
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      row.delete = <IconButton onClick={() => deleteOneDashboardCategory(obj)} className="icon-btn">
        <i className="zmdi zmdi-delete zmdi-hc-fw" /></IconButton>

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
      obj.isSelected = true;
    else
      obj.isSelected = false;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.cat_id)
      let postionObj = {};
      for (var i = 0; i < changePosArr.length; i++) {
        if (changePosArr[i].catId === obj.cat_id) {
          changePosArr.splice(i, 1);
        }
      }
      postionObj.catId = obj.cat_id;
      postionObj.position = obj.cat_pos;
      changePosArr.push(postionObj);
      setChangePositionData({ "values": changePosArr });
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] === obj.cat_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
      if (changePosArr.length != 0) {
        for (var s = 0; s < changePosArr.length; s++) {
          if (changePosArr[s].catId === obj.cat_id) {
            changePosArr.splice(s, 1);
          }
        }
      }
      setChangePositionData({ "values": changePosArr });
    }
    setSelectedCategory({ "catId": selectedCategoryArr });
  }

  const onPositionChange = (e, obj, index) => {
    obj.cat_pos = e.target.value
    data[index] = obj
    setData([...data])
  }


  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }

  const deleteImage = () => {
    setviewEditImg(false);
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
          await DashboardCategoryService.inactiveCategory(selectedCategoryObj);
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
          await DashboardCategoryService.inactiveCategory(selectedCategoryObj);
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
            await DashboardCategoryService.deleteCategory(selectedCategory);
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
        await DashboardCategoryService.changePosition(changePositionData);
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

  const toggle = async (open, data) => {
    setSelectedMaster('');
    setErrortext(false);
    setErrors({});
    setModal(open);
    if (data) {
      setIsEdit(true);
      setviewEditImg(true);
      let slug = (data.cat_name).replace(/ /g, "-").toLowerCase();
      setCategoryName(data.cat_name);
      setPosition(data.cat_pos);
      setSlug(slug);
      setCategoryId(data.cat_id);
      let catArr = data.master_ids ? data.master_ids.split(',') : [];
      setSelectedMaster(catArr);
      setImage(data.cat_image);
  
      
      const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
      const { category: categories } = maincategoryres;
      if (catArr.length > 0) {
        for (let i = 0; i < catArr.length; i++) {
          for (let s = 0; s < categories.length; s++) {
            if (Number(catArr[i]) === categories[s].exa_cat_id) {
              categories[s].checked = true
            }
          }
        }
      }
      setCategoryItems(categories);
      const editthumbs = (
        <div style={thumb} key={data.cat_image}>
          <div style={thumbInner}>
            <img src={data.cat_image}
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

  const saveDashboardCategory = async () => {
    if (categoryName && slug && position && CatImage !== "") {
      let obj = {
        "cat_image": CatImage,
        "cat_name": categoryName,
        "cat_slug": slug,
        "cat_pos": position,
        "cat_desc": CatDesc,
        "master_ids": selectedmaster
      }

      await DashboardCategoryService.saveDashboardCategory(obj);
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

  const editDashboardCategory = async () => {
    if (categoryName && slug && position && CatImage && categoryId && selectedmaster ) {
      let obj = {
        "cat_id":categoryId,
        "cat_image": CatImage,
        "cat_name": categoryName,
        "cat_slug": slug,
        "cat_pos": position,
        "cat_desc": CatDesc,
        "master_ids": selectedmaster
      }
      await DashboardCategoryService.editDashboardCategory(categoryId, obj);
      setAlertMessage('Dashboard Category Updated Successfully');
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


  const deleteOneDashboardCategory = (id) => {
    AntdModal.confirm({
      title: 'Confirm',
      content: 'Do you want to delete this DashboardCategory.',
      okText: 'Yes',
      onOk: () => deleteOneCategory(id),
      cancelText: 'No',
    });
  }

  const deleteOneCategory = async (id) => {
    const catId = id.cat_id
    if (catId) {
      if (selectedCategory.catId = id.cat_id) {
        await DashboardCategoryService.deleteCategory(selectedCategory);
        setAlertMessage('Data successfully deleted.');
        await handleRefresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
      else {
        let obj = { "cat_id": catId }
        await DashboardCategoryService.deleteCategory(selectedCategory, obj);
        setAlertMessage('Dashboard Category Updated Successfully');
        await handleRefresh();
        setShowMessage(true);
        setModal(false);
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


  const valiadateProperty = (e) => {
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
    if (name === 'Title')
      onCheckCategoryExists(e.target.value);
    if (name === 'Slug')
      onCheckSlugExists(e.target.value);
  }

  const onModalClose = () => {
    setModal(false);
    setSavedisabled(false);
  };

  const getAllInactive = async () => {
    setLoader(true);
    setDataType("Inactive");
    setTxtClass('bg-danger text-white');
    const { data: inactiveres } = await DashboardCategoryService.getInactiveDashboardCategory();
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
    const { data: activeres } = await DashboardCategoryService.getDashboardCategory();
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
      if (name !== "") {
        let data = {};
        data.table = 'tbl__dashboard_category';
        data.field = 'cat_name';
        data.data = 'cat_image'
        data.value = name;
        data.uniqueId = 'cat_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'cat_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
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
        data.table = 'tbl__dashboard_category';
        data.field = 'cat_slug';
        data.data = 'cat_image'
        data.value = slug;
        data.uniqueId = 'cat_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'cat_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
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
        <h2 className="title mb-3 mb-sm-0">Dashboard Category</h2>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} DashboardCategory</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
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
                {isEdit === false ? "Add Dashboard Category" :
                  "Edit Dashboard Category"}
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
                      <h6 style={{ color: 'red', paddingTop: '1%' }}>Dashboard Category already exists</h6>
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
                            {CatImage == "" && <p>Drag 'n' drop some files here, or click to select files</p>}
                            {CatImage != "" && <img src={CatImage} />}
                          </div>
                        </div>
                      }
                      {viewEditImg === false ? <div className="dropzone-content" style={thumbsContainer}>
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
                {isEdit === false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveDashboardCategory()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editDashboardCategory()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
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