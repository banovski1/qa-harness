// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';

export class TypePageGenerated extends BasePage {
  readonly path = '/{user}/{type}';
  readonly heading = 'Changelog: Cal.com v6.8 - Cal Events, New troubleshooter, AI chat in routing forms & more';

  // 2 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in TypePage.ts.
  readonly enterprise = new Link(this.page, { label: 'Enterprise' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calAi = new Link(this.page, { label: 'Cal.ai' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly pricing = new Link(this.page, { label: 'Pricing' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly signIn = new Link(this.page, { label: 'Sign in' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly getStarted = new Link(this.page, { label: 'Get started' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly updates = new Link(this.page, { label: 'Updates' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calComEvents = new Link(this.page, { label: 'Cal.com Events' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly createYourOwnEvent = new Link(this.page, { label: 'Create your own Event' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly newAvailabilityTroubleshooter = new Link(this.page, { label: 'New availability troubleshooter' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly tryTheNewTroubleshooter = new Link(this.page, { label: 'Try the new troubleshooter' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly aIChatInRoutingForms = new Link(this.page, { label: 'AI chat in routing forms' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly createRoutesWithAIChat = new Link(this.page, { label: 'Create Routes with AI Chat' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly featuresImprovements = new Link(this.page, { label: 'Features & improvements' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly fixes = new Link(this.page, { label: 'Fixes' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly signUpForFree = new Link(this.page, { label: 'Sign up for free' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly bookADemo = new Link(this.page, { label: 'Book a demo' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly homeCalCom = new Link(this.page, { label: 'Home Cal.com' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomISO27001 = new Link(this.page, { label: 'Read more about Calcom ISO 27001' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomSOC2 = new Link(this.page, { label: 'Read more about Calcom SOC 2' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomCCPA = new Link(this.page, { label: 'Read more about Calcom CCPA' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomGDPR = new Link(this.page, { label: 'Read more about Calcom GDPR' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly readMoreAboutCalcomHIPAA = new Link(this.page, { label: 'Read more about Calcom HIPAA' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly logo = new Link(this.page, { label: 'Logo' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly android = new Link(this.page, { label: 'Android' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly chrome = new Link(this.page, { label: 'Chrome' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly safari = new Link(this.page, { label: 'Safari' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly edge = new Link(this.page, { label: 'Edge' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly firefox = new Link(this.page, { label: 'Firefox' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly macOS = new Link(this.page, { label: 'macOS' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly windows = new Link(this.page, { label: 'Windows' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly linux = new Link(this.page, { label: 'Linux' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly supportCalCom = new Link(this.page, { label: 'support@cal.com' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calComHelp = new Link(this.page, { label: 'cal.com/help' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly iOSAndroidApp = new Link(this.page, { label: 'iOS/Android App' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly selfHosted = new Link(this.page, { label: 'Self-hosted' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly pricing2 = new Link(this.page, { label: 'Pricing' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly docs = new Link(this.page, { label: 'Docs' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calAiAIPhoneAgent = new Link(this.page, { label: 'Cal.ai - AI Phone Agent' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly enterprise2 = new Link(this.page, { label: 'Enterprise' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly integrateCalCom = new Link(this.page, { label: 'Integrate Cal.com' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly routing = new Link(this.page, { label: 'Routing' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calComAtoms = new Link(this.page, { label: 'Cal.com Atoms' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly desktopApp = new Link(this.page, { label: 'Desktop App' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly fAQ = new Link(this.page, { label: 'FAQ' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly enterpriseAPI = new Link(this.page, { label: 'Enterprise API' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly gitHub = new Link(this.page, { label: 'GitHub' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly docker = new Link(this.page, { label: 'Docker' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly sales = new Link(this.page, { label: 'Sales' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly marketing = new Link(this.page, { label: 'Marketing' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly talentAcquisition = new Link(this.page, { label: 'Talent Acquisition' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly customerSupport = new Link(this.page, { label: 'Customer Support' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly higherEducation = new Link(this.page, { label: 'Higher Education' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly telehealth = new Link(this.page, { label: 'Telehealth' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly professionalServices = new Link(this.page, { label: 'Professional Services' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly hiringMarketplace = new Link(this.page, { label: 'Hiring Marketplace' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly humanResources = new Link(this.page, { label: 'Human Resources' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly tutoring = new Link(this.page, { label: 'Tutoring' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly cSuite = new Link(this.page, { label: 'C-suite' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly law = new Link(this.page, { label: 'Law' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly affiliateProgram = new Link(this.page, { label: 'Affiliate Program' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly helpDocs = new Link(this.page, { label: 'Help Docs' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly blog = new Link(this.page, { label: 'Blog' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calFonts = new Link(this.page, { label: 'Cal Fonts' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly teams = new Link(this.page, { label: 'Teams' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly embed = new Link(this.page, { label: 'Embed' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly recurringEvents = new Link(this.page, { label: 'Recurring events' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly developers = new Link(this.page, { label: 'Developers' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly oOO = new Link(this.page, { label: 'OOO' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly workflows = new Link(this.page, { label: 'Workflows' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly instantMeetings = new Link(this.page, { label: 'Instant Meetings' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly appStore = new Link(this.page, { label: 'App Store' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly requiresConfirmation = new Link(this.page, { label: 'Requires confirmation' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly payments = new Link(this.page, { label: 'Payments' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly videoConferencing = new Link(this.page, { label: 'Video Conferencing' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly calComVsCalendly = new Link(this.page, { label: 'Cal.com vs Calendly' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly jobs = new Link(this.page, { label: 'Jobs' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly about = new Link(this.page, { label: 'About' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly openStartup = new Link(this.page, { label: 'Open Startup' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly support = new Link(this.page, { label: 'Support' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly privacy = new Link(this.page, { label: 'Privacy' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly terms = new Link(this.page, { label: 'Terms' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly license = new Link(this.page, { label: 'License' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly security = new Link(this.page, { label: 'Security' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly changelog = new Link(this.page, { label: 'Changelog' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly getADemo = new Link(this.page, { label: 'Get a demo' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });
  readonly talkToSales = new Link(this.page, { label: 'Talk to sales' }, { screen: 'TypePage', expectedUrl: '/{user}/{type}', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to EnterprisePage. */
  async goToEnterprise(): Promise<void> {
    await this.enterprise2.click();
    await this.page.waitForURL(url => url.href.includes('/enterprise'));
  }

  constructor(page: Page) {
    super(page);
  }
}
