"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const _ = require('lodash');
const index_1 = require("../const/index");
exports.default = {
    getProjectRootPath(doc) {
        const filePath = doc.uri.fsPath;
        const fileArr = filePath.split('/');
        let rootPath = filePath;
        while (fileArr.length) {
            fileArr.pop();
            const nowPath = fileArr.join('/');
            if (fs.existsSync(nowPath + '/package.json')) {
                rootPath = nowPath;
                break;
            }
        }
        return rootPath;
    },
    getModules(modulePath, target, projectName = '') {
        if (!fs.existsSync(modulePath))
            return {};
        const modules = fs.readdirSync(modulePath);
        if (!Array.isArray(modules))
            return false;
        modules.forEach(path => {
            let nowFile = fs.statSync(`${modulePath}/${path}`);
            if (nowFile.isDirectory()) {
                projectName = projectName ? projectName + '_' + _.camelCase(path) : _.camelCase(path);
                this.getModules(`${modulePath}/${path}`, target, projectName);
                projectName = '';
            }
            else {
                const fileType = path.substring(path.lastIndexOf('.') + 1);
                let moduleName = path.replace(/^(.*)\.\w+$/, '$1');
                moduleName = projectName ? projectName + '_' + _.camelCase(moduleName) : _.camelCase(moduleName);
                moduleName = _.camelCase(moduleName);
                projectName = '';
                if (fileType === 'js') {
                    const filePath = `${modulePath}/${path}`;
                    const data = fs.readFileSync(filePath).toString();
                    let apis;
                    try {
                        apis = this.getApis(data);
                    }
                    catch (error) {
                        apis = [];
                    }
                    target[moduleName] = apis;
                }
                else if (fileType === 'json') {
                    const data = require(`${modulePath}/${path}`);
                    target[moduleName] = data.length && data.map((api) => {
                        const { apiName, apiRequestType, apiURI, apiNoteRaw, } = api.baseInfo;
                        const urlArr = apiURI.split('/');
                        const name = index_1.eolinkerType[apiRequestType] + '_' + urlArr[urlArr.length - 1];
                        return {
                            name: _.camelCase(name),
                            desc: apiName || apiNoteRaw || 'http-hub'
                        };
                    });
                }
            }
        });
        return target;
    },
    getApis(dataStr) {
        const strArr = dataStr.split('');
        let start = 0; // ????????????
        let end = strArr.length - 1; // ????????????
        while (start < end) {
            if (strArr[start] != '[') {
                start++;
            }
            if (strArr[end] != ']') {
                end--;
            }
            if (strArr[start] === '[' && strArr[end] === ']') {
                break;
            }
        }
        let targetStr = dataStr.slice(start, end + 1).replace(/[\r\n]/g, "");
        const apis = eval('(' + targetStr + ')');
        if (Array.isArray(apis)) {
            return apis.map(api => {
                return {
                    name: api.name,
                    desc: api.desc || 'http-hub'
                };
            });
        }
        else {
            return [];
        }
    }
};
