import type {
  AdminUser,
  Role,
  User,
  ModuleKey,
  PermissionAction,
  PermissionMatrix,
} from "@/types";

const ALL_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete", "publish", "manage"];

const perm = (spec: Partial<Record<ModuleKey, PermissionAction[]>>): PermissionMatrix => {
  const modules: ModuleKey[] = [
    "dashboard", "marketplace", "services", "categories", "subcategories", "featured",
    "orders", "homepage", "pages", "industries", "insights", "resources", "faqs",
    "users", "admins", "roles", "permissions", "inquiries", "notifications",
    "activity", "settings", "branding", "navigation",
  ];
  return modules.reduce((acc, m) => {
    acc[m] = spec[m] ?? [];
    return acc;
  }, {} as PermissionMatrix);
};

export const ROLES: Role[] = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    slug: "super-admin",
    description: "Complete platform control including system settings, branding, and role management.",
    permissions: perm(
      Object.fromEntries(
        (["dashboard", "marketplace", "services", "orders", "users", "inquiries", "activity", "settings"] as ModuleKey[]).map((m) => [
          m,
          ALL_ACTIONS,
        ])
      ) as Partial<Record<ModuleKey, PermissionAction[]>>
    ),
    isSystem: true,
    createdAt: "2024-01-02",
  },
];

export const ADMINS: AdminUser[] = [
  {
    id: "adm-001",
    name: "Aarav Mehta",
    email: "aarav@stioos.com",
    phone: "+91 98200 11223",
    roleId: "role-super-admin",
    status: "active",
    title: "Founder & Platform Owner",
    lastActive: "2025-11-28T09:42:00",
    createdAt: "2024-01-02",
  },
];

const u = (
  id: string, name: string, email: string, company: string, country: string,
  status: User["status"], inquiries: number, created: string, last: string
): User => ({
  id, name, email, company,
  phone: "+1 555 010" + id.slice(-2),
  country, status, role: "buyer", inquiriesCount: inquiries,
  createdAt: created, lastActive: last,
});

export const USERS: User[] = [
  u("usr-001", "Daniel Osei", "d.osei@vertexbuild.com", "Vertex Build Group", "United States", "active", 4, "2024-05-14", "2025-11-27T16:20:00"),
  u("usr-002", "Sarah Lindqvist", "sarah@nordicfab.se", "Nordic Fab AB", "Sweden", "active", 2, "2024-06-02", "2025-11-26T10:05:00"),
  u("usr-003", "Marcus Chen", "m.chen@apexlogistics.cn", "Apex Logistics", "Singapore", "active", 6, "2024-06-21", "2025-11-28T04:48:00"),
  u("usr-004", "Amira Al-Farsi", "amira@gulfconstruction.om", "Gulf Construction LLC", "Oman", "active", 3, "2024-07-09", "2025-11-25T13:37:00"),
  u("usr-005", "James Whitfield", "james@whitfield-law.com", "Whitfield & Partners", "United Kingdom", "active", 1, "2024-08-15", "2025-11-20T09:12:00"),
  u("usr-006", "Lucia Moretti", "lucia@milanoretail.it", "Milano Retail Group", "Italy", "active", 5, "2024-09-03", "2025-11-27T19:56:00"),
  u("usr-007", "Arjun Malhotra", "arjun@zenstartup.in", "Zen Startup Labs", "India", "active", 2, "2024-09-27", "2025-11-28T06:30:00"),
  u("usr-008", "Emma Johansson", "emma@stockholmai.se", "Stockholm AI", "Sweden", "suspended", 0, "2024-10-11", "2025-10-30T15:41:00"),
  u("usr-009", "Carlos Mendes", "carlos@saopaulotech.br", "Sao Paulo Tech", "Brazil", "active", 3, "2024-11-05", "2025-11-24T11:18:00"),
  u("usr-010", "Fatima Zahra", "fatima@atlasindustrial.ma", "Atlas Industrial", "Morocco", "active", 2, "2024-11-19", "2025-11-23T08:52:00"),
  u("usr-011", "Tom Becker", "tom@becker-eng.de", "Becker Engineering", "Germany", "active", 7, "2025-01-08", "2025-11-27T14:29:00"),
  u("usr-012", "Grace Mwangi", "grace@nairobifintech.ke", "Nairobi Fintech", "Kenya", "active", 1, "2025-01-22", "2025-11-21T17:03:00"),
  u("usr-013", "Hiroshi Tanaka", "h.tanaka@osakamfg.jp", "Osaka Manufacturing", "Japan", "active", 4, "2025-02-14", "2025-11-26T07:44:00"),
  u("usr-014", "Olivia Brown", "olivia@sydneyretail.au", "Sydney Retail Co", "Australia", "inactive", 0, "2025-03-03", "2025-09-15T12:27:00"),
  u("usr-015", "Raj Patel", "raj@gujarattools.in", "Gujarat Tools", "India", "active", 5, "2025-03-18", "2025-11-28T05:11:00"),
  u("usr-016", "Sofia Ramirez", "sofia@mexicocityai.mx", "Mexico City AI", "Mexico", "active", 2, "2025-04-06", "2025-11-25T16:58:00"),
  u("usr-017", "Liam O'Connor", "liam@dublinsoft.ie", "Dublin Software", "Ireland", "active", 3, "2025-05-12", "2025-11-27T09:35:00"),
  u("usr-018", "Ananya Iyer", "ananya@bangalorelabs.in", "Bangalore Labs", "India", "active", 1, "2025-06-01", "2025-11-24T13:49:00"),
  u("usr-019", "Ethan Kim", "ethan@seoulrobotics.kr", "Seoul Robotics", "South Korea", "active", 4, "2025-07-15", "2025-11-28T02:20:00"),
  u("usr-020", "Zara Ahmed", "zara@dubaifinance.ae", "Dubai Finance House", "UAE", "active", 6, "2025-08-29", "2025-11-27T18:14:00"),
];

export const getRoleById = (id: string) => ROLES.find((r) => r.id === id);
export const getAdminById = (id: string) => ADMINS.find((a) => a.id === id);
