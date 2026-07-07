import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { appendToGoogleSheet } from "@/lib/googleSheets";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Honeypot check
        const honeypot = formData.get("_honeypot") as string;
        if (honeypot) {
            console.log("Bot detected via honeypot in custom project form.");
            return NextResponse.json({ success: true, message: "Custom project request received successfully." }, { status: 200 });
        }
        
        // Extract fields
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const entityType = formData.get("entityType") as string;
        const stageOfDevelopment = formData.get("stageOfDevelopment") as string;
        const intendedUse = formData.get("intendedUse") as string;
        const industryType = formData.get("industryType") as string;
        const projectType = formData.get("projectType") as string;
        const targetAudience = formData.get("targetAudience") as string;
        const useCase = formData.get("useCase") as string;
        const requirements = formData.get("requirements") as string;
        const quantity = formData.get("quantity") as string;
        const budget = formData.get("budget") as string;
        const timeFrame = formData.get("timeFrame") as string;
        const ndaRequired = formData.get("ndaRequired") as string;
        
        // Extract file
        const file = formData.get("document") as File | null;
        let documentUrl = null;
        let uploadFailed = false;

        // Attempt Supabase Upload if file exists
        if (file && file.size > 0) {
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                
                const { data, error } = await supabase.storage
                    .from("project_documents")
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error("Storage upload failed:", error);
                    uploadFailed = true;
                } else if (data) {
                    // Get public URL
                    const { data: publicUrlData } = supabase.storage
                        .from("project_documents")
                        .getPublicUrl(data.path);
                    
                    documentUrl = publicUrlData.publicUrl;
                }
            } catch (err) {
                console.error("Exception during file upload:", err);
                uploadFailed = true;
            }
        }

        // Insert into Supabase Database
        const { error: dbError } = await supabase
            .from("custom_projects")
            .insert([{ 
                name, email, entity_type: entityType, stage_of_development: stageOfDevelopment, 
                intended_use: intendedUse, industry_type: industryType, project_type: projectType, 
                target_audience: targetAudience, use_case: useCase, requirements, 
                quantity, budget, time_frame: timeFrame, nda_required: ndaRequired,
                document_url: documentUrl
            }]);

        if (dbError) {
            console.error("Supabase insert error (custom project):", dbError);
        }

        // Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            const documentLinkHtml = documentUrl 
                ? `<p><strong>Attached Document:</strong> <a href="${documentUrl}">Download File</a></p>` 
                : `<p><strong>Attached Document:</strong> None</p>`;

            const { error: emailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "contact@pntsolutions.in",
                to: process.env.ADMIN_NOTIFY_EMAIL || "contact@pntsolutions.in",
                subject: `New Custom Project Request from ${name}`,
                html: `
                    <h2>New Custom Project Request</h2>
                    <hr/>
                    <h3>1. Contact & Entity</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Entity Type:</strong> ${entityType}</p>
                    <br/>
                    
                    <h3>2. Project Overview</h3>
                    <p><strong>Stage of Development:</strong> ${stageOfDevelopment}</p>
                    <p><strong>Intended Use:</strong> ${intendedUse}</p>
                    <p><strong>Industry:</strong> ${industryType}</p>
                    <p><strong>Project Type:</strong> ${projectType}</p>
                    <p><strong>Target Audience:</strong> ${targetAudience}</p>
                    <p><strong>Use Case:</strong> ${useCase}</p>
                    <br/>
                    
                    <h3>3. Project Requirements</h3>
                    <p><strong>Requirements:</strong><br/>${requirements.replace(/\n/g, '<br/>')}</p>
                    <p><strong>Estimated Quantity:</strong> ${quantity}</p>
                    <p><strong>Budget (per Project):</strong> ${budget}</p>
                    <p><strong>Time Frame:</strong> ${timeFrame}</p>
                    <br/>
                    
                    <h3>4. Additional Info</h3>
                    <p><strong>NDA Required:</strong> ${ndaRequired}</p>
                    ${documentLinkHtml}
                `
            });

            if (emailError) {
                console.error("Resend email error:", emailError);
            }
        }

        // Sync to Google Sheets
        await appendToGoogleSheet("Custom Projects", [
            new Date().toLocaleString(), // Timestamp
            name,
            email,
            entityType,
            industryType,
            stageOfDevelopment,
            intendedUse,
            targetAudience,
            ndaRequired,
            quantity,
            budget,
            timeFrame,
            useCase,
            requirements,
            documentUrl || "No File Attached"
        ]);

        // Return response, including fallback warning if needed
        return NextResponse.json({ 
            success: true, 
            message: "Custom project request received successfully.",
            uploadFailed: uploadFailed // Frontend will use this flag to show fallback popup
        }, { status: 200 });

    } catch (error) {
        console.error("Error in custom project API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
