'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

const ProductCard = ({ product }) => {
  const { theme } = useTheme();
  const isOutOfStock = product.stock <= 0;
  const imageUrl = product.images?.[0]?.url || product.images?.[0] || '/placeholder.jpg';
  const displayPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const comparePrice = product.salePrice && product.salePrice < product.price ? product.price : null;

  return (
    <div className={`group cursor-pointer ${theme.utilities.bgSurface}`}>
      <Link href={`/products/${product._id}`}>
        <div className={`relative aspect-[3/4] overflow-hidden ${theme.utilities.bgMuted} mb-6`}>
          <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
          />
          
          {/* Sale Badge */}
          {comparePrice && (
            <div className={`absolute top-4 left-4 ${theme.utilities.bgContrast} ${theme.utilities.textInverse} text-[10px] px-3 py-1 tracking-widest uppercase font-bold`}>
              Sale
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
              <span className="bg-black text-white text-[10px] px-8 py-3 tracking-[0.4em] uppercase font-bold shadow-2xl">Sold Out</span>
            </div>
          )}

          {/* Quick Add (Desktop) */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <button className={`w-full ${theme.components.buttonPrimary} py-4 text-[10px] tracking-[0.3em] font-bold uppercase shadow-2xl`}>
                Quick Add
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="text-center space-y-3 p-2">
        <p className={`text-[10px] tracking-[0.2em] ${theme.utilities.textMuted} uppercase font-medium`}>
          {product.category?.name || 'Collection'}
        </p>
        <Link href={`/products/${product._id}`}>
          <h3 className={`text-sm font-light tracking-widest ${theme.utilities.textPrimary} hover:opacity-60 transition-colors uppercase line-clamp-1`}>
            {product.name}
          </h3>
        </Link>
        <div className={`flex items-center justify-center space-x-4 text-xs tracking-[0.15em] font-bold ${theme.utilities.textPrimary}`}>
          {comparePrice ? (
            <>
              <span className="text-red-600">Rs. {displayPrice.toLocaleString()}</span>
              <span className={`${theme.utilities.textMuted} line-through opacity-50`}>Rs. {comparePrice.toLocaleString()}</span>
            </>
          ) : (
            <span>Rs. {displayPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
