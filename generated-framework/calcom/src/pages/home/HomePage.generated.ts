// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';

export class HomePageGenerated extends BasePage {
  readonly path = '/';
  readonly heading = 'The better way to schedule your meetings';

  // 18 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in HomePage.ts.
  readonly calAi = new Link(this.page, { label: 'Cal.ai' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly signIn = new Link(this.page, { label: 'Sign in' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly calComLaunchesV68 = new Link(this.page, { label: 'Cal.com launches v6.8' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly signUpWithGoogle = new Link(this.page, { label: 'Sign up with Google' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly signUpWithEmail = new Link(this.page, { label: 'Sign up with email' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly exploreApps = new Link(this.page, { label: 'Explore apps' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomISO27001 = new Link(this.page, { label: 'Read more about Calcom ISO 27001' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomSOC2 = new Link(this.page, { label: 'Read more about Calcom SOC 2' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomCCPA = new Link(this.page, { label: 'Read more about Calcom CCPA' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomGDPR = new Link(this.page, { label: 'Read more about Calcom GDPR' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomHIPAA = new Link(this.page, { label: 'Read more about Calcom HIPAA' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly logo = new Link(this.page, { label: 'Logo' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly android = new Link(this.page, { label: 'Android' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly chrome = new Link(this.page, { label: 'Chrome' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly safari = new Link(this.page, { label: 'Safari' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly edge = new Link(this.page, { label: 'Edge' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly firefox = new Link(this.page, { label: 'Firefox' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly macOS = new Link(this.page, { label: 'macOS' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly windows = new Link(this.page, { label: 'Windows' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly linux = new Link(this.page, { label: 'Linux' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly supportCalCom = new Link(this.page, { label: 'support@cal.com' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly calComHelp = new Link(this.page, { label: 'cal.com/help' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly iOSAndroidApp = new Link(this.page, { label: 'iOS/Android App' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly selfHosted = new Link(this.page, { label: 'Self-hosted' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly docs = new Link(this.page, { label: 'Docs' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly calAiAIPhoneAgent = new Link(this.page, { label: 'Cal.ai - AI Phone Agent' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly integrateCalCom = new Link(this.page, { label: 'Integrate Cal.com' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly routing = new Link(this.page, { label: 'Routing' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly calComAtoms = new Link(this.page, { label: 'Cal.com Atoms' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly desktopApp = new Link(this.page, { label: 'Desktop App' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly fAQ = new Link(this.page, { label: 'FAQ' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly enterpriseAPI = new Link(this.page, { label: 'Enterprise API' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly gitHub = new Link(this.page, { label: 'GitHub' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly docker = new Link(this.page, { label: 'Docker' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly sales = new Link(this.page, { label: 'Sales' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly marketing = new Link(this.page, { label: 'Marketing' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly talentAcquisition = new Link(this.page, { label: 'Talent Acquisition' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly customerSupport = new Link(this.page, { label: 'Customer Support' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly higherEducation = new Link(this.page, { label: 'Higher Education' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly telehealth = new Link(this.page, { label: 'Telehealth' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly professionalServices = new Link(this.page, { label: 'Professional Services' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly hiringMarketplace = new Link(this.page, { label: 'Hiring Marketplace' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly humanResources = new Link(this.page, { label: 'Human Resources' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly tutoring = new Link(this.page, { label: 'Tutoring' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly cSuite = new Link(this.page, { label: 'C-suite' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly law = new Link(this.page, { label: 'Law' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly affiliateProgram = new Link(this.page, { label: 'Affiliate Program' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly helpDocs = new Link(this.page, { label: 'Help Docs' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly blog = new Link(this.page, { label: 'Blog' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly calFonts = new Link(this.page, { label: 'Cal Fonts' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly teams = new Link(this.page, { label: 'Teams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly embed = new Link(this.page, { label: 'Embed' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly recurringEvents = new Link(this.page, { label: 'Recurring events' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly developers = new Link(this.page, { label: 'Developers' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly oOO = new Link(this.page, { label: 'OOO' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly workflows = new Link(this.page, { label: 'Workflows' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly instantMeetings = new Link(this.page, { label: 'Instant Meetings' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly appStore = new Link(this.page, { label: 'App Store' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly requiresConfirmation = new Link(this.page, { label: 'Requires confirmation' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly payments = new Link(this.page, { label: 'Payments' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly videoConferencing = new Link(this.page, { label: 'Video Conferencing' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly calComVsCalendly = new Link(this.page, { label: 'Cal.com vs Calendly' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jobs = new Link(this.page, { label: 'Jobs' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly about = new Link(this.page, { label: 'About' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly openStartup = new Link(this.page, { label: 'Open Startup' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly support = new Link(this.page, { label: 'Support' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly privacy = new Link(this.page, { label: 'Privacy' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly terms = new Link(this.page, { label: 'Terms' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly license = new Link(this.page, { label: 'License' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly security = new Link(this.page, { label: 'Security' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly changelog = new Link(this.page, { label: 'Changelog' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly getADemo = new Link(this.page, { label: 'Get a demo' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
