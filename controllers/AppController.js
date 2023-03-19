import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * return if Redis is alive and if the DB is alive too
   * by using the 2 utils created previously:
   * { "redis": true, "db": true } with a status code 200
   */
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.status(200).json({ redis: true, db: true });
    }
  }

  /**
   * should return the number of users and files in DB:
   * { "users": 12, "files": 1231 }
   *  with a status code 200
   */
  static async getStats(req, res) {
    const files = await dbClient.nbFiles();
    const users = await dbClient.nbUsers();
    res.status(200).json({ users, files });
  }
}

module.exports = AppController;
