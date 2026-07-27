import React from 'react';
import { Certificate } from '../types';
import { Award, ShieldCheck, Download, Share2, X, GraduationCap, CheckCircle } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f0f17] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div id="certificate-frame" className="border-4 border-double border-amber-500/40 p-6 md:p-8 rounded-xl bg-gradient-to-tr from-[#161424] via-[#1a172c] to-[#12111d] text-center space-y-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-extrabold text-amber-200 tracking-wider uppercase">
              {certificate.institutionName}
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Official Certificate of Master Competency
            </p>
          </div>

          <div className="text-xs text-gray-300 italic">This is to certify that</div>

          {/* Student Name */}
          <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent">
            {certificate.studentName}
          </div>

          <div className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
            has successfully completed all adaptive learning modules, practical exercises, and interactive AI assessments with a score of <strong className="text-amber-300">{certificate.score}%</strong> for:
          </div>

          {/* Course Title */}
          <div className="text-lg md:text-xl font-bold text-white border-y border-amber-500/20 py-3">
            {certificate.courseTitle}
          </div>

          {/* Footer Metadata & Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-left border-t border-white/10 text-xs">
            <div>
              <span className="text-gray-500 text-[10px] uppercase block">Issued Date</span>
              <span className="text-gray-200 font-semibold">{certificate.issuedDate}</span>
              <span className="text-gray-500 text-[10px] uppercase block mt-2">Verification ID</span>
              <span className="text-amber-400 font-mono text-[11px]">{certificate.verificationId}</span>
            </div>

            <div className="text-right">
              <span className="text-gray-500 text-[10px] uppercase block">Authorized Instructor</span>
              <span className="text-gray-200 font-semibold">{certificate.instructorName}</span>
              <div className="flex items-center justify-end gap-1 text-emerald-400 text-[10px] font-bold mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Verified Seal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
