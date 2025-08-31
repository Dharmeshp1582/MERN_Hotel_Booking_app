import express from 'express'
import { protect } from '../middleware/auth.middleware'
import { getUserData } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.get('/',protect,getUserData)

export default userRouter;