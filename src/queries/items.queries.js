/**
 * Tables follow syntax:
 * - CREATE TABLE <table_name>(<column_name> <data_type> <options>, ...)
 *
 * Create a table called `tasks` (case-insensitive), with
 * - id as an integer/number that can't have null values, auto-increment it
 * - name with a max of 255 characters, cannot have null values
 * - created_date set to date and time created
 * - status with a max of 10 characters, has a default of 'pending'
 *
 * NOTE: order is important.
 * - columns can have multiple options attached (take `id` column for example)
 * - id is always first (helps with inserting)
 * - defaults always specifed last (helps with inserting)
 */
exports.CREATE_ITEMS_TABLE = `CREATE TABLE IF NOT EXISTS items(
  item_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  item_name varchar(255) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP(),
  item_model varchar(255) NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON UPDATE CASCADE
        ON DELETE CASCADE
)`;

// Get every task
exports.ALL_ITEMS = (userId) => `SELECT * FROM items WHERE user_id = ${userId}`;

// Get a single task by id
exports.SINGLE_ITEM = (userId, itemId) =>
  `SELECT * FROM items WHERE user_id = ${userId} AND item_id = ${itemId}`;

/**
 * Insert follows syntax:
 * - INSERT INTO <table_name>(<col_name1>, <col_name3>, <col_name3>, ...)
 *    VALUES(<value1>, <value2>, <value3>, ...)
 *
 * Create a new task in `tasks` table where
 * - column names match the order the are in the t
 * able
 * - `?` allow us to use params in our controllers
 */
exports.INSERT_ITEM = (userId, itemName, itemModel) =>
  `INSERT INTO items (user_id, item_name, item_model) VALUES (${userId}, ${itemName}, ${itemModel})`;

/**
 * Update follows syntax:
 * - UPDATE <table_name> SET <colum_name> = '<new_value>' WHERE <colum_name> = '<old_value>'
 *
 * NOTE: omitting `WHERE` will result in updating every existing entry.
 */

exports.UPDATE_ITEM = (userId, itemId, newName) =>
  `UPDATE items SET ${newName} WHERE user_id = ${userId} AND item_id = ${itemId}`;

// Delete a task by id
exports.DELETE_ITEM = (userId, itemId) =>
  `DELETE FROM items WHERE user_id = ${userId} AND item_id = ${itemId}`;
