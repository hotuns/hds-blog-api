export const config = {
  environment: "dev",
  database: {
    dbName: "hds_blog",
    host: "7hds.com",
    port: 3306,
    user: "root",
    password: "hds1512",
    charset: "utf8mb4",
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60,
  },
};
