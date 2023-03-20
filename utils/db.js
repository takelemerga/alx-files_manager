import mongodb from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dataBaseName = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    // Create Instance of MongoClient for mongodb
    this.mgClient = mongodb.MongoClient;
    // client returned
    this.mgClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        return console.error(err);
      }
      this.database = client.db(dataBaseName);
      return this.database;
    });
  }

  isAlive() {
    if (this.database) return true;
    return false;
  }

  /**
   * Retrieves the number of users in the database.
   */
  async nbUsers() {
    try {
      return this.database.collection('users').countDocuments();
    } catch (error) {
      console.log('that did not go well');
      return null;
    }
  }

  /**
   * Retrieves a reference to the `users` collection.
   * @returns {Promise<Collection>}
   */
  async usersCollection() {
    return this.database.collection('users');
  }

  /**
   * Retrieves a reference to the `files` collection.
   * @returns {Promise<Collection>}
   */
  async filesCollection() {
    return this.database.collection('files');
  }

  /**
   * Retrieves the number of files in the database.
   */
  async nbFiles() {
    try {
      return this.database.collection('files').countDocuments();
    } catch (error) {
      console.log('that did not go well');
      return null;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
