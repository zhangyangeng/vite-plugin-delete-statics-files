import { type Plugin, normalizePath } from 'vite';

import fs from 'fs';
import path from 'path';

/**
 * 配置信息
 */
export interface Options {
    // 待删文件名，支持正则表达式
    fileName: string[];
    // 静态资源目录下文件所属文件夹路径，不填则默认在静态资源根路径及所有子路径下寻找
    dir?: string;
    // 待删文件名是否为正则表达式
    isRegExp?: boolean;
}

let outPut = '';

/**
 * 删除指定文件
 *
 * @param {string} dirPath 文件路径
 * @param {string | RegExp} fileName 文件名
 */
function deleteSpecifiedFile(dirPath: string, fileName: string[] | RegExp[]): void {
    fs.readdirSync(dirPath).forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isFile()) {
            fileName.forEach((fn: string | RegExp) => {
                if (typeof fn === 'string' && file === fn) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted file: ${fullPath}`);
                } else if (typeof fn === 'object' && (fn as RegExp).test(file)) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted file: ${fullPath}`);
                }
            });
        }
    });
}

/**
 * 转换为正则表达式
 *
 * @param {string[] | string} fileName 文件名
 * @returns {RegExp[] | RegExp} 转换后的正则表达式
 */
function transformToRegExp(fileName: string[]): RegExp[] {
    const arr: RegExp[] = [];
    try {
        fileName.forEach((f) => arr.push(new RegExp(f)));
        return arr;
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * 获取静态资源中的所有文件夹路径
 *
 * @param {string} rootPath 根路径
 * @returns {string[]} 所有的文件夹路径
 */
function getAllDir(rootPath: string): string[] {
    const dirs: string[] = [];

    /**
     * 遍历文件夹
     *
     * @param {string} folderPath 当前文件夹路径
     */
    function traverseFolder(folderPath: string): void {
        const folderContents = fs.readdirSync(folderPath);
        folderContents.forEach((item) => {
            const fullPath = path.join(folderPath, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                dirs.push(normalizePath(fullPath));
                traverseFolder(fullPath);
            }
        });
    }

    traverseFolder(rootPath);
    return dirs;
}

/**
 * 删除静态资源中的指定文件
 *
 * @param {Options} options 配置项
 * @returns {Plugin} 插件配置
 */
export function deleteStaticsFile(options: Options): Plugin {
    return {
        name: 'vite-plugin-delete-statics-file',
        apply: 'build',
        config(config): void {
            // 获取用户设置构建路径
            outPut = config.build ? config.build.outDir ?? 'dist' : 'dist';
        },
        closeBundle(): void {
            const { dir, fileName, isRegExp } = options;
            let tempFileName: string[] | RegExp[] = [];
            let dirPath: string | string[];
            // 用户是否指定文件夹
            if (dir) {
                dirPath = normalizePath(path.join(outPut, dir));
            } else {
                dirPath = getAllDir(outPut);
            }
            // 文件名是否为正则表达式
            if (isRegExp) {
                tempFileName = transformToRegExp(fileName);
            } else {
                tempFileName = fileName;
            }
            // 删除指定路径下的指定文件名
            if (tempFileName.length) {
                if (typeof dirPath === 'string') {
                    deleteSpecifiedFile(dirPath, tempFileName);
                } else {
                    dirPath.forEach((fp) => {
                        deleteSpecifiedFile(fp, tempFileName);
                    });
                }
            }
        },
    };
}
