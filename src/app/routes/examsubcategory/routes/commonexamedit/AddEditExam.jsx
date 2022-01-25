import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import * as examSubCategoryService from '../../../../../services/examSubCategoryService';
import * as exammainCategoryService from '../../../../../services/exammainCategoryService';
import * as examServices from '../../../../../services/examServices';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from "@material-ui/core/IconButton";

const AddEditExam = (props) => {

    const history = useHistory();

    const [mode, setMode] = useState("");
    const [loader, setLoader] = useState(false);
    const [exam_cat, setExam_cat] = useState("");
    const [exam_sub, setExam_sub] = useState("");
    const [exam_sub_sub, setExam_sub_sub] = useState("");
    const [exam_title, setExam_title] = useState('');
    const [slug, setSlug] = useState("");
    const [examcode, setExamcode] = useState("");
    const [totalquestions, setTotalQuestions] = useState("");
    const [markperquestion, setMarksPerQues] = useState("");
    const [negativemarks, setNegativeMarks] = useState("");
    const [totalmarks, setTotalMarks] = useState("");
    const [totalminutes, setTotalMinutes] = useState("");
    const [assigntype, setAssignType] = useState("");
    const [position, setPosition] = useState("");
    const [addedexamtypes, setAddedExamTypes] = useState("");
    const [showtesttypes, setShowTestTypes] = useState(false);
    const [showchapterwise, setShowChapterWise] = useState(false);
    const [showpreviousyear, setShowPreviousYear] = useState(false);
    const [showTypeOpt, setShowTypeOpt] = useState(false);
    const [showChapterOpt, setShowChapterOpt] = useState(false);
    const [showPrevOpt, setShowPrevOpt] = useState(false);
    const [questionType, setQuestionType] = useState("");
    const [testtypes, setTestTypes] = useState([]);
    const [chapterlist, setChapterList] = useState([]);
    const [previousyearlist, setPreviousYearList] = useState([]);
    const [testtypeid, setTestTypeId] = useState("");
    const [examlevel, setExamLevel] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [level1, setLevel1] = useState(false);
    const [level2, setLevel2] = useState(false);
    const [level3, setLevel3] = useState(false);
    const [level4, setLevel4] = useState(false);
    const [selectedLevelArr, setSelectedLevelArr] = useState([]);
    const [categoryitems, setCategoryItems] = useState([]);
    const [automatic, setAutomaticRow] = useState([]);
    const [examDetails, setExamDetails] = useState();
    const [examType, setExamType] = useState('');
    const [examId, setExamId] = useState();
    const [mastercategory, setMasterCategory] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubCategory] = useState('');
    const [showprice, setShowPrice] = useState(false);
    const [paymentflag, setPaymentFlag] = useState("N");
    const [sellingprice, setSellingPrice] = useState('');
    const [offerprice, setOfferPrice] = useState('');
    const [ipaddr, setIpAddr] = useState('');
    const publicIp = require('public-ip');


    const navigateTo = () => {
        localStorage.setItem('subId', exam_sub_sub);
        localStorage.setItem('examtype', examType);
        history.push('/app/examsubcategory/examslist');
    }

    const handleRefresh = async () => {
        setLoader(true);
        let ip = await publicIp.v4();
        setIpAddr(ip);
        let examtype = localStorage.getItem('examtype');
        let mastercat = localStorage.getItem('mastercategory');
        let catname = localStorage.getItem('category');
        let subcatname = localStorage.getItem('subcategory');
        console.log(mastercat);
        setMasterCategory(mastercat);
        setCategory(catname);
        setSubCategory(subcatname);
        setExamType(examtype);
        let mode = localStorage.getItem('mode');
        console.log(mode);
        setMode(mode);
        let examid = localStorage.getItem('examid');
        const { data: autores } = await examServices.getAutomaticRows(examid);
        const { automaticquestions: automaticdata } = autores;
        setExamId(examid);
        let examname = localStorage.getItem('examname');
        let examslug = localStorage.getItem('examslug');
        let examcode = localStorage.getItem('examcode');
        let totalquestions = localStorage.getItem('totalquestions');
        let markperquest = localStorage.getItem('markperquest');
        let negmarkperquest = localStorage.getItem('negmarkperquest');
        let totmarks = localStorage.getItem('totmarks');
        let totaltime = localStorage.getItem('totaltime');
        let assigntesttype = localStorage.getItem('assigntesttype');
        let examtypecat = localStorage.getItem('examtypecat');
        let examlevel = localStorage.getItem('examlevel');
        let questtype = localStorage.getItem('questtype');
        let examposition = localStorage.getItem('examposition');
        let examtypeid = localStorage.getItem('examtypeid');
        let exaid = localStorage.getItem('exaid');
        let exaidsub = localStorage.getItem('exaidsub');
        let exacatid = localStorage.getItem('exacatid');
        let paymentflag = localStorage.getItem('paymentflag');
        let sellingprice = localStorage.getItem('sellingprice');
        let offerprice = localStorage.getItem('offerprice');
        if (mode == 'Edit') {
            console.log(examname);
            setExam_title(examname);
            setSlug(examslug);
            setExamcode(examcode);
            setTotalQuestions(totalquestions);
            setMarksPerQues(markperquest);
            setNegativeMarks(negmarkperquest);
            setTotalMarks(totmarks);
            setTotalMinutes(totaltime);
            setAssignType(assigntesttype);
            setAddedExamTypes(examtypecat);
            setExamLevel(examlevel);
            setPaymentFlag(paymentflag);
            setSellingPrice(sellingprice);
            setOfferPrice(offerprice);
            if (paymentflag == 'Y') {
                setShowPrice(true);
            } else {
                setShowPrice(false);
            }
            var array = JSON.parse("[" + examlevel + "]");
            let arrayselect = []
            for (let s = 0; s < array.length; s++) {
                if (array[s] == 1) {
                    setLevel1(true);
                    arrayselect.push("1");
                }
                if (array[s] == 2) {
                    setLevel2(true);
                    arrayselect.push("2");
                }
                if (array[s] == 3) {
                    setLevel3(true);
                    arrayselect.push("3");
                }
                if (array[s] == 4) {
                    setLevel4(true);
                    arrayselect.push("4");
                }
            }
            setSelectedLevelArr(arrayselect);
            setQuestionType(questtype);
            setPosition(examposition);
            setTestTypeId(examtypeid);
            const { data: typeslistres } = await examServices.getTestTypesEdit(exacatid);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>)
            }
            setTestTypes(typesListArr);
            const { data: chaplistres } = await examServices.getChaptersEdit(exacatid);
            const { category: chaplist } = chaplistres;
            let chapListArr = [];
            for (let chapter of chaplist) {
                chapListArr.push(<MenuItem value={chapter.chapt_id}>{chapter.chapter_name}</MenuItem>)
            }
            setChapterList(chapListArr);
            if (examtypecat == 'T') {
                setShowTestTypes(true);
            } else {
                setShowTestTypes(false);
            }
            if (examtypecat == 'C') {
                setShowChapterWise(true);
            } else {
                setShowChapterWise(false);
            }
            if (examtypecat == 'P') {
                setShowPreviousYear(true);
            } else {
                setShowPreviousYear(false);
            }
        } else {
            setExam_title('');
            const { data: typeslistres } = await examServices.getTestTypes(exacatid);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>)
            }
            setTestTypes(typesListArr);
            const { data: chaplistres } = await examServices.getChapters(exacatid);
            const { category: chaplist } = chaplistres;
            let chapListArr = [];
            for (let chapter of chaplist) {
                chapListArr.push(<MenuItem value={chapter.chapt_id}>{chapter.chapter_name}</MenuItem>)
            }
            setChapterList(chapListArr);
        }
        setExam_cat(exaid);
        setExam_sub(exaidsub);
        setExam_sub_sub(exacatid);
        const { data: chapres } = await examSubCategoryService.getExamSubCategoryChapters(exacatid);
        const { count: chapterCount } = chapres;
        const { data: typeres } = await examSubCategoryService.getExamSubCategoryType(exacatid);
        const { count: typeCount } = typeres;
        let prevData = { "exam_cat": exaid, "exam_sub": exaidsub }
        const { data: prevres } = await examServices.getPreviousYear(prevData);
        const { count: prevCount } = prevres;
        const { Exam: prevYearData } = prevres;
        console.log(prevCount);
        if (typeCount != 0) {
            setShowTypeOpt(true);
        } else {
            setShowTypeOpt(false);
        }
        if (chapterCount != 0) {
            setShowChapterOpt(true);
        } else {
            setShowChapterOpt(false);
        }
        if (prevCount != 0) {
            setShowPrevOpt(true);
        } else {
            setShowPrevOpt(false);
        }
        let prevyearArr = [];
        for (let prev of prevYearData) {
            prevyearArr.push(<MenuItem value={prev.exam_id}>{prev.exam_name}</MenuItem>)
        }
        setPreviousYearList(prevyearArr);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const onExamTitleChange = (name) => {
        let slug = (name).replace(/ /g, "-").toLowerCase();
        setSlug(slug);
        setExam_title(name)
    }

    const onSellingPriceChange = (price) => {
        setSellingPrice(price);
    }

    const onOfferPriceChange = (price) => {
        setOfferPrice(price);
    }

    const handleAssignType = (e) => {
        setAssignType(e.target.value);
    };

    const handleAddedExamTypes = (e) => {
        setAddedExamTypes(e.target.value);
        if (e.target.value == 'T') {
            setShowTestTypes(true);
        } else {
            setShowTestTypes(false);
        }
        if (e.target.value == 'C') {
            setShowChapterWise(true);
        } else {
            setShowChapterWise(false);
        }
        if (e.target.value == 'P') {
            setShowPreviousYear(true);
        } else {
            setShowPreviousYear(false);
        }
    };

    const handlePaidExamTypes = (e) => {
        setPaymentFlag(e.target.value);
        if (e.target.value == "Y") {
            setShowPrice(true);
        } else {
            setShowPrice(false);
        }
    };

    const handleQuestionType = async (e) => {
        setAutomaticRow([
            { rowsNo: 1, maincategoryId: '', subcategoryitems: [], subcategoryId: '', noofquest: '', addtype: true, deltype: false }
        ]);
        setQuestionType(e.target.value);
        const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
        }
        setCategoryItems(itemArr);
    };

    const handleMainCategoryChange = async (event, index) => {
        console.log(index);
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].maincategoryId = event.target.value; // replace e.target.value with whatever you want to change it to
        const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(event.target.value);
        const { category: categories } = subcategoryres;
        let itemArr = [];
        for (let subcategory of categories) {
            itemArr.push(<MenuItem value={subcategory.exa_cat_id}>{subcategory.exa_cat_name}</MenuItem>)
        }
        newArr[index].subcategoryitems = itemArr;
        setAutomaticRow(newArr); // ??
    }

    const handleSubCategoryChange = async (event, index) => {
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].subcategoryId = event.target.value;
        setAutomaticRow(newArr); // ??
    }

    const handleTotQuestionsChange = (e) => {
        let total = 0;
        if (markperquestion) {
            total = (e.target.value) * markperquestion
        } else {
            total = 0;
        }
        setTotalQuestions(e.target.value)
        setTotalMarks(total);
    }

    const handleMarksPerQuesChange = (e) => {
        let total = 0;
        if (totalquestions) {
            total = (e.target.value) * totalquestions
        } else {
            total = 0;
        }
        setTotalMarks(total);
        setMarksPerQues(e.target.value)
    }

    //const selectedLevelArr = [];
    const handleLevel1Change = (e) => {
        console.log(selectedLevelArr);
        let arr = selectedLevelArr;
        if (e.target.checked) {
            setLevel1(true);
            arr.push(e.target.value);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == e.target.value) {
                    arr.splice(i, 1);
                }
            }
            setLevel1(false);
        }
        setSelectedLevelArr(arr);
        let levelStr = arr.join();
        setExamLevel(levelStr);
        console.log(levelStr);
    }

    const handleLevel2Change = (e) => {
        console.log(selectedLevelArr);
        let arr = selectedLevelArr;
        if (e.target.checked) {
            setLevel2(true);
            arr.push(e.target.value);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == e.target.value) {
                    arr.splice(i, 1);
                }
            }
            setLevel2(false);
        }
        setSelectedLevelArr(arr);
        let levelStr = arr.join();
        setExamLevel(levelStr);
        console.log(levelStr);
    }

    const handleLevel3Change = (e) => {
        console.log(selectedLevelArr);
        let arr = selectedLevelArr;
        if (e.target.checked) {
            setLevel3(true);
            arr.push(e.target.value);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == e.target.value) {
                    arr.splice(i, 1);
                }
            }
            setLevel3(false);
        }
        setSelectedLevelArr(arr);
        let levelStr = arr.join();
        setExamLevel(levelStr);
        console.log(levelStr);
    }

    const handleLevel4Change = (e) => {
        console.log(selectedLevelArr);
        let arr = selectedLevelArr;
        if (e.target.checked) {
            setLevel4(true);
            arr.push(e.target.value);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == e.target.value) {
                    arr.splice(i, 1);
                }
            }
            setLevel4(false);
        }
        setSelectedLevelArr(arr);
        let levelStr = arr.join();
        setExamLevel(levelStr);
        console.log(levelStr);
    }

    const handleTestTypeChange = async (event, value) => {
        console.log(event.target.value);
        setTestTypeId(event.target.value);
    }

    const saveCommonExam = async () => {
        console.log(automatic);
        try {
            let data = {};
            data.exam_cat = exam_cat;
            data.exam_sub = exam_sub;
            data.exam_sub_sub = exam_sub_sub;
            data.exam_name = exam_title;
            data.exam_slug = slug;
            data.assign_test_type = assigntype;
            data.exam_type = examType;
            data.exam_code = examcode;
            data.sect_cutoff = 'N';
            data.sect_timing = 'N';
            data.tot_questions = totalquestions;
            data.tot_mark = totalmarks;
            data.mark_perquest = markperquestion;
            data.neg_markquest = negativemarks;
            data.total_time = totalminutes;
            data.quest_type = questionType;
            data.exam_pos = position;
            data.exam_type_cat = addedexamtypes;
            data.exam_type_id = testtypeid;
            data.exam_level = examlevel;
            data.payment_flag = paymentflag;
            if (sellingprice == '') {
                data.selling_price = 0;
            } else {
                data.selling_price = sellingprice;
            }
            data.offer_price = offerprice;
            if (questionType == 'AUTO') {
                data.automatic = automatic;
            } else {
                data.automatic = [];
            }
            data.ip_addr = ipaddr;
            console.log(data);
            await examServices.saveCommonExam(data);
            setAlertMessage('Exam added successfully!');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
            localStorage.setItem('subId', exam_sub_sub);
            localStorage.setItem('mastercategory', mastercategory);
            localStorage.setItem('category', category);
            localStorage.setItem('subcategory', subcategory);
            localStorage.setItem('exaid', exam_cat);
            localStorage.setItem('exaidsub', exam_sub);
            localStorage.setItem('exacatid', exam_sub_sub);
            history.push('/examslist');
        } catch (ex) {
            console.log(ex.response);
            setAlertMessage('Something went wrong. Please try later');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
        }
    }

    const updateCommonExam = async () => {
        console.log("test");
        try {
            let data = {};
            data.exam_cat = exam_cat;
            data.exam_sub = exam_sub;
            data.exam_sub_sub = exam_sub_sub;
            data.exam_name = exam_title;
            data.exam_slug = slug;
            data.assign_test_type = assigntype;
            data.exam_type = examType;
            data.exam_code = examcode;
            data.sect_cutoff = 'N';
            data.sect_timing = 'N';
            data.tot_questions = totalquestions;
            data.tot_mark = totalmarks;
            data.mark_perquest = markperquestion;
            data.neg_markquest = negativemarks;
            data.total_time = totalminutes;
            data.quest_type = questionType;
            data.exam_pos = position;
            data.exam_type_cat = addedexamtypes;
            data.exam_type_id = testtypeid;
            data.automatic = [];
            data.exam_level = examlevel;
            data.payment_flag = paymentflag;
            data.selling_price = sellingprice;
            data.offer_price = offerprice;
            data.ip_addr = ipaddr;
            console.log(data);
            await examServices.updateCommonExam(examId, data);
            setAlertMessage('Exam updated successfully!');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
            localStorage.setItem('subId', exam_sub_sub);
            localStorage.setItem('examtype', examType);
            history.push('/app/examsubcategory/examslist');
        } catch (ex) {
            console.log(ex);
            setAlertMessage('Something went wrong. Please try later');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
        }
    }

    const handleRequestClose = () => {
        setShowMessage(false)
    };

    const handleClose = () => {
        window.close();
    }

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])

    const renderAutomaticTypes = () => {
        let rowNum = 1;
        return automatic.map((row, index) => {
            rowNum = rowNum + 1;
            const { rowsNo, noofquest, maincategoryId, subcategoryId, subcategoryitems, addtype, deltype } = row //destructuring
            return (
                <div className="row">
                    <FormControl margin='normal' style={{ marginLeft: '15px', marginRight: '15px' }} className="col-lg-3 col-sm-6 col-12">
                        <InputLabel htmlFor="age-simple">Master Category</InputLabel>
                        <Select onChange={(event, value) => {
                            handleMainCategoryChange(event, index)
                        }} value={maincategoryId}
                        >
                            <MenuItem value={'M'}>--Master Category--</MenuItem>
                            {categoryitems}
                        </Select>
                    </FormControl>
                    <FormControl margin='normal' className="col-lg-3 col-sm-6 col-12">
                        <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                        <Select onChange={(event, value) => {
                            handleSubCategoryChange(event, index)
                        }} value={subcategoryId}
                        >
                            {subcategoryitems}
                        </Select>
                    </FormControl>
                    <TextField
                        style={{ marginLeft: '15px' }}
                        autoComplete='off'
                        required
                        label={'No. of questions'}
                        onChange={(e) => onNoofQuestChange(e, index)}
                        value={noofquest}
                        margin="normal" />
                    {addtype ?
                        <IconButton onClick={() => addAutomaticRow(rowNum)} className="icon-btn">
                            <i className="zmdi zmdi-plus zmdi-hc-fw" />
                        </IconButton> :
                        <IconButton onClick={() => removeAutomaticRow(rowsNo)} className="icon-btn">
                            <i className="zmdi zmdi-delete zmdi-hc-fw" />
                        </IconButton>}
                </div>
            )
        })
    }

    const addAutomaticRow = (index) => {
        let nextRow = { rowsNo: index, maincategoryId: '', subcategoryitems: [], subcategoryId: '', noofquest: '', addtype: false, deltype: true };
        setAutomaticRow(state => [...state, nextRow])
    }

    const removeAutomaticRow = (index) => {
        setAutomaticRow(automatic.filter(item => item.rowsNo !== index));
    }

    const onNoofQuestChange = (e, index) => {
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].noofquest = e.target.value; // replace e.target.value with whatever you want to change it to
        setAutomaticRow(newArr); // ??
    }

    return (
        <div className="row no-gutters">
            {loader &&
                <div className="loader-view w-100"
                    style={{ height: 'calc(100vh - 120px)' }}>
                    <CircularProgress />
                </div>
            }
            {!loader &&
                <div className="row no-gutters">
                    {mode == 'Add' ? <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                        <h1>Add Exam</h1>
                    </div> :
                        <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                            <h1>Update Exam</h1>
                        </div>}
                    <div style={{ padding: '1%' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <Button onClick={() => handleClose()} variant="contained" color="primary" className="jr-btn">
                            <i className="zmdi zmdi-close zmdi-hc-fw" />
                            <span>Close</span>
                        </Button>
                    </div>
                    <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
                        <h3>Exam Details</h3>
                        <div className="row">
                            <div className="col-lg-2 col-sm-6 col-12">
                                <FormControl component="fieldset" required>
                                    <FormLabel component="legend">Paid Exam</FormLabel>
                                    <RadioGroup
                                        className="d-flex flex-row"
                                        aria-label="examtype"
                                        name="examtype"
                                        value={paymentflag}
                                        onChange={(e) => handlePaidExamTypes(e)}
                                    >
                                        <FormControlLabel
                                            value="Y"
                                            control={<Radio color="primary" />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            value="N"
                                            control={<Radio color="primary" />}
                                            label="No"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            {showprice &&
                                <>
                                    <div className="col-lg-2 col-sm-6 col-12">
                                        <TextField
                                            autoComplete="off"
                                            id="Selling Price"
                                            label={"MRP"}
                                            name={"SellingPrice"}
                                            onChange={(event) => onSellingPriceChange(event.target.value)}
                                            value={sellingprice}
                                            margin="none"
                                        />
                                    </div>
                                    <div className="col-lg-2 col-sm-6 col-12">
                                        <TextField
                                            required
                                            autoComplete="off"
                                            id="Offer Price"
                                            label={"Selling Price"}
                                            name={"OfferPrice"}
                                            onChange={(event) => onOfferPriceChange(event.target.value)}
                                            value={offerprice}
                                            margin="none"
                                        />
                                    </div>
                                </>
                            }
                        </div>
                        <TextField
                            required
                            autoComplete='off'
                            id="Exam Title"
                            label={'Exam Title'}
                            name={'Exam Title'}
                            onChange={(event) => onExamTitleChange(event.target.value)}
                            value={exam_title}
                            margin="none" />
                        <TextField
                            autoComplete='off'
                            required
                            id="Exam Slug"
                            label={'Exam Slug'}
                            onChange={(event) => setSlug(event.target.value)}
                            value={slug}
                            margin="normal" />
                        <TextField
                            autoComplete='off'
                            required
                            id="required"
                            label={'Exam Code'}
                            onChange={(event) => setExamcode(event.target.value)}
                            value={examcode}
                            margin="normal" />
                    </div>
                    <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
                        <h3>Question And Mark Details</h3>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Total Questions'}
                            onChange={(event) => handleTotQuestionsChange(event)}
                            value={totalquestions}
                            margin="none" />
                        <TextField
                            autoComplete='off'
                            required
                            label={'Mark Per Questions'}
                            onChange={(event) => handleMarksPerQuesChange(event)}
                            value={markperquestion}
                            margin="normal" />
                        <TextField
                            autoComplete='off'
                            required
                            label={'Negative Mark Per Question'}
                            onChange={(event) => setNegativeMarks(event.target.value)}
                            value={negativemarks}
                            margin="normal" />
                        <TextField
                            autoComplete='off'
                            required
                            label={'Total Marks'}
                            value={totalmarks}
                            margin="normal" />
                        <TextField
                            autoComplete='off'
                            required
                            label={'Total Time (In Minutes)'}
                            onChange={(event) => setTotalMinutes(event.target.value)}
                            value={totalminutes}
                            margin="normal" />
                    </div>
                    <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
                        <h3>Exam Settings</h3>
                        <FormControl component="fieldset" required>
                            <FormLabel component="legend">Assign Test type</FormLabel>
                            <RadioGroup
                                className="d-flex flex-row"
                                aria-label="assigntesttype"
                                name="assigntesttype"
                                value={assigntype}
                                onChange={(e) => handleAssignType(e)}
                            >
                                <FormControlLabel value="D" control={<Radio color="primary" />} label="Direct Test" />
                                <FormControlLabel value="M" control={<Radio color="primary" />} label="Multiple Test" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset" required>
                            <FormLabel component="legend">Exam Type</FormLabel>
                            <RadioGroup
                                className="d-flex flex-row"
                                aria-label="examtype"
                                name="examtype"
                                value={addedexamtypes}
                                onChange={(e) => handleAddedExamTypes(e)}
                            >
                                {showTypeOpt &&
                                    <FormControlLabel value="T" control={<Radio color="primary" />} label="Added Exam Types" />
                                }
                                {showChapterOpt &&
                                    <FormControlLabel value="C" control={<Radio color="primary" />} label="Chapter Wise" />
                                }
                                {showPrevOpt &&
                                    <FormControlLabel value="P" control={<Radio color="primary" />} label="Previous Year" />
                                }
                            </RadioGroup>
                        </FormControl>
                        {showtesttypes &&
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Test Types</InputLabel>
                                <Select onChange={(event, value) => {
                                    handleTestTypeChange(event, value)
                                }} value={testtypeid}>
                                    {/*<MenuItem value={'0'}>Select</MenuItem>*/}
                                    {testtypes}
                                </Select>
                            </FormControl>
                        }
                        {showchapterwise &&
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Chapter Wise Exam</InputLabel>
                                <Select onChange={(event, value) => {
                                    handleTestTypeChange(event, value)
                                }} value={testtypeid}>
                                    {/*<MenuItem value={'0'}>Select</MenuItem>*/}
                                    {chapterlist}
                                </Select>
                            </FormControl>
                        }
                        {showpreviousyear &&
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Previous Year</InputLabel>
                                <Select onChange={(event, value) => {
                                    handleTestTypeChange(event, value)
                                }} value={testtypeid}>
                                    {/*<MenuItem value={'0'}>Select</MenuItem>*/}
                                    {previousyearlist}
                                </Select>
                            </FormControl>
                        }
                        <FormHelperText className="text-grey">Difficulty Level</FormHelperText>
                        <FormGroup className="d-flex flex-row">
                            <FormControlLabel
                                control={
                                    <Checkbox color="primary"
                                        checked={level1}
                                        onChange={(e) => handleLevel1Change(e)}
                                        value={'1'}
                                    />
                                }
                                label="Level 1"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox color="primary"
                                        checked={level2}
                                        onChange={(e) => handleLevel2Change(e)}
                                        value={'2'}
                                    />
                                }
                                label="Level 2"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox color="primary"
                                        checked={level3}
                                        onChange={(e) => handleLevel3Change(e)}
                                        value={'3'}
                                    />
                                }
                                label="Level 3"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox color="primary"
                                        checked={level4}
                                        onChange={(e) => handleLevel4Change(e)}
                                        value={'4'}
                                    />
                                }
                                label="Level 4"
                            />

                        </FormGroup>
                        <FormControl component="fieldset" required>
                            <FormLabel component="legend">Question Type</FormLabel>
                            <RadioGroup
                                className="d-flex flex-row"
                                aria-label="questiontype"
                                name="questiontype"
                                value={questionType}
                                onChange={(e) => handleQuestionType(e)}
                            >
                                <FormControlLabel value="MANU" disabled={true} control={<Radio color="primary" />} label="Manual" />
                                <FormControlLabel value="AUTO" disabled={true} control={<Radio color="primary" />} label="Automatic" />
                            </RadioGroup>
                        </FormControl>
                        {//questionType == 'AUTO' &&
                            renderAutomaticTypes()
                        }
                        <TextField
                            autoComplete='off'
                            required
                            label={'Position'}
                            onChange={(event) => setPosition(event.target.value)}
                            value={position}
                            margin="normal" />
                        {mode == 'Add' ? <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
                            <Button onClick={() => saveCommonExam()} variant="contained" color="primary" className="jr-btn text-white">
                                Submit
                            </Button>
                        </div> :
                            <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
                                <Button onClick={() => updateCommonExam()} variant="contained" color="primary" className="jr-btn text-white">
                                    Update
                                </Button>
                            </div>
                        }
                    </div>
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
            }
        </div>
    )
};

export default AddEditExam;
