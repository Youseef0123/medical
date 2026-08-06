"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/components/ui/Tag";
import { submitJobApplication } from "@/lib/strapi";
import type { Job } from "@/types";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ job, isOpen, onClose }: ApplyModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset modal state when job changes or opens
  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setCvFile(null);
      setStatus("idle");
      setErrorMessage("");
      setFieldErrors({});
    }
  }, [isOpen, job]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  // File Upload Handler & Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Extension (.pdf, .doc, .docx)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isAllowedType =
      allowedTypes.includes(file.type) ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx");

    if (!isAllowedType) {
      setFieldErrors((prev) => ({
        ...prev,
        cvFile: "Invalid file type. Please upload a PDF, DOC, or DOCX document.",
      }));
      return;
    }

    // Validate File Size (Max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFieldErrors((prev) => ({
        ...prev,
        cvFile: "File size exceeds 5MB limit. Please upload a smaller document.",
      }));
      return;
    }

    // Clear error & set file
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.cvFile;
      return next;
    });
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = "Valid email address is required";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!cvFile) {
      errors.cvFile = "Please upload your CV / Resume file";
    }

    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setFieldErrors(errors);
      setErrorMessage("Please complete all required fields.");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("fullName", fullName.trim());
      formDataPayload.append("email", email.trim());
      formDataPayload.append("phone", phone.trim());
      formDataPayload.append("coverLetter", coverLetter.trim());
      formDataPayload.append("job", String(job.id));
      if (cvFile) {
        formDataPayload.append("cv", cvFile);
      }

      const response = await submitJobApplication(formDataPayload);

      if (response.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(response.message || "Failed to submit application. Please try again.");
        if (response.errors) {
          setFieldErrors(response.errors);
        }
      }
    } catch {
      setStatus("error");
      setErrorMessage("Unable to submit your application right now. Please try again later.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-8">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-divider bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto animate-[ms-fadeUp_0.3s_ease]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-divider bg-neutral-900 p-6 text-white sm:p-8">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <span className="brand-gradient rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {job.department}
              </span>
              <Tag variant="accent" className="rounded-full !bg-white/10 !text-accent-300">
                {job.type}
              </Tag>
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
              {job.title}
            </h2>
            <div className="mt-2 flex items-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-accent-400" />
                Posted: {job.postedDate}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          {/* Job Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-700 mb-2">
              Job Description
            </h3>
            <p className="text-sm leading-relaxed text-ink/80">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
              Key Responsibilities
            </h3>
            <ul className="space-y-2 text-sm text-ink/80">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-700 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
              Requirements & Qualifications
            </h3>
            <ul className="space-y-2 text-sm text-ink/80">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-divider" />

          {/* Application Form */}
          <div>
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                Apply Now
              </span>
              <h3 className="font-heading text-2xl font-bold uppercase text-ink">
                Submit Your Application
              </h3>
            </div>

            {status !== "success" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && errorMessage && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <XCircle className="h-5 w-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="applicant-name"
                      className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="applicant-name"
                      type="text"
                      required
                      placeholder="Dr. / Mr. / Ms. Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3 text-sm font-medium text-ink focus:border-brand-blue focus:bg-white focus:outline-none"
                    />
                    {fieldErrors.fullName && (
                      <span className="text-xs font-medium text-red-600">
                        {fieldErrors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="applicant-email"
                      className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="applicant-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3 text-sm font-medium text-ink focus:border-brand-blue focus:bg-white focus:outline-none"
                    />
                    {fieldErrors.email && (
                      <span className="text-xs font-medium text-red-600">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="applicant-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="applicant-phone"
                    type="tel"
                    required
                    placeholder="e.g. 0100 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3 text-sm font-medium text-ink focus:border-brand-blue focus:bg-white focus:outline-none"
                  />
                  {fieldErrors.phone && (
                    <span className="text-xs font-medium text-red-600">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>

                {/* CV / Resume Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    CV / Resume Upload <span className="text-red-500">*</span>
                  </label>

                  {!cvFile ? (
                    <label
                      htmlFor="cv-upload"
                      className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-divider bg-neutral-50 p-6 text-center transition-colors hover:border-brand-blue hover:bg-neutral-100/50 cursor-pointer"
                    >
                      <UploadCloud className="h-8 w-8 text-ink/40 group-hover:text-brand-blue transition-colors mb-2" />
                      <span className="text-xs font-bold text-ink uppercase tracking-wider">
                        Click to upload your CV
                      </span>
                      <span className="mt-1 text-[11px] text-ink/50">
                        Supports PDF, DOC, DOCX (Max 5MB)
                      </span>
                      <input
                        id="cv-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between rounded-2xl border border-brand-blue/30 bg-accent-100/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-ink truncate max-w-[240px] sm:max-w-md">
                            {cvFile.name}
                          </p>
                          <p className="text-[11px] text-ink/60">{formatFileSize(cvFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        aria-label="Remove CV file"
                        className="rounded-full p-1.5 text-ink/50 hover:bg-neutral-200 hover:text-ink transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {fieldErrors.cvFile && (
                    <span className="text-xs font-medium text-red-600 block">
                      {fieldErrors.cvFile}
                    </span>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <label
                    htmlFor="cover-letter"
                    className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                  >
                    Cover Letter / Message <span className="text-ink/40 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="cover-letter"
                    rows={4}
                    placeholder="Briefly introduce yourself and outline why you are ideal for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3 text-sm font-medium text-ink focus:border-brand-blue focus:bg-white focus:outline-none resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full brand-gradient px-8 py-4 font-heading text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(46,151,212,0.7)] cursor-pointer disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </form>
            ) : (
              /* Success Panel */
              <div className="flex flex-col items-center justify-center p-8 text-center animate-[ms-fadeUp_0.3s_ease]">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="mb-2 font-heading text-2xl font-bold uppercase text-ink">
                  Application Submitted!
                </h4>
                <p className="mb-6 max-w-md text-sm leading-relaxed text-ink/75">
                  Thank you, <span className="font-semibold text-ink">{fullName}</span>. Your application for{" "}
                  <span className="font-semibold text-accent-700">{job.title}</span> has been received by Medisave&apos;s Talent Acquisition team.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full brand-gradient px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-95 cursor-pointer"
                >
                  Close & Explore More Opportunities
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
