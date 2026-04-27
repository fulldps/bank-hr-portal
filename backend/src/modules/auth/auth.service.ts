import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  position: string;
  employee_id: string;
}

export async function loginService(email: string, password: string) {
  const user = await queryOne<UserRow>(
    "SELECT * FROM users WHERE email = $1 AND is_active = true",
    [email],
  );

  if (!user) {
    throw new AppError(401, "Неверный email или пароль", "INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new AppError(401, "Неверный email или пароль", "INVALID_CREDENTIALS");
  }

  const secret = process.env.JWT_SECRET || "fallback_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

  const payload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, secret, {
    expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: refreshExpiresIn,
  } as jwt.SignOptions);

  await query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
    [user.id, refreshToken],
  );

  const { password_hash, ...userData } = user;

  return {
    user: {
      id: userData.id,
      email: userData.email,
      fullName: userData.full_name,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      department: userData.department,
      position: userData.position,
      employeeId: userData.employee_id,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshTokenService(token: string) {
  const stored = await queryOne(
    "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
    [token],
  );

  if (!stored) {
    throw new AppError(401, "Refresh token недействителен", "INVALID_TOKEN");
  }

  const secret = process.env.JWT_SECRET || "fallback_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const payload = jwt.verify(token, secret) as {
    userId: string;
    role: string;
    email: string;
  };

  const newAccessToken = jwt.sign(
    { userId: payload.userId, role: payload.role, email: payload.email },
    secret,
    { expiresIn } as jwt.SignOptions,
  );

  return { accessToken: newAccessToken };
}

export async function logoutService(token: string) {
  await query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
}

export async function getMeService(userId: string) {
  const user = await queryOne<UserRow>("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  if (!user) {
    throw new AppError(404, "Пользователь не найден", "NOT_FOUND");
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    department: user.department,
    position: user.position,
    employeeId: user.employee_id,
  };
}
