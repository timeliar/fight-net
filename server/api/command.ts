const config = useRuntimeConfig();
import axios from 'axios';
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
            <command>${body.command}</command>
        </ns1:executeCommand>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;
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
    return {
        response: resp.data,
        status: resp.status,
    }
})