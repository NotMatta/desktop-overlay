import { Router } from 'express';
import networkRoute from './networkRoute.ts';

const router = Router();
router.use('/network', networkRoute);

router.get('/', (req, res) => {
  res.send('API is working!');
});

export default router;
