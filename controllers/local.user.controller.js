import { users } from '../data/data.js';

class LocalUserController {
  constructor() {
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getOneUser = this.getOneUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async createUser(req, res) {
    const { username } = req.body
    if (!username) {
      return res
        .status(400)
        .json({});
    }

    // имитируем функцию nextval из базы данных
    const allId = users.map((person) => Number(person['user_id']));
    let userid;
    if (allId.length > 0) {
      const maxId = Math.max(...allId);
      userid = (maxId + 1).toString();
    } else {
      userid = '1';
    }

    const newUser = { 'user_id': userid, 'user_name': username };
    users.push(newUser);
    res.status(201).send([ newUser ]);
  }

  async getUsers(req, res) {
    res.status(200).json(users);
  }

  async getOneUser(req, res) {
    const userid = req.params.userid;

    if (!userid) {
      return res
        .status(400)
        .json({});
    }

    const oneUser = users.find((person) => person['user_id'] === userid);
    res.status(200).send([ oneUser ]);
  }

  async updateUser(req, res) {
    const { userid, username } = req.body;
    const index = users.findIndex((person) => person['user_id'] === userid);
    const user = users[index];
  
    if (!user) {
      return res
        .status(404)
        .json({});
    }

    users[index]['user_name'] = username;
    res.status(200).json([ user ]);
  }

  async deleteUser(req, res) {
    const userid = req.params.userid;
    const index = users.findIndex((person) => person['user_id'] === userid);
    const user = users[index];

    if (!user) {
      return res
      .status(404)
      .json({});
    }
    
    users.splice(index, 1);
    return res.status(200).json([ user ]);
  }
};


export const user = new LocalUserController();
