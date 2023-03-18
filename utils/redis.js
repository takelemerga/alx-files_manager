import redis from 'redis';
import { promisify } from 'util';

const RdsClient = class RedisClient {
  Constructor() {
    this.client = redis.createClient();
    this.connected = true;
    this.client.on('connect', () => {
      this.connected = true;
    });
    this.client.on('error', (err) => {
      this.connected = false;
      console.log(`Redis client not connected to the server: ${err.message}`);
    });
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const getValue = await promisify(this.client.get).bind(this.client);
    return await getValue(key);
  }

  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  // delete function
  async del(key) {
    this.client.del(key);
  }
};

const redisClient = new RdsClient();
module.exports = redisClient;
