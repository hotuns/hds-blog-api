export const config = {
  environment: "dev",
  database: {
    dbName: "",
    host: "",
    port: 3306,
    user: "",
    password: "",
    charset: "utf8mb4",
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60 * 2,
  },
  qiniu: {
    scope: "",
    ak: "",
    sk: "",
  },
};
