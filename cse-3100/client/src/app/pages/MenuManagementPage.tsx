import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, Save, X, RefreshCw } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  inStock: boolean;
  image: string;
}

const defaultForm = { name: '', price: 0, category: 'meals' as string, stockQuantity: 50, image: '' };

export const MenuManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/menu');
      setItems(res.data.items ?? res.data ?? []);
    } catch {
      setError('Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: item.price, category: item.category, stockQuantity: item.stockQuantity, image: item.image });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await axiosInstance.put(`/api/admin/menu/${editingId}`, editForm);
      await fetchMenu();
      setEditingId(null);
    } catch { setError('Failed to save item'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await axiosInstance.delete(`/api/admin/menu/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { setError('Failed to delete item'); }
  };

  const handleAdd = async () => {
    if (!addForm.name || addForm.price <= 0) { setError('Name and price are required'); return; }
    setSaving(true);
    try {
      await axiosInstance.post('/api/admin/menu', addForm);
      await fetchMenu();
      setShowAddForm(false);
      setAddForm(defaultForm);
    } catch { setError('Failed to add item'); }
    finally { setSaving(false); }
  };

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
            <button onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium">
              <Plus className="w-5 h-5" /> Add New Item
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

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-orange-200">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Add New Menu Item</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input type="text" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Item name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price (৳) *</label>
                <input type="number" value={addForm.price} onChange={e => setAddForm({...addForm, price: parseFloat(e.target.value)})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" step="0.01" min="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option value="meals">Meals</option>
                  <option value="snacks">Snacks</option>
                  <option value="drinks">Drinks</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Stock Qty</label>
                <input type="number" value={addForm.stockQuantity} onChange={e => setAddForm({...addForm, stockQuantity: parseInt(e.target.value)})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" min="0" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" value={addForm.image} onChange={e => setAddForm({...addForm, image: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleAdd} disabled={saving}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Item
              </button>
              <button onClick={() => { setShowAddForm(false); setAddForm(defaultForm); }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search menu items..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Image','Name','Category','Price','Stock','Status','Actions'].map(h => (
                      <th key={h} className={`px-6 py-4 text-${h === 'Actions' ? 'right' : 'left'} text-sm font-medium text-gray-600`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {editingId === item.id ? (
                        <>
                          <td className="px-6 py-4"><img src={editForm.image || item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" /></td>
                          <td className="px-6 py-4">
                            <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                          </td>
                          <td className="px-6 py-4">
                            <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              <option value="meals">Meals</option>
                              <option value="snacks">Snacks</option>
                              <option value="drinks">Drinks</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input type="number" value={editForm.price} step="0.01"
                              onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg" />
                          </td>
                          <td className="px-6 py-4">
                            <input type="number" value={editForm.stockQuantity}
                              onChange={e => setEditForm({...editForm, stockQuantity: parseInt(e.target.value)})}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                          </td>
                          <td className="px-6 py-4">
                            <input value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs" placeholder="Image URL" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center gap-1">
                                {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                              </button>
                              <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm">Cancel</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4"><img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" /></td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">{item.category}</span>
                          </td>
                          <td className="px-6 py-4 font-medium">৳{item.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${item.stockQuantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                              {item.stockQuantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.inStock ? 'Available' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-5 h-5" />
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
