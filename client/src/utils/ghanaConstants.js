// Constants and Ghanaian Localization Utilities

export const CATEGORIES = [
  'All',
  'Phones & Tablets',
  'Electronics & TV',
  'Home Appliances',
  'Laptops & Computing',
  'Transport & Logistics',
  'Power & Solar',
  'Furniture & Living'
];

export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Volta',
  'Northern',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
  'Oti',
  'Savannah',
  'North East',
  'Western North'
];

export const MOMO_PROVIDERS = [
  {
    id: 'MTN_MOMO',
    name: 'MTN Mobile Money',
    shortName: 'MTN MoMo',
    ussd: '*170#',
    color: '#FFCC00',
    textColor: '#1E293B',
    bgColor: 'bg-yellow-400',
    borderColor: 'border-yellow-500',
    iconText: 'MTN'
  },
  {
    id: 'TELECEL_CASH',
    name: 'Telecel Cash (Vodafone)',
    shortName: 'Telecel Cash',
    ussd: '*110#',
    color: '#E60000',
    textColor: '#FFFFFF',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-700',
    iconText: 'Telecel'
  },
  {
    id: 'AT_MONEY',
    name: 'AT Money (AirtelTigo)',
    shortName: 'AT Money',
    ussd: '*110#',
    color: '#005EB8',
    textColor: '#FFFFFF',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-700',
    iconText: 'AT'
  },
  {
    id: 'CARD',
    name: 'Ghana Interbank / Visa / Master',
    shortName: 'Bank Card / GhQR',
    ussd: 'Online',
    color: '#059669',
    textColor: '#FFFFFF',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-700',
    iconText: 'GhQR'
  }
];

export function formatGHS(amount) {
  const num = Number(amount) || 0;
  return `GH₵ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
