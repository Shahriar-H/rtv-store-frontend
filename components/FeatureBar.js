import { Truck, RefreshCcw, ShieldCheck, MessageCircle } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Fast Shipping', desc: 'Accross the country' },
  { icon: RefreshCcw, title: 'Easy Returns', desc: 'Return within 3 days' },
  { icon: ShieldCheck, title: '100% Secure Payments', desc: 'Gurantee secure payments' },
  { icon: MessageCircle, title: '24/7 Dedicated Support', desc: 'Anywhere & anytime' },
];

export default function FeatureBar() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-6">
      <div className="container grid grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 text-primary">
              <f.icon size={36} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-dark text-sm">{f.title}</p>
              <p className="text-gray-400 text-xs">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
