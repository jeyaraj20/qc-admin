import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CardBox from "components/CardBox/index";
import {
    MDBDataTable, MDBInput
} from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import Moment from "moment";
import * as examSubCategoryService from '../../../../../services/examSubCategoryService';
import * as examService from '../../../../../services/examServices';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as adminService from '../../../../../services/adminService';

const ExamsDatatable = (props) => {

    const history = useHistory();

    const [data, setData] = useState([])
    const [showMessage, setShowMessage] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [categoryrows, setCategoryrows] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ "exam_id": [] });
    const [action, setAction] = useState('');
    const [inactiveCount, setInactiveCount] = useState('');
    const [activeCount, setActiveCount] = useState('');
    const [waitingCount, setWaitingCount] = useState('');
    const [subcatCount, setSubCatCount] = useState('');
    const [loader, setLoader] = useState(false);
    const [maincategoryId, setMainCategoryId] = useState('');
    const [showAddExam, setShowAddExam] = useState(false);
    const [showAddBankExam, setShowAddBankExam] = useState(false);
    const [showCommonExamView, setCommonExamView] = useState(false);
    const [showExamsTable, setShowExamsTable] = useState(true);
    const [examData, setExamData] = useState({});
    const [examDetails, setExamDetails] = useState({});
    const [mode, setMode] = useState();
    const [showMapQuestionCommon, setShowMapQuestionCommon] = useState(false);
    const [facultyItems, setFacultyItems] = useState([]);
    const [facultyId, setFacultyId] = useState('');
    const [searchString, setSearchString] = useState('');
    const [qType, setQtype] = useState('');
    const [difficultyLevel, setDifficulty] = useState('');
    const [subid, setSubId] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCat, setselectedCat] = useState({});
    const [datatype, setDataType] = useState('');
    const [txtclass, setTxtClass] = useState('');
    const [examType, setExamType] = useState('');
    const [exam_cat, setExam_cat] = useState("");
    const [exam_sub, setExam_sub] = useState("");
    const [exam_sub_sub, setExam_sub_sub] = useState("");
    const [attendedexams, setAttendedExams] = useState([]);
    const [paidexams, setPaidExams] = useState([]);

    let selectedCatArr = [];
    const onSelectAll = e => {
        let selected = selectedCat;
        let rowcount = 0;
        for (let row of data) {
            if (document.getElementById(row.exam_id)) {
                document.getElementById(row.exam_id).checked = e.currentTarget.checked;
                if (e.currentTarget.checked) {

                    if (e.currentTarget.checked)
                        row.exam_status = 1
                    else
                        row.exam_status = 0;
                    data[rowcount] = row
                    setData([...data])

                    selectedCatArr.push(row.exam_id);
                    selected[row.exam_id] = {
                        "isselected": e.currentTarget.checked
                    };
                    console.log(selectedCatArr);
                    setSelectedCategory({ "exam_id": selectedCatArr });
                } else {

                    if (e.currentTarget.checked)
                        row.exam_status = 1
                    else
                        row.exam_status = 0;
                    data[rowcount] = row
                    setData([...data])

                    for (var i = 0; i < selectedCatArr.length; i++) {
                        if (selectedCatArr[i] == row.exam_id) {
                            selectedCatArr.splice(i, 1);
                        }
                    }
                    console.log(selectedCatArr);
                    setSelectedCategory({ "exam_id": selectedCatArr });
                }
            }
            setSelectAll(e.currentTarget.checked);
            setselectedCat(selected);
            rowcount = rowcount + 1;
        }
    };

    const columns = [
        {
            label: 'Exam Name',
            field: 'exam_name',
            width: 10,
        },
        {
            label: 'Exam Code',
            field: 'exam_code',
            width: 10,
        },
        {
            label: 'Assigned / Total Questions',
            field: 'tot_questions',
            width: 100,
        },
        {
            label: 'Manual/Auto',
            field: 'manu',
            width: 50,
        },
        {
            label: 'Paid/Free',
            field: 'paid',
            width: 50,
        },
        {
            label: 'Added By',
            field: 'exam_add_name',
            width: 50,
        },
        {
            label: 'Difficulty Level',
            field: 'exam_level',
            width: 50,
        },
        {
            label: 'Date',
            field: 'exam_date',
            width: 50,
        },
        {
            label: 'Edit',
            field: 'edit',
            width: 10,
        },
        {
            label: 'View',
            field: 'view',
            width: 50,
        },
        {
            label: (<MDBInput style={{ marginTop: '-7%', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
            field: 'select',
            width: 10,
        },
    ];

    const navigateTo = () => history.push('/app/examsubcategory/view');

    const handleRefresh = async () => {
        setLoader(true);
        let getdata = {};
        console.log('test');
        let status = localStorage.getItem('status');
        if (status == 'Active') {
            getdata.status = 'Y';
            setTxtClass('bg-success text-white');
            setDataType('Active');
        }
        if (status == 'Inactive') {
            getdata.status = 'N';
            setTxtClass('bg-danger text-white');
            setDataType('Inactive');
        }
        if (status == 'Waiting') {
            getdata.status = 'W';
            setTxtClass('bg-warning text-white');
            setDataType('Waiting');
        }
        let subId = localStorage.getItem('subId');
        let examtype = localStorage.getItem('examtype');
        console.log(examtype);
        let exaid = localStorage.getItem('exaid');
        setExam_cat(exaid);
        let exaidsub = localStorage.getItem('exaidsub');
        setExam_sub(exaidsub);
        let exacatid = localStorage.getItem('exacatid');
        setExam_sub_sub(exacatid);
        setExamType(examtype);
        setSubId(subId);
        getdata.exa_cat_id = subId;
        if (examtype == 'C') {
            getdata.type = 'C';

        } else {
            getdata.type = 'B';
        }
        const { data: attres } = await examService.getAllAttendedExam();
        const { rows: attexamres } = attres;
        setAttendedExams(attexamres);
        const { data: paidres } = await examService.getAllPaidExam();
        const { rows: paidexamres } = paidres;
        setPaidExams(paidexamres);
        const { data: res } = await examService.getAllExamsWithAssigned(getdata);
        const { Exam: examres } = res;
        console.log(examres);
        //setWaitingCount(waitingcount);
        getdata.status = 'W';
        const { data: waitres } = await examService.getAllExamsCount(getdata);
        const { count: waitingcount } = waitres;
        setWaitingCount(waitingcount);

        getdata.status = 'Y';
        const { data: activeres } = await examService.getAllExamsCount(getdata);
        const { count: activeExamCount } = activeres;
        setActiveCount(activeExamCount);
        setData(examres);
        getdata.status = 'N';
        const { data: inactiveres } = await examService.getAllExamsCount(getdata);
        const { count: inactivecount } = inactiveres;
        setInactiveCount(inactivecount);
        const { data: subcatres } = await examSubCategoryService.getSubCategoryCount('Y');
        const { count: subcategorycount } = subcatres;
        setSubCatCount(subcategorycount);
        const { data: facultyres } = await adminService.getAllOperators();
        const { Operator: facultyName } = facultyres;
        let facultyArr = [];
        for (let Operator of facultyName) {
            facultyArr.push(<MenuItem value={Operator.op_id}>{Operator.op_name}</MenuItem>)
        }
        setFacultyItems(facultyArr);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const handleFacultySearch = (event, value) => {
        setFacultyId(event.target.value);
    }

    const onSearchStringChange = (name) => {
        setSearchString(name);
    }

    const handleQtypeSearch = (event, value) => {
        setQtype(event.target.value);
    }

    const handleDifficultyLevelSearch = (event, value) => {
        setDifficulty(event.target.value);
    }

    const handleSearch = async () => {
        setLoader(true);
        console.log(datatype);
        let status = ''
        if (datatype == 'Active') {
            status = 'Y'
        }
        if (datatype == 'Inactive') {
            status = 'N'
        }
        if (datatype == 'Waiting') {
            status = 'W'
        }
        let searchdata = {};
        searchdata.qType = qType;
        searchdata.difficulty = difficultyLevel;
        searchdata.faculty = facultyId;
        searchdata.searchString = searchString;
        searchdata.exam_cat = exam_cat;
        searchdata.exam_sub = exam_sub;
        searchdata.exam_sub_sub = exam_sub_sub;
        searchdata.status = status;
        searchdata.examtype = examType;
        const { data: searchresultres } = await examService.getSearchResult(searchdata);
        const { exams: searchresult } = searchresultres;
        console.log(searchdata);
        console.log(searchresult);
        setData(searchresult);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const handleReset = async () => {
        setQtype('');
        setDifficulty('');
        setFacultyId('');
        setSearchString('');
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

    useEffect(() => {
        if (data && data.length || data.length == 0)
            mapRows(data);
    }, [data])

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])

    const mapRows = (rows) => {
        let rowFields = []// fields in required order
        columns.forEach(column => rowFields.push(column.field))

        let categoryrows = rows.map((obj, index) => {
            //console.log(obj);
            let questiontype;
            let freetotal = 0;
            let paidtotal = 0;
            for (let exam of attendedexams) {
                if (obj.exam_id == exam.exam_id) {
                    freetotal = freetotal + 1;
                }
            }
            for (let paid of paidexams) {
                if (obj.exam_id == paid.exam_id) {
                    paidtotal = paidtotal + 1;
                }
            }

            if (obj.exam_type_cat == "P") {
                questiontype = "Prev Questions"
            } else if (obj.quest_type == 'MANU') {
                questiontype = "MANU Questions"
            } else {
                questiontype = "AUTO Questions"
            }
            let freetype;
            if (obj.payment_flag == "Y") {
                freetype = 'PAID (' + paidtotal + ')';
            } else {
                freetype = 'FREE (' + freetotal + ')';
            }
            let checkedflg = false;
            if (obj.exam_status == "1")
                checkedflg = true;

            let row = {}
            for (let fieldName of rowFields)
                row[fieldName] = obj[fieldName] // fetching required fields in req order

            row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
                label="." type="checkbox"
                checked={checkedflg}
                name={obj.exam_id} id={obj.exam_id}
                onChange={(e) => { onCategorySelect(e, obj, index) }}
            />;
            row.exam_date = Moment(obj.exam_date).format('DD-MM-YYYY')
            row.paid = freetype;
            row.manu = <Badge color="secondary" badgeContent={0} ><Button onClick={() => openMapQuestions(true, obj)} variant="contained" color="primary">
                {questiontype}
            </Button></Badge>
            row.tot_questions = <span>{obj.totalassigned} / {obj.tot_questions}</span>
            row.view = <IconButton onClick={() => toggleView(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
            row.edit = <IconButton onClick={() => toggle(true, 'Edit', obj, examType)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

            return row;
        })
        setCategoryrows(categoryrows);
    }

    let selectedCategoryArr = [];
    const onCategorySelect = (e, obj, index) => {
        selectedCategoryArr = selectedCategory.exam_id;
        if (e.currentTarget.checked)
            obj.exam_status = 1
        else
            obj.exam_status = 0;
        data[index] = obj
        setData([...data])// to avoid shallow checking
        console.log(e.currentTarget.checked);
        console.log(selectedCategoryArr);
        if (e.currentTarget.checked) {
            if (obj.exam_type_cat != 'P') {
                if (obj.totalassigned == obj.tot_questions) {
                    selectedCategoryArr.push(obj.exam_id)
                } else {
                    setAlertMessage('Questions need to assign');
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false)
                    }, 1500);
                }
            } else {
                selectedCategoryArr.push(obj.exam_id)
            }
        } else {
            for (var i = 0; i < selectedCategoryArr.length; i++) {
                if (selectedCategoryArr[i] == obj.exam_id) {
                    selectedCategoryArr.splice(i, 1);
                }
            }
        }
        setSelectedCategory({ "exam_id": selectedCategoryArr });
    }

    const openMapQuestions = async (open, data) => {
        console.log(data);
        let master = localStorage.getItem('mastercategory');
        localStorage.setItem('mastercategory', master);
        let cat = localStorage.getItem('category');
        localStorage.setItem('category', cat);
        let subcat = localStorage.getItem('subcategory');
        localStorage.setItem('subcategory', subcat);
        localStorage.setItem('examtype', data.exam_type);
        localStorage.setItem('examid', data.exam_id);
        localStorage.setItem('examname', data.exam_name);
        localStorage.setItem('examslug', data.exam_slug);
        localStorage.setItem('examcode', data.exam_code);
        localStorage.setItem('totalquestions', data.tot_questions);
        localStorage.setItem('markperquest', data.mark_perquest);
        localStorage.setItem('negmarkperquest', data.neg_markquest);
        localStorage.setItem('totmarks', data.tot_mark);
        localStorage.setItem('totaltime', data.total_time);
        localStorage.setItem('assigntesttype', data.assign_test_type);
        localStorage.setItem('examtypecat', data.exam_type_cat);
        localStorage.setItem('examlevel', data.exam_level);
        localStorage.setItem('questtype', data.quest_type);
        localStorage.setItem('examposition', data.exam_pos);
        localStorage.setItem('examtypeid', data.exam_type_id);
        localStorage.setItem('exaid', exam_cat);
        localStorage.setItem('exasubid', exam_sub);
        localStorage.setItem('exasubsub', exam_sub_sub);
        if (open) {
            history.push('/app/examsubcategory/map');
            setExamDetails(data);
            setShowExamsTable(false);
        } else {
            setShowMapQuestionCommon(false);
            setShowExamsTable(true);
        }
    }

    const onActionChange = async (event, value) => {
        setAction(event.target.value);
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
                console.log(selectedCategoryObj);
                if (selectedCategory.exam_id.length != 0) {
                    await examService.updateExamStatus(selectedCategoryObj);
                    setAlertMessage('Exam successfully inactivated.');
                    setSelectedCategory({ "exam_id": [] });
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
                console.log(selectedCategoryObj);
                if (selectedCategory.exam_id.length != 0) {
                    await examService.updateExamStatus(selectedCategoryObj);
                    setAlertMessage('Exam successfully activated.');
                    setSelectedCategory({ "exam_id": [] });
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
                console.log(selectedCategory);
                if (selectedCategory.exam_id.length != 0) {
                    await examService.updateExamStatus(selectedCategoryObj);
                    setAlertMessage('Exam successfully deleted.');
                    setSelectedCategory({ "exam_id": [] });
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
            if (action == 'Waiting') {
                selectedCategoryObj.status = 'W';
                console.log(selectedCategoryObj);
                if (selectedCategory.exam_id.length != 0) {
                    await examService.updateExamStatus(selectedCategoryObj);
                    setAlertMessage('Exam successfully inactivated.');
                    setSelectedCategory({ "exam_id": [] });
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

    const toggle = async (open, mode, data, examType) => {
        console.log(data);
        localStorage.setItem('mode', mode);
        localStorage.setItem('examid', data.exam_id);
        localStorage.setItem('examname', data.exam_name);
        localStorage.setItem('examslug', data.exam_slug);
        localStorage.setItem('examcode', data.exam_code);
        localStorage.setItem('totalquestions', data.tot_questions);
        localStorage.setItem('markperquest', data.mark_perquest);
        localStorage.setItem('negmarkperquest', data.neg_markquest);
        localStorage.setItem('totmarks', data.tot_mark);
        localStorage.setItem('totaltime', data.total_time);
        localStorage.setItem('assigntesttype', data.assign_test_type);
        localStorage.setItem('examtypecat', data.exam_type_cat);
        localStorage.setItem('examlevel', data.exam_level);
        localStorage.setItem('questtype', data.quest_type);
        localStorage.setItem('examposition', data.exam_pos);
        localStorage.setItem('examtypeid', data.exam_type_id);
        localStorage.setItem('exaid', exam_cat);
        localStorage.setItem('exaidsub', exam_sub);
        localStorage.setItem('exacatid', exam_sub_sub);
        localStorage.setItem('paymentflag', data.payment_flag);
        localStorage.setItem('sellingprice', data.selling_price);
        localStorage.setItem('offerprice', data.offer_price);
        if (data) {
            setExamDetails(data);
            if (data.exam_type == 'C') {
                history.push(`/app/examsubcategory/commonedit`);
                setShowAddBankExam(false);
            } else {
                history.push(`/app/examsubcategory/bankedit`);
                setShowAddExam(false);
            }
        } else {
            if (open) {
                if (data.exam_type == 'C') {
                    history.push(`/app/examsubcategory/commonedit`);
                    setShowAddBankExam(false);
                } else {
                    history.push(`/app/examsubcategory/bankedit`);
                    setShowAddExam(false);
                }
                setShowExamsTable(false);
            } else {
                setShowAddExam(false);
                setShowAddBankExam(false);
                setShowExamsTable(true);
                await handleRefresh();
            }
        }
        setMode(mode);
    }

    const toggleView = (open, data) => {
        console.log(data);
        localStorage.setItem('exam_name', data.exam_name)
        localStorage.setItem('exam_slug', data.exam_slug)
        localStorage.setItem('exam_code', data.exam_code)
        localStorage.setItem('tot_questions', data.tot_questions)
        localStorage.setItem('mark_perquest', data.mark_perquest)
        localStorage.setItem('tot_mark', data.tot_mark)
        localStorage.setItem('neg_markquest', data.neg_markquest)
        localStorage.setItem('total_time', data.total_time)
        localStorage.setItem('exam_type_cat', data.exam_type_cat)
        localStorage.setItem('exam_type_id', data.exam_type_id)
        localStorage.setItem('exam_level', data.exam_level)
        localStorage.setItem('exam_date', data.exam_date)
        localStorage.setItem('exam_status', data.exam_status)
        window.open(`/app/examsubcategory/examsview`, "_blank")
    }

    const handleRequestClose = () => {
        setShowMessage(false)
    };

    const getAllInactive = async () => {
        setLoader(true);
        setDataType('Inactive');
        setTxtClass('bg-danger text-white');
        setQtype('');
        setDifficulty('');
        setFacultyId('');
        setSearchString('');
        let getdata = {};
        getdata.exa_cat_id = subid;
        if (examType == 'C') {
            getdata.type = 'C';
            getdata.status = 'N';
        } else {
            getdata.type = 'B';
            getdata.status = 'N';
        }
        const { data: res } = await examService.getAllExamsWithAssigned(getdata);
        const { Exam: examres } = res;
        const { count: inactivecount } = res;
        setInactiveCount(inactivecount);
        setData(examres);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const getAllActive = async () => {
        setLoader(true);
        setDataType('Active');
        setTxtClass('bg-success text-white');
        setQtype('');
        setDifficulty('');
        setFacultyId('');
        setSearchString('');
        let getdata = {};
        getdata.exa_cat_id = subid;
        if (examType == 'C') {
            getdata.type = 'C';
            getdata.status = 'Y';
        } else {
            getdata.type = 'B';
            getdata.status = 'Y';
        }
        const { data: activeres } = await examService.getAllExamsWithAssigned(getdata);
        const { Exam: activedata } = activeres;
        const { count: activecount } = activeres;
        setActiveCount(activecount);
        setData(activedata);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const getAllWaiting = async () => {
        setLoader(true);
        setDataType('Waiting');
        setTxtClass('bg-warning text-white');
        setQtype('');
        setDifficulty('');
        setFacultyId('');
        setSearchString('');
        let getdata = {};
        getdata.exa_cat_id = subid;
        if (examType == 'C') {
            getdata.type = 'C';
            getdata.status = 'W';
        } else {
            getdata.type = 'B';
            getdata.status = 'W';
        }
        const { data: res } = await examService.getAllExamsWithAssigned(getdata);
        const { Exam: examres } = res;
        const { count: waitingCount } = res;
        setWaitingCount(waitingCount);
        setData(examres);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    return (
        <>
            {loader &&
                <div className="loader-view w-100"
                    style={{ height: 'calc(100vh - 120px)' }}>
                    <CircularProgress />
                </div>
            }
            {showExamsTable && !loader &&
                <div className="row animated slideInUpTiny animation-duration-3">
                    <CardBox styleName="col-12" cardStyle=" p-0">
                        <div className="col-12">
                            <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                                <h2 className="title mb-3 mb-sm-0">Exams for {localStorage.getItem('mastercategory')} - {localStorage.getItem('category')} - {localStorage.getItem('subcategory')}</h2>
                            </div>
                            <form className="row" autoComplete="off">
                                <div className="col-lg-2 col-sm-6 col-12">
                                    <FormControl className="w-100 mb-2">
                                        <InputLabel htmlFor="age-simple">Actions</InputLabel>
                                        {datatype == 'Waiting' &&
                                            <Select onChange={(event, value) => {
                                                onActionChange(event, value)
                                            }} >
                                                <MenuItem value={'Inactive'}>Inactive</MenuItem>
                                                <MenuItem value={'Active'}>Active</MenuItem>
                                                <MenuItem value={'Delete'}>Delete</MenuItem>
                                            </Select>
                                        }
                                        {datatype == 'Active' &&
                                            <Select onChange={(event, value) => {
                                                onActionChange(event, value)
                                            }} >
                                                <MenuItem value={'Waiting'}>Waiting</MenuItem>
                                                <MenuItem value={'Inactive'}>Inactive</MenuItem>
                                                <MenuItem value={'Delete'}>Delete</MenuItem>
                                            </Select>
                                        }
                                        {datatype == 'Inactive' &&
                                            <Select onChange={(event, value) => {
                                                onActionChange(event, value)
                                            }} >
                                                <MenuItem value={'Waiting'}>Waiting</MenuItem>
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
                                <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-8 col-sm-6 col-12">
                                    <div className="jr-btn-group">
                                        <Button onClick={() => toggle(true, 'Add', '', examType)} variant="contained" color="default" className="jr-btn">
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
                                        <Button onClick={() => navigateTo()} variant="contained" color="primary" className="jr-btn">
                                            <i className="zmdi zmdi-arrows zmdi-hc-fw" />
                                            <span>Exam Sub Category <br /> ({subcatCount})</span>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                            <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Exams for {localStorage.getItem('mastercategory')} - {localStorage.getItem('category')} - {localStorage.getItem('subcategory')}</h4>
                            <AppBar position="static" color="inherit" className="jr-border-radius">
                                <Toolbar>
                                    <div className="col-lg-2 d-flex flex-column order-lg-1">
                                        <FormControl className="w-100 mb-12">
                                            <InputLabel htmlFor="age-simple">Exam Type</InputLabel>
                                            <Select onChange={(event, value) => {
                                                handleQtypeSearch(event, value)
                                            }} value={qType}
                                            >
                                                <MenuItem value={'MANU'}>Manual</MenuItem>
                                                <MenuItem value={'AUTO'}>Automatic</MenuItem>
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
                                    <div className="col-lg-3 d-flex flex-column order-lg-1">
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
                                    <div className="col-lg-3 d-flex flex-column order-lg-1">
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
                                entries={100}
                                hover
                                data={{ rows: categoryrows, columns }}
                                small
                                responsive
                                noBottomColumns
                                disableRetreatAfterSorting={true} />
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
                        </div>
                    </CardBox>
                </div>
            }
        </>
    );
};

export default ExamsDatatable;