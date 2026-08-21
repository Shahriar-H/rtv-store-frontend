'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import imageEquip from '../assets/images-equip.jpg';
import Link from 'next/link';

function pad(n) { return String(n).padStart(2, '0'); }

export default function CountdownDeal() {
  const [time, setTime] = useState({ days: 0, hours: 16, minutes: 23, seconds: 12 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev; // expired
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container py-6">
      <div className="bg-gradient-to-r from-[#E8F4FD] to-[#D0E8F8] rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 p-8 md:p-12">
          <div className="flex-1">
            <p className="text-primary font-semibold text-sm mb-2">Don&apos;t Miss!!</p>
            <h2 className="text-dark text-2xl md:text-3xl font-bold mb-2">
              Enhance Your Robotics Experience
            </h2>
            <p className="text-gray-500 text-sm mb-6">Find the Best Robotics Equipment at Unbeatable Prices</p>

            {/* Countdown */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {[
                { label: 'Days', value: pad(time.days) },
                { label: 'Hours', value: pad(time.hours) },
                { label: 'Minutes', value: pad(time.minutes) },
                { label: 'Seconds', value: pad(time.seconds) },
              ].map((unit) => (
                <div key={unit.label} className="countdown-box">
                  <div className="text-xl font-bold text-dark">{unit.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{unit.label}</div>
                </div>
              ))}
            </div>

            <Link href="/sale" className="btn-primary">
              Check it Out!
            </Link>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
            <Image
              src={imageEquip}
              alt="Deal"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
