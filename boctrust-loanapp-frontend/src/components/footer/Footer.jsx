import PropTypes from "prop-types"
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { LinkedIn } from "@mui/icons-material";
import "./Footer.css";

const Footer = ({ settings }) => {
  // const { address, copyrightText, email, phoneNumber1, phoneNumber2, footerText } = settings;

  return (
    <footer className="container-fluid Footer">
      <div className="row FooterTop">
        <div className="col-md-3 col-sm-12">
          <h6 className="FooterHeadline">Quick Links</h6>
          <ul>
            <li>
              <Link className="Link" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="Link" to="/terms">
                Terms and Condition
              </Link>
            </li>
            <li>
              <img
                src="/images/ssl.png"
                alt="ssl-cert"
                style={{ marginLeft: "-25px" }}
              />
            </li>
          </ul>

          <h6 className="FooterHeadline">About</h6>
          <p>
            {settings?.footerText
              ? settings?.footerText
              : "BOCTRUST MICROFINANCE BANK Limited is a financial institution licensed by Central Bank of Nigeria to gives social and economic Support to the lower middle class, working class and the economically active poor."}
          </p>
        </div>
        <div className="col-md-6 col-sm-12 Link CompanyLinks">
          <h6 className="FooterHeadline">Company Links</h6>
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li>
                  <Link className="Link" to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/about">
                    About App
                  </Link>
                </li>
                <li>
                  <Link
                    className="Link"
                    to="/regular-savings"
                  >
                    Our Product
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/about">
                    Team
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/loan">
                    Loans
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul>
                <li>
                  <Link className="Link" to="/loan">
                    Account Opening
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/careers">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/blogs">
                    Blogs
                  </Link>
                </li>

                <li>
                  <Link className="Link" to="/support">
                    Support
                  </Link>
                </li>
                <li>
                  <Link className="Link" to="/login">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-12">
          <h6 className="FooterHeadline">Contact Info</h6>
          <p>
            Address:
            <br />
            {settings?.address ? settings.address : "1st floor, 26 Moloney street, Onikan."}
          </p>
          <p>
            Phone:
            <br />
            {settings?.phoneNumber1 ? settings?.phoneNumber1 : "08177773196"} <br />
            {settings?.phoneNumber2 ? settings?.phoneNumber2 : "08076710000"}
          </p>
          <p>
            Email:
            <br />
            {settings?.email ? settings?.email : "enquiry@boctrustmfb.com"}
          </p>
          <div>
            <p>Connect On Social Media</p>
            <div className="SocialContainer">
              <div className="SocialMedia">
                <a
                  href="https://www.facebook.com/pages/Boctrust%20Microfinance%20Bank/1188460931185967/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FacebookIcon />
                </a>
              </div>
              <div className="SocialMedia">
                <a
                  href="https://www.twitter.com/boctrustmfb"
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon />
                </a>
              </div>
              <div className="SocialMedia">
                <a
                  href="https://www.linkedin.com/company/boctrustmfb/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedIn />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="FooterBottom row">
        <p>
          {settings?.copyrightText
            ? settings?.copyrightText
            : " Copyright BOCTRUST Microfinance Bank Limited All rights reserved."}{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  settings: PropTypes.any
}

export default Footer;
