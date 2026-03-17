const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Most orders arrive within 2–4 business days in major cities and 3–6 business days elsewhere in Pakistan.',
  },
  {
    question: 'Can I change my order after placing it?',
    answer: 'If your order has not been dispatched, contact support and we will do our best to assist.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'International shipping is currently unavailable. Stay tuned for updates.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 14 days for unused items in original packaging, excluding sale items.',
  },
];

export const metadata = {
  title: 'FAQs',
  description: 'Find answers about shipping, returns, and ordering at Mashriqi Libas.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQs',
    description: 'Find answers about shipping, returns, and ordering at Mashriqi Libas.',
    url: '/faq',
  },
  twitter: {
    title: 'FAQs',
    description: 'Find answers about shipping, returns, and ordering at Mashriqi Libas.',
  },
};

export default function FaqPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] theme-text-primary">FAQs</h1>
        <p className="text-xs theme-text-muted uppercase tracking-widest">Quick answers to common questions</p>
      </div>

      <div className="space-y-6">
        {faqs.map((item) => (
          <div key={item.question} className="theme-bg-surface border theme-border p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest theme-text-primary">{item.question}</h2>
            <p className="text-sm theme-text-secondary leading-relaxed mt-3">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
