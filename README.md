# WOW WOTLK AzerothCore私服3.3.5a简易登录页面

## 构建&启动
本地构建 `pnpm i && pnpm build`，或docker 构建

```bash
docker build . -t fight-net:dev
```

`docker compose up -d` 运行

## 使用现有镜像
`docker pull timeliar/fight-net`

docker-compose.yml 内的`fight-net:dev`改成`timeliar/fight-net`

`docker compose up -d` 运行

## 配置项

`.env`文件主要内容

```ini
NUXT_AUTH_DB_URI=mysql://<user>:<password>@<host>:<port>/<auth db name>
NUXT_CHARACTERS_DB_URI=mysql://<user>:<password>@<host>:<port>/<characters db name>

# 以下仅作为展示
NUXT_REALM_RATE_MONEY="10"
NUXT_REALM_RATE_XP_QUEST="5"
NUXT_REALM_RATE_XP_QUEST_DF="5"
NUXT_REALM_RATE_XP_EXPLORE="3"
NUXT_REALM_RATE_HONOR="3"
NUXT_REALM_RATE_HEALTH="5"
NUXT_REALM_RATE_MANA="5"
NUXT_REALM_RATE_RAGE_INCOME="5"
NUXT_REALM_RATE_RUNIC_POWER_INCOME="10"
NUXT_REALM_RATE_FOCUS="5"
NUXT_REALM_RATE_ENERGY="5"
NUXT_REALM_RATE_LOYALTY="5"
NUXT_REALM_RATE_DROP_ITEM_UNCOMMON="5"
NUXT_REALM_RATE_DROP_ITEM_RARE="5"
NUXT_REALM_RATE_ITEM_EPIC="5"
NUXT_REALM_RATE_ITEM_LENENDARY="5"
NUXT_REALM_RATE_DROP_MONEY="100"
```
## 页面示例
<img width="2177" height="1254" alt="image" src="https://github.com/user-attachments/assets/1d91f300-56e5-465a-8adb-87e6f8696cee" />
<img width="2177" height="1254" alt="image" src="https://github.com/user-attachments/assets/f272b552-1c0e-4b7f-90de-a976c63e10f9" />
<img width="2177" height="1254" alt="image" src="https://github.com/user-attachments/assets/107f1116-94f2-4303-8a7f-afb9bc5bd2fe" />
<img width="2177" height="1254" alt="image" src="https://github.com/user-attachments/assets/1c469bc3-cbc3-4cb6-8c5a-66c56ccbf26c" />
<img width="2177" height="1254" alt="image" src="https://github.com/user-attachments/assets/b1b41477-2be4-47ed-aa50-b1f2e70cb67f" />

## 功能
- [x] 简易注册
- [x] 简易登录
- [x] 查看可用服务器
- [x] 查看服务器内角色（登录账号）
- [x] 查看当前用户&角色游戏登录状态
- [ ] 注册验证码
- [x] GM操作页面 - 发送附件邮件
- [ ] GM更多操作指令
- [ ] i18n
