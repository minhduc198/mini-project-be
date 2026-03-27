import fs from "fs";
import path from "path";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";

const filePath = path.join(__dirname, "../../data/users.json");

const readUsers = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
};

const writeUsers = (users: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

export const register = async (email: string, password: string) => {
  const users = readUsers();

  const existed = users.find((u: any) => u.email === email);
  if (existed) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  const newUser = {
    id: Date.now(),
    email,
    password: hashed,
  };

  users.push(newUser);
  writeUsers(users);

  return { id: newUser.id, email: newUser.email };
};

export const login = async (email: string, password: string) => {
  const users = readUsers();

  const user = users.find((u: any) => u.email === email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken({
    id: user.id,
    email: user.email,
  });

  return { token };
};
