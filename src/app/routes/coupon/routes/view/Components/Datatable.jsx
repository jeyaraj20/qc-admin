import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import * as qbankCategoryService from '../../../../../../services/qbankCategoryService';
import * as couponService from '../../../../../../services/couponService';
import * as utilService from '../../../../../../services/utilService';
import auth from '../../../../../../services/authService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Joi from 'joi-browser';
import { DatePicker } from '@material-ui/pickers';
import Moment from "moment";

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [couponId, setCouponId] = useState('');
  const [couponName, setCouponName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState(0);
  const [couponValueType, setCouponValueType] = useState('');
  const [cartValueRange, setCartValueRange] = useState(0);
  const [cartValueRangeType, setCartValueRangeType] = useState('Less Than');
  const [cartValue, setCartValue] = useState(0);
  const [noOfUsage, setNoOfUsage] = useState('');
  const [noOfUsageUser, setNoOfUsageUser] = useState('');
  const [fromDate, setFromDate] = useState(Moment(new Date()).format('MM-DD-YYYY'));
  const [toDate, setToDate] = useState(Moment(new Date()).format('MM-DD-YYYY'));
  const [slug, setSlug] = useState('');
  const [position, setPosition] = useState('');
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ "couponId": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({})
  const [checked, setChecked] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [datatype, setDataType] = useState('');
  const [txtclass, setTxtClass] = useState('');
  const [usertype, setUserType] = useState('');

  let selectedCatArr = [];
  const onSelectAll = e => {
    let selected = selectedCat;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.coupon_id)) {
        document.getElementById(row.coupon_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.coupon_status = 1
          else
            row.coupon_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.coupon_id);
          selected[row.coupon_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedCategory({ "couponId": selectedCatArr });
        } else {

          if (e.currentTarget.checked)
            row.coupon_status = 1
          else
            row.coupon_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] === row.coupon_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          console.log(selectedCatArr);
          setSelectedCategory({ "couponId": selectedCatArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedCat(selected);
      rowcount = rowcount + 1;
    }
  };


  let selectedCategoryArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedCategoryArr = selectedCategory.couponId;
    if (e.currentTarget.checked)
      obj.coupon_status = 1
    else
      obj.coupon_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking

    console.log(e.currentTarget.checked);
    console.log(selectedCategoryArr);
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.coupon_id)
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] === obj.coupon_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
    }
    setSelectedCategory({ "couponId": selectedCategoryArr });
  }


  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Coupon Name',
      field: 'coupon_name',
      width: 50,
    },
    {
      label: 'Coupon Code',
      field: 'coupon_code',
      width: 50,
    },
    {
      label: 'Coupon Value',
      field: 'coupon_value',
      width: 50,
    },
    {
      label: 'Type',
      field: 'coupon_value_type',
      width: 50,
    },
    {
      label: 'No. of Usage',
      field: 'no_of_usage',
      width: 50,
    },
    {
      label: 'From Date',
      field: 'from_date',
      width: 50,
    },
    {
      label: 'Expiry Date',
      field: 'to_date',
      width: 50,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 10,
    },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px', marginLeft: '0px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 10,
    }
  ]


  const handleRefresh = async () => {
    setLoader(true);
    let user = auth.getCurrentUser();
    setUserType(user.user.logintype);
    setSelectAll(false);
    setDataType('Active');
    setTxtClass('bg-success text-white');
    const { data: res } = await couponService.getAllCoupon('Y');
    const { coupon: categoryres } = res;
    let activecount = categoryres.length;
    setActiveCount(activecount);
    setData(categoryres)
    const { data: inactiveres } = await couponService.getAllCoupon('N');
    const { coupon: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
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
      if (obj.coupon_status === "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px', marginLeft: '0px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.coupon_id} id={obj.coupon_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.from_date = Moment(row.from_date).format('DD-MM-YYYY');
      row.to_date = Moment(row.to_date).format('DD-MM-YYYY');
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

      return row;
    })
    setCategoryrows(categoryrowsdata);
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
        if (selectedCategory.couponId.length != 0) {
          await couponService.changeStatus(selectedCategoryObj);
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
        if (selectedCategory.couponId.length != 0) {
          await couponService.changeStatus(selectedCategoryObj);
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
    }
  }

  const toggle = (open, data) => {
    console.log(data);
    setErrors({});
    setModal(open);
    if (data) {
      setIsEdit(true);
      setCouponId(data.coupon_id);
      setCouponName(data.coupon_name);
      setCouponCode(data.coupon_code);
      setCouponValue(data.coupon_value);
      setCouponValueType(data.coupon_value_type);
      setCartValueRangeType(data.cart_value_range_type);
      setCartValueRange(data.cart_value_range);
      setCartValue(data.cart_value);
      setNoOfUsage(data.no_of_usage);
      setNoOfUsageUser(data.no_of_usage_user);
      setFromDate(Moment(data.from_date).format('MM-DD-YYYY'));
      setToDate(Moment(data.to_date).format('MM-DD-YYYY'));
    } else {
      setIsEdit(false);
      setCouponName('');
      setCouponCode('');
      setCouponValue('');
      setCouponValueType('');
      setCartValueRangeType('');
      setCartValueRange('');
      setCartValue('');
      setNoOfUsage('');
      setNoOfUsageUser('');
      setFromDate(Moment(new Date).format('MM-DD-YYYY'));
      setToDate(Moment(new Date).format('MM-DD-YYYY'));
    }
    console.log(data);
  }
  const handleSaveButton = () => {
    console.log(errors['Title'], errors['Slug'], errors['Position'])
    if (errors['categoryName'] != null || errors['categoryName'] === undefined || errors['slug'] != null || errors['slug'] === undefined || errors['position'] != null || errors['position'] === undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };
  const saveCoupon = async () => {
    if (couponName && couponCode && couponValue && noOfUsage && noOfUsageUser) {
      let data = {};
      data.coupon_name = couponName;
      data.coupon_code = couponCode;
      data.coupon_value = couponValue;
      data.coupon_value_type = couponValueType;
      data.cart_value_range = cartValueRange;
      data.cart_value_range_type = cartValueRangeType;
      data.cart_value = cartValue;
      data.no_of_usage = noOfUsage;
      data.no_of_usage_user = noOfUsageUser;
      data.from_date = fromDate;
      data.to_date = toDate;
      console.log(data);
      await couponService.saveCoupon(data);
      setAlertMessage('Coupon Added Successfully');
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

  const editCoupon = async () => {
    let data = {};
    data.coupon_name = couponName;
    data.coupon_code = couponCode;
    data.coupon_value = couponValue;
    data.coupon_value_type = couponValueType;
    data.cart_value_range = cartValueRange;
    data.cart_value_range_type = cartValueRangeType;
    data.cart_value = cartValue;
    data.no_of_usage = noOfUsage;
    data.no_of_usage_user = noOfUsageUser;
    data.from_date = fromDate;
    data.to_date = toDate;
    console.log(data);
    await couponService.updateCoupon(couponId, data);
    setAlertMessage('Coupon Updated Successfully');
    await handleRefresh();
    setShowMessage(true);
    setModal(false);
    setTimeout(() => {
      setShowMessage(false)
    }, 1500);
  }

  const valiadateProperty = (e) => {
    console.log(e);
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
    CouponName: Joi.string().required(),
    CouponCode: Joi.string().required(),
    CouponValue: Joi.string().required(),
    CartValueRange: Joi.string().required(),
    noofusage: Joi.string().required(),
    noofusageuser: Joi.string().required(),
    fromdate: Joi.string().required(),
    todate: Joi.string().required(),
  }

  const onCheckAlreadyExists = async (name) => {
    try {
      if (name != "") {
        let data = {};
        if (usertype === 'G') {
          data.table = 'tbl__category';
        } else {
          data.table = 'tbl__school_question_category';
        }
        data.field = 'cat_name';
        data.value = name;
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
    setAction('');
    const { data: inactiveres } = await couponService.getAllCoupon('N');
    const { coupon: inactivedata } = inactiveres;
    setData(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    setDataType("Active");
    setTxtClass('bg-success text-white');
    setAction('');
    const { data: activeres } = await couponService.getAllCoupon('Y');
    const { coupon: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const handleFromDateChange = (date) => {
    let fromdate = Moment(date).format('YYYY-MM-DD');
    console.log(fromdate);
    setFromDate(fromdate);
  }

  const handleToDateChange = (date) => {
    let todate = Moment(date).format('YYYY-MM-DD');
    console.log(todate);
    setToDate(todate);
  }

  const onCouponNameChange = (name) => {
    setCouponName(name)
  }

  const handleTypeChange = async (event, value) => {
    setCouponValueType(event.target.value);
  }

  const handleCartValueRangeTypeChange = async (event, value) => {
    setCartValueRangeType(event.target.value);
  }


  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Coupon</h2>
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
                    </Select>
                  }
                  {datatype === 'Inactive' &&
                    <Select onChange={(event, value) => {
                      onActionChange(event, value)
                    }} >
                      <MenuItem value={'Active'}>Active</MenuItem>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Coupon</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[ 5, 10, 20, 25, 50, 100, 1000 ]}
              entries={5}
              hover
              data={{ rows: categoryrows, columns }}
              small
              responsive
              disableRetreatAfterSorting={true} />
            <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit === false ? "Add Coupon" :
                  "Edit Coupon"}
              </ModalHeader>
              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <TextField
                      id="required"
                      label={'Coupon Name'}
                      name={'CouponName'}
                      autoComplete={'off'}
                      onChange={(event) => onCouponNameChange(event.target.value)}
                      defaultValue={couponName}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    {errortext &&
                      <h6 style={{ color: 'red', paddingTop: '1%' }}>Coupon already exists</h6>
                    }
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['CouponName']}</h6></div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-6 col-12">
                      <TextField
                        required
                        id="required"
                        label={'Coupon Code'}
                        name={'CouponCode'}
                        onBlur={valiadateProperty}
                        onChange={(event) => setCouponCode(event.target.value)}
                        defaultValue={couponCode}
                        margin="normal" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['CouponCode']}</h6></div>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <TextField
                      required
                      id="required"
                      label={'Coupon Value'}
                      name={'CouponValue'}
                      onBlur={valiadateProperty}
                      onChange={(event) => setCouponValue(event.target.value)}
                      defaultValue={couponValue}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['CouponValue']}</h6></div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <FormControl
                      margin="normal"
                      style={{ marginLeft: "15px", marginRight: "15px" }}
                      className="col-lg-3 col-sm-6 col-12"
                    >
                      <InputLabel htmlFor="age-simple">Type</InputLabel>
                      <Select onChange={(event, value) => {
                        handleTypeChange(event, value)
                      }} value={couponValueType}>
                        <MenuItem value={"%"}>%</MenuItem>
                        <MenuItem value={"Rs"}>Rs</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <FormControl
                      margin="normal"
                      style={{ marginLeft: "15px", marginRight: "15px" }}
                      className="col-lg-11 col-sm-6 col-12"
                    >
                      <InputLabel htmlFor="age-simple">Cart Value Range Type</InputLabel>
                      <Select onChange={(event, value) => {
                        handleCartValueRangeTypeChange(event, value)
                      }} value={cartValueRangeType}>
                        <MenuItem value={"Less Than"}>{"<"}</MenuItem>
                        <MenuItem value={"Greater Than"}>{">"}</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <TextField
                      required
                      id="required"
                      label={'Cart Value Range'}
                      name={'CartValueRange'}
                      onBlur={valiadateProperty}
                      onChange={(event) => setCartValueRange(event.target.value)}
                      defaultValue={cartValueRange}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['CartValueRange']}</h6></div>
                  </div>
                  {cartValueRangeType === 'Less Than' &&
                    <div className="col-lg-12 d-flex flex-column order-lg-1">
                      <TextField
                        required
                        id="required"
                        label={'Minimum Cart Value'}
                        name={'MinimumCartValue'}
                        onChange={(event) => setCartValue(event.target.value)}
                        defaultValue={cartValue}
                        margin="normal" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['MinimumCartValue']}</h6></div>
                    </div>
                  }
                  {cartValueRangeType === 'Greater Than' &&
                    <div className="col-lg-12 d-flex flex-column order-lg-1">
                      <TextField
                        required
                        id="required"
                        label={'Maximum Cart Value'}
                        name={'MaximumCartValue'}
                        onChange={(event) => setCartValue(event.target.value)}
                        defaultValue={cartValue}
                        margin="normal" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['MaximumCartValue']}</h6></div>
                    </div>
                  }
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <TextField
                        required
                        id="required"
                        label={'No. of Usage'}
                        name={'noofusage'}
                        onBlur={valiadateProperty}
                        onChange={(event) => setNoOfUsage(event.target.value)}
                        defaultValue={noOfUsage}
                        margin="normal" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['noofusage']}</h6></div>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <TextField
                        required
                        id="required"
                        label={'No. of Usage Per User'}
                        name={'noofusageuser'}
                        onBlur={valiadateProperty}
                        onChange={(event) => setNoOfUsageUser(event.target.value)}
                        defaultValue={noOfUsageUser}
                        margin="normal" />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['noofusageuser']}</h6></div>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <DatePicker
                        label="From Date"
                        format='DD-MM-YYYY'
                        autoOk={true}
                        defaultValue={fromDate}
                        margin={'normal'}
                        value={fromDate}
                        onChange={handleFromDateChange}
                        animateYearScrolling={false}
                      />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['FromDate']}</h6></div>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <DatePicker
                        label="To Date"
                        format='DD-MM-YYYY'
                        autoOk={true}
                        defaultValue={toDate}
                        margin={'normal'}
                        value={toDate}
                        onChange={handleToDateChange}
                        animateYearScrolling={false}
                      />
                      <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['ToDate']}</h6></div>
                    </div>
                  </div>
                </div>
              </div>
              <ModalFooter>
                {isEdit === false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveCoupon()} variant="contained" disabled={savedisabled} color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editCoupon()} variant="contained" disabled={savedisabled} color="primary">Update</Button>
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