import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { adminApi, mentorApi } from '../api/client';
import {
  Users,
  Shield,
  CheckCircle,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  CreditCard,
  Video,
  LogOut,
  ExternalLink,
  DollarSign,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Settings,
  History,
  AlertCircle,
  Check,
  X,
  Layers,
  Loader2
} from 'lucide-react';
import type { AppRole } from '../context/AppContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AdminPanelProps {
  onPreviewSite?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onPreviewSite }) => {
  const { user, logout } = useApp();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'books' | 'sessions' | 'recordings' | 'enrollments' | 'payments' | 'seekers' | 'bookings' | 'settings' | 'audit'
  >('overview');

  // Backend data state
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [enrollmentsList, setEnrollmentsList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [booksList, setBooksList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [recordingsList, setRecordingsList] = useState<any[]>([]);
  const [settingsList, setSettingsList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ROLE_SEEKER' | 'ROLE_ENROLLED' | 'ROLE_ADMIN' | 'ROLE_MASTER'>('ALL');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals for CRUD
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [selectedBookForEpisodes, setSelectedBookForEpisodes] = useState<any>(null);
  const [episodesList, setEpisodesList] = useState<any[]>([]);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any>(null);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);

  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Lock body scroll whenever an admin modal is active
  const isAnyAdminModalOpen = Boolean(
    isBookModalOpen || selectedBookForEpisodes || isEpisodeModalOpen || isSessionModalOpen || isRecordingModalOpen
  );
  useBodyScrollLock(isAnyAdminModalOpen);

  useEffect(() => {
    const handleAdminEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEpisodeModalOpen) {
          setIsEpisodeModalOpen(false);
          setEditingEpisode(null);
          setUploadFile(null);
        } else if (selectedBookForEpisodes) {
          setSelectedBookForEpisodes(null);
        } else if (isBookModalOpen) {
          setIsBookModalOpen(false);
          setEditingBook(null);
          setBookCoverFile(null);
        } else if (isSessionModalOpen) {
          setIsSessionModalOpen(false);
          setEditingSession(null);
        } else if (isRecordingModalOpen) {
          setIsRecordingModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleAdminEsc);
    return () => window.removeEventListener('keydown', handleAdminEsc);
  }, [isEpisodeModalOpen, selectedBookForEpisodes, isBookModalOpen, isSessionModalOpen, isRecordingModalOpen]);

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [
        statsData,
        usersData,
        enrollmentsData,
        paymentsData,
        bookingsData,
        booksData,
        sessionsData,
        recordingsData,
        settingsData,
        productsData,
        auditData
      ] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        adminApi.getEnrollments().catch(() => []),
        adminApi.getPayments().catch(() => []),
        mentorApi.getAllBookings().catch(() => []),
        adminApi.getBooks().catch(() => []),
        adminApi.getSessions().catch(() => []),
        adminApi.getRecordings().catch(() => []),
        adminApi.getSettings().catch(() => []),
        adminApi.getProducts().catch(() => []),
        adminApi.getAuditLogs().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      setUsersList(usersData || []);
      setEnrollmentsList(enrollmentsData || []);
      setPaymentsList(paymentsData || []);
      setBookingsList(bookingsData || []);
      setBooksList(booksData || []);
      setSessionsList(sessionsData || []);
      setRecordingsList(recordingsData || []);
      setSettingsList(settingsData || []);
      setProductsList(productsData || []);
      setAuditLogs(auditData || []);
    } catch {
      notifyError('Failed to load some admin data from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Role promotion
  const handleRoleChange = async (userId: number, newRole: AppRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      notify(`User role successfully changed to ${newRole}`);
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  // Booking status update
  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await mentorApi.updateBookingStatus(bookingId, status);
      setBookingsList(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      notify(`Booking #${bookingId} status updated to ${status}`);
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  // Book Save (Create / Update)
  const handleSaveBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let coverImage = (formData.get('coverImage') as string) || '';

    if (bookCoverFile) {
      setIsUploadingCover(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', bookCoverFile);
        uploadData.append('title', (formData.get('title') as string || 'Book') + ' Cover');
        uploadData.append('mediaType', 'IMAGE');
        const uploadedAsset: any = await adminApi.uploadMedia(uploadData);
        if (uploadedAsset?.storageKey) {
          coverImage = `/api/media/stream/${uploadedAsset.storageKey}`;
        }
      } catch {
        notifyError('Cover upload failed. Using provided URL if any.');
      } finally {
        setIsUploadingCover(false);
      }
    }

    const bookPayload: any = {
      title: formData.get('title'),
      teluguTitle: formData.get('teluguTitle'),
      author: formData.get('author'),
      slug: formData.get('slug') || String(formData.get('title')).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tag: formData.get('tag'),
      duration: formData.get('duration'),
      price: Number(formData.get('price')),
      coverImage: coverImage,
      problemStatement: formData.get('problemStatement'),
      synopsis: formData.get('synopsis'),
      summaryStory: formData.get('summaryStory'),
      masterQuote: formData.get('masterQuote'),
      isPublished: formData.get('isPublished') === 'on'
    };

    try {
      if (editingBook && editingBook.id) {
        await adminApi.updateBook(editingBook.id, bookPayload);
        notify(`Book "${bookPayload.title}" updated successfully.`);
      } else {
        await adminApi.createBook(bookPayload);
        notify(`Book "${bookPayload.title}" created successfully.`);
      }
      setIsBookModalOpen(false);
      setEditingBook(null);
      setBookCoverFile(null);
      const updated = await adminApi.getBooks();
      setBooksList(updated);
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Failed to save book.');
    }
  };

  // Book Delete
  const handleDeleteBook = async (bookId: number) => {
    if (!window.confirm('Are you sure you want to delete this sacred book and its episodes?')) return;
    try {
      await adminApi.deleteBook(bookId);
      setBooksList(prev => prev.filter(b => Number(b.id) !== Number(bookId)));
      notify('Book deleted successfully.');
    } catch (err: any) {
      notifyError(err.response?.data?.message || err.message || 'Could not delete book.');
    }
  };

  // Load episodes for a book
  const openEpisodesManager = async (book: any) => {
    setSelectedBookForEpisodes(book);
    try {
      const epData = await adminApi.getEpisodes(book.id);
      setEpisodesList(epData || []);
    } catch {
      setEpisodesList([]);
    }
  };

  // Episode Save (Create / Update)
  const handleSaveEpisode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBookForEpisodes) return;
    const formData = new FormData(e.currentTarget);

    const mediaType = (formData.get('mediaType') as string) || 'AUDIO';
    let audioUrl = formData.get('audioUrl') as string;
    let videoUrl = formData.get('videoUrl') as string;

    // Handle file upload if attached
    if (uploadFile) {
      setIsUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', uploadFile);
        uploadData.append('title', formData.get('title') as string);
        uploadData.append('mediaType', mediaType);
        const uploadedAsset: any = await adminApi.uploadMedia(uploadData);
        if (uploadedAsset?.storageKey) {
          const streamUrl = `/api/media/stream/${uploadedAsset.storageKey}`;
          if (mediaType === 'VIDEO') {
            videoUrl = streamUrl;
          } else {
            audioUrl = streamUrl;
          }
        }
      } catch {
        notifyError('Media file upload failed. Proceeding with URL if specified.');
      } finally {
        setIsUploading(false);
      }
    }

    const isVideo = mediaType === 'VIDEO';
    const episodePayload: any = {
      episodeNumber: Number(formData.get('episodeNumber') || 1),
      title: formData.get('title'),
      duration: formData.get('duration') || '45 mins',
      mediaType: mediaType,
      audioUrl: isVideo ? '' : (audioUrl || ''),
      videoUrl: isVideo ? (videoUrl || audioUrl || '') : '',
      isFree: formData.get('isFree') === 'on',
      description: formData.get('description'),
      sortOrder: Number(formData.get('sortOrder') || 1)
    };

    try {
      if (editingEpisode && editingEpisode.id) {
        await adminApi.updateEpisode(editingEpisode.id, episodePayload);
        notify('Episode updated successfully.');
      } else {
        await adminApi.createEpisode(selectedBookForEpisodes.id, episodePayload);
        notify('Episode added successfully.');
      }
      setIsEpisodeModalOpen(false);
      setEditingEpisode(null);
      setUploadFile(null);
      const updated = await adminApi.getEpisodes(selectedBookForEpisodes.id);
      setEpisodesList(updated);
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Failed to save episode.');
    }
  };

  // Delete Episode
  const handleDeleteEpisode = async (episodeId: number) => {
    if (!window.confirm('Are you sure you want to delete this episode?')) return;
    try {
      await adminApi.deleteEpisode(episodeId);
      setEpisodesList(prev => prev.filter(e => e.id !== episodeId));
      notify('Episode deleted successfully.');
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Could not delete episode.');
    }
  };

  // Session Save
  const handleSaveSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sessionPayload: any = {
      title: formData.get('title'),
      slug: formData.get('slug') || String(formData.get('title')).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formData.get('description'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      priceLive: Number(formData.get('priceLive')),
      priceRecordings: Number(formData.get('priceRecordings')),
      priceExtension: Number(formData.get('priceExtension')),
      whatsappCommunityUrl: formData.get('whatsappCommunityUrl'),
      active: formData.get('active') === 'on'
    };

    try {
      if (editingSession && editingSession.id) {
        await adminApi.updateSession(editingSession.id, sessionPayload);
        notify('Session updated successfully.');
      } else {
        await adminApi.createSession(sessionPayload);
        notify('Session created successfully.');
      }
      setIsSessionModalOpen(false);
      setEditingSession(null);
      const updated = await adminApi.getSessions();
      setSessionsList(updated);
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Failed to save session.');
    }
  };

  // Recording Add
  const handleSaveRecording = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: any = {
      sessionId: Number(formData.get('sessionId') || 1),
      dayNumber: Number(formData.get('dayNumber') || 1),
      title: formData.get('title'),
      description: formData.get('description'),
      duration: formData.get('duration') || '50 mins',
      bunnyVideoId: formData.get('bunnyVideoId') || 'stream_' + Date.now()
    };

    try {
      await adminApi.createRecording(payload);
      notify('Recording added successfully.');
      setIsRecordingModalOpen(false);
      const updated = await adminApi.getRecordings();
      setRecordingsList(updated);
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Failed to add recording.');
    }
  };

  // Recording Delete
  const handleDeleteRecording = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) return;
    try {
      await adminApi.deleteRecording(id);
      setRecordingsList(prev => prev.filter(r => r.id !== id));
      notify('Recording removed successfully.');
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Could not delete recording.');
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

  return (
    <div className="min-h-screen bg-[#110D18] text-[#FAF7F0] font-sans antialiased selection:bg-[#D1A559] selection:text-black">

      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-[#1A1424]/95 backdrop-blur-md border-b border-purple-900/40 shadow-xl px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B234A] to-[#8B5E34] flex items-center justify-center text-white shadow-md border border-[#D1A559]/30">
              <Shield className="w-5 h-5 text-[#D1A559]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-[0.18em] text-white">TRIPURA</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                  Admin Master Control
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono">Platform Content & Business Operations CMS</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={loadAllAdminData}
              className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Refresh Admin Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={loadAllAdminData}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-stone-700 text-xs font-semibold text-stone-300 transition cursor-pointer min-h-[44px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          {onPreviewSite && (
            <button
              type="button"
              onClick={onPreviewSite}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D1A559]/10 hover:bg-[#D1A559]/20 border border-[#D1A559]/40 text-[#D1A559] text-xs font-semibold transition cursor-pointer min-h-[44px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Seeker Site</span>
            </button>
          )}

          <div className="px-3.5 py-2 rounded-full bg-purple-950/80 border border-purple-800/60 flex items-center gap-2 text-xs min-h-[44px]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">{user.name}</span>
            <span className="text-[10px] font-mono text-purple-300 hidden sm:inline">({user.email || 'admin'})</span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-rose-950/70 border border-stone-700 hover:border-rose-500/50 text-stone-300 hover:text-rose-300 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Log Out Admin"
            aria-label="Log Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Notifications */}
      {feedbackMsg && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-6 py-3 text-xs text-center flex items-center justify-center gap-2 animate-fadeIn font-medium">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-950/90 border-b border-rose-500/40 text-rose-200 px-6 py-3 text-xs text-center flex items-center justify-center gap-2 animate-fadeIn font-medium">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Top Navigation Tabs */}
      <div className="border-b border-purple-900/30 bg-[#161022] px-4 sm:px-8 overflow-x-auto">
        <div className="flex gap-1.5 py-2.5 min-w-max text-xs font-semibold" role="tablist" aria-label="Admin Workspace Tabs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'books', label: 'Book Library & CMS', icon: BookOpen },
            { id: 'sessions', label: 'Sessions & Batches', icon: Calendar },
            { id: 'recordings', label: 'Daily Recordings', icon: Video },
            { id: 'enrollments', label: 'Enrollments', icon: CheckCircle },
            { id: 'payments', label: 'Payments & Revenue', icon: CreditCard },
            { id: 'seekers', label: 'Seekers & RBAC', icon: Users },
            { id: 'bookings', label: '1-on-1 Bookings', icon: Clock },
            { id: 'settings', label: 'Business & Pricing', icon: Settings },
            { id: 'audit', label: 'Audit Trail', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`admin-tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer min-h-[44px] ${isActive
                    ? 'bg-[#3B234A] text-white shadow-md border border-purple-400/40'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/80 border border-transparent'
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace Tab Contents */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div id="admin-tabpanel-overview" role="tabpanel" aria-labelledby="admin-tab-overview" className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="heading-section text-2xl font-bold text-white">Platform Health & Live Statistics</h2>
              <p className="text-xs text-stone-400 mt-1">Database-backed operational telemetry and active entitlements.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Registered Seekers', value: stats?.totalUsers ?? usersList.length, color: 'text-blue-400', icon: Users },
                { label: 'Paid Enrolled Seekers', value: stats?.paidUsers ?? 0, color: 'text-emerald-400', icon: CheckCircle },
                { label: 'Active Live Enrollments', value: stats?.activeEnrollments ?? enrollmentsList.length, color: 'text-purple-300', icon: Layers },
                { label: 'Total Revenue (INR)', value: `₹${paymentsList.filter(p => p.status === 'PAID' || p.status === 'SUCCESS').reduce((sum, p) => sum + Number(p.amount || 0), 0)}`, color: 'text-[#D1A559]', icon: DollarSign },
                { label: 'Upcoming Live Sessions', value: stats?.upcomingSessions ?? sessionsList.length, color: 'text-indigo-400', icon: Calendar },
                { label: 'Active Library Recordings', value: stats?.activeRecordings ?? recordingsList.length, color: 'text-rose-400', icon: Video },
                { label: 'Published Sacred Books', value: booksList.length, color: 'text-teal-400', icon: BookOpen },
                { label: 'Pending 1-on-1 Requests', value: stats?.pendingBookingRequests ?? bookingsList.filter(b => b.status === 'PENDING').length, color: 'text-amber-400', icon: Clock }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="p-5 rounded-2xl bg-[#1D1628] border border-purple-900/30 space-y-2 hover:border-[#D1A559]/30 transition shadow-sm">
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="text-[11px] uppercase tracking-wider font-semibold">{m.label}</span>
                      <Icon className="w-4 h-4 opacity-70" />
                    </div>
                    <div className={`font-serif text-2xl sm:text-3xl font-bold ${m.color}`}>
                      {m.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Payments Preview */}
            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <div className="p-5 border-b border-purple-900/30 flex justify-between items-center bg-[#161022]">
                <h3 className="heading-card text-base font-bold text-white">Recent Payment Transactions</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('payments')}
                  className="text-xs text-[#D1A559] hover:text-[#e4be78] font-semibold cursor-pointer min-h-[44px] inline-flex items-center"
                >
                  View All Payments →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order / Txn ID</th>
                      <th className="p-4">Seeker</th>
                      <th className="p-4">Purpose</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/20">
                    {paymentsList.slice(0, 5).map((p, idx) => (
                      <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                        <td className="p-4 font-mono text-stone-400">{p.razorpayOrderId}</td>
                        <td className="p-4 font-medium text-white">{p.user?.name || 'Seeker'}</td>
                        <td className="p-4 text-stone-300">{p.purpose}</td>
                        <td className="p-4 font-bold text-[#D1A559]">₹{p.amount}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'PAID' || p.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {paymentsList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-stone-500 italic">No payment transactions recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKS & MEDIA CMS */}
        {activeTab === 'books' && (
          <div id="admin-tabpanel-books" role="tabpanel" aria-labelledby="admin-tab-books" className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="heading-section text-2xl font-bold text-white">Spiritual Book Library CMS</h2>
                <p className="text-xs text-stone-400 mt-1">Manage sacred books, narrative problem statements, and audio episodes.</p>
              </div>
              <button
                type="button"
                onClick={() => { setEditingBook(null); setIsBookModalOpen(true); }}
                className="btn-spiritual px-5 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg border border-purple-400/30 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Book</span>
              </button>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {booksList.map((book) => (
                <div key={book.id} className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden flex flex-col justify-between shadow-md hover:border-[#D1A559]/40 transition">
                  <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300'}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-xl border border-purple-800/40 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                          {book.tag || 'Sacred Text'}
                        </span>
                        <h4 className="heading-card text-base font-bold text-white leading-tight">{book.title}</h4>
                        <p className="text-xs text-stone-400">{book.author}</p>
                        <p className="text-xs font-bold text-[#D1A559]">₹{book.price}</p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 italic leading-relaxed">
                      &ldquo;{book.problemStatement || book.synopsis}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 bg-[#161022] border-t border-purple-900/30 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openEpisodesManager(book)}
                      className="px-3.5 py-2 rounded-xl bg-[#D1A559]/10 hover:bg-[#D1A559]/20 text-[#D1A559] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Episodes ({book.episodes?.length || book.episodesCount || 0})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingBook(book); setIsBookModalOpen(true); }}
                        className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Edit Book Details"
                        aria-label={`Edit ${book.title}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Delete Book"
                        aria-label={`Delete ${book.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SESSIONS */}
        {activeTab === 'sessions' && (
          <div id="admin-tabpanel-sessions" role="tabpanel" aria-labelledby="admin-tab-sessions" className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="heading-section text-2xl font-bold text-white">Live Sessions & Batches</h2>
                <p className="text-xs text-stone-400 mt-1">Configure 11-day masterclasses, schedules, and WhatsApp community links.</p>
              </div>
              <button
                type="button"
                onClick={() => { setEditingSession(null); setIsSessionModalOpen(true); }}
                className="btn-spiritual px-5 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-purple-400/30 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Session</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessionsList.map(s => (
                <div key={s.id} className="p-6 rounded-3xl bg-[#1D1628] border border-purple-900/30 space-y-4 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="heading-card text-lg font-bold text-white">{s.title}</h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {s.startDate} to {s.endDate}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-stone-800 text-stone-400'
                      }`}>
                      {s.active ? 'Active Batch' : 'Archived'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">{s.description}</p>

                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#161022] border border-purple-900/20">
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Live Price</span>
                      <span className="font-bold text-[#D1A559] text-sm">₹{s.priceLive}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#161022] border border-purple-900/20">
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider">30-Day Ext</span>
                      <span className="font-bold text-[#D1A559] text-sm">₹{s.priceExtension}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#161022] border border-purple-900/20">
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Recordings</span>
                      <span className="font-bold text-[#D1A559] text-sm">₹{s.priceRecordings}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-purple-900/30 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-stone-400 truncate max-w-xs font-mono">
                      WA: {s.whatsappCommunityUrl || 'Default Link'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setEditingSession(s); setIsSessionModalOpen(true); }}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer min-h-[44px] flex items-center font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DAILY RECORDINGS */}
        {activeTab === 'recordings' && (
          <div id="admin-tabpanel-recordings" role="tabpanel" aria-labelledby="admin-tab-recordings" className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="heading-section text-2xl font-bold text-white">Daily Recordings Management</h2>
                <p className="text-xs text-stone-400 mt-1">Publish daily class streams with release and auto-expiration controls.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordingModalOpen(true)}
                className="btn-spiritual px-5 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-purple-400/30 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Recording</span>
              </button>
            </div>

            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px] border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Day</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Release Date</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {recordingsList.map(rec => (
                    <tr key={rec.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#D1A559]">Day {rec.dayNumber}</td>
                      <td className="p-4 font-medium text-white">{rec.title}</td>
                      <td className="p-4 text-stone-400 font-mono">{rec.duration || '50 mins'}</td>
                      <td className="p-4 text-stone-300">{rec.releaseAt ? String(rec.releaseAt).substring(0, 10) : 'Available'}</td>
                      <td className="p-4 text-stone-400">{rec.defaultExpiresAt ? String(rec.defaultExpiresAt).substring(0, 10) : '13th of Month'}</td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRecording(rec.id)}
                          className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                          title="Delete Recording"
                          aria-label={`Delete Day ${rec.dayNumber} Recording`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recordingsList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-500 italic">No recordings published yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ENROLLMENTS */}
        {activeTab === 'enrollments' && (
          <div id="admin-tabpanel-enrollments" role="tabpanel" aria-labelledby="admin-tab-enrollments" className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="heading-section text-2xl font-bold text-white">Active Student Enrollments</h2>
              <p className="text-xs text-stone-400 mt-1">Real-time database student enrollment directory.</p>
            </div>

            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px] border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Seeker Name</th>
                    <th className="p-4">Phone / Contact</th>
                    <th className="p-4">Enrolled Session</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Valid Until</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {enrollmentsList.map((e, idx) => (
                    <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-4 font-medium text-white">{e.user?.name || 'Seeker'}</td>
                      <td className="p-4 text-stone-400 font-mono">{e.user?.phone || e.user?.email || 'N/A'}</td>
                      <td className="p-4 text-stone-300">{e.session?.title || 'Tripura Masterclass'}</td>
                      <td className="p-4 font-mono text-[11px] text-purple-300">{e.type}</td>
                      <td className="p-4 font-bold text-[#D1A559]">₹{e.paidAmount}</td>
                      <td className="p-4 text-stone-400">{e.validUntil ? String(e.validUntil).substring(0, 10) : 'Active'}</td>
                    </tr>
                  ))}
                  {enrollmentsList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-500 italic">No student enrollments found in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENTS */}
        {activeTab === 'payments' && (
          <div id="admin-tabpanel-payments" role="tabpanel" aria-labelledby="admin-tab-payments" className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="heading-section text-2xl font-bold text-white">Payment Transactions & Audits</h2>
              <p className="text-xs text-stone-400 mt-1">All gateway orders, captures, webhooks, and amounts.</p>
            </div>

            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px] border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">Seeker</th>
                    <th className="p-4">Purpose</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {paymentsList.map((p, idx) => (
                    <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-4 text-stone-400 font-mono">{p.createdAt ? String(p.createdAt).substring(0, 10) : 'Recent'}</td>
                      <td className="p-4 font-mono text-stone-400">{p.razorpayOrderId}</td>
                      <td className="p-4 font-mono text-stone-400">{p.razorpayPaymentId || 'Pending'}</td>
                      <td className="p-4 font-medium text-white">{p.user?.name || 'Seeker'}</td>
                      <td className="p-4 text-stone-300">{p.purpose}</td>
                      <td className="p-4 font-bold text-[#D1A559]">₹{p.amount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'PAID' || p.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paymentsList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-stone-500 italic">No payment transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: SEEKERS & RBAC */}
        {activeTab === 'seekers' && (
          <div id="admin-tabpanel-seekers" role="tabpanel" aria-labelledby="admin-tab-seekers" className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="heading-section text-2xl font-bold text-white">Seeker Directory & Role Authorization</h2>
                <p className="text-xs text-stone-400 mt-1">Manage user access tiers: ROLE_SEEKER, ROLE_ENROLLED, ROLE_ADMIN, ROLE_MASTER.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#161022] rounded-xl border border-purple-900/40 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D1A559] min-h-[44px]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3.5 py-2.5 bg-[#161022] rounded-xl border border-purple-900/40 text-xs text-stone-300 focus:outline-none min-h-[44px] cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ROLE_SEEKER">Seeker</option>
                  <option value="ROLE_ENROLLED">Enrolled</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_MASTER">Master</option>
                </select>
              </div>
            </div>

            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px] border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">User ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-4 font-mono text-stone-400">#{u.id}</td>
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-stone-300 font-mono">{u.phone || u.email || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.role === 'ROLE_ADMIN' || u.role === 'ROLE_MASTER'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : u.role === 'ROLE_ENROLLED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-stone-400">{u.createdAt ? String(u.createdAt).substring(0, 10) : 'Recent'}</td>
                      <td className="p-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as AppRole)}
                          className="px-3 py-2 bg-[#161022] rounded-xl border border-purple-800/40 text-xs text-stone-200 focus:outline-none min-h-[44px] cursor-pointer"
                        >
                          <option value="ROLE_SEEKER">Seeker (Free)</option>
                          <option value="ROLE_ENROLLED">Enrolled (Student)</option>
                          <option value="ROLE_ADMIN">Admin (CMS Access)</option>
                          <option value="ROLE_MASTER">Master (Full Access)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-500 italic">No seekers found matching filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: 1-ON-1 BOOKINGS */}
        {activeTab === 'bookings' && (
          <div id="admin-tabpanel-bookings" role="tabpanel" aria-labelledby="admin-tab-bookings" className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="heading-section text-2xl font-bold text-white">1-on-1 Guidance Session Requests</h2>
              <p className="text-xs text-stone-400 mt-1">Review student booking appointments, dates 1-12 policy, and confirm slots.</p>
            </div>

            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px] border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Seeker</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Primary / Secondary Date</th>
                    <th className="p-4">Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {bookingsList.map(b => (
                    <tr key={b.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-4 font-mono text-stone-400">#{b.id}</td>
                      <td className="p-4 font-medium text-white">{b.user?.name || 'Seeker'}</td>
                      <td className="p-4 text-purple-300 font-medium">{b.category || 'Spiritual Inquiry'}</td>
                      <td className="p-4 text-stone-300 font-mono">
                        {b.primaryDate} {b.secondaryDate ? `(Alt: ${b.secondaryDate})` : ''}
                      </td>
                      <td className="p-4 text-stone-400 font-mono">{b.preferredTimeSlot || '6:30 AM'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            b.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              b.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {b.status !== 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                            className="px-3.5 py-2 rounded-xl bg-blue-700/80 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
                          >
                            Complete
                          </button>
                        )}
                        {b.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                            className="px-3.5 py-2 rounded-xl bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookingsList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-stone-500 italic">No 1-on-1 booking requests received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: BUSINESS & PRICING SETTINGS */}
        {activeTab === 'settings' && (
          <div id="admin-tabpanel-settings" role="tabpanel" aria-labelledby="admin-tab-settings" className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="heading-section text-2xl font-bold text-white">Dynamic Pricing & Settings Configuration</h2>
              <p className="text-xs text-stone-400 mt-1">Modify live session prices, WhatsApp group links, and orientation media without code changes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Pricing */}
              <div className="p-6 rounded-3xl bg-[#1D1628] border border-purple-900/30 space-y-4 shadow-md">
                <h3 className="heading-card text-lg font-bold text-white">Product Catalog & Prices</h3>
                <div className="space-y-3">
                  {productsList.map(prod => (
                    <div key={prod.id} className="p-4 rounded-2xl bg-[#161022] border border-purple-900/20 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block text-sm">{prod.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{prod.slug}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#D1A559] text-base">₹{prod.price}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const newPrice = prompt(`Enter new price for ${prod.name}:`, String(prod.price));
                            if (newPrice && !isNaN(Number(newPrice))) {
                              await adminApi.updateProduct(prod.id, { price: Number(newPrice) });
                              notify(`Updated price for ${prod.name} to ₹${newPrice}`);
                              const updated = await adminApi.getProducts();
                              setProductsList(updated);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white font-semibold cursor-pointer min-h-[44px] flex items-center"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  {productsList.length === 0 && (
                    <p className="text-xs text-stone-500 italic">No product prices found.</p>
                  )}
                </div>
              </div>

              {/* Business Settings */}
              <div className="p-6 rounded-3xl bg-[#1D1628] border border-purple-900/30 space-y-4 shadow-md">
                <h3 className="heading-card text-lg font-bold text-white">Business URLs & Integration</h3>
                <div className="space-y-3">
                  {settingsList.map(setting => (
                    <div key={setting.key} className="p-4 rounded-2xl bg-[#161022] border border-purple-900/20 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white uppercase tracking-wider text-[11px]">{setting.key}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const newVal = prompt(`Enter new value for ${setting.key}:`, setting.value);
                            if (newVal !== null) {
                              await adminApi.updateSetting(setting.key, newVal);
                              notify(`Updated ${setting.key}`);
                              const updated = await adminApi.getSettings();
                              setSettingsList(updated);
                            }
                          }}
                          className="text-[#D1A559] hover:text-[#e4be78] text-xs font-semibold cursor-pointer min-h-[44px] inline-flex items-center"
                        >
                          Change
                        </button>
                      </div>
                      <p className="text-stone-400 text-[11px] break-all font-mono">{setting.value}</p>
                    </div>
                  ))}
                  {settingsList.length === 0 && (
                    <p className="text-xs text-stone-500 italic">No business settings found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div id="admin-tabpanel-audit" role="tabpanel" aria-labelledby="admin-tab-audit" className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="heading-section text-2xl font-bold text-white">Administrative Audit Trail</h2>
              <p className="text-xs text-stone-400 mt-1">Immutable ledger of administrative actions, pricing edits, and role modifications.</p>
            </div>

            <div className="rounded-3xl bg-[#1D1628] border border-purple-900/30 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161022] text-stone-400 uppercase tracking-wider text-[10px] border-b border-purple-900/30">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Admin Email</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-4 text-stone-400 font-mono">{String(log.timestamp).replace('T', ' ').substring(0, 19)}</td>
                      <td className="p-4 font-medium text-white">{log.adminEmail}</td>
                      <td className="p-4 font-bold text-purple-300 font-mono">{log.action}</td>
                      <td className="p-4 text-stone-300">{log.entityName} #{log.entityId}</td>
                      <td className="p-4 text-stone-400">{log.details}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-stone-500 italic">No audit logs recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODAL 1: CREATE / EDIT SACRED BOOK                       */}
      {/* ======================================================== */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1628] text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-purple-900/40 shadow-2xl max-h-[90vh] overflow-y-auto animate-modal-scale-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-4 mb-5">
              <h3 className="heading-card text-lg font-bold text-white">
                {editingBook ? `Edit Sacred Book: ${editingBook.title}` : 'Create New Sacred Book'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsBookModalOpen(false); setEditingBook(null); }}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close book modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Title (English)</label>
                <input name="title" defaultValue={editingBook?.title} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Telugu Title</label>
                  <input name="teluguTitle" defaultValue={editingBook?.teluguTitle} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white font-telugu focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Author</label>
                  <input name="author" defaultValue={editingBook?.author || 'Sage Dattatreya'} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Tag</label>
                  <input name="tag" defaultValue={editingBook?.tag || 'Advaita Vedanta'} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Duration</label>
                  <input name="duration" defaultValue={editingBook?.duration || '4.5 Hours'} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Price (₹)</label>
                  <input name="price" type="number" defaultValue={editingBook?.price || 199} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Cover Image URL</label>
                <input name="coverImage" defaultValue={editingBook?.coverImage || ''} placeholder="https://... or upload below" className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white font-mono text-[11px] focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div className="p-4 rounded-2xl bg-[#161022] border border-purple-900/30 space-y-2">
                <span className="text-[10px] text-[#D1A559] font-bold uppercase tracking-wider block">Or Upload Book Cover Image:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBookCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3B234A] file:text-white cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Problem Statement Solved</label>
                <textarea name="problemStatement" rows={2} defaultValue={editingBook?.problemStatement} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559]" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Core Synopsis / Summary Story</label>
                <textarea name="synopsis" rows={3} defaultValue={editingBook?.synopsis || editingBook?.summaryStory} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559]" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Master&apos;s Direct Pointer Quote</label>
                <input name="masterQuote" defaultValue={editingBook?.masterQuote} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white italic focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input type="checkbox" id="isPublished" name="isPublished" defaultChecked={editingBook ? editingBook.isPublished : true} className="w-4 h-4 rounded border-purple-900 text-[#3B234A] focus:ring-[#D1A559]" />
                <label htmlFor="isPublished" className="text-stone-300 text-xs select-none cursor-pointer">Publish immediately to seekers in Book Library</label>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => { setIsBookModalOpen(false); setBookCoverFile(null); }}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingCover}
                  className="btn-spiritual px-6 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold flex items-center gap-2 border border-purple-400/30 cursor-pointer min-h-[44px]"
                >
                  {isUploadingCover && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isUploadingCover ? 'Uploading Cover...' : 'Save Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EPISODES MANAGER FOR SELECTED BOOK             */}
      {/* ======================================================== */}
      {selectedBookForEpisodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1628] text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-purple-900/40 shadow-2xl max-h-[90vh] flex flex-col justify-between animate-modal-scale-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-4 mb-4 shrink-0">
              <div>
                <span className="text-[10px] text-[#D1A559] font-bold uppercase tracking-wider">Book Episodes CMS</span>
                <h3 className="heading-card text-lg font-bold text-white">{selectedBookForEpisodes.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingEpisode(null); setIsEpisodeModalOpen(true); }}
                  className="btn-spiritual px-4 py-2 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold text-xs flex items-center gap-1.5 border border-purple-400/30 cursor-pointer min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Episode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookForEpisodes(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close episodes manager"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2">
              {episodesList.map((ep, idx) => (
                <div key={ep.id || idx} className="p-4 rounded-2xl bg-[#161022] border border-purple-900/30 flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center shrink-0 border border-purple-400/20">
                      {ep.episodeNumber || idx + 1}
                    </span>
                    <div className="truncate">
                      <h5 className="font-semibold text-white truncate text-sm">{ep.title}</h5>
                      <span className="text-[11px] text-stone-400 font-mono">{ep.duration} • {ep.mediaType || 'AUDIO'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${ep.isFree ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-stone-800 text-stone-400'}`}>
                      {ep.isFree ? 'Free Preview' : 'Locked'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setEditingEpisode(ep); setIsEpisodeModalOpen(true); }}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Edit Episode"
                      aria-label={`Edit episode ${ep.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Delete Episode"
                      aria-label={`Delete episode ${ep.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {episodesList.length === 0 && (
                <div className="py-12 text-center text-stone-500 text-xs italic">
                  No episodes created for this book yet. Click &quot;+ Add Episode&quot; above to upload or link media.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-purple-900/30 text-right shrink-0">
              <button
                type="button"
                onClick={() => setSelectedBookForEpisodes(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT EPISODE                             */}
      {/* ======================================================== */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1628] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-purple-900/40 shadow-2xl animate-modal-scale-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-3 mb-4">
              <h4 className="heading-card text-base font-bold text-white">
                {editingEpisode ? `Edit Episode: ${editingEpisode.title}` : 'Add New Episode'}
              </h4>
              <button
                type="button"
                onClick={() => { setIsEpisodeModalOpen(false); setEditingEpisode(null); }}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close episode modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Episode #</label>
                  <input name="episodeNumber" type="number" defaultValue={editingEpisode?.episodeNumber || episodesList.length + 1} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Duration</label>
                  <input name="duration" defaultValue={editingEpisode?.duration || '40 mins'} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Episode Title</label>
                <input name="title" defaultValue={editingEpisode?.title} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Media Type</label>
                  <select name="mediaType" defaultValue={editingEpisode?.mediaType || 'AUDIO'} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px] cursor-pointer">
                    <option value="AUDIO">Audio MP3 / Podcast</option>
                    <option value="VIDEO">Video MP4 / Stream</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Preview Policy</label>
                  <div className="pt-2.5 flex items-center gap-2">
                    <input type="checkbox" id="isFree" name="isFree" defaultChecked={editingEpisode?.isFree || false} className="w-4 h-4 rounded border-purple-900 text-[#3B234A] focus:ring-[#D1A559]" />
                    <label htmlFor="isFree" className="text-stone-300 text-xs select-none cursor-pointer">Free Episode</label>
                  </div>
                </div>
              </div>

              {/* Direct Audio/Video URL */}
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Stream / Media URL</label>
                <input name="audioUrl" defaultValue={editingEpisode?.audioUrl || editingEpisode?.videoUrl} placeholder="https://... or /api/media/stream/..." className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white font-mono text-[11px] focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>

              {/* Direct File Upload Option */}
              <div className="p-4 rounded-2xl bg-[#161022] border border-purple-900/30 space-y-2">
                <span className="text-[10px] text-[#D1A559] font-bold uppercase tracking-wider block">Or Upload Media File to Server:</span>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3B234A] file:text-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Description</label>
                <textarea name="description" rows={2} defaultValue={editingEpisode?.description} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559]" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-spiritual px-6 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold flex items-center gap-2 border border-purple-400/30 cursor-pointer min-h-[44px]"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isUploading ? 'Uploading...' : 'Save Episode'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CREATE / EDIT SESSION                           */}
      {/* ======================================================== */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1628] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-purple-900/40 shadow-2xl animate-modal-scale-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-3 mb-4">
              <h4 className="heading-card text-base font-bold text-white">
                {editingSession ? `Edit Session: ${editingSession.title}` : 'Create New Live Session'}
              </h4>
              <button
                type="button"
                onClick={() => { setIsSessionModalOpen(false); setEditingSession(null); }}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close session modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Session Title</label>
                <input name="title" defaultValue={editingSession?.title || 'Hanuman Kriya 11-Day Masterclass'} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Start Date</label>
                  <input name="startDate" type="date" defaultValue={editingSession?.startDate || '2026-10-01'} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">End Date</label>
                  <input name="endDate" type="date" defaultValue={editingSession?.endDate || '2026-10-11'} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Live Price (₹)</label>
                  <input name="priceLive" type="number" defaultValue={editingSession?.priceLive || 1111} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">30d Ext (₹)</label>
                  <input name="priceExtension" type="number" defaultValue={editingSession?.priceExtension || 555} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Recordings (₹)</label>
                  <input name="priceRecordings" type="number" defaultValue={editingSession?.priceRecordings || 1500} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">WhatsApp Community URL</label>
                <input name="whatsappCommunityUrl" defaultValue={editingSession?.whatsappCommunityUrl || 'https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026'} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white font-mono text-[11px] focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Description</label>
                <textarea name="description" rows={2} defaultValue={editingSession?.description} className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559]" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input type="checkbox" id="active" name="active" defaultChecked={editingSession ? editingSession.active : true} className="w-4 h-4 rounded border-purple-900 text-[#3B234A] focus:ring-[#D1A559]" />
                <label htmlFor="active" className="text-stone-300 text-xs select-none cursor-pointer">Set as Active Current Batch</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-spiritual px-6 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold border border-purple-400/30 cursor-pointer min-h-[44px]"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD RECORDING                                   */}
      {/* ======================================================== */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1628] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-purple-900/40 shadow-2xl animate-modal-scale-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-3 mb-4">
              <h4 className="heading-card text-base font-bold text-white">Add Daily Class Recording</h4>
              <button
                type="button"
                onClick={() => setIsRecordingModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close recording modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecording} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Session ID</label>
                  <input name="sessionId" type="number" defaultValue={1} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Day Number (1–11)</label>
                  <input name="dayNumber" type="number" defaultValue={1} required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Recording Title</label>
                <input name="title" defaultValue="Day 1: Establishing the Sacred Foundation" required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Duration</label>
                <input name="duration" defaultValue="55 mins" className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Bunny / Stream Video ID or URL</label>
                <input name="bunnyVideoId" defaultValue="stream_day1_live" required className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white font-mono text-[11px] focus:outline-none focus:border-[#D1A559] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">Description</label>
                <textarea name="description" rows={2} defaultValue="Foundational posture, pranayama, and awakening of sacred energy." className="w-full px-4 py-2.5 rounded-xl bg-[#161022] border border-purple-900/40 text-white focus:outline-none focus:border-[#D1A559]" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => setIsRecordingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-spiritual px-6 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#4E2E63] text-white font-bold border border-purple-400/30 cursor-pointer min-h-[44px]"
                >
                  Publish Recording
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
