import express from 'express';
import {addtocartController, getcartController, emptycartController} from "../controller/cartController.js"

const router = express.Router();
router.post('/addtocart', addtocartController);
router.post('/getcart', getcartController);
router.post('/emptycart', emptycartController);

export default router;