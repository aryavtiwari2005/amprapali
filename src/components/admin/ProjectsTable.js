import { Edit, Trash2 } from "lucide-react";

export default function ProjectTable({ projects, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{project.title}</td>
              <td className="px-6 py-4">{project.location}</td>
              <td className="px-6 py-4">{project.type}</td>
              <td className="px-6 py-4">₹{project.price.toLocaleString()}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit(project)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
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
