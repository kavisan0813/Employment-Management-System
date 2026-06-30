import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  Megaphone, Plus, Calendar, Eye, Send, X, Mail, MessageCircle, AlertTriangle, CheckCircle2,
  XCircle, Copy, Clock, MonitorSmartphone, TestTube
} from 'lucide-react';
import { communicationService } from '../services/communication.service';
import { 
  Announcement, TargetType, AnnouncementChannel, AnnouncementUrgency, RecurrenceType 
} from '../types/communication.types';
import { format } from 'date-fns';

export function BroadcastAnnouncementsTab({ showToast }: { showToast: (text: string, type: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, error, isLoading, mutate } = useSWR(
    ['announcements', page, statusFilter],
    () => communicationService.getAnnouncementHistory({ status: statusFilter, page, limit: 10 })
  );

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [smsWarningOpen, setSmsWarningOpen] = useState(false);
  const [cancelWarningOpen, setCancelWarningOpen] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState<TargetType>('all');
  const [targetCriteria, setTargetCriteria] = useState<string>(''); // e.g. "basic,enterprise"
  const [channels, setChannels] = useState<AnnouncementChannel[]>(['in_app']);
  const [urgency, setUrgency] = useState<AnnouncementUrgency>('normal');
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceType | null>(null);

  // Estimation state
  const [estimates, setEstimates] = useState<{orgCount: number, userCount: number, estimatedSmsCost: number} | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  
  // Pending created announcement for sending
  const [pendingAnnouncementId, setPendingAnnouncementId] = useState<string | null>(null);

  // Test send state
  const [testContact, setTestContact] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setTargetType('all');
    setTargetCriteria('');
    setChannels(['in_app']);
    setUrgency('normal');
    setScheduledAt(null);
    setRecurrence(null);
    setPendingAnnouncementId(null);
  };

  const handleChannelToggle = (ch: AnnouncementChannel) => {
    if (channels.includes(ch)) {
      setChannels(channels.filter(c => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  const proceedWithCreate = async () => {
    try {
      const ann = await communicationService.createAnnouncement(
        title, body, targetType, targetCriteria ? JSON.stringify(targetCriteria.split(',')) : '[]',
        channels, urgency, scheduledAt, recurrence
      );
      setPendingAnnouncementId(ann.announcement_id);
      setIsCreateOpen(false);
      setSmsWarningOpen(false);
      setIsPreviewOpen(true);
      mutate();
    } catch (err) {
      showToast('Failed to create draft', 'error');
    }
  };

  const handleCreateDraftAndPreview = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (title.trim() === '' || body.trim() === '') {
      showToast('Title and body are required', 'error');
      return;
    }
    if (channels.length === 0) {
      showToast('Select at least one channel', 'error');
      return;
    }
    if ((targetType === 'plan_based' || targetType === 'specific_orgs') && targetCriteria.trim() === '') {
      showToast('Please specify the target criteria', 'error');
      return;
    }
    if (targetType === 'all' && channels.includes('sms')) {
      setSmsWarningOpen(true);
      return;
    }

    await proceedWithCreate();
  };

  const handleProceedToConfirm = async () => {
    setIsPreviewOpen(false);
    setIsEstimating(true);
    setIsConfirmOpen(true);
    try {
      const est = await communicationService.getEstimatedRecipientCount(targetType, targetCriteria, channels);
      setEstimates(est);
    } catch (err) {
      showToast('Failed to get estimates', 'error');
      setIsConfirmOpen(false);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleFinalSend = async () => {
    if (!pendingAnnouncementId) return;
    try {
      await communicationService.sendAnnouncement(pendingAnnouncementId);
      showToast(scheduledAt ? 'Announcement scheduled successfully' : 'Announcement sent successfully', 'success');
      setIsConfirmOpen(false);
      resetForm();
      mutate();
    } catch (err) {
      showToast('Failed to send announcement', 'error');
    }
  };

  const handleCancelScheduled = async () => {
    if (!cancelWarningOpen) return;
    try {
      await communicationService.cancelScheduledAnnouncement(cancelWarningOpen);
      showToast('Announcement cancelled', 'info');
      setCancelWarningOpen(null);
      mutate();
    } catch (err) {
      showToast('Failed to cancel', 'error');
    }
  };

  const handleSendTest = async () => {
    if (!pendingAnnouncementId || !testContact.trim()) return;
    setIsSendingTest(true);
    try {
      await communicationService.sendTestAnnouncement(pendingAnnouncementId, testContact);
      showToast('Test announcement sent', 'success');
      setIsTestOpen(false);
    } catch (err) {
      showToast('Failed to send test', 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleDuplicate = (ann: Announcement) => {
    resetForm();
    setTitle(ann.title + ' (Copy)');
    setBody(ann.message_body);
    setTargetType(ann.target_type);
    try {
      const parsed = JSON.parse(ann.target_criteria);
      setTargetCriteria(Array.isArray(parsed) ? parsed.join(',') : '');
    } catch (e) {
      setTargetCriteria('');
    }
    setChannels(ann.channels);
    setUrgency(ann.urgency);
    setIsCreateOpen(true);
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case 'in_app': return <span title="In-App" className="inline-flex"><MonitorSmartphone className="w-4 h-4 text-indigo-600" /></span>;
      case 'email': return <span title="Email" className="inline-flex"><Mail className="w-4 h-4 text-blue-600" /></span>;
      case 'sms': return <span title="SMS" className="inline-flex"><MessageCircle className="w-4 h-4 text-emerald-600" /></span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': return <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">Sent</span>;
      case 'scheduled': return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">Scheduled</span>;
      case 'draft': return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">Draft</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Title & Target</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Channels</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Timing</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48 mb-2"></div><div className="h-3 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div></td>
                </tr>
              ))
            ) : error ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500 font-semibold">Failed to load history</td></tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900">No announcements found</p>
                </td>
              </tr>
            ) : (
              data?.data.map((ann: Announcement) => (
                <tr key={ann.announcement_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {ann.title}
                      {ann.urgency === 'high' && <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] px-1.5 rounded uppercase font-bold">Urgent</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">Target: {ann.target_type.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {ann.channels.map(ch => (
                        <span key={ch}>{getChannelIcon(ch)}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(ann.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {ann.status === 'sent' ? (
                      <div>Sent: {format(new Date(ann.sent_at!), 'MMM d, yyyy HH:mm')}</div>
                    ) : ann.status === 'scheduled' ? (
                      <div className="text-amber-700">Scheduled: {format(new Date(ann.scheduled_at!), 'MMM d, yyyy HH:mm')}</div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {ann.status === 'scheduled' && (
                      <button onClick={() => setCancelWarningOpen(ann.announcement_id)} className="text-red-600 hover:text-red-800 text-sm font-semibold flex items-center justify-end gap-1 w-full mb-2">
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                    {(ann.status === 'sent' || ann.status === 'cancelled') && (
                      <button onClick={() => handleDuplicate(ann)} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center justify-end gap-1 w-full">
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {data && data.total > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.total)} of {data.total}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50">Prev</button>
              <button disabled={page * 10 >= data.total} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" /> Create Announcement
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form id="announcement-form" onSubmit={handleCreateDraftAndPreview} className="overflow-y-auto flex-1 p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                <input required type="text" maxLength={100} value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Announcement Title" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message Body *</label>
                <textarea required rows={5} value={body} onChange={e => setBody(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm" placeholder="<p>HTML rich text content...</p>" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience *</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2"><input type="radio" checked={targetType === 'all'} onChange={() => setTargetType('all')} /> <span className="text-sm">All Organizations</span></label>
                    <label className="flex items-center gap-2"><input type="radio" checked={targetType === 'plan_based'} onChange={() => setTargetType('plan_based')} /> <span className="text-sm">By Plan</span></label>
                    <label className="flex items-center gap-2"><input type="radio" checked={targetType === 'specific_orgs'} onChange={() => setTargetType('specific_orgs')} /> <span className="text-sm">Specific Organizations</span></label>
                    <label className="flex items-center gap-2"><input type="radio" checked={targetType === 'role_based'} onChange={() => setTargetType('role_based')} /> <span className="text-sm">By Role</span></label>
                  </div>
                  {(targetType === 'plan_based' || targetType === 'specific_orgs' || targetType === 'role_based') && (
                    <input type="text" value={targetCriteria} onChange={e => setTargetCriteria(e.target.value)} placeholder={targetType === 'plan_based' ? 'e.g. enterprise,pro' : 'e.g. org_id_1,org_id_2'} className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Channels *</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={channels.includes('in_app')} onChange={() => handleChannelToggle('in_app')} /> 
                      <span className="text-sm flex items-center gap-1"><MonitorSmartphone className="w-4 h-4 text-gray-500" /> In-App Notification</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={channels.includes('email')} onChange={() => handleChannelToggle('email')} /> 
                      <span className="text-sm flex items-center gap-1"><Mail className="w-4 h-4 text-gray-500" /> Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={channels.includes('sms')} onChange={() => handleChannelToggle('sms')} /> 
                      <span className="text-sm flex items-center gap-1"><MessageCircle className="w-4 h-4 text-gray-500" /> SMS Text Message</span>
                    </label>
                    {channels.includes('sms') && (
                      <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 mt-1 flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" /> SMS will incur per-message costs.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency</label>
                  <select value={urgency} onChange={e => setUrgency(e.target.value as AnnouncementUrgency)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                    <option value="normal">Normal</option>
                    <option value="high">High (Red Alert)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule (Optional)</label>
                  <div className="flex gap-2">
                    <input type="datetime-local" value={scheduledAt || ''} onChange={e => setScheduledAt(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                  </div>
                </div>
              </div>

            </form>
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button form="announcement-form" type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2">
                <Eye className="w-4 h-4" /> Save Draft & Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" /> Preview Announcement
              </h2>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 border-b border-gray-200">HTML Preview (Email / In-App)</div>
                <div className="p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
              
              {channels.includes('sms') && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 border-b border-gray-200">SMS Preview (Text Only)</div>
                  <div className="p-4 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                    [{urgency === 'high' ? 'URGENT' : 'NOTICE'}] {title}{'\n\n'}(HTML tags stripped for SMS)
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-between rounded-b-xl">
              <button onClick={() => setIsTestOpen(true)} className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg flex items-center gap-2">
                <TestTube className="w-4 h-4" /> Send Test
              </button>
              <div className="flex gap-3">
                <button onClick={() => { setIsPreviewOpen(false); setIsCreateOpen(true); }} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg">Back to Edit</button>
                <button onClick={handleProceedToConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Proceed to Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col relative overflow-hidden">
            {isEstimating ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="font-semibold text-gray-700">Calculating audience size...</p>
              </div>
            ) : (
              <>
                <div className="bg-indigo-600 p-5 text-white flex items-center gap-3">
                  <Send className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-bold leading-tight">Confirm Broadcast</h2>
                    <p className="text-indigo-100 text-xs">Review audience scale before dispatching</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-gray-900">{estimates?.orgCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Organizations</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-gray-900">{estimates?.userCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Recipients</div>
                    </div>
                  </div>
                  
                  {channels.includes('sms') && estimates?.estimatedSmsCost !== undefined && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm">SMS Cost Warning</h4>
                        <p className="text-sm text-amber-800 mt-1">
                          Sending to {estimates.userCount.toLocaleString()} users via SMS will incur an estimated carrier cost of <strong>${estimates.estimatedSmsCost.toFixed(2)}</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {scheduledAt && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 items-center text-blue-800 text-sm">
                      <Clock className="w-5 h-5 shrink-0" /> Will be queued for delivery on {format(new Date(scheduledAt), 'MMM d, yyyy HH:mm')}.
                    </div>
                  )}
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
                  <button onClick={handleFinalSend} className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send to {estimates?.orgCount.toLocaleString()} Orgs
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TEST SEND MODAL */}
      {isTestOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">Send Test</h3>
            <p className="text-sm text-gray-600 mb-4">Enter an email or phone number to receive a test copy.</p>
            <input type="text" value={testContact} onChange={e => setTestContact(e.target.value)} placeholder="admin@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsTestOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">Cancel</button>
              <button onClick={handleSendTest} disabled={isSendingTest} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">
                {isSendingTest ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS WARNING MODAL */}
      {smsWarningOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden">
            <div className="bg-amber-500 p-5 text-white flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold">SMS Cost Warning</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                You are targeting <strong>All Organizations</strong> and have included <strong>SMS</strong> as a delivery channel.
                This could incur significant messaging costs.
              </p>
              <p className="text-sm font-bold text-gray-900 mt-4">Do you want to continue?</p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setSmsWarningOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={proceedWithCreate} className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md">
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL WARNING MODAL */}
      {cancelWarningOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden">
            <div className="bg-red-600 p-5 text-white flex items-center gap-3">
              <XCircle className="w-6 h-6" />
              <h2 className="text-lg font-bold">Cancel Announcement</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 font-medium">
                Are you sure you want to cancel this scheduled announcement? It will not be sent.
              </p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setCancelWarningOpen(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg">Keep Scheduled</button>
              <button onClick={handleCancelScheduled} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md">
                Cancel Announcement
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
