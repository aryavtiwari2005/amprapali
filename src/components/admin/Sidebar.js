import {
  Home,
  MapPin,
  Building2,
  FolderOpen,
  RotateCw,
  FileText,
  Users,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: MapPin, label: "Location", href: "/admin/location", count: 0 },
    {
      icon: Building2,
      label: "Property Type",
      href: "/admin/property-type",
      count: 0,
    },
    { icon: FolderOpen, label: "Project", href: "/admin/project", count: 0 },
    { icon: RotateCw, label: "Resale", href: "/admin/resale", count: 0 },
    { icon: FileText, label: "Manage Pages", href: "/admin/pages", count: 0 },
    { icon: Users, label: "User", href: "/admin/users", count: 0 },
    { icon: MessageSquare, label: "Enquiry", href: "/admin/enquiry" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Amrapali Admin</h1>
      </div>

      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {item.count && (
              <span className="ml-auto bg-blue-500 px-2 py-1 rounded-full text-xs">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
