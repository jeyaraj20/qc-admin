import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import * as locationService from '../../../../../../services/locationService';
import * as utilService from '../../../../../../services/utilService';
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
  const [statename, setStateName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [staterows, setStaterows] = useState([]);
  const [selectedState, setSelectedstate] = useState({ "stateId": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [countryitems, setCountryItems] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [stateId, setStateId] = useState();
  const [countrycode, setCountryCode] = useState();
  const [errors, setErrors] = useState({})
  const [selectedSta, setselectedSta] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');

  let selectedStaArr = [];
  const onSelectAll = e => {
    let selected = selectedSta;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.state_id)) {
        document.getElementById(row.state_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.state_status = 1
          else
            row.state_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedStaArr.push(row.state_id);
          selected[row.state_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedstate({ "stateId": selectedStaArr });
        } else {

          if (e.currentTarget.checked)
            row.state_status = 1
          else
            row.state_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedStaArr.length; i++) {
            if (selectedStaArr[i] == row.state_id) {
              selectedStaArr.splice(i, 1);
            }
          }
          console.log(selectedStaArr);
          setSelectedstate({ "stateId": selectedStaArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedSta(selected);
      rowcount = rowcount + 1;
    }
  };

  let selectedStateArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedStateArr = selectedState.stateId;
    if (e.currentTarget.checked)
      obj.state_status = 1
    else
      obj.state_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedStateArr.push(obj.state_id)
      console.log(selectedStateArr);
    } else {
      for (var i = 0; i < selectedStateArr.length; i++) {
        if (selectedStateArr[i] == obj.state_id) {
          selectedStateArr.splice(i, 1);
        }
      }
      console.log(selectedStateArr);
    }
    setSelectedstate({ "stateId": selectedStateArr });
  }


  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Country Name',
      field: 'country_name',
      width: 150,
    },
    {
      label: 'State Name',
      field: 'state_name',
      width: 150,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 5,
    },
    {
      label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
      field: 'select',
      width: 5,
    }
  ]


  const handleCountryChange = (event, value) => {
    console.log(event.target.value);
    setCountryId(event.target.value);
  }
  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    const { data: res } = await locationService.getState('Y');
    const { state: stateres } = res;
    const { count: activecount } = res;
    const { data: inactiveres } = await locationService.getState('N');
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);


    setActiveCount(activecount);
    setData(stateres);

    const { data: countryresult } = await locationService.getCountry('Y');
    const { country: countryres } = countryresult;
    let itemArr = [];
    for (let country of countryres) {
      itemArr.push(<MenuItem value={country.country_id}>{country.country_name}</MenuItem>)
    }
    setCountryItems(itemArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  useEffect(() => {
    //if (data && data.length)
    mapRows(data);
  }, [data])

  const valiadateProperty = (e) => {
    console.log(e);
    let { name, value, className } = e.currentTarget;
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })

    // if (error)
    //   e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
    // else
    //   e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"

    onCheckStateExists(e.target.value);
  }
  const schema = {
    StateName: Joi.string().required(),
    CountryCode: Joi.string().required(),


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

    let staterows = rows.map((obj, index) => {

      let checkedflg = false;
      if (obj.state_status == "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.state_id} id={obj.state_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.country_name = <span>{obj.Country.country_name}</span>
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      return row;
    })
    setStaterows(staterows);

  }

  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }


  const handleAction = async () => {
    let selectedStateObj = selectedState;
    if (action == '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action == 'Inactive') {
        selectedStateObj.status = 'N';
        console.log(selectedStateObj);
        if (selectedState.stateId.length != 0) {
          await locationService.changeStatus(selectedStateObj);
          setAlertMessage('Data successfully inactivated.');
          setSelectedstate({ "stateId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one state');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action == 'Active') {
        selectedStateObj.status = 'Y';
        console.log(selectedStateObj);
        if (selectedState.stateId.length != 0) {
          console.log(stateId)
          await locationService.changeStatus(selectedStateObj);
          setAlertMessage('Data successfully activated.');
          setSelectedstate({ "stateId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one state');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action == 'Delete') {
        selectedStateObj.status = 'D';
        if (selectedStateObj.stateId.length != 0) {
          await locationService.changeStatus(selectedStateObj);
          setAlertMessage('Data successfully deleted.');
          setSelectedstate({ "stateId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one state');
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
    setErrortext(false);
    setErrors({});
    setModal(open);
    if (data) {
      setIsEdit(true);
      setStateName(data.state_name);
      setCountryId(data.country_id);
      setStateId(data.state_id);
      setCountryCode(data.country_code);
    } else {
      setStateName('');
      setCountryId('');
      setCountryCode('');
      setIsEdit(false);
      setSavedisabled(false);
    }
  }

  const saveState = async () => {
    if (countryId && statename) {
      let data = {
        country_id: countryId,
        state_name: statename,
        country_code: countrycode
      }
      await locationService.createState(data);
      setAlertMessage('State Added Successfully');
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

  const onCheckStateExists = async (name) => {
    try {
      if (name != "") {
        let data = {};
        data.table = 'tbl__state';
        data.field = 'state_name';
        data.value = name;
        data.uniqueId = 'state_id';
        if (!isEdit) {
          data.uniqueValue = 0;
        } else {
          data.uniqueValue = stateId;
        }
        data.statusField = 'state_status';
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

  const editState = async () => {
    if (countryId && statename) {
      let data = {
        country_id: countryId,
        state_name: statename,
        country_code: countrycode
      }
      await locationService.editState(data, stateId);
      setAlertMessage('State Updated Successfully');
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


  const handleRequestClose = () => {
    setShowMessage(false)
  };

  const onModalClose = () => {
    setModal(false);
  };

  const getAllInactive = async () => {
    setLoader(true);
    setDataType('Inactive');
    setTxtClass('bg-danger text-white');
    const { data: inactiveres } = await locationService.getState('N');
    const { state: inactivedata } = inactiveres;
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
    const { data: activeres } = await locationService.getState('Y');
    const { state: activedata } = activeres;
    setData(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }



  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">State</h2>
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} State</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[5, 10, 20, 25, 50, 100]}
              entries={5}
              hover
              data={{ rows: staterows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
            <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit == false ? "Add State" :
                  "Edit State"}
              </ModalHeader>

              <div className="modal-box-content" style={{ margintop: "-62px" }}>
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1">
                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">Country</InputLabel>
                      <Select onChange={(event, value) => {
                        handleCountryChange(event, value)
                      }} value={countryId}

                      >
                        {countryitems}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id="required"
                      label={'State Name'}
                      name={'StateName'}
                      onChange={(event) => setStateName(event.target.value)}
                      defaultValue={statename}
                      value={statename}
                      onBlur={valiadateProperty}
                      margin="normal" />
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['StateName']}</h6></div>
                    {errortext && !isEdit &&
                      <h6 style={{ color: 'red', paddingTop: '1%' }}>state already exists</h6>
                    }
                    <TextField
                      required
                      id="required"
                      label={'Country Code'}

                      onChange={(event) => setCountryCode(event.target.value)}
                      defaultValue={countrycode}
                      value={countrycode}

                      margin="normal" />
                    {/* <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['CountryCode']}</h6></div> */}

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