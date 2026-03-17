'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';
import Image from 'next/image';
import { HiOutlineShoppingBag, HiCheck, HiOutlineTruck, HiOutlineRefresh, HiMinus, HiPlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductDetailClient = ({ id, initialProduct }) => {
  const { theme } = useTheme();
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!product) return;
    if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
    if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
  }, [product]);

  useEffect(() => {
    if (initialProduct?._id === id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, initialProduct]);

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Please select a size');
    if (!selectedColor) return toast.error('Please select a color');
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  if (loading) return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 py-20 animate-pulse ${theme.utilities.bgPage}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className={`${theme.utilities.bgMuted} aspect-[3/4] w-full opacity-50`}></div>
        <div className="space-y-6">
          <div className={`h-8 ${theme.utilities.bgMuted} w-3/4 opacity-30`}></div>
          <div className={`h-6 ${theme.utilities.bgMuted} w-1/4 opacity-20`}></div>
          <div className={`h-20 ${theme.utilities.bgMuted} w-full opacity-10`}></div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className={`h-96 flex items-center justify-center ${theme.utilities.bgPage}`}>
      <p className={`${theme.utilities.textMuted} uppercase tracking-widest`}>Product not found.</p>
    </div>
  );

  const getImageUrl = (img) => img?.url || img || '/placeholder.jpg';
  const imageList = product.images?.length ? product.images : ['/placeholder.jpg'];
  const displayPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const comparePrice = product.salePrice && product.salePrice < product.price ? product.price : null;

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 py-10 ${theme.utilities.textPrimary}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div className={`relative aspect-[3/4] ${theme.utilities.bgMuted} overflow-hidden border ${theme.utilities.border}`}>
            <Image
              src={getImageUrl(imageList[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {imageList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-[3/4] border-2 transition-all ${selectedImage === idx ? theme.utilities.borderStrong : 'border-transparent'}`}
              >
                <Image src={getImageUrl(img)} alt={`${product.name} ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <p className={`text-xs uppercase tracking-[0.3em] ${theme.utilities.textPrimary} font-bold`}>{product.category?.name || 'Collection'}</p>
            <h1 className={`text-3xl md:text-4xl font-bold uppercase tracking-tighter ${theme.utilities.textPrimary}`}>
              {product.name}
            </h1>
            <p className={`text-xs ${theme.utilities.textMuted} font-mono tracking-widest uppercase`}>SKU: {product.sku}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-2xl font-bold ${theme.utilities.textPrimary}`}>Rs. {displayPrice.toLocaleString()}</span>
            {comparePrice && (
              <span className={`text-lg ${theme.utilities.textMuted} line-through opacity-60`}>Rs. {comparePrice.toLocaleString()}</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className={`text-[10px] ${theme.utilities.bgContrast} ${theme.utilities.textInverse} font-bold uppercase tracking-widest px-2 py-1`}>Low Stock</span>
            )}
          </div>

          <p className={`${theme.utilities.textSecondary} text-sm leading-relaxed`}>
            {product.description}
          </p>

          <div className="space-y-4">
            <div className={`flex justify-between items-center text-xs uppercase tracking-widest font-bold ${theme.utilities.textPrimary}`}>
              <span>Select Size</span>
              <button className={`border-b ${theme.utilities.border} hover:opacity-60 transition-opacity`}>Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || []).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    min-w-[50px] h-10 flex items-center justify-center border text-[11px] font-bold transition-all
                    ${selectedSize === size ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} border-transparent` : `${theme.utilities.border} ${theme.utilities.textMuted} theme-hover-text-primary theme-hover-border-strong`}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className={`text-xs uppercase tracking-widest font-bold ${theme.utilities.textPrimary}`}>Select Color: <span className={`font-normal ${theme.utilities.textMuted} ml-1 uppercase`}>{selectedColor?.name}</span></div>
            <div className="flex flex-wrap gap-3">
              {(product.colors || []).map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-8 h-8 rounded-full border-2 p-0.5 transition-all
                    ${selectedColor?.name === color.name ? theme.utilities.borderStrong : 'border-transparent'}
                  `}
                  title={color.name}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex || '#ccc' }}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className={`flex items-center border ${theme.utilities.border} h-14`}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className={`w-12 h-full flex items-center justify-center theme-hover-bg-muted transition-colors ${theme.utilities.textPrimary}`}
              >
                <HiMinus className="text-xs" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-12 text-center text-sm font-bold bg-transparent outline-none ${theme.utilities.textPrimary}`}
              />
              <button
                onClick={() => setQuantity(q => q + 1)}
                className={`w-12 h-full flex items-center justify-center theme-hover-bg-muted transition-colors ${theme.utilities.textPrimary}`}
              >
                <HiPlus className="text-xs" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`
                h-14 flex-grow ${theme.components.buttonPrimary} flex items-center justify-center space-x-3
                ${product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}
              `}
            >
              <HiOutlineShoppingBag className="text-lg" />
              <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border-t ${theme.utilities.border} pt-8`}>
            <div className={`flex items-center space-x-3 text-xs ${theme.utilities.textMuted} uppercase tracking-widest`}>
              <HiOutlineTruck className={`text-xl ${theme.utilities.textPrimary}`} />
              <span>Express Shipping</span>
            </div>
            <div className={`flex items-center space-x-3 text-xs ${theme.utilities.textMuted} uppercase tracking-widest`}>
              <HiOutlineRefresh className={`text-xl ${theme.utilities.textPrimary}`} />
              <span>Easy 14-Day Returns</span>
            </div>
            <div className={`flex items-center space-x-3 text-xs ${theme.utilities.textMuted} uppercase tracking-widest`}>
              <HiCheck className={`text-xl ${theme.utilities.textPrimary}`} />
              <span>100% Authentic Fabric</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
