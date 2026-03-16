import ProductDetailClient from '@/components/ProductDetailClient';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

const normalizeImageUrl = (image) => image?.url || image || '/placeholder.jpg';

const buildProductSchema = (product, canonicalUrl) => {
  const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const imageList = (product.images || []).map(normalizeImageUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: product.category?.name || 'Collection',
    image: imageList.length ? imageList : undefined,
    brand: {
      '@type': 'Brand',
      name: 'Mashriqi Libas',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: canonicalUrl,
    },
  };
};

export async function generateMetadata({ params }) {
  let product = null;
  try {
    await connectDB();
    product = await Product.findById(params.id).populate('category').lean();
  } catch (error) {
    product = null;
  }

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product does not exist.',
      robots: { index: false, follow: false },
    };
  }

  const title = product.name;
  const description = product.description?.slice(0, 160) || `Shop ${product.name} at Mashriqi Libas.`;
  const canonical = `/products/${product._id}`;
  const imageUrl = normalizeImageUrl(product.images?.[0]);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'product',
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
    },
    twitter: {
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  let product = null;
  try {
    await connectDB();
    product = await Product.findById(params.id).populate('category').lean();
  } catch (error) {
    product = null;
  }
  const canonical = `/products/${params.id}`;
  const schema = product ? buildProductSchema(product, canonical) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ProductDetailClient id={params.id} initialProduct={product ? { ...product, _id: product._id.toString() } : null} />
    </>
  );
}
