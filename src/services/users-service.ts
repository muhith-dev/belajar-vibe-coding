import * as bcrypt from 'bcrypt';
import { db } from '../db';
import { users, sessions } from '../db/schema';
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

  static async loginUser(payload: any) {
    const { email, password } = payload;

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return { success: false, message: 'email atau password salah' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user[0]!.password);

    if (!isPasswordValid) {
      return { success: false, message: 'email atau password salah' };
    }

    // Create session
    const token = crypto.randomUUID();

    await db.insert(sessions).values({
      token,
      userId: user[0]!.id,
    });

    return { success: true, token };
  }

  static async getCurrentUser(token: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    if (result.length === 0) {
      return { success: false, message: 'Unauthorized' };
    }

    return { success: true, data: result[0] };
  }

  static async logoutUser(token: string) {
    await db.delete(sessions).where(eq(sessions.token, token));
    return { success: true };
  }
}
