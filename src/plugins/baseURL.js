let baseURL = "";
console.log(process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
    case 'dev':
        baseURL = "http://localhost:8088/"; //开发环境url
        break;
    case 'serve':
        baseURL = "http://localhost:8089/"; //生产环境url
        break;
}

export default baseURL;