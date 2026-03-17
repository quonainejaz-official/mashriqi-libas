'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiArrowRight } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HomeClient = () => {
  const { theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const getImageUrl = (images) => images?.[0]?.url || images?.[0] || '/placeholder.jpg';
  const getDisplayPrice = (product) => product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products?featured=true&limit=8'),
          axios.get('/api/categories')
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories || []);
      } catch (error) {
        console.error('Home data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=2000',
      title: 'SUMMER COLLECTION 2024',
      subtitle: 'Pure Elegance in Every Thread',
      link: '/products?category=unstitched'
    },
    {
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=2000',
      title: 'FESTIVE FORMALS',
      subtitle: 'Celebrate the Season with Style',
      link: '/products?category=festive'
    }
  ];

  const categoryBanners = [
    { name: 'READY TO WEAR', link: '/products?category=stitched', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80' },
    { name: 'LUXURY', link: '/products?category=luxury', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80' },
    { name: 'UNSTITCHED', link: '/products?category=unstitched', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80' },
    { name: 'FREEDOM TO BUY', link: '/products?category=fabric', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80' }
  ];

  return (
    <div className={`flex flex-col ${theme.utilities.bgPage}`}>
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000 }}
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-full w-full group">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4">
                  <div className="animate-fadeIn space-y-6">
                    <h2 className="text-white text-xs md:text-sm tracking-[0.4em] font-light uppercase">{slide.subtitle}</h2>
                    <h1 className="text-white text-4xl md:text-7xl font-light tracking-[0.2em] uppercase">
                      {slide.title}
                    </h1>
                    <div className="pt-4">
                      <Link
                        href={slide.link}
                        className="inline-block border border-white text-white px-10 py-4 text-[10px] tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all duration-300 uppercase"
                      >
                        Shop Collection
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev !text-white !w-12 !h-12 after:!text-xl"></div>
          <div className="swiper-button-next !text-white !w-12 !h-12 after:!text-xl"></div>
        </Swiper>
      </section>

      <section className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-12 ${theme.utilities.bgPage}`}>
        {categoryBanners.map((cat, idx) => (
          <Link key={idx} href={cat.link} className={`relative aspect-[4/5] md:aspect-[16/9] overflow-hidden group ${theme.utilities.border}`}>
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all flex items-center justify-center">
              <div className="text-center">
                <Link
                  href={cat.link}
                  className="bg-white/95 text-black px-10 py-4 text-[10px] tracking-[0.4em] font-bold hover:bg-black hover:text-white transition-all duration-300 uppercase shadow-lg"
                >
                  Discover {cat.name}
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className={`py-24 px-4 md:px-8 text-center ${theme.utilities.bgMuted}`}>
        <h2 className={`text-2xl md:text-5xl font-light tracking-[0.3em] ${theme.utilities.textSecondary} mb-6 uppercase`}>The Art of Elegance</h2>
        <div className={`w-24 h-[1.5px] ${theme.utilities.bgContrast} mx-auto mb-16 opacity-30`}></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {[
            { title: 'The Classic Look', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800' },
            { title: 'Modern Fusion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
            { title: 'Timeless Grace', image: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=800' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-8 group">
              <div className={`relative aspect-[3/4] overflow-hidden ${theme.utilities.border}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
              </div>
              <h3 className={`text-xl font-light tracking-[0.2em] uppercase ${theme.utilities.textPrimary}`}>{item.title}</h3>
              <Link href="/products" className={`inline-block text-[11px] tracking-[0.3em] font-bold border-b-2 ${theme.utilities.border} pb-2 hover:opacity-60 transition-all uppercase`}>
                Discover Collection
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className={`text-2xl md:text-5xl font-light tracking-[0.3em] ${theme.utilities.textPrimary} uppercase`}>Featured Collection</h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1.2}
          navigation
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4.2 },
          }}
          className="product-carousel"
        >
          {loading ? (
            [...Array(5)].map((_, idx) => (
              <SwiperSlide key={idx}>
                <div className="space-y-4 animate-pulse">
                  <div className="bg-gray-100 aspect-[3/4] w-full"></div>
                  <div className="h-4 bg-gray-100 w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-100 w-1/4 mx-auto"></div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            featuredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="group cursor-pointer">
                  <Link href={`/products/${product._id}`}>
                    <div className={`relative aspect-[3/4] overflow-hidden ${theme.utilities.bgMuted} mb-6`}>
                      <Image
                        src={getImageUrl(product.images)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                      />
                      {product.salePrice && product.salePrice < product.price && (
                        <div className={`absolute top-4 left-4 ${theme.utilities.bgContrast} ${theme.utilities.textInverse} text-[10px] px-3 py-1 tracking-widest uppercase font-bold`}>
                          Sale
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <button className={`w-full ${theme.components.buttonPrimary} py-4 text-[10px] tracking-[0.3em] font-bold uppercase shadow-2xl`}>
                          Quick Add
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="text-center space-y-3">
                    <h3 className={`text-[10px] tracking-[0.2em] ${theme.utilities.textMuted} uppercase font-medium`}>{product.category?.name || 'Collection'}</h3>
                    <Link href={`/products/${product._id}`}>
                      <h4 className={`text-sm font-light tracking-widest ${theme.utilities.textPrimary} hover:opacity-60 transition-colors uppercase`}>{product.name}</h4>
                    </Link>
                    <div className={`flex items-center justify-center space-x-4 text-xs tracking-[0.15em] font-bold ${theme.utilities.textPrimary}`}>
                      {product.salePrice && product.salePrice < product.price ? (
                        <>
                          <span className="text-red-600">Rs. {product.salePrice.toLocaleString()}</span>
                          <span className={`${theme.utilities.textMuted} line-through opacity-50`}>Rs. {product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span>Rs. {product.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </section>

      <section className={`grid grid-cols-1 md:grid-cols-3 gap-1 p-1 ${theme.utilities.bgPage}`}>
        {[
          { label: 'STEP INTO FRESH LOOKS', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=1000' },
          { label: 'ELEGANCE REDEFINED', image: 'https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?auto=format&fit=crop&q=80&w=1000' },
          { label: 'SUMMER TRENDING LOOKS', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000' }
        ].map((item, idx) => (
          <div key={idx} className="relative aspect-[3/4] overflow-hidden group">
            <Image
              src={item.image}
              alt={item.label}
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center p-8">
              <h3 className="text-white text-xl md:text-2xl font-light tracking-[0.3em] text-center mb-8 uppercase leading-relaxed">{item.label}</h3>
              <Link href="/products" className="bg-white text-black px-10 py-4 text-[10px] tracking-[0.4em] font-bold hover:bg-black hover:text-white transition-all duration-300 uppercase shadow-2xl">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className={`py-32 px-4 md:px-8 ${theme.utilities.bgMuted} border-y ${theme.utilities.border}`}>
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <p className={`text-[10px] tracking-[0.6em] ${theme.utilities.textMuted} uppercase font-bold`}>Stay in the Loop</p>
          <h2 className={`text-3xl md:text-6xl font-light tracking-[0.1em] ${theme.utilities.textPrimary} uppercase`}>The Newsletter</h2>
          <p className={`${theme.utilities.textMuted} font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed`}>
            Subscribe to get notified about product launches, special offers and company news.
          </p>
          <form className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mt-12">
            <input
              type="email"
              placeholder="Your email address"
              className={`w-full ${theme.utilities.bgSurface} border ${theme.utilities.border} px-8 py-5 text-sm focus:outline-none focus:border-black transition-all font-light ${theme.utilities.textPrimary}`}
              required
            />
            <button
              type="submit"
              className={`w-full md:w-auto ${theme.components.buttonPrimary} px-14 py-5 text-[10px] tracking-[0.4em] font-bold uppercase whitespace-nowrap shadow-xl`}
            >
              Join Us
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomeClient;
