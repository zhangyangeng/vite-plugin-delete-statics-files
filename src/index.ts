import { type Plugin, normalizePath } from 'vite';

import path from 'path';
import { Options } from './types/Options';
import { DirUtils } from './utils/DirUtils';
import { FileUtils } from './utils/FileUtils';

let outPut = '';

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
                dirPath = DirUtils.getAllDir(outPut);
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
                    FileUtils.deleteSpecifiedFile(dirPath, tempFileName);
                } else {
                    dirPath.forEach((fp) => {
                        FileUtils.deleteSpecifiedFile(fp, tempFileName);
                    });
                }
            }
        },
    };
}
