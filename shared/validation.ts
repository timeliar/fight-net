import { z } from 'zod';
export const registerAccount = z.object({
    username: z.string("账号不能为空").min(1, "账号不能为空").max(20, "账号不能大于20个字符"),
    email: z.email("邮箱格式不正确"),
    password: z.string("密码不能为空").min(3, "密码不能少于3个字符"),
});
export const loginAccount = z.object({
    username: z.string("账号不能为空").min(1, "账号不能为空"),
    password: z.string("密码不能为空").min(3, "密码不能少于3个字符"),
});