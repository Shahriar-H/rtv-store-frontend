"use client";
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Form } from 'react-hook-form';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';



export default function ContactUs() {
  const [submitting, setSubmitting] = useState(false);
  

  const contactMethods = [
    {
      icon: <Mail size={20} />,
      title: 'Email Support',
      details: 'robotechvalley@gmail.com',
      subtext: 'We reply within 24 hours',
      href: 'mailto:robotechvalley@gmail.com'
    },
    {
      icon: <Phone size={20} />,
      title: 'Phone Support',
      details: '+880 1758-518707',
      subtext: 'Sat-Thu, 10AM-6PM BST',
      href: 'tel:+8801758518707'
    },
    {
      icon: <Phone size={20} />,
      title: 'Phone Support',
      details: '+880 1618-934047',
      subtext: 'Sat-Thu, 10AM-6PM BST',
      href: 'tel:+8801618934047'
    },
    {
      icon: <MapPin size={20} />,
      title: 'Visit Us',
      details: 'Level. 4,House 26/1, Road No. 04, Shialbari Graveyard, Rupnagar Rd, Dhaka 1216, Bangladesh',
      subtext: 'Bangladesh',
      href: 'https://maps.app.goo.gl/LPbWcFnwjPKjGYhv7',
      external: true
    },
    // {
    //   icon: <Clock size={20} />,
    //   title: 'Live Chat',
    //   details: 'Available on website',
    //   subtext: 'During business hours',
    //   href: '#',
    //   onClick: () => { /* Open chat widget */ }
    // }
  ];

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or need help? Our support team is ready to assist you. Choose your preferred contact method below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Contact Methods */}
          <div className="space-y-4">
            {contactMethods.map((method, idx) => (
              <a
                key={idx}
                href={method.href}
                onClick={method.onClick}
                target={method.external ? '_blank' : undefined}
                rel={method.external ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition group"
              >
                <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{method.title}</h3>
                  <p className="text-gray-900">{method.details}</p>
                  <p className="text-sm text-gray-500">{method.subtext}</p>
                </div>
              </a>
            ))}

            {/* Business Hours */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">🕒 Business Hours</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Saturday - Thursday : 10:00 AM - 6:00 PM</li>
                <li>Friday: Closed</li>
              </ul>
            </div>
          </div>

          
        </div>

        <Footer />
      </main>
      
     
    </>
  );
}