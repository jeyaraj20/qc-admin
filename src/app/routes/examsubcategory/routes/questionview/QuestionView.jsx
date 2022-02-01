import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { questionImageDir } from "../../../../../config";
import  auth from '../../../../../services/authService';
import { schoolquestionImageDir } from "../../../../../config";
import * as questionService from '../../../../../services/questionService';
import CircularProgress from '@material-ui/core/CircularProgress';

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();


const QuestionView = (props) => {
    const [question, setQuestion] = useState();
    const [examdetails, setExamDetails] = useState({});
    const [opt1, setOpt1] = useState();
    const [opt2, setOpt2] = useState();
    const [opt3, setOpt3] = useState();
    const [opt4, setOpt4] = useState();
    const [opt5, setOpt5] = useState();
    const [loader, setLoader] = useState(true);
    let user = auth.getCurrentUser();
    let questionImageDirfinal=questionImageDir;
    if (user.user.logintype != 'G'){
     questionImageDirfinal=schoolquestionImageDir;
    }

    const handleRefresh = async () => {
        setLoader(true);
        let qid = localStorage.getItem('qid');
        const { data: examdetailsdata } = await questionService.getQuestionById(qid);
        setExamDetails(examdetailsdata.question);
        let examdetail=examdetailsdata.question;
        let mainquestion;
        let opt1;
        let opt2;
        let opt3;
        let opt4;
        let opt5;


        if (examdetail.q_type === 'I') {
            mainquestion = <img alt={examdetail.question}
                src={questionImageDirfinal + '/' + examdetail.question}
                
            />
        } else {
            mainquestion = <div dangerouslySetInnerHTML={{ __html: entities.decode(examdetail.question) }}></div>
        }
        if (examdetails.opt_type1 === 'I') {
            opt1 = <img alt={examdetail.opt_1}
                src={questionImageDirfinal + '/' + examdetail.opt_1}
                style={{ width: '100px', height: '100px' }}
            />
        } else {
            opt1 = <div dangerouslySetInnerHTML={{ __html: entities.decode(examdetail.opt_1) }}></div>
        }
        if (examdetail.opt_type2 === 'I') {
            opt2 = <img alt={examdetail.opt_2}
                src={questionImageDirfinal + '/' + examdetail.opt_2}
                style={{ width: '100px', height: '100px' }}
            />
        } else {
            opt2 = <div dangerouslySetInnerHTML={{ __html: entities.decode(examdetail.opt_2) }}></div>
        }
        if (examdetail.opt_type3 === 'I') {
            opt3 = <img alt={examdetail.opt_3}
                src={questionImageDirfinal + '/' + examdetail.opt_3}
                style={{ width: '100px', height: '100px' }}
            />
        } else {
            opt3 = <div dangerouslySetInnerHTML={{ __html: entities.decode(examdetail.opt_3) }}></div>
        }
        if (examdetail.opt_type4 === 'I') {
            opt4 = <img alt={examdetail.opt_4}
                src={questionImageDirfinal + '/' + examdetail.opt_4}
                style={{ width: '100px', height: '100px' }}
            />
        } else {
            opt4 = <div dangerouslySetInnerHTML={{ __html: entities.decode(examdetail.opt_4) }}></div>
        }
        if (examdetail.opt_type5 === 'I') {
            opt5 = <img alt={examdetail.opt_5}
                src={questionImageDirfinal + '/' + examdetail.opt_5}
                style={{ width: '100px', height: '100px' }}
            />
        } else {
            opt5 = <div dangerouslySetInnerHTML={{ __html: entities.decode(examdetail.opt_5) }}></div>
        }
        setOpt1(opt1);
        setOpt2(opt2);
        setOpt3(opt3);
        setOpt4(opt4);
        setOpt5(opt5);
        setQuestion(mainquestion);
        console.log(mainquestion);
        setLoader(false);
    }

    const handleClose = () => {
        window.close();
    }

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])

    return (
        <div className="jr-card p-0">
            <div style={{ padding: '0.5rem !important' }} className="jr-card-header card-img-top mb-0 p-4 bg-grey lighten-4">
                <div className="row no-gutters">
                    <div className="col-lg-11 d-flex flex-column order-lg-1">
                        <h3 className="card-heading">View Exams For (Question Cloud-php-M-Question Cloud-php-C-)</h3>
                    </div>
                    <div className="col-lg-1 d-flex flex-column order-lg-1">
                        <Button onClick={() => handleClose()} variant="contained" color="primary" className="jr-btn">
                            <i className="zmdi zmdi-close zmdi-hc-fw" />
                            <span>Close</span>
                        </Button>
                    </div>
                </div>
            </div>


            {loader &&
                <div className="loader-view w-100"
                    style={{ height: 'calc(100vh - 120px)' }}>
                    <CircularProgress />
                </div>
            }
            {!loader &&
            <div className="card-body">
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Question Id :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.question_code}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Question Type :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.q_type === 'T' ? 'Text' : 'Image'}
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
                        {examdetails.quest_desc}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Option Type 1 :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.opt_type1 === 'T' ? 'Text' : 'Image'}
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
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Option Type 2 :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.opt_type2 === 'T' ? 'Text' : 'Image'}
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
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Option Type 3 :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.opt_type3 === 'T' ? 'Text' : 'Image'}
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
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Option Type 4 :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.opt_type4 === 'T' ? 'Text' : 'Image'}
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
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Option Type 5 :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.opt_type5 === 'T' ? 'Text' : 'Image'}
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
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Correct Answer :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.crt_ans}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Difficulty Level :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.quest_level}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Date :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.quest_date}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Status :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {examdetails.quest_status === 'Y' ? 'Active' : 'Inactive'}
                    </div>
                </div>

            </div>
            }
        </div>

    )
};

export default QuestionView;
