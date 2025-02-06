import { Trash2 } from "lucide-react";

export default function PropertyTypeTable({ propertyTypes, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Property Type</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {propertyTypes.map((propertyType) => (
            <tr
              key={propertyType.id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium">{propertyType.id}</td>
              <td className="px-6 py-4">{propertyType.property_type}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(propertyType.id)}
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
