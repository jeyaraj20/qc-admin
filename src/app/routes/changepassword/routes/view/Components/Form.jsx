import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as adminService from '../../../../../../services/adminService';
import auth from '../../../../../../services/authService';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Joi from 'joi-browser';

const ChangePasswordForm = (props) => {
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userLoginType, setUserLoginType] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  const schema = {
    OldPassword: Joi.string().required(),
    NewPassword: Joi.string().min(5).required(),
    ConfirmPassword: Joi.string().required(),
  }

  const valiadateProperty = (e) => {
    let { name, value, className } = e.currentTarget;
    const obj = { [name]: value };
    const filedSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, filedSchema);

    let message = error ? error.details[0].message : null;
    setErrors({ ...errors, [name]: message, "errordetails": null })
  }

  const handleRefresh = async () => {
    setLoader(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    let user = auth.getCurrentUser();
    console.log(user);
    setUserName(user.user.name);
    setUserType(user.user.type);
    setUserLoginType(user.user.logintype);
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  }

  const onOldPasswordChange = (oldpassword) => {
    setOldPassword(oldpassword);
  }

  const onNewPasswordChange = (newpassword) => {
    setNewPassword(newpassword);
  }

  const onConfirmPasswordChange = (confirmpassword) => {
    setConfirmPassword(confirmpassword);
  }

  const changePassword = async () => {
    if (newPassword != confirmPassword) {
      setErrors({ ...errors, ['ConfirmPassword']: 'Confirm Password must match New Password', "errordetails": null })
    } else {
      if (oldPassword &&
        newPassword &&
        confirmPassword &&
        errors['ConfirmPassword'] === null &&
        errors['NewPassword'] === null &&
        errors['OldPassword'] === null) {
        try {
          let obj = {};
          obj.oldpassword = oldPassword;
          obj.newpassword = newPassword;
          obj.type = userType;
          obj.logintype = userLoginType;
          let res = await adminService.changePassword(obj);
          console.log(res);
          setAlertMessage('Password Changed Successfully');
          await handleRefresh();
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } catch (err) {
          console.log(err.response.data.error.message);
          setAlertMessage(err.response.data.error.message);
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      } else {
        console.log(errors);
        if (errors['ConfirmPassword'] != null ||
          errors['NewPassword'] != null ||
          errors['OldPassword'] != null) {
          setAlertMessage('Please Check the errors');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        } else {
          setAlertMessage('Please Give All Required Fields');
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false)
          }, 1500);
        }
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])


  return (
    <>
      <div style={{ marginBottom: '0rem', padding: '10px 30px', borderRadius: '0rem', backgroundColor: '#eee' }} className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
        <h2 className="title mb-3 mb-sm-0">Change Password</h2>
      </div>
      <div style={{ padding: '5%' }} className="col-12">
        {loader &&
          <div className="loader-view w-100"
            style={{ height: 'calc(100vh - 120px)' }}>
            <CircularProgress />
          </div>
        }
        {!loader &&
          <div>
            <div className="row no-gutters">
              <div className="col-lg-12 d-flex flex-column order-lg-1">
                <TextField
                  required
                  disabled={true}
                  id="required"
                  label={'Username'}
                  name={'Username'}
                  defaultValue={userName}
                  margin="none" />
                <TextField
                  required
                  autoComplete={'off'}
                  id="required"
                  type={'password'}
                  label={'Old Password'}
                  name={'OldPassword'}
                  onChange={(event) => onOldPasswordChange(event.target.value)}
                  onBlur={valiadateProperty}
                  value={oldPassword}
                  margin="normal" />
                <h6 style={{ color: 'red' }}>{errors['OldPassword']}</h6>
                <TextField
                  required
                  autoComplete={'off'}
                  id="required"
                  type={'password'}
                  label={'New Password'}
                  name={'NewPassword'}
                  onChange={(event) => onNewPasswordChange(event.target.value)}
                  onBlur={valiadateProperty}
                  value={newPassword}
                  margin="normal" />
                <h6 style={{ color: 'red' }}>{errors['NewPassword']}</h6>
                <TextField
                  required
                  type={'password'}
                  autoComplete={'off'}
                  id="required"
                  label={'Confirm Password'}
                  name={'ConfirmPassword'}
                  onChange={(event) => onConfirmPasswordChange(event.target.value)}
                  onBlur={valiadateProperty}
                  value={confirmPassword}
                  margin="normal" />
                <h6 style={{ color: 'red' }}>{errors['ConfirmPassword']}</h6>
                <div style={{ paddingTop: '2%', textAlign: 'center' }} className="col-lg-12 col-sm-12 col-12">
                  <Button onClick={() => changePassword()} variant="contained" color="primary" className="jr-btn text-white">Submit</Button>
                </div>
              </div>
            </div>
            <Snackbar
              className="mb-3 bg-info"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={showMessage}
              message={alertMessage}
            />
          </div>
        }
      </div>
    </>
  );
};

export default ChangePasswordForm;