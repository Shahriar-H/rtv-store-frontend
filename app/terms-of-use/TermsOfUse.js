"use client";

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function TermsOfUse() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using Robo Store (the "Site"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree, please do not use our Site. We reserve the right to modify these Terms at any time; continued use constitutes acceptance of changes.`
    },
    {
      title: '2. Account Responsibilities',
      content: `• You must be at least 18 years old or have parental consent to create an account
      • You are responsible for maintaining account confidentiality and security
      • You agree to provide accurate, current information and update it as needed
      • Notify us immediately of unauthorized account access at security@robostore.com`
    },
    {
      title: '3. Orders & Purchases',
      content: `• Product prices and availability are subject to change without notice
      • Orders are subject to acceptance and availability confirmation
      • We reserve the right to limit quantities or cancel orders (including after confirmation)
      • You agree to pay all charges at current prices, including applicable taxes and shipping`
    },
    {
      title: '4. Intellectual Property',
      content: `All content on this Site (logos, text, images, software) is owned by Robo Store or our licensors and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit written permission.`
    },
    {
      title: '5. Prohibited Activities',
      content: `You agree not to:
      • Use the Site for any unlawful purpose or in violation of local laws
      • Interfere with Site security, servers, or networks
      • Attempt to gain unauthorized access to user accounts or systems
      • Use automated scripts to scrape data or place orders
      • Post false, misleading, or defamatory content`
    },
    {
      title: '6. Limitation of Liability',
      content: `To the maximum extent permitted by law, Robo Store shall not be liable for:
      • Indirect, incidental, or consequential damages
      • Loss of profits, data, or business opportunities
      • Errors, delays, or interruptions in Site functionality
      • Third-party content or links accessed through our Site
      
      Our total liability shall not exceed the amount you paid for the product/service giving rise to the claim.`
    },
    {
      title: '7. Governing Law',
      content: `These Terms shall be governed by the laws of Bangladesh, without regard to conflict of law principles. Any disputes shall be resolved exclusively in the courts of Dhaka, Bangladesh.`
    },
    {
      title: '8. Contact Information',
      content: `For questions about these Terms, contact us:
      • Email: legal@robostore.com
      • Address: Robo Store Ltd., House #XX, Road #XX, Dhaka 1212, Bangladesh
      • Phone: +880 17XX-XXXXXX`
    }
  ];

  return (
    <>
      <Navbar/>
      
      <main className="container py-12 max-w-4xl mx-auto px-4">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-gray-500 text-sm mb-8">Last Updated: June 20, 2026</p>
          
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <section key={idx} className="border-b pb-6 last:border-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
          
          <div className="mt-12 p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> These Terms constitute a legally binding agreement. Please read carefully before using our services.
            </p>
          </div>
        </article>
      </main>
      
      <Footer />
    </>
  );
}