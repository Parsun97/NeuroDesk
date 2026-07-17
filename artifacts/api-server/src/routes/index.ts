import { Router, type IRouter } from "express";
import chatbotsRouter from "./chatbots";
import statsRouter from "./stats";
import plansRouter from "./plans";
import openaiRouter from "./openai";
import widgetRouter from "./widget";

const router: IRouter = Router();

router.use(chatbotsRouter);
router.use(statsRouter);
router.use(plansRouter);
router.use(openaiRouter);
router.use(widgetRouter);

export default router;
