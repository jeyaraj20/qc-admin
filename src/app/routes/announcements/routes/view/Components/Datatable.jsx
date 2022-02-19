import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import * as AnnouncementsService from '../../../../../../services/announcementsService';
import * as utilService from '../../../../../../services/utilService';
import { Modal as AntdModal } from 'antd';
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
  const [Announcements, setAnnouncements] = useState('');
  const [position, setPosition] = useState('');
  const [AnnouncementsName, setAnnouncementsName] = useState('');
  const [files, setFiles] = useState([]);
  const [editthumbs, setEditthumbs] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ "AnnouncementsId": [] });
  const [action, setAction] = useState('');
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCat, setselectedCat] = useState({});
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(true);
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');
  const [selectedmaster, setSelectedMaster] = useState('');

  let selectedCatArr = [];
  let posArr = [];
  const onSelectAll = e => {
    let selected = selectedCat;
    posArr = changePositionData.values;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.exam_id)) {
        document.getElementById(row.exam_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {
          if (e.currentTarget.checked)
            row.isSelected = true;
          else
            row.isSelected = false;
          data[rowcount] = row
          setData([...data])

          selectedCatArr.push(row.Announcements_id);
          selected[row.Announcements_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedCategory({ "Announcements_id": selectedCatArr });
          let postionObj = {};
          postionObj.AnnouncementsId = row.Announcements_id;
          postionObj.position = row.Announcements_pos;
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
            if (selectedCatArr[i] === row.Announcements_id) {
              selectedCatArr.splice(i, 1);
            }
          }
          if (posArr.length != 0) {
            for (var s = 0; s < posArr.length; s++) {
              if (posArr[s].AnnouncementsId === row.Announcements_id) {
                posArr.splice(s, 1);
              }
            }
          }
          setSelectedCategory({ "AnnouncementsId": selectedCatArr });
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
      label: 'Announcements',
      field: 'Announcements',
      width: 230
    },
    
    {
      label: 'Position',
      field: 'Announcements_pos',
      sort: 'asc',
      width: 1,
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
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px', marginLeft: '-10px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 5,
    },
  ]

  const schema = {
    Examination: Joi.string().required(),
    Position: Joi.number().required(),
    Announcements: Joi.number().required(),
  }

  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    const { data: res } = await AnnouncementsService.getAnnouncements();
    const { category: categoryres } = res;
    const { count: activecount } = res;
    setActiveCount(activecount);
    setData(categoryres)
    const { data: inactiveres } = await AnnouncementsService.getInactiveAnnouncements();
    const { category: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  useEffect(() => {
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
    let rowFields = []
    columns.forEach(column => rowFields.push(column.field))

    let categoryrowsdata = rows.map((obj, index) => {
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] 
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px', marginLeft: '-10px' }}
        label="." type="checkbox"
        checked={obj.isSelected}
        name={obj.Announcements_id} id={obj.Announcements_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.Announcements_pos = <input type="text" name={'pos' + obj.Announcements_id}
        onChange={event => onPositionChange(event, obj, index)}
        style={{ width: '50px', textAlign: 'center', padding: '0px' }}
        value={obj.Announcements_pos}
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
    selectedCategoryArr = selectedCategory.AnnouncementsId;
    changePosArr = changePositionData.values;
    if (e.currentTarget.checked)
      obj.isSelected = true;
    else
      obj.isSelected = false;
    data[index] = obj
    setData([...data])
    if (e.currentTarget.checked) {
      selectedCategoryArr.push(obj.Announcements_id)
      let postionObj = {};
      for (var i = 0; i < changePosArr.length; i++) {
        if (changePosArr[i].AnnouncementsId === obj.Announcements_id) {
          changePosArr.splice(i, 1);
        }
      }
      postionObj.AnnouncementsId = obj.Announcements_id;
      postionObj.position = obj.Announcements_pos;
      changePosArr.push(postionObj);
      setChangePositionData({ "values": changePosArr });
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] === obj.Announcements_id) {
          selectedCategoryArr.splice(i, 1);
        }
      }
      if (changePosArr.length != 0) {
        for (var s = 0; s < changePosArr.length; s++) {
          if (changePosArr[s].AnnouncementsId === obj.Announcements_id) {
            changePosArr.splice(s, 1);
          }
        }
      }
      setChangePositionData({ "values": changePosArr });
    }
    setSelectedCategory({ "AnnouncementsId": selectedCategoryArr });
  }

  const onPositionChange = (e, obj, index) => {
    obj.Announcements_pos = e.target.value
    data[index] = obj
    setData([...data])
  }

  const onActionChange = async (event, value) => {
    setAction(event.target.value);
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
        if (selectedCategory.AnnouncementsId.length != 0) {
          AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to Inactive this Announcements.',
            okText: 'Yes',
            onOk: () => Inactive(id),
            cancelText: 'No',
          });
          const Inactive = async () => {
            await AnnouncementsService.inactiveCategory(selectedCategoryObj);
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
        if (selectedCategory.AnnouncementsId.length != 0) {
          AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to Active this Announcements.',
            okText: 'Yes',
            onOk: () => Active(id),
            cancelText: 'No',
          });
          const Active = async () => {
            await AnnouncementsService.inactiveCategory(selectedCategoryObj);
            setAlertMessage('Data successfully activated.');
            await handleRefresh();
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false)
            }, 1500);
          }
        } else {
          setAlertMessage('Please select atleast one Announcements');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action === 'Delete') {
        if (selectedCategory.AnnouncementsId.length != 0) {
          AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to Delete this Announcements.',
            okText: 'Yes',
            onOk: () => Delete(id),
            cancelText: 'No',
          });
          const Delete = async () => {
            await AnnouncementsService.deleteCategory(selectedCategory);
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
          await AnnouncementsService.changePosition(changePositionData);
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
      setAnnouncements(data.Announcements);
      setPosition(data.Announcements_pos );
      setCategoryId(data.Announcements_id)
      let catArr = data.Announcements_name ? data.Announcements_name.split(',') : [];
      setSelectedMaster(catArr);
      if (catArr.length > 0) {
        for (let i = 0; i < catArr.length; i++) {
        }
      }
      setEditthumbs(editthumbs);
    } else {
      let position = activeCount + inactiveCount + 1;
      setPosition(position);
      setAnnouncements('');
      setIsEdit(false);
      setSavedisabled(false);
      setFiles([]);
    }
  }

  const saveAnnouncements = async () => {
    if (Announcements && position && AnnouncementsName) {
      let obj = {
        "Announcements": Announcements,
        "Announcements_pos": position,
        "Announcements_name": AnnouncementsName,
      }
      await AnnouncementsService.saveAnnouncements(obj);
      setAlertMessage('Announcements Added Successfully');
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

  const editAnnouncements = async () => {
    if (Announcements && position && AnnouncementsName && categoryId) {
      let obj = {
        "Announcements_id" :categoryId,
        "Announcements": Announcements,
        "Announcements_pos": position,
        "Announcements_name": AnnouncementsName,
      }
      await AnnouncementsService.editAnnouncements(categoryId,obj);
      setAlertMessage('Announcements Updated Successfully');
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
      content: 'Do you want to delete this Announcements.',
      okText: 'Yes',
      onOk: () => deleteOneCategory(id),
      cancelText: 'No',
    });
  }

  const deleteOneCategory = async (id) => {
    const AnnouncementsId = id.Announcements_id
    if (AnnouncementsId) {
      if (selectedCategory.AnnouncementsId = id.Announcements_id) {
        await AnnouncementsService.deleteCategory(selectedCategory);
        setAlertMessage('Data successfully deleted.');
        await handleRefresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
      else {
      let obj = { "Announcements_id": AnnouncementsId }
        await AnnouncementsService.deleteCategory(selectedCategory,obj);
        setAlertMessage('Announcements Updated Successfully');
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

    if (name === 'Examination')
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
    const { data: inactiveres } = await AnnouncementsService.getInactiveAnnouncements();
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
    const { data: activeres } = await AnnouncementsService.getAnnouncements();
    const { category: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const onCategoryNameChange = (name) => {
    let slug = (name).replace(/ /g, "-").toLowerCase();
    setAnnouncements(name)
  }

  const onCheckCategoryExists = async (name) => {
    try {
      if (name !== "") {
        let data = {};
        data.table = 'tbl__qc_Announcements';
        data.field = 'Announcements';
        data.value = name;
        data.uniqueId = 'Announcements_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'Announcements_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
        if (response.count > 0) {
          setSavedisabled(true);
          setErrortext(true);
        } else {
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
        data.table = 'tbl__qc_Announcements';
        data.field = 'Announcements';
        data.uniqueId = 'Announcements_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = categoryId;
        }
        data.statusField = 'Announcements_status';
        const { data: response } = await utilService.checkAlreadyExists(data);
        if (response.count > 0) {
          setSavedisabled(true);
          setErrors({ ...errors, ['Slug']: 'Slug already exists', "errordetails": null })
        } else {
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
        <h2 className="title mb-3 mb-sm-0">Announcements</h2>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Announcements</h4>
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
                {isEdit === false ? "Add Announcements" :
                  "Edit Announcements"}
              </ModalHeader>
              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1">
                    <TextField
                      required
                      id="required"
                      label={'Announcements'}
                      name={'Announcements'}
                      onChange={(event) => setAnnouncementsName(event.target.value)}
                      onBlur={valiadateProperty}
                      defaultValue={AnnouncementsName}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Announcements']}</h6></div>
                    <TextField
                      id="required"
                      label={'Examination'}
                      name={'Examination'}
                      autoComplete={'off'}
                      onChange={(event) => onCategoryNameChange(event.target.value)}
                      //onBlur={(event) => onCheckCategoryExists(event.target.value)}
                      onBlur={valiadateProperty}
                      defaultValue={Announcements}
                      margin="none" />
                    {errortext && !isEdit &&
                      <h6 style={{ color: 'red', paddingTop: '1%' }}>Announcements already exists</h6>
                    }
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Examination']}</h6></div>

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
                </div>
              </div>
              <ModalFooter>
                {isEdit === false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveAnnouncements()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editAnnouncements()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
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