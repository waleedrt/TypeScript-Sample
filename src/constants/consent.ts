interface ConsentStep {
  image?: number;
  title: string;
  content: string[];
}

const consent: { [index: number]: ConsentStep } = {
  0: {
    title: 'Welcome to WorkWell!',
    content: [
      'Professor Matt Bloom leads the Called to Flourish and Flourishing in Ministry research projects at the University of Notre Dame.',
      'These studies explore your wellbeing at work and your overall wellbeing in life.',
      'You have been invited to participate in several different kinds of research activities and you are free to decide which ones you wish to join.',
    ],
  },
  1: {
    image: require('../../assets/icons/clipboard.png'),
    title:
      'Our 20-25 minute assessment explores your work experiences and how they relate to your overall wellbeing.',
    content: [
      'If you wish to, you can take an assessment of your wellbeing. The assessment will ask about the kinds of experiences you have most days at work, your work/life balance, and your overall wellbeing.',
      'If you take the assessment, you will receive your own wellbeing profile along will information to help you understand your wellbeing better.',
    ],
  },
  2: {
    image: require('../../assets/icons/phone.png'),
    title:
      'Our mobile app will allow you access to evidence-based practices tailored to your profile.',
    content: [
      'These practices are designed to help you boost or sustain your wellbeing. You can select the practices you wish to try, set reminders, and use the app to keep track of what you are doing. You decide the practices you want to use.',
      'You can also use the app to “Map Your Day” which will help you keep track of your wellbeing on a day-to-day basis. Two or three times a day, the app will ask a quick question about your wellbeing at that moment. At the end of the day, the app will ask you to briefly describe a high point and a low point from that day. Map Your Day will help you learn more about the highs and lows of your work days.',
    ],
  },
  3: {
    image: require('../../assets/icons/lockJackie.png'),
    title: 'Your data is safe.',
    content: [
      'Your research records will be kept on secure computers that are approved and monitored by the University of Notre Dame. Only approved members of the research team will have access to your information. Your research records will not be released without your consent except in very rare situations required by law or a court order. This study is approved under IRB Protocol 18-11-5008 until October 2024. ',
      'If you have any questions or concerns, please feel free to contact us: ',
      'Matt Bloom | workwellresearch.org | 574.631.7755',
      'Notre Dame Research Compliance Office | compliance@nd.edu | 574-631-1461',
    ],
  },
  4: {
    image: require('../../assets/icons/peopleGraph.png'),
    title: 'We only use aggregate data.',
    content: [
      'We will protect your answers by keeping them confidential and anonymous. We will only share aggregate data— no personal information will ever be shared.',
    ],
  },
  5: {
    image: require('../../assets/icons/stop.png'),
    title: 'You can stop at any time.',
    content: [
      'You can participate in all of this for free! While we do not think there are any risks associated with joining our study, you might find answering the questions to be tiresome, the app might become annoying, or some of what you learn about your wellbeing may be troublesome to you. You will not receive any compensation for participating in this study.',
      'Your participation is entirely voluntary: you may decline to answer any questions you choose and you may stop participating at any time. There are no penalties if you decide to withdraw from participation, nor will you be denied any benefits you are entitled to if you stop your participation. Your relationship with the University of Notre Dame will not be affected if you decline to participate or stop the survey. If you ever want your research records deleted, just let us know and we will erase them permanently.',
    ],
  },
  6: {
    image: require('../../assets/icons/flag.png'),
    title: 'Ready to get started?',
    content: [
      'It is time to decide if you want to join our study. Be sure you feel fully informed about this study’s purpose, what you will be invited to do, and the possible benefits and risks of participating before you agree to join. Remember, participating is entirely your choice, although you do need to be at least 18 years old to join.',
      'If you decide to join you are not giving up any of your legal rights. You may review this agreement at any time by visiting your account settings.',
      'By clicking the “I AGREE” button below I confirm I have read the description of the study and I agree to participate in the study.',
    ],
  },
};

export default consent;
