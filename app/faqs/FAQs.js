"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';


export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping within Bangladesh takes 3-5 business days. Express shipping (1-2 days) is available for select areas. International orders take 7-14 business days depending on destination.'
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! Once your order ships, you\'ll receive a tracking number via email/SMS. You can also view tracking details in your account under "Order History".'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. Import duties/taxes are the customer\'s responsibility.'
        },
        {
          q: 'What if my order arrives damaged?',
          a: 'Contact us immediately at support@robostore.com with photos of the damage and packaging. We\'ll arrange a replacement or refund at no cost to you.'
        }
      ]
    },
    {
      category: 'Payments',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and major credit/debit cards (Visa, Mastercard). All card payments are processed securely via SSL encryption.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely. We never store your full card details. Payments are processed by PCI-DSS compliant third-party gateways with bank-level encryption.'
        },
        {
          q: 'Can I change my payment method after ordering?',
          a: 'Payment method can only be changed before order confirmation. Once confirmed, please contact support@robostore.com for assistance.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'You can return eligible items within 14 days of delivery for a full refund. Items must be unused, in original packaging, with tags attached. See our full Refund Policy for details.'
        },
        {
          q: 'Who pays for return shipping?',
          a: 'For defective/wrong items: We provide a prepaid label. For other eligible returns: Customer covers return shipping. Refunds exclude original shipping costs unless we made an error.'
        },
        {
          q: 'How long do refunds take?',
          a: 'Once we receive your return, refunds are processed within 5-7 business days. Bank processing may add 3-10 additional days depending on your payment method.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" in the top navigation, enter your name, email, and password. Verify your email to activate your account and start shopping!'
        },
        {
          q: 'I forgot my password. How do I reset it?',
          a: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox. Links expire after 1 hour for security.'
        },
        {
          q: 'Is my personal information safe?',
          a: 'Yes. We use industry-standard encryption, secure servers, and strict access controls. We never sell your data. See our Privacy Policy for full details.'
        }
      ]
    },
    {
      category: 'Products & Warranty',
      questions: [
        {
          q: 'Are products covered by warranty?',
          a: 'Most electronics include manufacturer warranty (6-24 months). Warranty details are listed on each product page. Contact the manufacturer directly for warranty claims.'
        },
        {
          q: 'Do you offer price matching?',
          a: 'We strive to offer competitive prices. While we don\'t formally price-match, feel free to contact us if you find a lower price elsewhere—we may be able to help!'
        },
        {
          q: 'Can I pre-order upcoming products?',
          a: 'Yes! Pre-order items are clearly marked. You\'ll be charged when the item ships, and we\'ll notify you of any delays or changes.'
        }
      ]
    }
  ];

  // Filter FAQs based on search
  const filteredFAQs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <>
      
      <Navbar />
      
      <main className="container py-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Can't find what you're looking for? <a href="/contact" className="text-primary hover:underline">Contact us</a></p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No questions match "{searchTerm}". Try a different search term.
            </div>
          ) : (
            filteredFAQs.map((category, catIdx) => (
              <div key={catIdx} className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="font-semibold text-lg text-gray-800">{category.category}</h2>
                </div>
                <div className="divide-y">
                  {category.questions.map((faq, qIdx) => {
                    const globalIdx = `${catIdx}-${qIdx}`;
                    const isOpen = openIndex === globalIdx;
                    
                    return (
                      <div key={qIdx}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                          {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-0 text-gray-600 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:support@robotechvalley.com" className="px-6 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
              Email Support
            </a>
            <a href="/contact-us" className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
              Contact Form
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}