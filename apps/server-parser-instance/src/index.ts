import { Logger } from '@go/server-shared-components';
import { Task } from './ParserInstanceEngine/types';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import beautify from 'json-beautify';

import { ControllerCommunicationModule } from './ControllerCommunicationModule';
import { ParserInstanceEngine } from './ParserInstanceEngine';

const argv = yargs(hideBin(process.argv)).argv;

Logger.init({
	fileOptions: {
		addStartTimeToFileName: true,
		path: ''
	}
});

type TaskFromController = {
	id: string;
	taskBody: Task;
};

const engine = new ParserInstanceEngine();
const controller = new ControllerCommunicationModule(argv.controllerAddress as string || 'http://localhost:8080/');
const TRYING_INTERVAL = 1000 * 60 * 10;

const pause = (time: number) => new Promise<void>(resolve => setTimeout(() => resolve(), time));

const subscribe = async () => {
	let freeStreams = await engine.freeStreams();
	let tryCount = freeStreams * 3;

	const execTask = async (task: TaskFromController) => {
		try {
			Logger.trace(`Task ${task.id} taked to execution`);
			const result = await engine.exec({ ...task.taskBody });
			Logger.trace(`Task ${task.id} execution complete`);
			controller.doneTask(task.id, result!);
			Logger.trace(`Task ${task.id}: result sended`);
		} catch (e) {
			Logger.error(e);
			await controller.errorTask(task.id);
		}
		addTask();
	}

	const addTask = async () => {
		const task = (await controller.getTask()) as TaskFromController;
		Logger.trace('Task added');
		Logger.trace(beautify(task, [], 2, 100));
		void execTask(task)
	};

	while (freeStreams && tryCount) {
		try {
			await addTask()
			freeStreams--;
		} catch (e) {
			Logger.error(e)
			tryCount--;
			await pause(TRYING_INTERVAL);
		}
	}

	engine.onEmtyQueue = () => {
		const interval = setInterval(() => {
			addTask()
				.then(() => clearInterval(interval))
				.catch((e) => Logger.error(e))
		}, TRYING_INTERVAL);
	};
};

subscribe();