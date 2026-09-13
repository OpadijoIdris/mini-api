export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
