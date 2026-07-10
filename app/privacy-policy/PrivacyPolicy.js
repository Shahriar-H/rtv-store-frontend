'use client';

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact us for support. This may include:
      • Name, email address, phone number, and shipping address
      • Payment information (processed securely via third-party providers)
      • Order history and preferences
      • Device information, IP address, and browsing behavior (via cookies)`
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:
      • Process and fulfill your orders
      • Communicate with you about orders, products, and promotions
      • Improve our website, products, and customer experience
      • Detect and prevent fraud or security issues
      • Comply with legal obligations`
    },
    {
      title: '3. Information Sharing',
      content: `We do not sell your personal information. We may share your information with:
      • Trusted service providers (payment processors, shipping carriers, analytics)
      • Legal authorities when required by law
      • Business partners with your explicit consent`
    },
    {
      title: '4. Data Security',
      content: `We implement industry-standard security measures to protect your information, including SSL encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.`
    },
    {
      title: '5. Your Rights',
      content: `Depending on your location, you may have the right to:
      • Access, correct, or delete your personal data
      • Opt-out of marketing communications
      • Request a copy of your data in a portable format
      • Withdraw consent for data processing
      
      To exercise these rights, contact us at privacy@robostore.com`
    },
    {
      title: '6. Cookies & Tracking',
      content: `We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.`
    },
    {
      title: '7. Children\'s Privacy',
      content: `Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have, please contact us immediately.`
    },
    {
      title: '8. Changes to This Policy',
      content: `We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on our website and updating the "Last Updated" date below.`
    }
  ];

  return (
    <>
      
      <Navbar />
      <main className="container py-12 max-w-4xl mx-auto px-4">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-8">Last Updated: June 20, 2026</p>
          
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <section key={idx} className="border-b pb-6 last:border-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
          
          <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Questions?</h3>
            <p className="text-blue-700">
              Contact our privacy team at{' '}
              <a href="mailto:robotechvalley@gmail.com" className="underline hover:text-blue-900">
                robotechvalley@gmail.com
              </a>
            </p>
          </div>
        </article>
      </main>
      <Footer />

    </>
  );
}