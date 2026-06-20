import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/logo.png';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-dark text-sm">ROBO</div>
                <div className="text-gray-400 text-xs">TECH VALLEY</div>
              </div> */}
              <Image src={logo} alt="Robo Tech Valley" width={100} height={20} className="object-contain" />
            </div>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Level. 4,House 26/1, Road No. 04, Shialbari Graveyard, Rupnagar Rd, Dhaka 1216</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-primary flex-shrink-0" />
                <span>(+880) 1758-518707</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-primary flex-shrink-0" />
                <span>support@robotechvalley.com</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-dark mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {[
                { href: '/account', label: 'My Account' },
                { href: '/account/login', label: 'Login / Register' },
                { href: '/cart', label: 'Cart' },
                { href: '/orders', label: 'My Orders' },
                { href: '/shop', label: 'Shop' },
              ].map(item => (
                <li key={item.href}><Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-dark mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {/* ['Privacy Policy', 'Refund Policy', 'Terms of Use', "FAQ's", 'Contact Us'] */}
              {[
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/refund-policy', label: 'Refund Policy' },
                { href: '/terms-of-use', label: 'Terms of Use' },
                { href: '/faqs', label: 'FAQs' },
                { href: '/contact-us', label: 'Contact Us' },
              ].map(item => (
                <li key={item.href}><Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-dark mb-2">Our Apps</h4>
            <p className="text-xs text-gray-400 mb-4">Find our developed app on Google Play.</p>
            <div className="space-y-3">
              {/* <button className="w-full bg-dark text-white rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors">
                <div className="text-2xl leading-none">🍎</div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="font-semibold text-sm">App Store</div>
                </div>
              </button> */}
              <a href="https://play.google.com/store/apps/developer?id=Robo+Tech+Valley" target="_blank" rel="noopener noreferrer" className="w-full bg-dark text-white rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors">
                <div className="text-2xl leading-none">▶</div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get our Apps on</div>
                  <div className="font-semibold text-sm">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-400">© 2026. All rights reserved by Robo Tech Valley.</p>
        </div>
      </div>
    </footer>
  );
}
