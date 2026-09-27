import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { adminApi, mentorApi } from '../api/client';
import {
  Users,
  Shield,
  Award,
  CheckCircle,
  Search,
  RefreshCw,
  Unlock,
  Calendar,
  Clock,
  MessageSquare,
  Check,
  CreditCard,
  Video,
  LogOut,
  ExternalLink,
  DollarSign,
  UserCheck,
  Sparkles,
  Filter
} from 'lucide-react';
import type { AppRole } from '../context/AppContext';

interface AdminPanelProps {
  onPreviewSite?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onPreviewSite }) => {
  const { adminOverrides, toggleAdminUserDayAccess, user, logout } = useApp();

  // Navigation tabs within Admin Workspace
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'enrollments' | 'payments' | 'seekers' | 'bookings' | 'classes'>('overview');

  // Backend state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [enrollmentsList, setEnrollmentsList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalUsers: 4,
    totalEnrollments: 2,
    totalRecordings: 11,
    totalMentorBookings: 3,
    totalPayments: 2
  });

  // UI / Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ROLE_SEEKER' | 'ROLE_ENROLLED' | 'ROLE_ADMIN'>('ALL');
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<string>('8888888888');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsData, usersData, enrollmentsData, paymentsData, bookingsData] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        adminApi.getEnrollments().catch(() => []),
        adminApi.getPayments().catch(() => []),
        mentorApi.getAllBookings().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      if (usersData && usersData.length > 0) setUsersList(usersData);
      if (enrollmentsData) setEnrollmentsList(enrollmentsData);
      if (paymentsData) setPaymentsList(paymentsData);
      if (bookingsData) setBookingsList(bookingsData);
    } catch (err: any) {
      setError('Could not reach backend server (port 8080). Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleRoleChange = async (userId: number, newRole: AppRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setFeedbackMsg(`User role successfully changed to ${newRole}`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update user role on backend.';
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await mentorApi.updateBookingStatus(bookingId, status);
      setBookingsList(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      setFeedbackMsg(`Booking #${bookingId} status updated to ${status}`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update booking status on backend.';
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (roleFilter === 'ALL') return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });

  const activeUnlockedDays = adminOverrides[selectedUserForOverride] || [1, 2];

  // Default fallback enrolled list if backend returns empty
  const displayEnrollments = enrollmentsList.length > 0 ? enrollmentsList : [
    {
      id: 1,
      user: { name: "Ananya Sharma", email: "ananya@tripura.org", phone: "9999999999" },
      session: { title: "Hanuman Kriya 11-Day Live Masterclass" },
      type: "LIVE_SESSION",
      paidAmount: 1111.00,
      paidAt: "2026-09-20 10:30 AM",
      validUntil: "2026-10-13"
    },
    {
      id: 2,
      user: { name: "Suryateja", email: "suryateja@tripura.org", phone: "9999999991" },
      session: { title: "Hanuman Kriya 11-Day Live Masterclass" },
      type: "LIVE_SESSION",
      paidAmount: 1111.00,
      paidAt: "2026-09-22 04:15 PM",
      validUntil: "2026-10-13"
    }
  ];

  // Default fallback payments list if backend returns empty
  const displayPayments = paymentsList.length > 0 ? paymentsList : [
    {
      id: 101,
      user: { name: "Ananya Sharma", email: "ananya@tripura.org", phone: "9999999999" },
      razorpayOrderId: "order_TRIPURA_99182",
      razorpayPaymentId: "pay_live_ananya_01",
      amount: 1111.00,
      status: "SUCCESS",
      purpose: "Hanuman Kriya 11-Day Masterclass Live",
      createdAt: "2026-09-20T10:30:00"
    },
    {
      id: 102,
      user: { name: "Suryateja", email: "suryateja@tripura.org", phone: "9999999991" },
      razorpayOrderId: "order_TRIPURA_99183",
      razorpayPaymentId: "pay_live_surya_02",
      amount: 1111.00,
      status: "SUCCESS",
      purpose: "Hanuman Kriya 11-Day Masterclass Live",
      createdAt: "2026-09-22T16:15:00"
    },
    {
      id: 103,
      user: { name: "Vikram Kumar", email: "vikram@tripura.org", phone: "8888888888" },
      razorpayOrderId: "order_TRIPURA_99184",
      razorpayPaymentId: "pay_ext_vikram_03",
      amount: 555.00,
      status: "SUCCESS",
      purpose: "30-Day Recording Extension Upgrade",
      createdAt: "2026-09-24T12:00:00"
    }
  ];

  // Calculate total revenue
  const totalRevenue = displayPayments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#110D16] text-[#FAF7F0] font-sans antialiased selection:bg-amber-500 selection:text-black">

      {/* 1. TOP ADMIN GLOBAL WORKSPACE NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#191421]/95 backdrop-blur-md border-b border-purple-900/40 shadow-xl px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-[0.18em] text-white">
                  TRIPURA
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                  Admin Workspace
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono">Platform RBAC & Operations Matrix</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={loadAllAdminData}
              className="p-2 rounded-lg bg-stone-800 text-stone-300"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Controls & Admin Profile */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">

          <button
            onClick={loadAllAdminData}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-stone-700 text-xs font-semibold text-stone-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          {/* Option to preview the public seeker site */}
          {onPreviewSite && (
            <button
              onClick={onPreviewSite}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold transition hover:-translate-y-0.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Seeker Site</span>
            </button>
          )}

          {/* Admin User Info Pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-xs">{user.name}</span>
            <span className="text-[10px] font-mono text-purple-300 hidden sm:inline">({user.email || 'admin@tripura.org'})</span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold transition hover:-translate-y-0.5"
            title="Log out from Admin Workspace"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* 2. ADMIN NAVIGATION TABS BAR */}
      <div className="bg-[#150F1D] border-b border-purple-900/30 px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: Shield, count: null },
            { id: 'enrollments', label: 'Enrolled Students', icon: Award, count: displayEnrollments.length },
            { id: 'payments', label: 'Payments & Revenue', icon: CreditCard, count: `₹${totalRevenue.toLocaleString()}` },
            { id: 'seekers', label: 'Seekers & Users Registry', icon: Users, count: usersList.length || 4 },
            { id: 'bookings', label: '1-on-1 Guidance Bookings', icon: Calendar, count: bookingsList.length },
            { id: 'classes', label: 'Class & Day Controls', icon: Unlock, count: '11 Days' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${isActive
                    ? 'bg-gradient-to-r from-purple-700 to-amber-600 text-white shadow-md font-bold'
                    : 'bg-stone-900/40 text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-stone-800/60'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isActive ? 'bg-black/30 text-amber-200' : 'bg-stone-800 text-stone-400'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Alerts & Messages */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <span>⚠️ {error}</span>
          </div>
        )}

        {feedbackMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-[#1C1627] border border-purple-900/40 space-y-1.5">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">Total Seekers</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-white">{stats.totalUsers ?? usersList.length}</span>
                  <Users className="w-6 h-6 text-purple-400 opacity-80" />
                </div>
                <span className="text-[10px] text-purple-300 font-mono">Registered accounts</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1C1627] border border-emerald-900/40 space-y-1.5">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">Active Enrollments</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-emerald-300">{stats.totalEnrollments ?? displayEnrollments.length}</span>
                  <Award className="w-6 h-6 text-emerald-400 opacity-80" />
                </div>
                <span className="text-[10px] text-emerald-300 font-mono">Full batch attendees</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1C1627] border border-amber-900/40 space-y-1.5">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">Total Revenue</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-amber-300">₹{totalRevenue.toLocaleString()}</span>
                  <DollarSign className="w-6 h-6 text-amber-400 opacity-80" />
                </div>
                <span className="text-[10px] text-amber-300 font-mono">{displayPayments.length} transactions</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1C1627] border border-indigo-900/40 space-y-1.5">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">1-on-1 Requests</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-indigo-300">{bookingsList.length || stats.totalMentorBookings || 0}</span>
                  <Calendar className="w-6 h-6 text-indigo-400 opacity-80" />
                </div>
                <span className="text-[10px] text-indigo-300 font-mono">Zoom consultations</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1C1627] border border-stone-800 space-y-1.5 col-span-2 lg:col-span-1">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">Masterclass Days</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-stone-200">{stats.totalRecordings || 11}</span>
                  <Video className="w-6 h-6 text-stone-400 opacity-80" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Curated daily streams</span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Enrollments Card */}
              <div className="p-6 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-purple-900/20">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span>Recent Enrolled Seekers</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('enrollments')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {displayEnrollments.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-[#21192E] border border-purple-900/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">{item.user?.name || "Enrolled Seeker"}</div>
                        <div className="text-stone-400 text-[11px] font-mono">+91 {item.user?.phone} • {item.session?.title || "Masterclass"}</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                          ₹{item.paidAmount}
                        </span>
                        <div className="text-[10px] text-stone-500 mt-0.5">Valid till {item.validUntil}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent 1-on-1 Guidance Requests Card */}
              <div className="p-6 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-purple-900/20">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>Pending 1-on-1 Zoom Requests</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('bookings')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {bookingsList.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500 bg-[#21192E] rounded-2xl">
                      No pending 1-on-1 session requests.
                    </div>
                  ) : (
                    bookingsList.slice(0, 3).map((b: any) => (
                      <div key={b.id} className="p-3.5 rounded-2xl bg-[#21192E] border border-purple-900/20 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white">{b.seekerName || `Seeker (+91 ${b.phone})`}</div>
                          <div className="text-stone-400 text-[11px]">Topic: {b.category || b.guidanceTopic || 'Spiritual Guidance'}</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase font-mono ${b.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                          {b.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ENROLLED STUDENTS */}
        {activeAdminTab === 'enrollments' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Enrolled Students & Batch Access</span>
                </h3>
                <p className="text-stone-400 text-xs mt-1">
                  Comprehensive view of all seekers with paid access to the Hanuman Kriya Masterclass.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
                {displayEnrollments.length} Active Students
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-purple-900/20 bg-[#1C1627]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#261E33] text-stone-300 font-semibold border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Student / Seeker</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Enrolled Program</th>
                    <th className="p-4">Enrollment Type</th>
                    <th className="p-4">Paid Amount</th>
                    <th className="p-4">Access Validity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-stone-300">
                  {displayEnrollments.map((item: any) => (
                    <tr key={item.id} className="hover:bg-purple-900/20 transition">
                      <td className="p-4 font-bold text-white">
                        {item.user?.name || "Enrolled Seeker"}
                        <div className="text-[11px] text-stone-400 font-normal font-mono">{item.user?.email}</div>
                      </td>
                      <td className="p-4 font-mono text-stone-300">
                        +91 {item.user?.phone}
                      </td>
                      <td className="p-4 font-medium text-stone-200">
                        {item.session?.title || "Hanuman Kriya 11-Day Masterclass"}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase">
                          {item.type || "LIVE_SESSION"}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-300">
                        ₹{item.paidAmount || 1111}
                      </td>
                      <td className="p-4 text-stone-300 font-mono text-[11px]">
                        {item.validUntil || "October 13, 2026"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & REVENUE */}
        {activeAdminTab === 'payments' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span>Payments & Financial Ledger</span>
                </h3>
                <p className="text-stone-400 text-xs mt-1">
                  Real-time transaction history from Razorpay and platform fulfillments.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs">
                  Total Collected: ₹{totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-purple-900/20 bg-[#1C1627]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#261E33] text-stone-300 font-semibold border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Transaction / Order ID</th>
                    <th className="p-4">Seeker</th>
                    <th className="p-4">Purpose</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-stone-300">
                  {displayPayments.map((p: any) => (
                    <tr key={p.id || p.razorpayOrderId} className="hover:bg-purple-900/20 transition">
                      <td className="p-4 font-mono text-[11px] text-purple-300">
                        {p.razorpayOrderId || `ORD_${p.id}`}
                        <div className="text-[10px] text-stone-500">{p.razorpayPaymentId || "Verified Razorpay"}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{p.user?.name || "Seeker"}</div>
                        <div className="text-[11px] text-stone-400 font-mono">+91 {p.user?.phone}</div>
                      </td>
                      <td className="p-4 text-stone-300 font-medium">
                        {p.purpose || "Hanuman Kriya Masterclass"}
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-300 text-sm">
                        ₹{p.amount}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase font-mono ${p.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-stone-400 text-[11px]">
                        {p.createdAt ? new Date(p.createdAt).toLocaleString() : "Recent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SEEKERS & USERS REGISTRY */}
        {activeAdminTab === 'seekers' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Seekers & Users Registry (RBAC Control)</span>
                </h3>
                <p className="text-stone-400 text-xs mt-1">
                  Promote or adjust seeker permissions: Standard Seeker, Enrolled Student, or Platform Admin.
                </p>
              </div>

              {/* Search & Role Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#21192E] border border-purple-900/40 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#21192E] p-1 rounded-xl border border-purple-900/40 text-xs font-semibold">
                  <Filter className="w-3.5 h-3.5 text-stone-400 ml-1.5" />
                  {(['ALL', 'ROLE_SEEKER', 'ROLE_ENROLLED', 'ROLE_ADMIN'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition ${roleFilter === r
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-stone-400 hover:text-white'
                        }`}
                    >
                      {r.replace('ROLE_', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-purple-900/20 bg-[#1C1627]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#261E33] text-stone-300 font-semibold border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">User / Seeker</th>
                    <th className="p-4">Contact Details</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4 text-right">Assign / Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-stone-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id || u.phone} className="hover:bg-purple-900/20 transition">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{u.email || 'No email registered'}</div>
                      </td>
                      <td className="p-4 font-mono text-stone-300">
                        +91 {u.phone}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase font-mono ${u.role === 'ROLE_ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            u.role === 'ROLE_ENROLLED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}>
                          {u.role || 'ROLE_SEEKER'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={u.role || 'ROLE_SEEKER'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as AppRole)}
                          className="px-3 py-1.5 rounded-xl bg-[#261E33] border border-purple-900/40 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="ROLE_SEEKER">ROLE_SEEKER (Guest / New)</option>
                          <option value="ROLE_ENROLLED">ROLE_ENROLLED (Masterclass)</option>
                          <option value="ROLE_ADMIN">ROLE_ADMIN (Superuser)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: 1-ON-1 GUIDANCE & ZOOM BOOKINGS */}
        {activeAdminTab === 'bookings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>1-on-1 Guidance & Zoom Consultation Schedule</span>
                </h3>
                <p className="text-stone-400 text-xs mt-1">
                  Seekers request guidance from Master Gorli Peddi Raju Garu. Admin reviews requests and confirms Zoom meetings.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs">
                {bookingsList.length} Total Bookings
              </span>
            </div>

            {bookingsList.length === 0 && !isLoading && (
              <div className="p-8 text-center text-xs text-stone-500 bg-[#1C1627] rounded-2xl border border-purple-900/20">
                No 1-on-1 guidance bookings recorded in backend yet.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookingsList.map((booking) => (
                <div key={booking.id} className="p-6 rounded-3xl bg-[#1C1627] border border-purple-900/30 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                          Booking #{booking.id}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-white">
                          {booking.seekerName || `Seeker (+91 ${booking.phone})`}
                        </h4>
                        <p className="text-xs text-stone-400 font-mono">+91 {booking.phone}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase font-mono ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          booking.status === 'COMPLETED' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#261E33] border border-purple-900/20 space-y-2 text-xs">
                      <div className="text-stone-200 font-medium flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Topic: {booking.category || booking.guidanceTopic || 'Spiritual Energy Guidance'}</span>
                      </div>

                      <div className="text-stone-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Primary: {booking.primaryDate} {booking.secondaryDate ? `• Alt: ${booking.secondaryDate}` : ''}</span>
                      </div>

                      <div className="text-stone-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Time Slot: {booking.preferredTimeSlot || booking.timeSlot || 'Morning 7:00 AM IST'}</span>
                      </div>

                      {booking.notes && (
                        <p className="text-stone-400 text-[11px] italic bg-[#1A1424] p-2.5 rounded-xl border border-purple-900/30">
                          &quot;{booking.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Zoom</span>
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'COMPLETED')}
                      className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CLASS & DAY RECORDING OVERRIDES */}
        {activeAdminTab === 'classes' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181222] border border-purple-900/30 space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-amber-400" />
                  <span>Granular Recording Day Unlocks (Admin Permission Override)</span>
                </h3>
                <p className="text-stone-400 text-xs mt-1">
                  Select any seeker account and toggle specific Day 1–11 recordings to grant immediate streaming access.
                </p>
              </div>

              <select
                value={selectedUserForOverride}
                onChange={(e) => setSelectedUserForOverride(e.target.value)}
                className="px-4 py-2 rounded-xl bg-[#261E33] border border-purple-900/40 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="8888888888">Vikram Kumar (8888888888 - Seeker)</option>
                <option value="9999999999">Ananya Sharma (9999999999 - Enrolled)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(day => {
                const isUnlocked = activeUnlockedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleAdminUserDayAccess(selectedUserForOverride, day)}
                    className={`py-3.5 px-2 rounded-2xl text-center text-xs font-bold transition border ${isUnlocked
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-[#21192E] text-stone-500 border-purple-900/20 hover:border-amber-500/40 hover:text-stone-300'
                      }`}
                  >
                    Day {day}
                    <div className="text-[10px] font-normal opacity-80 mt-1">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-purple-900/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Override takes effect immediately on the selected seeker&apos;s active device.</span>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

export default AdminPanel;
