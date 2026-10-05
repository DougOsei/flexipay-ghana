# 🇬🇭 FlexiPay Ghana — Multi-Vendor Hire Purchase & Installment Platform

> **"Buy Now, Pay Small-Small"** — A specialized multi-vendor e-commerce and hire-purchase web application tailored for the Ghanaian retail market.

![FlexiPay Ghana](https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Executive Overview & Market Fit for Ghana

In Ghana, access to formal credit cards is low, but mobile phone penetration and **Mobile Money (MoMo)** usage are amongst the highest globally. High-ticket items like smartphones, refrigerators, televisions, laptops, solar power systems, and cargo motorbikes/tricycles (*Aboboyaa & Pragya*) are in high demand, yet outright cash payments present a barrier for civil servants, corporate staff, and market traders alike.

**FlexiPay Ghana** solves this by bridging verified local merchants with creditworthy consumers through a statutory hire-purchase mechanism:
- **Down Payment Upfront**: Transparent deposits (20% to 50%) paid via MTN MoMo, Telecel Cash, or AT Money.
- **Flexible Tenures**: 3, 6, 9, 12, or 18 months in weekly or monthly installments.
- **Ghana Card Identity Verification**: Strict adherence to the *Hire-Purchase Act of Ghana (1974)* with national ID (`GHA-XXXXXXXXX-X`) and digital residential address (*GhanaPost GPS*).
- **Merchant Escrow Protection**: Deposits and collected repayments are safeguarded in digital escrow, allowing merchants to disburse funds straight to their merchant MoMo wallets.

---

## 🚀 Key Features

### 🛒 1. Customer Experience (Hirer / Buyer)
- **Marketplace Discovery**: Filter genuine products by category (Phones, TVs, Refrigerators, Laptops, Solar Systems, Tricycles).
- **Interactive Hire-Purchase Calculator**: Real-time slider for deposit percentage, tenure duration, and monthly/weekly repayment amounts.
- **Ghana-Compliant Checkout**:
  - Live Ghana Card format validation (`GHA-XXXXXXXXX-X`)
  - GhanaPost GPS validation (e.g. `GA-183-9022`)
  - Guarantor & employment verification
  - Statutory hire-purchase agreement declaration
- **My Small-Small Account (Customer Portal)**:
  - Active contract progress bars (% repaid)
  - Next due installment alert with countdown
  - 1-Click "Pay Installment via MoMo" (MTN MoMo, Telecel Cash, AT Money)
  - 5% Early Settlement bonus incentive
  - Printable official agreement and payment receipts with GRA-style layout

### 🏪 2. Vendor Central (Merchant Store Management)
- **Multi-Store Onboarding**: Seeded with real Ghanaian retail hubs:
  - *Franko Trading Hub* (Circle, Accra)
  - *Kab-Fam Cool & Care* (Spintex Road, Accra)
  - *Hisense Ghana Flagship* (Kaneshie Industrial Area, Accra)
  - *Kumasi Tech Plaza* (Adum, Kumasi)
  - *Accra Motors & Haulage* (Abossey Okai, Accra)
  - *DecoSpace Living* (East Legon, Accra)
- **Hire-Purchase Application Review**: Inspect customer credit profile, Ghana Card, guarantor, and digital address before approving dispatch.
- **Installment Collections Tracker**: Live master schedule tracking paid vs overdue installments.
- **Automated Payment Reminders**: Trigger instant simulated SMS / WhatsApp / MoMo payment push reminders to customers.
- **Product & Credit Rules Catalog**: List new items with custom hire-purchase markups, minimum down payment percentages, and allowed tenures.
- **MoMo Wallet Payouts**: Request instant disbursement of collected funds to the merchant's Mobile Money wallet.

### 🛡️ 3. Platform Administration (FlexiPay Oversight)
- **Central KPIs**: Total Platform GMV, Total Collected Repayments, 2.5% Platform Fee Revenue, and Repayment Health Rate (98.4%).
- **Vendor Verification Management**: Approve or audit merchant stores.
- **Global Contracts Registry**: Complete statutory registry of all executed agreements.
- **Audit & Transaction Ledger**: Full MoMo transaction reference logs.
- **1-Click Demo Reset**: Reset all contracts and state back to fresh baseline anytime.

### 🎭 4. Instant Persona Switcher (Demo Mode)
- **Customer**: Kwesi Mensah (`kwesi@gmail.com`)
- **Vendor 1**: Franko Trading Hub (`franko@frankotrading.com`)
- **Vendor 2**: Kab-Fam Cool & Care (`kabfam@kabfam.com`)
- **Admin**: FlexiPay HQ (`admin@flexipaygh.com`)

---

## 🛠️ Architecture & Tech Stack

```
Multi-Vendor/
├── package.json               # Root scripts & Express backend dependencies
├── server/
│   ├── index.js               # Express application & API server (Port 5000)
│   ├── db.js                  # Persistent database engine with atomic writes
│   ├── seedData.js            # Authentic Ghana vendors, products, and contracts
│   ├── utils/
│   │   └── hpCalculator.js    # Hire-purchase interest, schedules, and Ghana validators
│   └── routes/
│       ├── products.js        # Products catalog & plan calculator endpoints
│       ├── vendors.js         # Vendor store profiles, analytics, and payouts
│       ├── contracts.js       # Hire purchase applications, approvals, delivery
│       ├── payments.js        # MoMo checkout, USSD prompts, transaction ledger
│       ├── admin.js           # Platform metrics & demo reset
│       └── auth.js            # User accounts, role switching, notifications
└── client/
    ├── package.json           # React 18, Vite 6, Tailwind CSS, Lucide icons
    ├── vite.config.js         # Vite proxy configuration
    ├── index.html             # SEO, responsive viewport, Google Fonts
    └── src/
        ├── context/
        │   └── AuthContext.jsx       # Multi-role authentication & real-time alerts
        ├── components/
        │   ├── Navbar.jsx            # Responsive navigation & notifications
        │   ├── RoleSwitcher.jsx      # 1-Click persona switcher
        │   ├── ProductCard.jsx       # Dual pricing cards with HP badge
        │   ├── HirePurchaseCalculator.jsx # Real-time slider & tenure calculator
        │   ├── ApplicationModal.jsx  # Multi-step Ghana Card & MoMo deposit
        │   ├── MoMoPaymentModal.jsx  # Installment repayment gateway
        │   └── ContractReceiptModal.jsx # Printable legal agreement & schedule
        └── pages/
            ├── Marketplace.jsx       # Catalog with search & category filters
            ├── ProductDetails.jsx    # Specs, showroom card & embedded calculator
            ├── CustomerPortal.jsx    # My Small-Small account & schedule
            ├── VendorPortal.jsx      # Vendor central, KYC review, payouts
            ├── AdminPortal.jsx       # Platform governance & metrics
            └── HowItWorks.jsx        # Consumer & vendor guide, FAQs
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Start the Application (Single Command)
```powershell
# In the root directory:
node server/index.js
```

Then open your browser to:
👉 **`http://localhost:5000`**

### Development Mode (with Hot Reload)
If modifying client code with instant reload:
```powershell
# Terminal 1: Backend API
npm run server

# Terminal 2: Vite Dev Server
npm run client
```
Vite will run on `http://localhost:5173` and proxy API calls to port `5000`.

---

## 🇬🇭 Ghanaian Localization Highlights

1. **Currency**: Ghana Cedis (`GH₵` / `GHS`).
2. **Payment Rails**: Direct simulations for **MTN Mobile Money** (`*170#`), **Telecel Cash** (`*110#`), **AT Money**, and **GhQR**.
3. **Identity & KYC**:
   - Ghana Card Format: `GHA-XXXXXXXXX-X`
   - GhanaPost GPS: `GA-183-9022`, `AK-039-4412`, etc.
   - Guarantor contact validation.
4. **Legalities**: Formulated in alignment with the *Hire-Purchase Act of Ghana (1974)* and local commercial retailing standards.

---

## 📄 License
MIT © FlexiPay Ghana Ltd.


---

## Deploying from GitHub

The app has two parts that are hosted separately:

| Part | Host | How |
|---|---|---|
| React frontend (`client/`) | **GitHub Pages** | `.github/workflows/deploy-pages.yml` builds and deploys on every push to `main` |
| Express API (`server/`) | **Render** (free tier) | `render.yaml` Blueprint |

### 1. Deploy the backend (Render)
1. Sign in at [render.com](https://render.com) with GitHub.
2. **New → Blueprint** → pick this repository → **Apply**.
3. Copy the service URL, e.g. `https://flexipay-ghana-api.onrender.com`, and confirm `/api/health` responds.

> The free tier sleeps after inactivity (first request takes ~30s) and its disk is ephemeral, so `server/data.json` resets on restart.

### 2. Point the frontend at the backend
In the GitHub repo: **Settings → Secrets and variables → Actions → Variables → New repository variable**
- Name: `API_URL`
- Value: your Render URL (no trailing slash)

### 3. Enable GitHub Pages
**Settings → Pages → Build and deployment → Source: GitHub Actions**, then re-run the *Deploy frontend to GitHub Pages* workflow (Actions tab).

The site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Local development
```bash
npm install && npm install --prefix client
npm run build:client && npm start      # http://localhost:5000 (single server)
# or, with hot reload:
npm start            # terminal 1 — API on :5000
npm run client       # terminal 2 — Vite on :5173 (proxies /api)
```
