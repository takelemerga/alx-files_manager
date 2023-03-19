import sha1 from 'sha1';

const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    const emailExist = await dbClient.usersCollection.findOne({ email });
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    } if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    } if (emailExist) {
      return res.status(400).send({ error: 'Already exist' });
    }
    const hashpwd = sha1(password);
    const addUser = await dbClient.usersCollection.insertOne({ email, password: hashpwd });
    const newUser = { id: addUser.ops[0]._id, email: addUser.ops[0].email };
    return res.status(201).send(newUser);
  }
}

module.exports = UsersController;
