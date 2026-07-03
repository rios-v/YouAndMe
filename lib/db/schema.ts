import { pgTable, serial, varchar, text, date, timestamp } from "drizzle-orm/pg-core";

export const timelineItems = pgTable("timeline_items", {
  id: serial("id").primaryKey(),
  photoUrl: varchar("photo_url", { length: 500 }),
  description: text("description").notNull(),
  eventDate: date("event_date").notNull(),
  author: varchar("author", { length: 50 }).notNull(), // "Arthur" ou "Fabíola"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  writtenDate: date("written_date").notNull(),
  author: varchar("author", { length: 50 }).notNull(), // "Arthur" ou "Fabíola"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
