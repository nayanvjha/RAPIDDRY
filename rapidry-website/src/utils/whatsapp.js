const WHATSAPP_LOCAL_NUMBER = '7667625880';
const WHATSAPP_COUNTRY_CODE = '91';

export const WHATSAPP_NUMBER = `${WHATSAPP_COUNTRY_CODE}${WHATSAPP_LOCAL_NUMBER}`;
export const WHATSAPP_DISPLAY_NUMBER = `+${WHATSAPP_COUNTRY_CODE} ${WHATSAPP_LOCAL_NUMBER}`;

export const SERVICES_OVERVIEW =
  'Wash & Fold, Wash & Iron, Dry Clean, Stain Removal, Steam Iron, Shoe Cleaning, Bag Cleaning';

export const DEFAULT_WHATSAPP_MESSAGE =
  `Hi RAPIDRY! I want to book laundry services: ${SERVICES_OVERVIEW}. Please share pickup slot, pricing, and turnaround time.`;

export const buildWhatsAppUrl = (message = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const buildServiceBookingMessage = (serviceName) =>
  `Hi RAPIDRY! I want to book ${serviceName}. I also need details for all services: ${SERVICES_OVERVIEW}. Please help with pickup slot and pricing.`;