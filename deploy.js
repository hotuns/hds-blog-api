//  deploy.js
// ora   // 一个进度条插件 让等待不在无聊的插件
// zip-local   // 压缩文件的插件 用来压缩打包好的静态文件
// shelljs   // 用来在代码中执行命令行操作
// chalk   // 用于控制台带颜色的输出 告别纯白字体
// inquirer   // 用于命令行交互 使脚本更灵活
// node-ssh   // 用来连接服务器

const fs = require("fs");
const path = require("path");
const ora = require("ora");
const shell = require("shelljs");
const chalk = require("chalk");
const CONFIG = require(path.resolve(process.cwd(), "./deploy.config.js"));
const inquirer = require("inquirer");
const NodeSSH = require("node-ssh").NodeSSH;
const SSH = new NodeSSH();
const errorLog = (error) => console.log(chalk.red(`---------------> ${error}`));
const defaultLog = (log) => console.log(chalk.blue(`---------------> ${log}`));
const successLog = (log) => console.log(chalk.green(`---------------> ${log}`));
// 文件夹位置

// 打包 npm run build
const compileDist = async () => {
  // 进入本地文件夹
  shell.cd(path.resolve(process.cwd(), "./"));
  shell.exec(CONFIG.SCRIPT || "npm run build");
  successLog("编译完成");
};

// ********* 执行线上文件夹指令 *********
const runCommond = async (commond) => {
  const result = await SSH.exec(commond, [], { cwd: CONFIG.PATH });

  console.log(chalk.yellow(result));
};
const COMMONDS = CONFIG.COMMONDS || [];
// ********* 执行线上文件夹指令 *********
const runAfterCommand = async () => {
  defaultLog("执行命令");
  for (let i = 0; i < COMMONDS.length; i++) {
    await runCommond(COMMONDS[i]);
  }
};

// ********* 通过ssh 上传文件到服务器 *********
const uploadZipBySSH = async () => {
  // 上传文件
  const spinner = ora("准备上传文件").start();
  try {
    for (let i = 0; i < CONFIG.DIST.length; i++) {
      const item = CONFIG.DIST[i];

      const thepath = path.resolve(process.cwd(), item);
      defaultLog(`文件名： ${thepath} : ${CONFIG.PATH + item}`);
      const stat = fs.lstatSync(thepath);
      stat.isDirectory()
        ? await SSH.putDirectory(thepath, CONFIG.PATH + item)
        : await SSH.putFile(thepath, CONFIG.PATH + item);
    }

    successLog("完成上传");
    successLog("部署完成");
    process.exit(0);
  } catch (error) {
    errorLog(error);
    errorLog("上传失败");
  }
  spinner.stop();
};

// ********* 连接ssh *********
const connectSSh = async () => {
  defaultLog(`尝试连接服务： ${CONFIG.SERVER_PATH}`);
  const spinner = ora("正在连接");
  spinner.start();
  try {
    spinner.stop();
    SSH.connect({
      host: CONFIG.SERVER_PATH,
      username: CONFIG.SSH_USER,
      password: CONFIG.SSH_KEY,
      port: CONFIG.PORT || 22,
    }).then(async () => {
      await uploadZipBySSH();
      await runAfterCommand();
    });
    successLog("SSH 连接成功");
  } catch (error) {
    errorLog(error);
    errorLog("SSH 连接失败");
  }
};

// 执行打包上传命令
async function runTask(hasBuild) {
  if (hasBuild) {
    await compileDist();
  }
  await connectSSh();
}

console.log(CONFIG);

defaultLog("服务器配置检查");
inquirer
  .prompt([
    {
      type: "confirm",
      name: "hasBuild",
      message: "是否需要打包",
    },
  ])
  .then((answers) => {
    const hasBuild = answers.hasBuild;

    runTask(hasBuild);
  });
