import dotenv from 'dotenv';
import getBDInstance from './modules/database';

dotenv.config();

(async () => {
  const db = await getBDInstance(true, true);
  await db.close();
})();
