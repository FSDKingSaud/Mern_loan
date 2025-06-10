/* eslint-disable no-undef */
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/reducers/adminAuthReducer";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { handleLogout } from "../../services/logout";

const TopNav = ({ settings }) => {
  // handle logout
  const dispatch = useDispatch();
  const logoutUser = async () => {
    try {
      await handleLogout();
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // get current admin
  const currentUser = useSelector((state) => state.adminAuth.user);

  // change navbar color on scroll
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".Nav");
      if (nav) {
        nav.classList.toggle("Sticky", window.scrollY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="TopNavContainer ">
      <div className="Topnav my-2">
        <div className="BrandCon">
          <Link to="/">
            <img
              src="/images/boclogo.jpeg"
              alt="Boctrust Microfinance Bank Logo"
              width="150px"
            />
          </Link>
        </div>
        <div className="Hero">
          <h1 className="Welcome">
            {settings?.siteTitle
              ? settings?.siteTitle
              : "Welcome to BOCTRUST Microfinance Bank Limited"}
          </h1>
        </div>
        <div>
          <button className="CallUs">Licenced by CBN</button>
          <img src="/images/cbn.jpeg" alt="cbn" height={40} />
        </div>
      </div>

      <div className="BottomStyle">
        {/* navbar section start */}
        {!currentUser && (
          <Navbar variant="dark" expand="lg" className="Nav">
            <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                  <Nav.Link as={Link} to="/" className="mx-4">
                    Home
                  </Nav.Link>

                  {/* about dropdown */}
                  <NavDropdown
                    title="About"
                    id="basic-nav-dropdown"
                    className="mx-4"
                  >
                    <div className="DropSpace"></div>
                    <NavDropdown.Item
                      className="DropItem"
                      as={Link}
                      to="/about"
                    >
                      Company Overview
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      as={Link}
                      to="/board"
                      className="DropItem"
                    >
                      Our Board
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      as={Link}
                      to="/careers"
                      className="DropItem"
                    >
                      Careers
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </NavDropdown>

                  {/* our product dropdown */}
                  <NavDropdown
                    className="DropBox"
                    title="Our Products"
                    id="basic-nav-dropdown"
                  >
                    {/* savings dropdown start*/}
                    <NavDropdown
                      title="Savings"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item as={Link} to="/regular-savings">
                        Regular Savings
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/target-savings">
                        Target Savings
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/ajo-plus-account">
                        Ajo Plus Account
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* saving dropdown end */}

                    {/* Investment dropdown start*/}
                    <NavDropdown
                      title="Investment"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item as={Link} to="/fixed-investment">
                        Fixed Deposit
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/investment-note">
                        Investment Notes
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* investment dropdown end */}

                    {/* loans dropdown start*/}
                    <NavDropdown
                      title="Loans"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item as={Link} to="/salary-advance">
                        Salary Advance
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/personal-loan">
                        Personal Loan
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/sme-loan">
                        SME Loan
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/asset-backed-financing">
                        Asset Backed Financing
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* loans dropdown end */}

                    {/* advisory dropdown start*/}
                    <NavDropdown
                      title="Advisory Services"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item as={Link} to="/small-business-advisory">
                        Small Business Advisory
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        as={Link}
                        to="/micro-insurance-advisory"
                      >
                        Micro Insurance Advisory
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/financial-advisory">
                        Financial Advisory
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* advisory dropdown end */}
                  </NavDropdown>

                  {/* top level menu item */}
                  <Nav.Link as={Link} to="/loan" className="mx-4">
                    Apply for Loan
                  </Nav.Link>
                  <Nav.Link as={Link} to="/support" className="mx-4">
                    Support
                  </Nav.Link>
                  <Nav.Link as={Link} to="/blogs" className="mx-4">
                    Blogs
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact" className="mx-4">
                    Contact
                  </Nav.Link>
                  {currentUser ? (
                    <Nav.Link
                      as={Link}
                      to="/login"
                      onClick={logoutUser}
                      className="mx-4"
                    >
                      Logout
                    </Nav.Link>
                  ) : (
                    <Nav.Link as={Link} to="/login" className="mx-4">
                      Login
                    </Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}
      </div>
    </div>
  );
};

TopNav.propTypes = {
  settings: PropTypes.any,
};

export default TopNav;
