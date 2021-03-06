import { path } from 'app-root-path';
import request from 'request';
import { SwaggerParser, CONTAINER } from './SwaggerParser';
import { TSWriter } from './TSWriter';

const SWAGGER = 'https://www.bitmex.com/api/explorer/swagger.json';

const outputClass = path + '/src/api/BitmexAPI.ts';
const outputInterfaces = path + '/src/common/BitmexInterfaces.ts';

const HEADER = `
    /** THIS FILE IS AUTOMATICALLY GENERATED FROM : ${ SWAGGER } **/

    // tslint:disable:max-line-length`;

request.get(SWAGGER, async (err, _res, body) => {
    // tslint:disable-next-line:no-console
    if (err) { return console.log(err); }
    const data = JSON.parse(body);
    const swagger = new SwaggerParser(data);

    await TSWriter(outputInterfaces, `
    ${HEADER}
    ${ swagger.createInterfaces() }
    `);

    await TSWriter(outputClass, `
    ${HEADER}
    import { BitmexAbstractAPI } from './BitmexAbstractAPI';
    import * as ${CONTAINER} from '../common/BitmexInterfaces';
    export class BitmexAPI extends BitmexAbstractAPI {
    ${ swagger.createClass() }
    }`);
});
