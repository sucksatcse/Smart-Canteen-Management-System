import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, Save, X, RefreshCw, Upload } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock_quantity: number;
  in_stock: boolean;
  image_url: string | null;
}

const CATEGORIES = ['main', 'snack', 'drinks', 'dessert'];

const defaultForm = {
  name: '',
  price: 0,
  category: 'main',
  image_url: '',
  stockQuantity: 50,
};

type FormState = typeof defaultForm;

export const MenuManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(defaultForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/menu');
      // API now returns all items (including out-of-stock) with stock_quantity
      setItems(res.data ?? []);
    } catch {
      setError('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      price: item.price,
      category: item.category,
      image_url: item.image_url ?? '',
      stockQuantity: item.stock_quantity,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await axiosInstance.put(`/api/admin/menu/${editingId}`, {
        name: editForm.name,
        price: editForm.price,
        category: editForm.category,
        image_url: editForm.image_url || null,
        stockQuantity: editForm.stockQuantity,
      });
      await fetchMenu();
      setEditingId(null);
      showSuccess('Item updated successfully!');
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will mark it as unavailable.`)) return;
    try {
      await axiosInstance.delete(`/api/admin/menu/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
      showSuccess('Item removed from menu.');
    } catch {
      setError('Failed to delete item');
    }
  };

  const handleAdd = async () => {
    if (!addForm.name.trim() || addForm.price <= 0) {
      setError('Name and a valid price are required');
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.post('/api/admin/menu', {
        name: addForm.name,
        price: addForm.price,
        category: addForm.category,
        image_url: addForm.image_url || null,
        stockQuantity: addForm.stockQuantity,
      });
      await fetchMenu();
      setShowAddForm(false);
      setAddForm(defaultForm);
      showSuccess('New item added to menu!');
    } catch {
      setError('Failed to add item');
    } finally {
      setSaving(false);
    }
  };

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockColor = (qty: number) =>
    qty === 0 ? 'text-red-600' : qty < 10 ? 'text-orange-500' : 'text-green-600';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Menu Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchMenu} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setShowAddForm(true); setEditingId(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
            >
              <Plus className="w-5 h-5" /> Add New Item
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-redred-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)}><X className="w-4 h-4 text-red-500" /></button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            ✓ {success}
          </div>
        )}

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-orange-200">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Add New Menu Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input type="text" value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Chicken Biryani" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price (৳) *</label>
                <input type="number" value={addForm.price} min="0" step="0.01"
                  onChange={e => setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select value={addForm.category}
                  onChange={e => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none capitalize">
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Initial Stock Qty</label>
                <input type="number" value={addForm.stockQuantity} min="0"
                  onChange={e => setAddForm({ ...addForm, stockQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" value={addForm.image_url}
                  onChange={e => setAddForm({ ...addForm, image_url: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            {/* Image preview */}
            {addForm.image_url && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={addForm.image_url} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={handleAdd} disabled={saving}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-60">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Item
              </button>
              <button onClick={() => { setShowAddForm(false); setAddForm(defaultForm); }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No items found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className={`px-5 py-3 text-${h === 'Actions' ? 'right' : 'left'} text-xs font-semibold text-gray-500 uppercase tracking-wider`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {editingId === item.id ? (
                        /* ─── Edit Row ─── */
                        <>
                          <td className="px-5 py-3">
                            <img
                              src={editForm.image_url || 'https://via.placeholder.com/64'}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-lg"
                              onError={e => { e.currentTarget.src = 'https://via.placeholder.com/64'; }}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <input value={editForm.name}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400" />
                            <input value={editForm.image_url}
                              onChange={e => setEditForm({ ...editForm, image_url: e.target.value })}
                              className="w-full mt-1 px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:ring-2 focus:ring-orange-400"
                              placeholder="Image URL" />
                          </td>
                          <td className="px-5 py-3">
                            <select value={editForm.category}
                              onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm outline-none capitalize">
                              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                            </select>
                          </td>
                          <td className="px-5 py-3">
                            <input type="number" value={editForm.price} step="0.01" min="0"
                              onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                              className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm outline-none" />
                          </td>
                          <td className="px-5 py-3">
                            <input type="number" value={editForm.stockQuantity} min="0"
                              onChange={e => setEditForm({ ...editForm, stockQuantity: parseInt(e.target.value) || 0 })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm outline-none" />
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-400 italic">saving…</td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-2">
                              <button onClick={handleSave} disabled={saving}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs flex items-center gap-1 disabled:opacity-60">
                                {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                              </button>
                              <button onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs">Cancel</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        /* ─── View Row ─── */
                        <>
                          <td className="px-5 py-3">
                            <img
                              src={item.image_url ?? ''}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                              onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                          </td>
                          <td className="px-5 py-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">{item.category}</span>
                          </td>
                          <td className="px-5 py-3 font-semibold">৳{item.price.toFixed(2)}</td>
                          <td className="px-5 py-3">
                            <span className={`font-bold text-lg ${stockColor(item.stock_quantity)}`}>
                              {item.stock_quantity}
                            </span>
                            {item.stock_quantity < 10 && item.stock_quantity > 0 && (
                              <span className="ml-1 text-xs text-orange-500">low</span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {item.in_stock ? 'Available' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Remove">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
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
