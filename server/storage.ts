import { users, signups, type User, type InsertUser, type Signup, type InsertSignup } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSignup(signup: InsertSignup): Promise<Signup>;
  getSignups(): Promise<Signup[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private signups: Map<number, Signup>;
  private currentUserId: number;
  private currentSignupId: number;

  constructor() {
    this.users = new Map();
    this.signups = new Map();
    this.currentUserId = 1;
    this.currentSignupId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSignup(insertSignup: InsertSignup): Promise<Signup> {
    const id = this.currentSignupId++;
    const signup: Signup = { 
      id,
      name: insertSignup.name,
      email: insertSignup.email,
      category: insertSignup.category || null,
      createdAt: new Date() 
    };
    this.signups.set(id, signup);
    return signup;
  }

  async getSignups(): Promise<Signup[]> {
    return Array.from(this.signups.values());
  }
}

export const storage = new MemStorage();
