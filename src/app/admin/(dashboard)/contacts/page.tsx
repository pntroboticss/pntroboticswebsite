import { Calendar } from "lucide-react";
import { readFromGoogleSheet } from "@/lib/googleSheets";

export const revalidate = 0; // Disable caching so data is always fresh

export default async function AdminContacts() {
    // Fetch directly from the Google Sheet tab named "Contacts"
    const rows = await readFromGoogleSheet("Contacts");
    
    // Convert arrays into objects. The api/contact/route.ts appends:
    // [Timestamp, Name, Email, Subject, Message]
    // We reverse the array to show the newest at the top.
    const contacts = rows.map((row, index) => ({
        id: index,
        created_at: row[0] || "",
        name: row[1] || "",
        email: row[2] || "",
        subject: row[3] || "-",
        message: row[4] || ""
    })).reverse();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">General Contacts</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Messages synced directly from Google Sheets.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No contact messages found in Google Sheets.</td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-4 h-4" />
                                                {contact.created_at}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{contact.name}</td>
                                        <td className="px-6 py-4"><a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">{contact.email}</a></td>
                                        <td className="px-6 py-4">{contact.subject}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={contact.message}>{contact.message}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
