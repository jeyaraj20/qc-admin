import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import { Badge } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
import { Pagination, Button } from 'antd';

import CardBox from "components/CardBox/index";
import { getMasterCategory, getChapters } from 'actions/Notes';
import * as exammainCategoryService from '../../../../../services/exammainCategoryService';

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
            mainCategory : [],
            subCategory : [],
            selectedSearchMasterId : '',
            selectedSearchMainId : '',
            selectedSearchSubId : '',
            search : '',
            page : 1,
            pageSize : 25,
            status : 'Y',
            notesModalOpen : false,
            videoModalOpen : false,
            buttonLoading : false
        };
        this.elScroll = utilizeScroll();
    }

    componentDidMount() {
        this.setState({ loader: true });
        this.props.dispatch(getMasterCategory());
        this.props.dispatch(getChapters({ _start : 0, _limit : 25, status : 'Y' }));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loader: false });
    }

    handleMasterCategorySearch = async (value) =>{
        let result = await exammainCategoryService.getExamSubCategoryById(value);
        if( result && result.data && result.data.category && result.data.category.length ){
            this.setState({ mainCategory : result.data.category });
        }
        this.setState({ selectedSearchMasterId : value, selectedSearchMainId : '', selectedSearchSubId : '' });
    }

    handleMainCategorySearch = async (value) =>{
        let result = await exammainCategoryService.getExamSubCategoryByCatId(value);
        if( result && result.data && result.data.subcategory && result.data.subcategory.length ){
            this.setState({ subCategory : result.data.subcategory });
        }
        this.setState({ selectedSearchMainId : value, selectedSearchSubId : '' });
    }

    handleSubCategorySearch = (value) =>{
        this.setState({ selectedSearchSubId : value });
    }

    handleSearchChange = (value) =>{
        this.setState({ search : value });
    }

    searchClick = () =>{
        this.setState({ loader: true });
        let { pageSize, status, selectedSearchMasterId, selectedSearchMainId, selectedSearchSubId, search } = this.state;
        let obj = {
            _start : 0, 
            _limit : pageSize, 
            status       
        };
        if(selectedSearchMasterId) obj['masterId'] = selectedSearchMasterId;
        if(selectedSearchMainId) obj['mainId'] = selectedSearchMainId;
        if(selectedSearchSubId) obj['subId'] = selectedSearchSubId;
        if(search) obj['name'] = search;
        this.props.dispatch(getChapters(obj));
    }

    statusChange = (status) =>{
        this.setState({ loader: true });
        let { pageSize } = this.state;
        this.props.dispatch(getChapters({ _start : 0, _limit : pageSize, status }));
        this.setState({ status, page : 1, selectedSearchMasterId : '', selectedSearchMainId : '', selectedSearchSubId : '', search :'' });
    }

    pageSizeChange = async (page, pageSize) =>{
        this.setState({ loader: true });
        this.elScroll.executeScroll();
        let { status, selectedSearchMasterId, selectedSearchMainId, selectedSearchSubId, search } = this.state;
        let obj = {
            _start : page === 1 ? 0 : (page - 1) * pageSize,
            _limit : page * pageSize,
            status
        };
        if(selectedSearchMasterId) obj['masterId'] = selectedSearchMasterId;
        if(selectedSearchMainId) obj['mainId'] = selectedSearchMainId;
        if(selectedSearchSubId) obj['subId'] = selectedSearchSubId;
        if(search) obj['name'] = search;
        this.props.dispatch(getChapters(obj));
        this.setState({ page, pageSize });
    }

    notesModal = (chapter) =>{
        this.props.history.push(`/app/studyMaterials/notes/view?chapter_name=${chapter.chapter_name}&chapter_id=${chapter.chapt_id}`)
    }

    videosModal = (chapter) =>{
        this.props.history.push(`/app/studyMaterials/videos/view?chapter_name=${chapter.chapter_name}&chapter_id=${chapter.chapt_id}`)
    }

    render() {
        let { 
            loader, selectedSearchMasterId, selectedSearchMainId, selectedSearchSubId,
            mainCategory, subCategory, status, search
        } = this.state;
        let { masterCategory, chapters, chaptersCount, activeCount, inActiveCount } = this.props.notes;
        chapters = chapters.map( c =>{
            c.notes = (<><Button style={{ width: '100%', backgroundColor: '#2196f3', color : '#fff', borderRadius : 5 }} onClick={ () => this.notesModal(c)}>
                            Notes&nbsp;&nbsp;<Badge color="warning" pill>{c.NotesCount}</Badge>
                        </Button></>);
            c.videos = (<><Button style={{ width: '100%', backgroundColor: '#2196f3', color : '#fff', borderRadius : 5 }} onClick={ () => this.videosModal(c)}>
                            Videos&nbsp;&nbsp;<Badge color="success" pill>{c.VideosCount}</Badge>
                        </Button></>);
            return(c);
        });
        const columns = [
            {
              label: 'Master Category',
              field: 'Mastercategory',
              width: 100
            },
            {
              label: 'Main Category',
              field: 'Maincategory',
              sort: 'asc',
              width: 100,
            },
            {
              label: 'Sub Category',
              field: 'Subcategory',
              width: 100
            },
            {
              label: 'Chapter Name',
              field: 'chapter_name',
              width: 100
            },
            {
              label: 'Notes',
              field: 'notes',
              width: 40
            },
            {
              label: 'Videos',
              field: 'videos',
              width: 40
            }
        ];
        return (
            <div className="row animated slideInUpTiny animation-duration-3" ref={this.elScroll.elRef}>
                {loader &&
                    <div
                        className="loader-view w-100"
                        style={{ height: 'calc(100vh - 120px)' }}
                    >
                        <CircularProgress />
                    </div>
                }
                <CardBox styleName="col-12" cardStyle=" p-0">
                    {!loader &&
                        <>
                            <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
                                <h2 className="title mb-3 mb-sm-0">Chapters - Study Materials</h2>
                            </div>
                            <div style={{ marginLeft: '0%', paddingTop: '2%' }} className="col-lg-6 col-sm-6 col-12">
                                <div className="jr-btn-group">
                                    <Button 
                                        variant="contained" 
                                        className="jr-btn bg-success text-white" 
                                        style={ status === "Y" ? { height : 40 ,boxShadow:'rgb(75 175 79 / 50%) 0px 0px 0px 0.2rem'} : {height : 30}}
                                        onClick={ () => this.statusChange('Y')}
                                    >
                                        <i className="zmdi zmdi-check zmdi-hc-fw" />
                                        <span>Active ({activeCount})</span>
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        className="jr-btn bg-danger text-white"
                                        style={ status === "N" ? { height : 40,boxShadow:'rgb(244 67 53 / 40%) 0px 0px 0px 0.2rem'} : {height : 30}}
                                        onClick={ () => this.statusChange('N')}
                                    >
                                        <i className="zmdi zmdi-block zmdi-hc-fw" />
                                        <span>Inactive ({inActiveCount})</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-12" style={{ padding : 10 }}>    
                                <AppBar position="static" color="inherit" className="jr-border-radius" style={{ padding : 10, marginBottom : 10 }}>
                                    <Toolbar>
                                        <div className="col-lg-3 d-flex flex-column order-lg-1">
                                            <label htmlFor="age-simple">Master Category</label>
                                            <Select
                                                onChange={ (e) => this.handleMasterCategorySearch(e.target.value)} 
                                                value={selectedSearchMasterId}
                                            >
                                                <MenuItem value={''}>--Select--</MenuItem>
                                                {masterCategory.category && masterCategory.category.length &&
                                                    masterCategory.category.map( mc =>{
                                                        return(<MenuItem value={mc.exa_cat_id}>{mc.exa_cat_name}</MenuItem>)
                                                    })
                                                }
                                            </Select>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column order-lg-1">
                                            <label htmlFor="age-simple">Main Category</label>
                                            <Select
                                                onChange={ (e) => this.handleMainCategorySearch(e.target.value)} 
                                                value={selectedSearchMainId}
                                            >
                                                <MenuItem value={''}>--Select--</MenuItem>
                                                {mainCategory.length &&
                                                    mainCategory.map( mc =>{
                                                        return(<MenuItem value={mc.exa_cat_id}>{mc.exa_cat_name}</MenuItem>)
                                                    })
                                                }
                                            </Select>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column order-lg-1">
                                            <label htmlFor="age-simple">Sub Category</label>
                                            <Select
                                                onChange={ (e) => this.handleSubCategorySearch(e.target.value)} 
                                                value={selectedSearchSubId}
                                            >
                                                <MenuItem value={''}>--Select--</MenuItem>
                                                {subCategory.length &&
                                                    subCategory.map( mc =>{
                                                        return(<MenuItem value={mc.exa_cat_id}>{mc.exa_cat_name}</MenuItem>)
                                                    })
                                                }
                                            </Select>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column order-lg-1">
                                            <label htmlFor="age-simple">Search</label>
                                            <TextField
                                                onChange={(event) => this.handleSearchChange(event.target.value)}
                                                value={search}
                                            />
                                        </div>
                                    </Toolbar>
                                    <div style={{ textAlign : 'center', marginTop : 10 }}>
                                        <Button onClick={this.searchClick} className="jr-btn" style={{ backgroundColor: '#2196f3', color : '#fff', borderRadius : 5 }}>
                                            <i className="zmdi zmdi-search zmdi-hc-fw" />
                                            <span>Search</span>
                                        </Button>
                                    </div>
                                </AppBar>
                                <div>
                                    <MDBDataTable
                                        striped
                                        bordered
                                        entriesOptions={[ 25, 50, 100, 1000 ]}
                                        entries={25}
                                        hover
                                        data={{ rows: chapters, columns }}
                                        small
                                        responsive
                                        noBottomColumns
                                        disableRetreatAfterSorting={true} 
                                        searching={false}
                                        paging={false}
                                    />
                                </div>
                                <div style={ chaptersCount > 0 ? { margin: '10px auto', textAlign : 'right' } : {display : 'none'}}>
                                    <Pagination 
                                        total={chaptersCount} 
                                        defaultCurrent={1}
                                        current={this.state.page} 
                                        defaultPageSize={10}
                                        pageSize={this.state.pageSize}
                                        pageSizeOptions={['25', '50', '100', '1000']} 
                                        onChange={this.pageSizeChange}
                                        showSizeChanger={true}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </CardBox>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    notes : state.notes
});

export default connect(mapStateToProps)(Notes);