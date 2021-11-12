class HttpException extends Error {
  errorCode: number;
  code: number;
  msg: string | string[];
  constructor(msg = "服务器异常", errorCode = 10000, code = 400) {
    super();
    this.errorCode = errorCode;
    this.code = code;
    this.msg = msg;
  }
}

class ParameterException extends HttpException {
  constructor(msg: string | string[] = "参数错误", errorCode = 10000) {
    super();
    this.code = 400;
    this.msg = msg;
    this.errorCode = errorCode;
  }
}

class AuthFailed extends HttpException {
  constructor(msg = "授权失败", errorCode = 10004) {
    super();
    this.code = 401;
    this.msg = msg;
    this.errorCode = errorCode;
  }
}

class NotFound extends HttpException {
  constructor(msg = "404找不到", errorCode = 10005) {
    super();
    this.code = 404;
    this.msg = msg;
    this.errorCode = errorCode;
  }
}

class Forbidden extends HttpException {
  constructor(msg = "禁止访问", errorCode = 10006) {
    super();
    this.code = 403;
    this.msg = msg;
    this.errorCode = errorCode;
  }
}

class Existing extends HttpException {
  constructor(msg = "已存在", errorCode = 10006) {
    super();
    this.code = 412;
    this.msg = msg;
    this.errorCode = errorCode;
  }
}

export const errors = {
  HttpException,
  ParameterException,
  AuthFailed,
  NotFound,
  Forbidden,
  Existing,
};
