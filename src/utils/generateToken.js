import jwt from "jsonwebtoken";

const token = (userId) => {
   return jwt.sign({ userId }, process.env.JWT_SECRT, { expiresIn: '7 days' });
}

export { token as default }