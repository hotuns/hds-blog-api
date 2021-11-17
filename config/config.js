module.exports = {
  environment: "dev",
  database: {
    dbName: "hds_home",
    host: "localhost",
    port: 3306,
    user: "hds",
    password: "hds1512",
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60,
  },
};
