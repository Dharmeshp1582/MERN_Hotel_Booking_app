import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { getUserData, storeSearchedCities } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/',protect,getUserData)
userRouter.post('/store-recent-search',protect,storeSearchedCities)

export default userRouter;