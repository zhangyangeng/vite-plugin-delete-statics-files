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