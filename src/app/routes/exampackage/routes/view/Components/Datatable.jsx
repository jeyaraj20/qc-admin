import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as examSubCategoryService from '../../../../../../services/examSubCategoryService';
import * as examPackageService from '../../../../../../services/examPackageService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Joi from 'joi-browser';

const DataTable = (props) => {
  const history = useHistory();
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [sellingprice, setSellingPrice] = useState('0');
  const [offerprice, setOfferPrice] = useState('0');
  const [packagename, setPackageName] = useState('');
  const [savedisabled, setSavedisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [categoryitems, setCategoryItems] = useState([]);
  const [subcategoryitems, setSubCategoryItems] = useState([]);
  const [subsubcategoryitems, setSubSubCategoryItems] = useState([]);
  const [chapteritems, setChapterItems] = useState([]);
  const [durationitems, setDurationItems] = useState([]);
  const [maincategoryId, setMainCategoryId] = useState('');
  const [subcategoryId, setSubCategoryId] = useState('');
  const [subsubcategoryId, setSubSubCategoryId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ "packageId": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [errors, setErrors] = useState({});
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');
  const [packageid, setPackageId] = useState('');
  const [durationRow, setDurationRow] = useState([]);

  const renderDurations = () => {
    let rowNum = 1;
    return durationRow.map((row, index) => {
      rowNum = rowNum + 1;
      const { durationId, price, rowsNo, addtype, deltype } = row //destructuring
      return (
        <div className="row">
          <FormControl
            margin="normal"
            style={{ marginLeft: "15px", marginRight: "15px" }}
            className="col-lg-3 col-sm-6 col-12"
          >
            <InputLabel htmlFor="age-simple">Duration</InputLabel>
            <Select
              onChange={(event, value) => {
                handleDurationChange(event, index);
              }}
              value={durationId}
            >
              {durationitems}
            </Select>
          </FormControl>
          <TextField
            style={{ marginLeft: "15px" }}
            autoComplete="off"
            required
            label={"Price"}
            onChange={(e) => onPriceChange(e, index)}
            value={price}
            margin="normal"
          />
          {addtype ? (
            <IconButton onClick={() => addDuration(rowNum)} className="icon-btn">
              <i className="zmdi zmdi-plus zmdi-hc-fw" />
            </IconButton>
          ) : (
              <IconButton onClick={() => removeDuration(rowsNo)} className="icon-btn">
                <i className="zmdi zmdi-delete zmdi-hc-fw" />
              </IconButton>
            )}
        </div>
      )
    })
  }

  const onPriceChange = (e, index) => {
    let newArr = [...durationRow]; // copying the old datas array
    newArr[index].price = e.target.value; // replace e.target.value with whatever you want to change it to
    setDurationRow(newArr); // ??
  }

  const handleDurationChange = async (event, index) => {
    let newArr = [...durationRow]; // copying the old datas array
    newArr[index].durationId = event.target.value;
    setDurationRow(newArr); // ??
  };

  const addDuration = (index) => {
    let nextRow = { rowsNo: index, durationId: '', price: '', addtype: false, deltype: true };
    setDurationRow(state => [...state, nextRow])
  }

  const removeDuration = (index) => {
    setDurationRow(durationRow.filter(item => item.rowsNo !== index));
  }

  let selectedCatArr = [];
  const onSelectAll = e => {
    let selected = selectedCat;
    let rowcount = 0;
    console.log(data);
    for (let row of data) {
      console.log(document.getElementById(row.exa_cat_id));
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
          setSelectedCategory({ "packageId": selectedCatArr });
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
          setSelectedCategory({ "packageId": selectedCatArr });
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
      label: 'Package Name',
      field: 'package_name',
      width: 100
    },
    {
      label: 'Master Category',
      field: 'mastercategory',
      sort: 'asc',
      width: 100,
    },
    {
      label: 'Main Category',
      field: 'maincategory',
      width: 100
    },
    {
      label: 'Sub Category',
      field: 'subcategory',
      width: 100
    },
    {
      label: 'Selling Price (INR)',
      field: 'selling_price',
      width: 100
    },
    {
      label: 'Package Date',
      field: 'package_date',
      width: 100
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 10,
    },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 50,
    },
  ]

  const handleRefresh = async () => {
    setLoader(true);
    const { data: res } = await examPackageService.getAllExamPackage('Y');
    const { category: categoryres } = res;
    setActiveCount(categoryres.length);
    setData(categoryres);
    const { data: inactiveres } = await examPackageService.getAllExamPackage('N');
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
    const { data: durationres } = await examPackageService.getAlldurations();
    const { durations: durations } = durationres;
    let durArr = [];
    for (let duration of durations) {
      durArr.push(<MenuItem value={duration.duration_id}>{duration.duration}</MenuItem>)
    }
    setDurationItems(durArr);
    setDataType('Active');
    setTxtClass('bg-success text-white');
    setTimeout(() => {
      setLoader(false)
    }, 1000);
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
      console.log(obj);
      let checkedflg = false;
      if (obj.package_status == "1")
        checkedflg = true;
      let maincat;
      let subcat;
      if (obj.maincategory == null) {
        maincat = "---"
      } else {
        maincat = obj.maincategory
      }
      if (obj.subcategory == null) {
        subcat = "---"
      } else {
        subcat = obj.subcategory
      }
      let row = {}
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.maincategory = <span>{maincat}</span>
      row.subcategory = <span>{subcat}</span>
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.package_id} id={obj.package_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      row.package_date = Moment(obj.package_date).format('DD-MM-YYYY');
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

  }

  const schema = {
    SellingPrice: Joi.string().required(),
    OfferPrice: Joi.string().required(),
    PackageName: Joi.string().required(),
  }

  const handleMainCategoryChange = async (event, value) => {
    console.log(event.target.value);
    setMainCategoryId(event.target.value);
    const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(event.target.value);
    const { category: categories } = subcategoryres;
    let itemArr = [];
    for (let subcategory of categories) {
      itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
    }
    setSubCategoryItems(itemArr);
  }

  const handleSubCategoryChange = async (event, value) => {
    console.log(event.target.value);
    setSubCategoryId(event.target.value);
    const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryByCatId(event.target.value);
    const { subcategory: subcategories } = subcategoryres;
    let itemArr = [];
    for (let subcategory of subcategories) {
      itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
    }
    setSubSubCategoryItems(itemArr);
  }

  const handleSubSubCategoryChange = async (event, value) => {
    console.log(event.target.value);
    setSubSubCategoryId(event.target.value);
    const { data: chapterres } = await exammainCategoryService.getExamChapterById(event.target.value);
    const { chapters: chapters } = chapterres;
    let itemArr = [];
    for (let chapter of chapters) {
      itemArr.push(<MenuItem value={chapter.chapt_id}>{chapter.chapter_name}</MenuItem>)
    }
    setChapterItems(itemArr);
  }

  const handleChapterChange = async (event, value) => {
    console.log(event.target.value);
    setChapterId(event.target.value);
  }


  let selectedCategoryArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedCategoryArr = selectedCategory.packageId;
    if (e.currentTarget.checked)
      obj.package_status = 1
    else
      obj.package_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.package_id)
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] == obj.package_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
    }
    setSelectedCategory({ "packageId": selectedCategoryArr });
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
        if (selectedCategory.packageId.length != 0) {
          await examPackageService.changeStatus(selectedCategoryObj);
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
        if (selectedCategory.packageId.length != 0) {
          await examPackageService.changeStatus(selectedCategoryObj);
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
        selectedCategoryObj.status = 'D';
        if (selectedCategory.packageId.length != 0) {
          await examPackageService.changeStatus(selectedCategoryObj);
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
  }

  const toggle = async (open, data) => {
    console.log(data);
    setErrors({});
    setModal(open);
    setDurationRow([
      { rowsNo: 1, durationId: '', price: '', addtype: true, deltype: false }
    ]);
    if (data) {
      setIsEdit(true);
      setPackageId(data.package_id);
      setPackageName(data.package_name);
      setSellingPrice(data.selling_price);
      setOfferPrice(data.offer_price);
      setMainCategoryId(data.master_cat);
      const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(data.master_cat);
      const { category: categories } = subcategoryres;
      let itemArr = [];
      for (let subcategory of categories) {
        itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
      }
      setSubCategoryItems(itemArr);
      setSubCategoryId(data.main_cat);
      const { data: subsubcategoryres } = await exammainCategoryService.getExamSubCategoryByCatId(data.main_cat);
      const { subcategory: subsubcategories } = subsubcategoryres;
      let subArr = [];
      for (let subcategory of subsubcategories) {
        subArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
      }
      setSubSubCategoryItems(subArr);
      setSubSubCategoryId(data.sub_cat);
      const { data: durationres } = await examPackageService.getExamDurationById(data.package_id);
      const { durations: examdurations } = durationres;
      let filterarr = [];
      examdurations.map((row, index) => {
        console.log(index);
        if (index == 0) {
          filterarr.push({ rowsNo: index + 1, durationId: row.duration_id, price: row.price, addtype: true, deltype: false })
        } else {
          filterarr.push({ rowsNo: index + 1, durationId: row.duration_id, price: row.price, addtype: false, deltype: true })
        }
      });
      setDurationRow(filterarr);
      const { data: chapterres } = await exammainCategoryService.getExamChapterById(data.sub_cat);
      const { chapters: chapters } = chapterres;
      let chapArr = [];
      for (let chapter of chapters) {
        chapArr.push(<MenuItem value={chapter.chapt_id}>{chapter.chapter_name}</MenuItem>)
      }
      setChapterItems(chapArr);
      setChapterId(data.chapt_id);
    } else {
      setPackageName('');
      setMainCategoryId('');
      setSubCategoryId('');
      setSubSubCategoryId('');
      setChapterId('');
      setSellingPrice('0');
      setOfferPrice('0');
      setIsEdit(false);
    }
  }

  const onModalClose = () => {
    setModal(false);
  };

  const getAllInactive = async () => {
    setLoader(true);
    setDataType('Inactive');
    setTxtClass('bg-danger text-white');
    const { data: inactiveres } = await examPackageService.getAllExamPackage('N');
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
    const { data: activeres } = await examPackageService.getAllExamPackage('Y');
    const { category: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const onSellingPriceChange = (price) => {
    setSellingPrice(price)
  }

  const onPackageNameChange = (name) => {
    setPackageName(name)
  }

  const onOfferPriceChange = (offprice) => {
    setOfferPrice(offprice)
  }

  const saveExamPackage = async () => {
    console.log(durationRow);
    if (packagename && maincategoryId) {
      let durArr = [];
      for (let duration of durationRow) {
        if (duration.durationId != "") {
          durArr.push(duration.durationId);
        }
        if (duration.price != "") {
          durArr.push(duration.price);
        }
      }
      console.log(durArr);
      if (durArr.length > 0) {
        let data = {};
        data.package_name = packagename;
        data.master_cat = maincategoryId;
        data.main_cat = subcategoryId;
        data.sub_cat = subsubcategoryId;
        data.chapt_id = chapterId;
        data.selling_price = sellingprice;
        //data.offer_price = offerprice;
        data.duration = durationRow;
        console.log(data);
        await examPackageService.saveExamPackage(data);
        setAlertMessage('Exam Package Added Successfully');
        await handleRefresh();
        setShowMessage(true);
        setModal(false);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      } else {
        setAlertMessage('Give atleast one Duration');
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

  const updateExamPackage = async () => {
    let data = {};
    data.package_name = packagename;
    data.master_cat = maincategoryId;
    data.main_cat = subcategoryId;
    data.sub_cat = subsubcategoryId;
    data.chapt_id = chapterId;
    data.selling_price = sellingprice;
    data.duration = durationRow;
    await examPackageService.updateExamPackage(packageid, data);
    setAlertMessage('Exam Package Updated Successfully');
    await handleRefresh();
    setShowMessage(true);
    setModal(false);
    setTimeout(() => {
      setShowMessage(false)
    }, 1500);
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
        {!loader &&
          <>
            <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
              <h2 className="title mb-3 mb-sm-0">Exam Package</h2>
            </div>
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
                        <MenuItem value={'Delete'}>Delete</MenuItem>
                      </Select>
                    }
                    {datatype == 'Inactive' &&
                      <Select onChange={(event, value) => {
                        onActionChange(event, value)
                      }} >
                        <MenuItem value={'Active'}>Active</MenuItem>
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
              <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Exam Package</h4>
              <MDBDataTable
                striped
                bordered
                entriesOptions={[5, 10, 20, 25, 50, 100]}
                entries={10}
                hover
                data={{ rows: categoryrows, columns }}
                small
                responsive
                noBottomColumns
                disableRetreatAfterSorting={true} />
              <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
                <ModalHeader className="modal-box-header bg-primary text-white">
                  {isEdit == false ? "Add Exam Package" :
                    "Edit Exam Package"}
                </ModalHeader>

                <div className="modal-box-content">
                  <div className="row no-gutters">
                    <div className="col-lg-12 d-flex flex-column order-lg-1">

                      <TextField
                        id="required"
                        label={'Package Name'}
                        name={'PackageName'}
                        onChange={(event) => onPackageNameChange(event.target.value)}
                        defaultValue={packagename}
                        onBlur={valiadateProperty}
                        margin="none" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['PackageName']}</h6></div>

                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Master Category</InputLabel>
                        <Select onChange={(event, value) => {
                          handleMainCategoryChange(event, value)
                        }} value={maincategoryId}
                        >
                          {categoryitems}
                        </Select>
                      </FormControl>

                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                        <Select onChange={(event, value) => {
                          handleSubCategoryChange(event, value)
                        }} value={subcategoryId}
                        >
                          {subcategoryitems}
                        </Select>
                      </FormControl>

                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Sub Category</InputLabel>
                        <Select onChange={(event, value) => {
                          handleSubSubCategoryChange(event, value)
                        }} value={subsubcategoryId}
                        >
                          {subsubcategoryitems}
                        </Select>
                      </FormControl>

                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Chapters</InputLabel>
                        <Select onChange={(event, value) => {
                          handleChapterChange(event, value)
                        }} value={chapterId}
                        >
                          {chapteritems}
                        </Select>
                      </FormControl>

                      <TextField
                        id="required"
                        label={'Selling Price'}
                        name={'SellingPrice'}
                        onChange={(event) => onSellingPriceChange(event.target.value)}
                        defaultValue={sellingprice}
                        onBlur={valiadateProperty}
                        margin="none" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['SellingPrice']}</h6></div>

                    </div>
                    <div className="col-lg-12 d-flex flex-column order-lg-1">
                      <h3>Subscriptions</h3>
                      <Table>
                        <TableBody>
                          {renderDurations()}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
                <ModalFooter>
                  {isEdit == false ?
                    <div className="d-flex flex-row">
                      <Button style={{ marginRight: '5%' }} onClick={() => saveExamPackage()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                      <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                    </div> :
                    <div className="d-flex flex-row">
                      <Button style={{ marginRight: '5%' }} onClick={() => updateExamPackage()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
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
          </>
        }
      </div>
    </>
  );
};

export default DataTable;