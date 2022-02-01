import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MDBDataTable } from 'mdbreact';
import { Modal as AntdModal, Button, Spin, Progress } from 'antd';
import ReactPlayer from "react-player";
import Vimeo from '@u-wave/react-vimeo';
import socketIOClient from "socket.io-client";

import CardBox from "components/CardBox/index";
import { getVideos } from 'actions/Notes';
import * as videoService from '../../../../../services/videoService';
import { baseurlSocket } from "../../../../../config";

const utilizeScroll = () => {
    const elRef = React.createRef();
    const executeScroll = () => elRef.current.scrollIntoView();
    return { executeScroll, elRef };
};

const socket = socketIOClient(baseurlSocket,{path: '/adminapi/socket.io'});

class Videos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            chapterName: '',
            chapterId: '',
            buttonLoading: false,
            videosName: '',
            videosFile: '',
            videosFileUrl: '',
            videosPosition: '',
            validation: [],
            fileError: false,
            nameError: false,
            videosId: '',
            isEdit: false,
            fileViwer: false,
            viewFileUrl: '',
            viewFileType: '',
            videosStatus: '',
            videosModalOpen: false,
            videosDescription: '',
            videosFileEditUrl: '',
            percentage: 0,
            imageFileUrl : '',
            imageError : false
        };
        this.elScroll = utilizeScroll();
        this.inputOpenFileRef = React.createRef();
        this.inputOpenFileRefImage = React.createRef();
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
        this.props.dispatch(getVideos(chapterId));
        socket.on('connnection', () => {
            console.log('connected to server');
        });
        socket.on('video-upload-percentage', (percentage) => {
            this.setState({ percentage });
        });
        socket.on('video-upload-status', (status) => {
            if(status === 'success'){
                AntdModal.success({
                    title: 'Video Added Successfully.You can play the video after 5 mins.'
                });
                this.setState({ videosModalOpen: false, videosName: '', videosPosition: '', videosDescription: '', videosFile: '', videosFileEditUrl: '', videosFileUrl: '', imageFileUrl : '' });
                this.props.dispatch(getVideos(chapterId));
            }else{
                AntdModal.error({
                    title: 'Video Added Failed.'
                });
            }
        });
        socket.on('video-update-status', (status) => {
            if(status === 'success'){
                AntdModal.success({
                    title: 'Video Updated Successfully..You can play the video after 5 mins.'
                });
                this.setState({ videosModalOpen: false, videosName: '', videosPosition: '', videosDescription: '', videosFile: '', videosFileUrl: '', videosFileEditUrl: '', isEdit: false, imageFileUrl : '' });
                this.props.dispatch(getVideos(chapterId));
            }else{
                AntdModal.error({
                    title: 'Video Updated Failed.'
                });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loader: false });
    }

    nameChange = (value) => {
        this.setState({ videosName: value, nameError: false });
    }

    descriptionChange = (value) => {
        this.setState({ videosDescription: value });
    }

    positionChange = (value) => {
        const re = /^[0-9\b]+$/; //rules
        if (value === "" || re.test(value)) {
            this.setState({ videosPosition: value });
        }
    }

    statusChange = (value) => {
        this.setState({ videosStatus: value });
    }

    videosModal = () => {
        this.setState({ videosModalOpen: !this.state.videosModalOpen });
    }

    closeVideosModal = () => {
        this.setState({
            videosModalOpen: !this.state.videosModalOpen,
            videosName: '',
            videosPosition: '',
            videosFile: '',
            videosDescription: '',
            videosFileEditUrl: '',
            isEdit: false,
            nameError : false,
            fileError : false,
            imageError : false,
            imageFileUrl : ''
        });
    }

    addVideo = () => {
        this.inputOpenFileRef.current.click();
    }

    addImage = () => {
        this.inputOpenFileRefImage.current.click();
    }

    videoOnChange = async (file) => {
        this.setState({ 
            videosFile: file, 
            videosFileUrl: URL.createObjectURL(file), 
            videosName: file.name.split('.')[0], 
            fileError: false,
            nameError: false,  
            videosFileEditUrl: '' 
        });
    }

    imageOnChange = async (file) => {
        this.setState({ buttonLoading: true });
        const formData = new FormData();
        formData.append('thumbnail', file);
        let result = await videoService.thumbnailUpload(formData);
        if (result && result.data && result.data.statusCode && result.data.statusCode === 200) {
            this.setState({ imageFileUrl: result.data.data, imageError: false });
        }
        this.setState({ buttonLoading: false });
    }

    addNotes = async () => {
        this.setState({ loader: true });
        let { videosName, videosPosition, videosFile, videosDescription, chapterId, imageFileUrl } = this.state;
        if (videosName && videosFile && imageFileUrl ) {
            const formData = new FormData();
            formData.append('videos', videosFile);
            formData.append('videosName', videosName);
            formData.append('chapterId', chapterId);
            formData.append('thumbnailUrl', imageFileUrl);
            if (videosPosition) formData.append('videosPosition', videosPosition);
            if (videosDescription) formData.append('videosDescription', videosDescription);
            let result = await videoService.createVideos(formData);
            if (result && result.data && result.data.statusCode === 200) {
                // AntdModal.success({
                //     title: 'Video Added Successfully.'
                // });
                // this.setState({ videosModalOpen: false, videosName: '', videosPosition: '', videosDescription: '', videosFile: '', videosFileEditUrl: '', videosFileUrl: '' });
                // this.props.dispatch(getVideos(chapterId));
            } else {
                AntdModal.error({
                    title: 'Video Added Failed.'
                });
            }
        } else {
            if (!videosName) this.setState({ nameError: true });
            if (!videosFile) this.setState({ fileError: true });
            if (!imageFileUrl) this.setState({ imageError: true });
        }
        this.setState({ loader: false });
    }

    editNotes = async () => {
        this.setState({ loader: true });
        let { videosName, videosPosition, videosFile, videosDescription, chapterId, videosFileUrl, videosStatus, videosId, imageFileUrl } = this.state;
        if (videosName) {
            const formData = new FormData();
            if (videosFileUrl) {
                formData.append('videos', videosFile);
            } else {
                formData.append('videosUrl', videosFile);
            }
            formData.append('videosName', videosName);
            formData.append('chapterId', chapterId);
            formData.append('videosStatus', videosStatus);
            formData.append('thumbnailUrl', imageFileUrl);
            if (videosPosition) formData.append('videosPosition', videosPosition);
            if (videosDescription) formData.append('videosDescription', videosDescription);
            let result = await videoService.updateVideos(formData, videosId);
            if (result && result.data && result.data.statusCode === 200) {
                // AntdModal.success({
                //     title: 'Video Updated Successfully.'
                // });
                // this.setState({ videosModalOpen: false, videosName: '', videosPosition: '', videosDescription: '', videosFile: '', videosFileUrl: '', videosFileEditUrl: '', isEdit: false });
                // this.props.dispatch(getVideos(chapterId));
            } else {
                AntdModal.error({
                    title: 'Video Updated Failed.'
                });
            }
        } else {
            if (!videosName) this.setState({ nameError: true });
            if (!videosFile) this.setState({ fileError: true });
            if (!imageFileUrl) this.setState({ imageError: true });
        }
        this.setState({ loader: false });
    }

    deleteVideosClick = (videos) => {
        AntdModal.confirm({
            title: 'Confirm',
            content: 'Do you want to delete this Videos.',
            okText: 'Yes',
            onOk: () => this.deleteVideos(videos),
            cancelText: 'No',
        });
    }

    deleteVideos = async (videos) => {
        this.setState({ loader: true });
        let { chapterId } = this.state;
        let result = await videoService.deleteVideos(videos.videosId);
        if (result && result.data && result.data.statusCode === 200) {
            AntdModal.success({
                title: 'Videos Deleted Successfully.'
            });
            this.props.dispatch(getVideos(chapterId));
        } else {
            AntdModal.error({
                title: 'Videos Deleted Failed.'
            });
        }
        this.setState({ loader: false });
    }

    openFileModal = async (videos) => {
        this.setState({ fileViwer: true, videosFileEditUrl: videos.videosUrl.split('/')[2] });
    }

    closeFileModal = () => {
        this.setState({ fileViwer: false, videosFileEditUrl: '', paused: true });
    }

    editVideosClick = (videos) => {
        this.setState({
            videosName: videos.videosName,
            videosPosition: videos.videosPosition,
            videosFile: videos.videosUrl,
            videosFileEditUrl: videos.videosUrl.split('/')[2],
            videosDescription: videos.videosDescription,
            videosId: videos.videosId,
            videosStatus: videos.videosStatus,
            videosModalOpen: !this.state.videosModalOpen,
            isEdit: true,
            nameError : false,
            fileError : false,
            imageError : false,
            imageFileUrl : videos.thumbnailUrl
        });
    }

    render() {
        let { videos } = this.props.notes;
        let { 
            loader, videosModalOpen, chapterName, videosName, videosDescription, 
            videosFile, videosPosition, fileError, nameError, videosStatus, 
            videosFileUrl, videosFileEditUrl, imageFileUrl 
        } = this.state;
        videos = videos.map(c => {
            c.status = c.videosStatus === "Y" ? (<p style={{ color: 'green' }}>Active</p>) : (<p style={{ color: 'red' }}>Incctive</p>);
            c.edit = (<Button onClick={() => this.editVideosClick(c)} style={{ backgroundColor: '#2196f3', color: '#fff', borderRadius: 5 }}><i className={'zmdi zmdi-edit'} /></Button>);
            c.view = (<Button onClick={() => this.openFileModal(c)} style={{ backgroundColor: '#03ad64', color: '#fff', borderRadius: 5 }}><i className={'zmdi zmdi-eye'} /></Button>);
            c.delete = (<Button onClick={() => this.deleteVideosClick(c)} style={{ backgroundColor: 'red', color: '#fff', borderRadius: 5 }}><i className={'zmdi zmdi-delete'} /></Button>);
            return (c);
        });
        const columns = [
            {
                label: 'Name',
                field: 'videosName',
                width: 100
            },
            {
                label: 'Position',
                field: 'videosPosition',
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
                    <Spin size="large" className="spinner" tip="Please Wait..." spinning={loader}>
                        <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                            <h2 className="title mb-3 mb-sm-0"> {chapterName} - Videos</h2>
                        </div>
                        <div style={{ margin: '10px 10px 0px 0px', textAlign: 'right' }}>
                            <Button onClick={this.videosModal} style={{ width: '10%', backgroundColor: '#2196f3', color: '#fff', borderRadius: 5 }}>
                                <i className="zmdi zmdi-plus zmdi-hc-fw" />
                                <span>Add Videos</span>
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
                                    data={{ rows: videos, columns }}
                                    small
                                    responsive
                                    noBottomColumns
                                    disableRetreatAfterSorting={true}
                                />
                            </div>
                        </div>
                    </Spin>
                </CardBox>
                <Modal className="modal-box" backdrop={"static"} toggle={this.videosModal} isOpen={videosModalOpen} size="lg">
                    <ModalHeader className="modal-box-header bg-primary text-white">
                        Videos
                    </ModalHeader>
                    <Spin size="large" className="spinner" tip="Uploading..." spinning={loader}>
                        <div className="modal-box-content">
                            <div className="row no-gutters">
                                <div className="col-lg-12 d-flex flex-column order-lg-1">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            {videosFileEditUrl &&
                                                <div style={{ textAlign: 'center' }}>
                                                    <Vimeo
                                                        video={videosFileEditUrl}
                                                        autoplay
                                                        height={300}
                                                    />
                                                </div>
                                            }
                                            {videosFileUrl &&
                                                <div style={{ borderRadius: 15 }}>
                                                    <ReactPlayer url={videosFileUrl} width="100%" height={300} controls />
                                                </div>
                                            }
                                            {!videosFile &&
                                                <div className="form-group">
                                                    <Button
                                                        style={{ width: '100%', height: 200, borderRadius: 15, border: 'none', backgroundColor: '#ededed' }}
                                                        onClick={this.addVideo}
                                                        size='large'
                                                    >
                                                        <i
                                                            style={{ fontSize: 20, fontWeight: 'bold' }}
                                                            onClick={this.addVideo}
                                                            className="zmdi zmdi-plus"
                                                        />
                                                    </Button>
                                                    <input
                                                        ref={this.inputOpenFileRef}
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        className="mb-1"
                                                        accept="video/*"
                                                        onChange={(e) => this.videoOnChange(e.target.files[0])}
                                                    />
                                                </div>
                                            }
                                            {fileError &&
                                                <span style={{ color: 'red' }}>Select file.</span>
                                            }
                                        </div>
                                    </div>
                                    {this.state.isEdit &&
                                        <div className="form-group" style={{ textAlign : 'center'}}>
                                            <Button
                                                style={{ borderRadius: 5, border: 'none', backgroundColor: '#2196f3', color: '#fff' }}
                                                onClick={this.addVideo}
                                            >
                                                Change
                                            </Button>
                                            <input
                                                ref={this.inputOpenFileRef}
                                                type="file"
                                                style={{ display: "none" }}
                                                className="mb-1"
                                                accept="video/*"
                                                onChange={(e) => this.videoOnChange(e.target.files[0])}
                                            />
                                        </div>
                                    }
                                    <div className="row" style={{ marginTop: 10 }}>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={videosName}
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
                                                    value={videosPosition}
                                                    placeholder="Position"
                                                    onChange={(e) => this.positionChange(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    className="form-control"
                                                    type="text"
                                                    value={videosDescription}
                                                    placeholder="Description"
                                                    onChange={(e) => this.descriptionChange(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {this.state.isEdit && <div className="col-sm-6">
                                            <div className="form-group d-flex flex-column order-lg-1">
                                                <label>Status</label>
                                                <Select
                                                    onChange={(e) => this.statusChange(e.target.value)}
                                                    value={videosStatus}
                                                >
                                                    <MenuItem value={'Y'}>Active</MenuItem>
                                                    <MenuItem value={'N'}>Inactive</MenuItem>
                                                </Select>
                                            </div>
                                        </div>}
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            {imageFileUrl &&
                                                <>
                                                    <label>Thumbnail Image</label>
                                                    <img
                                                        src={imageFileUrl}
                                                        width={'100%'}
                                                        height={200}
                                                        style={{ borderRadius: 15 }}
                                                        onClick={this.addImage}
                                                    />
                                                    <input
                                                        ref={this.inputOpenFileRefImage}
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        className="mb-1"
                                                        accept="image/*"
                                                        onChange={(e) => this.imageOnChange(e.target.files[0])}
                                                    />
                                                </>
                                            }
                                            {!imageFileUrl && 
                                                <div className="form-group">
                                                    <label>Thumbnail Image</label>
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
                                                        ref={this.inputOpenFileRefImage}
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        className="mb-1"
                                                        accept="image/*"
                                                        onChange={(e) => this.imageOnChange(e.target.files[0])}
                                                    />
                                                </div>
                                            }
                                            {this.state.imageError &&
                                                <span style={{ color: 'red' }}>Select file.</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { loader && <Progress
                                strokeColor={{
                                    from: '#108ee9',
                                    to: '#87d068',
                                }}
                                percent={this.state.percentage}
                                status="active"
                            />}
                        </div>
                        <ModalFooter>
                            <Button style={!this.state.isEdit ? { backgroundColor: 'darkgreen', color: '#fff', borderRadius: 5 } : { display: 'none' }} onClick={this.addNotes}>Add</Button>
                            <Button style={this.state.isEdit ? { backgroundColor: 'darkgreen', color: '#fff', borderRadius: 5 } : { display: 'none' }} onClick={this.editNotes}>Update</Button>
                            <Button style={{ backgroundColor: 'red', color: '#fff', borderRadius: 5 }} onClick={this.closeVideosModal}>Close</Button>
                        </ModalFooter>
                    </Spin>
                </Modal>
                <Modal className="modal-box" backdrop={"static"} toggle={this.videosModal} isOpen={this.state.fileViwer} size="lg">
                    <div style={{ textAlign: 'center' }}>
                        <Vimeo
                            video={videosFileEditUrl}
                            autoplay
                            height={350}
                        />
                    </div>
                    <ModalFooter>
                        <Button style={{ backgroundColor: 'red', color: '#fff', borderRadius: 5 }} onClick={this.closeFileModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    notes: state.notes
});

export default connect(mapStateToProps)(Videos);