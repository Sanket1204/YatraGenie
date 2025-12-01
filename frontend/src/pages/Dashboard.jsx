import SidebarDashboard from "./SidebarDashboard";

// Render the sidebar-style dashboard for `/dashboard` route.
// Previously the `Dashboard` page was a separate layout without the sidebar,
// which made the sidebar view only available at `/sidebar-dashboard`.
// Exporting the SidebarDashboard here ensures visiting `/dashboard` shows the sidebar.
export default function Dashboard() {
  return <SidebarDashboard />;
}
