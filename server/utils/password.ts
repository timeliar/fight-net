import crypto from "crypto";
import { toBigIntLE, toBufferLE } from "bigint-buffer";
import { modPow } from 'bigint-crypto-utils';

// 常量
const _g: bigint = BigInt(7);
const _N: bigint = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7');
/**
 * 计算SRP6验证器
 * @param username string 用户名
 * @param password string 密码
 * @param salt Buffer 盐
 * @returns Buffer 验证器
 */
function calculateSRP6Verifier(username: string, password: string, salt: Buffer): Buffer {
    const h1: Buffer = Buffer.from(crypto.createHash('sha1').update((username + ':' + password).toUpperCase()).digest('hex'), 'hex');
    const h2: bigint = toBigIntLE(Buffer.from(crypto.createHash('sha1').update(Buffer.concat([salt, h1])).digest('hex'), 'hex'))
    let verifier: Buffer = toBufferLE(modPow(_g, h2, _N), 32)
    verifier = Buffer.concat([verifier, Buffer.alloc(32 - verifier.length, '\0')]);
    return verifier;
}

/**
 * 获取注册数据
 * @param username string 用户名
 * @param password string 密码
 * @returns [Buffer, Buffer] 注册数据
 */
function getRegistrationData(username: string, password: string): [Buffer, Buffer] {
    const salt: Buffer = crypto.randomBytes(32);
    const verifier: Buffer = calculateSRP6Verifier(username, password, salt);
    return [salt, verifier];
}
export { getRegistrationData, calculateSRP6Verifier };