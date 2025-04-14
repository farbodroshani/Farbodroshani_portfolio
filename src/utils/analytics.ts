import { AnalyticsEvent } from '../types';

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];

  private constructor() {
    if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID);
    }
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public trackEvent(event: AnalyticsEvent): void {
    this.events.push(event);
    if (window.gtag) {
      window.gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  public trackPageView(path: string): void {
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        page_path: path
      });
    }
  }

  public getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  public clearEvents(): void {
    this.events = [];
  }
}

export default Analytics; 