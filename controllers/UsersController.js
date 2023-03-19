import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    const emailExist = await dbClient.database.collection.findOne({ email });

    if (!email) return (res.status(400).json({ error: 'Missing email' }));
    if (!password) return (res.status(400).json({ error: 'Missing password' }));
    if (emailExist) return res.status(400).json({ error: 'Already exist' });

    const hashpwd = sha1(password);
    const addUser = await dbClient.database.collection('users').insertOne({ email, password: hashpwd });
    const newUser = { id: addUser.ops[0]._id, email: addUser.ops[0].email };
    return res.status(201).json(newUser);
  }
}

module.exports = UsersController;
