"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";
import { Briefcase, MapPin, CheckCircle, ArrowLeft, Upload, Loader2, MapPinned } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Personal
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [motherTongue, setMotherTongue] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [canRelocate, setCanRelocate] = useState("");

  // Qualification
  const [education, setEducation] = useState("");
  const [diplomaField, setDiplomaField] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [majorSubject, setMajorSubject] = useState("");
  const [achievements, setAchievements] = useState("");

  // Experience
  const [expType, setExpType] = useState("");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState("");
  const [jobDuties, setJobDuties] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [ctc, setCtc] = useState("");

  // Other
  const [fieldOfInterest, setFieldOfInterest] = useState("");
  const [hobbies, setHobbies] = useState("");

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase.from("job_postings").select("*").eq("id", params.id).single();
      if (data) setJob(data);
      setLoading(false);
    }
    if (params.id) fetchJob();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please upload your resume (PDF)");

    setSubmitting(true);
    try {
      // 1. Upload Resume to Supabase Storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) throw new Error("Resume upload failed. Have you created the 'resumes' bucket in Supabase?");

      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
      const resumeUrl = publicUrlData.publicUrl;

      // 2. Prepare Answers JSON
      const answers = {
        father_name: fatherName,
        mother_name: motherName,
        age,
        blood_group: bloodGroup,
        mother_tongue: motherTongue,
        current_address: address,
        pincode,
        can_relocate: canRelocate,
        last_education: education,
        diploma_field: diplomaField,
        college_name: collegeName,
        passing_year: passingYear,
        major_subject: majorSubject,
        achievements,
        experience_type: expType,
        skills,
        previous_job_title: jobTitle,
        start_date: startDate,
        end_date: endDate,
        currently_working: currentlyWorking,
        job_duties: jobDuties,
        notice_period: noticePeriod,
        possible_joining_date: joiningDate,
        ctc,
        field_of_interest: fieldOfInterest,
        hobbies
      };

      // 3. Save to DB
      const { error: dbError } = await supabase.from("job_applications").insert([{
        job_id: job.id,
        name: `${name} ${surname}`,
        email: email,
        phone: phone,
        resume_url: resumeUrl,
        answers: answers
      }]);

      if (dbError) throw new Error("Database error saving application.");

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred submitting your application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p className="font-bold">Loading application...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <p className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Job not found.</p>
        <Link href="/careers" className="text-blue-500 hover:underline">Back to Careers</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center max-w-lg">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Application Sent!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Thank you for applying for the <strong className="text-slate-900 dark:text-white">{job.title}</strong> role. Our team will review your application and get back to you soon.
            </p>
            <Link href="/careers" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
              Return to Careers
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Input = ({ label, required = false, type = "text", ...props }: any) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} required={required} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" {...props} />
    </div>
  );

  const Select = ({ label, required = false, children, ...props }: any) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select required={required} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors appearance-none" {...props}>
        <option value="" disabled>Select an option</option>
        {children}
      </select>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <Link href="/careers" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Openings
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-400 mb-8">
              <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><Briefcase size={16}/> {job.type}</span>
              <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"><MapPin size={16}/> {job.location}</span>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-blue-600 px-8 py-6 text-white">
              <h2 className="text-2xl font-black">Application Form</h2>
              <p className="text-blue-100 mt-1">Please fill out all mandatory fields accurately.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
              
              {/* Section 1: Personal */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">1. Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" required value={name} onChange={(e:any) => setName(e.target.value)} />
                  <Input label="Surname" required value={surname} onChange={(e:any) => setSurname(e.target.value)} />
                  <Input label="Father's Name" required value={fatherName} onChange={(e:any) => setFatherName(e.target.value)} />
                  <Input label="Mother's Name" required value={motherName} onChange={(e:any) => setMotherName(e.target.value)} />
                  <Input label="Email Address" type="email" required value={email} onChange={(e:any) => setEmail(e.target.value)} />
                  <Input label="Phone Number" type="tel" required value={phone} onChange={(e:any) => setPhone(e.target.value)} />
                  <Input label="Age" type="number" required value={age} onChange={(e:any) => setAge(e.target.value)} />
                  <Input label="Blood Group" required value={bloodGroup} onChange={(e:any) => setBloodGroup(e.target.value)} placeholder="e.g. O+" />
                  <Input label="Mother Tongue" required value={motherTongue} onChange={(e:any) => setMotherTongue(e.target.value)} />
                  <Input label="Current Address (Optional)" value={address} onChange={(e:any) => setAddress(e.target.value)} />
                  <Input label="Pincode" required value={pincode} onChange={(e:any) => setPincode(e.target.value)} />
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-start gap-4">
                    <MapPinned className="text-blue-500 shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Office Location Notice</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Our main office is located in <strong>Dombivli, Maharashtra</strong>. If your pincode is outside the Mumbai/Thane region, you will need to commute or relocate.
                      </p>
                      <Select label="Are you able to commute/relocate?" required value={canRelocate} onChange={(e:any) => setCanRelocate(e.target.value)}>
                        <option>Yes, I live nearby</option>
                        <option>Yes, I am willing to relocate</option>
                        <option>No, I am looking for remote only</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Education */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">2. Qualification</h3>
                
                <Select label="Last Education" required value={education} onChange={(e:any) => setEducation(e.target.value)}>
                  <option>12th Pass</option>
                  <option>Diploma</option>
                  <option>3 Years Degree</option>
                  <option>4 Years Degree</option>
                </Select>

                {education === "Diploma" && (
                  <Input label="Diploma Field/Specialization" required value={diplomaField} onChange={(e:any) => setDiplomaField(e.target.value)} />
                )}

                {(education === "3 Years Degree" || education === "4 Years Degree") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                    <Input label="College Name" required value={collegeName} onChange={(e:any) => setCollegeName(e.target.value)} />
                    <Input label="Passing Year" required type="number" value={passingYear} onChange={(e:any) => setPassingYear(e.target.value)} />
                    <Input label="Major Subject" required value={majorSubject} onChange={(e:any) => setMajorSubject(e.target.value)} />
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Any Achievements (Short)</label>
                  <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500" value={achievements} onChange={(e:any) => setAchievements(e.target.value)}></textarea>
                </div>
              </div>

              {/* Section 3: Experience */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">3. Experience</h3>
                
                <Select label="Experience Level" required value={expType} onChange={(e:any) => setExpType(e.target.value)}>
                  <option>Fresher</option>
                  <option>Experienced</option>
                </Select>

                {expType === "Fresher" && (
                  <Input label="List your Skills" required value={skills} onChange={(e:any) => setSkills(e.target.value)} placeholder="e.g. React, Python, CAD..." />
                )}

                {expType === "Experienced" && (
                  <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Job Title" required value={jobTitle} onChange={(e:any) => setJobTitle(e.target.value)} />
                      <Select label="Currently Working Here?" required value={currentlyWorking} onChange={(e:any) => setCurrentlyWorking(e.target.value)}>
                        <option>Yes</option>
                        <option>No</option>
                      </Select>
                      <Input label="Start Date" type="date" required value={startDate} onChange={(e:any) => setStartDate(e.target.value)} />
                      {currentlyWorking === "No" && (
                        <Input label="End Date" type="date" required value={endDate} onChange={(e:any) => setEndDate(e.target.value)} />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">What did you do in this job?</label>
                      <textarea required rows={4} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500" value={jobDuties} onChange={(e:any) => setJobDuties(e.target.value)}></textarea>
                    </div>

                    {currentlyWorking === "Yes" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <Input label="Notice Period (Days)" type="number" required value={noticePeriod} onChange={(e:any) => setNoticePeriod(e.target.value)} />
                        <Input label="Possible Joining Date" type="date" required value={joiningDate} onChange={(e:any) => setJoiningDate(e.target.value)} />
                        <Input label="Current CTC (₹)" required value={ctc} onChange={(e:any) => setCtc(e.target.value)} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 4: Other */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">4. Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Field of Interest" required value={fieldOfInterest} onChange={(e:any) => setFieldOfInterest(e.target.value)} placeholder="e.g. Embedded Systems, Marketing..." />
                  <Input label="Hobbies" required value={hobbies} onChange={(e:any) => setHobbies(e.target.value)} />
                </div>
              </div>

              {/* Section 5: Resume */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">5. Resume Upload</h3>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <label className="block mb-2 text-slate-700 dark:text-slate-300 font-medium">Select your resume (PDF only)</label>
                  <input type="file" required accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="mx-auto block text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer" />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <button type="submit" disabled={submitting} className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20">
                  {submitting ? <><Loader2 className="animate-spin" size={24} /> Submitting...</> : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
