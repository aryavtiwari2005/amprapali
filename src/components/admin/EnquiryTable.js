import { Trash2 } from "lucide-react";

export default function EnquiryTable({ enquiries, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Mobile</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Message</th>
            <th className="px-6 py-3">URL</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{enquiry.name}</td>
              <td className="px-6 py-4">{enquiry.mobile}</td>
              <td className="px-6 py-4">{enquiry.email}</td>
              <td className="px-6 py-4">{enquiry.message}</td>
              <td className="px-6 py-4">{enquiry.url}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(enquiry.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
