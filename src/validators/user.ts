export const RegisterValidator: RulesType = {
  username: {
    type: "string",
    min: 2,
    max: 16,
    required: true,
  },
  email: {
    type: "email",
    required: true,
  },
  password1: {
    required: true,
    type: "password",
    min: 6,
    max: 22,
  },
  password2: {
    required: true,
    compare: "password1",
    type: "password",
    min: 6,
    max: 22,
  },
};

export const UserLoginValidator: RulesType = {
  email: {
    type: "email",
    required: true,
  },
  password: {
    type: "password",
    min: 6,
    max: 22,
  },
};

export const UserListValidator: RulesType = {
  id: {
    type: "string",
    required: false,
  },
  email: {
    type: "email",
    required: false,
  },
  status: {
    type: "string",
    required: false,
  },
  username: {
    type: "string",
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
  id: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    min: 2,
    max: 16,
    required: true,
  },
  email: {
    type: "email",
    required: true,
  },
  status: {
    type: "string",
    required: true,
  },
};
