// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';

export class EnterprisePageGenerated extends BasePage {
  readonly path = '/enterprise';
  readonly heading = 'The operating system for scheduling';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in EnterprisePage.ts.
  readonly homeCalCom = new Link(this.page, { label: 'Home Cal.com' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly enterprise = new Link(this.page, { label: 'Enterprise' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly calAi = new Link(this.page, { label: 'Cal.ai' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly pricing = new Link(this.page, { label: 'Pricing' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly signIn = new Link(this.page, { label: 'Sign in' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly getStarted = new Link(this.page, { label: 'Get started' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly talkToSales = new Link(this.page, { label: 'Talk to sales' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly getStarted2 = new Link(this.page, { label: 'Get started' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly talkToSales2 = new Link(this.page, { label: 'Talk to sales' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly getStarted3 = new Link(this.page, { label: 'Get started' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly talkToSales3 = new Link(this.page, { label: 'Talk to sales' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly getStarted4 = new Link(this.page, { label: 'Get started' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly homeCalCom2 = new Link(this.page, { label: 'Home Cal.com' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomISO27001 = new Link(this.page, { label: 'Read more about Calcom ISO 27001' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomSOC2 = new Link(this.page, { label: 'Read more about Calcom SOC 2' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomCCPA = new Link(this.page, { label: 'Read more about Calcom CCPA' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomGDPR = new Link(this.page, { label: 'Read more about Calcom GDPR' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomHIPAA = new Link(this.page, { label: 'Read more about Calcom HIPAA' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly logo = new Link(this.page, { label: 'Logo' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly android = new Link(this.page, { label: 'Android' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly chrome = new Link(this.page, { label: 'Chrome' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly safari = new Link(this.page, { label: 'Safari' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly edge = new Link(this.page, { label: 'Edge' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly firefox = new Link(this.page, { label: 'Firefox' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly macOS = new Link(this.page, { label: 'macOS' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly windows = new Link(this.page, { label: 'Windows' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly linux = new Link(this.page, { label: 'Linux' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly supportCalCom = new Link(this.page, { label: 'support@cal.com' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly calComHelp = new Link(this.page, { label: 'cal.com/help' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly iOSAndroidApp = new Link(this.page, { label: 'iOS/Android App' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly selfHosted = new Link(this.page, { label: 'Self-hosted' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly pricing2 = new Link(this.page, { label: 'Pricing' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly docs = new Link(this.page, { label: 'Docs' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly calAiAIPhoneAgent = new Link(this.page, { label: 'Cal.ai - AI Phone Agent' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly enterprise2 = new Link(this.page, { label: 'Enterprise' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly integrateCalCom = new Link(this.page, { label: 'Integrate Cal.com' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly routing = new Link(this.page, { label: 'Routing' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly calComAtoms = new Link(this.page, { label: 'Cal.com Atoms' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly desktopApp = new Link(this.page, { label: 'Desktop App' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly fAQ = new Link(this.page, { label: 'FAQ' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly enterpriseAPI = new Link(this.page, { label: 'Enterprise API' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly gitHub = new Link(this.page, { label: 'GitHub' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly docker = new Link(this.page, { label: 'Docker' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly sales = new Link(this.page, { label: 'Sales' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly marketing = new Link(this.page, { label: 'Marketing' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly talentAcquisition = new Link(this.page, { label: 'Talent Acquisition' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly customerSupport = new Link(this.page, { label: 'Customer Support' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly higherEducation = new Link(this.page, { label: 'Higher Education' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly telehealth = new Link(this.page, { label: 'Telehealth' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly professionalServices = new Link(this.page, { label: 'Professional Services' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly hiringMarketplace = new Link(this.page, { label: 'Hiring Marketplace' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly humanResources = new Link(this.page, { label: 'Human Resources' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly tutoring = new Link(this.page, { label: 'Tutoring' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly cSuite = new Link(this.page, { label: 'C-suite' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly law = new Link(this.page, { label: 'Law' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly affiliateProgram = new Link(this.page, { label: 'Affiliate Program' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly helpDocs = new Link(this.page, { label: 'Help Docs' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly blog = new Link(this.page, { label: 'Blog' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly calFonts = new Link(this.page, { label: 'Cal Fonts' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly teams = new Link(this.page, { label: 'Teams' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly embed = new Link(this.page, { label: 'Embed' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly recurringEvents = new Link(this.page, { label: 'Recurring events' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly developers = new Link(this.page, { label: 'Developers' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly oOO = new Link(this.page, { label: 'OOO' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly workflows = new Link(this.page, { label: 'Workflows' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly instantMeetings = new Link(this.page, { label: 'Instant Meetings' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly appStore = new Link(this.page, { label: 'App Store' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly requiresConfirmation = new Link(this.page, { label: 'Requires confirmation' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly payments = new Link(this.page, { label: 'Payments' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly videoConferencing = new Link(this.page, { label: 'Video Conferencing' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly calComVsCalendly = new Link(this.page, { label: 'Cal.com vs Calendly' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly jobs = new Link(this.page, { label: 'Jobs' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly about = new Link(this.page, { label: 'About' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly openStartup = new Link(this.page, { label: 'Open Startup' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly support = new Link(this.page, { label: 'Support' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly privacy = new Link(this.page, { label: 'Privacy' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly terms = new Link(this.page, { label: 'Terms' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly license = new Link(this.page, { label: 'License' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly security = new Link(this.page, { label: 'Security' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly changelog = new Link(this.page, { label: 'Changelog' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly getADemo = new Link(this.page, { label: 'Get a demo' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });
  readonly talkToSales4 = new Link(this.page, { label: 'Talk to sales' }, { screen: 'EnterprisePage', expectedUrl: '/enterprise', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
