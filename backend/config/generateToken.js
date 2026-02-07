import jwt from "jsonwebtoken";

export const userToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return token;
};

export const adminToken = (seller, res) => {
  const token = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: "1d",
  });

  res.cookie("admin", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return token;
};