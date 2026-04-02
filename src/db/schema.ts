import { mysqlTable, serial, varchar, timestamp, int, bigint } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = mysqlTable('sessions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  token: varchar('token', { length: 255 }).notNull(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});
