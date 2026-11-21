import { Router } from "express";
import { BenchmarkController } from "./benchmark.controller";

const router = Router();

router.get("/suites", BenchmarkController.getSuites);
router.get("/agents", BenchmarkController.getAgents);
router.post("/agents", BenchmarkController.registerAgent);
router.post("/run", BenchmarkController.createRun);
router.get("/runs", BenchmarkController.getRuns);
router.get("/runs/:id", BenchmarkController.getRunById);
router.get("/leaderboard", BenchmarkController.getLeaderboard);

export default router;
