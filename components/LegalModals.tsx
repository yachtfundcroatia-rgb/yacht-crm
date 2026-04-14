"use client";

import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function LegalSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-black text-[#0a192f] mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}

export function PrivacyModal({ open, onClose }: ModalProps) {
  const { lang } = useLang();
  const T = t[lang].privacy;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#0a192f]">{T.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{T.updated}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto px-8 py-6 flex-1">
          <LegalSection title={T.s1_title} content={T.s1} />
          <LegalSection title={T.s2_title} content={T.s2} />
          <LegalSection title={T.s3_title} content={T.s3} />
          <LegalSection title={T.s4_title} content={T.s4} />
          <LegalSection title={T.s5_title} content={T.s5} />
          <LegalSection title={T.s6_title} content={T.s6} />
          <LegalSection title={T.s7_title} content={T.s7} />
          <LegalSection title={T.s8_title} content={T.s8} />
          <LegalSection title={T.s9_title} content={T.s9} />
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-semibold">{T.contact_title}</p>
            <p className="text-xs text-gray-500 mt-1">{T.contact}</p>
          </div>
        </div>
        <div className="px-8 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-[#0a192f] text-white rounded-xl font-bold text-sm hover:bg-[#0f2848] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function TermsModal({ open, onClose }: ModalProps) {
  const { lang } = useLang();
  const T = t[lang].terms;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#0a192f]">{T.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{T.updated}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto px-8 py-6 flex-1">
          <LegalSection title={T.s1_title} content={T.s1} />
          <LegalSection title={T.s2_title} content={T.s2} />
          <LegalSection title={T.s3_title} content={T.s3} />
          <LegalSection title={T.s4_title} content={T.s4} />
          <LegalSection title={T.s5_title} content={T.s5} />
          <LegalSection title={T.s6_title} content={T.s6} />
          <LegalSection title={T.s7_title} content={T.s7} />
          <LegalSection title={T.s8_title} content={T.s8} />
          <LegalSection title={T.s9_title} content={T.s9} />
          <LegalSection title={T.s10_title} content={T.s10} />
          <LegalSection title={T.s11_title} content={T.s11} />
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-semibold">{T.contact_title}</p>
            <p className="text-xs text-gray-500 mt-1">{T.contact}</p>
          </div>
        </div>
        <div className="px-8 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-[#0a192f] text-white rounded-xl font-bold text-sm hover:bg-[#0f2848] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
