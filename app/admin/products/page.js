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

const AdminProductsPage = () => {
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
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Product Management</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Inventory & Catalog Control</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center space-x-2 h-12 px-6"
        >
          <HiOutlinePlus className="text-lg" />
          <span className="text-[11px]">Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-gray-100 shadow-sm flex items-center space-x-4">
        <div className="relative flex-grow max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            className="w-full bg-gray-50 border-none pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2C3E50] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">SKU</th>
              <th className="px-6 py-4 font-bold text-center">Stock</th>
              <th className="px-6 py-4 font-bold text-center">Price</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-100"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-100 mx-auto"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 mx-auto"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-20 bg-gray-100 ml-auto"></div></td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <div className="relative w-10 h-14 bg-gray-100">
                      <Image src={product.images?.[0]?.url || product.images?.[0] || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase">{product.name}</p>
                      {product.isFeatured && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 font-bold uppercase tracking-widest">Featured</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs tracking-widest uppercase text-gray-500">{product.category?.name || '---'}</td>
                  <td className="px-6 py-4 text-[10px] font-mono tracking-widest uppercase text-gray-400 font-bold">{product.sku}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'text-gray-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-[#2C3E50]">Rs. {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 transition-all"><HiOutlinePencil /></button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 transition-all"><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-gray-400 text-xs uppercase tracking-widest italic">No products found in the archive.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Page {page} of {totalPages}</p>
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 border bg-white hover:bg-gray-50"><HiChevronLeft /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-2 border bg-white hover:bg-gray-50"><HiChevronRight /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 animate-scaleIn">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#2C3E50]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-2xl hover:rotate-90 transition-transform"><HiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Name</label>
                  <input type="text" name="name" required className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none" value={formData.name} onChange={handleInputChange} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Price (PKR)</label>
                    <input type="number" name="price" required className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none" value={formData.price} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">SKU Code</label>
                    <input type="text" name="sku" required className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none uppercase" value={formData.sku} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Category</label>
                    <select name="category" required className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none" value={formData.category} onChange={handleInputChange}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Stock Quantity</label>
                    <input type="number" name="stock" required className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none" value={formData.stock} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Subcategory</label>
                  <select
                    name="subcategory"
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
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
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Description</label>
                  <textarea name="description" rows="4" className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none resize-none" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
              </div>

              {/* Right Column: media & extra info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 flex items-center">
                    <HiOutlinePhotograph className="mr-2 text-lg" /> Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-200 p-8 text-center space-y-4 hover:border-[#A08C5B] transition-colors relative">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleImageChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Drop images here or click to upload</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedImages.map((file, i) => (
                        <div key={i} className="text-[8px] bg-[#A08C5B] text-white px-2 py-1 rounded-full">{file.name}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <input type="checkbox" name="isFeatured" className="w-4 h-4 accent-[#A08C5B]" checked={formData.isFeatured} onChange={handleInputChange} id="feat-check" />
                  <label htmlFor="feat-check" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 cursor-pointer">Mark as Featured Product</label>
                </div>

                <div className="space-y-4 pt-10 border-t">
                  <button type="submit" className="w-full btn-primary h-14 flex items-center justify-center space-x-3">
                    <HiCheckCircle className="text-xl" />
                    <span>{editingProduct ? 'Update Product' : 'Release Product'}</span>
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black">Cancel Changes</button>
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
