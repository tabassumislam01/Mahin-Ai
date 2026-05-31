require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDb } = require('../src/config/db');
const User = require('../src/models/User');

async function run() {
  await connectDb();

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@mahin.app';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Seed admin already exists');
    process.exit(0);
  }

  await User.create({
    name: 'Admin',
    email,
    role: 'admin',
    passwordHash: await bcrypt.hash(password, 12),
  });

  console.log('Seed admin created:', email);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
