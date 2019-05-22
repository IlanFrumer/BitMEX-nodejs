"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTAINER = 'BITMEX';
const toEntries = (obj) => Object.keys(obj).map(key => [key, obj[key]]);
const titleCase = (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
const eTitleCase = (text) => text.replace(/\/(\w)/g, (a, w) => titleCase(w));
const normalizeDefinition = (text) => text.replace('#/definitions/', '').replace('x-any', 'any');
const enumMapper = (d) => `'${d.trim()}'`;
const commentSeperator = (text) => (text || '').split('\n').map(line => line.trim()).map(line => line ? ' * ' + line : ' *');
const descriptionEnumRegexps = [
    /Available options: \[(.+?)\]/,
    /Valid options: (.+?)\./,
    /Options: ((["'`])\w+\2(?:,\s*\2\w+\2)*)/
];
class SwaggerParser {
    constructor(data) {
        this.data = data;
        this.pathesMap = new Map();
        this.parametersMap = new Map();
        this.definitionsMap = new Map();
        this.definitionsDescMap = new Map();
        for (const [name, item] of toEntries(data.definitions)) {
            // TODO: use item.required
            this.definitionsDescMap.set(name, item.description);
            for (const [prop, def] of toEntries(item.properties)) {
                let arg = 'any';
                switch (def.type) {
                    case 'string':
                        arg = def.enum ? def.enum.map(enumMapper).join(' | ') : 'string';
                        break;
                    case 'number':
                    case 'boolean':
                        arg = def.type;
                        break;
                    case 'array':
                        arg = `${def.items.$ref ? normalizeDefinition(def.items.$ref) : def.items.type}[]`;
                        break;
                    case 'object':
                        arg = 'any';
                        break;
                    default:
                        arg = def.$ref ? normalizeDefinition(def.$ref) : 'any';
                }
                let row = `${prop}: ${arg};`;
                const comments = [];
                if (def.format) {
                    comments.push(`format: ${def.format}`);
                }
                if (def.maxLength) {
                    comments.push(`maxLength: ${def.maxLength}`);
                }
                if (def.default) {
                    comments.push(`default: ${typeof def.default === 'object' ? JSON.stringify(def.default) : def.default}`);
                }
                if (comments.length) {
                    row += ' // ' + comments.join(', ');
                }
                const arr = this.definitionsMap.get(name) || [];
                arr.push(row);
                this.definitionsMap.set(name, arr);
            }
        }
        for (const [path, methods] of toEntries(data.paths)) {
            for (let [method, def] of toEntries(methods)) {
                if (def.deprecated) {
                    continue;
                }
                // TODO: use def.Tags
                const authorized = typeof def.security === 'undefined';
                const [type, name] = def.operationId.split('.');
                const responseType = this.getResponseType(def.responses);
                const [arg, opts] = this.iterateParameters(def.parameters, path, method);
                const authorizedArg = authorized ? ', true' : '';
                method = method.toUpperCase();
                const desc = ((def.summary || '') + (def.description || '')).trim();
                const arr = this.pathesMap.get(type) || [];
                arr.push('');
                arr.push(`/**`);
                if (authorized) {
                    arr.push(' * @Authorized');
                }
                commentSeperator(desc).forEach(line => arr.push(line));
                arr.push(` */`);
                arr.push(`${name}: async (${arg}) => `);
                arr.push(`  this.request<${responseType}>('${method}', '${path}', ${opts}${authorizedArg}),`);
                this.pathesMap.set(type, arr);
            }
        }
    }
    getResponseType(responses) {
        let responseType = 'any';
        for (const [status, res] of toEntries(responses)) {
            if (status !== '200') {
                continue;
            }
            switch (res.schema.type) {
                case 'array':
                    responseType = exports.CONTAINER + '.' + normalizeDefinition(res.schema.items.$ref) + '[]';
                    break;
                case 'object':
                    if (res.schema.properties) {
                        responseType = '{' + Object
                            .keys(res.schema.properties)
                            .map((key) => `${key}: ${res.schema.properties[key].type};`)
                            .join(' ') + '}';
                    }
                    break;
                case 'string':
                    responseType = 'string';
                    break;
                case 'boolean':
                case 'number':
                    responseType = res.schema.type;
                    break;
                default:
                    responseType = res.schema.$ref ? exports.CONTAINER + '.' + normalizeDefinition(res.schema.$ref) : responseType;
            }
        }
        return responseType;
    }
    iterateParameters(parameters, path, method) {
        let arg = '';
        let opts = '';
        let argRequried = false;
        const title = eTitleCase(path);
        for (const p of parameters) {
            let key;
            if (p.in === 'formData') {
                key = `${title}${titleCase(method)}`;
                opts = 'form';
                arg = `${exports.CONTAINER}.${key}`;
            }
            else if (p.in === 'query') {
                key = `${title}Query`;
                opts = 'qs';
                arg = `${exports.CONTAINER}.${key}`;
            }
            else {
                throw new Error(`unknown parameter: ${p.in}`);
            }
            const comment = typeof p.default !== 'undefined' ? ` // DEFAULT: ${p.default}` : '';
            const required = (p.required && typeof p.default === 'undefined');
            argRequried = argRequried || required;
            const pArray = this.parametersMap.get(key) || [];
            let type = p.type;
            if (p.description) {
                for (const regex of descriptionEnumRegexps) {
                    const match = p.description.match(regex);
                    if (match) {
                        type = match[1].replace(/['`"]/g, '').split(',').map(enumMapper).join(' | ');
                        break;
                    }
                }
            }
            pArray.push('');
            if (p.description) {
                pArray.push(`/**`);
                commentSeperator(p.description).forEach(line => pArray.push(line));
                pArray.push(` */`);
            }
            pArray.push(`${p.name}${required ? '' : '?'}: ${type};${comment}`);
            this.parametersMap.set(key, pArray);
        }
        arg = arg ? `${opts}: ${arg}${(argRequried ? '' : ' = {}')}` : '';
        opts = `{${opts}}`;
        return [arg, opts];
    }
    createInterfaces() {
        const interfacesBody = [];
        for (const [type, rows] of this.definitionsMap.entries()) {
            const desc = this.definitionsDescMap.get(type);
            interfacesBody.push('');
            if (desc) {
                interfacesBody.push(`/**`);
                commentSeperator(desc).forEach(line => interfacesBody.push(line));
                interfacesBody.push(` */`);
            }
            interfacesBody.push(`export interface ${type} {`);
            rows.forEach(row => interfacesBody.push(row));
            interfacesBody.push('}');
        }
        for (const [type, lines] of this.parametersMap.entries()) {
            interfacesBody.push('');
            interfacesBody.push(`export interface ${type} {`);
            lines.forEach(line => interfacesBody.push(line));
            interfacesBody.push('}');
        }
        return interfacesBody.join('\n');
    }
    createClass() {
        const classBody = [];
        classBody.push(`readonly basePath = '${this.data.basePath}';`);
        for (const [type, lines] of this.pathesMap.entries()) {
            classBody.push('');
            classBody.push(`public ${type} = {`);
            lines.forEach(line => classBody.push(line));
            classBody.push('};');
        }
        return classBody.join('\n');
    }
}
exports.SwaggerParser = SwaggerParser;
