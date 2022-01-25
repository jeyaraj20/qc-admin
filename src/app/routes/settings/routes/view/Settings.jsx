import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import Form from "./Components/Form";
import Datatable from "./Components/Form";

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as settingService from '../../../../../services/settingService';
import { settingImageDir } from "../../../../../config";
import Moment from "moment";
import { useDropzone } from "react-dropzone";

const Settingsview = props => {
  const [statename, setStateName] = useState('');
  const [sitename, setSiteName] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [seturl, setSiteUrl] = useState('');
  const [studfname, setFName] = useState('');
  const [studpass, setPass] = useState('');
  const [studregno, setRegno] = useState('');
  const [studemail, setEmail] = useState('');
  const [ipaddress, setIp] = useState('');
  const [studmobile, setMobile] = useState('');
  const [mobotp, setOtp] = useState('');
  const [studgender, setGender] = useState('');
  const [pincode, setPincode] = useState('');
  const [studdate, setDate] = useState('');
  const [studstatus, setStatus] = useState('');
  const [newmodal, setNewModal] = useState(false)
  const [viewmodal, setViewModal] = useState(false)
  const [loader, setLoader] = useState(false);
  const [action, setAction] = useState('');
  const [exam_title, setExam_title] = useState('');
  const [siteurl, setSiteurl] = useState('');
  const [siteemail, setSitemail] = useState('');
  const [sitephone, setSitephone] = useState('');
  const [sitebpsize, setSitebpsize] = useState('');
  const [sitefpsize, setSitefpsize] = useState('');
  const [siteuser, setSiteuser] = useState('');
  const [sitepass, setSitepass] = useState('');
  const [sitesenderid, setSiteSenderid] = useState('');
  const [facebook, setSiteFacebook] = useState('');
  const [twitter, setSiteTwitter] = useState('');
  const [linkedin, setSiteLinkedin] = useState('');
  const [instagram, setSiteInstagram] = useState('');
  const [cssurl, setSiteCssurl] = useState('');
  const [jsurl, setSiteJsurl] = useState('');
  const [seotitle, setSiteSeotitle] = useState('');
  const [seodescription, setSiteSeodescription] = useState('');
  const [seokeywords, setSiteSeokeywords] = useState('');
  const [headerscript, setSiteHeaderscript] = useState('');
  const [footerscript, setSiteFooterscript] = useState('');
  const [settingss, setQuestionData] = useState({});
  const [files, setFiles] = useState([]);
  const [editthumbs, setEditthumbs] = useState('');
  const [settingbanner, setSchoolLogo] = useState('');
  const [smsenable, setSitesms] = useState('');
  const [facebooksettings, setFacebookset] = useState('');
  const [twittersettings, setSiteTwitterset] = useState('');
  const [LinkedInsettings, setSiteLinkedInset] = useState('');
  const [instagramsettings, setSiteInstagramset] = useState('');
  const [adminstatus, setSiteLogin] = useState('');
  const [viewEditImg, setviewEditImg] = useState(false);
  const [adminname, setAdminName] = useState('');
  const [adminpass, setAdminPass] = useState('');
  const [explanation, setExplanation] = useState('');
  const [usertype, setType] = useState('');

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    background: 'aliceblue',
    //marginTop: 16,

  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
    height: 50,
    padding: 4,
    boxSizing: 'border-box'
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '50%'
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(settingbanner => Object.assign(settingbanner, {
        preview: window.webkitURL.createObjectURL(settingbanner)
      })));
      setviewEditImg(false);
    }
  });

  const handleCountryChange = (event, value) => {
    console.log(event.target.value);
    setSitesms(event.target.value);
  }

  const handleFacebookChange = (event, value) => {
    console.log(event.target.value);
    setFacebookset(event.target.value);
  }

  const handleTwitterChange = (event, value) => {
    console.log(event.target.value);
    setSiteTwitterset(event.target.value);
  }
  const handleInstagramChange = (event, value) => {
    console.log(event.target.value);
    setSiteInstagramset(event.target.value);
  }

  const handleLinkedInChange = (event, value) => {
    console.log(event.target.value);
    setSiteLinkedInset(event.target.value);
  }

  const handleStatusChange = (event, value) => {
    console.log(event.target.value);
    setSiteLogin(event.target.value);
  }


  const handleRefresh = async () => {
    setLoader(true);
    const { data: res } = await settingService.getSettings();
    const { settings: settingss } = res;
    console.log(settingss.sitename)
    setAdminName(settingss.admin_name);
    setAdminPass(settingss.admin_pass);
    setExplanation(settingss.explanation);
    setType(settingss.type);
    setviewEditImg(true);
    setExam_title(settingss.sitename);
    setSiteurl(settingss.set_url);
    setSitemail(email2);

    var password1 = new Buffer(settingss.setting_fields.set_email, 'base64')
    var email2 = password1.toString();
    console.log(email2)

    setSitemail(email2)
    setSitephone(phone2);
    var password1 = new Buffer(settingss.setting_fields.set_phone, 'base64')
    var phone2 = password1.toString();
    console.log(phone2)

    setSitephone(phone2)
    setSitebpsize(set_bpsize);
    var password1 = new Buffer(settingss.setting_fields.set_bpsize, 'base64')
    var set_bpsize = password1.toString();
    console.log(set_bpsize)

    setSitebpsize(set_bpsize)
    setSitefpsize(set_fpsize);
    var password1 = new Buffer(settingss.setting_fields.set_fpsize, 'base64')
    var set_fpsize = password1.toString();
    console.log(set_fpsize)
    setSitefpsize(set_fpsize)


    setSiteuser(settingss.setting_fields.smsuser);

    setSitesms(sms_enable);
    var password1 = new Buffer(settingss.setting_fields.smsenable, 'base64')
    var sms_enable = password1.toString();
    console.log(sms_enable)
    setSitesms(sms_enable)

    setFacebookset(facebook_settings1);
    var password1 = new Buffer(settingss.setting_fields.facebook_settings, 'base64')
    var facebook_settings1 = password1.toString();
    console.log(facebook_settings1)
    setFacebookset(facebook_settings1)



    setSitepass(settingss.setting_fields.smspass);

    setSiteSenderid(settingss.setting_fields.smssenderid);

    setSiteFacebook(facebook1);
    var password1 = new Buffer(settingss.setting_fields.facebook, 'base64')
    var facebook1 = password1.toString();
    console.log(facebook1)
    setSiteFacebook(facebook1)

    setSiteTwitterset(twitter_settings)
    var password1 = new Buffer(settingss.setting_fields.twitter_settings, 'base64')
    var twitter_settings = password1.toString();
    console.log(twitter_settings)
    setSiteTwitterset(twitter_settings)

    setSiteLinkedInset(LinkedIn_settings)
    var password1 = new Buffer(settingss.setting_fields.LinkedIn_settings, 'base64')
    var LinkedIn_settings = password1.toString();
    console.log(LinkedIn_settings)
    setSiteLinkedInset(LinkedIn_settings)


    setSiteInstagramset(instagram_settings)
    var password1 = new Buffer(settingss.setting_fields.instagram_settings, 'base64')
    var instagram_settings = password1.toString();
    console.log(instagram_settings)
    setSiteInstagramset(instagram_settings)

    setSiteTwitter(twitter1);
    var password1 = new Buffer(settingss.setting_fields.twitter, 'base64')
    var twitter1 = password1.toString();
    console.log(twitter1)
    setSiteTwitter(twitter1)


    setSiteLinkedin(linkedin1);
    var password1 = new Buffer(settingss.setting_fields.linkedin, 'base64')
    var linkedin1 = password1.toString();
    console.log(linkedin1)
    setSiteLinkedin(linkedin1)

    setSiteInstagram(instagram1);
    var password1 = new Buffer(settingss.setting_fields.instagram, 'base64')
    var instagram1 = password1.toString();
    console.log(instagram1)
    setSiteInstagram(instagram1)

    setSiteCssurl(settingss.setting_fields.cssurl);

    setSiteJsurl(jsurl1);
    var password1 = new Buffer(settingss.setting_fields.jsurl, 'base64')
    var jsurl1 = password1.toString();
    console.log(jsurl1)
    setSiteJsurl(jsurl1)

    setSiteSeodescription(seo_description);
    var password1 = new Buffer(settingss.setting_fields.seo_description, 'base64')
    var seo_description = password1.toString();
    console.log(seo_description)
    setSiteSeodescription(seo_description)

    setSiteSeotitle(seo_title);
    var password1 = new Buffer(settingss.setting_fields.seo_title, 'base64')
    var seo_title = password1.toString();
    console.log(seo_title)

    setSiteSeotitle(seo_title)
    setSiteSeokeywords(seo_keywords);
    var password1 = new Buffer(settingss.setting_fields.seo_keywords, 'base64')
    var seo_keywords = password1.toString();
    console.log(seo_keywords)

    setSiteSeokeywords(seo_keywords)
    setSiteLogin(settingss.admin_status)
    setSiteHeaderscript(settingss.setting_fields.header_script);
    setSiteFooterscript(settingss.setting_fields.footer_script);
    const editthumbs = (
      <div style={thumb} key={settingss.setting_banner}>
        <div style={thumbInner}>
          <img alt={settingss.setting_banner}
            src={settingImageDir + '/' + settingss.setting_banner}
            style={img}
          />
        </div>
      </div>
    );
    setEditthumbs(editthumbs);
  }

  const thumbs = files.map(settingbanner => (
    <div style={thumb} key={settingbanner.name}>
      <div style={thumbInner}>
        <img alt={settingbanner.name}
          src={settingbanner.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    //handleRefresh();
    files.forEach(settingbanner => window.webkitURL.revokeObjectURL(settingbanner.preview));
  }, [files]);

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])

  const deleteImage = () => {
    setviewEditImg(false);
  }

  const updateCommonExam = async () => {

    let setfield = {
      set_email: siteemail,
      set_phone: sitephone,
      set_bpsize: sitebpsize,
      set_fpsize: sitefpsize,
      smsuser: siteuser,
      smspass: sitepass,
      smssenderid: sitesenderid,
      facebook: facebook,
      twitter: twitter,
      linkedin: linkedin,
      instagram: instagram,
      cssurl: cssurl,
      jsurl: jsurl,
      smsenable: smsenable,
      seo_title: seotitle,
      seo_description: seodescription,
      seo_keywords: seokeywords,
      header_script: headerscript,
      footer_script: footerscript,
      facebook_settings: facebooksettings,
      twitter_settings: twittersettings,
      instagram_settings: instagramsettings,
      LinkedIn_settings: LinkedInsettings
    }
    const formData = new FormData();
    formData.append("setting_banner_url", files[0]);
    formData.append("sitename", exam_title);
    formData.append("set_url", siteurl);
    formData.append("setting_fields", setfield);
    formData.append("admin_status", adminstatus);
    formData.append("admin_name", adminname);
    formData.append("admin_pass", adminpass);
    formData.append("type", usertype);
    formData.append("explanation", explanation);
    /*let data = {
      sitename: exam_title,
      set_url: siteurl,
      setting_banner: settingbanner,
      setting_fields: setfield,
      admin_status: adminstatus,
      admin_name: adminname,
      admin_pass: adminpass,
      type: usertype,
      explanation: explanation
    }
    console.log(data);*/
    await settingService.updateSettings(formData);

    setAlertMessage('Settings updated successfully!');
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false)
    }, 1500);
    // toggle(false);
  }

  return (

    <div>

      <form className="col-lg-8 d-flex flex-column order-lg-1" style={{ background: "white", marginLeft: "165px" }}>
        <h1>Admin Settings</h1>
        <label style={{ fontWeight: "800" }} required>Site Name:*</label>
        <input type="text" name="sitename" value={exam_title} onChange={(event) => setExam_title(event.target.value)} />


        <p style={{ fontWeight: "800" }}>Site Url(https://must)*</p>
        <input type="text" name="siteurl" value={siteurl} onChange={(event) => setSiteurl(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Support Email:*</p>
        <input type="text" name="siteemail" value={siteemail} onChange={(event) => setSitemail(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Support Phone:*</p>
        <input type="text" name="sitephone" value={sitephone} onChange={(event) => setSitephone(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Backoffice Paging size:*</p>
        <input type="text" name="sitebpsize" value={sitebpsize} onChange={(event) => setSitebpsize(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Frontend Paging size:*</p>
        <input type="text" name="sitefpsize" value={sitefpsize} onChange={(event) => setSitefpsize(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Operator Login:</p>
        <div>
          {/* <input type="radio" id="1" value="Y" checked={adminstatus == "Y"} defaultChecked  name="Enable" />Enable
     <input type="radio" id="2" value="N" checked={adminstatus == "N"}  name="Disable" />Disable */}
          <RadioGroup row aria-label="position" name="sms" value={adminstatus} >
            <FormControlLabel value="Y" value={adminstatus} checked={adminstatus == "Y"}
              onChange={(event, value) => { handleStatusChange(event, value) }} control={<Radio color="primary" />}
              label="Enable" />
            <FormControlLabel value="N" checked={adminstatus == "N"} value={adminstatus} onChange={(event, value) => {
              handleStatusChange(event, value)
            }} control={<Radio color="primary" />}
              label="Disable" />
          </RadioGroup>
        </div>
        <div style={{ background: "#e6e6e6", height: "40px", fontSize: "15px" }}>

          <label htmlFor="name" style={{ marginTop: "8px", marginLeft: "20px" }}>LOGO</label>
        </div>
        <p style={{ fontWeight: "800" }}>Image(200w*200h)</p>




        <div className="dropzone-card">
          {!viewEditImg &&
            <div className="dropzone" >

              <div {...getRootProps({ className: 'dropzone-file-btn' })}>

                <input {...getInputProps()} />

                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </div>
          }
          {viewEditImg == false ? <div className="dropzone-content" style={thumbsContainer}>
            {thumbs}
          </div> :
            <div className="dropzone-content" style={thumbsContainer}>

              {editthumbs}
              <Button onClick={() => deleteImage()} variant="contained" className="jr-btn bg-danger text-white">
                <i className="zmdi zmdi-delete zmdi-hc-fw" />
              </Button>

            </div>}

        </div>
        {/* <div><h6 style={{ color: 'red', paddingTop: '1%' }}>{errors['schoolLogo']}</h6></div> */}

        <div style={{ background: "#e6e6e6", height: "40px", fontSize: "15px", marginTop: "20px" }}>

          <label htmlFor="name" style={{ marginTop: "8px", marginLeft: "20px" }} >SMS Gateway</label>
        </div>
        <p style={{ fontWeight: "800" }}>SMS:</p>
        <div >
          {/* <input type="radio" id="3" value="Y" checked={smsenable == "Y"}   name="Enable" />Enable
     <input type="radio" id="4" value="N" checked={smsenable == "N"}  name="Disable" />Disable */}
          <RadioGroup row aria-label="position" name="sms" defaultValue={smsenable} >
            <FormControlLabel value="N" checked={smsenable == "N"} defaultValue={smsenable}
              onChange={(event, value) => { handleCountryChange(event, value) }} control={<Radio color="primary" />}
              label="Disable" />
            <FormControlLabel value="Y" checked={smsenable == "Y"} defaultValue={smsenable} onChange={(event, value) => {
              handleCountryChange(event, value)
            }} control={<Radio color="primary" />}
              label="Enable" />
          </RadioGroup>
        </div>

        <p style={{ fontWeight: "800" }}>Username:</p>
        <input type="text" name="siteuser" value={siteuser} onChange={(event) => setSiteuser(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Password:</p>
        <input type="text" name="sitepass" value={sitepass} onChange={(event) => setSitepass(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Sender ID:</p>
        <input type="text" name="sitesenderid" value={sitesenderid} onChange={(event) => setSiteSenderid(event.target.value)} />
        <div style={{ background: "#e6e6e6", height: "40px", fontSize: "15px", marginTop: "20px" }}>

          <label htmlFor="name" style={{ marginTop: "8px", marginLeft: "20px" }} >Social Media</label>
        </div>
        <p style={{ fontWeight: "800" }}>Facebook(https://must)</p>
        <input style={{ height: "45px" }} rows="3" value={facebook} onChange={(event) => setSiteFacebook(event.target.value)}></input>
        <p style={{ fontWeight: "800" }}>Facebook frontend display:</p>
        <div>
          {/* <input type="radio" value="Y" checked={facebooksettings == "Y"} defaultChecked   name="Enable" />Enable
     <input type="radio" value="N" checked={facebooksettings == "N"}  name="Disable" />Disable */}
          <RadioGroup row aria-label="position" name="facebook" defaultValue={facebooksettings} >
            <FormControlLabel value="Y" defaultValue={facebooksettings} checked={facebooksettings == "Y"}
              onChange={(event, value) => { handleFacebookChange(event, value) }} control={<Radio color="primary" />}
              label="Enable" />
            <FormControlLabel value="N" defaultValue={facebooksettings} checked={facebooksettings == "N"} onChange={(event, value) => {
              handleFacebookChange(event, value)
            }} control={<Radio color="primary" />}
              label="Disable" />
          </RadioGroup>
        </div>
        <p style={{ fontWeight: "800" }}>Twitter(https://must)</p>
        <input style={{ height: "45px" }} rows="3" value={twitter} onChange={(event) => setSiteTwitter(event.target.value)}></input>
        <p style={{ fontWeight: "800" }}>Twitter frontend display</p>
        <div>
          {/* <input type="radio" value="Y" checked={twittersettings == "Y"} defaultChecked  name="Enable" />Enable
     <input type="radio" value="N" checked={twittersettings == "N"}  name="Disable" />Disable */}
          <RadioGroup row aria-label="position" name="Twitter" defaultValue={twittersettings} >
            <FormControlLabel value="Y" defaultValue={twittersettings} checked={twittersettings == "Y"}
              onChange={(event, value) => { handleTwitterChange(event, value) }} control={<Radio color="primary" />}
              label="Enable" />
            <FormControlLabel value="N" defaultValue={twittersettings} checked={twittersettings == "N"} onChange={(event, value) => {
              handleTwitterChange(event, value)
            }} control={<Radio color="primary" />}
              label="Disable" />
          </RadioGroup>
        </div>
        <p style={{ fontWeight: "800" }}>Linked In+(https://must)</p>
        <input style={{ height: "45px" }} rows="3" value={linkedin} onChange={(event) => setSiteLinkedin(event.target.value)}></input>
        <p style={{ fontWeight: "800" }}>Linked In+ frontend display</p>
        <div>
          {/* <input type="radio" value="Y" checked={LinkedInsettings == "Y"} defaultChecked  name="Enable" />Enable
     <input type="radio" value="N" checked={LinkedInsettings == "N"}  name="Disable" />Disable */}
          <RadioGroup row aria-label="position" name="Linked In" defaultValue={LinkedInsettings} >
            <FormControlLabel value="Y" defaultValue={LinkedInsettings} checked={LinkedInsettings == "Y"}
              onChange={(event, value) => { handleLinkedInChange(event, value) }} control={<Radio color="primary" />}
              label="Enable" />
            <FormControlLabel value="N" defaultValue={LinkedInsettings} checked={LinkedInsettings == "N"} onChange={(event, value) => {
              handleLinkedInChange(event, value)
            }} control={<Radio color="primary" />}
              label="Disable" />
          </RadioGroup>
        </div>

        <p style={{ fontWeight: "800" }}>Instagram(https://must)</p>
        <input style={{ height: "45px" }} rows="3" value={instagram} onChange={(event) => setSiteInstagram(event.target.value)}></input>
        <p style={{ fontWeight: "800" }}>Instagram+ frontend display</p>
        <div>
          {/* <input type="radio" value="Y" checked={instagramsettings == "Y"} defaultChecked  name="Enable" />Enable
     <input type="radio" value="N" checked={instagramsettings == "N"}  name="Disable" />Disable */}
          <RadioGroup row aria-label="position" name="Instagram" defaultValue={instagramsettings} >
            <FormControlLabel value="Y" defaultValue={instagramsettings} checked={instagramsettings == "Y"}
              onChange={(event, value) => { handleInstagramChange(event, value) }} control={<Radio color="primary" />}
              label="Enable" />
            <FormControlLabel value="N" defaultValue={instagramsettings} checked={instagramsettings == "N"} onChange={(event, value) => {
              handleInstagramChange(event, value)
            }} control={<Radio color="primary" />}
              label="Disable" />
          </RadioGroup>
        </div>
        <p style={{ fontWeight: "800" }} >CSS URL(https://must)</p>
        <input type="text" name="cssurl" value={cssurl} onChange={(event) => setSiteCssurl(event.target.value)} />
        <p style={{ fontWeight: "800" }}>JS URL(https://must)</p>
        <input type="text" name="sitename" value={jsurl} onChange={(event) => setSiteJsurl(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Title</p>
        <input type="text" name="sitename" value={seotitle} onChange={(event) => setSiteSeotitle(event.target.value)} />
        <p style={{ fontWeight: "800" }}>Description</p>
        <input type="text" name="sitename" value={seodescription} onChange={(event) => setSiteSeodescription(event.target.value)} />
        <p>Keywords</p>
        <input type="text" name="sitename" value={seokeywords} />
        <div style={{ background: "#e6e6e6", height: "40px", fontSize: "15px", marginTop: "20px" }}>

          <label htmlFor="name" >Extra scripts</label>
        </div>
        <p style={{ fontWeight: "800" }}>Header scripts</p>
        <input style={{ height: "75px" }} rows="3" value={headerscript} onChange={(event) => setSiteHeaderscript(event.target.value)}></input>
        <p style={{ fontWeight: "800" }}>Footer scripts</p>
        <input style={{ height: "75px" }} rows="3" value={footerscript} onChange={(event) => setSiteFooterscript(event.target.value)}></input>
        {<ModalFooter>

          <div className="d-flex flex-row">
            <Button onClick={() => updateCommonExam()} variant="contained" color="primary" className="jr-btn text-white">
              Update
                                </Button>

          </div>
        </ModalFooter>}
      </form>

    </div>

  );

}




export default Settingsview;