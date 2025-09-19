import express from 'express';
import { sendMessage ,getContacts, getMessagesByUserId,getChatPartners} from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection,protectRoute) //applying arcjet protection and protect route middleware to all message routes

router.get('/contacts',getContacts)
router.get('/chats',getChatPartners)
router.get('/:id',getMessagesByUserId)
router.post('/send/:id',sendMessage)

export default router;