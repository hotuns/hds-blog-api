export const categoryListValidator: RulesType = {
  status: {
    type: "string",
    required: false,
  },
  name: {
    type: "string",
    required: false,
  },
  id: {
    type: "number",
    required: false,
  },
  page: {
    type: "number",
    required: false,
  },
  page_size: {
    type: "number",
    required: false,
  },
};

export const UserUpdateValidator: RulesType = {
  email: {
    type: "email",
    required: true,
  },
  status: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    required: true,
  },
};

export const createValidator: RulesType = {
  name: {
    type: "string",
    required: true,
  },
  sort_order: {
    type: "number",
    required: false,
  },
  parent_id: {
    type: "number",
    required: false,
  },
};

export const updateValidator: RulesType = {
  id: {
    type: "string",
    required: true,
  },
  name: {
    type: "string",
    required: true,
  },
  sort_order: {
    type: "number",
    required: false,
  },
  parent_id: {
    type: "number",
    required: false,
  },
};
