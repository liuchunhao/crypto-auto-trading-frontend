# Crypto Auto Trading Frontend
A React application for auto-trading with Exness & Binance exchange

## Table of Contents
  - [Installation Nvm \& Node](#installation-nvm--node)
  - [Create new vite project](#create-new-vite-project)
  - [Run Dev Server](#run-dev-server)
  - [Add dependencies in package.json](#add-dependencies-in-packagejson)
  - [Add reset-css instead of normalize.css](#add-reset-css-instead-of-normalizecss)
  - [Add sass support](#add-sass-support)
  - [Configure vite.config.ts to set up path alias](#configure-viteconfigts-to-set-up-path-alias)
  - [Configure tsconfig.json to set up 'auto prompt' for path alias '@'](#configure-tsconfigjson-to-set-up-auto-prompt-for-path-alias-)
  - [Add Ant Design of React](#add-ant-design-of-react)
  - [Add Ant Design of React Icons](#add-ant-design-of-react-icons)
  - [Import Ant Design of React](#import-ant-design-of-react)
  - [Install vite-plugin-style-import](#install-vite-plugin-style-import)
    - [vite-plugin-style-import: to import Ant Design of React css *on demand*](#vite-plugin-style-import-to-import-ant-design-of-react-css-on-demand)
    - [-D: to add it as a 'devDependencies' in package.json](#-d-to-add-it-as-a-devdependencies-in-packagejson)
    - [configure vite.config.ts to use vite-plugin-style-import](#configure-viteconfigts-to-use-vite-plugin-style-import)

## Installation Nvm & Node
```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
$ source ~/.bashrc

$ nvm -v
0.39.7
$ nvm ls

$ nvm install 19.6.0

$ nvm alias default 19.6.0

$ nvm use stable
$ nvm use default
v19.6.0

$ node -v
v19.6.0

$ npm -v
9.6.4
```

## Create new vite project
```bash
$ npm init vite
> project name? lege-management

# change directory to your app
$ cd lege-management   

# install dependencies
$ npm install          

# save into package.json
$ npm install <package-name> [--save-prod]

# save into package.json
$ npm install axios@1.0.0 --save  
```

## Run Dev Server
```bash
$ npm run dev          # run dev server
```

## Add dependencies in package.json
```json
{
  "name": "lege-management",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    // --host: to expose the server to other devices on the network
    // --open: to open the browser automatically
    // $ npm run dev  # to run the dev server

    "dev": "vite --host --port 3000 --open",        
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {                 
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "8.1.3",         // state management
    "react-router-dom": "^6.2.1",   // routing
    "redux": "^4.1.2"               // state management
  },
  "devDependencies": {              
    // required only for developement and not for production
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

## Add reset-css instead of normalize.css
> include reset-css in main.tsx
```bash
$ npm i reset-css --save
```

## Add sass support
> --save-dev 
```bash
# to add it as a 'devDependencies' in package.json
npm install --save-dev sass
```

## Configure vite.config.ts to set up path alias 
```ts

```

## Configure tsconfig.json to set up 'auto prompt' for path alias '@'
```json
{
  "compilerOptions": {
    ...
    "baseUrl": "./",
    "paths": {
        "@/*": [ 
            "src/*"
        ]
    }
  }
}
```

## Add Ant Design of React
```bash
npm install antd --save
or 
yarn add antd
```

## Add Ant Design of React Icons
```bash
npm install @ant-design/icons --save
yarn add @ant-design/icons
```

## Import Ant Design of React
```ts
import { Button } from 'antd';
import { FastBackwardOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
```

## Install vite-plugin-style-import
### vite-plugin-style-import: to import Ant Design of React css *on demand* 
### -D: to add it as a 'devDependencies' in package.json
```bash
npm install vite-plugin-style-import@1.4.1 -D
npm i less@2.7.1 -D
```
### configure vite.config.ts to use vite-plugin-style-import
```ts
import styleImport, {AntdResolve} from 'vite-plugin-style-import';

```

