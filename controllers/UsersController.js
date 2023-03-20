import sha1 from 'sha1';
import dbClient from '../utils/db';
import RedisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    const emailExist = await (await dbClient.usersCollection()).findOne({ email });

    if (!email) return (res.status(400).json({ error: 'Missing email' }));
    if (!password) return (res.status(400).json({ error: 'Missing password' }));
    if (emailExist) return res.status(400).json({ error: 'Already exist' });

    const hashpwd = sha1(password);

    const addUser = await (await dbClient.usersCollection('users')).insertOne({ email, password: hashpwd });
    const newUser = { id: addUser.ops[0]._id, email: addUser.ops[0].email };
    return res.status(201).json(newUser);
  }

  static async getMe(request, response) {
    const token = request.header('X-Token') || null;
    if (!token) return response.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return response.status(401).send({ error: 'Unauthorized' });

    const user = await (await dbClient.usersCollection('users')).findOne({ _id: ObjectId(redisToken) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });
    delete user.password;

    return response.status(200).send({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
