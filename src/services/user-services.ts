import * as bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export class UserService {
  static async registerUser(payload: any) {
    const { name, email, password } = payload;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, message: 'email sudah terdaftar' };
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { success: true };
  }
}
