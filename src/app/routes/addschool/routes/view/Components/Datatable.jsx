import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import { schoolImageDir } from "../../../../../../config";
import * as adminService from '../../../../../../services/adminService';
import * as schoolService from '../../../../../../services/schoolService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import Joi from 'joi-browser';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import { DatePicker } from '@material-ui/pickers';
import Moment from "moment";

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [newmodal, setNewModal] = useState(false)
  const [viewmodal, setViewModal] = useState(false)
  const [files, setFiles] = useState([]);
  const [editthumbs, setEditthumbs] = useState('');
  const [viewEditImg, setviewEditImg] = useState(false);
  const [address1, setSchoolAddress1] = useState('');
  const [address2, setSchoolAddress2] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolLogo, setSchoolLogo] = useState('');
  const [totalStudents, settotalStudent] = useState('');
  const [emailId, setemailId] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [contactPerson, setcontactPerson] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [schoolName, setSchoolName] = useState([]);
  const [schoolrows, setSchoolrows] = useState([]);
  const [selectedSchool, setSelectedschool] = useState({ "id": [] });
  const [action, setAction] = useState('');
  const [password, setPassword] = useState();
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [schoolitems, setSchoolItems] = useState([]);
  const [selectedSch, setselectedSch] = useState({});
  const [errors, setErrors] = useState({})
  const [id, setSchoolId] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');
  const [assignexamrow, setAssignExamRow] = useState([]);
  const [mastercategoryitems, setMasterCategoryItems] = useState([]);
  const [expirydate, SetExpiryDate] = useState(Moment(new Date()).format('MM-DD-YYYY'));
  const publicIp = require('public-ip');

  let selectedSchArr = [];
  const onSelectAll = e => {
    let selected = selectedSch;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.id)) {
        document.getElementById(row.id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.schoolStatus = 1
          else
            row.schoolStatus = 0;
          data[rowcount] = row
          setData([...data])

          selectedSchArr.push(row.id);
          selected[row.id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedschool({ "id": selectedSchArr });
        } else {

          if (e.currentTarget.checked)
            row.schoolStatus = 1
          else
            row.schoolStatus = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedSchArr.length; i++) {
            if (selectedSchArr[i] == row.id) {
              selectedSchArr.splice(i, 1);
            }
          }
          console.log(selectedSchArr);
          setSelectedschool({ "id": selectedSchArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedSch(selected);
      rowcount = rowcount + 1;
    }
  };
  let selectedSchoolArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedSchoolArr = selectedSchool.id;
    if (e.currentTarget.checked)
      obj.schoolStatus = 1
    else
      obj.schoolStatus = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedSchoolArr.push(obj.id)
      console.log(selectedSchoolArr);
    } else {
      for (var i = 0; i < selectedSchoolArr.length; i++) {
        if (selectedSchoolArr[i] == obj.id) {
          selectedSchoolArr.splice(i, 1);
        }
      }
      console.log(selectedSchoolArr);
    }
    setSelectedschool({ "id": selectedSchoolArr });
  }
  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'School Name',
      field: 'schoolName',
      width: 100,
    },
    {
      label: 'Address',
      field: 'emailId',
      width: 100,
    },
    {
      label: 'PhoneNumber',
      field: 'phoneNumber',
      width: 5,
    },
    {
      label: 'Contact Name',
      field: 'contactPerson',
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


  const handleSchoolChange = (event, value) => {
    console.log(event.target.value);
    setSchoolId(event.target.value);
  }



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


  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(schoolLogo => Object.assign(schoolLogo, {
        preview: window.webkitURL.createObjectURL(schoolLogo)
      })));
      setviewEditImg(false);
    }
  });
  const handleRefresh = async () => {
    setLoader(true);
    let ip = await publicIp.v4();
    console.log(ip);
    setIpAddress(ip);
    setSelectAll(false);
    const { data: res } = await schoolService.getAllActiveSchool('Y');
    const { School: Schoolss } = res;
    setActiveCount(Schoolss.length);
    setData(Schoolss);
    console.log(Schoolss);
    const { data: inactiveres } = await schoolService.getAllActiveSchool('N');
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    const { data: Schoolresult } = await schoolService.getAllActiveSchool('Y');
    const { School: Schoolses } = Schoolresult;
    // const { count: inactivecount } = Schoolresult;
    // setInactiveCount(inactivecount);
    let itemArr = [];
    for (let School of Schoolses) {
      itemArr.push(<MenuItem value={School.id}>{School.schoolName}</MenuItem>)
    }
    setSchoolItems(itemArr);
    const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    const { category: categories } = maincategoryres;
    let catArr = [];
    for (let category of categories) {
      catArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
    }
    setMasterCategoryItems(catArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const schema = {
    SchoolName: Joi.string().required(),
    Address1: Joi.string().required(),
    Address2: Joi.string().required(),
    Email: Joi.string().required().regex(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g),
    PhoneNumber: Joi.string().required().regex(/^[0-9]{1,10}$/),
    Password: Joi.string().required(),
    ContactName: Joi.string().required(),
    MobileNumber: Joi.string().required().regex(/^[0-9]{1,10}$/),
    TotalStudent: Joi.string().required(),
    schoolLogo: Joi.string().required(),

  }

  useEffect(() => {
    //if (data && data.length)
    mapRows(data);
  }, [data])

  useEffect(() => () => {
    //handleRefresh();
    files.forEach(schoolLogo => window.webkitURL.revokeObjectURL(schoolLogo.preview));
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

    let schoolrows = rows.map((obj, index) => {

      let checkedflg = false;
      if (obj.schoolStatus == "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.id} id={obj.id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      // row.schoolName= <span>{obj.schoolName}</span>

      // row.emailId= <span>{obj.emailId}</span>
      // row.phoneNumber= <span>{obj.phoneNumber}</span>
      // row.contactPerson= <span>{obj.contactPerson}</span>
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      row.view = <IconButton onClick={() => openview(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
      return row;
    })
    setSchoolrows(schoolrows);

  }


  const thumbs = files.map(schoolLogo => (
    <div style={thumb} key={schoolLogo.name}>
      <div style={thumbInner}>
        <img alt={schoolLogo.name}
          src={schoolLogo.preview}
          style={img}
        />
      </div>
    </div>
  ));


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
  }
  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }
  const deleteImage = () => {
    setviewEditImg(false);
  }

  const handleAction = async () => {
    let selectedSchoolObj = selectedSchool;
    if (action == '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action == 'Inactive') {
        selectedSchoolObj.status = 'N';
        console.log(selectedSchoolObj);
        if (selectedSchool.id.length != 0) {
          await schoolService.changeStatus(selectedSchoolObj);
          setAlertMessage('Data successfully inactivated.');
          setSelectedschool({ "id": [] });
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
        selectedSchoolObj.status = 'Y';
        console.log(selectedSchoolObj);
        if (selectedSchool.id.length != 0) {
          console.log(id)
          await schoolService.changeStatus(selectedSchoolObj);
          setAlertMessage('Data successfully activated.');
          setSelectedschool({ "id": [] });
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
        selectedSchoolObj.status = 'D';
        if (selectedSchool.id.length != 0) {
          await schoolService.changeStatus(selectedSchoolObj);
          setAlertMessage('Data successfully deleted.');
          setSelectedschool({ "id": [] });
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
  // const password = Buffer.from(password).toString("base64")
  const toggle = async (open, data) => {
    setErrors({});
    setviewEditImg(false)
    console.log(data);
    setErrortext(false);
    setNewModal(open);
    setFiles(['']);
    setViewModal(false);
    if (data) {
      setIsEdit(true);
      setviewEditImg(true);
      setSchoolName(data.schoolName);
      setSchoolLogo(data.schoolLogo);
      setSchoolAddress1(data.address1);
      setSchoolAddress2(data.address2)
      setPhoneNumber(data.phoneNumber)
      setMobileNumber(data.mobileNumber)
      setemailId(data.emailId)
      setPassword(password2)
      settotalStudent(data.totalStudents)
      setcontactPerson(data.contactPerson)
      setIpAddress(data.ipAddress)
      setSchoolId(data.id);
      SetExpiryDate(Moment(data.expiryDate).format('MM-DD-YYYY'))
      const { data: resdata } = await schoolService.getSchoolQCExams(data.id);
      const { rows: schoolexamrow } = resdata;
      let exam = schoolexamrow[0].SchoolQCExams;
      let dataArr = [];
      let count = 1;
      for (let examdata of exam) {
        let examObj = {};
        examObj.mastercategoryId = examdata.masterCategory;
        const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(examdata.masterCategory);
        const { category: categories } = subcategoryres;
        let itemArr = [];
        for (let subcategory of categories) {
          itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
        }
        examObj.categoryitems = itemArr;
        examObj.categoryId = examdata.mainCategory;
        const { data: subres } = await exammainCategoryService.getExamSubCategoryByCatId(examdata.mainCategory);
        const { subcategory: subcategories } = subres;
        let subArr = [];
        for (let subcat of subcategories) {
          subArr.push(<MenuItem value={subcat.exa_cat_id}>{subcat.exa_cat_name}</MenuItem>)
        }
        examObj.subcategoryitems = subArr;
        var array = JSON.parse("[" + examdata.subCategory + "]");
        examObj.subcategoryid = array;
        if (count == 1) {
          examObj.addtype = true;
          examObj.deltype = false;
        } else {
          examObj.deltype = true;
          examObj.addtype = false;
        }
        examObj.rowsNo = count;
        dataArr.push(examObj);
        count = count + 1;
      }
      setAssignExamRow(dataArr);
      var password1 = new Buffer(data.password, 'base64')
      var password2 = password1.toString();
      console.log(password2)
      // const password1 = new Buffer.from(data.password).toString('base64');
      setPassword(password2)
      const editthumbs = (
        <div style={thumb} key={data.schoolLogo}>
          <div style={thumbInner}>
            <img alt={data.schoolLogo}
              src={schoolImageDir + '/' + data.schoolLogo}
              style={img}
            />
          </div>
        </div>
      );
      setEditthumbs(editthumbs);

    } else {
      setSchoolName('');

      setSchoolAddress1('');
      setSchoolAddress2('')
      setPhoneNumber('')
      setMobileNumber('')
      setemailId('')
      setPassword('')
      settotalStudent('')
      setcontactPerson('')
      setIsEdit(false);
      setviewEditImg(false);
      setSavedisabled(false);
      setAssignExamRow([
        { rowsNo: 1, mastercategoryId: '', categoryId: '', categoryitems: '', subcategoryitems: '', subcategoryid: [], addtype: true, deltype: false }
      ])

    }
    console.log(data);
  }

  const handleMainCategoryChange = async (event, index) => {
    let newArr = [...assignexamrow]; // copying the old datas array
    newArr[index].mastercategoryId = event.target.value;
    const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(event.target.value);
    const { category: categories } = subcategoryres;
    let itemArr = [];
    for (let subcategory of categories) {
      itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
    }
    newArr[index].categoryitems = itemArr;
    setAssignExamRow(newArr); // ??
  }

  const renderAssignExamCategory = () => {
    let rowNum = 1;
    return assignexamrow.map((row, index) => {
      rowNum = rowNum + 1;
      const { rowsNo, mastercategoryId, categoryId, categoryitems, subcategoryid, subcategoryitems, addtype, deltype } = row //destructuring
      return (
        <div className="row">
          <FormControl margin='normal' style={{ marginLeft: '15px', marginRight: '15px' }} className="col-lg-3 col-sm-6 col-12">
            <InputLabel htmlFor="age-simple">Master Category</InputLabel>
            <Select onChange={(event, value) => {
              handleMainCategoryChange(event, index)
            }} value={mastercategoryId}
            >
              {mastercategoryitems}
            </Select>
          </FormControl>
          <FormControl margin='normal' style={{ marginRight: '15px' }} className="col-lg-3 col-sm-6 col-12">
            <InputLabel htmlFor="age-simple">Category</InputLabel>
            <Select onChange={(event, value) => {
              handleCategoryChange(event, index)
            }} value={categoryId}
            >
              {categoryitems}
            </Select>
          </FormControl>
          <FormControl margin='normal' className="col-lg-4 col-sm-6 col-12">
            <InputLabel htmlFor="age-simple">Sub Category</InputLabel>
            <Select multiple onChange={(event, value) => {
              handleSubCategoryChange(event, index)
            }} value={subcategoryid}
            >
              {subcategoryitems}
            </Select>
          </FormControl>
          {addtype ?
            <IconButton onClick={() => addRow(rowNum)} className="icon-btn">
              <i className="zmdi zmdi-plus zmdi-hc-fw" />
            </IconButton> :
            <IconButton onClick={() => removeRow(rowsNo)} className="icon-btn">
              <i className="zmdi zmdi-delete zmdi-hc-fw" />
            </IconButton>}
        </div>
      )
    })
  }

  const addRow = (index) => {
    let nextRow = { rowsNo: index, categoryId: '', subcategoryitems: '', subcategoryid: [], addtype: false, deltype: true };
    setAssignExamRow(state => [...state, nextRow])
  }

  const removeRow = (index) => {
    setAssignExamRow(assignexamrow.filter(item => item.rowsNo !== index));
  }

  const handleCategoryChange = async (event, index) => {
    let newArr = [...assignexamrow]; // copying the old datas array
    newArr[index].categoryId = event.target.value;
    const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryByCatId(event.target.value);
    const { subcategory: subcategories } = subcategoryres;
    let itemArr = [];
    for (let subcategory of subcategories) {
      itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
    }
    newArr[index].subcategoryitems = itemArr;
    setAssignExamRow(newArr); // ??
  }

  const handleSubCategoryChange = async (event, index) => {
    let newArr = [...assignexamrow]; // copying the old datas array
    newArr[index].subcategoryid = event.target.value;
    setAssignExamRow(newArr); // ??
  }

  const openview = (open, data) => {

    console.log(data);

    setErrortext(false);
    setViewModal(open);
    setNewModal(false)

    if (data) {
      setIsView(true);
      setSchoolName(data.schoolName);
      setSchoolLogo(data.schoolLogo);
      setSchoolAddress1(data.address1);
      setSchoolAddress2(data.address2)
      setPhoneNumber(data.phoneNumber)
      setMobileNumber(data.mobileNumber)
      setemailId(data.emailId)
      setPassword(password2)
      settotalStudent(data.totalStudents)
      setcontactPerson(data.contactPerson)
      setIpAddress(data.ipAddress)
      var password1 = new Buffer(data.password, 'base64')
      var password2 = password1.toString();
      console.log(password2)
      setPassword(password2)
    }
  }
  const handleSaveButton = () => {

    console.log(errors['SchoolName'], errors['Address1'], errors['Address2'], errors['Email'], errors['PhoneNumber'], errors['schoolLogo'])
    if (errors['SchoolName'] != null || errors['SchoolName'] == undefined || errors['Address1'] != null || errors['Address1'] == undefined || errors['Address2'] != null || errors['Address2'] == undefined || errors['Email'] != null || errors['Email'] == undefined || errors['PhoneNumber'] != null || errors['PhoneNumber'] == undefined || errors['schoolLogo'] != null || errors['schoolLogo'] == undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };

  const saveState = async () => {
    let examdata = [];
    for (let row of assignexamrow) {
      let rowdata = {};
      rowdata.mastercategoryId = row.mastercategoryId;
      rowdata.categoryId = row.categoryId;
      rowdata.subcategoryid = row.subcategoryid;
      examdata.push(rowdata);
    }
    console.log(examdata);
    if (schoolName && address1 && address2 && phoneNumber && files[0] && mobileNumber && emailId && password && totalStudents && contactPerson && files[0]) {
      const formData = new FormData();
      console.log(files[0]);
      formData.append("schoolLogo", files[0]);
      formData.append("schoolName", schoolName);
      formData.append("address1", address1);
      formData.append("address2", address2);
      formData.append("phoneNumber", phoneNumber);
      formData.append("mobileNumber", mobileNumber);
      formData.append("emailId", emailId);
      formData.append("password", password);
      formData.append("totalStudents", totalStudents);
      formData.append("contactPerson", contactPerson);
      formData.append("expirydate", expirydate);
      formData.append("examdata", JSON.stringify(examdata));
      formData.append("ipAddress", ipAddress);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      await schoolService.createSchool(formData);
      setAlertMessage('School Added Successfully');
      await handleRefresh();
      setShowMessage(true);
      setNewModal(false);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }



    else {
      setAlertMessage('Please Give All Required Fields');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    }
  }

  const editState = async () => {
    let examdata = [];
    for (let row of assignexamrow) {
      let rowdata = {};
      rowdata.mastercategoryId = row.mastercategoryId;
      rowdata.categoryId = row.categoryId;
      rowdata.subcategoryid = row.subcategoryid;
      examdata.push(rowdata);
    }
    console.log(examdata);
    if (schoolName && address1 && address2 && phoneNumber && mobileNumber && emailId && password && totalStudents && contactPerson) {
      const newData = new FormData();
      console.log(files[0]);
      newData.append("schoolLogo", files[0] ? files[0] : schoolLogo );
      newData.append("schoolName", schoolName);
      newData.append("address1", address1);
      newData.append("address2", address2);
      newData.append("phoneNumber", phoneNumber);
      newData.append("mobileNumber", mobileNumber);
      newData.append("emailId", emailId);
      newData.append("password", password);
      newData.append("totalStudents", totalStudents);
      newData.append("contactPerson", contactPerson);
      newData.append("expirydate", expirydate);
      newData.append("examdata", JSON.stringify(examdata));
      newData.append("ipAddress", ipAddress);
      for (var pair of newData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      await schoolService.updateSchool(id, newData);
      setAlertMessage('School Updated Successfully');
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
    const { data: inactiveres } = await schoolService.getAllActiveSchool("N");
    const { School: inactivedata } = inactiveres;
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
    const { data: activeres } = await schoolService.getAllActiveSchool("Y");
    const { School: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const edit = {
    marginTop: '-8%',

  };
  const text = {
    marginTop: '-5px',

  };

  const handleExpiryDateChange = (date) => {
    let expdate = Moment(date).format('YYYY-MM-DD');
    console.log(expdate);
    SetExpiryDate(expdate);
  }


  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">School Management</h2>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Schools</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100]}
              entries={5}
              hover
              data={{ rows: schoolrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
            <Modal className="modal-box" backdrop={"static"} openview={onViewModalClose} isOpen={viewmodal}>
              {/* <ModalHeader style={{ padding: '1%' }}   className="col-lg-11 d-flex flex-column order-lg-1"> */}
              {/* <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1"> */}
              {/* {isView == false ? " Operator" :
                "View "} */}
              {/* </div> */}
              {/* </ModalHeader> */}
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
                  <h4>School Name :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {schoolName}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Address 1 :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {address1}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Address 2 :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{address2}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Password :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{password}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Mobile Number :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {mobileNumber}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Phone Number :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{phoneNumber}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>School EmailId :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {emailId}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Contact Person :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{contactPerson}</div>
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>IP Address :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  {ipAddress}
                </div>
              </div>
              <div className="row no-gutters">
                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                  <h4>Total Student :</h4>
                </div>
                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                  <div>{totalStudents}</div>
                </div>
              </div>




            </Modal>

            <Modal className="modal-box" backdrop={"static"} openview={onModalClose} isOpen={newmodal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit == false ? "Add School" :
                  "Edit School"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1" style={edit}>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      label={'School Name'}
                      name={'SchoolName'}
                      onChange={(event) => setSchoolName(event.target.value)}
                      defaultValue={schoolName}
                      value={schoolName}
                      onBlur={valiadateProperty}
                      margin="normal" />

                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['SchoolName']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Address 1 '}
                      name={'Address1'}
                      onChange={(event) => setSchoolAddress1(event.target.value)}
                      defaultValue={address1}
                      value={address1}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Address1']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Address 2 '}
                      name={'Address2'}
                      onChange={(event) => setSchoolAddress2(event.target.value)}
                      defaultValue={address2}
                      value={address2}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Address2']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Phone Number'}
                      name={'PhoneNumber'}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      defaultValue={phoneNumber}
                      value={phoneNumber}
                      pattern="[1-9]{1}[0-9]{9}"
                      type="tel"
                      maxlength={10}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['PhoneNumber']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      label={'Email'}
                      name={'Email'}
                      style={text}
                      onChange={(event) => setemailId(event.target.value)}
                      defaultValue={emailId}
                      value={emailId}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Email']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Password'}
                      name={'Password'}
                      onChange={(event) => setPassword(event.target.value)}
                      defaultValue={password}
                      value={password}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Password']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Contact Name'}
                      name={'ContactName'}
                      onChange={(event) => setcontactPerson(event.target.value)}
                      defaultValue={contactPerson}
                      value={contactPerson}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['ContactName']}</h6></div>
                    {/* </div>
                    </div>
                     <div className="row no-gutters">
                <div className="col-lg-8 d-flex flex-column order-lg-1"> */}
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Mobile Number'}
                      name={'MobileNumber'}
                      type="tel"
                      onChange={(event) => setMobileNumber(event.target.value)}
                      defaultValue={mobileNumber}
                      maxlength={10}

                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['MobileNumber']}</h6></div>
                    <TextField
                      required
                      id="required"
                      autoComplete={'off'}
                      style={text}
                      label={'Total Student'}
                      name={'TotalStudent'}
                      onChange={(event) => settotalStudent(event.target.value)}
                      defaultValue={totalStudents}
                      value={totalStudents}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['TotalStudent']}</h6></div>
                    <DatePicker
                      label="Expiry Date"
                      format='DD-MM-YYYY'
                      disablePast={true}
                      autoOk={true}
                      value={expirydate}
                      onChange={handleExpiryDateChange}
                      animateYearScrolling={false}
                    />
                  </div>

                  <div className="col-lg-2 d-flex flex-column order-lg-1">


                    <div className="dropzone-card">
                      {!viewEditImg &&
                        <div style={{ margin: '30%' }} className="dropzone" >
                          <label style={{ color: 'black', fontWeight: '300' }}>LOGO (100w*100h)</label>
                          <div {...getRootProps({ className: 'dropzone-file-btn' })}>

                            <input {...getInputProps()} />

                            <p>Drag 'n' drop some files here, or click to select files</p>
                          </div>
                        </div>
                      }
                      {!viewEditImg ? <div className="dropzone-content" style={thumbsContainer}>
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
                    {/* <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['schoolLogo']}</h6></div> */}
                  </div>
                  <div className="col-lg-12 d-flex flex-column order-lg-1">
                    {renderAssignExamCategory()}
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
                    <Button style={{ marginRight: '5%' }} onClick={() => editState()} variant="contained" color="primary">Update</Button>
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
      </div>
    </>
  );
};

export default DataTable;