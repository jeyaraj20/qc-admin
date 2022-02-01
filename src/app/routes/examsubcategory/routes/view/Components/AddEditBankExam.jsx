import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
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
import * as examSubCategoryService from '../../../../../../services/examSubCategoryService';
import * as qbankSubCategoryService from '../../../../../../services/qbankSubCategoryService';
import * as examServices from '../../../../../../services/examServices';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import SweetAlert from 'react-bootstrap-sweetalert'
import * as examService from '../../../../../../services/examServices';
import IconButton from "@material-ui/core/IconButton";
import Joi from 'joi-browser';
import { DateTimePicker } from '@material-ui/pickers';
import Moment from "moment";
const publicIp = require('public-ip');

const AddEditBankExam = (props) => {

    const [screenmode, setMode] = useState("");
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
    const [assigntype, setAssignType] = useState("D");
    const [position, setPosition] = useState("");
    const [addedexamtypes, setAddedExamTypes] = useState("");
    const [showtesttypes, setShowTestTypes] = useState(false);
    const [showchapterwise, setShowChapterWise] = useState(false);
    const [showpreviousyear, setShowPreviousYear] = useState(false);
    const [showTypeOpt, setShowTypeOpt] = useState(false);
    const [questionType, setQuestionType] = useState("MANU");
    const [testtypes, setTestTypes] = useState([]);
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
    const [showprice, setShowPrice] = useState(false);
    const [paymentflag, setPaymentFlag] = useState("N");
    const [sellingprice, setSellingPrice] = useState(0);
    const [offerprice, setOfferPrice] = useState(0);
    const [autosectionrow, setAutoSectionRow] = useState([
        { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '0', sect_time: '0', tot_marks: '', addtype: true, deltype: false, btn: true, questionbank: [] }
    ]);
    const [sectionalTiming, setSectionalTiming] = useState("Y");
    const [sectionalCutoff, setSectionalCutoff] = useState("Y");
    const [basic, setBasic] = useState(false);
    const [categoryitems, setCategoryItems] = useState([]);
    const [subcategoryitems, setSubCategoryItems] = useState([]);
    const [automatic, setAutomaticRow] = useState([]);
    const [currentindex, setCurrentIndex] = useState(-1);
    const [assignmodal, setAssignModal] = useState(false);
    const [submitDisabled, SetSubmitDisabled] = useState(false);
    const [alertText, SetAlertText] = useState('');
    const [errors, setErrors] = useState({});
    const [sectionquestion, setSectionQuestion] = useState('');
    const [ipaddr, setIpAddr] = useState('');
    const [selectedStartDate, setStartDateChange] = useState(null);
    const [selectedEndDate, setEndDateChange] = useState(null);

    const schema = {
        exam_name: Joi.string().required().label('Exam Title'),
        exam_slug: Joi.string().required().label('Exam Slug'),
        exam_code: Joi.string().required().label('Exam Code'),
        tot_questions: Joi.string().required().label('Total Questions'),
        mark_perquest: Joi.string().required().label('Marks Per Question'),
        neg_markquest: Joi.string().required().label('Negative Mark'),
        total_time: Joi.string().required().label('Total Time'),
        exam_pos: Joi.string().required().label('Position'),
        exam_type_cat: Joi.string().required().label('Exam Type'),
        exam_level: Joi.string().required().label('Exam Level'),
        exam_type_id: Joi.number().required().label('Type/Chapter/Previous Year'),
    }

    const validate = (obj) => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(obj, schema, options);
        if (!error) return null;
        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;

    }

    const valiadateProperty = (e) => {
        let { name, value, className } = e.currentTarget;
        const obj = { [name]: value };
        const filedSchema = { [name]: schema[name] };
        const { error } = Joi.validate(obj, filedSchema);

        let message = error ? error.details[0].message : null;
        setErrors({ ...errors, [name]: message, "errordetails": null })

        if (error)
            e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid"
        else
            e.currentTarget.className = className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid"
    }

    // const renderSectionRows = () => {
    //     let rowNum = 1;
    //     return sectionRow.map((row, index) => {
    //         rowNum = rowNum + 1;
    //         const { rowsNo, menu_title, no_ofquest, mark_perquest, neg_mark, cut_off, sect_time, tot_marks, addtype, deltype } = row //destructuring
    //         return (
    //             <div key={index} className="row no-gutters">
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-5 d-flex flex-column order-lg-1">
    //                     <input value={menu_title} onChange={(e) => onMenuTitleChange(e, index)} />
    //                 </div>
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     <input value={no_ofquest} onChange={(e) => onNoofQuestChange(e, index)} />
    //                 </div>
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     <input value={mark_perquest} onChange={(e) => onMarkPerQuestChange(e, index)} />
    //                 </div>
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     <input value={neg_mark} onChange={(e) => onNegMarkChange(e, index)} />
    //                 </div>
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     <input value={cut_off} onChange={(e) => onCutoffChange(e, index)} />
    //                 </div>
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     <input value={sect_time} onChange={(e) => onSectionTimeChange(e, index)} />
    //                 </div>
    //                 <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     <input disabled value={tot_marks} />
    //                 </div>
    //                 <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
    //                     {addtype ?
    //                         <IconButton onClick={() => addSectionalRow(rowNum)} className="icon-btn">
    //                             <i className="zmdi zmdi-plus zmdi-hc-fw" />
    //                         </IconButton> :
    //                         <IconButton onClick={() => removeSectionalRow(rowsNo)} className="icon-btn">
    //                             <i className="zmdi zmdi-delete zmdi-hc-fw" />
    //                         </IconButton>}
    //                 </div>
    //             </div>
    //         )
    //     })
    // }

    const validateSections = () => {
        let errs = {};
        let isValid = true;
        let noOfQuestions = 0;
        let timing = 0;
        for (let item of autosectionrow) {
            /* 
                1. Check null / empty value in sectional array
            */
            if (!item.menu_title || !item.no_ofquest || !item.neg_mark || !item.tot_marks) {
                isValid = false;
                errs["section"] = "* Required All Fields in section";
                break;
            }
            if (sectionalCutoff === 'Y') {
                if (!item.cut_off) {
                    isValid = false;
                    errs["section"] = "* Required All Fields in section";
                    break;
                }
            }
            if (sectionalTiming === 'Y') {
                if (!item.sect_time) {
                    isValid = false;
                    errs["section"] = "* Required All Fields in section";
                    break;
                }
            }

            /* 
                2. Check No of questions valid or not
                check enterted total questions and sum of sections questions
            */
            if (item.no_ofquest !== 0) {
                noOfQuestions += parseInt(item.no_ofquest);
            }

            /* 
                3. Check Total Mins valid or not
                check enterted total mints and sum of sections mints
            */
            if (sectionalTiming == 'Y' && item.sect_time !== 0) {
                timing += parseInt(item.sect_time);
                console.log(timing);
            }
        }
        if (noOfQuestions < parseInt(totalquestions) || noOfQuestions > parseInt(totalquestions)) {
            isValid = false;
            errs["section"] = `* Section Sum of Total Questions should be equal to ${totalquestions}`
        }
        if (sectionalTiming === 'Y') {
            if (timing < parseInt(totalminutes) || timing > parseInt(totalminutes)) {
                isValid = false;
                errs["section"] = `* Section Sum of Minutes should be equal to ${totalminutes}`
            }
        }
        setErrors(errs)
        // if(Object.keys(errors).length>0) setErrors({ ...errors, ...errs})
        // else setErrors(errs)

        return isValid;
    }

    const renderAutomaticSectionRows = () => {
        let rowNum = 1;
        return autosectionrow.map((row, index) => {
            rowNum = rowNum + 1;
            const { rowsNo, menu_title, no_ofquest, mark_perquest, neg_mark, cut_off, sect_time, tot_marks, addtype, deltype, btn, questionbank } = row //destructuring
            return (
                <>
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
                        {sectionalCutoff === 'Y' &&
                            <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                <input value={cut_off} onChange={(e) => onAutoCutoffChange(e, index)} />
                            </div>
                        }
                        {sectionalTiming === 'Y' &&
                            <div style={{ padding: '0.5%', textAlign: 'right' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                <input value={sect_time} onChange={(e) => onAutoSectionTimeChange(e, index)} />
                            </div>
                        }
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
                            {questionType === 'AUTO' ?
                                <Button onClick={() => openAssignModal(rowsNo, index, no_ofquest)} variant="contained" color="primary" className="jr-btn">
                                    <span>Assign</span>
                                </Button> :
                                null}
                        </div>
                    </div>
                </>
            )
        })
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


    // const onNoofQuestChange = (e, index) => {
    //     let newArr = [...sectionRow]; // copying the old datas array
    //     let totalQuestions = totalquestions;
    //     newArr[index].no_ofquest = e.target.value; // replace e.target.value with whatever you want to change it to
    //     let totQuest = 0;
    //     for (var i = 0; i < 4; i++) {
    //         if (newArr[i].no_ofquest !== '') {
    //             totQuest = parseInt(totQuest) + parseInt(newArr[i].no_ofquest);
    //         }
    //     }
    //     if (totQuest > totalQuestions) {
    //         setBasic(true);
    //         SetSubmitDisabled(true);
    //         SetAlertText('No. of Questions greater than Total questions');
    //     } else {
    //         SetSubmitDisabled(false);
    //     }
    //     if (newArr[index].mark_perquest !== '') {
    //         newArr[index].tot_marks = e.target.value * newArr[index].mark_perquest
    //     } else {
    //         newArr[index].tot_marks = e.target.value * 0
    //     }
    //     setSectionRow(newArr); // ??
    // }

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
            SetSubmitDisabled(true);
            SetAlertText('No. of Questions greater than Total questions');
        } else {
            SetSubmitDisabled(false);
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
        let totTime = 0;
        for (var i = 0; i < newArr.length; i++) {
            console.log(newArr[i]);
            if (newArr[i].sect_time != '0') {
                SetSubmitDisabled(false);
                totTime = parseInt(totTime) + parseInt(newArr[i].sect_time);
            } else if (newArr[i].sect_time === '0' || newArr[i].sect_time === '') {
                SetSubmitDisabled(true);
            } else {
                SetSubmitDisabled(false);
            }
        }
        if (totTime > totalminutes) {
            setBasic(true);
            SetSubmitDisabled(true);
            SetAlertText('Section Total Minutes greater than Total Exam Minutes');
        }
        setSectionRow(newArr); // ??
    }

    let { toggle, examtype, subcatdetails, examdetails, mode } = props;

    const handleRefresh = async () => {
        setLoader(true);
        let ip = await publicIp.v4();
        setIpAddr(ip);
        console.log(examdetails);
        console.log(mode);
        const { data: maincategoryres } = await qbankSubCategoryService.getAllQuestionSubCategoryOnly('Y');
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.cat_id}>{category.cat_name}</MenuItem>)
        }
        setCategoryItems(itemArr);
        /*const { data: res } = await qbankSubCategoryService.getAllQuestionSubCategoryOnly('Y');
        console.log(res);*/
        const { subcategory: subcategoryres } = maincategoryres;
        setSubCategoryItems(subcategoryres);
        if (mode === 'Edit') {
            console.log(examdetails);
            setExam_title(examdetails.exam_name);
            setSlug(examdetails.exam_slug);
            setExamcode(examdetails.exam_code);
            setTotalQuestions(examdetails.tot_questions);
            setMarksPerQues(examdetails.mark_perquest);
            setNegativeMarks(examdetails.neg_markquest);
            setTotalMarks(examdetails.tot_mark);
            setTotalMinutes(examdetails.total_time);
            setAssignType(examdetails.assign_test_type);
            setAddedExamTypes(examdetails.exam_type_cat);
            setExamLevel(examdetails.exam_level);
            setSectionalTiming(examdetails.sect_timing);
            setSectionalCutoff(examdetails.sect_cutoff);
            var array = JSON.parse("[" + examdetails.exam_level + "]");
            for (let s = 0; s < array.length; s++) {
                if (array[s] === 1) {
                    setLevel1(true)
                }
                if (array[s] === 2) {
                    setLevel2(true)
                }
                if (array[s] === 3) {
                    setLevel3(true)
                }
                if (array[s] === 4) {
                    setLevel4(true)
                }
            }
            setQuestionType(examdetails.quest_type);
            setPosition(examdetails.exam_pos);
            setTestTypeId(examdetails.exam_type_id);
            const { data: typeslistres } = await examServices.getTestTypesEdit(subcatdetails.exa_cat_id);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>)
            }
            setTestTypes(typesListArr);
            if (examdetails.exam_type_cat === 'T') {
                setShowTestTypes(true);
            } else {
                setShowTestTypes(false);
            }
            if (examdetails.exam_type_cat === 'C') {
                setShowChapterWise(true);
            } else {
                setShowChapterWise(false);
            }
            if (examdetails.exam_type_cat === 'P') {
                setShowPreviousYear(true);
            } else {
                setShowPreviousYear(false);
            }
            const { data: sectionres } = await examService.getExamById(examdetails.exam_id);
            const { Section: sectionRow } = sectionres;
            let sectionArr = [];
            let count = 0;
            if(sectionres && sectionres.count > 0 ){
                for (let section of sectionRow) {
                    let sectionObj = {};
                    sectionObj.menu_title = section.menu_title;
                    sectionObj.no_ofquest = section.no_ofquest;
                    sectionObj.mark_perquest = section.mark_perquest;
                    sectionObj.neg_mark = section.neg_mark;
                    sectionObj.cut_off = section.cut_off;
                    sectionObj.sect_time = section.sect_time;
                    sectionObj.tot_marks = section.tot_marks;
                    sectionObj.sect_id = section.sect_id;
                    if (count === 0) {
                        sectionObj.addtype = true;
                        sectionObj.deltype = false;
                    } else {
                        sectionObj.deltype = true;
                        sectionObj.addtype = false;
                    }
                    sectionArr.push(sectionObj);
                    count = count + 1;
                    console.log(sectionArr);
                }
                setAutoSectionRow(sectionArr);
            }
        } else {
            setExam_title('');
            const { data: typeslistres } = await examServices.getTestTypes(subcatdetails.exa_cat_id);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>)
            }
            setTestTypes(typesListArr);
            setSectionRow([
                { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '0', sect_time: '0', tot_marks: '', addtype: true, deltype: false }
            ]);
        }
        setMode(examtype);
        setExam_cat(subcatdetails.exaid);
        setExam_sub(subcatdetails.exaid_sub);
        setExam_sub_sub(subcatdetails.exa_cat_id);
        const { data: typeres } = await examSubCategoryService.getExamSubCategoryType(subcatdetails.exa_cat_id);
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
        errors["SellingPrice"] = "";
    }

    const onOfferPriceChange = (price) => {
        setOfferPrice(price);
        errors["OfferPrice"] = "";
    }

    const handleAssignType = (e) => {
        setAssignType(e.target.value);
    };

    const handleAddedExamTypes = (e) => {
        setAddedExamTypes(e.target.value);
        if (e.target.value === 'T') {
            setShowTestTypes(true);
        } else {
            setShowTestTypes(false);
        }
        if (e.target.value === 'C') {
            setShowChapterWise(true);
        } else {
            setShowChapterWise(false);
        }
        if (e.target.value === 'P') {
            setShowPreviousYear(true);
        } else {
            setShowPreviousYear(false);
        }
    };

    const handlePaidExamTypes = (e) => {
        setPaymentFlag(e.target.value);
        if (e.target.value === "Y") {
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

    const onModalClose = () => {
        setAssignModal(false);
    };

    const handleStartDateChange = (date) => {
        if(date === null ){
            setStartDateChange(null);
        }else{
            let fromdate = Moment(date).format('YYYY-MM-DD HH:mm:ss');
            setStartDateChange(fromdate);
        }
    }

    const handleEndDateChange = (date) => {
        if(date === null ){
            setEndDateChange(null);
        }else{
            let fromdate = Moment(date).format('YYYY-MM-DD HH:mm:ss');
            setEndDateChange(fromdate);
        }
    }

    const saveAssignedData = () => {
        console.log(automatic);
        console.log(autosectionrow);
        console.log(currentindex);
        let totalquestion = 0;
        for (let data of automatic) {
            console.log(data.noofquest);
            if (data.noofquest != undefined)
                totalquestion = totalquestion + parseInt(data.noofquest);
        }
        console.log(totalquestion);
        if (totalquestion < sectionquestion || totalquestion > sectionquestion || totalquestion === 0 || totalquestion === undefined) {
            setAlertMessage('Question Count is mismatch!!!');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
        } else {
            let newArr = [...autosectionrow]; // copying the old datas array
            newArr[currentindex].questionbank = automatic;
            setAutoSectionRow(newArr);
            setAutomaticRow([]);
            setAssignModal(false);
        }
    }

    const openAssignModal = async (rowsNo, index, noofquest) => {
        console.log(noofquest);
        setSectionQuestion(noofquest);
        setAssignModal(true);
        setCurrentIndex(index);
        setAutomaticRow([]);
        //if (autosectionrow.questionbank.length > 0) {
        let filtered = autosectionrow.filter(row => row.rowsNo === rowsNo);
        console.log(filtered);
        if (filtered.length > 0) {
            if (filtered[0].questionbank.length > 0) {
                let filtereddata = filtered[0].questionbank;
                console.log(filtereddata);
                let filterarr = [];
                filtereddata.map((row, index) => {
                    console.log(index);
                    if (index === 0) {
                        filterarr.push({ rowsNo: index + 1, maincategoryId: row.maincategoryId, subcategoryitems: row.subcategoryitems, subcategoryId: row.subcategoryId, noofquest: row.noofquest, addtype: true, deltype: false })
                    } else {
                        filterarr.push({ rowsNo: index + 1, maincategoryId: row.maincategoryId, subcategoryitems: row.subcategoryitems, subcategoryId: row.subcategoryId, noofquest: row.noofquest, addtype: false, deltype: true })
                    }
                });
                setAutomaticRow(filterarr);
            } else {
                setAutomaticRow([
                    { rowsNo: 1, maincategoryId: '', subcategoryitems: [], subcategoryId: '', noofquest: '', addtype: true, deltype: false }
                ]);
            }
        }
    };

    const handleQuestionType = async (e) => {
        if (e.target.value === 'MANU') {
            setAutoSectionRow([
                { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '0', sect_time: '0', tot_marks: '', addtype: true, deltype: false, btn: false, questionbank: [] }
            ]);
        } else {
            setAutoSectionRow([
                { rowsNo: 1, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '0', sect_time: '0', tot_marks: '', addtype: true, deltype: false, btn: true, questionbank: [] }
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
            if (event.target.value === subcategory.pid)
                itemArr.push(<MenuItem value={subcategory.cat_id}>{subcategory.cat_name}</MenuItem>)
        }
        newArr[index].subcategoryitems = itemArr;
        setAutomaticRow(newArr); // ??
    }

    const handleSubCategoryChange = async (event, index) => {
        let newArr = [...automatic]; // copying the old datas array
        for (let data of newArr) {
            if (data.subcategoryId === event.target.value) {
                console.log("false");
                setAlertMessage('Sub category already selected');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false)
                }, 1500);
                return false;
            }
        }
        newArr[index].subcategoryId = event.target.value;
        console.log(newArr)
        console.log(event.target.value)
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
                if (arr[i] === e.target.value) {
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
                if (arr[i] === e.target.value) {
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
                if (arr[i] === e.target.value) {
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
                if (arr[i] === e.target.value) {
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
        setTestTypeId(event.target.value);
    }

    const saveBankExamClick = async () => {
        if(selectedStartDate && selectedEndDate ){
            if( Date.parse(selectedStartDate) > Date.parse(selectedEndDate) ){
                setShowMessage(true);
                setAlertMessage('Start Date should be less than or equal to End Date');
                setTimeout(() => {
                    setShowMessage(false)
                }, 1500);
            }else{
                saveBankExam();
            }
        }else if(!selectedStartDate && selectedEndDate ){
            setShowMessage(true);
            setAlertMessage('Start Date should be less than or equal to End Date');
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
        }else{
            saveBankExam();
        }
    }

    const saveBankExam = async () => {
        let data = {};
        data.exam_cat = exam_cat;
        data.exam_sub = exam_sub;
        data.exam_sub_sub = exam_sub_sub;
        data.exam_name = exam_title;
        data.exam_slug = slug;
        data.assign_test_type = assigntype;
        data.exam_type = examtype;
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
        data.exam_level = examlevel;
        data.ip_addr = ipaddr;
        data.sections = autosectionrow;
        data.startDate = selectedStartDate;
        data.endDate = selectedEndDate;
        let validateData = {
            exam_name: exam_title,
            exam_slug: slug,
            exam_code: examcode,
            tot_questions: totalquestions,
            mark_perquest: markperquestion,
            neg_markquest: negativemarks,
            total_time: totalminutes,
            exam_pos: position,
            exam_type_cat: addedexamtypes,
            exam_level: examlevel,
            exam_type_id: testtypeid,
        }
        let errs = validate(validateData);
        if (errs) {
            setErrors(errs);
            return false;
        } else {
            setErrors({});
        }

        if (validateSections()) {
            await examServices.saveBankExam(data);
            setAlertMessage('Bank Exam added successfully!');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false)
            }, 1500);
            toggle(false);
        }
    }

    const updateBankExam = async () => {
        let data = {};
        data.exam_cat = exam_cat;
        data.exam_sub = exam_sub;
        data.exam_sub_sub = exam_sub_sub;
        data.exam_name = exam_title;
        data.exam_slug = slug;
        data.assign_test_type = assigntype;
        data.exam_type = examtype;
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
        data.ip_addr = ipaddr;
        data.exam_level = examlevel;
        data.payment_flag = paymentflag;
        data.selling_price = sellingprice;
        data.offer_price = offerprice;
        data.sections = sectionRow;
        console.log(data);
        await examServices.updateBankExam(examdetails.exam_id, data);
        setAlertMessage('Bank Exam Updated successfully!');
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false)
        }, 1500);
        toggle(false);
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
            const { rowsNo, noofquest, maincategoryId, subcategoryitems, subcategoryId, addtype, deltype } = row //destructuring
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
        let nextRow = { rowsNo: index, maincategoryId: '', subcategoryitems: [], subcategoryId: '', noofquest: '', addtype: false, deltype: true };
        setAutomaticRow(state => [...state, nextRow])
    }

    const removeAutomaticRow = (index) => {
        setAutomaticRow(automatic.filter(item => item.rowsNo !== index));
    }

    const onNumofQuestChange = (e, index) => {
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].noofquest = e.target.value; // replace e.target.value with whatever you want to change it to
        let sectotal = sectionquestion;
        let totQuest = 0;
        for (var i = 0; i < newArr.length; i++) {
            console.log(newArr[i]);
            if (newArr[i].noofquest != '') {
                totQuest = parseInt(totQuest) + parseInt(newArr[i].noofquest);
            }
        }
        if (totQuest > sectotal) {
            setBasic(true);
            SetSubmitDisabled(true);
            SetAlertText('No. of Questions greater than Total questions');
        } else {
            SetSubmitDisabled(false);
        }
        setAutomaticRow(newArr); // ??
    }

    const addSectionalRow = (index) => {
        let nextRow = { rowsNo: index, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '0', sect_time: '0', tot_marks: '', addtype: false, deltype: true };
        setSectionRow(state => [...state, nextRow])
    }

    const removeSectionalRow = (index) => {
        setSectionRow(sectionRow.filter(item => item.rowsNo !== index));
    }

    const addAutoSectionalRow = (index) => {
        let nextRow = { rowsNo: index, menu_title: '', no_ofquest: '', mark_perquest: '', neg_mark: '', cut_off: '0', sect_time: '0', tot_marks: '', addtype: false, deltype: true, btn: true, questionbank: [] };
        setAutoSectionRow(state => [...state, nextRow])
    }

    const removeAutoSectionalRow = (index) => {
        setAutoSectionRow(autosectionrow.filter(item => item.rowsNo !== index));
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
                    {mode === 'Add' ? <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                        <h1>Add Bank Exam</h1>
                    </div> :
                        <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                            <h1>Update Exam</h1>
                        </div>}
                    <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
                        <div className="row">
                            <div className="col-lg-10 col-sm-10 col-10">
                                <h4 style={{ padding: '0.5%' }}>{mode} Exam for ({subcatdetails.Mastercategory} - {subcatdetails.category})</h4>
                            </div>
                            <div className="col-lg-2 col-sm-2 col-2">
                                <Button onClick={() => toggle(false)} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                                    <span>Back</span>
                                </Button>
                            </div>
                        </div>
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
                                            error={errors && errors.SellingPrice}
                                            helperText={errors.SellingPrice}
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
                                            error={errors && errors.OfferPrice}
                                            helperText={errors.OfferPrice}
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
                            name={'exam_name'}
                            onChange={(event) => onExamTitleChange(event.target.value)}
                            onBlur={valiadateProperty}
                            value={exam_title}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_name']}</h6></div>
                        <TextField
                            autoComplete='off'
                            required
                            id="Exam Slug"
                            label={'Exam Slug'}
                            name={'exam_slug'}
                            onChange={(event) => setSlug(event.target.value)}
                            onBlur={valiadateProperty}
                            value={slug}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_slug']}</h6></div>
                        <TextField
                            autoComplete='off'
                            required
                            id="required"
                            label={'Exam Code'}
                            name={'exam_code'}
                            onChange={(event) => setExamcode(event.target.value)}
                            onBlur={valiadateProperty}
                            value={examcode}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_code']}</h6></div>
                    </div>
                    <div style={{ padding: '1%' }} className="col-lg-12 d-flex flex-column order-lg-1">
                        <h3>Question And Mark Details</h3>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Total Questions'}
                            name={'tot_questions'}
                            onChange={(event) => handleTotQuestionsChange(event)}
                            onBlur={valiadateProperty}
                            value={totalquestions}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['tot_questions']}</h6></div>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Mark Per Questions'}
                            name={'mark_perquest'}
                            onChange={(event) => handleMarksPerQuesChange(event)}
                            onBlur={valiadateProperty}
                            value={markperquestion}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['mark_perquest']}</h6></div>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Negative Mark Per Question'}
                            name={'neg_markquest'}
                            onChange={(event) => setNegativeMarks(event.target.value)}
                            onBlur={valiadateProperty}
                            value={negativemarks}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['neg_markquest']}</h6></div>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Total Marks'}
                            value={totalmarks}
                            margin="none" />
                        <TextField
                            autoComplete='off'
                            required
                            label={'Total Time (In Minutes)'}
                            name={'total_time'}
                            onChange={(event) => setTotalMinutes(event.target.value)}
                            onBlur={valiadateProperty}
                            value={totalminutes}
                            margin="none" />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['total_time']}</h6></div>
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
                            <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_type_cat']}</h6></div>
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
                                <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_type_id']}</h6></div>
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
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_level']}</h6></div>
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
                        <div class="row" style={{marginBottom : 10 }}>
                            <div class="col-lg-4" style={{ "margin": "0px" }}>
                                <DateTimePicker
                                    clearable
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    label="Start Date"
                                    format="DD/MM/YYYY HH:mm:ss"
                                    style={{ width : '100%'}}
                                />
                            </div>
                            <div class="col-lg-4" style={{ "margin": "0px" }}>
                                <DateTimePicker
                                    clearable
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    label="End Date"
                                    format="DD/MM/YYYY HH:mm:ss"
                                    style={{ width : '100%'}}
                                />
                            </div>
                        </div>
                        <TextField
                            autoComplete='off'
                            required
                            label={'Position'}
                            name={'exam_pos'}
                            onChange={(event) => setPosition(event.target.value)}
                            value={position}
                            margin="none" 
                        />
                        <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['exam_pos']}</h6></div>
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
                            {sectionalCutoff === 'Y' &&
                                <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                    Cut off
                            </div>
                            }
                            {sectionalTiming === 'Y' &&
                                <div style={{ textAlign: 'left' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                    Time(mins)
                            </div>
                            }
                            <div style={{ textAlign: 'left' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Total Marks
                            </div>
                            <div style={{ textAlign: 'left' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                Add/Remove
                            </div>
                            {questionType === 'AUTO' &&
                                <div style={{ textAlign: 'center' }} className="col-lg-1 d-flex flex-column order-lg-1">
                                    Assign
                            </div>
                            }
                        </div>
                        {/*questionType === 'MANU' &&
                            renderSectionRows()
                        */}

                        {renderAutomaticSectionRows()}
                        <div className="row no-gutters">
                            <span style={{ color: 'red', paddingTop: '1%' }}>{errors && errors.section}</span>
                        </div>

                        {mode === 'Add' ? <div style={{ paddingTop: '2%', textAlign: 'right' }} className="col-lg-6 col-sm-6 col-12">
                            <Button onClick={() => saveBankExamClick()} disabled={submitDisabled} variant="contained" color="primary" className="jr-btn text-white">
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
                    <SweetAlert show={basic} title={alertText}
                        onConfirm={onConfirm} />
                </div>
            }
        </div>
    )
};

export default AddEditBankExam;
