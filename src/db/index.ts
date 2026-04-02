import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const DATABASE_URL = 'mysql://root:1414@localhost:3306/belajar_vibe';
const connection = await mysql.createConnection(DATABASE_URL);
export const db = drizzle(connection, { schema, mode: 'default' });
