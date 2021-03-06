import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard";
import Widgets from "./widgets";
import Metrics from "./metrics";
import Components from "./components";
import Icons from "./icons";
import Form from "./form";
import Editors from "./editors";
import Pickers from "./pickers";
import Extensions from "./extensions";
import Table from "./table";
import Chart from "./charts";
import Map from "./map";
import Calendar from "./calendar";
import TimeLine from "./timeLine";
import CustomViews from "./customViews";
import ExtraElements from "./extraElements";
import eCommerce from "./eCommerce";
import AppModule from "./appModule";
import ExtraPages from "./extraPages";
import asyncComponent from "../../util/asyncComponent";
import MenuLevels from "./menuLevels";
import SocialApps from "./socialApps";
import { withRouter } from "react-router";
import HomeCategory from "./homecategory";
import DashboardCategory from "./dashboardCategory";
import ExaminationCalendar from "./examinationCalendar";
//import Announcements from "./announcements";
import StateCategory from "./statecategory";
import CityCategory from "./citycategory";
import Settings from "./settings";
import Addschool from "./addschool";
import Students from "./students";
import ChangePassword from "./changepassword";
import ExamMainCategory from "./exammaincategory";
import ExamSubCategory from "./examsubcategory";
import AdminFaculty from "./adminfaculty";
import QbankMainCategory from "./qbankmaincategory";
import QbankSubCategory from "./qbanksubcategory";
import HomeDashboard from "./homedashboard";
import StaffAssign from "./staffassign";
import AddEditQuestion from "./addeditquestion";
import AddEditPassage from "./addeditpassage";
import QuestionsView from "./questionsview";
import Reports from "./reports";
import AdminReports from "./adminreport";
import ExamPackage from "./exampackage";
import Coupon from "./coupon";
import Examreport from "./examreport";
import StudyMaterials from "./studyMaterials";

const Routes = ({ match }) =>
    <Switch>
        <Route path={`${match.url}/dashboard`} component={Dashboard} />
        <Route path={`${match.url}/social-apps`} component={SocialApps} />
        <Route path={`${match.url}/components`} component={Components} />
        <Route path={`${match.url}/icons`} component={Icons} />
        <Route path={`${match.url}/form`} component={Form} />
        <Route path={`${match.url}/editor`} component={Editors} />
        <Route path={`${match.url}/pickers`} component={Pickers} />
        <Route path={`${match.url}/extensions`} component={Extensions} />
        <Route path={`${match.url}/table`} component={Table} />
        <Route path={`${match.url}/chart`} component={Chart} />
        <Route path={`${match.url}/map`} component={Map} />
        <Route path={`${match.url}/calendar`} component={Calendar} />
        <Route path={`${match.url}/time-line`} component={TimeLine} />
        <Route path={`${match.url}/custom-views`} component={CustomViews} />
        <Route path={`${match.url}/homecategory`} component={HomeCategory} />
        <Route path={`${match.url}/dashboardCategory`} component={DashboardCategory} />
        <Route path={`${match.url}/examinationCalendar`} component={ExaminationCalendar} />
        {/* <Route path={`${match.url}/announcements`} component={Announcements} /> */}
        <Route path={`${match.url}/statecategory`} component={StateCategory} />
        <Route path={`${match.url}/citycategory`} component={CityCategory} />
        <Route path={`${match.url}/settings`} component={Settings} />
        <Route path={`${match.url}/students`} component={Students} />
        <Route path={`${match.url}/changepassword`} component={ChangePassword} />
        <Route path={`${match.url}/exammaincategory`} component={ExamMainCategory} />
        <Route path={`${match.url}/examsubcategory`} component={ExamSubCategory} />
        <Route path={`${match.url}/adminfaculty`} component={AdminFaculty} />
        <Route path={`${match.url}/qbankmaincategory`} component={QbankMainCategory} />
        <Route path={`${match.url}/qbanksubcategory`} component={QbankSubCategory} />
        <Route path={`${match.url}/qbanksubcategory/addeditquestion`} component={QbankSubCategory} />
        <Route path={`${match.url}/addschool`} component={Addschool} />
        <Route path={`${match.url}/widgets`} component={Widgets} />
        <Route path={`${match.url}/metrics`} component={Metrics} />
        <Route path={`${match.url}/extra-elements`} component={ExtraElements} />
        <Route path={`${match.url}/ecommerce`} component={eCommerce} />
        <Route path={`${match.url}/app-module`} component={AppModule} />
        <Route path={`${match.url}/menu-levels`} component={MenuLevels} />
        <Route path={`${match.url}/homedashboard`} component={HomeDashboard} />
        <Route path={`${match.url}/staffassign`} component={StaffAssign} />
        <Route path={`${match.url}/addeditquestion`} component={AddEditQuestion} />
        <Route path={`${match.url}/addeditpassage`} component={AddEditPassage} />
        <Route path={`${match.url}/questionsview`} component={QuestionsView} />
        <Route path={`${match.url}/reports`} component={Reports} />
        <Route path={`${match.url}/adminreport`} component={AdminReports} />
        <Route path={`${match.url}/exampackage`} component={ExamPackage} />
        <Route path={`${match.url}/coupon`} component={Coupon} />
        <Route path={`${match.url}/examreport`} component={Examreport} />
        <Route path={`${match.url}/studyMaterials`} component={StudyMaterials} />

        <Route path={`${match.url}/to-do`}
            component={asyncComponent(() => import("./todo/basic"))} />
        <Route path={`${match.url}/to-do-redux`}
            component={asyncComponent(() => import("./todo/redux"))} />
        <Route path={`${match.url}/mail`}
            component={asyncComponent(() => import("./mail/basic"))} />
        <Route path={`${match.url}/mail-redux`}
            component={asyncComponent(() => import("./mail/redux"))} />
        <Route path={`${match.url}/chat`}
            component={asyncComponent(() => import("./chatPanel/basic"))} />
        <Route path={`${match.url}/chat-redux`}
            component={asyncComponent(() => import("./chatPanel/redux"))} />
        <Route path={`${match.url}/contact`}
            component={asyncComponent(() => import("./contact/basic"))} />
        <Route path={`${match.url}/contact-redux`}
            component={asyncComponent(() => import("./contact/redux"))} />
        <Route path={`${match.url}/extra-pages`} component={ExtraPages} />
        <Route component={asyncComponent(() => import("app/routes/extraPages/routes/404"))} />
    </Switch>;


export default withRouter(Routes);
