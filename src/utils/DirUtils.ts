import fs from 'fs';
import path from 'path';
import { normalizePath } from 'vite';

/**
 * 文件夹工具类
 */
export class DirUtils {
    /**
     * 获取静态资源中的所有文件夹路径
     *
     * @param {string} rootPath 根路径
     * @returns {string[]} 所有的文件夹路径
     */
    public static getAllDir(rootPath: string): string[] {
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
}