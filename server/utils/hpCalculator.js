// Hire Purchase Calculation & Validation Engine for FlexiPay Ghana

/**
 * Calculates full hire purchase breakdown
 * @param {number} cashPrice - Original outright price in GHS
 * @param {number} markupPercent - Annual or tenure markup percentage (e.g. 10%)
 * @param {number} downPaymentPercent - Customer upfront deposit % (e.g. 25%)
 * @param {number} tenureMonths - Period in months (e.g. 3, 6, 12)
 * @param {string} frequency - 'monthly' or 'weekly'
 */
function calculateHPPlan({
  cashPrice,
  markupPercent = 12,
  downPaymentPercent = 25,
  tenureMonths = 3,
  frequency = 'monthly',
  startDate = new Date()
}) {
  const price = Number(cashPrice) || 0;
  const markup = Number(markupPercent) || 0;
  const depositPct = Math.max(15, Math.min(80, Number(downPaymentPercent) || 25));
  const months = Math.max(1, Number(tenureMonths) || 3);

  // Total HP Price includes financing markup surcharge
  const totalHPAmount = Math.round((price * (1 + markup / 100)) * 100) / 100;
  const markupAmount = Math.round((totalHPAmount - price) * 100) / 100;

  // Down Payment (deposit paid upfront)
  const downPaymentAmount = Math.round((totalHPAmount * (depositPct / 100)) * 100) / 100;

  // Remaining balance to be paid in installments
  const remainingBalance = Math.round((totalHPAmount - downPaymentAmount) * 100) / 100;

  // Calculate installment count
  const numberOfInstallments = frequency === 'weekly' ? months * 4 : months;
  const baseInstallment = Math.floor((remainingBalance / numberOfInstallments) * 100) / 100;
  const totalBase = Math.round((baseInstallment * numberOfInstallments) * 100) / 100;
  const remainder = Math.round((remainingBalance - totalBase) * 100) / 100;

  // Generate schedule
  const schedule = [];
  const start = new Date(startDate);

  for (let i = 1; i <= numberOfInstallments; i++) {
    const dueDate = new Date(start);
    if (frequency === 'weekly') {
      dueDate.setDate(dueDate.getDate() + (i * 7));
    } else {
      dueDate.setMonth(dueDate.getMonth() + i);
    }

    // Last installment absorbs any fractional cedi rounding difference
    const amount = i === numberOfInstallments 
      ? Math.round((baseInstallment + remainder) * 100) / 100 
      : baseInstallment;

    schedule.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amount,
      status: 'PENDING',
      paidAt: null,
      paymentMethod: null,
      transactionRef: null
    });
  }

  return {
    cashPrice: price,
    markupPercent: markup,
    markupAmount,
    totalHPAmount,
    downPaymentPercent: depositPct,
    downPaymentAmount,
    remainingBalance,
    tenureMonths: months,
    frequency,
    numberOfInstallments,
    installmentAmount: baseInstallment,
    schedule
  };
}

/**
 * Validate Ghana Card ID (e.g. GHA-712345678-9)
 */
function isValidGhanaCard(cardId) {
  if (!cardId || typeof cardId !== 'string') return false;
  const clean = cardId.trim().toUpperCase();
  const ghanaCardRegex = /^GHA-\d{9}-\d$/;
  return ghanaCardRegex.test(clean);
}

/**
 * Validate GhanaPost GPS Address (e.g. GA-183-9022, AK-039-4412)
 */
function isValidGhanaPostGPS(address) {
  if (!address || typeof address !== 'string') return false;
  const clean = address.trim().toUpperCase();
  const gpsRegex = /^[A-Z]{2}-\d{3,4}-\d{4}$/;
  return gpsRegex.test(clean);
}

/**
 * Determine Mobile Money provider from Ghanaian phone number prefix
 */
function detectMoMoProvider(phone) {
  if (!phone) return 'MTN_MOMO';
  const clean = phone.replace(/[^0-9]/g, '');
  const prefix = clean.startsWith('233') ? '0' + clean.slice(3, 5) : clean.slice(0, 3);

  const mtnPrefixes = ['024', '054', '055', '059', '053'];
  const telecelPrefixes = ['020', '050'];
  const atPrefixes = ['027', '057', '026', '056'];

  if (mtnPrefixes.includes(prefix)) return 'MTN_MOMO';
  if (telecelPrefixes.includes(prefix)) return 'TELECEL_CASH';
  if (atPrefixes.includes(prefix)) return 'AT_MONEY';
  return 'MTN_MOMO';
}

module.exports = {
  calculateHPPlan,
  isValidGhanaCard,
  isValidGhanaPostGPS,
  detectMoMoProvider
};
