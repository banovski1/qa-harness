// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';

export class UserPageGenerated extends BasePage {
  readonly path = '/{user}';
  readonly heading = 'Supercharged scheduling with';

  // 15 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in UserPage.ts.
  readonly calAi = new Link(this.page, { label: 'Cal.ai' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly signIn = new Link(this.page, { label: 'Sign in' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly getStarted = new Link(this.page, { label: 'Get started' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly bookASalesCallWithOurTeam = new Link(this.page, { label: 'Book a sales call with our team' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly tryAIScheduling = new Link(this.page, { label: 'Try AI scheduling', within: 'AI-powered calls' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly seeCalAiInLiveAction = new Link(this.page, { label: 'See Cal.ai in live action' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly play = new Button(this.page, { label: 'Play' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly tryAIScheduling2 = new Link(this.page, { label: 'Try AI scheduling', within: 'Not to mention everything else you could need in a scheduling app' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly tryAIScheduling3 = new Link(this.page, { label: 'Try AI scheduling', within: 'Empower your receptionist. Let AI handle the scheduling' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly calAiPhoneAgentSuperchargedSchedulingWithAIPoweredCallsProductHunt = new Link(this.page, { label: 'Cal.ai Phone Agent - Supercharged scheduling with AI-powered calls | Product Hunt' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomISO27001 = new Link(this.page, { label: 'Read more about Calcom ISO 27001' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomSOC2 = new Link(this.page, { label: 'Read more about Calcom SOC 2' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomCCPA = new Link(this.page, { label: 'Read more about Calcom CCPA' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomGDPR = new Link(this.page, { label: 'Read more about Calcom GDPR' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomHIPAA = new Link(this.page, { label: 'Read more about Calcom HIPAA' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly logo = new Link(this.page, { label: 'Logo' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly android = new Link(this.page, { label: 'Android' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly chrome = new Link(this.page, { label: 'Chrome' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly safari = new Link(this.page, { label: 'Safari' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly edge = new Link(this.page, { label: 'Edge' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly firefox = new Link(this.page, { label: 'Firefox' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly macOS = new Link(this.page, { label: 'macOS' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly windows = new Link(this.page, { label: 'Windows' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly linux = new Link(this.page, { label: 'Linux' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly supportCalCom = new Link(this.page, { label: 'support@cal.com' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly calComHelp = new Link(this.page, { label: 'cal.com/help' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly iOSAndroidApp = new Link(this.page, { label: 'iOS/Android App' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly selfHosted = new Link(this.page, { label: 'Self-hosted' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly docs = new Link(this.page, { label: 'Docs' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly calAiAIPhoneAgent = new Link(this.page, { label: 'Cal.ai - AI Phone Agent' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly integrateCalCom = new Link(this.page, { label: 'Integrate Cal.com' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly routing = new Link(this.page, { label: 'Routing' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly calComAtoms = new Link(this.page, { label: 'Cal.com Atoms' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly desktopApp = new Link(this.page, { label: 'Desktop App' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly fAQ = new Link(this.page, { label: 'FAQ' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly enterpriseAPI = new Link(this.page, { label: 'Enterprise API' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly gitHub = new Link(this.page, { label: 'GitHub' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly docker = new Link(this.page, { label: 'Docker' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly sales = new Link(this.page, { label: 'Sales' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly marketing = new Link(this.page, { label: 'Marketing' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly talentAcquisition = new Link(this.page, { label: 'Talent Acquisition' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly customerSupport = new Link(this.page, { label: 'Customer Support' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly higherEducation = new Link(this.page, { label: 'Higher Education' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly telehealth = new Link(this.page, { label: 'Telehealth' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly professionalServices = new Link(this.page, { label: 'Professional Services' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly hiringMarketplace = new Link(this.page, { label: 'Hiring Marketplace' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly humanResources = new Link(this.page, { label: 'Human Resources' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly tutoring = new Link(this.page, { label: 'Tutoring' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly cSuite = new Link(this.page, { label: 'C-suite' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly law = new Link(this.page, { label: 'Law' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly affiliateProgram = new Link(this.page, { label: 'Affiliate Program' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly helpDocs = new Link(this.page, { label: 'Help Docs' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly blog = new Link(this.page, { label: 'Blog' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly calFonts = new Link(this.page, { label: 'Cal Fonts' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly teams = new Link(this.page, { label: 'Teams' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly embed = new Link(this.page, { label: 'Embed' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly recurringEvents = new Link(this.page, { label: 'Recurring events' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly developers = new Link(this.page, { label: 'Developers' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly oOO = new Link(this.page, { label: 'OOO' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly workflows = new Link(this.page, { label: 'Workflows' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly instantMeetings = new Link(this.page, { label: 'Instant Meetings' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly appStore = new Link(this.page, { label: 'App Store' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly requiresConfirmation = new Link(this.page, { label: 'Requires confirmation' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly payments = new Link(this.page, { label: 'Payments' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly videoConferencing = new Link(this.page, { label: 'Video Conferencing' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly calComVsCalendly = new Link(this.page, { label: 'Cal.com vs Calendly' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly jobs = new Link(this.page, { label: 'Jobs' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly about = new Link(this.page, { label: 'About' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly openStartup = new Link(this.page, { label: 'Open Startup' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly support = new Link(this.page, { label: 'Support' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly privacy = new Link(this.page, { label: 'Privacy' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly terms = new Link(this.page, { label: 'Terms' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly license = new Link(this.page, { label: 'License' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly security = new Link(this.page, { label: 'Security' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly changelog = new Link(this.page, { label: 'Changelog' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly getADemo = new Link(this.page, { label: 'Get a demo' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });
  readonly talkToSales = new Link(this.page, { label: 'Talk to sales' }, { screen: 'UserPage', expectedUrl: '/{user}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
