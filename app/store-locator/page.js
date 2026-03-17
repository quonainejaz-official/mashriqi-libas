const stores = [
  {
    city: 'Karachi',
    address: 'Dolmen Mall Clifton, Khayaban-e-Shahbaz, Karachi',
    hours: '11am–10pm',
  },
  {
    city: 'Lahore',
    address: 'Emporium Mall, Abdul Haque Rd, Lahore',
    hours: '11am–10pm',
  },
  {
    city: 'Islamabad',
    address: 'Centaurus Mall, Jinnah Avenue, Islamabad',
    hours: '12pm–10pm',
  },
];

export const metadata = {
  title: 'Store Locator',
  description: 'Find Mashriqi Libas stores in Karachi, Lahore, and Islamabad.',
  alternates: {
    canonical: '/store-locator',
  },
  openGraph: {
    title: 'Store Locator',
    description: 'Find Mashriqi Libas stores in Karachi, Lahore, and Islamabad.',
    url: '/store-locator',
  },
  twitter: {
    title: 'Store Locator',
    description: 'Find Mashriqi Libas stores in Karachi, Lahore, and Islamabad.',
  },
};

export default function StoreLocatorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] theme-text-primary">Store Locator</h1>
        <p className="text-xs theme-text-muted uppercase tracking-widest">Visit a boutique near you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div key={store.city} className="theme-bg-surface border theme-border p-8 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest theme-text-primary">{store.city}</h2>
            <p className="text-sm theme-text-secondary leading-relaxed">{store.address}</p>
            <p className="text-xs theme-text-muted uppercase tracking-widest">Hours: {store.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
