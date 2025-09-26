import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma";
import bcrypt from "bcrypt";

export const refreshController = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "unautharised", success: false })
            return
        }
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "your secret refresh key") as any
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id,
            }
        })
        if (!user?.refreshToken) {
            res.status(401).json({ message: "unautharised", success: false })
            return
        }
        const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken)
        if (!isTokenValid) {
            await prisma.user.update({
                where: { id: payload.id },
                data: { refreshToken: "" }
            })
            res.status(401).json({ message: "unautharised", success: false })
            return
        }
        const newAccessToken = jwt.sign({ id: payload.id, email: payload.email, name: payload.name }, process.env.JWT_ACCESS_SECRET || "your secret access key", { expiresIn: "15m" })
        const newRefreshToken = jwt.sign({ id: payload.id, email: payload.email, name: payload.name }, process.env.JWT_REFRESH_SECRET || "your secret refresh key", { expiresIn: "30d" })
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10)
        await prisma.user.update({
            where: { id: payload.id },
            data: { refreshToken: hashedRefreshToken }
        })
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            domain: process.env.DOMAIN
        })
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            domain: process.env.DOMAIN
        })
        res.status(200).json({ message: "token refreshed successfully", success: true })
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Invalid token", success: false })
            return
        }
        res.status(500).json({ message: "something went wrong", success: false })
    }
}