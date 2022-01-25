import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import {
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGithubSignIn,
  userGoogleSignIn,
  userSignIn,
  userTwitterSignIn
} from 'actions/Auth';

const SignIn = (props) => {

  const [loginId, setloginId] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('S');
  const [logintype, setLoginType] = useState('G');
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage, authUser } = useSelector(({ auth }) => auth);

  const handleType = (e) => {
    setType(e.target.value);
};

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      props.history.push('/');
    }
  }, [showMessage, authUser, props.history, dispatch]);


  return (
    <div
      className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
      <div className="app-login-main-content">

        <div className="app-logo-content d-flex align-items-center justify-content-center">
          <Link className="logo-lg" to="/" title="Jambo">
            <img src={require("assets/images/favicon.png")} alt="jambo" title="jambo" />
          </Link>
        </div>

        <div className="app-login-content">
          <div className="app-login-header mb-4">
            <h1><IntlMessages id="appModule.company" /></h1>
          </div>

          <div className="app-login-form">
            <form>
              <fieldset>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    className="d-flex flex-row"
                    aria-label="logintype"
                    name="logintype"
                    value={type}
                    onChange={(e) => handleType(e)}
                  >
                    <FormControlLabel value="S" control={<Radio color="primary" />} label="Super Admin" />
                    <FormControlLabel value="A" control={<Radio color="primary" />} label="Admin" />
                    <FormControlLabel value="O" control={<Radio color="primary" />} label="Faculty" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  label={<IntlMessages id="appModule.loginid" />}
                  fullWidth
                  onChange={(event) => setloginId(event.target.value)}
                  margin="normal"
                  className="mt-1 my-sm-3"
                />
                <TextField
                  type="password"
                  label={<IntlMessages id="appModule.password" />}
                  fullWidth
                  onChange={(event) => setPassword(event.target.value)}
                  defaultValue={password}
                  margin="normal"
                  className="mt-1 my-sm-3"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <Button onClick={() => {
                    dispatch(showAuthLoader());
                    dispatch(userSignIn({ loginId, password, type,logintype }));
                  }} variant="contained" color="primary">
                    <IntlMessages id="appModule.signIn" />
                  </Button>

                  <Link to="/insignin">
                    <IntlMessages id="appModule.school"/>
                  </Link>


                </div>


              </fieldset>
            </form>
          </div>
        </div>

      </div>
      {
        loader &&
        <div className="loader-view">
          <CircularProgress />
        </div>
      }
      {showMessage && NotificationManager.error(alertMessage)}
      <NotificationContainer />
    </div>
  );
};


export default SignIn;
