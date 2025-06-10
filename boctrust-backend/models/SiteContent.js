const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema({
  homeCardText: {
    // type: [
    //   {
    //     title: { type: String, default: "Savings" },
    //     text: {
    //       type: String,
    //       default:
    //         "Our savings products encourages individuals, micro enterprises and cooperative societies to grow their savings and easy their transactions. Saving for personal/family project i.e. (vacation, festival and ceremony e.t.c)",
    //     },
    //   },
    //   {
    //     title: { type: String, default: "Loans" },
    //     text: {
    //       type: String,
    //       default:
    //         "Our loan products help you cater to pressing needs. If you’re ready to upgrade your home decor or merely want to improve your lifestyle efficiency with a new laptop, look no further than the Boctrust",
    //     },
    //   },
    //   {
    //     title: { type: String, default: "Investment" },
    //     text: {
    //       type: String,
    //       default:
    //         "Our investment products help you secure the future by building up streams of investment towards a target while we match it up with attractive interest rates to achieve your desired goals. Emerald has the following.",
    //     },
    //   },
    // ],
     type: [
      {
        title: { type: String, default: "Savings" },
        text: {
          type: String,
          default:
            "Our savings products encourage individuals, micro enterprises, and cooperative societies to grow their savings and ease their transactions. Saving for personal/family projects (e.g., vacation, festival, ceremony, etc.)",
        },
      },
      {
        title: { type: String, default: "Loans" },
        text: {
          type: String,
          default:
            "Our loan products help you cater to pressing needs. If you’re ready to upgrade your home decor or merely want to improve your lifestyle efficiency with a new laptop, look no further than Boctrust.",
        },
      },
      {
        title: { type: String, default: "Investment" },
        text: {
          type: String,
          default:
            "Our investment products help you secure the future by building up streams of investment towards a target while we match it with attractive interest rates to achieve your desired goals.",
        },
      },
    ],
    default: [
      {
        title: "Savings",
        text:
          "Our savings products encourage individuals, micro enterprises, and cooperative societies to grow their savings and ease their transactions. Saving for personal/family projects (e.g., vacation, festival, ceremony, etc.)",
      },
      {
        title: "Loans",
        text:
          "Our loan products help you cater to pressing needs. If you’re ready to upgrade your home decor or merely want to improve your lifestyle efficiency with a new laptop, look no further than Boctrust.",
      },
      {
        title: "Investment",
        text:
          "Our investment products help you secure the future by building up streams of investment towards a target while we match it with attractive interest rates to achieve your desired goals.",
      },
    ],
  },
  exploreBoctrustText: {
    type: String,
    default:
      "We are committed to delivering excellent services, which we constantly aim to improve upon as a means to achieving optimum customer satisfaction. We maintain confidentiality in all our dealings with our customers. Within our short time in the industry Boctrust Mfb has proven that we are a bank of now and the future.",
  },
  companyOverviewText: {
    type: String,
    default:
      "Our core objective is to provide avenue for saving, access to credit and financial advisory services to individuals and micro, small & medium enterprises with competitive advantages. We believe in Growing Together with our customer.",
  },
  visionStatement: {
    type: String,
    default:
      "To be the Number 1 Microfinance Bank in terms of customer service, profitability and returns on investment.",
  },
  missionStatement: {
    type: String,
    default:
      "We are committed to offering the highest level of professionalism and service with integrity to our partners and customers while ensuring profitable returns to our shareholders.",
  },
  whoWeAreHomeText: {
    type: String,
    default:
      "BOCTRUST MICROFINANCE BANK is a financial institution licensed by Central Bank of Nigeria to gives social and economic Support to the lower middle class, working class and the economically active poor.",
  },
  companyGoal: {
    type: String,
    default:
      "Our core objective is to provide avenue for saving, access to credit and financial advisory services to individuals and micro, small & medium enterprises with competitive advantages. We believe in Growing Together with our customer.",
  },
  ourPeoplePara1: {
    type: String,
    default:
      "Our Board of Directors comprising of seasoned administrators and Chief Executives with commitment, strategic focus and leadership are ably supported by the Management team with distinguished diverse background in banking innovative services, and risk management among others.",
  },
  ourPeoplePara2: {
    type: String,
    default:
      "We ensure quality with state of the art information technology and extra ordinary human capital committed to the highest standards in Financial services. Working with us; you will discover our differences the first time. Our primary focus is service, service, and service.",
  },
  ourPeoplePara3: {
    type: String,
    default:
      "In summary, we have a very hard working and result oriented management team, backed up by visionary Board comprising young and shrewd investors and professionals who have distinguished themselves in their respective fields of endeavours. Our staffs are well experienced in banking operations with friendly customer service excellence. With us, your needs and requests are best handled with our dynamic skilled workforce.",
  },
  ourPeopleAboutText: {
    type: String,
    default:
      "Experience Unmatched Financial Excellence: Join our exceptional financial institution led by seasoned administrators, accomplished Chief Executives, and a diverse management team. With a relentless focus on customer service and innovation, we prioritize understanding and meeting your needs, delivering the best-in-class financial services. Backed by a visionary Board and experienced staff, we guarantee efficient and friendly customer service, ensuring your financial goals are met with excellence. Join us today and experience the difference in financial services.",
  },
  ourProductText: {
    type: String,
    default:
      "We have different classes of banking products designed to meet your personal and business needs. As a Bank for the economically active poor and young MSMEs, our products are most convenient, efficient and highly streamlined with high level of turnaround time to meet your immediate needs",
  },
  ourValue: {
    type: [
      {
        title: { type: String, default: "Innovation" },
        description: {
          type: String,
          default:
            "Creativity in our products development and leveraging on a robust information technology.",
        },
      },
      {
        title: { type: String, default: "Respect" },
        description: {
          type: String,
          default: "Demonstrating respect for all individuals.",
        },
      },
      {
        title: { type: String, default: "Customer Service" },
        description: {
          type: String,
          default: "We are committed to providing excellent customer service.",
        },
      },
      {
        title: { type: String, default: "Integrity" },
        description: {
          type: String,
          default: "Honesty and honorable competition.",
        },
      },
    ],
    default: [
      {
        title: "Innovation",
        description:
          "Creativity in our products development and leveraging on a robust information technology.",
      },
      {
        title: "Respect",
        description: "Demonstrating respect for all individuals.",
      },
      {
        title: "Customer Service",
        description: "We are committed to providing excellent customer service.",
      },
      {
        title: "Integrity",
        description: "Honesty and honorable competition.",
      },
    ],
    
  },
});

const SiteContent = mongoose.model("SiteContent", siteContentSchema);

module.exports = SiteContent;
