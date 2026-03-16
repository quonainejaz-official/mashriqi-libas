export const metadata = {
  title: 'Contact Us',
  description: 'Contact Mashriqi Libas for order help, returns, and customer support.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us',
    description: 'Contact Mashriqi Libas for order help, returns, and customer support.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact Us',
    description: 'Contact Mashriqi Libas for order help, returns, and customer support.',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">Contact Us</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">We are here to help</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-gray-100 p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">Customer Support</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>Email: support@mashriqilibas.com</p>
            <p>Phone: +92 300 123 4567</p>
            <p>Hours: Monday to Saturday, 10am–7pm PKT</p>
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest space-y-2">
            <p>Order inquiries</p>
            <p>Returns and exchanges</p>
            <p>Product availability</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">Send a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
            />
            <textarea
              rows={5}
              placeholder="How can we help?"
              className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
            />
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
