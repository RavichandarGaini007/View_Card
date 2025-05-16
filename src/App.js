import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./component/Profile";
import Home from "./component/Home";
import EmployeeProfile from "./component/Employee-profile";
import EmployeeProfileMob from "./component/Employee-profile-mob";
import GenericBrandDetails from "./component/GenericBrandDetails";
import ShowPdf from "./component/ShowPdf";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile/:employeeCode" element={<EmployeeProfile />}></Route>
        <Route path="/profilemob/:employeeCode" element={<EmployeeProfileMob />}></Route>
        <Route path=":employeeCode" element={<Profile />}></Route>
        <Route path="/genericBrands" element={<GenericBrandDetails />}></Route>
        <Route path="/invoice_view/param1/:invoiceno" element={<ShowPdf />}></Route>
      </Routes>
    </div>
  );
}

export default App;
