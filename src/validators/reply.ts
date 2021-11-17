export const createValidator: RulesType = {
  content: {
    type: "string",
    required: false,
  },
  article_id: {
    type: "number",
    required: false,
  },
  comment_id: {
    type: "number",
    required: false,
  },
  email: {
    type: "string",
    required: false,
  },
  reply_user_id: {
    type: "number",
    required: false,
  },
  user_id: {
    type: "number",
    required: false,
  },
};

export const detailValidator: RulesType = {
  is_replay: {
    type: "number",
    required: true,
  },
  is_article: {
    type: "number",
    required: true,
  },
  is_user: {
    type: "number",
    required: true,
  },
};

export const listValidators: RulesType = {
  id: {
    type: "string",
    required: false,
  },
  article_id: {
    type: "string",
    required: false,
  },
  is_replay: {
    type: "string",
    required: false,
  },
  is_article: {
    type: "string",
    required: false,
  },
  is_user: {
    type: "string",
    required: false,
  },
  content: {
    type: "string",
    required: false,
  },
  status: {
    type: "string",
    required: false,
  },
  page_size: {
    type: "string",
    required: false,
  },
  page: {
    type: "string",
    required: false,
  },
};
