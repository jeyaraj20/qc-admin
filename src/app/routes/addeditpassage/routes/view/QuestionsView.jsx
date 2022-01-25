import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CardBox from "components/CardBox/index";
import {
    MDBDataTable, MDBIcon, MDBBtn,
    MDBCard,
    MDBCardHeader,
    MDBCardBody, MDBRow, MDBCol, MDBInput
} from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import Moment from "moment";
import * as qbankSubCategoryService from '../../../../../services/qbankSubCategoryService';
import * as qbankCategoryService from '../../../../../services/qbankCategoryService';
import * as questionService from '../../../../../services/questionService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as adminService from '../../../../../services/adminService';
import auth from '../../../../../services/authService';
import { questionImageDir, schoolquestionImageDir } from "../../../../../config";

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();


const QuestionsView = (props) => {

    const history = useHistory();

    const [data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [showMessage, setShowMessage] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [categoryrows, setCategoryrows] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ "qid": [] });
    const [action, setAction] = useState('');
    const [inactiveCount, setInactiveCount] = useState('');
    const [activeCount, setActiveCount] = useState('');
    const [waitingCount, setWaitingCount] = useState('');
    const [loader, setLoader] = useState(false);
    const [qType, setQtype] = useState('');
    const [difficultyLevel, setDifficulty] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [searchString, setSearchString] = useState('');
    const [sortby, setSortBy] = useState('');
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [showExamView, setExamView] = useState(false);
    const [showQuestions, setShowQuestions] = useState(true);
    const [catId, setCategoryId] = useState('');
    const [subcatId, setSubCategoryId] = useState('');
    const [questionData, setQuestionData] = useState({});
    const [mode, setMode] = useState();
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCat, setselectedCat] = useState({});
    const [facultyItems, setFacultyItems] = useState([]);
    const [datatype, setDataType] = useState('Waiting');
    const [displayquestions, setDisplayQuestions] = useState("block");
    const [displayloader, setDisplayLoader] = useState("none");

    let selectedCatArr = [];
    const onSelectAll = e => {
        let selected = selectedCat;
        for (let row of data) {
            if (document.getElementById(row.qid)) {
                document.getElementById(row.qid).checked = e.currentTarget.checked;
                if (e.currentTarget.checked) {
                    selectedCatArr.push(row.qid);
                    selected[row.qid] = {
                        "isselected": e.currentTarget.checked
                    };
                    setSelectedCategory({ "catId": selectedCatArr });
                } else {
                    for (var i = 0; i < selectedCatArr.length; i++) {
                        if (selectedCatArr[i] == row.qid) {
                            selectedCatArr.splice(i, 1);
                        }
                    }
                    setSelectedCategory({ "qid": selectedCatArr });
                }
            }
            setSelectAll(e.currentTarget.checked);
            setselectedCat(selected);
        }
    };

    const columns = [
        {
            label: 'Question Type',
            field: 'q_type',
            width: 10,
        },
        {
            label: 'Question Code',
            field: 'question_code',
            width: 10,
        },
        {
            label: 'Question',
            field: 'question',
            width: 100,
        },
        {
            label: 'Added By',
            field: 'quest_add_by',
            width: 50,
        },
        {
            label: 'Difficulty Level',
            field: 'quest_level',
            width: 50,
        },
        {
            label: 'Question Date',
            field: 'quest_date',
            width: 50,
        },
        {
            label: 'Exam View',
            field: 'examview',
            width: 50,
        },
        {
            label: 'View',
            field: 'view',
            width: 50,
        },
        {
            label: 'Edit',
            field: 'edit',
            width: 10,
        },
        {
            label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
            field: 'select',
            width: 10,
        }
    ];

    let { openQuestions } = props;

    const handleRefresh = async () => {
        setLoader(true);
        setDisplayLoader("block");
        let categoryId = localStorage.getItem('categoryId');
        let subcategoryId = localStorage.getItem('subcategoryId');
        setCategoryId(categoryId);
        setSubCategoryId(subcategoryId);
        let getdata = {};
        getdata.cat_id = categoryId;
        getdata.sub_id = subcategoryId;
        getdata.status = 'W';
        const { data: res } = await qbankSubCategoryService.getWaitingQuestions(getdata);
        const { questions: categoryres } = res;
        setData(categoryres);
        let waitingcount = categoryres.length;
        setWaitingCount(waitingcount);
        getdata.quest_status = 'Y';
        const { data: activeres } = await qbankSubCategoryService.getQuestionsCount(getdata);
        const { count: activequesCount } = activeres;
        setActiveCount(activequesCount);
        getdata.quest_status = 'N';
        const { data: inactiveres } = await qbankSubCategoryService.getQuestionsCount(getdata);
        const { count: inactivecount } = inactiveres;
        setInactiveCount(inactivecount);
        const { data: facultyres } = await adminService.getAllOperators();
        const { Operator: facultyName } = facultyres;
        let facultyArr = [];
        for (let Operator of facultyName) {
            facultyArr.push(<MenuItem value={Operator.op_id}>{Operator.op_name}</MenuItem>)
        }
        setFacultyItems(facultyArr);
        setTimeout(() => {
            setLoader(false)
            setDisplayLoader("none");
        }, 1000);
    }

    useEffect(() => {
        // if (data && data.length)
        let user = auth.getCurrentUser();
        let questionImageDirfinal = questionImageDir;
        if (user.user.logintype != 'G') {
            questionImageDirfinal = schoolquestionImageDir;
        }
        mapRows(data, questionImageDirfinal);
    }, [data])



    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        if (showQuestions)
            //setDisplayQuestions("block");
            fetchData();
    }, [showQuestions])

    const mapRows = (rows, questionImageDirfinal) => {
        let rowFields = []// fields in required order
        columns.forEach(column => rowFields.push(column.field))

        let categoryrows = rows.map((obj, index) => {
            let checkedflg = false;
            if (obj.quest_status == "1")
                checkedflg = true;

            let row = {}
            for (let fieldName of rowFields)
                row[fieldName] = obj[fieldName] // fetching required fields in req order
            if (row.q_type == "T") {
                let questionvalue = entities.decode(row.question);
                row.question = <div dangerouslySetInnerHTML={{ __html: questionvalue }}></div>;
            }
            else {
                row.question = <img src={questionImageDirfinal + '/' + row.question} />;

            }
            if (row.q_type == "T") {
                row.q_type = "Text"
            } else {
                row.q_type = "Image"
            }
            if (row.quest_level == "1") {
                row.quest_level = 'Level 1'
            } else if (row.quest_level == "2") {
                row.quest_level = 'Level 2'
            } else if (row.quest_level == "3") {
                row.quest_level = 'Level 3'
            } else if (row.quest_level == "4") {
                row.quest_level = 'Level 4'
            }
            row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
                label="." type="checkbox"
                checked={checkedflg}
                name={obj.qid} id={obj.qid}
                onChange={(e) => { onCategorySelect(e, obj, index) }}
            />;
            row.quest_date = Moment(obj.quest_date).format('DD-MM-YYYY')
            row.examview = <IconButton onClick={() => toggleView(true, 'Examview', obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
            row.view = <IconButton onClick={() => toggleView(true, 'View', obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
            row.edit = <IconButton onClick={() => toggle(true, 'Edit', obj)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

            return row;
        })
        setCategoryrows(categoryrows);
    }
    let selectedCategoryArr = [];
    const onCategorySelect = (e, obj, index) => {
        selectedCategoryArr = selectedCategory.qid;
        if (e.currentTarget.checked)
            obj.quest_status = 1
        else
            obj.quest_status = 0;
        data[index] = obj
        setData([...data])// to avoid shallow checking
        if (e.currentTarget.checked) {
            selectedCategoryArr.push(obj.qid)
        } else {
            for (var i = 0; i < selectedCategoryArr.length; i++) {
                if (selectedCategoryArr[i] == obj.qid) {
                    selectedCategoryArr.splice(i, 1);
                }
            }
        }
        setSelectedCategory({ "qid": selectedCategoryArr });
    }

    const onActionChange = async (event, value) => {
        setAction(event.target.value);
    }

    const onSearchStringChange = (name) => {
        setSearchString(name);
    }

    const handleFacultySearch = (event, value) => {
        setFacultyId(event.target.value);
    }

    const handleDifficultyLevelSearch = (event, value) => {
        setDifficulty(event.target.value);
    }

    const handleSortBySearch = (event, value) => {
        setSortBy(event.target.value);
    }

    const handleQtypeSearch = (event, value) => {
        setQtype(event.target.value);
    }

    const handleSearch = async () => {
        setLoader(true);
        let searchdata = {};
        searchdata.qType = qType;
        searchdata.difficulty = difficultyLevel;
        searchdata.faculty = facultyId;
        searchdata.searchString = searchString;
        searchdata.sortBy = sortby;
        searchdata.cat_id = catId;
        searchdata.sub_id = subcatId;
        const { data: searchresultres } = await questionService.getSearchResult(searchdata);
        const { questions: searchresult } = searchresultres;
        setData(searchresult);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const handleReset = async () => {
        setQtype("");
        setDifficulty("");
        setFacultyId("");
        setSearchString("");
        setSortBy("");
        if (datatype == "Active") {
            await getAllActive();
        }
        if (datatype == "Waiting") {
            await getAllWaiting();
        }
        if (datatype == "Inactive") {
            await getAllInactive();
        }
    }

    const handleAction = async () => {
        let selectedCategoryObj = selectedCategory;
        if (action == '') {
            setAlertMessage('Please select an action');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
        } else {
            if (action == 'Inactive') {
                selectedCategoryObj.status = 'N';
                if (selectedCategory.qid.length != 0) {
                    await questionService.inactiveQuestion(selectedCategoryObj);
                    setAlertMessage('Question successfully inactivated.');
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
            if (action == 'Active') {
                selectedCategoryObj.status = 'Y';
                if (selectedCategory.qid.length != 0) {
                    await questionService.inactiveQuestion(selectedCategoryObj);
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
            if (action == 'Delete') {
                selectedCategoryObj.status = 'D';
                if (selectedCategory.qid.length != 0) {
                    await questionService.inactiveQuestion(selectedCategoryObj);
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
    }

    const toggle = (open, mode, data) => {
        setMode(mode);
        if (data) {
            setQuestionData(data);
        } else {
            setQuestionData({});
        }
        if (open) {
            localStorage.setItem('categoryId', catId);
            localStorage.setItem('subcategoryId', subcatId);
            localStorage.setItem('questionid', data.qid);
            localStorage.setItem('mode', mode);
            window.open(`/app/addeditquestion/addedit?questionids=1`, "_blank")
            //setShowAddQuestion(open);
            setShowQuestions(false);
            setDisplayQuestions("none");
        } else {
            setShowAddQuestion(false);
            setShowQuestions(true);
            setDisplayLoader("none");
            setDisplayQuestions("block");
        }
    }

    const toggleView = (open, mode, data) => {
        setQuestionData(data);
        setMode(mode);
        if (open) {
            setExamView(open);
            setDisplayQuestions("none");
            setShowQuestions(false);
        } else {
            setExamView(false);
            setDisplayQuestions("block");
            setShowQuestions(true);
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
        setDisplayLoader('block');
        setDataType('Inactive');
        let getdata = {};
        getdata.cat_id = catId;
        getdata.sub_id = subcatId;
        getdata.status = 'N';
        const { data: inactiveres } = await qbankSubCategoryService.getInActiveQuestions(getdata);
        const { questions: inactivedata } = inactiveres;
        setData(inactivedata);
        setTimeout(() => {
            setLoader(false)
            setDisplayLoader('none');
        }, 1000);
    }

    const getAllActive = async () => {
        setLoader(true);
        setDisplayLoader('block');
        setDataType('Active');
        let getdata = {};
        getdata.cat_id = catId;
        getdata.sub_id = subcatId;
        getdata.status = 'Y';
        const { data: activeres } = await qbankSubCategoryService.getActiveQuestions(getdata);
        const { questions: activedata } = activeres;
        setData(activedata);
        setTimeout(() => {
            setLoader(false)
            setDisplayLoader('none');
        }, 1000);
    }

    const getAllWaiting = async () => {
        setLoader(true);
        setDisplayLoader('block');
        setDataType('Waiting');
        let getdata = {};
        getdata.cat_id = catId;
        getdata.sub_id = subcatId;
        getdata.status = 'W';
        const { data: inactiveres } = await qbankSubCategoryService.getWaitingQuestions(getdata);
        const { questions: inactivedata } = inactiveres;
        setData(inactivedata);
        setTimeout(() => {
            setLoader(false)
            setDisplayLoader('none');
        }, 1000);
    }

    return (
        <>
            <div style={{ display: displayloader }}>
                <div className="loader-view w-100"
                    style={{ height: 'calc(100vh - 120px)' }}>
                    <CircularProgress />
                </div>
            </div>
            {!showAddQuestion && !loader && !showExamView &&
                <>
                    <form className="row" autoComplete="off">
                        <div className="col-lg-2 col-sm-6 col-12">
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Actions</InputLabel>
                                {datatype == 'Waiting' &&
                                    <Select onChange={(event, value) => {
                                        onActionChange(event, value)
                                    }} >
                                        <MenuItem value={'Active'}>Active</MenuItem>
                                        <MenuItem value={'Inactive'}>Inactive</MenuItem>
                                        <MenuItem value={'Position'}>Position</MenuItem>
                                        <MenuItem value={'Delete'}>Delete</MenuItem>
                                    </Select>
                                }
                                {datatype == 'Active' &&
                                    <Select onChange={(event, value) => {
                                        onActionChange(event, value)
                                    }} >
                                        <MenuItem value={'Inactive'}>Inactive</MenuItem>
                                        <MenuItem value={'Position'}>Position</MenuItem>
                                        <MenuItem value={'Delete'}>Delete</MenuItem>
                                    </Select>
                                }
                                {datatype == 'Inactive' &&
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
                        <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-8 col-sm-6 col-12">
                            <div className="jr-btn-group">
                                <Button onClick={() => toggle(true, '')} variant="contained" color="default" className="jr-btn">
                                    <i className="zmdi zmdi-plus zmdi-hc-fw" />
                                    <span>Add</span>
                                </Button>
                                <Button onClick={() => getAllWaiting()} variant="contained" className="jr-btn bg-warning text-white">
                                    <i className="zmdi zmdi-check zmdi-hc-fw" />
                                    <span> Waiting <br /> ({waitingCount})</span>
                                </Button>
                                <Button onClick={() => getAllActive()} variant="contained" className="jr-btn bg-success text-white">
                                    <i className="zmdi zmdi-check zmdi-hc-fw" />
                                    <span> Active <br /> ({activeCount})</span>
                                </Button>
                                <Button onClick={() => getAllInactive()} variant="contained" className="jr-btn bg-danger text-white">
                                    <i className="zmdi zmdi-block zmdi-hc-fw" />
                                    <span> Inactive <br /> ({inactiveCount})</span>
                                </Button>
                                <Button onClick={() => openQuestions(false)} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-arrows zmdi-hc-fw" />
                                    <span> Sub Category <br /> ({activeCount})</span>
                                </Button>
                            </div>
                        </div>
                    </form>
                    <AppBar position="static" color="inherit" className="jr-border-radius">
                        <Toolbar>
                            <div className="col-lg-2 d-flex flex-column order-lg-1">
                                <FormControl className="w-100 mb-12">
                                    <InputLabel htmlFor="age-simple">Question Type</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleQtypeSearch(event, value)
                                    }} value={qType}
                                    >
                                        <MenuItem value={'T'}>Text</MenuItem>
                                        <MenuItem value={'I'}>Image</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-2 d-flex flex-column order-lg-1">
                                <FormControl className="w-100 mb-12">
                                    <InputLabel htmlFor="age-simple">Sort by date</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleSortBySearch(event, value)
                                    }} value={sortby}
                                    >
                                        <MenuItem value={'asc'}>Ascending</MenuItem>
                                        <MenuItem value={'desc'}>Descending</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-2 d-flex flex-column order-lg-1">
                                <FormControl className="w-100 mb-12">
                                    <InputLabel htmlFor="age-simple">Difficulty Level</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleDifficultyLevelSearch(event, value)
                                    }} value={difficultyLevel}
                                    >
                                        <MenuItem value={'1'}>Level 1</MenuItem>
                                        <MenuItem value={'2'}>Level 2</MenuItem>
                                        <MenuItem value={'3'}>Level 3</MenuItem>
                                        <MenuItem value={'4'}>Level 4</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-2 d-flex flex-column order-lg-1">
                                <FormControl className="w-100 mb-12">
                                    <InputLabel htmlFor="age-simple">Select Faculty</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleFacultySearch(event, value)
                                    }} value={facultyId}
                                    >
                                        {facultyItems}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-2 d-flex flex-column order-lg-1">
                                <TextField
                                    id="searchstring"
                                    label={'Search'}
                                    name={'searchstring'}
                                    onChange={(event) => onSearchStringChange(event.target.value)}
                                    defaultValue={searchString}
                                    margin="normal" />
                            </div>
                            <div className="col-lg-1 d-flex flex-column order-lg-1">
                                <Button onClick={() => handleSearch()} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-search zmdi-hc-fw" />
                                </Button>
                            </div>
                            <div className="col-lg-1 d-flex flex-column order-lg-1">
                                <Button onClick={() => handleReset()} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-format-clear-all zmdi-hc-fw" />
                                </Button>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <MDBDataTable
                        striped
                        bordered
                        entriesOptions={[5, 10, 20, 25, 50, 100]}
                        entries={50}
                        hover
                        data={{ rows: categoryrows, columns }}
                        small
                        responsive
                        disableRetreatAfterSorting={true}
                    />
                    <Snackbar
                        className="mb-3 bg-info"
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={showMessage}
                        autoHideDuration={3000}
                        onClose={() => handleRequestClose}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={alertMessage}
                    />
                </>
            }
        </>
    );
};

export default QuestionsView;