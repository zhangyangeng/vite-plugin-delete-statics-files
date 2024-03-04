import fs from 'fs';
import path from 'path';

/**
 * 文件工具类
 */
export class FileUtils {
    /**
     * 删除指定文件
     *
     * @param {string} dirPath 文件路径
     * @param {string | RegExp} fileName 文件名
     */
    public static deleteSpecifiedFile(dirPath: string, fileName: string[] | RegExp[]): void {
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
}