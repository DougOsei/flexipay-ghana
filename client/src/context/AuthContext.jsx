import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USERS = {
  customer: {
    id: "usr_customer_kwesi",
    role: "customer",
    name: "Kwesi Mensah",
    email: "kwesi@gmail.com",
    phone: "0244123456",
    momoNetwork: "MTN_MOMO",
    ghanaCard: "GHA-721839201-4",
    digitalAddress: "GA-183-9022",
    city: "Adabraka, Accra",
    employment: "Civil Servant (Ministry of Finance - CAGD)",
    guarantorName: "Nana Ama Osei",
    guarantorPhone: "0209887766",
    creditScore: 780,
    hirePurchaseLimitGHS: 25000
  },
  vendor: {
    id: "usr_vendor_franko",
    role: "vendor",
    name: "Franko Trading Ent",
    email: "franko@frankotrading.com",
    phone: "0244112233",
    storeId: "ven_franko",
    storeName: "Franko Trading Hub"
  },
  admin: {
    id: "usr_admin",
    role: "admin",
    name: "FlexiPay Admin HQ",
    email: "admin@flexipaygh.com",
    phone: "0302998877"
  }
};

export function AuthProvider({ children, initialRole = 'customer' }) {
  const [user, setUser] = useState(DEFAULT_USERS[initialRole] ?? null);

  const [activeVendorStore, setActiveVendorStore] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [customerActiveContractsCount, setCustomerActiveContractsCount] = useState(1);
  const [vendorPendingApplicationsCount, setVendorPendingApplicationsCount] = useState(1);

  // Fetch accounts on mount
  useEffect(() => {
    fetch('/api/auth/accounts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailableAccounts(data.users);
        }
      })
      .catch(err => console.warn('Could not load accounts:', err));
  }, []);

  // Fetch role-specific badge counts
  useEffect(() => {
    if (!user) return;

    if (user.role === 'customer') {
      fetch(`/api/contracts?customerId=${encodeURIComponent(user.id)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.contracts) {
            const active = data.contracts.filter(c => c.status === 'ACTIVE').length;
            setCustomerActiveContractsCount(active);
          }
        })
        .catch(() => {});
    } else if (user.role === 'vendor') {
      const storeId = user.storeId || 'ven_franko';
      fetch(`/api/contracts?vendorId=${encodeURIComponent(storeId)}&status=PENDING_APPROVAL`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.contracts) {
            setVendorPendingApplicationsCount(data.contracts.length);
          }
        })
        .catch(() => {});
    }
  }, [user?.id, user?.role]);

  // Fetch notifications whenever user changes
  useEffect(() => {
    if (!user || !user.id) return;
    const fetchNotifs = () => {
      fetch(`/api/auth/notifications/${encodeURIComponent(user.id)}`)
        .then(res => {
          if (!res.ok) return null;
          return res.json();
        })
        .then(data => {
          if (data && data.success) {
            setNotifications(data.notifications || []);
          }
        })
        .catch(() => {});
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToastMessage({ message, type, id });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const switchRole = async (targetRole, emailOverride = null) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole, email: emailOverride })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setActiveVendorStore(data.vendorStore || null);
        showToast(`Signed in as ${data.user.role.toUpperCase()}: ${data.user.name}`, 'info');
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveVendorStore(null);
    showToast('Signed out. Browsing as Guest.', 'info');
  };

  const markNotificationRead = async (id) => {
    try {
      await fetch(`/api/auth/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        activeVendorStore,
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
        showToast,
        toastMessage,
        switchRole,
        logout,
        markNotificationRead,
        availableAccounts,
        customerActiveContractsCount,
        vendorPendingApplicationsCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
