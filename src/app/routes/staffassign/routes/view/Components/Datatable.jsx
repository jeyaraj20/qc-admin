import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Joi from 'joi-browser';

import { MDBDataTable, MDBView, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import * as adminService from '../../../../../../services/adminService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as staffAssignService from '../../../../../../services/staffAssignService';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import auth from '../../../../../../services/authService';

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
  const [categoryitems, setCategoryItems] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState([]);
  const [schoolId, setSchoolId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffAssignId, setStaffAssignId] = useState('');

  let selectedCatArr = [];
  const onSelectAll = e => {
    let selected = selectedNam;
    for (let row of data) {
      if (document.getElementById(row.op_id)) {
        document.getElementById(row.op_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {
          selectedCatArr.push(row.op_id);
          selected[row.op_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedop({ "opId": selectedCatArr });
          console.log(selectedCatArr);
        } else {
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
      label: 'Type',
      field: 'op_type',
      width: 100,
    },
    {
      label: 'Exam Category',
      field: 'examcategoryname',
      width: 5,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 5,
    }
  ]
  const handleType = (e) => {
    setType(e.target.value);
  };
  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    let user = auth.getCurrentUser();
    setSchoolId(user.user.schoolid);
    console.log(user.user);
    const { data: res } = await adminService.getAllOperators();
    const { Operator: Operatorres } = res;
    setActiveCount(Operatorres.length);
    console.log(Operatorres);
    setData(Operatorres)

    const { data: Operatoresult } = await adminService.getInActiveOperator();
    const { Operator: Operatorress } = Operatoresult;
    const { count: inactivecount } = Operatoresult;
    setInactiveCount(inactivecount);
    let itemArr = [];
    for (let Operator of Operatorres) {
      itemArr.push(<MenuItem value={Operator.op_id}>{Operator.op_name}</MenuItem>)
    }
    setNameItems(itemArr);
    const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    const { category: categories } = maincategoryres;
    let catArr = [];
    for (let category of categories) {
      catArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
    }
    setCategoryItems(catArr);
    console.log(await staffAssignService.getAllStaffAssign());
    const { data: assignres } = await staffAssignService.getAllStaffAssign();
    const { Operator: assigndata } = assignres;
    setData(assigndata);
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


      let row = {};

      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      if (obj.op_type == 'A') {
        row.op_type = 'Admin'
      }
      if (obj.op_type == 'O') {
        row.op_type = 'Faculty'
      }
      row.sno = <span>{rowcount}</span>
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
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
      setStaffId(data.op_id);
      setStaffAssignId(data.staffassign_id);
      let idArr = JSON.parse("[" + data.examcategory_id + "]");
      console.log(idArr);
      setMainCategoryId(idArr);
      setIsEdit(true);
    } else {
      setName('');
      setStaffId('');
      setMainCategoryId([]);
      setIsEdit(false);
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
    // if (data && data.length)
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

  const createStaffAssign = async () => {
    if (schoolId && staffId && mainCategoryId) {
      let categorystr;
      categorystr = mainCategoryId.toString();
      let data = {
        school_id: schoolId,
        staff_id: staffId,
        examcategory_id: categorystr
      }
      console.log(data);
      await staffAssignService.createStaffAssign(data);
      setAlertMessage('Staff Assigned Successfully');
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
    if (schoolId && staffId && mainCategoryId) {
      let categorystr;
      categorystr = mainCategoryId.toString();
      let data = {
        school_id: schoolId,
        staff_id: staffId,
        examcategory_id: categorystr
      }
      console.log(data);
      await staffAssignService.updateStaffAssign(staffAssignId, data);
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

  const handleMainCategoryChange = (event, value) => {
    console.log(event.target.value);
    setMainCategoryId(event.target.value);
  }

  const handleFacultyChange = (event, value) => {
    console.log(event.target.value);
    setStaffId(event.target.value);
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
        <h2 className="title mb-3 mb-sm-0">{'Staff Assign'}</h2>
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
                  <Select onChange={(event, value) => {
                    onActionChange(event, value)
                  }} >
                    {/*<MenuItem value={'Active'}>Active</MenuItem>
                    <MenuItem value={'Inactive'}>Inactive</MenuItem>*/}

                    <MenuItem value={'Delete'}>Delete</MenuItem>
                  </Select>
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
                    <span>Assign</span>
                  </Button>
                  {/*<Button onClick={() => getAllActive()} variant="contained" className="jr-btn bg-success text-white">
                    <i className="zmdi zmdi-check zmdi-hc-fw" />
                    <span>Active ({activeCount})</span>
                  </Button>
                  <Button onClick={() => getAllInactive()} variant="contained" className="jr-btn bg-danger text-white">
                    <i className="zmdi zmdi-block zmdi-hc-fw" />
                    <span>Inactive ({inactiveCount})</span>
                </Button>*/}
                </div>
              </div>
            </form>
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
                {isEdit == false ? "Staff Assign" :
                  "Staff Re-assign"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-12 d-flex flex-column order-lg-1">
                    <div className="col-lg-12 col-sm-6 col-12">
                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Select Faculty</InputLabel>
                        <Select onChange={(event, value) => {
                          handleFacultyChange(event, value)
                        }} value={staffId}
                        >
                          {nameitems}
                        </Select>
                      </FormControl>
                    </div>
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Name']}</h6></div>
                    <div className="col-lg-12 col-sm-6 col-12">
                      <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                        <Select multiple onChange={(event, value) => {
                          handleMainCategoryChange(event, value)
                        }} value={mainCategoryId} >
                          {categoryitems}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <ModalFooter>
                {isEdit == false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => createStaffAssign()} disabled={savedisabled} variant="contained" color="primary">Assign</Button>
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