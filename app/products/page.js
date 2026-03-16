'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { HiOutlineFilter, HiX, HiChevronDown } from 'react-icons/hi';

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Multi-select filters
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['White', 'Black', 'Blue', 'Red', 'Beige', 'Green', 'Maroon', 'Teal'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const res = await axios.get(`/api/products?${query}`);
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1 on filter
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">
            {searchParams.get('category') ? searchParams.get('category').replace('-', ' ') : 'All Collections'}
          </h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">{pagination.total || 0} Products Found</p>
        </div>

        <div className="flex items-center space-x-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters('search', searchInput.trim());
            }}
            className="hidden lg:flex items-center border border-gray-200 px-4 py-3"
          >
            <input
              type="text"
              placeholder="Search styles, fabrics, SKUs..."
              className="bg-transparent text-xs uppercase tracking-widest outline-none w-56"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 border border-gray-200 px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors"
          >
            <HiOutlineFilter />
            <span>Filters</span>
          </button>
          
          <div className="relative group">
            <select 
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="appearance-none border border-gray-200 px-6 py-3 pr-10 text-xs uppercase tracking-widest font-bold focus:outline-none cursor-pointer"
              value={searchParams.get('sort') || 'newest'}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 relative">
        {/* Desktop Filter Sidebar / Mobile Overlay */}
        <div className={`
          fixed inset-0 bg-black/50 z-[100] transition-opacity md:hidden
          ${showFilters ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `} onClick={() => setShowFilters(false)} />

        <aside className={`
          fixed md:relative top-0 left-0 h-full md:h-auto w-[280px] md:w-64 bg-white z-[110] md:z-auto p-8 md:p-0
          transform transition-transform duration-300 md:translate-x-0
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
          space-y-8
        `}>
          <div className="flex items-center justify-between md:hidden mb-8">
            <h2 className="font-bold uppercase tracking-widest">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="text-2xl"><HiX /></button>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest border-b pb-2">Category</h3>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => updateFilters('category', '')}
                className={`text-xs text-left uppercase tracking-wider ${!searchParams.get('category') ? 'font-bold gold-accent' : 'text-gray-500 hover:text-black'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => updateFilters('category', cat.slug)}
                  className={`text-xs text-left uppercase tracking-wider ${searchParams.get('category') === cat.slug ? 'font-bold gold-accent' : 'text-gray-500 hover:text-black'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest border-b pb-2">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button 
                  key={size}
                  onClick={() => updateFilters('size', searchParams.get('size') === size ? '' : size)}
                  className={`
                    border py-1.5 text-[10px] tracking-tighter transition-all
                    ${searchParams.get('size') === size ? 'bg-[#2C3E50] text-white border-[#2C3E50]' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest border-b pb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFilters('color', searchParams.get('color') === color ? '' : color)}
                  className={`
                    px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all
                    ${searchParams.get('color') === color ? 'bg-[#2C3E50] text-white border-[#2C3E50]' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}
                  `}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest border-b pb-2">Price Range</h3>
            <div className="space-y-4 pt-2">
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="1000"
                value={searchParams.get('maxPrice') || 50000}
                onChange={(e) => updateFilters('maxPrice', e.target.value)}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A08C5B]"
              />
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span>Rs. 0</span>
                <span>Rs. {Number(searchParams.get('maxPrice') || 50000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full py-3 text-[10px] uppercase tracking-widest font-bold border border-black hover:bg-black hover:text-white transition-all"
          >
            Clear All
          </button>
        </aside>

        {/* Product Grid */}
        <main className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="space-y-4 animate-pulse">
                  <div className="bg-gray-100 aspect-[3/4] w-full"></div>
                  <div className="h-4 bg-gray-100 w-3/4"></div>
                  <div className="h-4 bg-gray-100 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-gray-400 uppercase tracking-widest text-sm">No products found matching your criteria.</p>
              <button 
                onClick={clearFilters}
                className="btn-outline"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 mt-20">
              {[...Array(pagination.pages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => updateFilters('page', idx + 1)}
                  className={`
                    w-10 h-10 flex items-center justify-center border text-sm transition-all
                    ${pagination.page === idx + 1 ? 'bg-[#2C3E50] text-white border-[#2C3E50]' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
