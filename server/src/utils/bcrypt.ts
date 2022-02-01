import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export const hashString = (value: string | number): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return reject(err);

      // hash the password using our new salt
      bcrypt.hash(`${value}`, salt, function (err, hash) {
        if (err) return reject(err);

        return resolve(hash);
      });
    });
  });
};

export const comparehash = (value: string | number, hashedValue = "") => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(`${value}`, hashedValue, function (err, isMatch) {
      if (err) return reject(false);
      return resolve(isMatch);
    });
  });
};
