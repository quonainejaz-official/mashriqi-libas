'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineSearch, 
  HiOutlinePhotograph,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiCheckCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

const AdminProductsPage = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    category: '',
    subcategory: '',
    stock: '',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#000000' }],
    isFeatured: false,
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/products?page=${page}&search=${search}`);
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' ? { subcategory: '' } : {}),
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const flattenSubcategories = (nodes = [], depth = 0) =>
    nodes.flatMap((node) => [
      { ...node, depth },
      ...(node.subcategories ? flattenSubcategories(node.subcategories, depth + 1) : [])
    ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingProduct ? 'Updating product...' : 'Creating product...');
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      const selectedCategory = categories.find((cat) => cat._id === formData.category);
      const selectedSubcategory = flattenSubcategories(selectedCategory?.subcategories || []).find(
        (sub) => sub.slug === formData.subcategory
      );
      data.set('subcategory', selectedSubcategory ? JSON.stringify({ name: selectedSubcategory.name, slug: selectedSubcategory.slug }) : 'null');
      
      selectedImages.forEach(image => {
        data.append('images', image);
      });

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct._id}`, data);
        toast.success('Product updated successfully', { id: loadingToast });
      } else {
        await axios.post('/api/admin/products', data);
        toast.success('Product created successfully', { id: loadingToast });
      }
      
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed', { id: loadingToast });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sku: '',
      category: '',
      subcategory: '',
      stock: '',
      sizes: ['M', 'L', 'XL'],
      colors: [{ name: 'Black', hex: '#000000' }],
      isFeatured: false,
    });
    setSelectedImages([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      category: product.category?._id || '',
      subcategory: product.subcategory?.slug || '',
      stock: product.stock,
      sizes: product.sizes,
      colors: product.colors,
      isFeatured: product.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const selectedCategory = categories.find((cat) => cat._id === formData.category);
  const subcategoryOptions = flattenSubcategories(selectedCategory?.subcategories || []);

  return (
    <div className={`space-y-8 animate-fadeIn ${theme.utilities.textPrimary}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>Product Management</h1>
          <p className={`text-xs ${theme.utilities.textMuted} mt-1 uppercase tracking-widest`}>Inventory & Catalog Control</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); resetForm(); setShowModal(true); }}
          className={`${theme.components.buttonPrimary} flex items-center space-x-2 h-12 px-6`}
        >
          <HiOutlinePlus className="text-lg" />
          <span className="text-[11px]">Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className={`${theme.utilities.bgSurface} p-4 border ${theme.utilities.border} shadow-sm flex items-center space-x-4`}>
        <div className="relative flex-grow max-w-md">
          <HiOutlineSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              className={`w-full ${theme.components.input} border pl-12 pr-4 py-3 text-sm outline-none ${theme.utilities.textPrimary}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Product Table */}
      <div className={`${theme.utilities.bgSurface} border ${theme.utilities.border} shadow-sm overflow-hidden`}>
        <table className="w-full text-left">
          <thead className={`${theme.utilities.bgContrast} ${theme.utilities.textInverse} text-[10px] uppercase tracking-widest`}>
            <tr>
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">SKU</th>
              <th className="px-6 py-4 font-bold text-center">Stock</th>
              <th className="px-6 py-4 font-bold text-center">Price</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme.utilities.border}`}>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className={`h-10 w-40 ${theme.utilities.bgMuted} opacity-50`}></div></td>
                  <td className="px-6 py-4"><div className={`h-4 w-20 ${theme.utilities.bgMuted} opacity-30`}></div></td>
                  <td className="px-6 py-4"><div className={`h-4 w-20 ${theme.utilities.bgMuted} opacity-30`}></div></td>
                  <td className="px-6 py-4"><div className={`h-4 w-10 ${theme.utilities.bgMuted} opacity-30 mx-auto`}></div></td>
                  <td className="px-6 py-4"><div className={`h-4 w-20 ${theme.utilities.bgMuted} opacity-30 mx-auto`}></div></td>
                  <td className="px-6 py-4"><div className={`h-8 w-20 ${theme.utilities.bgMuted} opacity-30 ml-auto`}></div></td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className={`theme-hover-bg-muted transition-colors`}>
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <div className={`relative w-10 h-14 ${theme.utilities.bgMuted}`}>
                      <Image src={product.images?.[0]?.url || product.images?.[0] || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase">{product.name}</p>
                      {product.isFeatured && <span className={`text-[9px] ${theme.utilities.bgContrast} ${theme.utilities.textInverse} px-1.5 py-0.5 font-bold uppercase tracking-widest`}>Featured</span>}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-xs tracking-widest uppercase ${theme.utilities.textMuted}`}>{product.category?.name || '---'}</td>
                  <td className="px-6 py-4 text-[10px] font-mono tracking-widest uppercase text-gray-400 font-bold">{product.sku}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'text-gray-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-center text-sm font-bold ${theme.utilities.textPrimary}`}>Rs. {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(product)} className={`p-2 text-blue-600 theme-hover-bg-muted transition-all`}><HiOutlinePencil /></button>
                      <button onClick={() => handleDelete(product._id)} className={`p-2 ${theme.utilities.textDanger} theme-hover-bg-muted transition-all`}><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={`px-6 py-20 text-center ${theme.utilities.textMuted} text-xs uppercase tracking-widest italic`}>No products found in the archive.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`${theme.utilities.bgMuted} px-6 py-4 flex items-center justify-between border-t ${theme.utilities.border}`}>
            <p className={`text-[10px] uppercase font-bold ${theme.utilities.textMuted} tracking-widest`}>Page {page} of {totalPages}</p>
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className={`p-2 border ${theme.utilities.border} ${theme.utilities.bgSurface} theme-hover-bg-muted ${theme.utilities.textPrimary}`}><HiChevronLeft /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className={`p-2 border ${theme.utilities.border} ${theme.utilities.bgSurface} theme-hover-bg-muted ${theme.utilities.textPrimary}`}><HiChevronRight /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className={`${theme.utilities.bgSurface} ${theme.utilities.textPrimary} w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 animate-scaleIn border ${theme.utilities.border}`}>
            <div className={`flex justify-between items-center mb-10 border-b ${theme.utilities.border} pb-6`}>
              <h2 className={`text-xl font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className={`text-2xl hover:rotate-90 transition-transform ${theme.utilities.textMuted} theme-hover-text-primary`}><HiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Product Name</label>
                  <input type="text" name="name" required className={`w-full ${theme.components.input} border p-4 text-sm outline-none ${theme.utilities.textPrimary}`} value={formData.name} onChange={handleInputChange} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Price (PKR)</label>
                    <input type="number" name="price" required className={`w-full ${theme.components.input} border p-4 text-sm outline-none ${theme.utilities.textPrimary}`} value={formData.price} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>SKU Code</label>
                    <input type="text" name="sku" required className={`w-full ${theme.components.input} border p-4 text-sm outline-none uppercase ${theme.utilities.textPrimary}`} value={formData.sku} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Category</label>
                    <select name="category" required className={`w-full ${theme.components.input} border p-4 text-sm outline-none ${theme.utilities.textPrimary}`} value={formData.category} onChange={handleInputChange}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Stock Quantity</label>
                    <input type="number" name="stock" required className={`w-full ${theme.components.input} border p-4 text-sm outline-none ${theme.utilities.textPrimary}`} value={formData.stock} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Subcategory</label>
                  <select
                    name="subcategory"
                    className={`w-full ${theme.components.input} border p-4 text-sm outline-none ${theme.utilities.textPrimary}`}
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    disabled={!formData.category || subcategoryOptions.length === 0}
                    required={subcategoryOptions.length > 0}
                  >
                    <option value="">{formData.category ? 'Select Subcategory' : 'Select Category First'}</option>
                    {subcategoryOptions.map((sub) => (
                      <option key={`${sub.slug}-${sub.depth}`} value={sub.slug}>
                        {`${sub.depth ? `${'—'.repeat(sub.depth)} ` : ''}${sub.name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Product Description</label>
                  <textarea name="description" rows="4" className={`w-full ${theme.components.input} border p-4 text-sm outline-none resize-none ${theme.utilities.textPrimary}`} value={formData.description} onChange={handleInputChange}></textarea>
                </div>
              </div>

              {/* Right Column: media & extra info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted} flex items-center`}>
                    <HiOutlinePhotograph className="mr-2 text-lg" /> Product Images
                  </label>
                  <div className={`border-2 border-dashed ${theme.utilities.border} p-8 text-center space-y-4 hover:border-[#A08C5B] transition-colors relative`}>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleImageChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <p className={`text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>Drop images here or click to upload</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedImages.map((file, i) => (
                        <div key={i} className={`text-[8px] ${theme.utilities.bgContrast} ${theme.utilities.textInverse} px-2 py-1 rounded-full`}>{file.name}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <input type="checkbox" name="isFeatured" className="w-4 h-4 accent-[#A08C5B]" checked={formData.isFeatured} onChange={handleInputChange} id="feat-check" />
                  <label htmlFor="feat-check" className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted} cursor-pointer`}>Mark as Featured Product</label>
                </div>

                <div className={`space-y-4 pt-10 border-t ${theme.utilities.border}`}>
                  <button type="submit" className={`w-full ${theme.components.buttonPrimary} h-14 flex items-center justify-center space-x-3`}>
                    <HiCheckCircle className="text-xl" />
                    <span>{editingProduct ? 'Update Product' : 'Release Product'}</span>
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className={`w-full text-center text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted} theme-hover-text-primary`}>Cancel Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
