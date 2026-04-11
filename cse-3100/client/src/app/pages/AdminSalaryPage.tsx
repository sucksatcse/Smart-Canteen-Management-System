import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { ArrowLeft, DollarSign, Clock, Users, Edit2, Save, X, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface StaffMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  hourlyRate: number;
  workingHours: number;
  totalSalary: number;
  joinedDate: string;
}

export const AdminSalaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ hourlyRate: number; workingHours: number }>({ hourlyRate: 0, workingHours: 0 });
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/staff');
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const startEdit = (emp: StaffMember) => {
    setEditingId(emp.id);
    setEditForm({ hourlyRate: emp.hourlyRate, workingHours: emp.workingHours });
  };

  const saveEdit = async (emp: StaffMember) => {
    setSaving(emp.id);
    try {
      await axiosInstance.put(`/api/admin/staff/${emp.id}`, {
        ...editForm,
        userId: emp.userId,
      });
      await fetchStaff();
      setEditingId(null);
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(null);
    }
  };

  const confirmDelete = (emp: StaffMember) => {
    setDeleteConfirm(emp);
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(deleteConfirm.userId);
    try {
      await axiosInstance.delete(`/api/admin/staff/${deleteConfirm.userId}`);
      setDeleteConfirm(null);
      await fetchStaff();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to delete staff member');
      setDeleteConfirm(null);
    } finally {
      setDeleting(null);
    }
  };

  const totalPayroll = employees.reduce((s, e) => s + e.totalSalary, 0);
  const totalHours = employees.reduce((s, e) => s + e.workingHours, 0);
  const avgRate = employees.length > 0 ? employees.reduce((s, e) => s + e.hourlyRate, 0) / employees.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Staff Member</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to permanently delete <strong>{deleteConfirm.name}</strong> ({deleteConfirm.email}) from the system?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={!!deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Salary Management</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <button onClick={fetchStaff} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between">
            {error} <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Payroll</p>
              <p className="text-3xl font-bold text-gray-900">৳{totalPayroll.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(0)}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Hourly Rate</p>
              <p className="text-3xl font-bold text-gray-900">৳{avgRate.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">{employees.length} employees</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Employee Salary Details</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No staff members found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Employee', 'Email', 'Role', 'Hourly Rate', 'Working Hours', 'Total Salary', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map(emp => (
                    <tr key={emp.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">{emp.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-gray-900">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === emp.id ? (
                          <input type="number" value={editForm.hourlyRate}
                            onChange={e => setEditForm({ ...editForm, hourlyRate: parseFloat(e.target.value) || 0 })}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500" />
                        ) : `৳${emp.hourlyRate.toFixed(2)}/hr`}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === emp.id ? (
                          <input type="number" value={editForm.workingHours}
                            onChange={e => setEditForm({ ...editForm, workingHours: parseFloat(e.target.value) || 0 })}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500" />
                        ) : `${emp.workingHours} hrs`}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ৳{emp.totalSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === emp.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(emp)} disabled={saving === emp.id}
                              className="p-1 text-green-600 hover:bg-green-50 rounded" title="Save">
                              {saving === emp.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-gray-600 hover:bg-gray-50 rounded" title="Cancel">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(emp)} className="p-1 text-orange-600 hover:bg-orange-50 rounded" title="Set Salary">
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => confirmDelete(emp)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Delete Staff">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
