import React, { useState, useEffect } from 'react';
import { mentorApi } from '../api/client';
import { Calendar, Clock, CheckCircle, RefreshCw, UserCheck, MessageSquare } from 'lucide-react';

export const MentorPanel: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [feedback, setFeedback] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await mentorApi.getAllBookings();
      setBookings(data || []);
    } catch (err: any) {
      setError('Could not reach backend server (port 8080). Please ensure backend is running.');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      await mentorApi.updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      setFeedback(`Booking #${bookingId} marked as ${status}`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update booking on backend.';
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2C2421]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B234A] to-[#8B5E34] p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            Master Peddi Raju Garu • Mentor Schedule Hub
          </div>
          <h2 className="font-serif text-2xl font-bold">1-on-1 Guidance Calendar & Seeker Requests</h2>
          <p className="text-amber-100 text-xs">
            Review seeker submissions, requested consultation dates, and confirm direct Zoom/WhatsApp sessions.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Requests
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <span>⚠️ {error}</span>
        </div>
      )}

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {isLoading && (
        <div className="p-8 text-center text-xs text-stone-500">
          <RefreshCw className="w-5 h-5 motion-safe:animate-spin mx-auto mb-2 text-amber-700" />
          Loading mentorship requests from backend...
        </div>
      )}

      {!isLoading && bookings.length === 0 && !error && (
        <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
          No 1-on-1 mentorship bookings found in backend.
        </div>
      )}

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="glass-panel p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                    Booking #{booking.id}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#2C2421]">
                    {booking.seekerName || `Seeker (${booking.phone || '9999999999'})`}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">+91 {booking.phone}</p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                  booking.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                <div className="text-stone-700 font-medium flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Topic: {booking.category || 'Spiritual Energy Guidance'}</span>
                </div>

                <div className="text-stone-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Primary: {booking.primaryDate} • Secondary: {booking.secondaryDate}</span>
                </div>

                <div className="text-stone-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Time: {booking.preferredTimeSlot}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                className="flex-1 py-2 px-3 rounded-xl bg-[#3B234A] hover:bg-[#2C1838] text-white text-xs font-semibold shadow-sm transition hover:-translate-y-0.5"
              >
                Confirm Session
              </button>
              <button
                onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorPanel;
