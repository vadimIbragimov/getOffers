import express from 'express';
import cors from 'cors';
import { ControllerTasksQueue, ControllerTasksQueueTypes } from './ControllerTasksQueue';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 8080;
const queue = new ControllerTasksQueue();

app.use(cors());
app.use(bodyParser.json());

app.post('/addTasks', (req, res) => {
	console.log(req.body);
	const task: ControllerTasksQueueTypes.Task = req.body;
	if (task) {
		res.send({id: queue.add(task).toString()})
	} else res.status(505).send('Request body is not issignable to Type Task')
});

app.get('/getNextTask', (_, res) => {
	const task = queue.startNext();
	if (task) {
		res.send({
			id: task.id.toString(),
			taskBody: task.taskBody,
		});
	} else res.status(501).send('Queue is emty');
});

app.post('/doneTask', (req, res) => {
	const response: {
		id: bigint;
		result?: any;
	} | null = req.body.id && !isNaN(req.body.id) ? { id: BigInt(req.body.id), result: req.body.result } : null;
	if (response !== null) {
		const task = queue.done(response.id, response.result);
		res.send();
		// тут нужно будет отправить уведомление по сокету об успешном выполнении
	} else res.status(502).send('Can not parse response');
});

app.post('/getDoneTask', (req, res) => {
	const id: bigint | null = req.body.id && !isNaN(req.body.id) ? BigInt(req.body.id) : null;
	if(id !== null){
		const result = queue.getResult(id);
		res.send(result);
	} else res.status(503).send('error: Failed parse id')
})

app.post('/errorTask', (req, res) => {
	const id: bigint | null = req.body && !isNaN(req.body) ? BigInt(req.body) : null;
	if(id !== null){
		const result = queue.getResult(id);
		res.send(result);
	}
})

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});
