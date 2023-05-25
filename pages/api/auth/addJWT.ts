import { getJwtSecretKey } from "@/lib/auth";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("1m")
      .sign(new TextEncoder().encode(getJwtSecretKey()));

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user-token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      })
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: { err } });
  }
};

export default handler;
