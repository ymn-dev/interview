import isEmail from "validator/lib/isEmail";

export const isValidEmail = (email) => {
  const processedEmail = email.trim().toLowerCase();
  return isEmail(processedEmail, { allow_utf8_local_part: false });
};
