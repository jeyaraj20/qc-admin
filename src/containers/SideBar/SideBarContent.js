import React, { useEffect, useState } from 'react';
import CustomScrollbars from 'util/CustomScrollbars';
import Navigation from "../../components/Navigation";
import auth from "../../services/authService";
import * as menuservice from "../../services/adminService";

const SideBarContent = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    let { user } = auth.getCurrentUser();
    async function fetchData() {
      await handleRefresh()
    }
    fetchData();
    loadNavigations(user)
  }, [])

  const handleRefresh = async () => {
    const { data: res } = await menuservice.getUserMenu();
    const { Adminmenu: Adminmenu } = res;
    mapMenus(Adminmenu);
  }


  const mapMenus = (rows) => {
    let { user } = auth.getCurrentUser();
    let navigationMenus = []; // fields in required order
    navigationMenus = [
      {
        name: 'sidebar.qcmain',
        type: 'section',
        children: [
          {
            name: 'sidebar.qchome',
            type: 'item',
            icon: 'view-dashboard',
            link: '/app/homedashboard/dashboard'
          }
        ]
      },
    ];

    if (user.logintype !== "G") rows = rows.filter(r => { return r.menu_title_apiname !== "sidebar.studyMaterials" });

    rows.map(obj => {
      let rowdata = {
        name: obj.menu_title_apiname,
        type: 'item',
        icon: obj.menu_icon,
        link: obj.menu_link
      }
      navigationMenus[0].children.push(rowdata);
    });

    let changepassword = {
      name: 'sidebar.qcchangepassword',
      type: 'item',
      icon: 'lock-open',
      link: '/app/changepassword/view'
    };
    navigationMenus[0].children.push(changepassword);
    setMenu(navigationMenus);
  }


  const loadNavigations = (user) => {
    let navigationMenus = [];
    navigationMenus = [
      {
        name: 'sidebar.qcmain',
        type: 'section',
        children: [
          {
            name: 'sidebar.qchome',
            type: 'item',
            icon: 'view-dashboard',
            link: '/app/homedashboard/dashboard'
          },
          {
            name: 'sidebar.qcchangepassword',
            type: 'item',
            icon: 'lock-open',
            link: '/app/changepassword/view'
          }
        ]
      },
    ];

    let menudata = {
      name: 'sidebar.qcsettings',
      type: 'item',
      icon: 'settings',
      link: '/app/settings/view'
    };
    navigationMenus[0].children.push(menudata);
  }

  return (
    <CustomScrollbars className=" scrollbar">
      <Navigation menuItems={menu} />
    </CustomScrollbars>
  );
};

export default SideBarContent;
