import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';

import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as locationService from '../../../../../../services/locationService';
import { homeCategoryImageDir } from "../../../../../../config";
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Joi from 'joi-browser';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [cityname, setCityName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [cityrows, setCityrows] = useState([]);
  const [selectedCity, setSelectedcity] = useState({ "cityId": [] });
  const [action, setAction] = useState('');
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [stateitems, setStateItems] = useState([]);
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [citycode, setCityCode] = useState();
  const [errors, setErrors] = useState({})
  const [selectedCit, setselectedCit] = useState({});
  const [datatype, setDataType] = useState('Active');
  const [txtclass, setTxtClass] = useState('bg-success text-white');

  let selectedCitArr = [];
  const onSelectAll = e => {
    let selected = selectedCit;
    let rowcount = 0;
    for (let row of data) {
      if (document.getElementById(row.city_id)) {
        document.getElementById(row.city_id).checked = e.currentTarget.checked;
        if (e.currentTarget.checked) {

          if (e.currentTarget.checked)
            row.city_status = 1
          else
            row.city_status = 0;
          data[rowcount] = row
          setData([...data])

          selectedCitArr.push(row.city_id);
          selected[row.city_id] = {
            "isselected": e.currentTarget.checked
          };
          setSelectedcity({ "cityId": selectedCitArr });
        } else {

          if (e.currentTarget.checked)
            row.city_status = 1
          else
            row.city_status = 0;
          data[rowcount] = row
          setData([...data])

          for (var i = 0; i < selectedCitArr.length; i++) {
            if (selectedCitArr[i] === row.city_id) {
              selectedCitArr.splice(i, 1);
            }
          }
          console.log(selectedCitArr);
          setSelectedcity({ "cityId": selectedCitArr });
        }
      }
      setSelectAll(e.currentTarget.checked);
      setselectedCit(selected);
      rowcount = rowcount + 1;
    }
  };

  let selectedCityArr = [];
  const onCategorySelect = (e, obj, index) => {
    selectedCityArr = selectedCity.cityId;
    if (e.currentTarget.checked)
      obj.city_status = 1
    else
      obj.city_status = 0;
    data[index] = obj
    setData([...data])// to avoid shallow checking
    if (e.currentTarget.checked) {
      selectedCityArr.push(obj.city_id)
      console.log(selectedCityArr);
    } else {
      for (var i = 0; i < selectedCityArr.length; i++) {
        if (selectedCityArr[i] === obj.city_id) {
          selectedCityArr.splice(i, 1);
        }
      }
      console.log(selectedCityArr);
    }
    setSelectedcity({ "cityId": selectedCityArr });
  }

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'City Name',
      field: 'city_name',
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

  const handleStateChange = (event, value) => {
    console.log(event.target.value);
    setStateId(event.target.value);
  }
  const handleRefresh = async () => {
    setLoader(true);
    setSelectAll(false);
    const { data: res } = await locationService.getCity('Y');
    const { city: cityres } = res;
    const { count: activecount } = res;
    console.log(cityres);
    const { data: inactiveres } = await locationService.getCity('N');
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);


    setActiveCount(activecount);
    setData(cityres);


    const { data: stateresult } = await locationService.getState('Y');
    const { state: stateres } = stateresult;
    let itemArr = [];
    for (let state of stateres) {
      itemArr.push(<MenuItem value={state.state_id}>{state.state_name}</MenuItem>)
    }
    setStateItems(itemArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }
  const schema = {
    Cityname: Joi.string().required(),

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
  const mapRows = (rows) => {
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))

    let cityrows = rows.map((obj, index) => {

      let checkedflg = false;
      if (obj.city_status === "1")
        checkedflg = true;

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
        label="." type="checkbox"
        checked={checkedflg}
        name={obj.city_id} id={obj.city_id}
        onChange={(e) => { onCategorySelect(e, obj, index) }}
      />;
      row.sno = <span>{rowcount}</span>
      row.state_name = <span>{obj.State.state_name}</span>
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>
      return row;
    })
    setCityrows(cityrows);

  }



  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }



  const handleAction = async () => {
    let selectedCityObj = selectedCity;
    if (action === '') {
      setAlertMessage('Please select an action');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false)
      }, 1500);
    } else {
      if (action === 'Inactive') {
        selectedCityObj.status = 'N';
        console.log(selectedCityObj);
        if (selectedCity.cityId.length != 0) {
          await locationService.changecityStatus(selectedCityObj);
          setAlertMessage('Data successfully inactivated.');
          setSelectedcity({ "cityId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one city');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action === 'Active') {
        selectedCityObj.status = 'Y';
        console.log(selectedCityObj);
        if (selectedCity.cityId.length != 0) {
          await locationService.changecityStatus(selectedCityObj);
          setAlertMessage('Data successfully activated.');
          setSelectedcity({ "cityId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one City');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
      if (action === 'Delete') {
        selectedCityObj.status = 'D';
        if (selectedCityObj.cityId.length != 0) {
          await locationService.changecityStatus(selectedCityObj);
          setAlertMessage('Data successfully deleted.');
          setSelectedcity({ "cityId": [] });
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please select atleast one City');
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
    setModal(open);
    if (data) {
      setIsEdit(true);
      setCityName(data.city_name);
      setStateId(data.state_id);
      setCityId(data.city_id);
      setCityCode(data.city_code);
    } else {
      setCityName('');
      setStateId('');

      setCityCode('');
      setSavedisabled(false);
      setIsEdit(false);
    }
  }
  const handleSaveButton = () => {
    console.log(errors['Cityname'])
    if (errors['cityname'] != null || errors['cityname'] === undefined) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  };
  const saveCity = async () => {
    if (stateId && cityname) {
      let data = {
        state_id: stateId,
        city_name: cityname,
        city_code: citycode
      }
      await locationService.createCity(data);
      setAlertMessage('City Added Successfully');
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


  const editCity = async () => {
    if (stateId && cityname) {
      let data = {
        state_id: stateId,
        city_name: cityname,
        city_code: citycode
      }
      await locationService.editCity(data, cityId);
      setAlertMessage('City Updated Successfully');
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
    const { data: inactiveres } = await locationService.getCity('N');
    const { city: inactivedata } = inactiveres;
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
    const { data: activeres } = await locationService.getCity('Y');
    const { city: activedata } = activeres;
    setData(activedata);

    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }



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
    onCheckCityExists(e.target.value);
  }

  // if (error)
  //   e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
  // else
  //   e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"


  const onCheckCityExists = async (name) => {
    try {
      if (name != "") {
        const { data: response } = await locationService.checkCityExists(name);
        if (response) {
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

  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">City</h2>
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
                      <MenuItem value={'Delete'}>Delete</MenuItem>
                    </Select>
                  }
                  {datatype === 'Inactive' &&
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
            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} City</h4>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[ 5, 10, 20, 25, 50, 100, 1000 ]}
              entries={5}
              hover
              data={{ rows: cityrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
            <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
              <ModalHeader className="modal-box-header bg-primary text-white">
                {isEdit === false ? "Add City" :
                  "Edit City"}
              </ModalHeader>

              <div className="modal-box-content">
                <div className="row no-gutters">
                  <div className="col-lg-8 d-flex flex-column order-lg-1">
                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">State</InputLabel>
                      <Select onChange={(event, value) => {
                        handleStateChange(event, value)
                      }} value={stateId}
                      >
                        {stateitems}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id="required"
                      label={'City Name'}
                      name={'Cityname'}
                      onChange={(event) => setCityName(event.target.value)}
                      defaultValue={cityname}
                      value={cityname}
                      onBlur={valiadateProperty}
                      margin="normal" />

                    {errortext && !isEdit &&
                      <h6 style={{ color: 'red', paddingTop: '1%' }}>City already exists</h6>
                    }
                    <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['Cityname']}</h6></div>

                    <TextField

                      id="required"
                      label={'City Code'}
                      name={'Citycode'}
                      onChange={(event) => setCityCode(event.target.value)}
                      defaultValue={citycode}
                      value={citycode}

                      margin="normal" />


                  </div>

                </div>
              </div>
              {<ModalFooter>
                {isEdit === false ?
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => saveCity()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                    <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                  </div> :
                  <div className="d-flex flex-row">
                    <Button style={{ marginRight: '5%' }} onClick={() => editCity()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
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