import bcrypt from "bcrypt";

export const bcryptHash = async (str, saltRound = 12) => {
  return await bcrypt.hash(str, saltRound);
};

export const bcryptCompare = async (myStr, hashedStr) => {
  return await bcrypt.compare(myStr, hashedStr);
};
