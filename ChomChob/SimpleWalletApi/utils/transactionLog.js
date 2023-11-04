import connection from "../server.js";
import crypto from "crypto";

export const transactionLog = (from_user, to_user) => {
  const transactionId = crypto.randomUUID();
};
