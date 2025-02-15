import type { AdminUser } from "@/types/user"

export const mockAdminUsers: AdminUser[] = [
  {
    id: "admin-001",
    name: "Mehmet Demir",
    email: "mehmet.demir@example.com",
    role: "admin",
    permissions: ["create_interview", "edit_interview", "delete_interview", "view_all_applications"],
  },
  {
    id: "hr-123",
    name: "Zeynep Şahin",
    email: "zeynep.sahin@example.com",
    role: "hr_manager",
    permissions: ["view_applications", "edit_application_status", "create_interview"],
  },
  {
    id: "hr-456",
    name: "Ali Yıldız",
    email: "ali.yildiz@example.com",
    role: "hr_specialist",
    permissions: ["view_applications", "edit_application_status"],
  },
]

