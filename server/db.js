// FlexiPay Ghana Relational Database Layer (SQLite via better-sqlite3)
const fs = require('fs');
const path = require('path');
const DatabaseDriver = require('better-sqlite3');
const { seedVendors, seedProducts, seedUsers, seedContracts } = require('./seedData');

const DB_FILE = path.join(__dirname, 'flexipay.db');
const LEGACY_JSON_FILE = path.join(__dirname, 'data.json');

class FlexiPayDatabase {
  constructor() {
    const dbExists = fs.existsSync(DB_FILE);
    this.sqlite = new DatabaseDriver(DB_FILE);
    this.sqlite.pragma('journal_mode = WAL');
    this.sqlite.pragma('foreign_keys = ON');

    this.createSchema();

    // Check if database is empty (newly created or unseeded)
    const vendorCount = this.sqlite.prepare('SELECT COUNT(*) AS count FROM vendors').get().count;
    if (!dbExists || vendorCount === 0) {
      if (fs.existsSync(LEGACY_JSON_FILE)) {
        try {
          const raw = fs.readFileSync(LEGACY_JSON_FILE, 'utf-8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.vendors) && parsed.vendors.length > 0) {
            this.importData(parsed);
            console.log('[DB] Migrated existing data.json into SQLite database:', DB_FILE);
            return;
          }
        } catch (err) {
          console.warn('[DB] Legacy data.json migration failed, seeding fresh:', err.message);
        }
      }
      this.seedInitial();
      console.log('[DB] Initialized and seeded SQLite database:', DB_FILE);
    } else {
      console.log('[DB] Connected to existing SQLite database:', DB_FILE);
    }
  }

  createSchema() {
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL DEFAULT 'customer',
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        momoNetwork TEXT,
        ghanaCard TEXT,
        digitalAddress TEXT,
        city TEXT,
        region TEXT,
        employment TEXT,
        guarantorName TEXT,
        guarantorPhone TEXT,
        creditScore INTEGER DEFAULT 720,
        hirePurchaseLimitGHS REAL DEFAULT 15000,
        storeId TEXT,
        storeName TEXT,
        activeContractsCount INTEGER DEFAULT 0,
        completedContractsCount INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT,
        tagline TEXT,
        ownerEmail TEXT,
        phone TEXT,
        momoNumber TEXT,
        momoNetwork TEXT,
        momoMerchantName TEXT,
        region TEXT,
        city TEXT,
        digitalAddress TEXT,
        logo TEXT,
        coverImage TEXT,
        rating REAL DEFAULT 5.0,
        reviewCount INTEGER DEFAULT 0,
        verified INTEGER DEFAULT 1,
        totalSalesGHS REAL DEFAULT 0,
        collectedInstallmentsGHS REAL DEFAULT 0,
        activeContractsCount INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT,
        cashPrice REAL NOT NULL,
        markupPercent REAL DEFAULT 10,
        minDownPaymentPercent REAL DEFAULT 20,
        allowedTenures TEXT NOT NULL,
        vendorId TEXT NOT NULL,
        vendorName TEXT,
        vendorCity TEXT,
        stock INTEGER DEFAULT 10,
        image TEXT,
        description TEXT,
        features TEXT,
        rating REAL DEFAULT 5.0,
        reviewsCount INTEGER DEFAULT 1,
        featured INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS contracts (
        id TEXT PRIMARY KEY,
        contractNumber TEXT UNIQUE NOT NULL,
        customerId TEXT NOT NULL,
        customerName TEXT,
        customerPhone TEXT,
        customerGhanaCard TEXT,
        customerAddress TEXT,
        employment TEXT,
        guarantorName TEXT,
        guarantorPhone TEXT,
        vendorId TEXT NOT NULL,
        vendorName TEXT,
        productId TEXT NOT NULL,
        productTitle TEXT,
        productImage TEXT,
        cashPrice REAL,
        markupPercent REAL,
        totalHPAmount REAL,
        downPaymentPercent REAL,
        downPaymentAmount REAL,
        remainingBalance REAL,
        totalPaid REAL DEFAULT 0,
        tenureMonths INTEGER,
        frequency TEXT,
        installmentAmount REAL,
        status TEXT DEFAULT 'PENDING_APPROVAL',
        deliveryStatus TEXT DEFAULT 'PENDING_DISPATCH',
        rejectionReason TEXT,
        createdAt TEXT NOT NULL,
        approvedAt TEXT,
        rejectedAt TEXT,
        deliveredAt TEXT,
        FOREIGN KEY (vendorId) REFERENCES vendors(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS installments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contractId TEXT NOT NULL,
        installmentNumber INTEGER NOT NULL,
        dueDate TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'PENDING',
        paidAt TEXT,
        paymentMethod TEXT,
        transactionRef TEXT,
        FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE,
        UNIQUE (contractId, installmentNumber)
      );

      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        contractId TEXT NOT NULL,
        contractNumber TEXT,
        vendorId TEXT NOT NULL,
        customerId TEXT NOT NULL,
        customerName TEXT,
        type TEXT NOT NULL,
        installmentNumber INTEGER,
        amount REAL NOT NULL,
        method TEXT,
        phone TEXT,
        networkRef TEXT,
        status TEXT DEFAULT 'SUCCESSFUL',
        createdAt TEXT NOT NULL,
        FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        recipientId TEXT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT,
        read INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendorId);
      CREATE INDEX IF NOT EXISTS idx_contracts_customer ON contracts(customerId);
      CREATE INDEX IF NOT EXISTS idx_contracts_vendor ON contracts(vendorId);
      CREATE INDEX IF NOT EXISTS idx_payments_vendor ON payments(vendorId);
      CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipientId);
    `);
  }

  seedInitial() {
    const defaultData = {
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
          title: "Upcoming Installment Reminder",
          message: "Your final installment of GH₵ 1,595 for Hisense 55\" 4K TV is due on 20th April. Pay on time to earn +20 FlexiCredit points.",
          type: "PAYMENT_REMINDER",
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
    };

    this.importData(defaultData);
  }

  importData(dataset) {
    const clearAndSeed = this.sqlite.transaction((data) => {
      this.sqlite.exec(`
        DELETE FROM notifications;
        DELETE FROM payments;
        DELETE FROM installments;
        DELETE FROM contracts;
        DELETE FROM products;
        DELETE FROM vendors;
        DELETE FROM users;
      `);

      const insertUser = this.sqlite.prepare(`
        INSERT INTO users (
          id, role, name, email, phone, momoNetwork, ghanaCard, digitalAddress, city, region,
          employment, guarantorName, guarantorPhone, creditScore, hirePurchaseLimitGHS,
          storeId, storeName, activeContractsCount, completedContractsCount, createdAt
        ) VALUES (
          @id, @role, @name, @email, @phone, @momoNetwork, @ghanaCard, @digitalAddress, @city, @region,
          @employment, @guarantorName, @guarantorPhone, @creditScore, @hirePurchaseLimitGHS,
          @storeId, @storeName, @activeContractsCount, @completedContractsCount, @createdAt
        )
      `);

      for (const u of (data.users || [])) {
        insertUser.run({
          id: u.id,
          role: u.role || 'customer',
          name: u.name,
          email: u.email,
          phone: u.phone || null,
          momoNetwork: u.momoNetwork || null,
          ghanaCard: u.ghanaCard || null,
          digitalAddress: u.digitalAddress || null,
          city: u.city || null,
          region: u.region || null,
          employment: u.employment || null,
          guarantorName: u.guarantorName || null,
          guarantorPhone: u.guarantorPhone || null,
          creditScore: u.creditScore ?? 720,
          hirePurchaseLimitGHS: u.hirePurchaseLimitGHS ?? 15000,
          storeId: u.storeId || null,
          storeName: u.storeName || null,
          activeContractsCount: u.activeContractsCount ?? 0,
          completedContractsCount: u.completedContractsCount ?? 0,
          createdAt: u.createdAt || new Date().toISOString()
        });
      }

      const insertVendor = this.sqlite.prepare(`
        INSERT INTO vendors (
          id, name, slug, tagline, ownerEmail, phone, momoNumber, momoNetwork, momoMerchantName,
          region, city, digitalAddress, logo, coverImage, rating, reviewCount, verified,
          totalSalesGHS, collectedInstallmentsGHS, activeContractsCount, createdAt
        ) VALUES (
          @id, @name, @slug, @tagline, @ownerEmail, @phone, @momoNumber, @momoNetwork, @momoMerchantName,
          @region, @city, @digitalAddress, @logo, @coverImage, @rating, @reviewCount, @verified,
          @totalSalesGHS, @collectedInstallmentsGHS, @activeContractsCount, @createdAt
        )
      `);

      for (const v of (data.vendors || [])) {
        insertVendor.run({
          id: v.id,
          name: v.name,
          slug: v.slug || null,
          tagline: v.tagline || null,
          ownerEmail: v.ownerEmail || null,
          phone: v.phone || null,
          momoNumber: v.momoNumber || null,
          momoNetwork: v.momoNetwork || 'MTN_MOMO',
          momoMerchantName: v.momoMerchantName || v.name,
          region: v.region || 'Greater Accra',
          city: v.city || 'Accra',
          digitalAddress: v.digitalAddress || 'GA-000-0000',
          logo: v.logo || null,
          coverImage: v.coverImage || null,
          rating: v.rating ?? 5.0,
          reviewCount: v.reviewCount ?? 0,
          verified: v.verified === false ? 0 : 1,
          totalSalesGHS: v.totalSalesGHS ?? 0,
          collectedInstallmentsGHS: v.collectedInstallmentsGHS ?? 0,
          activeContractsCount: v.activeContractsCount ?? 0,
          createdAt: v.createdAt || new Date().toISOString()
        });
      }

      const insertProduct = this.sqlite.prepare(`
        INSERT INTO products (
          id, title, category, brand, cashPrice, markupPercent, minDownPaymentPercent,
          allowedTenures, vendorId, vendorName, vendorCity, stock, image, description,
          features, rating, reviewsCount, featured, createdAt
        ) VALUES (
          @id, @title, @category, @brand, @cashPrice, @markupPercent, @minDownPaymentPercent,
          @allowedTenures, @vendorId, @vendorName, @vendorCity, @stock, @image, @description,
          @features, @rating, @reviewsCount, @featured, @createdAt
        )
      `);

      for (const p of (data.products || [])) {
        insertProduct.run({
          id: p.id,
          title: p.title,
          category: p.category,
          brand: p.brand || 'Generic',
          cashPrice: p.cashPrice,
          markupPercent: p.markupPercent ?? 10,
          minDownPaymentPercent: p.minDownPaymentPercent ?? 20,
          allowedTenures: JSON.stringify(p.allowedTenures || [3, 6, 12]),
          vendorId: p.vendorId,
          vendorName: p.vendorName || null,
          vendorCity: p.vendorCity || null,
          stock: p.stock ?? 10,
          image: p.image || null,
          description: p.description || null,
          features: JSON.stringify(p.features || []),
          rating: p.rating ?? 5.0,
          reviewsCount: p.reviewsCount ?? 1,
          featured: p.featured ? 1 : 0,
          createdAt: p.createdAt || new Date().toISOString()
        });
      }

      const insertContract = this.sqlite.prepare(`
        INSERT INTO contracts (
          id, contractNumber, customerId, customerName, customerPhone, customerGhanaCard,
          customerAddress, employment, guarantorName, guarantorPhone, vendorId, vendorName,
          productId, productTitle, productImage, cashPrice, markupPercent, totalHPAmount,
          downPaymentPercent, downPaymentAmount, remainingBalance, totalPaid, tenureMonths,
          frequency, installmentAmount, status, deliveryStatus, rejectionReason,
          createdAt, approvedAt, rejectedAt, deliveredAt
        ) VALUES (
          @id, @contractNumber, @customerId, @customerName, @customerPhone, @customerGhanaCard,
          @customerAddress, @employment, @guarantorName, @guarantorPhone, @vendorId, @vendorName,
          @productId, @productTitle, @productImage, @cashPrice, @markupPercent, @totalHPAmount,
          @downPaymentPercent, @downPaymentAmount, @remainingBalance, @totalPaid, @tenureMonths,
          @frequency, @installmentAmount, @status, @deliveryStatus, @rejectionReason,
          @createdAt, @approvedAt, @rejectedAt, @deliveredAt
        )
      `);

      const insertInstallment = this.sqlite.prepare(`
        INSERT INTO installments (
          contractId, installmentNumber, dueDate, amount, status, paidAt, paymentMethod, transactionRef
        ) VALUES (
          @contractId, @installmentNumber, @dueDate, @amount, @status, @paidAt, @paymentMethod, @transactionRef
        )
      `);

      for (const c of (data.contracts || [])) {
        insertContract.run({
          id: c.id,
          contractNumber: c.contractNumber,
          customerId: c.customerId,
          customerName: c.customerName || null,
          customerPhone: c.customerPhone || null,
          customerGhanaCard: c.customerGhanaCard || null,
          customerAddress: c.customerAddress || null,
          employment: c.employment || null,
          guarantorName: c.guarantorName || null,
          guarantorPhone: c.guarantorPhone || null,
          vendorId: c.vendorId,
          vendorName: c.vendorName || null,
          productId: c.productId,
          productTitle: c.productTitle || null,
          productImage: c.productImage || null,
          cashPrice: c.cashPrice ?? 0,
          markupPercent: c.markupPercent ?? 10,
          totalHPAmount: c.totalHPAmount ?? 0,
          downPaymentPercent: c.downPaymentPercent ?? 20,
          downPaymentAmount: c.downPaymentAmount ?? 0,
          remainingBalance: c.outstandingBalance ?? c.remainingBalance ?? 0,
          totalPaid: c.totalPaid ?? 0,
          tenureMonths: c.tenureMonths ?? 3,
          frequency: c.frequency || 'monthly',
          installmentAmount: c.installmentAmount ?? 0,
          status: c.status || 'PENDING_APPROVAL',
          deliveryStatus: c.deliveryStatus || 'PENDING_DISPATCH',
          rejectionReason: c.rejectionReason || null,
          createdAt: c.createdAt || new Date().toISOString(),
          approvedAt: c.approvedAt || null,
          rejectedAt: c.rejectedAt || null,
          deliveredAt: c.deliveredAt || null
        });

        for (const inst of (c.installments || [])) {
          insertInstallment.run({
            contractId: c.id,
            installmentNumber: inst.installmentNumber,
            dueDate: inst.dueDate,
            amount: inst.amount,
            status: inst.status || 'PENDING',
            paidAt: inst.paidAt || null,
            paymentMethod: inst.paymentMethod || null,
            transactionRef: inst.transactionRef || null
          });
        }
      }

      const insertPayment = this.sqlite.prepare(`
        INSERT INTO payments (
          id, contractId, contractNumber, vendorId, customerId, customerName,
          type, installmentNumber, amount, method, phone, networkRef, status, createdAt
        ) VALUES (
          @id, @contractId, @contractNumber, @vendorId, @customerId, @customerName,
          @type, @installmentNumber, @amount, @method, @phone, @networkRef, @status, @createdAt
        )
      `);

      for (const p of (data.payments || [])) {
        insertPayment.run({
          id: p.id,
          contractId: p.contractId,
          contractNumber: p.contractNumber || null,
          vendorId: p.vendorId,
          customerId: p.customerId,
          customerName: p.customerName || null,
          type: p.type,
          installmentNumber: p.installmentNumber ?? null,
          amount: p.amount,
          method: p.method || 'MTN_MOMO',
          phone: p.phone || null,
          networkRef: p.networkRef || null,
          status: p.status || 'SUCCESSFUL',
          createdAt: p.createdAt || new Date().toISOString()
        });
      }

      const insertNotif = this.sqlite.prepare(`
        INSERT INTO notifications (
          id, recipientId, title, message, type, read, createdAt
        ) VALUES (
          @id, @recipientId, @title, @message, @type, @read, @createdAt
        )
      `);

      for (const n of (data.notifications || [])) {
        insertNotif.run({
          id: n.id,
          recipientId: n.recipientId || null,
          title: n.title,
          message: n.message,
          type: n.type || 'INFO',
          read: n.read ? 1 : 0,
          createdAt: n.createdAt || new Date().toISOString()
        });
      }
    });

    clearAndSeed(dataset);
  }

  // Hydration helpers
  _hydrateVendor(row) {
    if (!row) return null;
    return { ...row, verified: Boolean(row.verified) };
  }

  _hydrateProduct(row) {
    if (!row) return null;
    let allowedTenures = [3, 6, 12];
    let features = [];
    try { allowedTenures = JSON.parse(row.allowedTenures || '[3,6,12]'); } catch (_) {}
    try { features = JSON.parse(row.features || '[]'); } catch (_) {}
    return {
      ...row,
      allowedTenures,
      features,
      featured: Boolean(row.featured)
    };
  }

  _hydrateContract(row) {
    if (!row) return null;
    const installments = this.sqlite
      .prepare('SELECT installmentNumber, dueDate, amount, status, paidAt, paymentMethod, transactionRef FROM installments WHERE contractId = ? ORDER BY installmentNumber ASC')
      .all(row.id);
    return {
      ...row,
      outstandingBalance: row.remainingBalance,
      installments
    };
  }

  _hydrateNotification(row) {
    if (!row) return null;
    return { ...row, read: Boolean(row.read) };
  }

  // --- USERS ---
  getUsers() {
    return this.sqlite.prepare('SELECT * FROM users ORDER BY createdAt ASC').all();
  }

  findUser({ email, role, id } = {}) {
    if (id) {
      return this.sqlite.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;
    }
    if (email) {
      return this.sqlite.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email) || null;
    }
    if (role) {
      return this.sqlite.prepare('SELECT * FROM users WHERE role = ?').get(role) || null;
    }
    return null;
  }

  addUser(userData) {
    const newUser = {
      id: userData.id || `usr_${Date.now()}`,
      role: userData.role || 'customer',
      name: userData.name,
      email: userData.email,
      phone: userData.phone || null,
      momoNetwork: userData.momoNetwork || 'MTN_MOMO',
      ghanaCard: userData.ghanaCard || 'GHA-000000000-0',
      digitalAddress: userData.digitalAddress || 'GA-000-0000',
      city: userData.city || 'Accra',
      region: userData.region || 'Greater Accra',
      employment: userData.employment || 'Self Employed',
      guarantorName: userData.guarantorName || null,
      guarantorPhone: userData.guarantorPhone || null,
      creditScore: userData.creditScore ?? 720,
      hirePurchaseLimitGHS: userData.hirePurchaseLimitGHS ?? 15000,
      storeId: userData.storeId || null,
      storeName: userData.storeName || null,
      activeContractsCount: 0,
      completedContractsCount: 0,
      createdAt: userData.createdAt || new Date().toISOString()
    };

    this.sqlite.prepare(`
      INSERT INTO users (
        id, role, name, email, phone, momoNetwork, ghanaCard, digitalAddress, city, region,
        employment, guarantorName, guarantorPhone, creditScore, hirePurchaseLimitGHS,
        storeId, storeName, activeContractsCount, completedContractsCount, createdAt
      ) VALUES (
        @id, @role, @name, @email, @phone, @momoNetwork, @ghanaCard, @digitalAddress, @city, @region,
        @employment, @guarantorName, @guarantorPhone, @creditScore, @hirePurchaseLimitGHS,
        @storeId, @storeName, @activeContractsCount, @completedContractsCount, @createdAt
      )
    `).run(newUser);

    return this.findUser({ id: newUser.id });
  }

  // --- PRODUCTS ---
  getProducts({ category, search, vendorId, sort, minPrice, maxPrice, featured } = {}) {
    const conditions = [];
    const params = [];

    if (category && category !== 'All') {
      conditions.push('LOWER(category) = LOWER(?)');
      params.push(category);
    }
    if (vendorId) {
      conditions.push('vendorId = ?');
      params.push(vendorId);
    }
    if (search) {
      conditions.push('(LOWER(title) LIKE ? OR LOWER(category) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(vendorName) LIKE ? OR LOWER(description) LIKE ?)');
      const like = `%${search.toLowerCase()}%`;
      params.push(like, like, like, like, like);
    }
    if (minPrice) {
      conditions.push('cashPrice >= ?');
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      conditions.push('cashPrice <= ?');
      params.push(Number(maxPrice));
    }
    if (featured === 'true' || featured === true) {
      conditions.push('featured = 1');
    }

    let sql = 'SELECT * FROM products';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'price_asc') {
      sql += ' ORDER BY cashPrice ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY cashPrice DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else {
      sql += ' ORDER BY featured DESC, createdAt DESC';
    }

    const rows = this.sqlite.prepare(sql).all(...params);
    return rows.map((r) => this._hydrateProduct(r));
  }

  getProductById(id) {
    const row = this.sqlite.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return this._hydrateProduct(row);
  }

  addProduct(productData) {
    const newProduct = {
      id: `prod_${Date.now()}`,
      title: productData.title,
      category: productData.category || 'Electronics & TV',
      brand: productData.brand || 'Generic',
      cashPrice: Number(productData.cashPrice),
      markupPercent: Number(productData.markupPercent) || 10,
      minDownPaymentPercent: Number(productData.minDownPaymentPercent) || 20,
      allowedTenures: JSON.stringify(productData.allowedTenures || [3, 6, 12]),
      vendorId: productData.vendorId,
      vendorName: productData.vendorName || 'Official Vendor',
      vendorCity: productData.vendorCity || 'Accra',
      stock: Number(productData.stock) || 10,
      image: productData.image || null,
      description: productData.description || null,
      features: JSON.stringify(Array.isArray(productData.features) ? productData.features : []),
      rating: 5.0,
      reviewsCount: 1,
      featured: productData.featured ? 1 : 0,
      createdAt: new Date().toISOString()
    };

    this.sqlite.prepare(`
      INSERT INTO products (
        id, title, category, brand, cashPrice, markupPercent, minDownPaymentPercent,
        allowedTenures, vendorId, vendorName, vendorCity, stock, image, description,
        features, rating, reviewsCount, featured, createdAt
      ) VALUES (
        @id, @title, @category, @brand, @cashPrice, @markupPercent, @minDownPaymentPercent,
        @allowedTenures, @vendorId, @vendorName, @vendorCity, @stock, @image, @description,
        @features, @rating, @reviewsCount, @featured, @createdAt
      )
    `).run(newProduct);

    return this.getProductById(newProduct.id);
  }

  updateProduct(id, updates) {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates
    };

    this.sqlite.prepare(`
      UPDATE products SET
        title = @title,
        category = @category,
        brand = @brand,
        cashPrice = @cashPrice,
        markupPercent = @markupPercent,
        minDownPaymentPercent = @minDownPaymentPercent,
        allowedTenures = @allowedTenures,
        stock = @stock,
        image = @image,
        description = @description,
        features = @features,
        featured = @featured
      WHERE id = @id
    `).run({
      id,
      title: merged.title,
      category: merged.category,
      brand: merged.brand || 'Generic',
      cashPrice: Number(merged.cashPrice),
      markupPercent: Number(merged.markupPercent),
      minDownPaymentPercent: Number(merged.minDownPaymentPercent),
      allowedTenures: JSON.stringify(merged.allowedTenures || [3, 6, 12]),
      stock: Number(merged.stock),
      image: merged.image,
      description: merged.description,
      features: JSON.stringify(merged.features || []),
      featured: merged.featured ? 1 : 0
    });

    return this.getProductById(id);
  }

  deleteProduct(id) {
    const info = this.sqlite.prepare('DELETE FROM products WHERE id = ?').run(id);
    return info.changes > 0;
  }

  // --- VENDORS ---
  getVendors() {
    const rows = this.sqlite.prepare('SELECT * FROM vendors ORDER BY createdAt ASC').all();
    return rows.map((r) => this._hydrateVendor(r));
  }

  getVendorById(id) {
    const row = this.sqlite.prepare('SELECT * FROM vendors WHERE id = ?').get(id);
    return this._hydrateVendor(row);
  }

  addVendor(vendorData) {
    const newVendor = {
      id: `ven_${Date.now()}`,
      name: vendorData.name,
      slug: vendorData.slug || null,
      tagline: vendorData.tagline || null,
      ownerEmail: vendorData.ownerEmail || null,
      phone: vendorData.phone || null,
      momoNumber: vendorData.momoNumber || null,
      momoNetwork: vendorData.momoNetwork || 'MTN_MOMO',
      momoMerchantName: vendorData.momoMerchantName || vendorData.name.toUpperCase(),
      region: vendorData.region || 'Greater Accra',
      city: vendorData.city || 'Accra',
      digitalAddress: vendorData.digitalAddress || 'GA-000-0000',
      logo: vendorData.logo || null,
      coverImage: vendorData.coverImage || null,
      rating: 5.0,
      reviewCount: 0,
      verified: 1,
      totalSalesGHS: 0,
      collectedInstallmentsGHS: 0,
      activeContractsCount: 0,
      createdAt: new Date().toISOString()
    };

    this.sqlite.prepare(`
      INSERT INTO vendors (
        id, name, slug, tagline, ownerEmail, phone, momoNumber, momoNetwork, momoMerchantName,
        region, city, digitalAddress, logo, coverImage, rating, reviewCount, verified,
        totalSalesGHS, collectedInstallmentsGHS, activeContractsCount, createdAt
      ) VALUES (
        @id, @name, @slug, @tagline, @ownerEmail, @phone, @momoNumber, @momoNetwork, @momoMerchantName,
        @region, @city, @digitalAddress, @logo, @coverImage, @rating, @reviewCount, @verified,
        @totalSalesGHS, @collectedInstallmentsGHS, @activeContractsCount, @createdAt
      )
    `).run(newVendor);

    return this.getVendorById(newVendor.id);
  }

  updateVendor(id, updates) {
    const existing = this.getVendorById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates };
    this.sqlite.prepare(`
      UPDATE vendors SET
        name = @name,
        tagline = @tagline,
        phone = @phone,
        momoNumber = @momoNumber,
        momoNetwork = @momoNetwork,
        region = @region,
        city = @city,
        digitalAddress = @digitalAddress,
        verified = @verified,
        totalSalesGHS = @totalSalesGHS,
        collectedInstallmentsGHS = @collectedInstallmentsGHS,
        activeContractsCount = @activeContractsCount
      WHERE id = @id
    `).run({
      id,
      name: merged.name,
      tagline: merged.tagline,
      phone: merged.phone,
      momoNumber: merged.momoNumber,
      momoNetwork: merged.momoNetwork,
      region: merged.region,
      city: merged.city,
      digitalAddress: merged.digitalAddress,
      verified: merged.verified ? 1 : 0,
      totalSalesGHS: merged.totalSalesGHS ?? 0,
      collectedInstallmentsGHS: merged.collectedInstallmentsGHS ?? 0,
      activeContractsCount: merged.activeContractsCount ?? 0
    });

    return this.getVendorById(id);
  }

  // --- CONTRACTS ---
  getContracts({ customerId, vendorId, status } = {}) {
    const conditions = [];
    const params = [];

    if (customerId) {
      conditions.push('customerId = ?');
      params.push(customerId);
    }
    if (vendorId) {
      conditions.push('vendorId = ?');
      params.push(vendorId);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    let sql = 'SELECT * FROM contracts';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY createdAt DESC';

    const rows = this.sqlite.prepare(sql).all(...params);
    return rows.map((r) => this._hydrateContract(r));
  }

  getContractById(idOrNumber) {
    const row = this.sqlite
      .prepare('SELECT * FROM contracts WHERE id = ? OR contractNumber = ?')
      .get(idOrNumber, idOrNumber);
    return this._hydrateContract(row);
  }

  createContract(contractData) {
    const id = `cnt_${Date.now()}`;
    const contractNumber = `HP-GH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalPaid = Number(contractData.downPaymentAmount) || 0;
    const outstandingBalance = Number(contractData.remainingBalance) || 0;
    const createdAt = new Date().toISOString();

    const tx = this.sqlite.transaction(() => {
      this.sqlite.prepare(`
        INSERT INTO contracts (
          id, contractNumber, customerId, customerName, customerPhone, customerGhanaCard,
          customerAddress, employment, guarantorName, guarantorPhone, vendorId, vendorName,
          productId, productTitle, productImage, cashPrice, markupPercent, totalHPAmount,
          downPaymentPercent, downPaymentAmount, remainingBalance, totalPaid, tenureMonths,
          frequency, installmentAmount, status, deliveryStatus, createdAt, approvedAt
        ) VALUES (
          @id, @contractNumber, @customerId, @customerName, @customerPhone, @customerGhanaCard,
          @customerAddress, @employment, @guarantorName, @guarantorPhone, @vendorId, @vendorName,
          @productId, @productTitle, @productImage, @cashPrice, @markupPercent, @totalHPAmount,
          @downPaymentPercent, @downPaymentAmount, @remainingBalance, @totalPaid, @tenureMonths,
          @frequency, @installmentAmount, @status, @deliveryStatus, @createdAt, @approvedAt
        )
      `).run({
        id,
        contractNumber,
        customerId: contractData.customerId,
        customerName: contractData.customerName,
        customerPhone: contractData.customerPhone,
        customerGhanaCard: contractData.customerGhanaCard,
        customerAddress: contractData.customerAddress,
        employment: contractData.employment,
        guarantorName: contractData.guarantorName,
        guarantorPhone: contractData.guarantorPhone,
        vendorId: contractData.vendorId,
        vendorName: contractData.vendorName,
        productId: contractData.productId,
        productTitle: contractData.productTitle,
        productImage: contractData.productImage,
        cashPrice: contractData.cashPrice,
        markupPercent: contractData.markupPercent,
        totalHPAmount: contractData.totalHPAmount,
        downPaymentPercent: contractData.downPaymentPercent,
        downPaymentAmount: contractData.downPaymentAmount,
        remainingBalance: outstandingBalance,
        totalPaid,
        tenureMonths: contractData.tenureMonths,
        frequency: contractData.frequency,
        installmentAmount: contractData.installmentAmount,
        status: 'PENDING_APPROVAL',
        deliveryStatus: 'PENDING_DISPATCH',
        createdAt,
        approvedAt: null
      });

      const insertInst = this.sqlite.prepare(`
        INSERT INTO installments (contractId, installmentNumber, dueDate, amount, status)
        VALUES (?, ?, ?, ?, 'PENDING')
      `);
      for (const inst of (contractData.installments || [])) {
        insertInst.run(id, inst.installmentNumber, inst.dueDate, inst.amount);
      }

      this.sqlite.prepare(`
        UPDATE vendors SET
          totalSalesGHS = COALESCE(totalSalesGHS, 0) + ?,
          collectedInstallmentsGHS = COALESCE(collectedInstallmentsGHS, 0) + ?,
          activeContractsCount = COALESCE(activeContractsCount, 0) + 1
        WHERE id = ?
      `).run(contractData.totalHPAmount || 0, totalPaid, contractData.vendorId);

      this.addNotification({
        recipientId: contractData.vendorId,
        title: 'New Hire-Purchase Application!',
        message: `${contractData.customerName} submitted an installment purchase for ${contractData.productTitle} (GH₵ ${contractData.totalHPAmount}). Review Ghana Card & details.`,
        type: 'NEW_APPLICATION'
      });
    });

    tx();
    return this.getContractById(id);
  }

  updateContract(id, updates) {
    const existing = this.getContractById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates };
    this.sqlite.prepare(`
      UPDATE contracts SET
        status = @status,
        deliveryStatus = @deliveryStatus,
        rejectionReason = @rejectionReason,
        approvedAt = @approvedAt,
        rejectedAt = @rejectedAt,
        deliveredAt = @deliveredAt,
        totalPaid = @totalPaid,
        remainingBalance = @remainingBalance
      WHERE id = @id
    `).run({
      id,
      status: merged.status,
      deliveryStatus: merged.deliveryStatus,
      rejectionReason: merged.rejectionReason || null,
      approvedAt: merged.approvedAt || null,
      rejectedAt: merged.rejectedAt || null,
      deliveredAt: merged.deliveredAt || null,
      totalPaid: merged.totalPaid ?? 0,
      remainingBalance: merged.remainingBalance ?? 0
    });

    return this.getContractById(id);
  }

  // --- PAYMENTS & REPAYMENTS ---
  payInstallment(contractId, installmentNumber, { paymentMethod, phone, networkRef, amount } = {}) {
    const contract = this.getContractById(contractId);
    if (!contract) throw new Error('Contract not found');

    const inst = contract.installments.find((i) => i.installmentNumber === Number(installmentNumber));
    if (!inst) throw new Error('Installment not found');
    if (inst.status === 'PAID') throw new Error('Installment is already paid');

    const payAmount = Number(amount) || inst.amount;
    const paidAt = new Date().toISOString();
    const method = paymentMethod || 'MTN_MOMO';
    const txRef = networkRef || `MOMO-GH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTotalPaid = Math.round(((contract.totalPaid || 0) + payAmount) * 100) / 100;
    const newBalance = Math.max(0, Math.round(((contract.remainingBalance ?? contract.outstandingBalance ?? 0) - payAmount) * 100) / 100);

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
      method,
      phone: phone || contract.customerPhone,
      networkRef: txRef,
      status: 'SUCCESSFUL',
      createdAt: paidAt
    };

    const tx = this.sqlite.transaction(() => {
      this.sqlite.prepare(`
        UPDATE installments SET
          status = 'PAID',
          paidAt = ?,
          paymentMethod = ?,
          transactionRef = ?
        WHERE contractId = ? AND installmentNumber = ?
      `).run(paidAt, method, txRef, contract.id, Number(installmentNumber));

      const remainingPending = this.sqlite.prepare(
        "SELECT COUNT(*) AS cnt FROM installments WHERE contractId = ? AND status != 'PAID'"
      ).get(contract.id).cnt;

      const nextStatus = (remainingPending === 0 || newBalance <= 0) ? 'COMPLETED' : contract.status;

      this.sqlite.prepare(`
        UPDATE contracts SET
          totalPaid = ?,
          remainingBalance = ?,
          status = ?
        WHERE id = ?
      `).run(newTotalPaid, newBalance, nextStatus, contract.id);

      this.sqlite.prepare(`
        UPDATE vendors SET
          collectedInstallmentsGHS = COALESCE(collectedInstallmentsGHS, 0) + ?
        WHERE id = ?
      `).run(payAmount, contract.vendorId);

      this.addPayment(paymentRecord);

      this.addNotification({
        recipientId: contract.customerId,
        title: 'MoMo Payment Received!',
        message: `GH₵ ${payAmount.toLocaleString()} received for ${contract.productTitle} (Ref: ${txRef}). Outstanding: GH₵ ${newBalance.toLocaleString()}.`,
        type: 'PAYMENT_SUCCESS'
      });
    });

    tx();

    const updatedContract = this.getContractById(contract.id);
    // Alias outstandingBalance for frontend backwards compatibility
    updatedContract.outstandingBalance = updatedContract.remainingBalance;

    return { contract: updatedContract, paymentRecord };
  }

  addPayment(paymentData) {
    const rec = {
      id: paymentData.id || `pay_${Date.now()}`,
      contractId: paymentData.contractId,
      contractNumber: paymentData.contractNumber || null,
      vendorId: paymentData.vendorId,
      customerId: paymentData.customerId,
      customerName: paymentData.customerName || null,
      type: paymentData.type,
      installmentNumber: paymentData.installmentNumber ?? null,
      amount: Number(paymentData.amount),
      method: paymentData.method || 'MTN_MOMO',
      phone: paymentData.phone || null,
      networkRef: paymentData.networkRef || null,
      status: paymentData.status || 'SUCCESSFUL',
      createdAt: paymentData.createdAt || new Date().toISOString()
    };

    this.sqlite.prepare(`
      INSERT INTO payments (
        id, contractId, contractNumber, vendorId, customerId, customerName,
        type, installmentNumber, amount, method, phone, networkRef, status, createdAt
      ) VALUES (
        @id, @contractId, @contractNumber, @vendorId, @customerId, @customerName,
        @type, @installmentNumber, @amount, @method, @phone, @networkRef, @status, @createdAt
      )
    `).run(rec);

    return rec;
  }

  getPayments({ vendorId, customerId } = {}) {
    const conditions = [];
    const params = [];

    if (vendorId) {
      conditions.push('vendorId = ?');
      params.push(vendorId);
    }
    if (customerId) {
      conditions.push('customerId = ?');
      params.push(customerId);
    }

    let sql = 'SELECT * FROM payments';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY createdAt DESC';

    return this.sqlite.prepare(sql).all(...params);
  }

  getPaymentById(idOrRef) {
    return this.sqlite
      .prepare('SELECT * FROM payments WHERE id = ? OR networkRef = ?')
      .get(idOrRef, idOrRef) || null;
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId) {
    const rows = this.sqlite
      .prepare('SELECT * FROM notifications WHERE recipientId = ? OR recipientId IS NULL ORDER BY createdAt DESC')
      .all(userId);
    return rows.map((r) => this._hydrateNotification(r));
  }

  addNotification(notif) {
    const rec = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      recipientId: notif.recipientId || null,
      title: notif.title,
      message: notif.message,
      type: notif.type || 'INFO',
      read: 0,
      createdAt: new Date().toISOString()
    };

    this.sqlite.prepare(`
      INSERT INTO notifications (id, recipientId, title, message, type, read, createdAt)
      VALUES (@id, @recipientId, @title, @message, @type, @read, @createdAt)
    `).run(rec);

    return this._hydrateNotification(rec);
  }

  markNotificationRead(id) {
    this.sqlite.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
    const row = this.sqlite.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
    return this._hydrateNotification(row);
  }

  // --- STATS & TELEMETRY ---
  getDatabaseHealth() {
    const tables = {};
    for (const tableName of ['users', 'vendors', 'products', 'contracts', 'installments', 'payments', 'notifications']) {
      tables[tableName] = this.sqlite.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
    }
    const sqliteVersion = this.sqlite.prepare('SELECT sqlite_version() AS v').get().v;
    const stats = fs.existsSync(DB_FILE) ? fs.statSync(DB_FILE) : null;
    return {
      connected: true,
      engine: `SQLite ${sqliteVersion} (WAL Mode)`,
      file: path.basename(DB_FILE),
      sizeKB: stats ? Math.round((stats.size / 1024) * 10) / 10 : 0,
      tables
    };
  }

  getPlatformStats() {
    const totalVendors = this.sqlite.prepare('SELECT COUNT(*) AS c FROM vendors').get().c;
    const totalProducts = this.sqlite.prepare('SELECT COUNT(*) AS c FROM products').get().c;
    const totalContracts = this.sqlite.prepare('SELECT COUNT(*) AS c FROM contracts').get().c;
    const activeContracts = this.sqlite.prepare("SELECT COUNT(*) AS c FROM contracts WHERE status = 'ACTIVE'").get().c;
    const completedContracts = this.sqlite.prepare("SELECT COUNT(*) AS c FROM contracts WHERE status = 'COMPLETED'").get().c;
    const totalGMV = this.sqlite.prepare('SELECT COALESCE(SUM(totalHPAmount), 0) AS s FROM contracts').get().s;
    const totalCollected = this.sqlite.prepare('SELECT COALESCE(SUM(amount), 0) AS s FROM payments').get().s;
    const platformCommission = Math.round(totalCollected * 0.025 * 100) / 100;

    return {
      totalVendors,
      totalProducts,
      totalContracts,
      activeContracts,
      completedContracts,
      totalGMV,
      totalCollected,
      platformCommission,
      repaymentRate: totalContracts ? 98.4 : 100
    };
  }

  getVendorStats(vendorId) {
    const vendor = this.getVendorById(vendorId);
    const totalProducts = this.sqlite.prepare('SELECT COUNT(*) AS c FROM products WHERE vendorId = ?').get(vendorId).c;
    const totalContracts = this.sqlite.prepare('SELECT COUNT(*) AS c FROM contracts WHERE vendorId = ?').get(vendorId).c;
    const activeContractsCount = this.sqlite.prepare("SELECT COUNT(*) AS c FROM contracts WHERE vendorId = ? AND status = 'ACTIVE'").get(vendorId).c;
    const pendingReviewCount = this.sqlite.prepare("SELECT COUNT(*) AS c FROM contracts WHERE vendorId = ? AND status = 'PENDING_APPROVAL'").get(vendorId).c;
    const totalGMV = this.sqlite.prepare('SELECT COALESCE(SUM(totalHPAmount), 0) AS s FROM contracts WHERE vendorId = ?').get(vendorId).s;
    const totalCollected = this.sqlite.prepare('SELECT COALESCE(SUM(amount), 0) AS s FROM payments WHERE vendorId = ?').get(vendorId).s;
    const pendingDisbursement = Math.round((totalCollected * 0.975) * 100) / 100;

    return {
      vendor,
      totalProducts,
      totalContracts,
      activeContractsCount,
      pendingReviewCount,
      totalGMV,
      totalCollected,
      pendingDisbursement
    };
  }
}

const db = new FlexiPayDatabase();
module.exports = db;
