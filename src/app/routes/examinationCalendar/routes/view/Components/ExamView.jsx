import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CardBox from "components/CardBox/index";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { questionImageDir, schoolquestionImageDir } from "../../../../../../config";
import auth from '../../../../../../services/authService';
import * as questionService from '../../../../../../services/questionService';
import CircularProgress from '@material-ui/core/CircularProgress';

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

const ExamView = (props) => {
    const [question, setQuestion] = useState();
    const [opt1, setOpt1] = useState();
    const [opt2, setOpt2] = useState();
    const [opt3, setOpt3] = useState();
    const [opt4, setOpt4] = useState();
    const [opt5, setOpt5] = useState();
    const [questiondata, setQuestionData] = useState();
    const [loader, setLoader] = useState(true);
    const [examview, setExamview] = useState(false);
    const [view, setview] = useState(false);
    let { toggleview, categoryId, subcategoryId, qid, mode } = props;

    const handleRefresh = async () => {
        console.log(mode);
        setLoader(true);
        const { data: questdetail } = await questionService.getQuestionById(qid);
        setQuestionData(questdetail.question);
        let questiondatadetail = questdetail.question;

        let user = auth.getCurrentUser();
        let questionImageDirfinal = questionImageDir;
        if (user.user.logintype != 'G') {
            questionImageDirfinal = schoolquestionImageDir;
        }

        if (mode === 'Examview') {
            setExamview(true);
            setview(false);
        } else {
            setExamview(false);
            setview(true);
        }
        let mainquestion;
        let opt1;
        let opt2;
        let opt3;
        let opt4;
        let opt5;
        if (questiondatadetail.q_type === 'I') {
            mainquestion = <img alt={questiondatadetail.question}
                src={questionImageDirfinal + '/' + questiondatadetail.question}
            />
        } else {
            let questionvalue = entities.decode(questiondatadetail.question);
            mainquestion = <div dangerouslySetInnerHTML={{ __html: questionvalue }}></div>
        }
        if (questiondatadetail.opt_1) {
            if (questiondatadetail.opt_type1 === 'I') {
                opt1 = <img alt={questiondatadetail.opt_1}
                    src={questionImageDirfinal + '/' + questiondatadetail.opt_1}
                    style={{ width: '100px', height: '100px' }}
                />
                setOpt1(opt1);
            } else {
                opt1 = <div dangerouslySetInnerHTML={{ __html: entities.decode(questiondatadetail.opt_1) }}></div>
                setOpt1(opt1);
            }
        }
        if (questiondatadetail.opt_2) {
            if (questiondatadetail.opt_type2 === 'I') {
                opt2 = <img alt={questiondatadetail.opt_2}
                    src={questionImageDirfinal + '/' + questiondatadetail.opt_2}
                    style={{ width: '100px', height: '100px' }}
                />
                setOpt2(opt2);
            } else {
                opt2 = <div dangerouslySetInnerHTML={{ __html: entities.decode(questiondatadetail.opt_2) }}></div>
                setOpt2(opt2);
            }
        }
        if (questiondatadetail.opt_3) {
            if (questiondatadetail.opt_type3 === 'I') {
                opt3 = <img alt={questiondatadetail.opt_3}
                    src={questionImageDirfinal + '/' + questiondatadetail.opt_3}
                    style={{ width: '100px', height: '100px' }}
                />
                setOpt3(opt3);
            } else {
                opt3 = <div dangerouslySetInnerHTML={{ __html: entities.decode(questiondatadetail.opt_3) }}></div>
                setOpt3(opt3);
            }
        }
        if (questiondatadetail.opt_4) {
            if (questiondatadetail.opt_type4 === 'I') {
                opt4 = <img alt={questiondatadetail.opt_4}
                    src={questionImageDirfinal + '/' + questiondatadetail.opt_4}
                    style={{ width: '100px', height: '100px' }}
                />
                setOpt4(opt4);
            } else {
                opt4 = <div dangerouslySetInnerHTML={{ __html: entities.decode(questiondatadetail.opt_4) }}></div>
                console.log(questiondatadetail.opt_4)
                setOpt4(opt4);
            }
        }
        if (questiondatadetail.opt_5) {
            if (questiondatadetail.opt_type5 === 'I') {
                opt5 = <img alt={questiondatadetail.opt_5}
                    src={questionImageDirfinal + '/' + questiondatadetail.opt_5}
                    style={{ width: '100px', height: '100px' }}
                />
                setOpt5(opt5);
            } else {
                opt5 = <div dangerouslySetInnerHTML={{ __html: entities.decode(questiondatadetail.opt_5) }}></div>
                setOpt5(opt5);
            }
        }
        setQuestion(mainquestion);
        setLoader(false);
    }

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])

    return (
        <>
            {examview &&
                <div className="row no-gutters">
                    <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                        <h1>Exam View</h1>
                    </div>
                    <div style={{ padding: '1%' }} className="col-lg-1 d-flex flex-column order-lg-1">
                        <Button onClick={() => toggleview(false)} variant="contained" color="primary" className="jr-btn">
                            <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                            <span>Back</span>
                        </Button>
                    </div>
                    <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                        <h2>{question}</h2>
                        <h4>{questiondata.quest_desc}</h4>
                    </div>
                    <Divider light />
                    <div className="col-lg-12 d-flex flex-column order-lg-1">
                        <List>
                            <ListItem>
                                <FormControl component="fieldset" required>
                                    <FormLabel component="legend">Question Type</FormLabel>
                                    <RadioGroup
                                        className="d-flex flex-column"
                                        aria-label="questiontype"
                                        name="questiontype"
                                    //value={questionType}
                                    //onChange={(e) => handleQuestionType(e, 'question')}
                                    >
                                        {opt1 && <FormControlLabel value={questiondata.opt_1} control={<Radio color="primary" />} label={opt1} />}
                                        {opt2 && <FormControlLabel value={questiondata.opt_2} control={<Radio color="primary" />} label={opt2} />}
                                        {opt3 && <FormControlLabel value={questiondata.opt_3} control={<Radio color="primary" />} label={opt3} />}
                                        {opt4 && <FormControlLabel value={questiondata.opt_4} control={<Radio color="primary" />} label={opt4} />}
                                        {opt5 && <FormControlLabel value={questiondata.opt_5} control={<Radio color="primary" />} label={opt5} />}
                                    </RadioGroup>
                                </FormControl>
                            </ListItem>
                        </List>
                    </div>
                </div>
            }
            {view &&
                <>
                    <div className="row no-gutters">
                        <div style={{ padding: '1%' }} className="col-lg-11 d-flex flex-column order-lg-1">
                            <h1>View</h1>
                        </div>
                        <div style={{ padding: '1%' }} className="col-lg-1 d-flex flex-column order-lg-1">
                            <Button onClick={() => toggleview(false)} variant="contained" color="primary" className="jr-btn">
                                <i className="zmdi zmdi-chevron-left zmdi-hc-fw" />
                                <span>Back</span>
                            </Button>
                        </div>
                    </div>
                    {loader &&
                        <div className="loader-view w-100"
                            style={{ height: 'calc(100vh - 120px)' }}>
                            <CircularProgress />
                        </div>
                    }
                    {!loader &&
                        <div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Question Id :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.question_code}
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Question Type :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.q_type === 'T' ? 'Text' : 'Image'}
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Question :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {question}
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Question Description :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.quest_desc}
                                </div>
                            </div>
                            {opt1 &&
                                <>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option Type 1 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {questiondata.opt_type1 === 'T' ? 'Text' : 'Image'}
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option 1 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {opt1}
                                        </div>
                                    </div>
                                </>
                            }
                            {opt2 &&
                                <>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option Type 2 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {questiondata.opt_type2 === 'T' ? 'Text' : 'Image'}
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option 2 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {opt2}
                                        </div>
                                    </div>
                                </>
                            }
                            {opt3 &&
                                <>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option Type 3 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {questiondata.opt_type3 === 'T' ? 'Text' : 'Image'}
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option 3 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {opt3}
                                        </div>
                                    </div>
                                </>
                            }
                            {opt4 &&
                                <>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option Type 4 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {questiondata.opt_type4 === 'T' ? 'Text' : 'Image'}
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option 4 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {opt4}
                                        </div>
                                    </div>
                                </>
                            }
                            {opt5 &&
                                <>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option Type 5 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {questiondata.opt_type5 === 'T' ? 'Text' : 'Image'}
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                            <h4>Option 5 :</h4>
                                        </div>
                                        <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                            {opt5}
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Correct Answer :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.crt_ans}
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Difficulty Level :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.quest_level}
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Date :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.quest_date}
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                                    <h4>Status :</h4>
                                </div>
                                <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                                    {questiondata.quest_status === 'Y' ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </div>
                    }

                </>
            }
        </>
    )
};

export default ExamView;
