import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Joi from 'joi-browser';

import { MDBDataTable, MDBView, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as locationService from '../../../../../../services/locationService';
import * as adminService from '../../../../../../services/adminService';
import { homeCategoryImageDir } from "../../../../../../config";
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import { onlyUpdateForPropTypes } from 'recompose';

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [editdata, setEditdata] = useState([])
  const [modal, setModal] = useState(false)
  const [newmodal, setNewModal] = useState(false)
  const [viewmodal, setViewModal] = useState(false)
  const [opname, setName] = useState('');
  const [opusername, setUserName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [staterows, setStaterows] = useState([]);
  const [namerows, setNamerows] = useState([]);

  const [selectedOp, setSelectedop] = useState({ "opId": [] });
  const [selectedmenu, setSelectedmenu] = useState('');
  const [action, setAction] = useState('');

  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [countryitems, setCountryItems] = useState([]);
  const [nameitems, setNameItems] = useState([]);
  const [adminmenuitems, setAdminmenuItems] = useState([]);
  const [menuId, setMenuId] = useState([]);
  const [opId, setOpId] = useState('');
  const [optype, setType] = useState('A');

  const [errors, setErrors] = useState({})
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [featid, setFeatId] = useState();
  const [opstatus, setStatus] = useState();
  const [oppassword, setPassword] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [selectFeaturesAll, setFeaturesAll] = useState(false);
  const [selectedNam, setselectedNam] = useState({});
  const [selectedFeat, setselectedFeat] = useState({});
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');

  let selectedCatArr = [];
  const onSelectAll = e => {
    let selected = selectedNam;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.op_id)) {
        document.getElementById(row.op_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.op_status = 1
          else
            row.op_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.op_id);
          selected[row.op_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedop({ "opId": selectedCatArr });
          console.log(selectedCatArr);
        } else {

          if (e.currentTarget.checked)
            row.op_status = 1
          else
            row.op_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCatArr.length; i++) {
            if (selectedCatArr[i] == row.op_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          console.log(selectedCatArr);
          setSelectedop({ "opId": selectedCatArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedNam(selected);
      rowcount = rowcount + 1;
    }
  };

  let selectedNameArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedNameArr = selectedOp.opId;
    if (e.currentTarget.checked)
      obj.op_status = 1
    else
      obj.op_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedNameArr.push(obj.op_id)
      console.log(selectedNameArr);
    } else {
      for (var i = 0; i < selectedNameArr.length; i++) {
        if (selectedNameArr[i] == obj.op_id) {
          selectedNameArr.splice(i, 1);
        }
      }
      console.log(selectedNameArr);
    }
    setSelectedop({ "opId": selectedNameArr });
  }

  let selectedAllFeatureArr = [];
  const onFeaturesSelectAll = e => {
    let rowarr = [];
    selectedAllFeatureArr = JSON.parse("[" + selectedmenu + "]");
    for (let row of editdata) {
      let str;
      if (e.currentTarget.checked) {
        selectedAllFeatureArr.push(row.menu_id)
        str = selectedAllFeatureArr.toString();
        row.checked = true;
        rowarr.push(row);
      } else {
        for (var i = 0; i < selectedAllFeatureArr.length; i++) {
          if (selectedAllFeatureArr[i] == row.menu_id) {
            selectedAllFeatureArr.splice(i, 1);
            str = selectedAllFeatureArr.toString();
          }
        }
        row.checked = false;
        rowarr.push(row);
      }
      setSelectedmenu(str);
      setFeaturesAll(e.currentTarget.checked);
      setEditdata(rowarr);
    }
  };

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Name',
      field: 'op_name',
      width: 100,
    },
    {
      label: 'Username',
      field: 'op_uname',
      width: 100,
    },
    {
      label: 'Password',
      field: 'op_password',
      width: 5,
    },
    {
      label: 'Type',
      field: 'op_type',
      width: 5,
    },
    {
      label: 'Question Added',
      field: 'actcount',
      width: 5,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 5,
    },
    {
      label: 'View',
      field: 'view',
      width: 5,
    },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 5,
    }
  ]
  const handleType = (e) => {
    setType(e.target.value);
  };
  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    const { data: res } = await adminService.getName();
    const { Operator: Operatorres } = res;
    setActiveCount(Operatorres.length);
    console.log(Operatorres);
    setData(Operatorres)

    const { data: Operatoresult } = await adminService.getInActiveOperator();
    const { Operator: Operatorress } = Operatoresult;
    const { count: inactivecount } = Operatoresult;
    setInactiveCount(inactivecount);
    let itemArr = [];
    for (let Operator of Operatorress) {
      itemArr.push(<MenuItem value={Operator.op_id}>{Operator.op_name}</MenuItem>)
    }
    setNameItems(itemArr);
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

    if (error)
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
    else
      e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"
  }
  const schema = {
    Name: Joi.string().required(),
    Username: Joi.string().required(),
    Password: Joi.string().required(),


  }

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

    let namerows = rows.map((obj, index) => {

      let checkedflg = false;
      if (obj.op_status == "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      if (row.op_type == 'O') {
        row.op_type = 'Faculty'
      } else if (row.op_type == 'S') {
        row.op_type = 'Super Admin'
      } else {
        row.op_type = 'Admin'
      }
      row.op_password = new Buffer(row.op_password, 'base64');
      row.op_password = (row.op_password).toString();
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.op_id} id={obj.op_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      row.view = <IconButton onClick={() => openview(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
      return row;
    })
    setNamerows(namerows);

  }

  let selectedFeatureArr = [];
  const onMenuSelect = (event, obj, index) => {
    console.log(selectedmenu);
    selectedFeatureArr = JSON.parse("[" + selectedmenu + "]");
    if (event.currentTarget.checked)
      obj.checked = true
    else
      obj.checked = false
    editdata[index] = obj
    setEditdata([...editdata])
    let str;
    if (event.currentTarget.checked) {
      selectedFeatureArr.push(event.target.value)
      str = selectedFeatureArr.toString();
    } else {
      for (var i = 0; i < selectedFeatureArr.length; i++) {
        if (selectedFeatureArr[i] == obj.menu_id) {
          selectedFeatureArr.splice(i, 1);
          str = selectedFeatureArr.toString();
        }
      }
    }
    setSelectedmenu(str);
  }



  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }


  const handleAction = async () => {
    let selectedNameObj = selectedOp;
    if (action == '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action == 'Inactive') {
        selectedNameObj.status = 'N';
        if (selectedOp.opId.length != 0) {
          await adminService.changeStatus(selectedNameObj);
          setAlertMessage('Data successfully inactivated.');
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one User');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action == 'Active') {
        selectedNameObj.status = 'Y';
        console.log(selectedNameObj);
        if (selectedOp.opId.length != 0) {
          console.log(opId)
          await adminService.changeStatus(selectedNameObj);
          setAlertMessage('Data successfully activated.');
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one User');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action == 'Delete') {
        selectedNameObj.status = 'D';
        if (selectedOp.opId.length != 0) {
          await adminService.changeStatus(selectedNameObj);
          setAlertMessage('Data successfully deleted.');
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one User');
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
    setErrortext(false);
    setNewModal(open);
    setFeaturesAll(false)
    setViewModal(false);
    if (data) {
      setIsEdit(true);
      setName(data.op_name);
      setUserName(data.op_uname);
      setPassword(password2);
      var password1 = new Buffer(data.op_password, 'base64')
      var password2 = password1.toString();
      console.log(password2)
      setPassword(password2)
      setFeatId(data.feat_id);
      console.log(data.feat_id)
      setType(data.op_type);
      setOpId(data.op_id);
      setMenuId(data.menu_id);
      var featureArr = JSON.parse("[" + data.feat_id + "]");
      console.log(featureArr);
      setSelectedmenu(featureArr);
      const { data: menus } = await adminService.getAllAdminmenu();
      const { Adminmenu: Adminmnu } = menus
      console.log(Adminmnu);
      for (let i = 0; i < featureArr.length; i++) {
        for (let s = 0; s < Adminmnu.length; s++) {
          if (featureArr[i] == Adminmnu[s].menu_id) {
            Adminmnu[s].checked = true
          }
        }
      }
      console.log(Adminmnu);
      setEditdata(Adminmnu);
    } else {
      setName('');
      setUserName('');
      setPassword('');
      setFeatId('');
      setOpId('');
      setMenuId('');
      setIsEdit(false);
      const { data: menus } = await adminService.getAllAdminmenu();
      const { Adminmenu: Adminmnu } = menus
      console.log(Adminmnu);
      for (let s = 0; s < Adminmnu.length; s++) {
        Adminmnu[s].checked = false
      }
      console.log(Adminmnu);
      setEditdata(Adminmnu);
    }
  }

  const mapFeatures = (rows) => {
    let itemArr = [];
    let categoryrowsdata = rows.map((obj, index) => {
      if (obj.checked)
        itemArr.push(<label><Checkbox color="primary" id={'feat' + obj.menu_id} checked={obj.checked} value={obj.menu_id} onChange={(e) => { onMenuSelect(e, obj, index) }} />  <span>{obj.menu_title}</span></label>);
      else
        itemArr.push(<label><Checkbox color="primary" id={'feat' + obj.menu_id} checked={false} value={obj.menu_id} onChange={(e) => { onMenuSelect(e, obj, index) }} />  <span>{obj.menu_title}</span></label>);
      setAdminmenuItems(itemArr);
    })
  }

  useEffect(() => {
    if (editdata && editdata.length)
      mapFeatures(editdata);
  }, [editdata])

  useEffect(() => {
    //if (data && data.length)
    mapRows(data);
  }, [data])

  const openview = (open, data) => {
    console.log(data);
    setErrortext(false);
    setViewModal(open);
    setNewModal(false);
    if (data) {
      setIsView(true);
      setName(data.op_name);
      setUserName(data.op_uname);
      setPassword(password2);
      var password1 = new Buffer(data.op_password, 'base64')
      var password2 = password1.toString();
      console.log(password2)
      // const password1 = new Buffer.from(data.password).toString('base64');
      setPassword(password2)
      setFeatId(data.feat_id);
      setStatus(data.op_status);
      setOpId(data.op_id);
      setMenuId(data.menu_id);
    }
  }


  /*const getallOperator = async () => {

    const { data: menus } = await adminService.getAllAdminmenu('A')
    const { Adminmenu: Adminmnu } = menus
    console.log(Adminmnu);

    let itemArr = [];
    for (let menu of Adminmnu) {

      let featid = menu.menu_id;
      itemArr.push(<label><Checkbox color="primary" value={featid} defaultValue={featid} onChange={(e) => { onMenuSelect(e, featid) }} />  <span>{menu.menu_title}</span></label>
      )

      console.log(featid);

    }
    itemArr.menu_id = itemArr.featid;

    setAdminmenuItems(itemArr)

  }*/

  const saveOperator = async () => {
    if (optype && opname && opusername && oppassword) {
      let data = {
        feat_id: selectedmenu,

        op_type: optype,
        op_name: opname,
        op_uname: opusername,
        op_password: oppassword,

      }
      console.log(data);

      await adminService.createOperator(data);
      setAlertMessage('User Added Successfully');
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

  const editOperator = async () => {
    if (optype && opname && opusername && oppassword) {
      let data = {
        op_id: opId,
        op_name: opname,
        op_uname: opusername,
        op_password: oppassword,
        feat_id: selectedmenu,
        op_status: opstatus,
        op_type: optype,
      }
      await adminService.editOperator(data, opId);
      setAlertMessage('User Updated Successfully');
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


  const handleRequestClose = () => {
    setShowMessage(false)
  };

  const onModalClose = () => {
    setNewModal(false);
  };

  const onViewModalClose = () => {
    setViewModal(false);
  };
  const getAllInactive = async () => {
    setLoader(true);
    setDataType('Inactive');
    setTxtClass('bg-danger text-white');
    const { data: inactiveres } = await adminService.getInActiveOperator();
    const { Operator: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    setData(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    setDataType('Active');
    setTxtClass('bg-success text-white');
    const { data: activeres } = await adminService.getName();
    const { Operator: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }



  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">{'Admin & Faculty'}</h2>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Admin & Faculty</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100]}
              entries={5}
              hover
              data={{ rows: namerows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
            <Modal className="modal-box" backdrop={"static"} openview={onViewModalClose} isOpen={viewmodal}>
              {/* <ModalHeader className="modal-box-header bg-primary text-white">
              {isView == false ? " Operator" :
                "View Operator"}
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
                  <h4>Name :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {opname}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>UserName:</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {opusername}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Password :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{oppassword}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Features :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{featid}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Status :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{opstatus}</div>
                </div>
              </div>
            </Modal>
            <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={newmodal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit == false ? "Add Operator" :
                  "Edit Operator"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-12 d-flex flex-column order-lg-1">
                    <TextField
                      required
                      id="required"
                      label={'Name'}
                      name={'Name'}
                      onChange={(event) => setName(event.target.value)}
                      defaultValue={opname}
                      value={opname}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Name']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Username'}
                      name={'Username'}
                      onChange={(event) => setUserName(event.target.value)}
                      defaultValue={opusername}
                      value={opusername}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Username']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Password'}
                      name={'Password'}
                      onChange={(event) => setPassword(event.target.value)}
                      defaultValue={oppassword}
                      value={oppassword}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Password']}</h6></div>
                    <FormControl component="fieldset" required>
                      <RadioGroup
                        className="d-flex flex-row"
                        aria-label="logintype"
                        name="logintype"
                        value={optype}
                        onChange={(e) => handleType(e)}

                      >
                        <FormControlLabel value="A" control={<Radio color="primary" />} label="Admin" />
                        <FormControlLabel value="O" control={<Radio color="primary" />} label="Faculty" />
                      </RadioGroup>
                    </FormControl>
                    <div className="row no-gutters">
                      <div className="col-lg-6 d-flex flex-column order-lg-1">
                        <label htmlFor="name" style={{
                          color: "blue",
                          fontSize: "15px"
                        }}>Features</label>
                      </div>
                      <div style={{ textAlign: 'right' }} className="col-lg-6 d-flex flex-column order-lg-1">
                        <MDBInput style={{ marginTop: '-2%', width: '20px', left: '82%' }} label=' ' type='checkbox' id='multi' checked={selectFeaturesAll} onChange={onFeaturesSelectAll} > <span>Select All</span> </MDBInput>
                      </div>
                    </div>
                    <div>
                      {
                        adminmenuitems
                      }
                    </div>
                  </div>
                </div>
              </div>
              <ModalFooter>
                {isEdit == false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveOperator()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editOperator()} variant="contained" color="primary">Update</Button>
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