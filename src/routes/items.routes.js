const express = require("express");
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} = require("../controllers/items.controller");
const canAccess = require("../middleware/auth.middleware");

const itemsRoutes = express.Router();
/**
 * Express routes for Tasks.
 *
 * RESTful endpoints make for easily adding to existing API features.
 */

/**
 * Routes for all tasks. Evaluates to `/tasks/`.
 */
itemsRoutes.get("/", canAccess, getAllItems).post("/", canAccess, createItem);

/**
 * Routes for a task by id. Evalutes to `/tasks/:taskId`.
 */
itemsRoutes
  .get("/:itemId", canAccess, getItem) // GET http://locahost:3000/tasks/1
  .put("/:itemId", canAccess, updateItem)
  .delete("/:itemId", canAccess, deleteItem);

module.exports = itemsRoutes;
