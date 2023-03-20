import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authorization = req.header('Authorization') || null;
    if (!authorization) return res.status(401).send({ error: 'Unauthorized' });

    const basicCredentials = authorization.split(' ')[1];
    if (!basicCredentials) return res.status(401).send({ error: 'Unauthorized' });

    const decodeCredentials = Buffer.from(basicCredentials, 'base64');

    const [email, password] = decodeCredentials.toString('utf-8').split(':');

    if (!email || !password) return res.status(401).send({ error: 'Unauthorized' });

    const passwordSha1 = sha1(password);
    const credentials = {
      email,
      password: passwordSha1,
    };

    const user = await (await DBClient.usersCollection('users')).findOne(credentials);
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const token = uuidv4();
    const key = `auth_${token}`;
    const hoursForExpiration = 24;

    await RedisClient.set(key, user._id.toString(), hoursForExpiration * 3600);

    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token') || null;
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

    await RedisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

module.exports = AuthController;
