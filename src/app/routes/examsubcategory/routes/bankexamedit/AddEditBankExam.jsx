import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
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
import * as qbankSubCategoryService from '../../../../../services/qbankSubCategoryService';
import * as examServices from '../../../../../services/examServices';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import SweetAlert from 'react-bootstrap-sweetalert'
import * as examService from '../../../../../services/examServices';
import IconButton from "@material-ui/core/IconButton";

const AddEditBankExam = (props) => {

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
    const [sectionRow, setSectionRow] = useState([]);
    const [sectionalTiming, setSectionalTiming] = useState("");
    const [sectionalCutoff, setSectionalCutoff] = useState("");
    const [basic, setBasic] = useState(false);
    const [categoryitems, setCategoryItems] = useState([]);
    const [automatic, setAutomaticRow] = useState([]);
    const [showprice, setShowPrice] = useState(false);
    const [paymentflag, setPaymentFlag] = useState("");
    const [sellingprice, setSellingPrice] = useState(0);
    const [offerprice, setOfferPrice] = useState(0);
    const [examId, setExamId] = useState();
    const [examType, setExamType] = useState('');
    const [autosectionrow, setAutoSectionRow] = useState([
        { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '', sect_time: '', tot_marks: '', addtype: true, deltype: false, btn: true, questionbank: [] }
    ]);
    const [subcategoryitems, setSubCategoryItems] = useState([]);
    const [currentindex, setCurrentIndex] = useState(-1);
    const [assignmodal, setAssignModal] = useState(false);
    const [ipaddr, setIpAddr] = useState('');
    const publicIp = require('public-ip');

    const renderAutomaticSectionRows = () => {
        let rowNum = 1;
        return autosectionrow.map((row, index) => {
            rowNum = rowNum + 1;
            const { rowsNo, menu_title, no_ofquest, mark_perquest, neg_mark, cut_off, sect_time, tot_marks, addtype, deltype, btn, questionbank } = row //destructuring
            return (
                <div key={index} className="row no-gutters">
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        <input value={menu_title} onChange={(e) => onAutoMenuTitleChange(e, index)} />
                    </div>
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <input value={no_ofquest} onChange={(e) => onAutoNoofQuestChange(e, index)} />
                    </div>
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <input value={mark_perquest} onChange={(e) => onAutoMarkPerQuestChange(e, index)} />
                    </div>
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <input value={neg_mark} onChange={(e) => onAutoNegMarkChange(e, index)} />
                    </div>
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <input value={cut_off} onChange={(e) => onAutoCutoffChange(e, index)} />
                    </div>
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <input value={sect_time} onChange={(e) => onAutoSectionTimeChange(e, index)} />
                    </div>
                    <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <input disabled value={tot_marks} />
                    </div>
                    <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        {addtype ?
                            <IconButton onClick={() => addAutoSectionalRow(rowNum)} className="icon-btn">
                                <i className="zmdi zmdi-plus zmdi-hc-fw" />
                            </IconButton> :
                            <IconButton onClick={() => removeAutoSectionalRow(rowsNo)} className="icon-btn">
                                <i className="zmdi zmdi-delete zmdi-hc-fw" />
                            </IconButton>}
                    </div>
                    <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        {questionType == 'AUTO' ?
                            <Button onClick={() => openAssignModal(rowsNo, index)} variant="contained" color="primary" className="jr-btn">
                                <span>Assign</span>
                            </Button> :
                            null}
                    </div>
                </div>
            )
        })
    }

    const onModalClose = () => {
        setAssignModal(false);
    };

    const saveAssignedData = () => {
        console.log(automatic);
        console.log(autosectionrow);
        console.log(currentindex);
        let newArr = [...autosectionrow]; // copying the old datas array
        newArr[currentindex].questionbank = automatic;
        setAutoSectionRow(newArr);
        setAutomaticRow([]);
        setAssignModal(false);
    }

    const onMenuTitleChange = (e, index) => {
        /*console.log('index: ' + index);
        console.log('value: ' + e.target.value);*/
        let newArr = [...sectionRow]; // copying the old datas array
        newArr[index].menu_title = e.target.value; // replace e.target.value with whatever you want to change it to
        setSectionRow(newArr); // ??
    }

    const onAutoMenuTitleChange = (e, index) => {
        let newArr = [...autosectionrow]; // copying the old datas array
        newArr[index].menu_title = e.target.value; // replace e.target.value with whatever you want to change it to
        setAutoSectionRow(newArr); // ??
    }

    const onNoofQuestChange = (e, index) => {
        let newArr = [...sectionRow]; // copying the old datas array
        let totalQuestions = totalquestions;
        newArr[index].no_ofquest = e.target.value; // replace e.target.value with whatever you want to change it to
        let totQuest = 0;
        for (var i = 0; i < 4; i++) {
            if (newArr[i].no_ofquest != '') {
                totQuest = parseInt(totQuest) + parseInt(newArr[i].no_ofquest);
            }
        }
        if (totQuest > totalQuestions) {
            setBasic(true);
        }
        if (newArr[index].mark_perquest != '') {
            newArr[index].tot_marks = e.target.value * newArr[index].mark_perquest
        } else {
            newArr[index].tot_marks = e.target.value * 0
        }
        setSectionRow(newArr); // ??
    }

    const onAutoNoofQuestChange = (e, index) => {
        let newArr = [...autosectionrow]; // copying the old datas array
        let totalQuestions = totalquestions;
        newArr[index].no_ofquest = e.target.value; // replace e.target.value with whatever you want to change it to
        let totQuest = 0;
        for (var i = 0; i < newArr.length; i++) {
            console.log(newArr[i]);
            if (newArr[i].no_ofquest != '') {
                totQuest = parseInt(totQuest) + parseInt(newArr[i].no_ofquest);
            }
        }
        if (totQuest > totalQuestions) {
            setBasic(true);
        }
        if (newArr[index].mark_perquest != '') {
            newArr[index].tot_marks = e.target.value * newArr[index].mark_perquest
        } else {
            newArr[index].tot_marks = e.target.value * 0
        }
        setAutoSectionRow(newArr); // ??
    }

    const onConfirm = () => {
        setBasic(false);
    };

    const onMarkPerQuestChange = (e, index) => {
        let newArr = [...sectionRow]; // copying the old datas array
        newArr[index].mark_perquest = e.target.value; // replace e.target.value with whatever you want to change it to
        if (newArr[index].no_ofquest != '') {
            newArr[index].tot_marks = e.target.value * newArr[index].no_ofquest
        } else {
            newArr[index].tot_marks = e.target.value * 0
        }
        setSectionRow(newArr); // ??
    }

    const onAutoMarkPerQuestChange = (e, index) => {
        let newArr = [...autosectionrow]; // copying the old datas array
        newArr[index].mark_perquest = e.target.value; // replace e.target.value with whatever you want to change it to
        if (newArr[index].no_ofquest != '') {
            newArr[index].tot_marks = e.target.value * newArr[index].no_ofquest
        } else {
            newArr[index].tot_marks = e.target.value * 0
        }
        setAutoSectionRow(newArr); // ??
    }

    const onNegMarkChange = (e, index) => {
        let newArr = [...sectionRow]; // copying the old datas array
        newArr[index].neg_mark = e.target.value; // replace e.target.value with whatever you want to change it to
        setSectionRow(newArr); // ??
    }

    const onAutoNegMarkChange = (e, index) => {
        let newArr = [...autosectionrow]; // copying the old datas array
        newArr[index].neg_mark = e.target.value; // replace e.target.value with whatever you want to change it to
        setAutoSectionRow(newArr); // ??
    }

    const onCutoffChange = (e, index) => {
        let newArr = [...sectionRow]; // copying the old datas array
        newArr[index].cut_off = e.target.value; // replace e.target.value with whatever you want to change it to
        setSectionRow(newArr); // ??
    }

    const onAutoCutoffChange = (e, index) => {
        let newArr = [...autosectionrow]; // copying the old datas array
        newArr[index].cut_off = e.target.value; // replace e.target.value with whatever you want to change it to
        setAutoSectionRow(newArr); // ??
    }

    const onSectionTimeChange = (e, index) => {
        let newArr = [...sectionRow]; // copying the old datas array
        newArr[index].sect_time = e.target.value; // replace e.target.value with whatever you want to change it to
        setSectionRow(newArr); // ??
    }

    const onAutoSectionTimeChange = (e, index) => {
        let newArr = [...autosectionrow]; // copying the old datas array
        newArr[index].sect_time = e.target.value; // replace e.target.value with whatever you want to change it to
        setSectionRow(newArr); // ??
    }

    const addAutoSectionalRow = (index) => {
        let nextRow = { rowsNo: index, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '', sect_time: '', tot_marks: '', addtype: false, deltype: true, btn: true, questionbank: [] };
        setAutoSectionRow(state => [...state, nextRow])
    }

    const removeAutoSectionalRow = (index) => {
        setAutoSectionRow(autosectionrow.filter(item => item.rowsNo !== index));
    }

    const openAssignModal = async (rowsNo, index) => {
        setAssignModal(true);
        setCurrentIndex(index);
        setAutomaticRow([]);
        //if (autosectionrow.questionbank.length > 0) {
        let filtered = autosectionrow.filter(row => row.rowsNo == rowsNo);
        console.log(filtered);
        if (filtered.length > 0) {
            if (filtered[0].questionbank.length > 0) {
                let filtereddata = filtered[0].questionbank;
                console.log(filtereddata);
                let filterarr = [];
                filtereddata.map((row, index) => {
                    filterarr.push({ rowsNo: index + 1, maincategoryId: row.maincategoryId, subcategoryitems: row.subcategoryitems, subcategoryId: row.subcategoryId, noofquest: row.noofquest, addtype: true, deltype: false })
                });
                setAutomaticRow(filterarr);
            } else {
                setAutomaticRow([
                    { rowsNo: 1, maincategoryId: '', subcategoryitems: [], subcategoryId: '', noofquest: '', addtype: true, deltype: false }
                ]);
            }
        }
    };


    const navigateTo = () => {
        localStorage.setItem('subId', exam_sub_sub);
        localStorage.setItem('examtype', examType);
        history.push('/app/examsubcategory/examslist');
    }

    const handleRefresh = async () => {
        setLoader(true);
        let ip = await publicIp.v4();
        setIpAddr(ip);
        let mode = localStorage.getItem('mode');
        setMode(mode);
        let examid = localStorage.getItem('examid');
        setExamId(examid);
        let examtype = localStorage.getItem('examtype');
        setExamType(examtype);
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
        let sectcutoff = localStorage.getItem('sectcutoff');
        let secttiming = localStorage.getItem('secttiming');
        let exaid = localStorage.getItem('exaid');
        let exaidsub = localStorage.getItem('exaidsub');
        let exacatid = localStorage.getItem('exacatid');
        let paymentflag = localStorage.getItem('paymentflag');
        let sellingprice = localStorage.getItem('sellingprice');
        let offerprice = localStorage.getItem('offerprice');
        const { data: maincategoryres } = await qbankSubCategoryService.getAllQuestionSubCategoryOnly('Y');
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.cat_id}>{category.cat_name}</MenuItem>)
        }
        setCategoryItems(itemArr);
        const { subcategory: subcategoryres } = maincategoryres;
        setSubCategoryItems(subcategoryres);
        if (mode == 'Edit') {
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
            setSectionalTiming(secttiming);
            setSectionalCutoff(sectcutoff);
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
            for (let s = 0; s < array.length; s++) {
                if (array[s] == 1) {
                    setLevel1(true)
                }
                if (array[s] == 2) {
                    setLevel2(true)
                }
                if (array[s] == 3) {
                    setLevel3(true)
                }
                if (array[s] == 4) {
                    setLevel4(true)
                }
            }
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
            const { data: sectionres } = await examService.getExamById(examid);
            console.log(sectionres);
            const { Section: sectionRow } = sectionres;
            console.log(sectionRow);
            let sectionArr = [];
            let seccount = 0;
            for (let section of sectionRow) {
                let sectionObj = {};
                sectionObj.rowsNo = seccount;
                sectionObj.menu_title = section.menu_title;
                sectionObj.no_ofquest = section.no_ofquest;
                sectionObj.mark_perquest = section.mark_perquest;
                sectionObj.neg_mark = section.neg_mark;
                sectionObj.cut_off = section.cut_off;
                sectionObj.sect_time = section.sect_time;
                sectionObj.tot_marks = section.tot_marks;
                let autoArr = [];
                let count = 1;
                //console.log(section.AutomaticQuestionDetails);
                if (section.AutomaticQuestionDetails != undefined) {
                    for (let auto of section.AutomaticQuestionDetails) {
                        let subcatArr = [];
                        for (let subcategory of subcategoryres) {
                            if (auto.catid == subcategory.pid)
                                subcatArr.push(<MenuItem value={subcategory.cat_id}>{subcategory.cat_name}</MenuItem>)
                        }
                        let autoObj = {
                            rowsNo: '', maincategoryId: '', subcategoryId: '', subcategoryitems: [], noofquest: '', addtype: true, deltype: false
                        };
                        autoObj.rowsNo = count;
                        autoObj.maincategoryId = auto.catid;
                        autoObj.subcategoryId = auto.subcatid;
                        autoObj.subcategoryitems = subcatArr;
                        autoObj.noofquest = auto.noofquestions;
                        if (count == 1) {
                            autoObj.addtype = true;
                            autoObj.deltype = false;
                        } else {
                            autoObj.addtype = false;
                            autoObj.deltype = true;
                        }
                        count = count + 1;
                        autoArr.push(autoObj);
                        console.log(autoArr);
                    }
                }
                sectionObj.questionbank = autoArr;
                if (seccount == 0) {
                    sectionObj.addtype = true;
                    sectionObj.deltype = false;
                } else {
                    sectionObj.deltype = true;
                    sectionObj.addtype = false;
                }
                sectionArr.push(sectionObj);
                seccount = seccount + 1;
                console.log(sectionArr);
            }
            setAutoSectionRow(sectionArr);
        } else {
            setExam_title('');
            const { data: typeslistres } = await examServices.getTestTypes(exacatid);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>)
            }
            setTestTypes(typesListArr);
            setAutoSectionRow([
                { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '', sect_time: '', tot_marks: '', addtype: true, deltype: false, btn: true, questionbank: [] }
            ]);
        }

        setExam_cat(exaid);
        setExam_sub(exaidsub);
        setExam_sub_sub(exacatid);
        const { data: typeres } = await examSubCategoryService.getExamSubCategoryType(exacatid);
        const { count: typeCount } = typeres;
        if (typeCount != 0) {
            setShowTypeOpt(true);
        } else {
            setShowTypeOpt(false);
        }
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

    const handleSectionalTiming = (e) => {
        setSectionalTiming(e.target.value);
    }

    const handleSectionalCutoff = (e) => {
        setSectionalCutoff(e.target.value);
    }

    const handleQuestionType = async (e) => {
        if (e.target.value == 'MANU') {
            setAutoSectionRow([
                { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '', sect_time: '', tot_marks: '', addtype: true, deltype: false, btn: true, questionbank: [] }
            ]);
        }
        setQuestionType(e.target.value);
    };

    const handleMainCategoryChange = async (event, index) => {
        console.log(index);
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].maincategoryId = event.target.value; // replace e.target.value with whatever you want to change it to
        let itemArr = [];
        for (let subcategory of subcategoryitems) {
            if (event.target.value == subcategory.pid)
                itemArr.push(<MenuItem value={subcategory.cat_id}>{subcategory.cat_name}</MenuItem>)
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

    const saveBankExam = async () => {
        let data = {};
        data.exam_cat = exam_cat;
        data.exam_sub = exam_sub;
        data.exam_sub_sub = exam_sub_sub;
        data.exam_name = exam_title;
        data.exam_slug = slug;
        data.assign_test_type = assigntype;
        data.exam_type = examType;
        data.exam_code = examcode;
        data.sect_cutoff = sectionalCutoff;
        data.sect_timing = sectionalTiming;
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
        data.selling_price = sellingprice;
        data.offer_price = offerprice;
        data.ip_addr = ipaddr;
        data.sections = sectionRow;
        console.log(data);
        await examServices.saveBankExam(data);
        setAlertMessage('Bank Exam added successfully!');
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false)
        }, 1500);
        navigateTo();
    }

    const updateBankExam = async () => {
        let data = {};
        data.exam_cat = exam_cat;
        data.exam_sub = exam_sub;
        data.exam_sub_sub = exam_sub_sub;
        data.exam_name = exam_title;
        data.exam_slug = slug;
        data.assign_test_type = assigntype;
        data.exam_type = examType;
        data.exam_code = examcode;
        data.sect_cutoff = sectionalCutoff;
        data.sect_timing = sectionalTiming;
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
        data.selling_price = sellingprice;
        data.offer_price = offerprice;
        data.ip_addr = ipaddr;
        data.sections = autosectionrow;
        console.log(data);
        await examServices.updateBankExam(examId, data);
        setAlertMessage('Bank Exam Updated successfully!');
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false)
        }, 1500);
        localStorage.setItem('subId', exam_sub_sub);
        localStorage.setItem('examtype', examType);
        history.push('/app/examsubcategory/examslist');
    }

    const handleRequestClose = () => {
        setShowMessage(false)
    };

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
                        onChange={(e) => onNumofQuestChange(e, index)}
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
        let nextRow = { rowsNo: index, maincategoryId: '', subcategoryitems: [], subcategoryId: [], noofquest: '', addtype: false, deltype: true };
        setAutomaticRow(state => [...state, nextRow])
    }

    const removeAutomaticRow = (index) => {
        setAutomaticRow(automatic.filter(item => item.rowsNo !== index));
    }

    const onNumofQuestChange = (e, index) => {
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
                        <h1>Add Bank Exam</h1>
                    </div> :
                        <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                            <h1>Update Exam</h1>
                        </div>}
                    <div style={{ padding: '1%' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <Button onClick={() => navigateTo()} variant="contained" color="primary" className="jr-btn">
                            <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                            <span>Back</span>
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
                                            required
                                            autoComplete="off"
                                            id="Selling Price"
                                            label={"Selling Price"}
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
                                            label={"Offer Price"}
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
                            </RadioGroup>
                        </FormControl>
                        {showtesttypes &&
                            <>
                                <FormControl className="w-100 mb-2">
                                    <InputLabel htmlFor="age-simple">Test Types</InputLabel>
                                    <Select onChange={(event, value) => {
                                        handleTestTypeChange(event, value)
                                    }} value={testtypeid}>
                                        {/*<MenuItem value={'0'}>Select</MenuItem>*/}
                                        {testtypes}
                                    </Select>
                                </FormControl>
                                <FormControl component="fieldset" required>
                                    <FormLabel component="legend">Sectional Timing</FormLabel>
                                    <RadioGroup
                                        className="d-flex flex-row"
                                        aria-label="sectionaltiming"
                                        name="sectionaltiming"
                                        value={sectionalTiming}
                                        onChange={(e) => handleSectionalTiming(e)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio color="primary" />} label="Yes" />
                                        <FormControlLabel value="N" control={<Radio color="primary" />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControl component="fieldset" required>
                                    <FormLabel component="legend">Sectional Cut off</FormLabel>
                                    <RadioGroup
                                        className="d-flex flex-row"
                                        aria-label="sectionalcutoff"
                                        name="sectionalcutoff"
                                        value={sectionalCutoff}
                                        onChange={(e) => handleSectionalCutoff(e)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio color="primary" />} label="Yes" />
                                        <FormControlLabel value="N" control={<Radio color="primary" />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </>
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
                                <FormControlLabel value="MANU" control={<Radio color="primary" />} label="Manual" />
                                <FormControlLabel value="AUTO" control={<Radio color="primary" />} label="Automatic" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Position'}
                            onChange={(event) => setPosition(event.target.value)}
                            value={position}
                            margin="normal" />
                        <h3>Sectional Details</h3>
                        <div className="row no-gutters">
                            <div style={{ textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                Menu Title
                            </div>
                            <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                No of Quest
                            </div>
                            <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Mark/Quest
                            </div>
                            <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Neg Mark
                            </div>
                            <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Cut off
                            </div>
                            <div style={{ textAlign: 'left' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Time(mins)
                            </div>
                            <div style={{ textAlign: 'left' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Total Marks
                            </div>
                        </div>
                        {renderAutomaticSectionRows()}
                        {mode == 'Add' ? <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
                            <Button onClick={() => saveBankExam()} variant="contained" color="primary" className="jr-btn text-white">
                                Submit
                            </Button>
                        </div> :
                            <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
                                <Button onClick={() => updateBankExam()} variant="contained" color="primary" className="jr-btn text-white">
                                    Update
                                </Button>
                            </div>
                        }
                    </div>
                    <Modal className="modal-box" backdrop={"static"} toggle={onModalClose} isOpen={assignmodal}>
                        <ModalHeader className="modal-box-header bg-primary text-white">
                            {"Assign"}
                        </ModalHeader>
                        <div className="modal-box-content">
                            {renderAutomaticTypes()}
                        </div>
                        <ModalFooter>
                            <div className="d-flex flex-row">
                                <Button style={{ marginRight: '5%' }} variant="contained" onClick={saveAssignedData} color="primary">Save</Button>
                                <Button variant="contained" color="secondary" onClick={onModalClose}>Cancel</Button>
                            </div>
                        </ModalFooter>
                    </Modal>
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
                    <SweetAlert show={basic} title={'No. of Questions greater than Total questions (' + totalquestions + ')'}
                        onConfirm={onConfirm} />
                </div>
            }
        </div>
    )
};

export default AddEditBankExam;
