export function trackConversion(type) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const events = {
    lead_form: 'AW-664285975/hRufCO3a_5ocEJfm4LwC',
    contact: 'AW-664285975/Q4-WCPDa_5ocEJfm4LwC',
    page_view: 'AW-664285975/xuqfCPPa_5ocEJfm4LwC',
  };

  if (events[type]) {
    window.gtag('event', 'conversion', { send_to: events[type] });
  }
}
