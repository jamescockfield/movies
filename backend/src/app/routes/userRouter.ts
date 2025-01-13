import express from 'express';
import { User } from '../../database/model/User';
import { validateRequest } from '../validation/validationMiddleware';
import { userSchema } from '../validation/schema/user';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await User.findOne({ id: userId });
    
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json(user);
});

router.post('/', validateRequest(userSchema), async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
});

export { router as userRouter };