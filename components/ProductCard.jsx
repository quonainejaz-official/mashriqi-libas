import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  const isOutOfStock = product.stock <= 0;
  const imageUrl = product.images?.[0]?.url || product.images?.[0] || '/placeholder.jpg';
  const displayPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const comparePrice = product.salePrice && product.salePrice < product.price ? product.price : null;

  return (
    <div className="group cursor-pointer">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
          <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Sale Badge */}
          {comparePrice && (
            <div className="absolute top-4 left-4 bg-black text-white text-[10px] px-3 py-1 tracking-widest uppercase font-medium">
              Sale
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-black text-white text-[10px] px-6 py-2 tracking-[0.2em] uppercase font-bold">Sold Out</span>
            </div>
          )}

          {/* Quick Add (Desktop) */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button className="w-full bg-white/90 text-black py-3 text-[10px] tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-colors uppercase shadow-sm">
                Quick Add
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="text-center space-y-2">
        <p className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-medium">
          {product.category?.name || 'Collection'}
        </p>
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors tracking-wide line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center space-x-3 text-sm tracking-widest font-light">
          {comparePrice ? (
            <>
              <span className="text-red-600">Rs. {displayPrice.toLocaleString()}</span>
              <span className="text-gray-400 line-through">Rs. {comparePrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-gray-900">Rs. {displayPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
