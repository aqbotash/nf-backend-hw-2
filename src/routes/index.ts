import express from "express";
import Router from "express";
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import messageRoute from "./messageRoute";

const router = Router();
const routes = (app: express.Application) => {
    router.use("/auth", authRoute);
    console.log("Auth routes added");
    router.use("/user", userRoute);
    console.log("User routes added");
    router.use("/message", messageRoute);
    console.log("Message routes added");

  return app.use("/api", router);
};

export default routes;