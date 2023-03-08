//const { MongoClient } = require('mongodb')
import mongodb from 'mongodb';

class DBClient{
  constructor(){
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dataBaseName = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${this.host}:${this.port}`;

    // Create Instance of MongoClient for mongodb
    const mgClient =  mongodb.MongoClient;
    //client returned
    mgClient.connect(url, (err, client) => {
      if(err) {
        return console.error(err);
      }
      const database = client.db(dataBaseName);
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
    return this.database.collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   */
  async nbFiles() {
    return this.database.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
