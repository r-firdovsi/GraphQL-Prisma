import jwt from "jsonwebtoken";

const token = (userId) => {
   return jwt.sign({ userId }, 'thisissecret', { expiresIn: '7 days' });
}

export { token as default }