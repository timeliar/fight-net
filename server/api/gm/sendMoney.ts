const config = useRuntimeConfig();
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    let req = `<SOAP-ENV:Envelope  
        xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" 
        xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/1999/XMLSchema" 
        xmlns:ns1="urn:AC">
        <SOAP-ENV:Body>
        <ns1:executeCommand>
            <command>send money ${body.characterName} ${body.title || 'GM发慈善'} ${body.content || 'GM的赏赐'} ${body.count}</command>
        </ns1:executeCommand>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;
    const parser = new XMLParser();
    try {
        const resp = await axios.post(config.soapServerPath, req, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'urn:AC#executeCommand',
            },
            auth: {
                username: config.soapUser,
                password: config.soapPassword,
            }
        });
        let result = parser.parse(resp.data);
        let sendResult = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:executeCommandResponse']['result'];
        if (sendResult) {
            return success(sendResult);
        } else {
            return failure('发送失败', 500);
        }
    } catch (e: any) {
        if (axios.isAxiosError(e)) {
            // do something
            // or just re-throw the error
            let failResult = parser.parse(e?.response?.data);
            let failMessage = failResult['SOAP-ENV:Envelope']['SOAP-ENV:Body']['SOAP-ENV:Fault']['faultstring'];
            return failure(failMessage, 500);
        } else {
            // do something else
            // or creating a new error
            return failure('系统异常', 500);
        }
    }
})