import db from '../db/db.js';

class UserController {
  async createUser(req, res) {
    const {username} = req.body;
    const insert = await db.query(`insert into user_table (user_name) values ($1) returning *;`, [username]);
    res.status(201);
    res.json(insert.rows);
  }

  async getUsers(req, res) {
    const select = await db.query('select * from user_table order by user_id;');
    res.json(select.rows);
  }

  async getOneUser(req, res) {
    const {userid} = req.params;
    const select = await db.query('select * from user_table where user_id = $1;', [userid]);
    res.json(select.rows);
  }

  async updateUser(req, res) {
    const {userid, username} = req.body;
    const update = await db.query(`update user_table set user_name = $1 where user_id = $2 returning *;`, [username, userid]);
    res.json(update.rows);
  }

  async deleteUser(req, res) {
    const {userid} = req.params;
    const select = await db.query('delete from user_table where user_id = $1 returning *;', [userid]);
    res.json(select.rows);
  }
};


export const user = new UserController();
