import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar'
import { useDispatch } from 'react-redux'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { userSignOut } from 'actions/Auth';
import IntlMessages from 'util/IntlMessages';
import auth from '../../services/authService';
import { logoImageDir } from "../../config";

const UserInfo = () => {

  const dispatch = useDispatch();

  const [anchorE1, setAnchorE1] = useState(null);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState();
  const [logosrc, setLogoSrc] = useState();

  const handleClick = event => {
    setOpen(true);
    setAnchorE1(event.currentTarget);
  };


  const handleRefresh = async () => {
    let user = auth.getCurrentUser();
    if (user) {
      setProfile(user.user.name);
      console.log(user.user);
      if (user.user.logintype == 'G') {
        setLogoSrc(require('assets/images/' + user.user.logo));
      } else {
        setLogoSrc(logoImageDir + '/' + user.user.logo);
      }
    }
  }


  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])



  const handleRequestClose = () => {
    setOpen(false);
  };

  return (
    <div className="user-profile d-flex flex-row align-items-center">
      <img src={logosrc} style={{ width: '50px', height: '50px', marginRight: '2%' }} alt="QC" title="QC" />
      <div className="user-detail">
        <h4 className="user-name d-flex" onClick={handleClick}><span className='text-truncate'>{profile}</span> <i
          className="zmdi zmdi-caret-down zmdi-hc-fw align-middle" />
        </h4>
      </div>
      <Menu className="user-info"
        id="simple-menu"
        anchorEl={anchorE1}
        open={open}
        onClose={handleRequestClose}
        PaperProps={{
          style: {
            minWidth: 120,
            paddingTop: 0,
            paddingBottom: 0
          }
        }}
      >
        <MenuItem onClick={handleRequestClose}>
          <i className="zmdi zmdi-account zmdi-hc-fw mr-2" />
          <IntlMessages id="popup.profile" />
        </MenuItem>
        <MenuItem onClick={handleRequestClose}>
          <i className="zmdi zmdi-settings zmdi-hc-fw mr-2" />
          <IntlMessages id="popup.setting" />
        </MenuItem>
        <MenuItem onClick={() => {
          handleRequestClose();
          dispatch(userSignOut());
        }}>
          <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-2" />

          <IntlMessages id="popup.logout" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserInfo;


