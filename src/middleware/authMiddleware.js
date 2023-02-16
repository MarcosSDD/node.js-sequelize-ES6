import jwt from "jsonwebtoken";
import { User } from '../models/'

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_JWT);
      //Esto genera una session de usuario
      req.user = await User.scope("sendDataUser").findByPk(decoded.id);
      return next();
    } catch (error) {
      const errorMsg = new Error("Token no Válido");
      return res.status(403).json({ msg: errorMsg.message });
    }
  }

  if (!token) {
    const error = new Error("Token no Válido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;