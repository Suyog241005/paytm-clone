import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

import { jwtSecret } from "../config";
import { db } from "@workspace/db/db";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

function generatePaymentToken(userId: string, amount: string) {
  return jwt.sign({ userId, amount }, jwtSecret, { expiresIn: "5m" });
}

function verifyPaymentToken(token: string) {
  try {
    return jwt.verify(token, jwtSecret) as { userId: string; amount: string };
  } catch {
    return null;
  }
}

["hdfc", "sbi", "kotak", "axis", "icici"].forEach((bank) => {
  app.get(`/${bank}`, (req, res) => {
    try {
      const { userId, amount } = req.query as {
        userId?: string;
        amount?: string;
      };

      if (!userId || !amount) {
        res.status(400).json({ message: "Missing userId or amount" });
        return;
      }

      const token = generatePaymentToken(userId, amount);
      res.status(200).json({ token });
      return;
    } catch (error) {
      console.log(`${bank}_GET_ERROR`, error);
      res.status(500).json("internal server error");
    }
  });
});

["hdfc", "sbi", "kotak", "axis", "icici"].forEach((bank) => {
  app.post(`/${bank}`, async (req, res) => {
    try {
      const { token } = req.body as {
        token: string;
      };

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      const decoded = verifyPaymentToken(token);

      if (!decoded) {
        await db.onRampTransaction.update({
          where: { token },
          data: {
            status: "Failure",
          },
        });
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      //transaction
      await db.$transaction([
        db.balance.update({
          where: {
            userId: decoded.userId,
          },
          data: {
            amount: {
              increment: Number(decoded.amount),
            },
          },
        }),

        db.onRampTransaction.update({
          where: {
            token,
          },
          data: {
            status: "Success",
          },
        }),
      ]);

      res.status(200).json({
        message: `${bank.toUpperCase()} payment successful`,
        details: decoded,
      });
      return;
    } catch (error) {
      console.log(`${bank}_POST_ERROR`, error);
      res.status(500).json("internal server error");
    }
  });
});

console.log("app listening on port 3001");
app.listen(3001);
