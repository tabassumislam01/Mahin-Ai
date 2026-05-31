require('dotenv').config();
const { connectDb } = require('../src/config/db');
const User = require('../src/models/User');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');

async function run() {
  await connectDb();
  await Promise.all([User.syncIndexes(), Conversation.syncIndexes(), Message.syncIndexes()]);
  console.log('Indexes synchronized');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
