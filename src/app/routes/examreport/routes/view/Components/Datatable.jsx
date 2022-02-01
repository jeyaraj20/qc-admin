import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import TextField from '@material-ui/core/TextField';
import * as examSubCategoryService from '../../../../../../services/examSubCategoryService';
import * as exammainCategoryService from '../../../../../../services/exammainCategoryService';
import * as examServices from '../../../../../../services/examServices';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactExport from "react-data-export";
import moment from "moment";
import { DatePicker } from '@material-ui/pickers';
import _ from 'underscore';

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [studrows, setStudrows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showOverall, setShowoverall] = useState(false);
  const [examReport, setExamReport] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [allSubCategoryList, setAllSubCategoryList] = useState([]);
  const [allTopicList, setAllTopicList] = useState([]);
  const [allTestList, setAllTestList] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTest, setSelectedTest] = useState('');

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Student Name',
      field: 'studentName',
    },
    {
      label: 'Class',
      field: 'mainCategory',
    },
    {
      label: 'Exam',
      field: 'exam',
      width: 70,
    },
    {
      label: 'Total Question',
      field: 'tot_quest',
      width: 70,
    },
    {
      label: 'Total Answered Question',
      field: 'totalAnswered',
      width: 70,
    },
    {
      label: 'Total Mark',
      field: 'total_mark',
      width: 70,
    },
    {
      label: 'Time Taken (Minutes)',
      field: 'timeTaken',
      width: 50,
    },
  ]

  const handleRefresh = async () => {
    setLoader(true);
    const { data: maincategoryres } = await exammainCategoryService.getExamMainCategory();
    const { category: categories } = maincategoryres;
    setCategoryList(categories);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  useEffect(() => {
    mapRows(examReport);
  }, [examReport])

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
      obj.sno = index+1;
      obj.studentName = obj.stud_fname+' '+obj.stud_lname;
      obj.exam = obj.subCategory+' >> '+obj.chapter_name;
      obj.totalAnswered = obj.tot_quest - obj.not_answered;
      obj.timeTaken = Math.round((new Date(obj.end_time).getTime() - new Date(obj.start_time).getTime()) /1000/60 )
      return obj;
    })
    setStudrows(studrows);
  }

  const handleCategoryChange = async (id) =>{
    const { data: subcategoryres } = await exammainCategoryService.getExamSubCategoryById(id.target.value);
    const { category: categories } = subcategoryres;
    setAllSubCategoryList(categories);
    setSelectedCategory(id.target.value);
  }

  const handleSubCategoryChange = async (id) =>{
    const { data: activeres } = await examSubCategoryService.getAllExamSubCategory('Y');
    const { category: activedata } = activeres;
    let topic = activedata.filter( a => a.exaid === selectedCategory && a.exaid_sub === id.target.value );
    setAllTopicList(topic);
    setSelectedSubCategory(id.target.value);
  }

  const handleTopicChange = async (id) =>{
    const { data: chapres } = await examSubCategoryService.getExamSubCategoryChapters(id.target.value);
    const { chapterrows: chapterRow } = chapres;
    setAllTestList(chapterRow);
    setSelectedTopic(id.target.value);
  }

  const handleTestChange = async (id) =>{
    setSelectedTest(id.target.value);
  }

  const search = async () =>{
    const { data: examReport } = await examServices.getExamResultReport();
    setExamReport(examReport.res);
    setShowoverall(true);
  }

  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        {/* <h2 className="title mb-3 mb-sm-0">Exam Report</h2> */}
      </div>
      <div className="col-12">
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {!loader &&
          <div class="jr-card">
            <div class="jr-card-body ">
              <div class="row">
                <div class="col-lg-3" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Class</InputLabel>
                    <Select
                      labelId="demo-mutiple-name-label"
                      id="demo-mutiple-name"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                        <MenuItem key={'all'} value={'all'}>
                          {'All'}
                        </MenuItem>
                      {categoryList.map((cat) => (
                        <MenuItem key={cat.exa_cat_id} value={cat.exa_cat_id}>
                          {cat.exa_cat_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-3" style={{ "margin": "0px" }}>
                <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Subject</InputLabel>
                    <Select
                      labelId="demo-mutiple-name-label"
                      id="demo-mutiple-name"
                      value={selectedSubCategory}
                      onChange={handleSubCategoryChange}
                    >
                        <MenuItem key={'all'} value={'all'}>
                          {'All'}
                        </MenuItem>
                      {allSubCategoryList.map((cat) => (
                        <MenuItem key={cat.exa_cat_id} value={cat.exa_cat_id}>
                          {cat.exa_cat_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-3" style={{ "margin": "0px" }}>
                <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Topic</InputLabel>
                    <Select
                      labelId="demo-mutiple-name-label"
                      id="demo-mutiple-name"
                      value={selectedTopic}
                      onChange={handleTopicChange}
                    >
                        <MenuItem key={'all'} value={'all'}>
                          {'All'}
                        </MenuItem>
                      {allTopicList.map((cat) => (
                        <MenuItem key={cat.exa_cat_id} value={cat.exa_cat_id}>
                          {cat.exa_cat_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-3" style={{ "margin": "0px" }}>
                <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Test</InputLabel>
                    <Select
                      labelId="demo-mutiple-name-label"
                      id="demo-mutiple-name"
                      value={selectedTest}
                      onChange={handleTestChange}
                    >
                        <MenuItem key={'all'} value={'all'}>
                          {'All'}
                        </MenuItem>
                      {allTestList.map((cat) => (
                        <MenuItem key={cat.exa_cat_id} value={cat.exa_cat_id}>
                          {cat.exa_cat_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div style={{ textAlign : 'center' , marginTop : 10 }}>
                  <Button variant="contained" onClick={search} color="primary" className="jr-btn">
                    <span>Search</span>
                    <i className="zmdi zmdi-search-in-page zmdi-hc-fw" />
                  </Button>
                </div>
            </div>
          </div>
        }
        {!loader && showOverall &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[10, 20, 25, 50, 100, 1000 ]}
              entries={10}
              hover
              data={{ rows: studrows, columns }}
              small
              responsive
              noBottomColumns
              disableRetreatAfterSorting={true}
            />
          </div>
        }
        <Snackbar
          className="mb-3 bg-info"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={showMessage}
          message={alertMessage}
        />
      </div>
    </>
  );
};

export default DataTable;