import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useDropzone } from 'react-dropzone';
import Joi from 'joi-browser';
import Moment from "moment";
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import * as studentService from '../../../../../../services/studentService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import auth from '../../../../../../services/authService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

const BulkUpload = (props) => {
    const [data, setData] = useState([])
    const [studentsrows, setStudentsrows] = useState([]);
    const [loader, setLoader] = useState(false);
    const [categoryitems, setCategoryItems] = useState([]);
    const [files, setFiles] = useState([]);
    const [showDatatable, setShowDatatable] = useState(false);
    const [mainCategoryId, setMainCategoryId] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showFileName, setShowFileName] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [schoolId, setSchoolId] = useState('');
    const [ipaddr, setIpAddr] = useState('');
    const publicIp = require('public-ip');

    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: window.webkitURL.createObjectURL(file)
            })));
            setShowFileName(true);
        }
    });

    const thumbs = acceptedFiles.map(file => (
        <div style={{ marginLeft: '10%' }} key={file.path}>
            {file.path}
        </div>
    ));


    const columns = [
        {
            label: 'S.No',
            field: 'sno',
            width: 5,
        },
        {
            label: 'Register Number',
            field: 'RegisterNo',
            width: 100,
        },
        {
            label: 'First Name',
            field: 'FirstName',
            width: 100,
        },
        {
            label: 'Last Name',
            field: 'LastName',
            width: 5,
        },
        {
            label: 'Mobile',
            field: 'Mobile',
            width: 5,
        },
        {
            label: 'Email',
            field: 'Email',
            width: 5,
        },
        {
            label: 'Gender',
            field: 'Gender',
            width: 5,
        }
    ]

    const handleRefresh = async () => {
        setLoader(true);
        let ip = await publicIp.v4();
        setIpAddr(ip);
        let user = auth.getCurrentUser();
        setSchoolId(user.user.schoolid);
        const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
        const { category: categories } = maincategoryres;
        let itemArr = [];
        for (let category of categories) {
            itemArr.push(<MenuItem value={category.exa_cat_id}>{category.exa_cat_name}</MenuItem>)
        }
        setCategoryItems(itemArr);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    const handleMainCategoryChange = (event, value) => {
        console.log(event.target.value);
        setMainCategoryId(event.target.value);
    }

    useEffect(() => {
        if (data && data.length)
            mapRows(data);
    }, [data])

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])


    let rowcount = 0;
    const mapRows = (rows) => {
        let rowFields = []// fields in required order
        columns.forEach(column => rowFields.push(column.field))

        let studrows = rows.map((obj, index) => {

            let checkedflg = false;
            if (obj.stud_status === "1")
                checkedflg = true;

            let row = {};
            rowcount = rowcount + 1;
            for (let fieldName of rowFields)
                row[fieldName] = obj[fieldName] // fetching required fields in req order
            row.sno = <span>{rowcount}</span>
            //row.stud_date = Moment(obj.stud_date).format('DD-MM-YYYY')
            return row;
        })
        setStudentsrows(studrows);
    }

    const handleImport = async () => {
        console.log(files[0]);
        console.log(ipaddr);
        const formData = new FormData();
        formData.append("excel", files[0]);
        const { data: excelres } = await studentService.readBulkStudents(formData);
        const { xlData: exceldata } = excelres;
        setData(exceldata);
        console.log(exceldata);
        setShowDatatable(true);
    }

    const uploadBulkStudents = async () => {
        let uploadObj = {};
        uploadObj.ipaddress = ipaddr;
        uploadObj.students = data;
        uploadObj.school_id = schoolId;
        uploadObj.category_id = mainCategoryId;
        console.log(uploadObj);
        await studentService.uploadBulkStudents(uploadObj);
        setAlertMessage('Students Uploaded Successfully');
        setShowMessage(true);
        setFiles([]);
        setShowDatatable(false);
        setMainCategoryId('');
        setShowFileName(false);
        setLoader(true);
        setTimeout(() => {
            setShowMessage(false)
            setLoader(false);
        }, 1500);
    }

    return (
        <div className="col-12">
            {loader &&
                <div className="loader-view w-100"
                    style={{ height: 'calc(100vh - 120px)' }}>
                    <CircularProgress />
                </div>
            }
            {!loader &&
                <div>
                    <form className="row" autoComplete="off">
                        <div className="col-lg-3 col-sm-6 col-12">
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="age-simple">Main Category</InputLabel>
                                <Select onChange={(event, value) => {
                                    handleMainCategoryChange(event, value)
                                }} value={mainCategoryId} >
                                    {categoryitems}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-12">
                            <div className="dropzone-card">
                                <div className="dropzone">
                                    <div>
                                        <input {...getInputProps()} />
                                    </div>
                                    <button className="btn btn-primary" type="button" onClick={open}>
                                        <i className="zmdi zmdi-open-in-browser zmdi-hc-fw" />
                                        <span>Browse</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {showFileName &&
                            <div style={{ paddingTop: '2%' }} className="col-lg-3 col-sm-6 col-12">
                                {thumbs}
                            </div>
                        }
                        <div style={{ paddingTop: '2%' }} className="col-lg-2 col-sm-6 col-12">
                            <Button onClick={() => handleImport()} variant="contained" color="primary" className="jr-btn">
                                <i className="zmdi zmdi-flash zmdi-hc-fw" />
                                <span>Import</span>
                            </Button>
                        </div>
                    </form>
                    {showDatatable &&
                        <>
                            <MDBDataTable
                                striped
                                bordered
                                entriesOptions={[ 5, 10, 20, 25, 50, 100, 1000 ]}
                                entries={5}
                                hover
                                data={{ rows: studentsrows, columns }}
                                small
                                responsive
                                noBottomColumns
                                disableRetreatAfterSorting={true}
                            />
                            <div style={{ textAlign: 'center', paddingBottom: '2%' }} className="col-lg-12 col-sm-6 col-12">
                                <Button onClick={() => uploadBulkStudents()} variant="contained" color="primary" className="jr-btn">
                                    <i className="zmdi zmdi-upload zmdi-hc-fw" />
                                    <span>Upload</span>
                                </Button>
                            </div>
                        </>
                    }
                </div>
            }
            <Snackbar
                className="mb-3 bg-info"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={showMessage}
                message={alertMessage}
            />
        </div>
    );
};

export default BulkUpload;