export const cacheKeyDetailGenerate = {
  user: (userId: number) => `USER_${userId}`,
  auth: (userId: number) => {
    return {
      key: `AUTH_${userId}`,
      ex: 60 * 60 * 180,
    };
  },
  passwordForgot: (userId: number) => {
    return {
      key: `PASSWORD_FORGOT_${userId}`,
      ex: 60 * 60 * 4,
    };
  },

  template: (key: string) => `TEMPLATE_${key}`,

  socket: () => `SOCKETS`,
};
