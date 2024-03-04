# vite-plugin-delete-statics-files

## 安装

安装该插件到你的项目中
```shell
npm install --save-dev vite-plugin-delete-statics-files
```

## 使用

在 Vite 的配置文件中使用该插件:
```ts
import { deleteStaticsFile, type Options } from 'vite-plugin-delete-statics-files';
export default defineConfig({
    plugins: [
        deleteStaticsFile({
            fileName: ['^monaco-delete.*\\.js$'],
        } as Options),
    ],
});
```

## 配置项

该插件支持以下三个配置项，可根据需要自行配置

|           字段            |           类型            |           描述            |
|           :--:            |           :--:            |           :--:            |
|           dir             |           string          |       待删文件所处文件夹，不填时则从静态资源根路径下逐层查找      |
|           fileName        |           string[]        |       待删文件名，支持删除多个文件；支持正则表达式，但需开启 isRegExp 配置        |
|           isRegExp        |           boolean         |       待删文件名是否为正则表达式，若开启时则根据正则表达式查找符合规则的文件      |