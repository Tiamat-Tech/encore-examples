import { SQLDatabase } from "encore.dev/storage/sqldb";

/**
 * The greeting service's Postgres database, provisioned and migrated by Encore.
 * Migrations live in ./migrations. Infrastructure owns this resource; the domain
 * and application layers never see it.
 */
export const greetingDB = new SQLDatabase("greeting", {
  migrations: "./migrations",
});
