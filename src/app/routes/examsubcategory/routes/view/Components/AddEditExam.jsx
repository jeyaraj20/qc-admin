import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import * as examSubCategoryService from "../../../../../../services/examSubCategoryService";
import * as exammainCategoryService from "../../../../../../services/exammainCategoryService";
import * as qbankSubCategoryService from '../../../../../../services/qbankSubCategoryService';
import * as examServices from "../../../../../../services/examServices";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import SweetAlert from 'react-bootstrap-sweetalert'
import Joi from "joi-browser";

const AddEditExam = (props) => {
    const [errors, setErrors] = useState({});
    const [screenmode, setMode] = useState("");
    const [loader, setLoader] = useState(false);
    const [exam_cat, setExam_cat] = useState("");
    const [exam_sub, setExam_sub] = useState("");
    const [exam_sub_sub, setExam_sub_sub] = useState("");
    const [exam_title, setExam_title] = useState("");
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
    const [showerror, setShowError] = useState(false);
    const [selectedLevelArr, setSelectedLevelArr] = useState([]);
    const [categoryitems, setCategoryItems] = useState([]);
    const [subcategoryitems, setSubCategoryItems] = useState([]);
    const [automatic, setAutomaticRow] = useState([]);
    const [showprice, setShowPrice] = useState(false);
    const [paymentflag, setPaymentFlag] = useState("N");
    const [sellingprice, setSellingPrice] = useState("");
    const [offerprice, setOfferPrice] = useState("");
    const [basic, setBasic] = useState(false);
    const [submitDisabled, SetSubmitDisabled] = useState(false);
    const [alertText, SetAlertText] = useState('');
    const [ipaddr, setIpAddr] = useState("");
    const publicIp = require("public-ip");

    let { toggle, examtype, subcatdetails, examdetails, mode } = props;

    const handleRefresh = async () => {
        setLoader(true);
        let ip = await publicIp.v4();
        setIpAddr(ip);
        console.log(examdetails);
        console.log(mode);
        if (mode == "Edit") {
            console.log(examdetails.exam_name);
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
            var array = JSON.parse("[" + examdetails.exam_level + "]");
            let arrayselect = [];
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
            setQuestionType(examdetails.quest_type);
            setPosition(examdetails.exam_pos);
            setTestTypeId(examdetails.exam_type_id);
            const { data: typeslistres } = await examServices.getTestTypesEdit(subcatdetails.exa_cat_id);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>);
            }
            setTestTypes(typesListArr);
            const { data: chaplistres } = await examServices.getChaptersEdit(subcatdetails.exa_cat_id);
            const { category: chaplist } = chaplistres;
            let chapListArr = [];
            for (let chapter of chaplist) {
                chapListArr.push(<MenuItem value={chapter.chapt_id}>{chapter.chapter_name}</MenuItem>);
            }
            setChapterList(chapListArr);
            if (examdetails.exam_type_cat == "T") {
                setShowTestTypes(true);
            } else {
                setShowTestTypes(false);
            }
            if (examdetails.exam_type_cat == "C") {
                setShowChapterWise(true);
            } else {
                setShowChapterWise(false);
            }
            if (examdetails.exam_type_cat == "P") {
                setShowPreviousYear(true);
            } else {
                setShowPreviousYear(false);
            }
        } else {
            setExam_title("");
            const { data: typeslistres } = await examServices.getTestTypes(subcatdetails.exa_cat_id);
            const { category: typeslist } = typeslistres;
            let typesListArr = [];
            for (let type of typeslist) {
                typesListArr.push(<MenuItem value={type.extype_id}>{type.extest_type}</MenuItem>);
            }
            setTestTypes(typesListArr);
            const { data: chaplistres } = await examServices.getChapters(subcatdetails.exa_cat_id);
            const { category: chaplist } = chaplistres;
            let chapListArr = [];
            for (let chapter of chaplist) {
                chapListArr.push(<MenuItem value={chapter.chapt_id}>{chapter.chapter_name}</MenuItem>);
            }
            setChapterList(chapListArr);
        }
        setMode(examtype);
        setExam_cat(subcatdetails.exaid);
        setExam_sub(subcatdetails.exaid_sub);
        setExam_sub_sub(subcatdetails.exa_cat_id);
        const { data: chapres } = await examSubCategoryService.getExamSubCategoryChapters(
            subcatdetails.exa_cat_id
        );
        const { count: chapterCount } = chapres;
        const { data: typeres } = await examSubCategoryService.getExamSubCategoryType(
            subcatdetails.exa_cat_id
        );
        const { count: typeCount } = typeres;
        let prevData = { exam_cat: subcatdetails.exaid, exam_sub: subcatdetails.exaid_sub };
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
            prevyearArr.push(<MenuItem value={prev.exam_id}>{prev.exam_name}</MenuItem>);
        }
        setPreviousYearList(prevyearArr);
        setTimeout(() => {
            setLoader(false);
        }, 1000);
    };

    const valiadateProperty = (e) => {
        let { name, value, className } = e.currentTarget;
        const obj = { [name]: value };
        const filedSchema = { [name]: schema[name] };
        const { error } = Joi.validate(obj, filedSchema);

        let message = error ? error.details[0].message : null;
        setErrors({ ...errors, [name]: message, errordetails: null });

        if (error)
            e.currentTarget.className =
                className.replace(" is-valid", "").replace(" is-invalid", "") + " is-invalid";
        else
            e.currentTarget.className =
                className.replace(" is-valid", "").replace(" is-invalid", "") + " is-valid";
    };
    const schema = {
        ExamTitle: Joi.string().required(),
    };

    const onExamTitleChange = (name) => {
        let slug = name.replace(/ /g, "-").toLowerCase();
        setSlug(slug);
        setExam_title(name);
        errors["exam_title"] = "";
        errors["slug"] = "";
    };

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
        if (e.target.value == "T") {
            setShowTestTypes(true);
        } else {
            setShowTestTypes(false);
            setTestTypeId("");
        }
        if (e.target.value == "C") {
            setShowChapterWise(true);
        } else {
            setShowChapterWise(false);
            setTestTypeId("");
        }
        if (e.target.value == "P") {
            setShowPreviousYear(true);
        } else {
            setShowPreviousYear(false);
            setTestTypeId("");
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
            {
                rowsNo: 1,
                maincategoryId: "",
                subcategoryitems: [],
                subcategoryId: "",
                noofquest: "",
                addtype: true,
                deltype: false,
            },
        ]);
        setQuestionType(e.target.value);
        /*const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>);
        }
        setCategoryItems(itemArr);*/
        const { data: maincategoryres } = await qbankSubCategoryService.getAllQuestionSubCategoryOnly('Y');
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.cat_id}>{category.cat_name}</MenuItem>)
        }
        setCategoryItems(itemArr);
        const { subcategory: subcategoryres } = maincategoryres;
        setSubCategoryItems(subcategoryres);
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
    };

    const handleSubCategoryChange = async (event, index) => {
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].subcategoryId = event.target.value;
        setAutomaticRow(newArr); // ??
    };

    const handleTotQuestionsChange = (e) => {
        let total = 0;
        if (markperquestion) {
            total = e.target.value * markperquestion;
        } else {
            total = 0;
        }
        setTotalQuestions(e.target.value);
        setTotalMarks(total);
    };

    const handleMarksPerQuesChange = (e) => {
        let total = 0;
        if (totalquestions) {
            total = e.target.value * totalquestions;
        } else {
            total = 0;
        }
        setTotalMarks(total);
        setMarksPerQues(e.target.value);
    };

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
    };

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
    };

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
    };

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
    };

    const handleTestTypeChange = async (event, value) => {
        console.log(event.target.value);
        setTestTypeId(event.target.value);
        if (showpreviousyear) {
            const { data: examresponse } = await examServices.getExamDetailsById(event.target.value);
            const { Exam: details } = examresponse;
            console.log(details);
            /*setExam_title(details.exam_name);
            setSlug(details.exam_slug);
            setExamcode(details.exam_code);*/
            setTotalQuestions(details.tot_questions);
            setMarksPerQues(details.mark_perquest);
            setNegativeMarks(details.neg_markquest);
            setTotalMarks(details.tot_mark);
            setTotalMinutes(details.total_time);
            setAssignType(details.assign_test_type);
            setExamLevel(details.exam_level);
            var array = JSON.parse("[" + details.exam_level + "]");
            let arrayselect = [];
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
            setQuestionType(details.quest_type);
            setPosition(details.exam_pos);
        }
        setShowError(false);
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (paymentflag == 'Y') {
            if (offerprice === "") {
                errors["OfferPrice"] = "Selling Price Required";
                isValid = false;
            }
        }
        if (exam_title === "") {
            errors["exam_title"] = "Exam Title Required";
            isValid = false;
        }
        if (slug === "") {
            errors["slug"] = "Slug Required";
            isValid = false;
        }
        if (examcode === "") {
            errors["examcode"] = "Examcode Required";
            isValid = false;
        }
        if (totalquestions === "") {
            errors["totalquestions"] = "Totalquestions Required";
            isValid = false;
        }
        if (markperquestion === "") {
            errors["markperquestion"] = "Markperquestion Required";
            isValid = false;
        }
        if (negativemarks === "") {
            errors["negativemarks"] = "Negativemarks Required";
            isValid = false;
        }
        if (totalmarks === "") {
            errors["totalmarks"] = "totalmarks Required";
            isValid = false;
        }
        if (totalminutes === "") {
            errors["totalminutes"] = "Totalminutes Required";
            isValid = false;
        }
        if (position === "") {
            errors["position"] = "Position Required";
            isValid = false;
        }
        console.log(errors);
        setErrors(errors);
        return isValid;
    };

    const saveCommonExam = async () => {
        console.log(testtypeid);
        //try {
        if (validateForm()) {
            let data = {};
            data.exam_cat = exam_cat;
            data.exam_sub = exam_sub;
            data.exam_sub_sub = exam_sub_sub;
            data.exam_name = exam_title;
            data.exam_slug = slug;
            data.assign_test_type = assigntype;
            data.exam_type = examtype;
            data.exam_code = examcode;
            data.sect_cutoff = "N";
            data.sect_timing = "N";
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
            if (offerprice == '') {
                data.offer_price = 0;
            } else {
                data.offer_price = offerprice;
            }
            if (questionType == "AUTO") {
                data.automatic = automatic;
            } else {
                data.automatic = [];
            }
            data.ip_addr = ipaddr;
            console.log(data);
            const { data: saveres } = await examServices.saveCommonExam(data);
            const { message: saveresponse } = saveres;
            if (saveresponse != 'Exam Code already exists') {
                setAlertMessage("Exam added successfully!");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 1500);
                toggle(false);
            } else {
                setAlertMessage("Exam Code already exists");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 1500);
            }
        } else {
            setShowError(true);
        }
        /*} catch (ex) {
            console.log(ex.response);
            setAlertMessage("Something went wrong. Please try later");
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
        }*/
    };

    const updateCommonExam = async () => {
        try {
            let data = {};
            data.exam_cat = exam_cat;
            data.exam_sub = exam_sub;
            data.exam_sub_sub = exam_sub_sub;
            data.exam_name = exam_title;
            data.exam_slug = slug;
            data.assign_test_type = assigntype;
            data.exam_type = examtype;
            data.exam_code = examcode;
            data.sect_cutoff = "N";
            data.sect_timing = "N";
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
            data.exam_level = examlevel;
            data.payment_flag = paymentflag;
            if (sellingprice == '') {
                data.selling_price = 0;
            } else {
                data.selling_price = sellingprice;
            }
            if (offerprice == '') {
                data.offer_price = 0;
            } else {
                data.offer_price = offerprice;
            }
            data.ip_addr = ipaddr;
            console.log(data);
            await examServices.updateCommonExam(examdetails.exam_id, data);
            setAlertMessage("Exam updated successfully!");
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
            toggle(false);
        } catch (ex) {
            console.log(ex.response);
            setAlertMessage("Something went wrong. Please try later");
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
        }
    };

    const handleRequestClose = () => {
        setShowMessage(false);
    };

    useEffect(() => {
        async function fetchData() {
            await handleRefresh();
        }
        fetchData();
    }, []);

    const renderAutomaticTypes = () => {
        let rowNum = 1;
        return automatic.map((row, index) => {
            rowNum = rowNum + 1;
            const {
                rowsNo,
                noofquest,
                maincategoryId,
                subcategoryId,
                subcategoryitems,
                addtype,
                deltype,
            } = row; //destructuring
            return (
                <div className="row">
                    <FormControl
                        margin="normal"
                        style={{ marginLeft: "15px", marginRight: "15px" }}
                        className="col-lg-3 col-sm-6 col-12"
                    >
                        <InputLabel htmlFor="age-simple">Qbank Category</InputLabel>
                        <Select
                            onChange={(event, value) => {
                                handleMainCategoryChange(event, index);
                            }}
                            value={maincategoryId}
                        >
                            <MenuItem value={"M"}>--Master Category--</MenuItem>
                            {categoryitems}
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" className="col-lg-3 col-sm-6 col-12">
                        <InputLabel htmlFor="age-simple">Qbank Sub Category</InputLabel>
                        <Select
                            onChange={(event, value) => {
                                handleSubCategoryChange(event, index);
                            }}
                            value={subcategoryId}
                        >
                            {subcategoryitems}
                        </Select>
                    </FormControl>
                    <TextField
                        style={{ marginLeft: "15px" }}
                        autoComplete="off"
                        required
                        label={"No. of questions"}
                        onChange={(e) => onNoofQuestChange(e, index)}
                        value={noofquest}
                        margin="normal"
                    />
                    {addtype ? (
                        <IconButton onClick={() => addAutomaticRow(rowNum)} className="icon-btn">
                            <i className="zmdi zmdi-plus zmdi-hc-fw" />
                        </IconButton>
                    ) : (
                            <IconButton onClick={() => removeAutomaticRow(rowsNo)} className="icon-btn">
                                <i className="zmdi zmdi-delete zmdi-hc-fw" />
                            </IconButton>
                        )}
                </div>
            );
        });
    };

    const onConfirm = () => {
        setBasic(false);
    };

    const addAutomaticRow = (index) => {
        let nextRow = {
            rowsNo: index,
            maincategoryId: "",
            subcategoryitems: [],
            subcategoryId: "",
            noofquest: "",
            addtype: false,
            deltype: true,
        };
        setAutomaticRow((state) => [...state, nextRow]);
    };

    const removeAutomaticRow = (index) => {
        setAutomaticRow(automatic.filter((item) => item.rowsNo !== index));
    };

    const onNoofQuestChange = (e, index) => {
        let newArr = [...automatic]; // copying the old datas array
        newArr[index].noofquest = e.target.value; // replace e.target.value with whatever you want to change it to
        let totQuest = 0;
        for (var i = 0; i < automatic.length; i++) {
            if (newArr[i].noofquest != '') {
                totQuest = parseInt(totQuest) + parseInt(newArr[i].noofquest);
            }
        }
        if (totQuest > totalquestions) {
            setBasic(true);
            SetSubmitDisabled(true);
            SetAlertText('No. of Questions greater than Total questions');
        } else {
            SetSubmitDisabled(false);
        }
        setAutomaticRow(newArr); // ??
    };

    return (
        <div className="row no-gutters">
            {loader && (
                <div className="loader-view w-100" style={{ height: "calc(100vh - 120px)" }}>
                    <CircularProgress />
                </div>
            )}
            {!loader && (
                <div className="row no-gutters">
                    {mode == "Add" ? (
                        <div style={{ padding: "1%" }} className="col-lg-11 d-flex flex-column order-lg-1">
                            <h1>Add Exam</h1>
                        </div>
                    ) : (
                            <div style={{ padding: "1%" }} className="col-lg-11 d-flex flex-column order-lg-1">
                                <h1>Update Exam</h1>
                            </div>
                        )}
                    <div style={{ padding: "1%" }} className="col-lg-12 d-flex flex-column order-lg-1">
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
                    <div style={{ padding: "1%" }} className="col-lg-12 d-flex flex-column order-lg-1">
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
                                            error={errors && errors.SellingPrice}
                                            helperText={errors.SellingPrice}
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
                                            error={errors && errors.OfferPrice}
                                            helperText={errors.OfferPrice}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                        <TextField
                            required
                            autoComplete="off"
                            id="Exam Title"
                            label={"Exam Title"}
                            name={"ExamTitle"}
                            onChange={(event) => onExamTitleChange(event.target.value)}
                            value={exam_title}
                            margin="none"
                            error={errors && errors.exam_title}
                            helperText={errors.exam_title}
                        />

                        <TextField
                            autoComplete="off"
                            required
                            id="Exam Slug"
                            label={"Exam Slug"}
                            onChange={(event) => setSlug(event.target.value)}
                            value={slug}
                            margin="normal"
                            error={errors && errors.slug}
                            helperText={errors.slug}
                        />
                        <TextField
                            autoComplete="off"
                            required
                            id="required"
                            label={"Exam Code"}
                            onChange={(event) => setExamcode(event.target.value)}
                            value={examcode}
                            margin="normal"
                            error={errors && errors.examcode}
                            helperText={errors.examcode}
                        />
                    </div>
                    <div style={{ padding: "1%" }} className="col-lg-12 d-flex flex-column order-lg-1">
                        <h3>Question And Mark Details</h3>
                        <TextField
                            autoComplete="off"
                            required
                            label={"Total Questions"}
                            onChange={(event) => handleTotQuestionsChange(event)}
                            value={totalquestions}
                            margin="none"
                            error={errors && errors.totalquestions}
                            helperText={errors.totalquestions}
                        />
                        <TextField
                            autoComplete="off"
                            required
                            label={"Mark Per Questions"}
                            onChange={(event) => handleMarksPerQuesChange(event)}
                            value={markperquestion}
                            margin="normal"
                            error={errors && errors.markperquestion}
                            helperText={errors.markperquestion}
                        />
                        <TextField
                            autoComplete="off"
                            required
                            label={"Negative Mark Per Question"}
                            onChange={(event) => setNegativeMarks(event.target.value)}
                            value={negativemarks}
                            margin="normal"
                            error={errors && errors.negativemarks}
                            helperText={errors.negativemarks}
                        />
                        <TextField
                            autoComplete="off"
                            required
                            label={"Total Marks"}
                            value={totalmarks}
                            margin="normal"
                            error={errors && errors.totalmarks}
                            helperText={errors.totalmarks}
                        />
                        <TextField
                            autoComplete="off"
                            required
                            label={"Total Time (In Minutes)"}
                            onChange={(event) => setTotalMinutes(event.target.value)}
                            value={totalminutes}
                            margin="normal"
                            error={errors && errors.totalminutes}
                            helperText={errors.totalminutes}
                        />
                    </div>
                    <div style={{ padding: "1%" }} className="col-lg-12 d-flex flex-column order-lg-1">
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
                                <FormControlLabel
                                    value="D"
                                    control={<Radio color="primary" />}
                                    label="Direct Test"
                                />
                                <FormControlLabel
                                    value="M"
                                    control={<Radio color="primary" />}
                                    label="Multiple Test"
                                />
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
                                {showTypeOpt && (
                                    <FormControlLabel
                                        value="T"
                                        control={<Radio color="primary" />}
                                        label="Added Exam Types"
                                    />
                                )}
                                {showChapterOpt && (
                                    <FormControlLabel
                                        value="C"
                                        control={<Radio color="primary" />}
                                        label="Chapter Wise"
                                    />
                                )}
                                {showPrevOpt && (
                                    <FormControlLabel
                                        value="P"
                                        control={<Radio color="primary" />}
                                        label="Previous Year"
                                    />
                                )}
                            </RadioGroup>
                        </FormControl>
                        {showtesttypes && (
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Test Types</InputLabel>
                                <Select
                                    onChange={(event, value) => {
                                        handleTestTypeChange(event, value);
                                    }}
                                    value={testtypeid}
                                >
                                    {/*<MenuItem value={"0"}>Select</MenuItem>*/}
                                    {testtypes}
                                </Select>
                            </FormControl>
                        )}
                        {showchapterwise && (
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Chapter Wise Exam</InputLabel>
                                <Select
                                    onChange={(event, value) => {
                                        handleTestTypeChange(event, value);
                                    }}
                                    value={testtypeid}
                                >
                                    {/*<MenuItem value={"0"}>Select</MenuItem>*/}
                                    {chapterlist}
                                </Select>
                            </FormControl>
                        )}
                        {showpreviousyear && (
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Previous Year</InputLabel>
                                <Select
                                    onChange={(event, value) => {
                                        handleTestTypeChange(event, value);
                                    }}
                                    value={testtypeid}
                                >
                                    {/*<MenuItem value={"0"}>Select</MenuItem>*/}
                                    {previousyearlist}
                                </Select>
                            </FormControl>
                        )}
                        {showerror && showerror.testtypeid && (
                            <div style={{ color: "red" }}>Please select</div>
                        )}
                        <FormHelperText className="text-grey">Difficulty Level</FormHelperText>
                        <FormGroup className="d-flex flex-row">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={level1}
                                        onChange={(e) => handleLevel1Change(e)}
                                        value={"1"}
                                    />
                                }
                                label="Level 1"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={level2}
                                        onChange={(e) => handleLevel2Change(e)}
                                        value={"2"}
                                    />
                                }
                                label="Level 2"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={level3}
                                        onChange={(e) => handleLevel3Change(e)}
                                        value={"3"}
                                    />
                                }
                                label="Level 3"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={level4}
                                        onChange={(e) => handleLevel4Change(e)}
                                        value={"4"}
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
                                <FormControlLabel
                                    value="MANU"
                                    control={<Radio color="primary" />}
                                    label="Manual"
                                />
                                <FormControlLabel
                                    value="AUTO"
                                    control={<Radio color="primary" />}
                                    label="Automatic"
                                />
                            </RadioGroup>
                        </FormControl>
                        {questionType == "AUTO" && renderAutomaticTypes()}
                        <TextField
                            autoComplete="off"
                            required
                            label={"Position"}
                            onChange={(event) => setPosition(event.target.value)}
                            value={position}
                            margin="normal"
                            error={errors && errors.position}
                            helperText={errors.position}
                        />
                        {mode == "Add" ? (
                            <div
                                style={{ paddingTop: "2%", textAlign: "right" }}
                                className="col-lg-6 col-sm-6 col-12"
                            >
                                <Button
                                    disabled={submitDisabled}
                                    onClick={() => saveCommonExam()}
                                    variant="contained"
                                    color="primary"
                                    className="jr-btn text-white"
                                >
                                    Submit
                                </Button>
                            </div>
                        ) : (
                                <div
                                    style={{ paddingTop: "2%", textAlign: "right" }}
                                    className="col-lg-6 col-sm-6 col-12"
                                >
                                    <Button
                                        onClick={() => updateCommonExam()}
                                        variant="contained"
                                        color="primary"
                                        className="jr-btn text-white"
                                    >
                                        Update
                                </Button>
                                </div>
                            )}
                    </div>
                    <Snackbar
                        className="mb-3 bg-info"
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={showMessage}
                        autoHideDuration={3000}
                        onClose={() => handleRequestClose}
                        ContentProps={{
                            "aria-describedby": "message-id",
                        }}
                        message={alertMessage}
                    />
                    <SweetAlert show={basic} title={alertText}
                        onConfirm={onConfirm} />
                </div>
            )}
        </div>
    );
};

export default AddEditExam;
