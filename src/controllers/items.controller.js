const mysql = require("mysql");
const connection = require("../db-config");
const {
  ALL_ITEMS,
  SINGLE_ITEM,
  INSERT_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
} = require("../queries/items.queries");
const query = require("../utils/query");
const { serverError } = require("../utils/handlers");

/**
 * CRUD - Create, Read, Update, Delete
 * GET - Read
 * POST - Create
 * PUT - Update
 * DELETE - Delete
 */

// http://localhost:3000/items
exports.getAllItems = async (req, res) => {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query all items
  const items = await query(con, ALL_ITEMS(req.user.id), []).catch(
    serverError(res)
  );

  // [] === true, 0 === false
  if (!items.length) {
    res.status(200).json({ msg: "No items available for this user." });
  }
  res.json(items);
};

// http://localhost:3000/items/1
exports.getItem = async (req, res) => {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query all item
  const item = await query(
    con,
    SINGLE_ITEM(req.user.id, req.params.itemId)
  ).catch(serverError(res));

  if (!item.length) {
    res.status(400).json({ msg: "No items available for this user." });
  }
  res.json(item);
};

// http://localhost:3000/items
/**
 * POST request -
 * {
 *  name: 'A item name'
 * }
 */
exports.createItem = async (req, res) => {
  // verify valid token
  const user = req.user; // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }

  // take result of middleware check
  if (user.id) {
    // establish connection
    const con = await connection().catch((err) => {
      throw err;
    });

    // query add item
    const itemName = mysql.escape(req.body.item_name);
    const itemModel = mysql.escape(req.body.item_model);
    const result = await query(
      con,
      INSERT_ITEM(user.id, itemName, itemModel)
    ).catch(serverError(res));

    if (result.affectedRows !== 1) {
      res
        .status(500)
        .json({ msg: `Unable to add item: ${req.body.item_name}` });
    }
    res.json({ msg: "Added item successfully!" });
  }
};

/**
 * Build up values string.
 *
 * @example
 * 'key1 = value1, key2 = value2, ...'
 * "item_name = \'Item 1\', status = \'complete\', date = \'<today's_date>\'"
 */
const _buildValuesString = (req) => {
  const body = req.body;
  const values = Object.keys(body).map(
    // [item_name, status].map()
    (key) => `${key} = ${mysql.escape(body[key])}` // 'New 1 item name'
  );

  values.push(`created_date = NOW()`); // update current date and time
  values.join(", "); // make into a string
  return values;
};

// http://localhost:3000/items/1
/**
 * PUT request -
 * {
 *  name: 'A item name',
 *  state: 'completed'
 * }
 */
exports.updateItem = async (req, res) => {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });
  const values = _buildValuesString(req);

  // query update item
  const result = await query(
    con,
    UPDATE_ITEM(req.user.id, req.params.itemId, values)
  ).catch(serverError(res));

  if (result.affectedRows !== 1) {
    res
      .status(500)
      .json({ msg: `Unable to update item: '${req.body.item_name}'` });
  }
  res.json(result);
};

// http://localhost:3000/items/1
exports.deleteItem = async (req, res) => {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query delete item
  const result = await query(
    con,
    DELETE_ITEM(req.user.id, req.params.itemId)
  ).catch(serverError(res));

  if (result.affectedRows !== 1) {
    res
      .status(500)
      .json({ msg: `Unable to delete item at: ${req.params.itemId}` });
    console.log(err);
  }
  res.json({ msg: "Deleted successfully." });
};
