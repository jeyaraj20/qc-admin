import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

const ExamView = (props) => {

    const handleRefresh = async () => {
        console.log(localStorage);
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
                        <h3 className="card-heading">Exam Details</h3>
                    </div>
                    <div className="col-lg-1 d-flex flex-column order-lg-1">
                        <Button onClick={() => handleClose()} variant="contained" color="primary" className="jr-btn">
                            <i className="zmdi zmdi-close zmdi-hc-fw" />
                            <span>Close</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Exam Title :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_name')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Exam Slug :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_slug')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Exam Code :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_code')}
                    </div>
                </div>
                <div style={{ padding: '0.5rem !important' }} className="jr-card-header card-img-top mb-0 p-4 bg-grey lighten-4">
                    <div className="row no-gutters">
                        <div className="col-lg-11 d-flex flex-column order-lg-1">
                            <h3 className="card-heading">Question And Mark Details</h3>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Total Questions :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('tot_questions')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Mark Per Question :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('mark_perquest')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Total Marks :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('tot_mark')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Negative Mark Per Ques :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('neg_markquest')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Total Time (In Minutes) :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('total_time')}
                    </div>
                </div>
                <div style={{ padding: '0.5rem !important' }} className="jr-card-header card-img-top mb-0 p-4 bg-grey lighten-4">
                    <div className="row no-gutters">
                        <div className="col-lg-11 d-flex flex-column order-lg-1">
                            <h3 className="card-heading">Exam Settings</h3>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Exam Type :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_type_cat')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Exam Type Category :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_type_id')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Difficulty Level :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_level')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Date :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_date')}
                    </div>
                </div>
                <div className="row no-gutters">
                    <div style={{ padding: '1%', textAlign: 'right' }} className="col-lg-3 d-flex flex-column order-lg-1">
                        <h4>Status :</h4>
                    </div>
                    <div style={{ padding: '1%', textAlign: 'left' }} className="col-lg-4 d-flex flex-column order-lg-1">
                        {localStorage.getItem('exam_status')}
                    </div>
                </div>
            </div>
        </div>

    )
};

export default ExamView;
