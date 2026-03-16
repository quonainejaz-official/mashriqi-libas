'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlinePhotograph,
  HiX
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Image from 'next/image';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
    subcategories: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/categories');
      setCategories(data.categories || []);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingCategory ? 'Updating category...' : 'Creating category...');
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('order', formData.order);
      data.append('subcategories', JSON.stringify(formData.subcategories || []));
      if (selectedImage) {
        data.append('image', selectedImage);
      }

      if (editingCategory) {
        await axios.put(`/api/admin/categories/${editingCategory._id}`, data);
        toast.success('Category updated successfully', { id: loadingToast });
      } else {
        await axios.post('/api/admin/categories', data);
        toast.success('Category created successfully', { id: loadingToast });
      }
      
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed', { id: loadingToast });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', order: 0, subcategories: [] });
    setSelectedImage(null);
  };

  const handleSubcategoryChange = (index, key, value) => {
    const updated = [...formData.subcategories];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, subcategories: updated });
  };

  const addSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [
        ...(formData.subcategories || []),
        { name: '', order: 0, isActive: true },
      ],
    });
  };

  const removeSubcategory = (index) => {
    const updated = formData.subcategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subcategories: updated });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    const loadingToast = toast.loading('Deleting category...');
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success('Category deleted', { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Category Management</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Organize Collections</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); resetForm(); setShowModal(true); }}
          className="btn-primary h-12 px-6 flex items-center space-x-2"
        >
          <HiOutlinePlus className="text-lg" />
          <span className="text-[11px]">New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 border animate-pulse space-y-4">
              <div className="h-40 bg-gray-100"></div>
              <div className="h-4 bg-gray-100 w-1/2"></div>
            </div>
          ))
        ) : categories.map((cat) => (
          <div key={cat._id} className="bg-white border border-gray-100 shadow-sm group overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image src={cat.image?.url || '/placeholder.jpg'} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100">
                <button onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, description: cat.description, order: cat.order, subcategories: cat.subcategories || [] }); setSelectedImage(null); setShowModal(true); }} className="p-3 bg-white text-[#2C3E50] rounded-full hover:bg-[#A08C5B] hover:text-white transition-all">
                  <HiOutlinePencil />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all">
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="font-bold uppercase tracking-widest text-[#2C3E50]">{cat.name}</h3>
                <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 uppercase tracking-widest">Order: {cat.order}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2 uppercase tracking-wide">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-10 animate-scaleIn">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-xl font-bold uppercase tracking-widest">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
              <button onClick={() => setShowModal(false)}><HiX className="text-2xl" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Category Name</label>
                <input type="text" required className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Display Order</label>
                <input type="number" className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                <textarea rows="3" className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Category Image</label>
                <div className="relative border-2 border-dashed p-4 text-center cursor-pointer hover:border-[#A08C5B]">
                  <input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">{selectedImage ? selectedImage.name : 'Select Banner Image'}</p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Subcategories</label>
                  <button type="button" onClick={addSubcategory} className="text-[10px] uppercase tracking-widest font-bold text-[#A08C5B]">Add Subcategory</button>
                </div>
                <div className="space-y-3">
                  {(formData.subcategories || []).map((sub, index) => (
                    <div key={`${sub.name}-${index}`} className="grid grid-cols-12 gap-3 items-center">
                      <input
                        type="text"
                        className="col-span-7 bg-gray-50 border-none p-3 text-xs focus:ring-1 focus:ring-[#A08C5B] outline-none"
                        placeholder="Subcategory name"
                        value={sub.name || ''}
                        onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        className="col-span-2 bg-gray-50 border-none p-3 text-xs focus:ring-1 focus:ring-[#A08C5B] outline-none"
                        placeholder="Order"
                        value={sub.order ?? 0}
                        onChange={(e) => handleSubcategoryChange(index, 'order', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleSubcategoryChange(index, 'isActive', !sub.isActive)}
                        className={`col-span-2 text-[10px] uppercase tracking-widest font-bold px-3 py-3 ${sub.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {sub.isActive ? 'Active' : 'Hidden'}
                      </button>
                      <button type="button" onClick={() => removeSubcategory(index)} className="col-span-1 text-gray-400 hover:text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button type="submit" className="flex-grow btn-primary h-14">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
