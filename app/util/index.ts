import { sign } from "jsonwebtoken";
import { config } from "../config/config";
/***
 *
 */
const findMembers = function (instance, { prefix, specifiedType, filter }) {
  // 递归函数
  function _find(instance) {
    //基线条件（跳出递归）
    if (instance.__proto__ === null) return [];

    let names = Reflect.ownKeys(instance);
    names = names.filter((name) => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name);
    });

    return [...names, ..._find(instance.__proto__)];
  }

  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true;
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true;
    if (specifiedType)
      if (instance[value] instanceof specifiedType) return true;
  }

  return _find(instance);
};

// 颁布令牌
const generateToken = function (uid, scope) {
  const secretKey = config.security.secretKey;
  const expiresIn = config.security.expiresIn;
  const token = sign(
    {
      uid,
      scope,
    },
    secretKey,
    {
      expiresIn: expiresIn,
    }
  );
  return token;
};

// 数组去重
function unique(arr) {
  return [...new Set(arr)];
}

// 检测是否是数组
function isArray(arr) {
  return Array.isArray(arr);
}

// 分类列表创建树结构
function handleTree(list) {
  // 对源数据深度克隆
  let cloneData = JSON.parse(JSON.stringify(list));
  //循环所有项
  return cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => {
      //返回每一项的子级数组
      return father.id === child.parent_id;
    });
    if (branchArr.length > 0) {
      //如果存在子级，则给父级添加一个children属性，并赋值
      father.sub_comments = branchArr;
    }
    //返回第一层
    return father.parent_id === 0;
  });
}

function extractQuery(query, like) {
  let filter = {};
  if (!query) {
    return filter;
  }

  for (let key in query) {
    const value = query[key];
    if (!!value) {
      if (query[key] !== like) {
        filter[key] = value;
      }
    }
  }
  return filter;
}

export {
  findMembers,
  generateToken,
  unique,
  isArray,
  handleTree,
  extractQuery,
};
