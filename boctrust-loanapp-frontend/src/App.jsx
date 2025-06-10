import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import Home from "./components/homepage/Home";
import About from "./components/aboutpage/About";
import OurBoardPage from "./components/aboutpage/OurBoardPage";
import Contact from "./components/contactpage/Contact";
import Blogs from "./components/blogpage/Blogs";
import Blog from "./components/blogpage/Blog";
import Loan from "./components/loanapplication/Loan";
import Support from "./components/supportpage/Support";
import Career from "./components/careerpage/Career";
import Dashboard from "./components/dashboard/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";

// our product
import RegularSavings from "./components/ourproductpage/RegularSavings";
import TargetSavings from "./components/ourproductpage/TargetSavings";
import AjoPlusAccount from "./components/ourproductpage/AjoPlusAccount";
import FixedDeposit from "./components/ourproductpage/FixedDeposit";
import InvestmentNote from "./components/ourproductpage/InvestmentNote";
import SalaryAdvance from "./components/ourproductpage/SalaryAdvance";
import PersonalLoan from "./components/ourproductpage/PersonalLoan";
import SmeLoan from "./components/ourproductpage/SmeLoan";
import AssetBackedFinancing from "./components/ourproductpage/AssetBackedFinancing";
import SmallBusinessAdvisory from "./components/ourproductpage/SmallBusinessAdvisory";
import MicroInsuranceAdvisory from "./components/ourproductpage/MicroInsuranceAdvisory";
import FinancialAdvisory from "./components/ourproductpage/FinancialAdvisory";

// terms and conditions
import LoanTerms from "./components/terms&condition/LoanTerms";
import PrivacyPolicy from "./components/terms&condition/PrivacyPolicy";
import TermsCondition from "./components/terms&condition/TermsCondition";
import LoanForm from "./components/loanapplication/loanform/LoanForm";
import Login from "./components/dashboard/login/Login";
import PasswordReset from "./components/dashboard/login/PasswordReset";
import BaseLayout from "./layouts/BaseLayout";
import JobApplicationForm from "./components/careerpage/JobApplicationForm";
import { ToastContainer } from "react-toastify";

// toast styles
import "react-toastify/dist/ReactToastify.css";
import { useAxiosInterceptor } from "./lib/axios";

// Google analytics
import {
  initializeGA,
  logPageView,
} from "./components/dashboard/admindashboard/generalSetting/analytics";
import { useSelector } from "react-redux";
import { acceptConsentCookie, rejectConsentCookie } from "./services/cookie";

function App() {
  const currentUser = useSelector((state) => state.adminAuth.user);

  // Google analytics
  useEffect(() => {
    initializeGA(import.meta.env.VITE_GA_TRACKING_ID); // Replace with your GA Tracking ID
    logPageView(window.location.pathname);
  }, []);

  useAxiosInterceptor();

  return (
    <>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-login" element={<Login />} />
          <Route path="/reset-password/:token" element={<PasswordReset />} />
          <Route path="/about" element={<About />} />
          <Route path="/board" element={<OurBoardPage />} />
          <Route path="/regular-savings" element={<RegularSavings />} />
          <Route path="/target-savings" element={<TargetSavings />} />
          <Route path="/ajo-plus-account" element={<AjoPlusAccount />} />
          <Route path="/fixed-investment" element={<FixedDeposit />} />
          <Route path="/investment-note" element={<InvestmentNote />} />
          <Route path="/salary-advance" element={<SalaryAdvance />} />
          <Route path="/personal-loan" element={<PersonalLoan />} />
          <Route path="/sme-loan" element={<SmeLoan />} />
          <Route
            path="/asset-backed-financing"
            element={<AssetBackedFinancing />}
          />
          <Route
            path="/small-business-advisory"
            element={<SmallBusinessAdvisory />}
          />
          <Route
            path="/micro-insurance-advisory"
            element={<MicroInsuranceAdvisory />}
          />
          <Route path="/financial-advisory" element={<FinancialAdvisory />} />

          <Route path="/loan" element={<Loan />} />
          <Route path="/app/nibbs-login" element={<LoanForm />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:title" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/jobs-application" element={<JobApplicationForm />} />

          {/* terms and conditions */}
          <Route path="/terms" element={<TermsCondition />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/loanterms" element={<LoanTerms />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ScrollToTop />
      <ToastContainer />
      {!currentUser && (
        <CookieConsent
          onAccept={acceptConsentCookie}
          onDecline={rejectConsentCookie}
          enableDeclineButton
          declineButtonText="I Decline"
          declineButtonStyle={{
            fontSize: "18px",
            background: "gray  ",
            borderRadius: "5px",
          }}
          location="bottom"
          buttonText="Accept All"
          cookieName="boctrustConsentCookie"
          style={{ background: "#145088" }}
          buttonStyle={{
            color: "#fff",
            fontSize: "18px",
            background: "#ecaa00",
            borderRadius: "5px",
          }}
          expires={90}
        >
          Welcome to Boctrust Micro Finance Bank! To provide you with the best
          possible experience, our website uses cookies. By clicking &#34;Accept
          All&#34; you agree to our <a href="/privacy">Privacy Policy</a>
        </CookieConsent>
      )}
    </>
  );
}

export default App;
