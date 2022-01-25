import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import {
    MDBDataTable, MDBInput
} from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import Moment from "moment";
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as examSubCategoryService from '../../../../../../services/examSubCategoryService';
import * as examService from '../../../../../../services/examServices';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddEditExam from './AddEditExam';
import AddEditBankExam from './AddEditBankExam';
import CommonExamView from './CommonExamView';
import Badge from '@material-ui/core/Badge';
import MapQuestionCommon from './MapQuestionCommon';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import auth from '../../../../../../services/authService';
import * as adminService from '../../../../../../services/adminService';

const ExamsDatatable = (props) => {
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
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCat, setselectedCat] = useState({});
    const [datatype, setDataType] = useState('Active');
    const [txtclass, setTxtClass] = useState('bg-success text-white');
    const [showexammaincategory, setShowExamMainCategory] = useState(false);
    const [categoryitems, setCategoryItems] = useState([]);
    const [subcategoryitems, setSubCategoryItems] = useState([]);
    const [subsubitems, setSubSubItems] = useState([]);
    const [subcategoryId, setSubCategoryId] = useState('');
    const [subsubcategoryId, setSubSubCategoryId] = useState('');
    const [attendedexams, setAttendedExams] = useState([]);
    const [paidexams, setPaidExams] = useState([]);
    const [usertype, setUserType] = useState('');

    let selectedCatArr = [];
    const onSelectAll = e => {
        let selected = selectedCat;
        let rowcount = 0;
        console.log(data);
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

    let { openExams, examtype, subId, examdata } = props;

    const handleRefresh = async () => {
        setLoader(true);
        console.log(examdata);
        let getdata = {};
        getdata.exa_cat_id = subId;
        if (datatype == 'Active') {
            getdata.status = 'Y';
        }
        if (datatype == 'Inactive') {
            getdata.status = 'N';
        }
        if (datatype == 'Waiting') {
            getdata.status = 'W';
        }
        if (examtype == 'C') {
            getdata.type = 'C';
        } else {
            getdata.type = 'B';
        }
        let user = auth.getCurrentUser();
        setUserType(user.user.logintype);
        if (user.user.logintype == 'G') {
            const { data: attres } = await examService.getAllAttendedExam();
            const { rows: attexamres } = attres;
            setAttendedExams(attexamres);
            const { data: paidres } = await examService.getAllPaidExam();
            const { rows: paidexamres } = paidres;
            setPaidExams(paidexamres);
        }
        const { data: res } = await examService.getAllExamsWithAssigned(getdata);
        const { Exam: examres } = res;
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
        console.log(subcategorycount);
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
        searchdata.exam_cat = examdata.exaid;
        searchdata.exam_sub = examdata.exaid_sub;
        searchdata.exam_sub_sub = examdata.exa_cat_id;
        searchdata.status = status;
        searchdata.examtype = examtype;
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
            console.log(obj);
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
            row.exam_date = Moment(obj.exam_date).format('DD-MM-YYYY');
            if (usertype == 'G') {
                row.paid = freetype;
            } else {
                row.paid = "----";
            }
            row.manu = <Badge color="secondary" badgeContent={0} ><Button onClick={() => openMapQuestions(true, obj)} variant="contained" color="primary">
                {questiontype}
            </Button></Badge>
            row.tot_questions = <span>{obj.totalassigned} / {obj.tot_questions}</span>
            row.view = <IconButton onClick={() => toggleView(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
            row.edit = <IconButton onClick={() => toggle(true, 'Edit', obj, examtype)} className="icon-btn"><i className="zmdi zmdi-edit zmdi-hc-fw" /></IconButton>

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
        if (open) {
            setShowMapQuestionCommon(open);
            setExamDetails(data);
            setShowExamsTable(false);
        } else {
            setShowMapQuestionCommon(false);
            await handleRefresh();
            setShowExamsTable(true);
        }
    }

    const onActionChange = async (event, value) => {
        setAction(event.target.value);
        if (event.target.value == 'Move') {
            setShowExamMainCategory(true);
            const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
            const { category: categories } = maincategoryres;
            let itemArr = [];
            for (let category of categories) {
                itemArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
            }
            setCategoryItems(itemArr);
        } else {
            setShowExamMainCategory(false);
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
                    setAlertMessage('Data successfully deleted.');
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
            if (action == 'Move') {
                selectedCategoryObj.exa_cat = maincategoryId;
                selectedCategoryObj.exam_sub = subcategoryId;
                selectedCategoryObj.exam_sub_sub = subsubcategoryId;
                console.log(selectedCategoryObj);
                await examService.moveExam(selectedCategoryObj);
                setAlertMessage('Exam moved successfully.');
                setSelectedCategory({ "exam_id": [] });
                await handleRefresh();
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false)
                }, 1500);
            }
        }
    }

    const toggle = async (open, mode, data, examType) => {
        console.log(data);
        setMode(mode);
        if (data) {
            setExamDetails(data);
            localStorage.setItem('mastercategory', examdata.Mastercategory);
            localStorage.setItem('category', examdata.category);
            localStorage.setItem('subcategory', examdata.exa_cat_name);
            localStorage.setItem('examtype', examType);
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
            localStorage.setItem('exaid', examdata.exaid);
            localStorage.setItem('exaidsub', examdata.exaid_sub);
            localStorage.setItem('exacatid', examdata.exa_cat_id);
            localStorage.setItem('paymentflag', data.payment_flag);
            localStorage.setItem('sellingprice', data.selling_price);
            localStorage.setItem('offerprice', data.offer_price);
            localStorage.setItem('status', datatype);
            if (examType == 'C') {
                window.open(`/app/examsubcategory/commonedit`, "_blank")
            } else {
                localStorage.setItem('sectcutoff', data.sect_cutoff);
                localStorage.setItem('secttiming', data.sect_timing);
                window.open(`/app/examsubcategory/bankedit`, "_blank")
            }
        } else {
            if (open) {
                if (examType == 'C') {
                    setShowAddExam(open);
                    setShowAddBankExam(false);
                } else {
                    setShowAddBankExam(open);
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
    }

    /*const toggle = async (open, mode, data, examType) => {
        console.log(data);
        if (data) {
            setExamDetails(data);
        }
        if (open) {
            if (examType == 'C') {
                setShowAddExam(open);
                setShowAddBankExam(false);
            } else {
                setShowAddBankExam(open);
                setShowAddExam(false);
            }
            setShowExamsTable(false);
        } else {
            setShowAddExam(false);
            setShowAddBankExam(false);
            setShowExamsTable(true);
            await handleRefresh();
        }
        setMode(mode);
    }*/

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
        /*if (data) {
            setExamData(data);
        }
        if (open) {
            setCommonExamView(true);
            setShowExamsTable(false);
        } else {
            setCommonExamView(false);
            setShowExamsTable(true);
        }*/
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
        getdata.exa_cat_id = subId;
        if (examtype == 'C') {
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
        getdata.exa_cat_id = subId;
        if (examtype == 'C') {
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
        getdata.exa_cat_id = subId;
        if (examtype == 'C') {
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

    const handleMainCategoryChange = async (event, value) => {
        setMainCategoryId(event.target.value);
        const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(event.target.value);
        const { category: categories } = subcategoryres;
        console.log(categories);
        let itemArr = [];
        for (let subcategory of categories) {
            itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
        }
        setSubCategoryItems(itemArr);
    }

    const handleSubCategoryChange = async (event, value) => {
        setSubCategoryId(event.target.value);
        const { data: subsubres } = await exammainCategoryService.getExamSubCategoryByCatId(event.target.value);
        const { subcategory: subcategories } = subsubres;
        console.log(subcategories);
        let itemArr = [];
        for (let subcategory of subcategories) {
            itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
        }
        setSubSubItems(itemArr);
    }

    const handleSubSubCategoryChange = async (event, value) => {
        setSubSubCategoryId(event.target.value);
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
                <>
                    <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                        <h2 className="title mb-3 mb-sm-0">Exams for {examdata.Mastercategory} - {examdata.category} - {examdata.exa_cat_name}</h2>
                    </div>
                    <div className="col-12">
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
                                            <MenuItem value={'Move'}>Move</MenuItem>
                                        </Select>
                                    }
                                    {datatype == 'Active' &&
                                        <Select onChange={(event, value) => {
                                            onActionChange(event, value)
                                        }} >
                                            <MenuItem value={'Waiting'}>Waiting</MenuItem>
                                            <MenuItem value={'Inactive'}>Inactive</MenuItem>
                                            <MenuItem value={'Delete'}>Delete</MenuItem>
                                            <MenuItem value={'Move'}>Move</MenuItem>
                                        </Select>
                                    }
                                    {datatype == 'Inactive' &&
                                        <Select onChange={(event, value) => {
                                            onActionChange(event, value)
                                        }} >
                                            <MenuItem value={'Waiting'}>Waiting</MenuItem>
                                            <MenuItem value={'Active'}>Active</MenuItem>
                                            <MenuItem value={'Delete'}>Delete</MenuItem>
                                            <MenuItem value={'Move'}>Move</MenuItem>
                                        </Select>
                                    }
                                </FormControl>
                            </div>
                            {showexammaincategory &&
                                <>
                                    <div className="col-lg-2 col-sm-6 col-12">
                                        <FormControl className="w-100 mb-12">
                                            <InputLabel htmlFor="age-simple">Master Category</InputLabel>
                                            <Select onChange={(event, value) => {
                                                handleMainCategoryChange(event, value)
                                            }} value={maincategoryId}
                                            >
                                                {categoryitems}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-lg-2 col-sm-6 col-12">
                                        <FormControl className="w-100 mb-2">
                                            <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                                            <Select onChange={(event, value) => {
                                                handleSubCategoryChange(event, value)
                                            }} value={subcategoryId}
                                            >
                                                {subcategoryitems}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-lg-2 col-sm-6 col-12">
                                        <FormControl className="w-100 mb-2">
                                            <InputLabel htmlFor="age-simple">Sub Category</InputLabel>
                                            <Select onChange={(event, value) => {
                                                handleSubSubCategoryChange(event, value)
                                            }} value={subsubcategoryId}
                                            >
                                                {subsubitems}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </>
                            }
                            <div style={{ paddingTop: '2%' }} className="col-lg-2 col-sm-6 col-12">
                                <Button onClick={() => handleAction()} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-flash zmdi-hc-fw" />
                                    <span>Go</span>
                                </Button>
                            </div>
                        </form>
                        <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-8 col-sm-6 col-12">
                            <div className="jr-btn-group">
                                <Button onClick={() => toggle(true, 'Add', '', examtype)} variant="contained" color="default" className="jr-btn">
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
                                <Button onClick={() => openExams(false)} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-arrows zmdi-hc-fw" />
                                    <span>Exam Sub Category <br /> ({subcatCount})</span>
                                </Button>
                            </div>
                        </div>
                        <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} Exams for {examdata.Mastercategory} - {examdata.category} - {examdata.exa_cat_name}</h4>
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
                </>
            }
            {
                showAddExam &&
                <AddEditExam mode={mode} subcatdetails={examdata} examdetails={examDetails} examtype={examtype} toggle={toggle} />
            }
            {showAddBankExam &&
                <AddEditBankExam mode={mode} subcatdetails={examdata} examdetails={examDetails} examtype={examtype} toggle={toggle} />
            }
            {showCommonExamView &&
                <CommonExamView examdetails={examData} toggleview={toggleView} />
            }
            {showMapQuestionCommon &&
                <MapQuestionCommon openMapQuestions={openMapQuestions} count={activeCount} mode={mode} subcatdetails={examdata} examdetails={examDetails} examtype={examtype} />
            }
        </>
    );
};

export default ExamsDatatable;