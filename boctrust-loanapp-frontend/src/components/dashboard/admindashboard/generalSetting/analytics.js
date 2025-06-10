import ReactGA from "react-ga4";

const initializeGA = (trackingId) => {
  ReactGA.initialize(trackingId); // Replace with your GA4 Tracking ID
};

const logPageView = (pagePath) => {
  ReactGA.send({ hitType: "pageview", page: pagePath });
};

const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

export { initializeGA, logPageView, logEvent };
