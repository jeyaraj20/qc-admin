import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Joi from 'joi-browser';
import Moment from "moment";
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as locationService from '../../../../../../services/locationService';
import * as adminService from '../../../../../../services/adminService';
import * as studentService from '../../../../../../services/studentService';
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
import BulkUpload from './BulkUpload';
import auth from '../../../../../../services/authService';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [newmodal, setNewModal] = useState(false)
  const [viewmodal, setViewModal] = useState(false)
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({})
  const [studname, setStudName] = useState('');
  const [studlname, setStudLName] = useState('');
  const [studfname, setFName] = useState('');
  const [studpass, setPass] = useState('');
  const [studregno, setRegno] = useState('');
  const [studemail, setEmail] = useState('');
  const [ipaddress, setIp] = useState('');
  const [studmobile, setMobile] = useState('');
  const [mobotp, setOtp] = useState('');
  const [studgender, setGender] = useState('');
  const [pincode, setPincode] = useState('');
  const [studdate, setDate] = useState('');
  const [studstatus, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [studrows, setStudrows] = useState([]);
  const [selectedStud, setSelectedstud] = useState({ "stud_id": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [studitems, setStudItems] = useState([]);
  const [stud_id, setStudId] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [rowsdata, setRowsData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [selectedStu, setselectedStu] = useState({});
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showBulkUploadBtn, setShowBulkUploadBtn] = useState(false);
  const [categoryitems, setCategoryItems] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState('');
  const [mainCategory, setMainCategory] = useState([]);
  const [ipaddr, setIpAddr] = useState('');
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');
  const publicIp = require('public-ip');

  let selectedStuArr = [];
  const onSelectAll = e => {
    let selected = selectedStu;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.stud_id)) {
        document.getElementById(row.stud_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.stud_status = 1
          else
            row.stud_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedStuArr.push(row.stud_id);
          selected[row.stud_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedstud({ "stud_id": selectedStuArr });
        } else {

          if (e.currentTarget.checked)
            row.stud_status = 1
          else
            row.stud_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedStuArr.length; i++) {
            if (selectedStuArr[i] == row.stud_id) {
              selectedStuArr.splice(i, 1);
            }
          }
          console.log(selectedStuArr);
          setSelectedstud({ "stud_id": selectedStuArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedStu(selected);
      rowcount = rowcount + 1;
    }
  };

  let selectedStudArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedStudArr = selectedStud.stud_id;
    if (e.currentTarget.checked)
      obj.stud_status = 1
    else
      obj.stud_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedStudArr.push(obj.stud_id)
      console.log(selectedStudArr);
    } else {
      for (var i = 0; i < selectedStudArr.length; i++) {
        if (selectedStudArr[i] == obj.stud_id) {
          selectedStudArr.splice(i, 1);
        }
      }
      console.log(selectedStudArr);
    }
    setSelectedstud({ "stud_id": selectedStudArr });
  }


  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Register Number',
      field: 'stud_regno',
      width: 100,
    },
    {
      label: 'Name',
      field: 'stud_fname',
      width: 100,
    },
    {
      label: 'Email',
      field: 'stud_email',
      width: 5,
    },
    {
      label: 'Mobile',
      field: 'stud_mobile',
      width: 5,
    },
    {
      label: 'Class',
      field: 'class',
      width: 5,
    },
    {
      label: 'Password',
      field: 'stud_pass',
      width: 5,
    },
    {
      label: 'Gender',
      field: 'stud_gender',
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


  const dataSet1 = [
    {
      stud_regno: "",
      stud_fname: "",
      stud_lname: "",
      stud_mobile: "",
      stud_email: "",
      stud_gender: ""
    }
  ];


  const handleStudChange = (event, value) => {
    console.log(event.target.value);
    setStudId(event.target.value);
  }
  const handleCountryChange = (event, value) => {
    console.log(event.target.value);
    setGender(event.target.value);
  }
  const handleRefresh = async () => {
    setLoader(true);
    let ip = await publicIp.v4();
    setIpAddr(ip);
    setSelectAll(false);
    const { data: res } = await studentService.getAllActiveStudent('Y');
    const { Student: Studentss } = res;
    setActiveCount(Studentss.length);
    setData(Studentss);
    setRowsData(Studentss);

    const { data: Studentresult } = await studentService.getAllActiveStudent('N');
    const { Student: Studentses } = Studentresult;
    const { count: inactivecount } = Studentresult;
    setInactiveCount(inactivecount);
    let itemArr = [];
    for (let Student of Studentses) {
      itemArr.push(<MenuItem value={Student.stud_id}>{Student.stud_name}</MenuItem>)
    }
    setStudItems(itemArr);
    let user = auth.getCurrentUser();
    console.log(user.user.logintype);
    if (user.user.logintype == 'I') {
      setShowBulkUploadBtn(true);
    }

    const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    const { category: categories } = maincategoryres;
    setMainCategory(categories);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const schema = {
    RegNo: Joi.string().required(),
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    Email: Joi.string().required().regex(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g),
    IPAddress: Joi.string().required(),
    Mobile: Joi.string().required(),
  }

  useEffect(() => {
    //if (data && data.length)
    mapRows(data);
  }, [data])

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])


  let rowcount = 0;
  const mapRows = async (rows) => {
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))
    const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    const { category: categories } = maincategoryres;
    let studrows = rows.map((obj, index) => {
      let className = categories.find( m => m.exa_cat_id === obj.category_id);
      var password1 = new Buffer(obj.stud_pass, 'base64')
      var password2 = password1.toString();
      let checkedflg = false;
      if (obj.stud_status == "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.stud_id} id={obj.stud_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.stud_fname = obj.stud_fname + " " + obj.stud_lname
      row.stud_pass = password2;
      row.class = className ? className.exa_cat_name : '';
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      row.view = <IconButton onClick={() => openview(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
      return row;
    })
    setStudrows(studrows);

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



  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }

  const bulkUpload = () => {
    setShowBulkUpload(true);
  }


  const handleAction = async () => {
    let selectedStudentObj = selectedStud;
    if (action == '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action == 'Inactive') {
        selectedStudentObj.status = 'N';
        console.log(selectedStudentObj);
        if (selectedStud.stud_id.length != 0) {
          await studentService.changeStatus(selectedStudentObj);
          setAlertMessage('Data successfully inactivated.');
          setSelectedstud({ "stud_id": [] });
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
        selectedStudentObj.status = 'Y';
        console.log(selectedStudentObj);
        if (selectedStud.stud_id.length != 0) {
          console.log(stud_id)
          await studentService.changeStatus(selectedStudentObj);
          setAlertMessage('Data successfully activated.');
          setSelectedstud({ "stud_id": [] });
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
        selectedStudentObj.status = 'D';
        if (selectedStud.stud_id.length != 0) {
          await studentService.changeStatus(selectedStudentObj);
          setAlertMessage('Data successfully deleted.');
          setSelectedstud({ "stud_id": [] });
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
    setErrors({});
    setNewModal(open);
    setViewModal(false);
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
    if (data) {
      setIsEdit(true);
      setStudName(data.stud_name);
      setFName(data.stud_fname);
      setStudLName(data.stud_lname);
      setStudId(data.stud_id);
      setRegno(data.stud_regno)
      setEmail(data.stud_email)
      setMobile(data.stud_mobile)
      setOtp(data.mob_otp)
      setPass(data.stud_pass)
      setGender(data.stud_gender)
      setPincode(data.pincode)
      setDate(data.stud_date)
      setIp(data.ipaddress)
      setStatus(data.stud_status)
      setMainCategoryId(data.category_id);

    } else {
      setStudName('');
      setStudLName('');
      setFName('');
      setStudId('');
      setRegno('')
      setEmail('')
      setMobile('')
      setOtp('')
      setPass('')
      setGender('')
      setPincode('')
      setDate('')
      setIp('')
      setStatus('')
      setSavedisabled(false);
      setIsEdit(false);
      setMainCategoryId('');
    }
  }

  const handleMainCategoryChange = (event, value) => {
    setMainCategoryId(event.target.value);
  }

  const openview = (open, data) => {
    console.log(data);

    setErrortext(false);
    setViewModal(open);
    setNewModal(false)

    if (data) {
      setIsView(true);
      setStudName(data.stud_name);
      setStudLName(data.stud_lname);
      setStudId(data.stud_id);
      setRegno(data.stud_regno)
      setEmail(data.stud_email)
      setMobile(data.stud_mobile)
      setOtp(data.mob_otp)
      setPass(data.stud_pass)
      setGender(data.stud_gender)
      setPincode(data.pincode)
      setDate(Moment(data.stud_date).format('DD-MM-YYYY HH:mm:ss'))
      setIp(data.ipaddress)
      setStatus(data.stud_status)
    }
  }
  const handleSaveButton = () => {
    console.log(errors['RegNo'], errors['FirstName'], errors['LastName'], errors['Email'], errors['IPAddress'], errors['Mobile'])
    if (errors['studregno'] != null || errors['studregno'] == undefined || errors['studfname'] != null || errors['studfname'] == undefined || errors['studlname'] != null || errors['studlname'] == undefined || errors['studemail'] != null || errors['studemail'] == undefined || errors['studmobile'] != null || errors['studmobile'] == undefined || errors['studgender'] != null || errors['studgender'] == undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };
  const saveState = async () => {
    if (studregno && studfname && studlname && studemail && studmobile && studgender) {
      let data = {
        category_id: mainCategoryId,
        stud_fname: studfname,
        stud_lname: studlname,
        stud_regno: studregno,
        stud_email: studemail,
        stud_mobile: studmobile,
        stud_gender: studgender,
        ipaddress: ipaddr,
      }
      await studentService.createStudent(data);
      setAlertMessage('Student Added Successfully');
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

  const editState = async () => {
    if (studregno && studfname && studlname && studemail && studmobile && studgender) {
      let data = {
        category_id: mainCategoryId,
        stud_lname: studlname,
        stud_fname: studfname,
        stud_regno: studregno,
        stud_email: studemail,
        stud_mobile: studmobile,

        stud_gender: studgender,

        ipaddress: ipaddress,


      }
      await studentService.updateStudent(data, stud_id);
      setAlertMessage('Student Updated Successfully');
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
    const { data: inactiveres } = await studentService.getAllActiveStudent("N");
    const { Student: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
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
    const { data: activeres } = await studentService.getAllActiveStudent("Y");
    const { Student: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const edit = {
    marginTop: '-5%',

  };
  const text = {
    marginTop: '-5px',

  };


  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Students</h2>
        {showBulkUploadBtn &&
          <ExcelFile element={<Button variant="contained" color="primary" className="jr-btn">
            <i className="zmdi zmdi-download zmdi-hc-fw" />
            <span>Sample Format</span>
          </Button>}>
            <ExcelSheet data={dataSet1} name="Employees">
              <ExcelColumn label="RegisterNo" value="stud_regno" />
              <ExcelColumn label="FirstName" value="stud_fname" />
              <ExcelColumn label="LastName" value="stud_lname" />
              <ExcelColumn label="Mobile" value="stud_mobile" />
              <ExcelColumn label="Email" value="stud_email" />
              <ExcelColumn label="Gender" value="stud_gender" />
            </ExcelSheet>
          </ExcelFile>
        }
      </div>
      <div className="col-12">
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {!loader && !showBulkUpload &&
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
                  {showBulkUploadBtn &&
                    <Button onClick={() => bulkUpload()} variant="contained" color="primary" className="jr-btn">
                      <i className="zmdi zmdi-upload zmdi-hc-fw" />
                      <span>Bulk Upload</span>
                    </Button>
                  }
                </div>
              </div>
            </form>
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Students</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100]}
              entries={5}
              hover
              data={{ rows: studrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
            <Modal className="modal-box" backdrop={"static"} openview={onViewModalClose} isOpen={viewmodal}>
              {/* <ModalHeader className="modal-box-header bg-primary text-white">
              {isView == false ? " Operator" :
                "View "}
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
                  <h4>Student Register No :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studregno}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Name:</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studfname}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Email :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{studemail}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Password :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studpass}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Mobile :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studmobile}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Mobile OTP:</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{mobotp}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Student Gender :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {studgender}
                </div>
              </div>
              {/* <div className="row no-gutters">
                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                            <h4>Student Profile Photo :</h4>
                        </div>
                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                          
                        </div>
                    </div> */}
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Country :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {/* <div>{ contactPerson }</div> */}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>State :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {/* <div>{ totalStudents }</div> */}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>City :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {/* <div>{ totalStudents }</div> */}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Pincode :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{pincode}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Date :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{studdate}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>IpAddress :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{ipaddress}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Status :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{studstatus}</div>
                </div>
              </div>
            </Modal>

            <Modal className="modal-box" backdrop={"static"} openview={onModalClose} isOpen={newmodal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit == false ? "Add Student" :
                  "Edit Student"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1" style={edit}>
                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                      <Select onChange={(event, value) => {
                        handleMainCategoryChange(event, value)
                      }} value={mainCategoryId} >
                        {categoryitems}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id="required"
                      label={'Reg No'}
                      name={'RegNo'}
                      onChange={(event) => setRegno(event.target.value)}
                      defaultValue={studregno}
                      value={studregno}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['RegNo']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'First Name'}
                      name={'FirstName'}
                      onChange={(event) => setFName(event.target.value)}
                      defaultValue={studfname}
                      value={studfname}
                      style={text}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['FirstName']}</h6></div>
                    <TextField
                      required
                      id="required"
                      style={text}
                      label={'Last Name'}
                      name={'LastName'}
                      onChange={(event) => setStudLName(event.target.value)}
                      defaultValue={studlname}
                      value={studlname}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['LastName']}</h6></div>

                    <TextField
                      required
                      id="required"
                      label={'Email'}
                      style={text}
                      name={'Email'}
                      onChange={(event) => setEmail(event.target.value)}
                      defaultValue={studemail}
                      value={studemail}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Email']}</h6></div>
                    <TextField
                      required
                      id="required"
                      label={'Mobile'}
                      name={'Mobile'}
                      type="tel"
                      style={text}
                      onChange={(event) => setMobile(event.target.value)}
                      defaultValue={studmobile}
                      value={studmobile}
                      maxlength={10}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                      }}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Mobile']}</h6></div>
                    <div>
                      <RadioGroup row aria-label="position" defaultValue={studgender} name="Gender">
                        <FormControlLabel value="MALE" defaultValue={studgender} onChange={(event, value) => {
                          handleCountryChange(event, value)
                        }} control={<Radio color="primary" />} label="MALE" />
                        <FormControlLabel value="FEMALE" defaultValue={studgender} onChange={(event, value) => {
                          handleCountryChange(event, value)
                        }} control={<Radio color="primary" />} label="FEMALE" />
                      </RadioGroup>
                    </div>




                  </div>
                </div>
              </div>
              {<ModalFooter>
                {isEdit == false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveState()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editState()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div>}
              </ModalFooter>}
            </Modal>
            <Snackbar
              className="mb-3 bg-info"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={showMessage}
              message={alertMessage}
            />
          </div>
        }
        {!loader && showBulkUpload &&
          <BulkUpload />
        }
      </div>
    </>
  );
};

export default DataTable;