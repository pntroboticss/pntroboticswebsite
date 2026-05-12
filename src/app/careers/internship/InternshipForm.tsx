"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload, Loader2, MapPinned, CheckCircle, Plus, Trash2, GraduationCap, Briefcase, X } from "lucide-react";
import Link from "next/link";

const Input = ({ label, required = false, type = "text", ...props }: any) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input type={type} required={required} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors" {...props} />
  </div>
);

const Select = ({ label, required = false, children, ...props }: any) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select required={required} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors appearance-none" {...props}>
      <option value="" disabled>Select an option</option>
      {children}
    </select>
  </div>
);

// Step 1: Unpaid internship confirmation popup
function ConfirmationModal({ onConfirm, onCancel, submitting }: {
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl mx-auto mb-6">
          💡
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-3">Before You Submit</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center text-base leading-relaxed mb-6">
          Please note that this is an <strong className="text-slate-900 dark:text-white">unpaid internship</strong>. A stipend may be provided based on your performance and contribution during your tenure.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5 mb-8">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold text-center">
            Would you like to continue and submit your application?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-3.5 px-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <X size={18} /> Go Back
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-60"
          >
            {submitting ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : <>Yes, Submit 🚀</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 2: Success popup
function SuccessModal({ name }: { name: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse opacity-20" />
          <div className="absolute inset-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Application Sent! 🎉</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-base leading-relaxed">
          Hi <strong className="text-slate-900 dark:text-white">{name}</strong>! We have received your internship application and are reviewing it. We'll be in touch soon.
        </p>

        <Link href="/careers" className="inline-flex items-center justify-center w-full px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base transition-all hover:scale-105 shadow-lg shadow-amber-500/20">
          Back to Careers
        </Link>
      </div>
    </div>
  );
}

export default function InternshipForm() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [pincode, setPincode] = useState("");
  const [canRelocate, setCanRelocate] = useState("");

  // Education
  const [eduStatus, setEduStatus] = useState("");
  const [diplomaYear, setDiplomaYear] = useState("");
  const [diplomaField, setDiplomaField] = useState("");
  const [diplomaCollege, setDiplomaCollege] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const [degreeYear, setDegreeYear] = useState("");
  const [degreeMajor, setDegreeMajor] = useState("");
  const [degreeCollege, setDegreeCollege] = useState("");
  const [degreeStartYear, setDegreeStartYear] = useState("");
  const [degreeEndYear, setDegreeEndYear] = useState("");

  // Experience
  const [experiences, setExperiences] = useState<{ company: string; role: string; duration: string; work: string }[]>([]);

  // Preferences
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const addExperience = () => setExperiences([...experiences, { company: "", role: "", duration: "", work: "" }]);
  const removeExperience = (idx: number) => setExperiences(experiences.filter((_, i) => i !== idx));
  const updateExperience = (idx: number, field: string, value: string) => {
    const updated = [...experiences];
    updated[idx] = { ...updated[idx], [field]: value };
    setExperiences(updated);
  };

  // Called when the form's native submit fires — show confirmation instead
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please upload your resume/CV.");
    setShowConfirm(true);
  };

  // Called when user confirms in the popup
  const handleConfirmedSubmit = async () => {
    setSubmitting(true);
    try {
      const fileExt = resumeFile!.name.split('.').pop();
      const fileName = `interns/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, resumeFile!);
      if (uploadError) throw new Error("Resume upload failed. " + uploadError.message);
      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);

      const answers = {
        education_status: eduStatus,
        diploma_year: diplomaYear,
        diploma_field: diplomaField,
        diploma_college: diplomaCollege,
        degree_type: degreeType,
        degree_current_year: degreeYear,
        degree_major: degreeMajor,
        degree_college: degreeCollege,
        degree_start_year: degreeStartYear,
        degree_end_year: degreeEndYear,
        work_experience: experiences.length > 0 ? JSON.stringify(experiences) : "None",
        area_of_interest: areaOfInterest === "Other" ? customInterest : areaOfInterest,
        can_relocate: canRelocate,
        age,
        pincode
      };

      const response = await fetch("/api/careers/internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          resume_url: publicUrlData.publicUrl,
          answers
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to submit application.");
      }

      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmationModal
          onConfirm={handleConfirmedSubmit}
          onCancel={() => setShowConfirm(false)}
          submitting={submitting}
        />
      )}
      {showSuccess && <SuccessModal name={firstName} />}

      <Link href="/careers" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Careers
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-3 py-1.5 rounded-full">
          <GraduationCap size={14} /> Internship
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Internship at PNT Robotics</h1>
        <div className="flex flex-wrap gap-3">
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold px-4 py-2 rounded-xl">📍 Dombivli, Maharashtra</span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold px-4 py-2 rounded-xl">⏱ Flexible Duration</span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6 text-white">
          <h2 className="text-2xl font-black">Internship Application Form</h2>
          <p className="text-amber-100 mt-1">Fill everything accurately.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="p-8 md:p-12 space-y-14">

          {/* Section 1 - Personal */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-sm font-black">1</span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" required value={firstName} onChange={(e: any) => setFirstName(e.target.value)} />
              <Input label="Last Name / Surname" required value={lastName} onChange={(e: any) => setLastName(e.target.value)} />
              <Input label="Email Address" type="email" required value={email} onChange={(e: any) => setEmail(e.target.value)} />
              <Input label="Phone Number" type="tel" required value={phone} onChange={(e: any) => setPhone(e.target.value)} />
              <Input label="Age" type="number" required value={age} onChange={(e: any) => setAge(e.target.value)} />
              <Input label="Pincode" required value={pincode} onChange={(e: any) => setPincode(e.target.value)} />
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-start gap-4">
                <MapPinned className="text-blue-500 shrink-0 mt-1" size={22} />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Office Location</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Our office is in <strong>Dombivli, Maharashtra</strong>. Interns are expected to work from our lab.
                  </p>
                  <Select label="Can you commute / relocate?" required value={canRelocate} onChange={(e: any) => setCanRelocate(e.target.value)}>
                    <option>Yes, I live nearby</option>
                    <option>Yes, I am willing to relocate</option>
                    <option>I prefer remote work</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Education */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-sm font-black">2</span>
              Education
            </h3>

            <Select label="Current Education Status" required value={eduStatus} onChange={(e: any) => setEduStatus(e.target.value)}>
              <option value="diploma">Pursuing Diploma</option>
              <option value="degree">Pursuing Degree</option>
              <option value="passout">Passed Out</option>
            </Select>

            {eduStatus === "diploma" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl">
                <Select label="Current Year of Diploma" required value={diplomaYear} onChange={(e: any) => setDiplomaYear(e.target.value)}>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                </Select>
                <Input label="Field / Branch" required placeholder="e.g. Mechanical, Electronics..." value={diplomaField} onChange={(e: any) => setDiplomaField(e.target.value)} />
                <Input label="College Name" required value={diplomaCollege} onChange={(e: any) => setDiplomaCollege(e.target.value)} className="md:col-span-2" />
              </div>
            )}

            {eduStatus === "degree" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl">
                <Select label="Degree Duration" required value={degreeType} onChange={(e: any) => setDegreeType(e.target.value)}>
                  <option>3 Year Degree</option>
                  <option>4 Year Degree</option>
                  <option>5 Year Degree</option>
                </Select>
                <Select label="Current Year of Study" required value={degreeYear} onChange={(e: any) => setDegreeYear(e.target.value)}>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                </Select>
                <Input label="Major / Branch" required placeholder="e.g. Electronics Engineering..." value={degreeMajor} onChange={(e: any) => setDegreeMajor(e.target.value)} />
                <Input label="College Name" required value={degreeCollege} onChange={(e: any) => setDegreeCollege(e.target.value)} />
                <Input label="Year Started" type="number" required placeholder="e.g. 2022" value={degreeStartYear} onChange={(e: any) => setDegreeStartYear(e.target.value)} />
                <Input label="Expected Graduation Year" type="number" required placeholder="e.g. 2026" value={degreeEndYear} onChange={(e: any) => setDegreeEndYear(e.target.value)} />
              </div>
            )}

            {eduStatus === "passout" && (
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Please add your experience below, and upload your resume for full educational details.</p>
              </div>
            )}
          </div>

          {/* Section 3 - Experience */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-sm font-black">3</span>
              Work Experience <span className="text-sm font-medium text-slate-400 ml-2">(Optional)</span>
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">If you've worked, done a project, or completed an internship before — add it here.</p>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Briefcase size={14} /> Experience #{idx + 1}</span>
                    <button type="button" onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Company / Organisation Name" required value={exp.company} onChange={(e: any) => updateExperience(idx, "company", e.target.value)} />
                    <Input label="Your Role / Title" required value={exp.role} onChange={(e: any) => updateExperience(idx, "role", e.target.value)} />
                    <Input label="Duration (e.g. 3 months, 1 year)" required value={exp.duration} onChange={(e: any) => updateExperience(idx, "duration", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">What did you work on?</label>
                    <textarea rows={3} required className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-amber-500" value={exp.work} onChange={(e: any) => updateExperience(idx, "work", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addExperience} className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 px-5 py-3 rounded-xl transition-all w-full justify-center">
              <Plus size={18} /> Add Experience
            </button>
          </div>

          {/* Section 4 - Area of Interest */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-sm font-black">4</span>
              Area of Interest
            </h3>
            <Select label="Field of Interest" required value={areaOfInterest} onChange={(e: any) => setAreaOfInterest(e.target.value)}>
              <option>Robotics & Automation</option>
              <option>Artificial Intelligence / Machine Learning</option>
              <option>Embedded Systems & IoT</option>
              <option>Mechanical Design & Fabrication</option>
              <option>Computer Vision</option>
              <option>Electronics & PCB Design</option>
              <option>Software Development</option>
              <option>Drone / UAV Technology</option>
              <option>Defense Robotics</option>
              <option>Other</option>
            </Select>
            {areaOfInterest === "Other" && (
              <Input label="Please specify your area of interest" required value={customInterest} onChange={(e: any) => setCustomInterest(e.target.value)} />
            )}
          </div>

          {/* Section 5 - Resume */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-sm font-black">5</span>
              Resume / CV
            </h3>
            <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl p-8 text-center hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
              <Upload className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <label className="block mb-2 text-slate-700 dark:text-slate-300 font-medium">Upload your resume or CV (PDF only)</label>
              <input
                type="file" required accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="mx-auto block text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900/30 dark:file:text-amber-400 cursor-pointer"
              />
              {resumeFile && <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 font-medium">✓ {resumeFile.name}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-start gap-4">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-lg rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 hover:scale-105"
            >
              Submit Application 🚀
            </button>
            <p className="text-xs text-slate-400">This is an unpaid internship. Stipend may be provided based on performance.</p>
          </div>

        </form>
      </div>
    </>
  );
}
