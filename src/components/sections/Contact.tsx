"use client";

import { useState, useLayoutEffect, useRef } from "react";
import { MapPin, Mail, Phone, CheckCircle } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".animate-fade-up"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="contact" ref={sectionRef} className="bg-white px-5 py-24 sm:px-8 border-t border-divider">
      <div className="mx-auto max-w-[1200px] grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
        
        {/* Left Column: Info & Details */}
        <div className="animate-fade-up space-y-8">
          <div>
            <span className="mb-3 block text-[13px] font-semibold tracking-[0.15em] text-accent-700 uppercase">
              GET IN TOUCH
            </span>
            <h2 className="text-[32px] sm:text-[38px] font-semibold tracking-tight text-ink uppercase leading-tight">
              Let&apos;s build a healthier future together
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75 max-w-[48ch]">
              Whether you are a healthcare provider seeking specific product details, a potential partner looking for R&D collaborations, or have general questions, our team is ready to assist.
            </p>
          </div>

          {/* Structured Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            
            {/* Address */}
            <div className="blueprint relative p-5 bg-neutral-50 flex items-start gap-4">
              <i className="corner tl text-accent-700/20" />
              <i className="corner tr text-accent-700/20" />
              <i className="corner bl text-accent-700/20" />
              <i className="corner br text-accent-700/20" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-divider bg-white text-accent-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold text-ink uppercase tracking-wide">HQ & Manufacturing Complex</h4>
                <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">
                  Building 12, Biotech City Parkway, Industrial Area
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="blueprint relative p-5 bg-neutral-50 flex items-start gap-4">
              <i className="corner tl text-accent-700/20" />
              <i className="corner tr text-accent-700/20" />
              <i className="corner bl text-accent-700/20" />
              <i className="corner br text-accent-700/20" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-divider bg-white text-accent-700">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold text-ink uppercase tracking-wide">Direct Communications</h4>
                <p className="mt-1.5 text-sm text-ink/75 font-semibold">
                  <a href="mailto:inquiries@medisave.com" className="hover:text-accent-700 transition-colors">inquiries@medisave.com</a>
                </p>
                <p className="text-xs text-ink/60 mt-0.5">
                  Quality support: <a href="mailto:quality@medisave.com" className="hover:text-accent-700 transition-colors">quality@medisave.com</a>
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="blueprint relative p-5 bg-neutral-50 flex items-start gap-4">
              <i className="corner tl text-accent-700/20" />
              <i className="corner tr text-accent-700/20" />
              <i className="corner bl text-accent-700/20" />
              <i className="corner br text-accent-700/20" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-divider bg-white text-accent-700">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold text-ink uppercase tracking-wide">Direct Phone Lines</h4>
                <p className="mt-1.5 text-sm text-ink/75 font-semibold">
                  +1 (555) 392-4801
                </p>
                <p className="text-xs text-ink/60 mt-0.5">
                  Mon-Fri, 9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="animate-fade-up relative w-full lg:mt-2">
          <div className="blueprint group relative bg-neutral-50 p-8 sm:p-10 border border-divider min-h-[460px] flex flex-col justify-center">
            <i className="corner tl text-accent-700/30" />
            <i className="corner tr text-accent-700/30" />
            <i className="corner bl text-accent-700/30" />
            <i className="corner br text-accent-700/30" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[11px] font-bold text-ink/60 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g., John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm font-medium text-ink placeholder:text-ink/30 focus:border-accent-700 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[11px] font-bold text-ink/60 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g., john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm font-medium text-ink placeholder:text-ink/30 focus:border-accent-700 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[11px] font-bold text-ink/60 uppercase tracking-wide">
                    Inquiry Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-divider bg-white px-4 py-3 pr-10 text-sm font-medium text-ink focus:border-accent-700 focus:outline-none transition-colors duration-200"
                    >
                      <option value="" disabled>Select inquiry type</option>
                      <option value="general">General Inquiry</option>
                      <option value="products">Product Information</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="quality">Quality & Safety Support</option>
                    </select>
                    {/* Custom Dropdown Chevron Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-ink/50">
                      <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[11px] font-bold text-ink/60 uppercase tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Provide details about your query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm font-medium text-ink placeholder:text-ink/30 focus:border-accent-700 focus:outline-none transition-colors duration-200 resize-y"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className={cn(
                      "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 w-full justify-center brand-gradient border border-transparent text-white font-heading text-sm font-semibold tracking-wide transition-all duration-300 ease-out cursor-pointer",
                      "hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(46,151,212,0.7)]"
                    )}
                  >
                    {/* shine sweep */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    
                    <span className="relative z-10">Send Message</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success Panel */
              <div className="flex flex-col items-center text-center py-6 px-4 animate-[ms-fadeUp_0.4s_ease-out]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5 border border-emerald-200">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-ink uppercase tracking-wide mb-2">
                  Message Sent
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed max-w-[40ch] mb-6">
                  Thank you, <span className="font-semibold text-accent-700">{formData.name}</span>. Your message has been sent successfully. Our team will review your inquiry and get back to you within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: "", email: "", subject: "", message: "" });
                    setSubmitted(false);
                  }}
                  className="text-xs font-semibold tracking-wider text-accent-700 uppercase border border-divider px-5 py-2.5 bg-white transition-colors duration-300 hover:border-accent-700 hover:text-accent-700 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
