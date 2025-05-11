import Jwt  from "jsonwebtoken"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getToken } from "./authToken"

export const getJwtUser = async () => {
    try {
        const token = await getToken()
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const user = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        return user
    } catch (error) {
        return null
    }
}