import { jsonb, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const drawSnapshots = pgTable('draw_snapshots', {
  id: text('id').primaryKey(),
  drawType: text('draw_type').notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).notNull(),
  network: text('network').notNull(),
  mintAddress: text('mint_address').notNull(),
  holderCount: integer('holder_count').notNull().default(0),
  eligibleCount: integer('eligible_count').notNull().default(0),
  snapshotHash: text('snapshot_hash').notNull(),
  status: text('status').notNull().default('TEST'),
  wallets: jsonb('wallets').notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type DrawSnapshot = typeof drawSnapshots.$inferSelect
