export interface User {
  id: number;
  email: string;
  password: string;
  fio: string;
  roles: {
    UserRole: {
      createdAt: string;
      id: number;
      roleId: number;
      updatedAt: string;
      userId: number;
    };
    createdAt: string;
    id: number;
    name: string;
    updatedAt: string;
  }[];
}
