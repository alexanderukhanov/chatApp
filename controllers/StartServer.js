const mongoose = require('mongoose');
require('dotenv').config();

async function StartServer(server) {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jqqzs.mongodb.net/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );

    server.listen(3001, () => console.log('Server is running...'));
  } catch (e) {
    console.log(e);
  }
}

module.exports = StartServer;
