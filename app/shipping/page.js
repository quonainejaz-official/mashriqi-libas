export const metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping timelines, delivery fees, and return policy for Mashriqi Libas.',
  alternates: {
    canonical: '/shipping',
  },
  openGraph: {
    title: 'Shipping & Returns',
    description: 'Shipping timelines, delivery fees, and return policy for Mashriqi Libas.',
    url: '/shipping',
  },
  twitter: {
    title: 'Shipping & Returns',
    description: 'Shipping timelines, delivery fees, and return policy for Mashriqi Libas.',
  },
};

export default function ShippingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] theme-text-primary">Shipping & Returns</h1>
        <p className="text-xs theme-text-muted uppercase tracking-widest">Delivery details, timelines, and return policy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="theme-bg-surface border theme-border p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest theme-text-primary">Shipping Rates</h2>
          <p className="text-sm theme-text-secondary leading-relaxed">
            Standard delivery across Pakistan with a flat fee of Rs. 200. Orders over Rs. 5,000 qualify for free shipping.
          </p>
          <div className="text-xs theme-text-muted uppercase tracking-widest space-y-2">
            <p>Karachi, Lahore, Islamabad: 2-4 business days</p>
            <p>Other cities: 3-6 business days</p>
          </div>
        </div>

        <div className="theme-bg-surface border theme-border p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest theme-text-primary">Order Processing</h2>
          <p className="text-sm theme-text-secondary leading-relaxed">
            Orders are processed within 24 hours on business days. You will receive a confirmation and tracking details by email.
          </p>
          <div className="text-xs theme-text-muted uppercase tracking-widest space-y-2">
            <p>Dispatch days: Monday to Saturday</p>
            <p>No dispatch on public holidays</p>
          </div>
        </div>

        <div className="theme-bg-surface border theme-border p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest theme-text-primary">Returns & Exchanges</h2>
          <p className="text-sm theme-text-secondary leading-relaxed">
            Returns are accepted within 14 days of delivery for unused items in original packaging. Exchanges are subject to stock availability.
          </p>
          <div className="text-xs theme-text-muted uppercase tracking-widest space-y-2">
            <p>Return shipping costs apply</p>
            <p>Sale items are final</p>
          </div>
        </div>
      </div>

      <div className="mt-12 theme-bg-muted border theme-border p-8">
        <h3 className="text-sm font-bold uppercase tracking-widest theme-text-primary">Need Help?</h3>
        <p className="text-sm theme-text-secondary leading-relaxed mt-4">
          Contact our support team for any shipping questions or to start a return. We are available 10am–7pm PKT, Monday to Saturday.
        </p>
      </div>
    </div>
  );
}
