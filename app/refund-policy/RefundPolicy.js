"use client";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';


export default function RefundPolicy() {
  const sections = [
    {
      title: '1. Eligibility for Refunds',
      content: `You may request a refund within 14 days of receiving your order if:
      • The product is defective, damaged, or not as described
      • You received the wrong item
      • The item is missing parts or accessories
      
      Refunds are not available for:
      • Changed mind or buyer's remorse
      • Items damaged due to misuse or normal wear
      • Digital products or downloadable content (unless defective)
      • Customized or personalized items`
    },
    {
      title: '2. How to Request a Refund',
      content: `1. Contact our support team at support@robostore.com within 14 days of delivery
      2. Provide your order number, product details, and reason for return
      3. Include photos if the item is damaged or defective
      4. Our team will review your request and respond within 2 business days
      5. If approved, you'll receive a return shipping label and instructions`
    },
    {
      title: '3. Return Shipping',
      content: `• For defective/wrong items: We provide a prepaid return label
      • For other eligible returns: Customer covers return shipping costs
      • Items must be returned in original packaging with all accessories
      • We recommend using tracked shipping for your protection`
    },
    {
      title: '4. Refund Processing',
      content: `Once we receive and inspect your return:
      • Refunds are processed within 5-7 business days
      • Amount refunded: Original item price + original shipping (if applicable)
      • Refund method: Original payment method (may take 3-10 additional days to appear)
      • Return shipping costs are non-refundable unless we sent the wrong/defective item`
    },
    {
      title: '5. Exchanges',
      content: `We offer exchanges for size, color, or model variations of the same product:
      1. Request an exchange via support@robostore.com
      2. Return the original item following our return process
      3. We'll ship the replacement once the return is received
      4. Price differences will be charged/refunded accordingly`
    },
    {
      title: '6. International Orders',
      content: `International customers:
      • Return shipping costs are the customer's responsibility
      • Import duties/taxes are non-refundable
      • Please check local customs regulations before returning items`
    },
    {
      title: '7. Contact Us',
      content: `Have questions about our refund policy? Contact us:
      • Email: support@robostore.com
      • Phone: +880 17XX-XXXXXX (Sun-Thu, 10AM-6PM BST)
      • Live Chat: Available on our website during business hours`
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="container py-12 max-w-4xl mx-auto px-4">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund & Return Policy</h1>
          <p className="text-gray-500 text-sm mb-8">Last Updated: June 20, 2026</p>
          
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <section key={idx} className="border-b pb-6 last:border-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
          
          <div className="mt-12 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-2">💡 Pro Tip</h3>
            <p className="text-amber-700">
              Keep your original packaging and order confirmation email to make returns faster and easier.
            </p>
          </div>
        </article>
      </main>
      
      <Footer />
    </>
  );
}