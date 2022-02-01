import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MDBDataTable } from 'mdbreact';
import { Modal as AntdModal, Button, Spin } from 'antd';

import PdfViewerComponent from './PdfViewerComponent.jsx';

import CardBox from "components/CardBox/index";
import { getNotes } from 'actions/Notes';
import * as notesService from '../../../../../services/notesService';

const utilizeScroll = () => {
    const elRef = React.createRef();
    const executeScroll = () => elRef.current.scrollIntoView();
    return { executeScroll, elRef };
};

class Notes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            chapterName: '',
            chapterId: '',
            mainCategory: [],
            subCategory: [],
            selectedSearchMasterId: '',
            selectedSearchMainId: '',
            selectedSearchSubId: '',
            search: '',
            page: 1,
            pageSize: 25,
            status: 'Y',
            notesModalOpen: false,
            videoModalOpen: false,
            buttonLoading: false,
            notesName: '',
            notesUrl: '',
            notesPosition: '',
            notesType: '',
            validation: [],
            fileError: false,
            nameError: false,
            notesId: '',
            isEdit: false,
            fileViwer: false,
            viewFileUrl: '',
            viewFileType: '',
            fileData: null
        };
        this.elScroll = utilizeScroll();
        this.inputOpenFileRef = React.createRef();
    }

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    componentDidMount() {
        this.setState({ loader: true });
        let params = this.props.location.search.split("?")[1];
        let chapterName = params.split("&")[0];
        let chapterId = params.split("&")[1];
        chapterId = chapterId.split("=")[1];
        chapterName = chapterName.split("=")[1];
        chapterName = chapterName.replace(/%20/g, ' ');
        this.setState({ chapterName, chapterId });
        this.props.dispatch(getNotes(chapterId));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loader: false });
    }

    nameChange = (value) => {
        this.setState({ notesName: value, nameError: false });
    }

    positionChange = (value) => {
        const re = /^[0-9\b]+$/; //rules
        if (value === "" || re.test(value)) {
            this.setState({ notesPosition: value });
        }
    }

    statusChange = (value) => {
        this.setState({ notesStatus: value });
    }

    notesModal = () => {
        this.setState({ notesModalOpen: !this.state.notesModalOpen });
    }

    closeNotesModal = () => {
        this.setState({
            notesModalOpen: !this.state.notesModalOpen,
            notesName: '',
            notesPosition: '',
            notesType: '',
            notesUrl: '',
            isEdit: false
        });
    }

    addImage = () => {
        this.inputOpenFileRef.current.click();
    }

    imageOnChange = async (file) => {
        this.setState({ buttonLoading: true });
        const formData = new FormData();
        formData.append('notes', file);
        let result = await notesService.imageUpload(formData);
        if (result && result.data && result.data.statusCode && result.data.statusCode === 200) {
            this.setState({ notesUrl: result.data.data, notesType: file.type, notesName: file.name.split('.')[0], fileError: false });
        }
        this.setState({ buttonLoading: false });
    }

    addNotes = async () => {
        let { notesName, notesPosition, notesUrl, notesType, chapterId } = this.state;
        if (notesName && notesUrl) {
            let obj = {
                notesName,
                notesUrl,
                notesType,
                chapterId,
            }
            if (notesPosition) obj['notesPosition'] = notesPosition;
            let result = await notesService.createNotes(obj);
            if (result && result.data && result.data.statusCode === 200) {
                AntdModal.success({
                    title: 'Notes Added Successfully.'
                });
                this.setState({ notesModalOpen: false, notesName: '', notesPosition: '', notesType: '', notesUrl: '' });
                this.props.dispatch(getNotes(chapterId));
            } else {
                AntdModal.error({
                    title: 'Notes Added Failed.'
                });
            }
        } else {
            if (!notesName) this.setState({ nameError: true });
            if (!notesUrl) this.setState({ fileError: true });
        }
    }

    editNotes = async () => {
        let { notesName, notesPosition, notesUrl, notesType, notesStatus, notesId, chapterId } = this.state;
        if (notesName && notesUrl) {
            let obj = {
                notesName,
                notesUrl,
                notesType,
                notesStatus
            }
            if (notesPosition) obj['notesPosition'] = notesPosition;
            let result = await notesService.updateNotes(obj, notesId);
            if (result && result.data && result.data.statusCode === 200) {
                AntdModal.success({
                    title: 'Notes Updated Successfully.'
                });
                this.setState({ notesModalOpen: false, notesName: '', notesPosition: '', notesType: '', notesUrl: '', isEdit: false });
                this.props.dispatch(getNotes(chapterId));
            } else {
                AntdModal.error({
                    title: 'Notes Updated Failed.'
                });
            }
        } else {
            if (!notesName) this.setState({ nameError: true });
            if (!notesUrl) this.setState({ fileError: true });
        }
    }

    deleteNotesClick = (notes) => {
        AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to delete this Notes.',
            okText: 'Yes',
            onOk: () => this.deleteNotes(notes),
            cancelText: 'No',
        });
    }

    deleteNotes = async (notes) => {
        let { chapterId } = this.state;
        let result = await notesService.deleteNotes(notes.notesId);
        if (result && result.data && result.data.statusCode === 200) {
            AntdModal.success({
                title: 'Notes Deleted Successfully.'
            });
            this.props.dispatch(getNotes(chapterId));
        } else {
            AntdModal.error({
                title: 'Notes Deleted Failed.'
            });
        }
    }

    openFileModal = async (notes) => {
        this.setState({ loader: true });
        if (notes.notesType.includes('image')) {
            this.setState({ fileViwer: true, notesId: notes.notesId, notesType: notes.notesType, fileData: notes.notesUrl, loader: false });
        } else {
            let result = await notesService.getFile(notes.notesId);
            this.setState({ fileViwer: true, notesId: notes.notesId, notesType: notes.notesType, fileData: result.data, loader: false });
        }
    }

    closeFileModal = () => {
        this.setState({ fileViwer: false, notesId: '', notesType: '' });
    }

    editNotesClick = (notes) => {
        this.setState({
            notesName: notes.notesName,
            notesPosition: notes.notesPosition,
            notesUrl: notes.notesUrl,
            notesType: notes.notesType,
            notesId: notes.notesId,
            notesStatus: notes.notesStatus,
            notesModalOpen: !this.state.notesModalOpen,
            isEdit: true
        });
    }


    render() {
        let { notes } = this.props.notes;
        let { loader, notesModalOpen, chapterName, notesName, notesPosition, notesUrl, notesType, fileError, nameError, notesStatus } = this.state;
        notes = notes.map(c => {
            c.status = c.notesStatus === "Y" ? (<p style={{ color: 'green' }}>Active</p>) : (<p style={{ color: 'red' }}>Incctive</p>);
            c.type = c.notesType.includes('doc') ? "Docs" : c.notesType.includes('text') ? "Text" : c.notesType.includes('pdf') ? "PDF" : "Image";
            c.edit = (<Button onClick={() => this.editNotesClick(c)} style={{ backgroundColor: '#2196f3', color: '#fff', borderRadius: 5 }}><i className={'zmdi zmdi-edit'} /></Button>);
            c.view = (<Button onClick={() => this.openFileModal(c)} style={{ backgroundColor: '#03ad64', color: '#fff', borderRadius: 5 }}><i className={'zmdi zmdi-eye'} /></Button>);
            c.delete = (<Button onClick={() => this.deleteNotesClick(c)} style={{ backgroundColor: 'red', color: '#fff', borderRadius: 5 }}><i className={'zmdi zmdi-delete'} /></Button>);
            return (c);
        });
        const columns = [
            {
                label: 'Name',
                field: 'notesName',
                width: 100
            },
            {
                label: 'Type',
                field: 'type',
                width: 100,
            },
            {
                label: 'Position',
                field: 'notesPosition',
                width: 100,
            },
            {
                label: 'Status',
                field: 'status',
                width: 100
            },
            {
                label: 'View',
                field: 'view',
                width: 40
            },
            {
                label: 'Edit',
                field: 'edit',
                width: 100
            },
            {
                label: 'Delete',
                field: 'delete',
                width: 40
            }
        ];
        return (
            <div className="row animated slideInUpTiny animation-duration-3" ref={this.elScroll.elRef}>
                <CardBox styleName="col-12" cardStyle=" p-0">
                    <Spin size="large" className="spinner" tip="Uploading..." spinning={loader}>
                        <>
                            <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                                <h2 className="title mb-3 mb-sm-0"> {chapterName} - Notes</h2>
                            </div>
                            <div style={{ margin: '10px 10px 0px 0px', textAlign: 'right' }}>
                                <Button onClick={this.notesModal} style={{ width: '10%', backgroundColor: '#2196f3', color: '#fff', borderRadius: 5 }}>
                                    <i className="zmdi zmdi-plus zmdi-hc-fw" />
                                    <span>Add Notes</span>
                                </Button>
                            </div>
                            <div className="col-12" style={{ padding: 10 }}>
                                <div>
                                    <MDBDataTable
                                        striped
                                        bordered
                                        entriesOptions={[25, 50, 100, 1000]}
                                        entries={25}
                                        hover
                                        data={{ rows: notes, columns }}
                                        small
                                        responsive
                                        noBottomColumns
                                        disableRetreatAfterSorting={true}
                                    />
                                </div>
                            </div>
                        </>
                    </Spin>
                </CardBox>
                <Modal className="modal-box" backdrop={"static"} toggle={this.notesModal} isOpen={notesModalOpen} size="lg">
                    <ModalHeader className="modal-box-header bg-primary text-white">
                        Notes
                    </ModalHeader>
                    <div className="modal-box-content">
                        <div className="row no-gutters">
                            <div className="col-lg-12 d-flex flex-column order-lg-1">
                                <div className="row">
                                    <div className="col-sm-12" style={{ textAlign: 'center' }}>
                                        {notesUrl &&
                                            <div>
                                                {notesType === "application/pdf" &&
                                                    <img
                                                        src={require("assets/images/PDF_file.png")}
                                                        width={200}
                                                        height={200}
                                                        style={{ borderRadius: 15 }}
                                                        onClick={this.addImage}
                                                    />
                                                }
                                                {(notesType.includes('doc') || notesType.includes('text')) &&
                                                    <img
                                                        src={require("assets/images/Google_Docs.png")}
                                                        width={200}
                                                        height={200}
                                                        style={{ borderRadius: 15 }}
                                                        onClick={this.addImage}
                                                    />
                                                }
                                                {notesType.includes('image') &&
                                                    <img
                                                        src={notesUrl}
                                                        width={'100%'}
                                                        height={200}
                                                        style={{ borderRadius: 15 }}
                                                        onClick={this.addImage}
                                                    />
                                                }
                                                <input
                                                    ref={this.inputOpenFileRef}
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    className="mb-1"
                                                    accept="image/*,.txt,.pdf"
                                                    onChange={(e) => this.imageOnChange(e.target.files[0])}
                                                />
                                            </div>
                                        }
                                        {!notesUrl &&
                                            <div className="form-group">
                                                <Button
                                                    style={{ width: '100%', height: 200, borderRadius: 15, border: 'none', backgroundColor: '#ededed' }}
                                                    onClick={this.addImage}
                                                    loading={this.state.buttonLoading}
                                                    size='large'
                                                >
                                                    <i
                                                        style={this.state.buttonLoading ? { display: 'none' } : { fontSize: 20, fontWeight: 'bold' }}
                                                        onClick={this.addImage}
                                                        className="zmdi zmdi-plus"
                                                    />
                                                </Button>
                                                <input
                                                    ref={this.inputOpenFileRef}
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    className="mb-1"
                                                    accept="image/*,.txt,.pdf"
                                                    onChange={(e) => this.imageOnChange(e.target.files[0])}
                                                />
                                            </div>
                                        }
                                        {fileError &&
                                            <span style={{ color: 'red' }}>Select file.</span>
                                        }
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: 20 }}>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={notesName}
                                                placeholder="Name"
                                                onChange={(e) => this.nameChange(e.target.value)}
                                            />
                                            {nameError &&
                                                <span style={{ color: 'red' }}>Enter the valid Name.</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Position</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={notesPosition}
                                                placeholder="Position"
                                                onChange={(e) => this.positionChange(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {this.state.isEdit && <div className="col-sm-6">
                                        <div className="form-group d-flex flex-column order-lg-1">
                                            <label>Status</label>
                                            <Select
                                                onChange={(e) => this.statusChange(e.target.value)}
                                                value={notesStatus}
                                            >
                                                <MenuItem value={'Y'}>Active</MenuItem>
                                                <MenuItem value={'N'}>Inactive</MenuItem>
                                            </Select>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalFooter>
                        <Button style={!this.state.isEdit ? { backgroundColor: 'darkgreen', color: '#fff', borderRadius: 5 } : { display: 'none' }} onClick={this.addNotes}>Add</Button>
                        <Button style={this.state.isEdit ? { backgroundColor: 'darkgreen', color: '#fff', borderRadius: 5 } : { display: 'none' }} onClick={this.editNotes}>Update</Button>
                        <Button style={{ backgroundColor: 'red', color: '#fff', borderRadius: 5 }} onClick={this.closeNotesModal}>Close</Button>
                    </ModalFooter>
                </Modal>
                <AntdModal
                    centered
                    footer={null}
                    width={800}
                    onCancel={this.closeFileModal}
                    visible={this.state.fileViwer}
                >
                    {this.state.notesType.includes('image') ?
                        <div style={{ textAlign: 'center' }}>
                            <img src={this.state.fileData} />
                        </div> :
                        <PdfViewerComponent notesType={this.state.notesType} notesId={this.state.notesId} data={this.state.fileData} />
                    }
                </AntdModal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    notes: state.notes
});

export default connect(mapStateToProps)(Notes);