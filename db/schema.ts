import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const campgrounds = sqliteTable('campgrounds', {
 id:text('id').primaryKey(), data:text('data').notNull()
});
export const accounts = sqliteTable('accounts', {
 userId:text('user_id').primaryKey(), profile:text('profile').notNull(), records:text('records').notNull(),
 revision:integer('revision').notNull().default(1), updatedAt:text('updated_at').notNull()
});
