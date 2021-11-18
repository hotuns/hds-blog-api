import {
  controller,
  DarukContext,
  get,
  inject,
  injectable,
  middleware,
  Next,
  post,
  prefix,
  type,
  validate,
  del,
  put,
} from "daruk";

import { auth } from "../glues/auth";
import { ArticleSer } from "../services/article";
import { ResTypes } from "../glues/resTypes";
import { generateToken } from "../util";
import { createValidator, listValidators } from "../validators/article";

const hljs = require("highlight.js");
const md = require("markdown-it")({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          // Deprecated as of 10.7.0. highlight(lang, code, ...args) has been deprecated.
          // Deprecated as of 10.7.0. Please use highlight(code, options) instead.
          // https://github.com/highlightjs/highlight.js/issues/2277
          // hljs.highlight(lang, str, true).value + '</code></pre>';
          hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

@controller()
@prefix("/api/v1")
class UserController {
  @inject("ArticleSer")
  public ArticleSer: ArticleSer;

  //  创建文章
  @auth({ role: RoleTypes.ADMIN })
  @validate(createValidator as any)
  @post("/article")
  public async register(ctx: DarukContext, next: Next) {
    const [error, data] = await this.ArticleSer.create(ctx.request.body);

    if (!error) {
      // 返回结果
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取文章信息
  @validate({
    id: {
      type: "number",
      required: true,
    },
    is_markdown: {
      type: "boolean",
      required: false,
    },
  })
  @get("/article/:id")
  public async detail(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.ArticleSer.detail(Number(id));

    if (!error) {
      if (ctx.query.is_markdown) {
        data.content = md.render(data.content);
      }

      // 更新文章浏览
      await this.ArticleSer.updateBrowse(id, ++data.browse);

      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 更新信息
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate(createValidator as any)
  @put("/article/:id")
  public async update(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.ArticleSer.update(
      Number(id),
      ctx.request.body
    );
    if (!error) {
      ctx.body = ResTypes.success("更新文章成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 删除文章
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate({
    id: {
      type: "number",
      required: true,
    },
  })
  @del("/article/:id")
  public async deleteUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.ArticleSer.destroy(Number(id));
    if (!error) {
      ctx.body = ResTypes.success("删除用户成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取列表
  @get("/article")
  @validate(listValidators as any)
  public async list(ctx: DarukContext, next: Next) {
    let [error, data] = await this.ArticleSer.list(ctx.query);

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }
}
