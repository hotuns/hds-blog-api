export const RegisterValidator: RulesType = {
  nickname: {
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
    type: "password",
    min: 6,
    max: 22,
  },
  password2: {
    compare: "password1",
    type: "password",
    min: 6,
    max: 22,
  },
};

export const AdminLoginValidator: RulesType = {
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
