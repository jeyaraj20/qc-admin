import React, { useEffect, useState } from 'react';
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
import * as questionService from '../../../../../services/questionService';
import * as examService from '../../../../../services/examServices';
import * as examQuestionService from '../../../../../services/examQuestionService';
import * as examSubCategoryService from '../../../../../services/examSubCategoryService';
import * as qbankCategoryService from '../../../../../services/qbankCategoryService';
import * as qbankSubCategoryService from '../../../../../services/qbankSubCategoryService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as adminService from '../../../../../services/adminService';
const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

const MapQuestionCommon = (props) => {
    const history = useHistory();

    const [data, setData] = useState([])
    const [assigneddata, setAssignedData] = useState([])
    const [modal, setModal] = useState(false)
    const [categoryName, setCategoryName] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [categoryrows, setCategoryrows] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ "qid": [] });
    const [action, setAction] = useState('');
    const [inactiveCount, setInactiveCount] = useState('');
    const [activeCount, setActiveCount] = useState('');
    const [assignedCount, setAssignedCount] = useState('');
    const [subcatCount, setSubCatCount] = useState('');
    const [loader, setLoader] = useState(false);
    const [categoryitems, setCategoryItems] = useState([]);
    const [subcategoryitems, setSubCategoryItems] = useState([]);
    const [maincategoryId, setMainCategoryId] = useState('');
    const [uniquecode, setUniqueCode] = useState('');
    const [description, setDescription] = useState('');
    const [showAddExam, setShowAddExam] = useState(false);
    const [showAddBankExam, setShowAddBankExam] = useState(false);
    const [showCommonExamView, setCommonExamView] = useState(false);
    const [showExamsTable, setShowExamsTable] = useState(true);
    const [catId, setCategoryId] = useState('');
    const [subcatId, setSubCategoryId] = useState('');
    const [examData, setExamData] = useState({});
    const [examDetails, setExamDetails] = useState({});
    const [mode, setMode] = useState();
    const [showSections, setShowSections] = useState(false);
    const [sectionlist, setSectionsList] = useState([]);
    const [ipaddr, setIpAddr] = useState('');
    const publicIp = require('public-ip');
    const [assignedrowsdata, setAssignedRowsData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedAssignedQues, setSelectedAssignedQues] = useState({ "exq_id": [] });
    const [selectAssignedAll, setSelectAssignedAll] = useState(false);
    const [selectedCat, setselectedCat] = useState({});
    const [selectedAssigned, setselectedAssigned] = useState({});
    const [showAssignBtn, setShowAssignBtn] = useState(true);
    const [showRemoveBtn, setShowRemoveBtn] = useState(false);
    const [showQuestionView, setShowQuestionView] = useState(false);
    const [checked, setChecked] = useState(true);
    const [allquesttable, setAllQuestTable] = useState(true);
    const [assignedquesttable, setAssignedQuestTable] = useState(false);
    const [examquestions, setExamQuestions] = useState([]);
    const [facultyItems, setFacultyItems] = useState([]);
    const [facultyId, setFacultyId] = useState('');
    const [qType, setQtype] = useState('');
    const [searchString, setSearchString] = useState('');
    const [filterlist, setFilterList] = useState([]);
    const [dataset, setDataSet] = useState(1);
    const [showdataset, setShowDataSet] = useState(false);
    const [listcount, setListCount] = useState(false);
    const [searchflag, setSearchFlag] = useState(false);
    const [examId, setExamId] = useState('');
    const [examType, setExamType] = useState('');
    const [exam_cat, setExam_cat] = useState("");
    const [exam_sub, setExam_sub] = useState("");
    const [exam_sub_sub, setExam_sub_sub] = useState("");
    const [txtclass, setTxtClass] = useState('bg-warning text-white');
    const [datatype, setDataType] = useState('Overall Questions');



    let selectedCatArr = [];
    const onSelectAll = e => {
        let selected = selectedCat;
        let rowcount = 0;
        for (let row of data) {
            if (document.getElementById(row.qid)) {
                document.getElementById(row.qid).checked = e.currentTarget.checked;
                if (e.currentTarget.checked) {
                    if (e.currentTarget.checked)
                        row.isChecked = true;
                    else
                        row.isChecked = false;
                    data[rowcount] = row
                    setData([...data])
                    selectedCatArr.push(row.qid);
                    selected[row.qid] = {
                        "isselected": e.currentTarget.checked
                    };
                    setSelectedCategory({ "qid": selectedCatArr });
                    console.log(selectedCatArr);
                } else {
                    if (e.currentTarget.checked)
                        row.isChecked = true;
                    else
                        row.isChecked = false;
                    data[rowcount] = row
                    setData([...data])

                    for (var i = 0; i < selectedCatArr.length; i++) {
                        if (selectedCatArr[i] === row.qid) {
                            selectedCatArr.splice(i, 1);
                        }
                    }
                    console.log(selectedCatArr);
                    setSelectedCategory({ "qid": selectedCatArr });
                }
            }
            setSelectAll(e.currentTarget.checked);
            setselectedCat(selected);
            rowcount = rowcount + 1;
        }
    };

    let selectedAssignedArr = [];
    const onSelectAssignedAll = e => {
        let selected = selectedAssigned;
        for (let row of assignedrowsdata) {
            if (document.getElementById(row.exq_id)) {
                document.getElementById(row.exq_id).checked = e.currentTarget.checked;
                if (e.currentTarget.checked) {
                    selectedAssignedArr.push(row.exq_id);
                    selected[row.exq_id] = {
                        "isselected": e.currentTarget.checked
                    };
                    setSelectedAssignedQues({ "exq_id": selectedAssignedArr });
                    console.log(selectedAssignedArr);
                } else {
                    for (var i = 0; i < selectedAssignedArr.length; i++) {
                        if (selectedAssignedArr[i] === row.qid) {
                            selectedAssignedArr.splice(i, 1);
                        }
                    }
                    console.log(selectedAssignedArr);
                    setSelectedAssignedQues({ "exq_id": selectedAssignedArr });
                }
            }
            setSelectAssignedAll(e.currentTarget.checked);
            setselectedAssigned(selected);
        }
    };

    const columns = [
        {
            label: (<MDBInput style={{ marginTop: '0px', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAll} onChange={onSelectAll} />),
            field: 'select',
            width: 10,
        },
        {
            label: 'S.No',
            field: 'q_sno',
            width: 10,
        },
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
            width: 10,
        },
        {
            label: 'Category',
            field: 'Category',
            width: 100,
        },
        {
            label: 'Sub Category',
            field: 'Subcategory',
            width: 50,
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
            label: 'Date',
            field: 'quest_date',
            width: 50,
        },
        {
            label: 'View',
            field: 'view',
            width: 50,
        },
    ];

    const assignedcolumns = [
        {
            label: (<MDBInput style={{ marginTop: '0px', width: '20px' }} label=' ' type='checkbox' id='multi' checked={selectAssignedAll} onChange={onSelectAssignedAll} />),
            field: 'select',
            width: 10,
        },
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
            width: 10,
        },
        {
            label: 'Category',
            field: 'Category',
            width: 100,
        },
        {
            label: 'Sub Category',
            field: 'Subcategory',
            width: 50,
        },
        {
            label: 'Added By',
            field: 'quest_assigned_name',
            width: 50,
        },
        {
            label: 'Difficulty Level',
            field: 'quest_level',
            width: 50,
        },
        {
            label: 'Date',
            field: 'exam_questadd_date',
            width: 50,
        },
        {
            label: 'View',
            field: 'view',
            width: 50,
        },
    ];

    let { examdetails, openMapQuestions, count, subcatdetails } = props;
    const navigateTo = () => history.push('/app/examsubcategory/examslist');

    const handleRefresh = async () => {
        setLoader(true);
        let examid = localStorage.getItem('examid');
        setExamId(examid);
        let examtype = localStorage.getItem('examtype');
        setExamType(examtype);
        let data = {};
        data.pagecount = 1;
        data.exam_id = localStorage.getItem('examid');
        data.exam_master_id = localStorage.getItem('exaid');
        data.exam_cat_id = localStorage.getItem('exasubid');
        const { data: res } = await questionService.getAllQuestions(data);
        const { question: examres } = res;
        const { examquestion: examquestionres } = res;
        setExamQuestions(examquestionres);
        const { data: countres } = await questionService.getAllQuestionsCount(data);
        const { totalcount: totcount } = countres;
        setActiveCount(totcount);
        setListCount(totcount);
        setData(examres);
        let getAssinedRedData = {};
        getAssinedRedData.exam_id = localStorage.getItem('examid');
        getAssinedRedData.exam_cat = localStorage.getItem('exaid');
        getAssinedRedData.exam_subcat = localStorage.getItem('exasubid');
        const { data: assignedres } = await examQuestionService.getAssingedCount(getAssinedRedData);
        const { count: assignedcount } = assignedres;
        setAssignedCount(assignedcount);
        let ip = await publicIp.v4();
        setIpAddr(ip);
        if (examtype === 'C') {
            setShowSections(false);
        } else {
            setShowSections(true);
            const { data: sectionres } = await examService.getExamById(localStorage.getItem('examid'));
            const { Section: sectionRow } = sectionres;
            let sectionsArr = [];
            for (let section of sectionRow) {
                sectionsArr.push(<MenuItem value={section.sect_id}>{section.menu_title + " (" + section.no_ofquest + ")"}</MenuItem>)
            }
            setSectionsList(sectionsArr);
        }
        const { data: maincategoryres } = await qbankCategoryService.getAllQuestionMainCategoryAsc();
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.cat_id}>{category.cat_name}</MenuItem>)
        }
        setCategoryItems(itemArr);
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

    useEffect(() => {

        //if (data && data.length)
        mapRows(data);
    }, [data])

    useEffect(() => {
        if (listcount > 1000) {
            setShowDataSet(true);
            let filterArr = [];
            let count = 1;
            let total = 0;
            for (let i = 0; i < parseInt(listcount); i += 1000) {
                total = (parseInt(count) * 1000);
                if (total > listcount) {
                    filterArr.push(<MenuItem selected value={count}>{(i + 1) + "-" + (listcount)}</MenuItem>)
                }
                else {
                    filterArr.push(<MenuItem value={count}>{(i + 1) + "-" + (i + 1000)}</MenuItem>)
                }
                count = count + 1;
            }
            setFilterList(filterArr);
        } else {
            setShowDataSet(false);
        }
    }, [listcount])

    useEffect(() => {

        //if (data && data.length)
        mapAssignedRows(assigneddata);
    }, [assigneddata])

    useEffect(() => () => {
        //handleRefresh();
        console.log(checked);

    }, [checked]);

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])

    const mapRows = (rows) => {
        let rowFields = []// fields in required order
        columns.forEach(column => rowFields.push(column.field))
        let sno = ((dataset - 1) * 1000) + 1;
        let categoryrows = rows.map((obj, index) => {
            let row = {}
            for (let fieldName of rowFields)
                row[fieldName] = obj[fieldName] // fetching required fields in req order
            let questionvalue = <div dangerouslySetInnerHTML={{ __html: entities.decode(obj.question) }}></div>
            let filtered = examquestions.filter(quest => quest.qid === obj.qid);
            row.q_sno = sno;
            sno = sno + 1;
            if (filtered.length > 0) {
                row.q_type = <span style={{ color: 'red' }}>{obj.q_type === 'T' ? 'Text' : 'Image'}</span>
                row.Subcategory = <span style={{ color: 'red' }}>{obj.Subcategory}</span>
                if (obj.q_type === 'T')
                    row.question = <span style={{ color: 'red' }}>{questionvalue}</span>
                else
                    row.question = <img style={{ width: 25, height: 25 }} src="https://myadmin.questioncloud.in/images/WhatsApp.png" border="0"></img>
                row.Category = <span style={{ color: 'red' }}>{obj.Category}</span>
                row.quest_add_by = <span style={{ color: 'red' }}>{obj.quest_add_by}</span>
                row.quest_level = <span style={{ color: 'red' }}>{obj.quest_level}</span>
                row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
                    label="." type="checkbox"
                    checked={obj.isChecked}
                    name={obj.qid} id={obj.qid}
                    onChange={(e) => { onCategorySelect(e, obj, index) }}
                />;
                row.quest_date = <span style={{ color: 'red' }}>{Moment(obj.quest_date).format('DD-MM-YYYY')}</span>
                row.view = <IconButton style={{ color: 'red' }} onClick={() => toggleView(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
            } else {
                if (obj.q_type === 'T')
                    row.question = questionvalue
                else
                    row.question = <img style={{ width: 25, height: 25 }} src="https://myadmin.questioncloud.in/images/WhatsApp.png" border="0"></img>

                row.q_type = <span>{obj.q_type === 'T' ? 'Text' : 'Image'}</span>
                row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
                    label="." type="checkbox"
                    checked={obj.isChecked}
                    name={obj.qid} id={obj.qid}
                    onChange={(e) => { onCategorySelect(e, obj, index) }}
                />;
                row.quest_date = Moment(obj.quest_date).format('DD-MM-YYYY')
                row.view = <IconButton onClick={() => toggleView(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>
            }

            return row;
        })
        setCategoryrows(categoryrows);
    }

    let selectedCategoryArr = [];
    const onCategorySelect = (e, obj, index) => {
        selectedCategoryArr = selectedCategory.qid;
        if (e.currentTarget.checked)
            obj.isChecked = true;
        else
            obj.isChecked = false;
        data[index] = obj
        setData([...data])// to avoid shallow checking
        if (e.currentTarget.checked) {
            selectedCategoryArr.push(obj.qid)
        } else {
            for (var i = 0; i < selectedCategoryArr.length; i++) {
                if (selectedCategoryArr[i] === obj.qid) {
                    selectedCategoryArr.splice(i, 1);
                }
            }
        }
        setSelectedCategory({ "qid": selectedCategoryArr });
    }

    const mapAssignedRows = (rows) => {
        let rowFields = []// fields in required order
        assignedcolumns.forEach(column => rowFields.push(column.field))
        let assignedrows = rows.map((obj, index) => {
            let row = {}
            for (let fieldName of rowFields)
                row[fieldName] = obj[fieldName] // fetching required fields in req order
            let questionvalue = <div dangerouslySetInnerHTML={{ __html: entities.decode(obj.question) }}></div>
            row.q_type = <span>{obj.q_type === 'T' ? 'Text' : 'Image'}</span>
            row.question = questionvalue
            row.select = <MDBInput style={{ marginTop: '0px', width: '20px' }}
                label="." type="checkbox"
                checked={obj.isChecked}
                name={obj.exq_id} id={obj.exq_id}
                onChange={(e) => { onAssignedSelect(e, obj, index) }}
            />;
            row.exam_questadd_date = Moment(obj.exam_questadd_date).format('DD-MM-YYYY')
            row.view = <IconButton onClick={() => toggleView(true, obj)} className="icon-btn"><i className="zmdi zmdi-file-text zmdi-hc-fw" /></IconButton>

            return row;
        })
        setCategoryrows(assignedrows);
    }

    let selectedAssiArr = [];
    const onAssignedSelect = (e, obj, index) => {
        selectedAssiArr = selectedAssignedQues.exq_id;
        if (e.currentTarget.checked)
            obj.isChecked = true;
        else
            obj.isChecked = false;
        assigneddata[index] = obj
        setAssignedData([...assigneddata])// to avoid shallow checking
        if (e.currentTarget.checked) {
            selectedAssiArr.push(obj.exq_id)
        } else {
            for (var i = 0; i < selectedAssiArr.length; i++) {
                if (selectedAssiArr[i] === obj.exq_id) {
                    selectedAssiArr.splice(i, 1);
                }
            }
        }
        setSelectedAssignedQues({ "exq_id": selectedAssiArr });
    }

    const onActionChange = async (event, value) => {
        setAction(event.target.value);
        console.log(event.target.value);
    }

    const handleMainCategoryChange = async (event, value) => {
        console.log(event.target.value);
        setMainCategoryId(event.target.value);
        const { data: subcategoryres } = await qbankSubCategoryService.getSubCategoryById(event.target.value);
        const { subcategory: subcategories } = subcategoryres;
        let itemArr = [];
        for (let subcat of subcategories) {
            itemArr.push(<MenuItem value={subcat.cat_id}>{subcat.cat_name}</MenuItem>)
        }
        setSubCategoryItems(itemArr);
    }

    const handleFacultySearch = (event, value) => {
        setFacultyId(event.target.value);
    }

    const handleSearchfilter = (datasetvalue) => {
        setSearchFlag(true);
        handleSearch(datasetvalue, 1);
    }
    const handleDataSetChange = (event, value) => {
        if (searchflag)
            handleSearch(event.target.value, 0);
        else
            getAllActive(event.target.value, 0);
    }

    const handleQtypeSearch = (event, value) => {
        setQtype(event.target.value);
    }

    const onSearchStringChange = (name) => {
        setSearchString(name);
    }

    const handleSubCategoryChange = async (event, value) => {
        console.log(event.target.value);
        setSubCategoryId(event.target.value);
    }

    const handleSearch = async (pagecount, countflag) => {
        setDataSet(pagecount);
        setLoader(true);
        let searchdata = {};
        searchdata.pagecount = pagecount;
        searchdata.qType = qType;
        searchdata.faculty = facultyId;
        searchdata.searchString = searchString;
        searchdata.cat_id = maincategoryId;
        searchdata.sub_id = subcatId;
        searchdata.exam_id = examdetails.exam_id;
        searchdata.exam_master_id = examdetails.exam_cat;
        searchdata.exam_cat_id = examdetails.exam_sub;
        const { data: searchresultres } = await examSubCategoryService.getResult(searchdata);
        const { questions: searchresult } = searchresultres;
        const { examquestion: examquestionres } = searchresultres;
        setExamQuestions(examquestionres);
        console.log(countflag);
        if (countflag === 1) {
            const { totalcount: totalsearchcount } = searchresultres;
            console.log(searchresultres);
            setListCount(totalsearchcount);
        }
        setData(searchresult);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const handleReset = async () => {
        setQtype("");
        setFacultyId("");
        setMainCategoryId("");
        setSubCategoryId("");
        setSearchString("");
        await getAllActive(1, 1);
    }

    const handleAction = async () => {
        let selectedCategoryObj = selectedCategory;
        if (selectedCategory.qid.length != 0) {
            selectedCategoryObj.ip_addr = ipaddr;
            selectedCategoryObj.exam_id = examId;
            if (examType === 'C') {
                selectedCategoryObj.sect_id = 0;
                await examQuestionService.createExamQuestion(selectedCategoryObj);
                setAlertMessage('Question successfully inserted');
                await handleRefresh();
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false)
                }, 1500);
            }
            if (examType === 'B') {
                selectedCategoryObj.sect_id = action;
                await examQuestionService.createBankExamQuestion(selectedCategoryObj);
                setAlertMessage('Question successfully inserted');
                await handleRefresh();
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false)
                }, 1500);
            }
            if (examType === 'B') {
                selectedCategoryObj.sect_id = action;
                await examQuestionService.createSectionExamQuestion(selectedCategoryObj);
                setAlertMessage('Question successfully inserted');
                await handleRefresh();
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false)
                }, 1500);
            }
            console.log(selectedCategory);
        } else {
            setAlertMessage('Please select atleast one question');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
        }
    }

    const handleRemove = async () => {
        let selectedAssiObj = selectedAssignedQues;
        console.log(selectedAssiObj);
        if (selectedAssiObj.exq_id.length != 0) {
            await examQuestionService.removeAssignedQuestion(selectedAssiObj);
            setAlertMessage('Question removed successfully');
            await getAllAssigned();
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
        } else {
            setAlertMessage('Please select atleast one question');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
        }
    }

    const toggle = async (open, mode, data, examType) => {
        console.log(data);
        if (data) {
            setExamDetails(data);
        }
        setMode(mode);
        if (open) {
            if (examType === 'C') {
                setShowAddExam(open);
            } else {
                setShowAddBankExam(open);
            }
            setShowExamsTable(false);
        } else {
            await handleRefresh();
            setShowAddExam(false);
            setShowAddBankExam(false);
            setShowExamsTable(true);
        }
    }

    const toggleView = (open, data) => {
        console.log(data);
        localStorage.setItem('qid', data.qid)
        window.open(`/app/examsubcategory/questionsview`, "_blank")
        /*if (data) {
            setExamData(data);
        }
        if (open) {
            setShowQuestionView(true);
            setShowExamsTable(false);
        } else {
            setShowQuestionView(false);
            setShowExamsTable(true);
        }*/
    }

    const handleRequestClose = () => {
        setShowMessage(false)
    };

    const onModalClose = () => {
        setModal(false);
    };

    const getAllActive = async (pagecount, countflag) => {
        setDataType('Overall Questions');
        setTxtClass('bg-warning text-white');
        setDataSet(pagecount);
        setSearchFlag(false);
        setLoader(true);
        setAssignedQuestTable(false);
        setAllQuestTable(true);
        setShowAssignBtn(true);
        setShowRemoveBtn(false);
        let data = {};
        data.pagecount = pagecount;
        data.exam_id = examId;
        data.exam_master_id = localStorage.getItem('exaid');
        data.exam_cat_id = localStorage.getItem('exasubid');
        const { data: res } = await questionService.getAllQuestions(data);
        const { question: examres } = res;
        const { examquestion: examquestionres } = res;
        setExamQuestions(examquestionres);
        if (countflag === 1) {
            const { data: countres } = await questionService.getAllQuestionsCount(data);
            const { totalcount: totcount } = countres;
            setActiveCount(totcount);
            setListCount(totcount);
        }
        setData(examres);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const getAllAssigned = async () => {
        setDataType('Assigned Questions');
        setTxtClass('bg-success text-white');
        setListCount(0);
        setLoader(true);
        setAssignedQuestTable(true);
        setAllQuestTable(false);
        setShowAssignBtn(false);
        setShowRemoveBtn(true);
        let getAssinedRedData = {};
        getAssinedRedData.exam_id = examId;
        getAssinedRedData.exam_cat = localStorage.getItem('exaid');
        getAssinedRedData.exam_subcat = localStorage.getItem('exasubid');
        const { data: res } = await examQuestionService.getAssinged(getAssinedRedData);
        const { examquestion: examres } = res;
        const { count: assignedcount } = res;
        setAssignedCount(assignedcount);
        setAssignedData(examres);
        setAssignedRowsData(examres);
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
                <>
                    <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                        <h2 className="title mb-3 mb-sm-0">Questions for {localStorage.getItem('mastercategory')} - {localStorage.getItem('category')} - {localStorage.getItem('subcategory')}</h2>
                    </div>
                    <div className="col-12">
                        <form className="row" autoComplete="off">
                            {showSections &&
                                <div className="col-lg-2 col-sm-6 col-12">
                                    <FormControl className="w-100 mb-2">
                                        <InputLabel htmlFor="age-simple">Select Menu</InputLabel>
                                        <Select onChange={(event, value) => {
                                            onActionChange(event, value)
                                        }} >
                                            <MenuItem value={'0'}>Select Menu</MenuItem>
                                            {sectionlist}
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                            {showAssignBtn &&
                                <div style={{ paddingTop: '2%' }} className="col-lg-2 col-sm-6 col-12">
                                    <Button onClick={() => handleAction()} variant="contained" color="primary" className="jr-btn">
                                        <i className="zmdi zmdi-flash zmdi-hc-fw" />
                                        <span>Assign</span>
                                    </Button>
                                </div>
                            }
                            {showRemoveBtn &&
                                <div style={{ paddingTop: '2%' }} className="col-lg-2 col-sm-6 col-12">
                                    <Button onClick={() => handleRemove()} variant="contained" color="primary" className="jr-btn">
                                        <i className="zmdi zmdi-flash zmdi-hc-fw" />
                                        <span>Remove</span>
                                    </Button>
                                </div>
                            }
                            <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-6 col-sm-6 col-12">
                                <div className="jr-btn-group">
                                    <Button onClick={() => getAllActive(1, 1)} variant="contained" className="jr-btn bg-warning text-white">
                                        <i className="zmdi zmdi-check zmdi-hc-fw" />
                                        <span> All Questions <br /> ({activeCount})</span>
                                    </Button>
                                    <Button onClick={() => getAllAssigned()} variant="contained" className="jr-btn bg-success text-white">
                                        <i className="zmdi zmdi-check zmdi-hc-fw" />
                                        <span> Questions Added <br /> ({assignedCount})</span>
                                    </Button>
                                    <Button onClick={() => navigateTo()} variant="contained" className="jr-btn bg-primary text-white">
                                        <i className="zmdi zmdi-check zmdi-hc-fw" />
                                        <span> Exams <br /> ({count})</span>
                                    </Button>
                                </div>
                            </div>

                        </form>
                        <h4 style={{ padding: '0.5%' }} className={txtclass}>{datatype} for {localStorage.getItem('mastercategory')} - {localStorage.getItem('category')} - {localStorage.getItem('subcategory')}</h4>
                        <div className="row">
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
                                <FormControl className="w-100 mb-2">
                                    <InputLabel htmlFor="age-simple">Category</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleMainCategoryChange(event, value)
                                    }} value={maincategoryId}
                                    >
                                        <MenuItem value={'M'}>Select Category</MenuItem>
                                        {categoryitems}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-2 d-flex flex-column order-lg-1">
                                <FormControl className="w-100 mb-2">
                                    <InputLabel htmlFor="age-simple">Sub Category</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleSubCategoryChange(event, value)
                                    }} value={subcatId}
                                    >
                                        <MenuItem value={'M'}>Select Sub Category</MenuItem>
                                        {subcategoryitems}
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
                                <TextField id="searchstring"
                                    label={'Search'}
                                    name={'searchstring'}
                                    onChange={(event) => onSearchStringChange(event.target.value)}
                                    defaultValue={searchString}
                                    margin="none" />
                            </div>
                            <div className="col-lg-1 d-flex flex-column order-lg-1">
                                <Button onClick={() => handleSearchfilter(1)} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-search zmdi-hc-fw" />
                                </Button>
                            </div>
                            <div className="col-lg-1 d-flex flex-column order-lg-1">
                                <Button onClick={() => handleReset()} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-format-clear-all zmdi-hc-fw" />
                                </Button>
                            </div>

                            {showdataset &&
                                <div className="col-lg-3 d-flex flex-column order-lg-1">
                                    <FormControl className="w-100 mb-12">
                                        <InputLabel htmlFor="age-simple">Question between</InputLabel>
                                        <Select onChange={(event, value) => {
                                            handleDataSetChange(event, value)
                                        }} value={dataset}
                                        >
                                            {filterlist}
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                        </div>
                        {allquesttable && !assignedquesttable &&
                            <MDBDataTable
                                striped
                                bordered
                                entriesOptions={[5, 10, 20, 25, 50, 100, 500, 1000 ]}
                                entries={100}
                                hover
                                data={{ rows: categoryrows, columns: columns }}
                                small
                                responsive
                                searching={false}
                                disableRetreatAfterSorting={true} />
                        }
                        {!allquesttable && assignedquesttable &&
                            <MDBDataTable
                                striped
                                bordered
                                entriesOptions={[5, 10, 20, 25, 50, 100, 1000]}
                                entries={100}
                                hover
                                data={{ rows: categoryrows, columns: assignedcolumns }}
                                small
                                responsive
                                searching={false}
                                disableRetreatAfterSorting={true} />
                        }
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
        </>
    );
};

export default MapQuestionCommon;