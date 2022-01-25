import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { MDBDataTable, MDBIcon, MDBInput } from 'mdbreact';
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from '@material-ui/core/CircularProgress';

const PassageQuestion = (props) => {
    const history = useHistory();
    const [loader, setLoader] = useState(false);

    const handleRefresh = async () => {
        setLoader(true);
        console.log("in", props);
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }

    useEffect(() => {
        async function fetchData() {
            await handleRefresh()
        }
        fetchData();
    }, [])


    return (
        <>
            <div>
                {loader &&
                    <div className="loader-view w-100"
                        style={{ height: 'calc(100vh - 120px)' }}>
                        <CircularProgress />
                    </div>
                }
                {!loader &&
                    <>
                        <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                            <h2 className="title mb-3 mb-sm-0">Exam Sub Category</h2>
                            <IconButton onClick={() => handleRefresh()} className="icon-btn">
                                <i className="zmdi zmdi-refresh" />
                            </IconButton>
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default PassageQuestion;