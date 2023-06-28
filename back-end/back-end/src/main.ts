import express, {json} from 'express';
import mysql, {Pool} from 'promise-mysql';
import cors from 'cors';


const app = express();
const router =express.Router();
app.use(cors());


let pool:Pool

initPool();
async function initPool(){
    pool = await mysql.createPool({
        host:'localhost',
        port:3306,
        user:'root',
        password:'1234',
        database:'dep10_simple_task_app',
        connectionLimit:5
    });
}

type Task = {
    id:number,
    description:string,
    status:'COMPLETED' | 'NOT_COMPLETED' | undefined
}

router.get("/",async (req, res) => {
    console.log("get working");
    const tasks =  await pool.query('SELECT * FROM task');
    res.json(tasks);
});

app.use(json())

router.post("/",async (req, res) => {
    const task = req.body as Task;
    if (!task.description?.trim()) {
        res.sendStatus(400);
    }
    const result = await pool.query("INSERT INTO task(description, status) VALUES (?,DEFAULT)", [task.description]);
    task.id =result.insertId;
    task.status="NOT_COMPLETED";

    res.status(201).json(task);

});

router.delete("/:taskId",async (req, res) => {
    const result = await pool.query("DELETE FROM task WHERE id=?",[req.params.taskId]);
    res.sendStatus(result.affectedRows ? 204:404);
});

router.patch("/:taskId",async (req, res) => {
    const task = (req.body as Task);
    task.id = +req.params.taskId;
    if (!task.status) {
        res.sendStatus(400);
        return;
    }

    const result = await pool.query("UPDATE task SET status=? WHERE id=?", [task.status, task.id]);

    res.sendStatus(result.affectedRows?204:404);
})


app.use("/app/api/v1/tasks",router);
app.listen(8080,()=>{console.log("Server has been started at 8080")})