import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import TextField from '@material-ui/core/TextField';
import * as qbankSubCategoryService from '../../../../../../services/qbankSubCategoryService';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import BulkUpload from './BulkUpload';
import ReactExport from "react-data-export";
import moment from "moment";
import { DatePicker } from '@material-ui/pickers';

const DataTable = (props) => {
  const [data, setData] = useState([])
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [studrows, setStudrows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [reporttype, setReporttype] = useState('');
  const [showOverall, setShowoverall] = useState(false);
  const [startDate, setStartdate] = useState(null);
  const [endDate, setEnddate] = useState(null);
  const [operatorlist, setOperatorList] = useState([]);

  const columns = [
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Date',
      field: 'quest_dateList',
      width: 70,
    },
    {
      label: 'Number of Questions added',
      field: 'questions',
      width: 50,
    }
  ]

  const handleRefresh = async () => {
    setLoader(true);

    setSelectAll(false);

    const { data: Operatorresult } = await qbankSubCategoryService.getAllAdmin();
    const { Operator: operatorview } = Operatorresult;

    let facultyArr = [];
    for (let Operator of operatorview) {
      facultyArr.push(<MenuItem value={Operator.op_id}>{Operator.op_name}</MenuItem>)
    }
    setOperatorList(facultyArr);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  useEffect(() => {
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

      let row = {};
      rowcount = rowcount + 1;
      for (let fieldName of rowFields)
        row[fieldName] = obj[fieldName] // fetching required fields in req order
      row.sno = <span>{rowcount}</span>
      row.quest_dateList = moment(new Date(obj.quest_date)).format('DD/MM/YYYY');

      return row;
    })
    setStudrows(studrows);
  }

  const handleFromDateChange = (date) => {
    let fromdate = moment(date).format('YYYY-MM-DD');
    console.log(fromdate);
    setStartdate(fromdate);
  }

  const handleEndDateChange = (date) => {
    let todate = moment(date).format('YYYY-MM-DD');
    console.log(todate);
    setEnddate(todate);
  }

  const searchReports = async (state) => {
    if (state) {
      // Report search api and reports view.
      if (reporttype && startDate && endDate) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          setAlertMessage('Enter valid start and end date');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
        else {
          const searchContent = {};
          //setLoader(true);

          searchContent.opid = reporttype;
          searchContent.startdate = startDate;
          searchContent.enddate = endDate;
          console.log("Api calling ", searchContent);
          const { data: activeres } = await qbankSubCategoryService.getOpData(searchContent);
          const { odata: quedata } = activeres;
          console.log(quedata);
          setData(quedata);
          setShowoverall(true);

          setTimeout(() => {
            setLoader(false);
          }, 1000);
        }
      }
      else {
        setAlertMessage('Select all the mandatory fields');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false)
        }, 1500);
      }
    }
  }

  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Admin Report</h2>
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
                <div class="col-lg-2" style={{ "marginBottom": "10px" }}>
                  <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="age-simple">Admin Name</InputLabel>
                    <Select value={reporttype} onChange={(event, value) => {
                      setReporttype(event.target.value)
                    }} >
                      {operatorlist}
                    </Select>
                  </FormControl>
                </div>
                <div class="col-lg-3" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="Start Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={startDate}
                    onChange={handleFromDateChange}
                    animateYearScrolling={false}
                  />
                </div>
                <div class="col-lg-3" style={{ "margin": "0px" }}>
                  <DatePicker
                    label="End Date"
                    format='DD-MM-YYYY'
                    autoOk={true}
                    disableFuture={true}
                    margin={'none'}
                    value={endDate}
                    onChange={handleEndDateChange}
                    animateYearScrolling={false}
                  />
                </div>
                <div class="col-lg-2" style={{ "marginBottom": "10px", "marginTop": "20px", "textAlign": "right" }}>
                  <Button onClick={() => searchReports(true)} variant="contained" color="primary" className="jr-btn">
                    <span>Go</span>
                    <i className="zmdi zmdi-search-in-page zmdi-hc-fw" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        {!loader && showOverall &&
          <div>
            <MDBDataTable
              striped
              bordered
              entriesOptions={[10, 20, 25, 50, 100]}
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
        {!loader && showBulkUpload &&
          <BulkUpload />
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