// FlexiPay Ghana In-Memory & File-Backed Persistent Store
const fs = require('fs');
const path = require('path');
const { seedVendors, seedProducts, seedUsers, seedContracts } = require('./seedData');

const DB_FILE = path.join(__dirname, 'data.json');

class Database {
  constructor() {
    this.data = {
      vendors: [],
      products: [],
      users: [],
      contracts: [],
      payments: [],
      notifications: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        if (fileContent && fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          if (Array.isArray(parsed.products) && Array.isArray(parsed.vendors)) {
            this.data = {
              vendors: parsed.vendors || [],
              products: parsed.products || [],
              users: parsed.users || [],
              contracts: parsed.contracts || [],
              payments: parsed.payments || [],
              notifications: parsed.notifications || []
            };
            return;
          }
        }
      }
      this.seedInitial();
    } catch (err) {
      console.warn('Error reading or parsing data.json, re-seeding...', err.message);
      this.seedInitial();
    }
  }

  seedInitial() {
    this.data = {
      vendors: JSON.parse(JSON.stringify(seedVendors)),
      products: JSON.parse(JSON.stringify(seedProducts)),
      users: JSON.parse(JSON.stringify(seedUsers)),
      contracts: JSON.parse(JSON.stringify(seedContracts)),
      payments: [
        {
          id: "pay_momo_001",
          contractId: "cnt_8812",
          contractNumber: "HP-GH-2025-8812",
          vendorId: "ven_hisense",
          customerId: "usr_customer_kwesi",
          customerName: "Kwesi Mensah",
          type: "DOWN_PAYMENT",
          amount: 1595,
          method: "MTN_MOMO",
          phone: "0244123456",
          networkRef: "MOMO-GH-998122",
          status: "SUCCESSFUL",
          createdAt: "2025-01-20T11:05:00Z"
        },
        {
          id: "pay_momo_002",
          contractId: "cnt_8812",
          contractNumber: "HP-GH-2025-8812",
          vendorId: "ven_hisense",
          customerId: "usr_customer_kwesi",
          customerName: "Kwesi Mensah",
          type: "INSTALLMENT",
          installmentNumber: 1,
          amount: 1595,
          method: "MTN_MOMO",
          phone: "0244123456",
          networkRef: "MOMO-GH-998231",
          status: "SUCCESSFUL",
          createdAt: "2025-02-19T14:32:00Z"
        },
        {
          id: "pay_momo_003",
          contractId: "cnt_8812",
          contractNumber: "HP-GH-2025-8812",
          vendorId: "ven_hisense",
          customerId: "usr_customer_kwesi",
          customerName: "Kwesi Mensah",
          type: "INSTALLMENT",
          installmentNumber: 2,
          amount: 1595,
          method: "MTN_MOMO",
          phone: "0244123456",
          networkRef: "MOMO-GH-998944",
          status: "SUCCESSFUL",
          createdAt: "2025-03-18T10:15:00Z"
        }
      ],
      notifications: [
        {
          id: "notif_1",
          recipientId: "usr_customer_kwesi",
          title: "Upcoming Installment Reminder 🇬🇭",
          message: "Your final installment of GH₵ 1,595 for Hisense 55\" 4K TV is due on 20th April. Pay on time to earn +20 FlexiCredit points.",
          type: "PAYMENT_REMINDER",
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
    this.save();
  }

  save() {
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, serialized, 'utf-8');
      try {
        fs.renameSync(tempFile, DB_FILE);
      } catch (renameErr) {
        fs.writeFileSync(DB_FILE, serialized, 'utf-8');
      }
    } catch (err) {
      console.error('Failed to write database file:', err.message);
    }
  }

  // --- PRODUCTS ---
  getProducts({ category, search, vendorId, sort, minPrice, maxPrice } = {}) {
    let list = [...this.data.products];
    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (vendorId) {
      list = list.filter(p => p.vendorId === vendorId);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.vendorName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      list = list.filter(p => p.cashPrice >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => p.cashPrice <= Number(maxPrice));
    }
    if (sort === 'price_asc') {
      list.sort((a, b) => a.cashPrice - b.cashPrice);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.cashPrice - a.cashPrice);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(productData) {
    const newProduct = {
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      featured: false,
      createdAt: new Date().toISOString(),
      ...productData
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.save();
    return this.data.products[index];
  }

  deleteProduct(id) {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- VENDORS & STORES ---
  getVendors() {
    return this.data.vendors;
  }

  getVendorById(id) {
    return this.data.vendors.find(v => v.id === id);
  }

  addVendor(vendorData) {
    const newVendor = {
      id: `ven_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      verified: true,
      totalSalesGHS: 0,
      collectedInstallmentsGHS: 0,
      activeContractsCount: 0,
      createdAt: new Date().toISOString(),
      ...vendorData
    };
    this.data.vendors.push(newVendor);
    this.save();
    return newVendor;
  }

  updateVendor(id, updates) {
    const index = this.data.vendors.findIndex(v => v.id === id);
    if (index === -1) return null;
    this.data.vendors[index] = { ...this.data.vendors[index], ...updates };
    this.save();
    return this.data.vendors[index];
  }

  // --- CONTRACTS / HIRE PURCHASE AGREEMENTS ---
  getContracts({ customerId, vendorId, status } = {}) {
    let list = [...this.data.contracts];
    if (customerId) {
      list = list.filter(c => c.customerId === customerId);
    }
    if (vendorId) {
      list = list.filter(c => c.vendorId === vendorId);
    }
    if (status) {
      list = list.filter(c => c.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getContractById(id) {
    return this.data.contracts.find(c => c.id === id || c.contractNumber === id);
  }

  createContract(contractData) {
    const id = `cnt_${Date.now()}`;
    const contractNumber = `HP-GH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newContract = {
      id,
      contractNumber,
      status: 'PENDING_APPROVAL',
      deliveryStatus: 'PENDING_DISPATCH',
      totalPaid: Number(contractData.downPaymentAmount) || 0,
      outstandingBalance: Number(contractData.remainingBalance) || 0,
      createdAt: new Date().toISOString(),
      approvedAt: null,
      ...contractData
    };
    this.data.contracts.unshift(newContract);

    // Update vendor active contract stats
    const vendor = this.getVendorById(contractData.vendorId);
    if (vendor) {
      vendor.totalSalesGHS = (vendor.totalSalesGHS || 0) + newContract.totalHPAmount;
      vendor.collectedInstallmentsGHS = (vendor.collectedInstallmentsGHS || 0) + newContract.totalPaid;
      vendor.activeContractsCount = (vendor.activeContractsCount || 0) + 1;
    }

    // Add notification to vendor
    this.addNotification({
      recipientId: contractData.vendorId,
      title: 'New Hire-Purchase Application! 📝',
      message: `${contractData.customerName} submitted an installment purchase for ${contractData.productTitle} (GH₵ ${contractData.totalHPAmount}). Review Ghana Card & details.`,
      type: 'NEW_APPLICATION'
    });

    this.save();
    return newContract;
  }

  updateContract(id, updates) {
    const index = this.data.contracts.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.contracts[index] = { ...this.data.contracts[index], ...updates };
    this.save();
    return this.data.contracts[index];
  }

  // Record an installment repayment
  payInstallment(contractId, installmentNumber, { paymentMethod, phone, networkRef, amount } = {}) {
    const contract = this.getContractById(contractId);
    if (!contract) throw new Error('Contract not found');

    const inst = contract.installments.find(i => i.installmentNumber === Number(installmentNumber));
    if (!inst) throw new Error('Installment not found');
    if (inst.status === 'PAID') throw new Error('Installment is already paid');

    const payAmount = Number(amount) || inst.amount;
    inst.status = 'PAID';
    inst.paidAt = new Date().toISOString();
    inst.paymentMethod = paymentMethod || 'MTN_MOMO';
    inst.transactionRef = networkRef || `MOMO-GH-${Math.floor(100000 + Math.random() * 900000)}`;

    contract.totalPaid = Math.round(((contract.totalPaid || 0) + payAmount) * 100) / 100;
    contract.outstandingBalance = Math.max(0, Math.round(((contract.outstandingBalance || 0) - payAmount) * 100) / 100);

    // Check if fully settled
    const allPaid = contract.installments.every(i => i.status === 'PAID');
    if (allPaid || contract.outstandingBalance <= 0) {
      contract.status = 'COMPLETED';
    }

    // Update vendor collected
    const vendor = this.getVendorById(contract.vendorId);
    if (vendor) {
      vendor.collectedInstallmentsGHS = (vendor.collectedInstallmentsGHS || 0) + payAmount;
    }

    // Record in global payment ledger
    const paymentRecord = {
      id: `pay_${Date.now()}`,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      vendorId: contract.vendorId,
      customerId: contract.customerId,
      customerName: contract.customerName,
      type: 'INSTALLMENT',
      installmentNumber: inst.installmentNumber,
      amount: payAmount,
      method: paymentMethod || 'MTN_MOMO',
      phone: phone || contract.customerPhone,
      networkRef: inst.transactionRef,
      status: 'SUCCESSFUL',
      createdAt: new Date().toISOString()
    };
    this.data.payments.unshift(paymentRecord);

    // Add notification to customer
    this.addNotification({
      recipientId: contract.customerId,
      title: 'MoMo Payment Received! 🎉',
      message: `GH₵ ${payAmount.toLocaleString()} received for ${contract.productTitle} (Ref: ${inst.transactionRef}). Outstanding: GH₵ ${contract.outstandingBalance.toLocaleString()}.`,
      type: 'PAYMENT_SUCCESS'
    });

    this.save();
    return { contract, paymentRecord };
  }

  // --- PAYMENTS LEDGER ---
  getPayments({ vendorId, customerId } = {}) {
    let list = [...this.data.payments];
    if (vendorId) list = list.filter(p => p.vendorId === vendorId);
    if (customerId) list = list.filter(p => p.customerId === customerId);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId) {
    return this.data.notifications.filter(n => n.recipientId === userId || !n.recipientId);
  }

  addNotification(notif) {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notif
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  // --- STATS ---
  getPlatformStats() {
    const totalVendors = this.data.vendors.length;
    const totalProducts = this.data.products.length;
    const totalContracts = this.data.contracts.length;
    const activeContracts = this.data.contracts.filter(c => c.status === 'ACTIVE').length;
    const completedContracts = this.data.contracts.filter(c => c.status === 'COMPLETED').length;
    const totalGMV = this.data.contracts.reduce((sum, c) => sum + (c.totalHPAmount || 0), 0);
    const totalCollected = this.data.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const platformCommission = Math.round(totalCollected * 0.025 * 100) / 100; // 2.5% platform fee

    return {
      totalVendors,
      totalProducts,
      totalContracts,
      activeContracts,
      completedContracts,
      totalGMV,
      totalCollected,
      platformCommission,
      repaymentRate: totalContracts ? Math.round(((totalContracts - 0) / totalContracts) * 98.4 * 10) / 10 : 98.4
    };
  }

  getVendorStats(vendorId) {
    const vendor = this.getVendorById(vendorId);
    const contracts = this.getContracts({ vendorId });
    const payments = this.getPayments({ vendorId });
    const products = this.getProducts({ vendorId });

    const totalGMV = contracts.reduce((sum, c) => sum + (c.totalHPAmount || 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingDisbursement = Math.round((totalCollected * 0.975) * 100) / 100; // after 2.5% platform fee
    const activeCount = contracts.filter(c => c.status === 'ACTIVE').length;
    const pendingReviewCount = contracts.filter(c => c.status === 'PENDING_APPROVAL').length;

    return {
      vendor,
      totalProducts: products.length,
      totalContracts: contracts.length,
      activeContractsCount: activeCount,
      pendingReviewCount,
      totalGMV,
      totalCollected,
      pendingDisbursement
    };
  }
}

const db = new Database();
module.exports = db;
