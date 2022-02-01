import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import { Spin } from 'antd';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import * as qbankCategoryService from '../../../../../../services/qbankCategoryService';
import * as utilService from '../../../../../../services/utilService';
import auth from '../../../../../../services/authService';
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
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ "catId": [] });
  const [action, setAction] = useState('');
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [errors, setErrors] = useState({})
  const [checked, setChecked] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [datatype, setDataType] = useState('');
  const [txtclass, setTxtClass] = useState('');
  const [usertype, setUserType] = useState('');

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
            row.isSelected = true;
          else
            row.isSelected = false;
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


  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Title',
      field: 'cat_name',
      width: 150,
    },
    {
      label: 'Position',
      field: 'cat_pos',
      width: 20,
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
    const { data: res } = await qbankCategoryService.getAllQuestionMainCategory();
    const { category: categoryres } = res;
    let activecount = categoryres.length;
    setActiveCount(activecount);
    setData(categoryres)
    const { data: inactiveres } = await qbankCategoryService.getInactiveQbankCategory();
    const { category: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  useEffect(() => {

    if (data && data.length)
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

      return row;
    })
    setCategoryrows(categoryrowsdata);
  }


  const onPositionChange = (e, obj, index) => {
    obj.cat_pos = e.target.value
    data[index] = obj
    setData([...data])
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
          await qbankCategoryService.inactiveCategory(selectedCategoryObj);
          setSelectedCategory({ "catId": [] });
          setAction('');
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
          await qbankCategoryService.inactiveCategory(selectedCategoryObj);
          setSelectedCategory({ "catId": [] });
          setAction('');
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
        if (selectedCategory.catId.length != 0) {
          await qbankCategoryService.deleteCategory(selectedCategory);
          setSelectedCategory({ "catId": [] });
          setAction('');
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
      if (changePositionData.values.length != 0) {
        await qbankCategoryService.changePosition(changePositionData);
        setChangePositionData({ "values": [] });
        setAction('');
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

  const toggle = (open, data) => {
    setErrors({});
    setModal(open);
    if (data) {
      setIsEdit(true);
      let slug = (data.cat_name).replace(/ /g, "-").toLowerCase();
      setCategoryName(data.cat_name);
      setPosition(data.cat_pos);
      setSlug(slug);
      setCategoryId(data.cat_id);
    } else {
      let position = activeCount + inactiveCount + 1;
      setPosition(position);
      setCategoryName('');
      setSlug('');
      setIsEdit(false);
    }
  }

  const saveQbankCategory = async () => {
    if (categoryName && slug && position) {
      setSaveLoader(true);
      const saveObj = {};
      saveObj.cat_name = categoryName;
      saveObj.cat_slug = slug;
      saveObj.cat_pos = position;
      await qbankCategoryService.saveQbankCategory(saveObj);
      setAlertMessage('Qbank Main Category Added Successfully');
      await handleRefresh();
      setSaveLoader(false);
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

  const editQbankCategory = async () => {
    if (categoryName && slug && position) {
      setSaveLoader(true);
      const editObj = {};
      editObj.cat_name = categoryName;
      editObj.cat_slug = slug;
      editObj.cat_pos = position;
      await qbankCategoryService.editQbankCategory(categoryId, editObj);
      setAlertMessage('Qbank Main Category Updated Successfully');
      await handleRefresh();
      setSaveLoader(false);
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
    if (name === 'Title')
      onCheckAlreadyExists(e.target.value);
    if (name === 'Slug')
      onCheckSlugExists(e.target.value);
  }
  const schema = {
    Title: Joi.string().required(),

    Slug: Joi.string().required(),
    Position: Joi.string().required(),


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
        if (usertype === 'G') {
          data.table = 'tbl__category';
        } else {
          data.table = 'tbl__school_question_category';
        }
        data.field = 'cat_slug';
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
    const { data: inactiveres } = await qbankCategoryService.getInactiveQbankCategory();
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
    setAction('');
    const { data: activeres } = await qbankCategoryService.getAllQuestionMainCategory();
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
        <h2 className="title mb-3 mb-sm-0">Question Bank Main Category</h2>
      </div>
      <div className="col-12">
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {!loader &&
          <Spin spinning={saveLoader} tip='Uploading...'>
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
              <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Q Bank Main Category</h4>
              <MDBDataTable
                striped
                bordered
                entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
                entries={5}
                hover
                data={{ rows: categoryrows, columns }}
                small
                responsive
                disableRetreatAfterSorting={true} />
              <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
                <Spin spinning={saveLoader} tip='Uploading...'>
                  <ModalHeader className="modal-box-header bg-primary text-white">
                    {isEdit === false ? "Add Question Bank Main Category" :
                      "Edit Question Bank Main Category"}
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
                          defaultValue={categoryName}
                          onBlur={valiadateProperty}
                          margin="none" />
                        {errortext &&
                          <h6 style={{ color: 'red', paddingTop: '1%' }}>Main Category already exists</h6>
                        }
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
                        <label style={{ color: '#3274bb', margintop: '-15px' }}>Eg : title-slug</label>
                        <TextField
                          required
                          id="required"
                          label={'Position'}
                          name={'Position'}
                          onBlur={valiadateProperty}
                          onChange={(event) => setPosition(event.target.value)}
                          defaultValue={position}
                          margin="normal" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Position']}</h6></div>
                      </div>
                    </div>
                  </div>
                  <ModalFooter>
                    {isEdit === false ?
                      <div className="d-flex flex-row">
                        <Button style={{ marginRight: '5%' }} onClick={() => saveQbankCategory()} variant="contained" disabled={savedisabled} color="primary">Save</Button>
                        <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                      </div> :
                      <div className="d-flex flex-row">
                        <Button style={{ marginRight: '5%' }} onClick={() => editQbankCategory()} variant="contained" disabled={savedisabled} color="primary">Update</Button>
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
            </div>
          </Spin>
        }
      </div>
    </>
  );
};

export default DataTable;