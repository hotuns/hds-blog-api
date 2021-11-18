export const createValidator: RulesType = {
  title: {
    type: "string",
    required: true,
  },
  img_url: {
    type: "string",
    required: false,
  },
  content: {
    type: "string",
    required: true,
  },
  seo_keyword: {
    type: "string",
    required: true,
  },
  description: {
    type: "string",
    required: true,
  },
  admin_id: {
    type: "string",
    required: true,
  },
  category_id: {
    type: "string",
    required: true,
  },
  status: {
    type: "number",
    required: true,
  },
  sort_order: {
    type: "number",
    required: true,
  },
};

export const listValidators: RulesType = {
  category_id: {
    type: "number",
    required: false,
  },
  keyword: {
    type: "string",
    required: false,
  },
  page_size: {
    type: "number",
    required: false,
  },
  status: {
    type: "number",
    required: false,
  },
  page: {
    type: "number",
    required: false,
  },
};
