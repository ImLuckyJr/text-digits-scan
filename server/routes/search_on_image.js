const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

async function storeBase64(fileObject) {
	const nanoTime = process.hrtime();
	const publicPath = `public/files`;
	const filename = `${nanoTime[0].toString()}_${nanoTime[1].toString()}.png`;
	let filePath = `${publicPath}/${filename}`;
	let status = 'ERROR';
	const base64Data = fileObject.data.replace(/^data:image\/png;base64,/, "");

	try {
		await fs.promises.mkdir(publicPath, { recursive: true });
		await fs.promises.writeFile(filePath, base64Data, fileObject.encode);

		status = 'OK';
	} catch (e) {
		console.log('STORE FILES ERROR');
		console.log(e.stack || e);
	}

	return { status, filePath };
}

function textByMLFromImage(data, typeToPython) {
	return new Promise(async (resolve, reject) => {
		let pythonParams;

		if (typeToPython === 'base64') {
			pythonParams = [ '-u', path.join(__dirname, '../../python/main.py'), '-b64', data ];
		} else {
			pythonParams = [ '-u', path.join(__dirname, '../../python/main.py'), '-p', data ];
		}

		const pyProg = spawn('python', pythonParams);

		pyProg.stdout.on('data', function (data) {
			resolve({ status: 'OK', data: data.toString() });
		});

		pyProg.stderr.on('data', function (data) {
			console.log('stderr: ' + data);

			reject({ status: 'ERROR' });
		});
	});
}

module.exports = (fastify, opts, next) => {
	fastify.route({
		method: 'POST',
		url:    '/predict',
		schema: {
			body: {
				type:       'object',
				properties: {
					data: { type: 'string' }
				},
				required:   [ 'data' ]
			}
		},
		async handler(request, reply) {
			let filePath = null;
			let typeToPython = 'base64';

			if (request.body.saveToFile) {
				const res = await storeBase64({ encode: 'base64', data: request.body.data });

				if (res.status) {
					filePath = res.filePath;
					typeToPython = 'filepath';
				}
			}

			const result = await textByMLFromImage(filePath || request.body.data, typeToPython);

			if (result.status === 'OK') {
				reply.code(200);
				reply.send({ status: result.status, message: 'Изображение успешно обработано', data: result.data });
			} else {
				reply.code(400);
				reply.send({ status: result.status, message: 'При обработке изображения произошла ошибка' });
			}
		}
	});

	next();
};
