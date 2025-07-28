import jwt from "jsonwebtoken";
import "server-only";

const generateJWT = (candidateId: string, email: string, name: string) => {
  const payload = {
    id: candidateId,
    email: email,
    name: name,
  };

  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "2h",
  });
};

export default generateJWT;