import React, { useEffect, useState } from 'react';
import CardBox from "components/CardBox/index";
import * as adminService from '../../../../../services/adminService';
import * as questionService from '../../../../../services/questionService';
import { withRouter } from 'react-router-dom';
import auth from '../../../../../services/authService';

function hexToRgb(hex, alpha) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
  let g = parseInt(hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
  let b = parseInt(hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }
  else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}

const HomeDashboardView = props => {
  const [menu, setMenu] = useState([])
  const [quesCount, setQuesCount] = useState('')

  const editRow = menulink => {
    props.history.push(menulink);
  }

  const handleRefresh = async () => {
    let user = auth.getCurrentUser();
    console.log(user.user.logintype);
    const { data: res } = await adminService.getUserMenu();
    const { Adminmenu: menures } = res;
    console.log(menures);
    const { data: countres } = await questionService.getQuestionsCount();
    const { count: count } = countres;
    setQuesCount(count);
    let menuArr = [];
    for (let menu of menures) {
      menuArr.push(<div className="col-sm-3 col-12">
        <div className="animated slideInUpTiny animation-duration-3">
          <div style={{ cursor: 'pointer' }} onClick={() => { editRow(menu.menu_link) }} className="jr-card net-chart">
            <div className="jr-card-thumb"
              style={{
                backgroundColor: '#007bff',
                boxShadow: `0 6px 20px 0 ${hexToRgb('#007bff', 0.19)},0 8px 17px 0 ${hexToRgb('#007bff', 0.20)}`
              }}>
              <i className={`zmdi zmdi-${menu.menu_icon}`} />
            </div>
            <div className="jr-card-body br-break">
              <h6 className="mb-0"><strong>{menu.menu_title}</strong></h6>
            </div>
          </div>
        </div>
      </div>);
    }
    setMenu(menuArr);
  }

  useEffect(() => {
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
  }, [])

  return (
    <>
      <div className="row">
        <div style={{ marginLeft: '1%' }} className="col-sm-12 col-12">
          <h3 className="entry-heading">{'Dashboard'}</h3>
        </div>
        {menu}
      </div>
      <div className="row">
        <div style={{ marginLeft: '1%' }} className="col-sm-12 col-12">
          <h3 className="entry-heading">{'Question Details'}</h3>
        </div>
        <div className="col-sm-3 col-12">
          <div className="animated slideInUpTiny animation-duration-3">
            <div style={{ cursor: 'pointer' }} className="jr-card net-chart">
              <div className="jr-card-thumb"
                style={{
                  backgroundColor: '#ff9800',
                  boxShadow: `0 6px 20px 0 ${hexToRgb('#ff9800', 0.19)},0 8px 17px 0 ${hexToRgb('#ff9800', 0.20)}`
                }}>
                <i className={`zmdi zmdi-file-text`} />
              </div>
              <div className="jr-card-body br-break">
                <h1 className="mb-0"><strong>{quesCount}</strong></h1>
                <p className="mb-0">{'Total Questions'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(HomeDashboardView);