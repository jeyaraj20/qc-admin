import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { useDropzone } from "react-dropzone";
import * as homeCategoryService from '../../../../../../services/homeCategoryService';
import { homeCategoryImageDir } from "../../../../../../config";
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

const DataTable = (props) => {
  const [modal, setModal] = useState(false)
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [statename, setStatename] = useState('');
  const [position, setPosition] = useState('');
  const [files, setFiles] = useState([]);
  const [editthumbs, setEditthumbs] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [viewEditImg, setviewEditImg] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categoryrows, setCategoryrows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ "catId": [] });
  const [action, setAction] = useState('');
  const [changePositionData, setChangePositionData] = useState({ "values": [] });
  const [inactiveCount, setInactiveCount] = useState('');
  const [activeCount, setActiveCount] = useState('');
  const [categoryitems, setCategoryItems] = useState([]);
  const [maincategoryId, setMainCategoryId] = useState('');
  const [loader, setLoader] = useState(false);
  const [savedisabled, setSavedisabled] = useState(false);
  const [errortext, setErrortext] = useState(false);
  const [catstateId, setCatstateId] = useState();

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
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: window.webkitURL.createObjectURL(file)
      })));
      setviewEditImg(false);
    }
  });
  const handleMainCategoryChange = (event, value) => {
    console.log(event.target.value);
    setMainCategoryId(event.target.value);
  }
  const handleRefresh = async () => {
    setLoader(true);
    const { data: res } = await homeCategoryService.getHomeCategory();
    const { category: categoryres } = res;
    const { count: activecount } = res;
    setActiveCount(activecount);
    mapRows(categoryres);
    const { data: inactiveres } = await homeCategoryService.getInactiveHomeCategory();
    const { category: inactivedata } = inactiveres;
    const { count: inactivecount } = inactiveres;
    setInactiveCount(inactivecount);
    const { data: maincategoryres } = await exammainCategoryService.getAllQuestionMainCategory();
    const { category: categories } = maincategoryres;
    let itemArr = [];
    for (let category of categories) {
      itemArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
    }
    setCategoryItems(itemArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name}
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    //handleRefresh();
    files.forEach(file => window.webkitURL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])

  const { rows, columns } = props;
  let rowcount = 0;
  const mapRows = (rows) => {
    let rowFields = []// fields in required order
    columns.forEach(column => rowFields.push(column.field))

    let categoryrows = rows.map(obj => {
      //setCatstateId({[obj.exa_cat_id]: obj.exa_cat_pos})
      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.select = <Checkbox color="primary"
        onChange={(event, checked) => {
          onCategorySelect(checked, obj.exa_cat_id)
        }}
      />
      row.sno = <span>{rowcount}</span>
      row.exa_cat_pos = <input type="text" onChange={(event) => onPositionChange(event.target.value, obj.exa_cat_id)} style={{ width: '50px', textAlign: 'center' }} defaultValue={obj.exa_cat_pos} className="form-control form-control-lg" />
      {/*row.exa_cat_pos = <TextField
        onChange={(event) => onPositionChange(event.target.value, obj.exa_cat_id)}
        defaultValue={obj.exa_cat_pos}
      margin="none" />*/}
      row.edit = <IconButton onClick={() => toggle(true, obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

      return row;
    })
    setCategoryrows(categoryrows);
  }
  const selectedCategoryArr = [];
  const onCategorySelect = (isChecked, categoryId) => {
    console.log(isChecked);
    if (isChecked) {
      selectedCategoryArr.push(categoryId)
      console.log(selectedCategoryArr);
    } else {
      for (var i = 0; i < selectedCategoryArr.length; i++) {
        if (selectedCategoryArr[i] === categoryId) {
          selectedCategoryArr.splice(i, 1);
        }
      }
      console.log(selectedCategoryArr);
    }
    setSelectedCategory({ "catId": selectedCategoryArr });
  }

  const changePositionArr = [];
  const onPositionChange = (posVal, categoryId) => {
    let postionObj = {};
    if (posVal != '') {
      for (var i = 0; i < changePositionArr.length; i++) {
        if (changePositionArr[i].catId === categoryId) {
          changePositionArr.splice(i, 1);
        }
      }
      postionObj.catId = categoryId;
      postionObj.position = posVal;
      changePositionArr.push(postionObj);
      console.log(changePositionArr);
      setChangePositionData({ "values": changePositionArr });
    }
  }


  const onActionChange = async (event, value) => {
    setAction(event.target.value);
  }

  const deleteImage = () => {
    setviewEditImg(false);
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
        console.log(selectedCategoryObj);
        if (selectedCategory.catId.length != 0) {
          await homeCategoryService.inactiveCategory(selectedCategoryObj);
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
        console.log(selectedCategoryObj);
        if (selectedCategory.catId.length != 0) {
          await homeCategoryService.inactiveCategory(selectedCategoryObj);
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
        console.log(selectedCategory);
        if (selectedCategory.catId.length != 0) {
          await homeCategoryService.deleteCategory(selectedCategory);
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
      console.log(changePositionData);
      if (changePositionData.values.length != 0) {
        await homeCategoryService.changePosition(changePositionData);
        setAlertMessage('Position successfully updated.');
        await handleRefresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    }
  }

  const toggle = (open, data) => {
    console.log(data);
    setErrortext(false);
    setModal(open);
    if (data) {
      setIsEdit(true);
      setviewEditImg(true);
      let slug = (data.exa_cat_name).replace(/ /g, "-").toLowerCase();
      setCategoryName(data.exa_cat_name);
      setPosition(data.exa_cat_pos);
      setSlug(slug);
      setCategoryId(data.exa_cat_id);
      const editthumbs = (
        <div style={thumb} key={data.exa_cat_image}>
          <div style={thumbInner}>
            <img alt={data.exa_cat_image}
              src={homeCategoryImageDir + '/' + data.exa_cat_image}
              style={img}
            />
          </div>
        </div>
      );
      setEditthumbs(editthumbs);
    } else {
      let position = activeCount + inactiveCount + 1;
      setPosition(position);
      setCategoryName('');
      setSlug('');
      setIsEdit(false);
      setviewEditImg(false);
    }
    console.log(data);
  }

  const saveHomeCategory = async () => {
    const formData = new FormData();
    console.log(files[0]);
    formData.append("exa_cat_image_url", files[0]);
    formData.append("exa_cat_name", categoryName);
    formData.append("exa_cat_slug", slug);
    formData.append("exaid", 0);
    formData.append("exaid_sub", 0);
    formData.append("examcat_type", 'M');
    formData.append("exa_cat_pos", position);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    await homeCategoryService.saveHomeCategory(formData);
    setAlertMessage('Home Category Added Successfully');
    await handleRefresh();
    setShowMessage(true);
    setModal(false);
    setTimeout(() => {
      setShowMessage(false)
    }, 1500);
  }

  const editHomeCategory = async () => {
    const formData = new FormData();
    console.log(files[0]);
    formData.append("exa_cat_image_url", files[0]);
    formData.append("exa_cat_name", categoryName);
    formData.append("exa_cat_slug", slug);
    formData.append("exaid", 0);
    formData.append("exaid_sub", 0);
    formData.append("examcat_type", 'M');
    formData.append("exa_cat_pos", position);
    await homeCategoryService.editHomeCategory(categoryId, formData);
    setAlertMessage('Home Category Updated Successfully');
    await handleRefresh();
    setShowMessage(true);
    setModal(false);
    setTimeout(() => {
      setShowMessage(false)
    }, 1500);
  }

  const handleRequestClose = () => {
    setShowMessage(false)
  };

  const onModalClose = () => {
    setModal(false);
  };

  const getAllInactive = async () => {
    setLoader(true);
    const { data: inactiveres } = await homeCategoryService.getInactiveHomeCategory();
    const { category: inactivedata } = inactiveres;
    mapRows(inactivedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const getAllActive = async () => {
    setLoader(true);
    const { data: activeres } = await homeCategoryService.getHomeCategory();
    const { category: activedata } = activeres;
    mapRows(activedata);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const onCategoryNameChange = (name) => {
    let slug = (name).replace(/ /g, "-").toLowerCase();
    setSlug(slug);
    setCategoryName(name)
  }

  const onCheckCategoryExists = async (name) => {
    try {
      const { data: response } = await homeCategoryService.checkCategoryExists(name);
      if (response) {
        setSavedisabled(true);
        setErrortext(true);
      }
    } catch (err) {
      if (err) {
        setSavedisabled(false);
        setErrortext(false);
      }
    }
  }


  return (
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
                  <MenuItem value={'Active'}>Active</MenuItem>
                  <MenuItem value={'Inactive'}>Inactive</MenuItem>
                 
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
          <MDBDataTable
            striped
            bordered
            entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
            entries={5}
            hover
            data={{ rows: categoryrows, columns }}
            small
            responsive
          />
          <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={modal}>
            <ModalHeader className="modal-box-header bg-primary text-white">
              {isEdit === false ? "Add State" :
                "Edit State"}
            </ModalHeader>

            <div className="modal-box-content">
              <div className="row no-gutters">
                <div className="col-lg-8 d-flex flex-column order-lg-1">
                <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="age-simple">Country</InputLabel>
                      <Select onChange={(event, value) => {
                        handleMainCategoryChange(event, value)
                      }} value={maincategoryId}
                      >
                          <MenuItem value={'M'}>--Select--</MenuItem>
                        {categoryitems}
                      </Select>
                    </FormControl>
                  <TextField
                    required
                    id="required"
                    label={'State Name'}
                    onChange={(event) => setCategoryName(event.target.value)}
                    defaultValue={statename}
                    value={statename}
                    margin="normal" />
                  {/* <TextField
                    required
                    id="required"
                    label={'Position'}
                    onChange={(event) => setPosition(event.target.value)}
                    defaultValue={position}
                    margin="normal" /> */}
                </div>
                {/* <div className="col-lg-2 d-flex flex-column order-lg-1">
                  <div className="dropzone-card">
                    {!viewEditImg &&
                      <div style={{ margin: '30%' }} className="dropzone">
                        <div {...getRootProps({ className: 'dropzone-file-btn' })}>
                          <input {...getInputProps()} />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                      </div>
                    }
                    {viewEditImg === false ? <div className="dropzone-content" style={thumbsContainer}>
                      {thumbs}
                    </div> :
                      <div className="dropzone-content" style={thumbsContainer}>
                        {editthumbs}
                        <Button onClick={() => deleteImage()} variant="contained" className="jr-btn bg-danger text-white">
                          <i className="zmdi zmdi-delete zmdi-hc-fw" />
                        </Button>
                      </div>}
                  </div>
                </div> */}
              </div>
            </div>
            <ModalFooter>
              {isEdit === false ?
                <div className="d-flex flex-row">
                  <Button style={{ marginRight: '5%' }} onClick={() => saveHomeCategory()} disabled={savedisabled} variant="contained" color="primary">Save</Button>
                  <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                </div> :
                <div className="d-flex flex-row">
                  <Button style={{ marginRight: '5%' }} onClick={() => editHomeCategory()} disabled={savedisabled} variant="contained" color="primary">Update</Button>
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
  );
};

export default DataTable;