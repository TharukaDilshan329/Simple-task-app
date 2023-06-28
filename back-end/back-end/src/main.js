"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cors_1.default)());
let pool;
initPool();
function initPool() {
    return __awaiter(this, void 0, void 0, function* () {
        pool = yield promise_mysql_1.default.createPool({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '1234',
            database: 'dep10_simple_task_app',
            connectionLimit: 5
        });
    });
}
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield pool.query('SELECT * FROM task');
    res.json(tasks);
}));
app.use((0, express_1.json)());
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const task = req.body;
    if (!((_a = task.description) === null || _a === void 0 ? void 0 : _a.trim())) {
        res.sendStatus(400);
    }
    const result = yield pool.query("INSERT INTO task(description, status) VALUES (?,DEFAULT)", [task.description]);
    task.id = result.insertId;
    task.status = "NOT_COMPLETED";
    res.status(201).json(task);
}));
router.delete("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("DELETE FROM task WHERE id=?", [req.params.taskId]);
    res.sendStatus(result.affectedRows ? 204 : 404);
}));
router.patch("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.body;
    task.id = +req.params.taskId;
    if (!task.status) {
        res.sendStatus(400);
        return;
    }
    const result = yield pool.query("UPDATE task SET status=? WHERE id=?", [task.status, task.id]);
    res.sendStatus(result.affectedRows ? 204 : 404);
}));
app.use("/app/api/v1/tasks", router);
app.listen(8080, () => { console.log("Server has been started at 8080"); });
