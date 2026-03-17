'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { useTheme } from '@/context/ThemeContext';
import {
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaThLarge,
  FaTh,
  FaThList,
  FaChevronRight
} from 'react-icons/fa';

const ProductsContent = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [gridMode, setGridMode] = useState('four');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['White', 'Black', 'Blue', 'Red', 'Beige', 'Green', 'Maroon', 'Teal'];

  const filterKeys = ['category', 'subcategory', 'size', 'color', 'maxPrice', 'search'];
  const filtersApplied = filterKeys.some((key) => searchParams.get(key));
  const activeCategorySlug = searchParams.get('category') || '';
  const activeCategory = categories.find((cat) => cat.slug === activeCategorySlug);

  const subcategoryTabs = activeCategory?.subcategories || [];

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

  useEffect(() => {
    if (!filtersApplied) setSidebarCollapsed(true);
  }, [filtersApplied]);

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const showSidebar = filtersApplied && !sidebarCollapsed;

  const gridClass = useMemo(() => {
    if (gridMode === 'two') return 'grid-cols-2';
    if (gridMode === 'three') return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
  }, [gridMode]);

  const renderFiltersContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className={`text-[12px] font-bold uppercase tracking-widest border-b pb-2 ${theme.utilities.border} ${theme.utilities.textPrimary}`}>Category</h3>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => updateFilters('category', '')}
            className={`text-xs text-left uppercase tracking-wider ${!searchParams.get('category') ? `font-bold ${theme.utilities.textPrimary}` : `${theme.utilities.textMuted} theme-hover-text-primary`}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                updateFilters('category', cat.slug);
                updateFilters('subcategory', '');
              }}
              className={`text-xs text-left uppercase tracking-wider ${searchParams.get('category') === cat.slug ? `font-bold ${theme.utilities.textPrimary}` : `${theme.utilities.textMuted} theme-hover-text-primary`}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {subcategoryTabs.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-[12px] font-bold uppercase tracking-widest border-b pb-2 ${theme.utilities.border} ${theme.utilities.textPrimary}`}>Subcategory</h3>
          <div className="flex flex-col space-y-2">
            {subcategoryTabs.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => updateFilters('subcategory', sub.slug)}
                className={`text-xs text-left uppercase tracking-wider ${searchParams.get('subcategory') === sub.slug ? `font-bold ${theme.utilities.textPrimary}` : `${theme.utilities.textMuted} theme-hover-text-primary`}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className={`text-[12px] font-bold uppercase tracking-widest border-b pb-2 ${theme.utilities.border} ${theme.utilities.textPrimary}`}>Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilters('size', searchParams.get('size') === size ? '' : size)}
              className={`
                border py-1.5 text-[10px] tracking-tighter transition-all
                ${searchParams.get('size') === size ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} border-transparent` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-border-strong theme-hover-text-primary`}
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className={`text-[12px] font-bold uppercase tracking-widest border-b pb-2 ${theme.utilities.border} ${theme.utilities.textPrimary}`}>Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => updateFilters('color', searchParams.get('color') === color ? '' : color)}
              className={`
                px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all
                ${searchParams.get('color') === color ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} border-transparent` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-border-strong theme-hover-text-primary`}
              `}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className={`text-[12px] font-bold uppercase tracking-widest border-b pb-2 ${theme.utilities.border} ${theme.utilities.textPrimary}`}>Price Range</h3>
        <div className="space-y-4 pt-2">
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={searchParams.get('maxPrice') || 50000}
            onChange={(e) => updateFilters('maxPrice', e.target.value)}
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${theme.utilities.bgMuted}`}
          />
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
            <span>Rs. 0</span>
            <span>Rs. {Number(searchParams.get('maxPrice') || 50000).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className={`w-full py-3 text-[10px] uppercase tracking-widest font-bold ${theme.components.buttonOutline}`}
      >
        Clear All
      </button>
    </div>
  );

  return (
    <div className={`max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-8 ${theme.utilities.textPrimary}`}>
      <div className={`flex flex-wrap items-center justify-between text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>
        <span>Home / Shop / {activeCategorySlug ? activeCategorySlug.replace('-', ' ') : 'All'}</span>
        <span>{pagination.total || 0} Products</span>
      </div>

      <div className="text-center space-y-3">
        <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-[0.6em] ${theme.utilities.textPrimary}`}>
          {activeCategorySlug ? activeCategorySlug.replace('-', ' ') : 'Collections'}
        </h1>
      </div>

      {subcategoryTabs.length > 0 && (
        <div className="text-center space-y-3">
          <p className={`text-[10px] uppercase tracking-[0.4em] ${theme.utilities.textMuted}`}>Subcategories</p>
          <div className={`flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-[0.4em] ${theme.utilities.textMuted}`}>
            {subcategoryTabs.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => updateFilters('subcategory', sub.slug)}
                className={`${searchParams.get('subcategory') === sub.slug ? `${theme.utilities.textPrimary} font-bold` : 'theme-hover-text-primary'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-4 border-y py-4 ${theme.utilities.border}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGridMode('two')}
            className={`border px-3 py-2 text-xs ${gridMode === 'two' ? `${theme.utilities.borderStrong} ${theme.utilities.textPrimary}` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-border-strong theme-hover-text-primary`}`}
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => setGridMode('three')}
            className={`border px-3 py-2 text-xs ${gridMode === 'three' ? `${theme.utilities.borderStrong} ${theme.utilities.textPrimary}` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-border-strong theme-hover-text-primary`}`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setGridMode('four')}
            className={`border px-3 py-2 text-xs ${gridMode === 'four' ? `${theme.utilities.borderStrong} ${theme.utilities.textPrimary}` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-border-strong theme-hover-text-primary`}`}
          >
            <FaThList />
          </button>
        </div>

        <div className={`text-center text-[11px] uppercase tracking-[0.4em] ${theme.utilities.textMuted}`}>
          {pagination.total || 0} Products
        </div>

        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters('search', searchInput.trim());
            }}
            className="hidden lg:flex items-center"
          >
            <input
              type="text"
              placeholder="Search styles"
              className={`w-44 ${theme.components.input} border px-4 py-2 text-[10px] uppercase tracking-widest outline-none`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          {filtersApplied && (
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className={`border px-4 py-2 text-[10px] uppercase tracking-widest flex items-center gap-2 ${theme.utilities.border} ${theme.utilities.textPrimary} theme-hover-border-strong`}
            >
              <FaChevronRight className={`${sidebarCollapsed ? '' : 'rotate-180'}`} />
              {sidebarCollapsed ? 'Show Filters' : 'Hide Filters'}
            </button>
          )}
          <button
            onClick={() => setShowFilters(true)}
            className={`border px-4 py-2 text-[10px] uppercase tracking-widest flex items-center gap-2 ${theme.utilities.border} ${theme.utilities.textPrimary} theme-hover-border-strong`}
          >
            <FaFilter />
            Filter
          </button>
          <div className="relative">
            <select
              onChange={(e) => updateFilters('sort', e.target.value)}
              className={`appearance-none border px-4 py-2 pr-8 text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer ${theme.components.input}`}
              value={searchParams.get('sort') || 'newest'}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme.utilities.textMuted}`} />
          </div>
        </div>
      </div>

      <div className={`grid gap-10 ${showSidebar ? 'lg:grid-cols-[260px_1fr]' : 'grid-cols-1'}`}>
        {showSidebar && (
          <aside className={`hidden lg:block border p-6 ${theme.utilities.border} ${theme.utilities.bgSurface}`}>
            {renderFiltersContent()}
          </aside>
        )}

        <main>
          {loading ? (
            <div className={`grid ${gridClass} gap-x-6 gap-y-12`}>
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="space-y-4 animate-pulse">
                  <div className={`${theme.utilities.bgMuted} aspect-[3/4] w-full`}></div>
                  <div className={`h-4 ${theme.utilities.bgMuted} w-3/4`}></div>
                  <div className={`h-4 ${theme.utilities.bgMuted} w-1/2`}></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid ${gridClass} gap-x-6 gap-y-12`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-gray-400 uppercase tracking-widest text-sm">No products found matching your criteria.</p>
              <button onClick={clearFilters} className="btn-outline">
                Reset Filters
              </button>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 mt-16">
              {[...Array(pagination.pages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => updateFilters('page', idx + 1)}
                  className={`
                    w-10 h-10 flex items-center justify-center border text-sm transition-all
                    ${pagination.page === idx + 1 ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} border-transparent` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-border-strong theme-hover-text-primary`}
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[120] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className={`ml-auto h-full w-full max-w-sm ${theme.utilities.bgSurface} p-6 overflow-y-auto relative`}>
            <button
              onClick={() => setShowFilters(false)}
              className={`absolute right-4 top-4 text-lg ${theme.utilities.textMuted} theme-hover-text-primary`}
            >
              <FaTimes />
            </button>
            <div className={`text-xs uppercase tracking-widest font-bold ${theme.utilities.textPrimary} mb-6`}>
              Filters
            </div>
            {renderFiltersContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductsClient() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
