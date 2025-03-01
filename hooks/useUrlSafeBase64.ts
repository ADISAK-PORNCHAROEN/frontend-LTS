import { useCallback } from 'react';

/**
 * Custom hook สำหรับเข้ารหัสและถอดรหัส URL Safe Base64
 * ปรับปรุงให้มีการตรวจสอบความถูกต้องของข้อมูลโดยไม่ใช้ CryptoJS
 */
export const useUrlSafeBase64 = () => {
    /**
     * สร้าง simple checksum แบบง่าย
     * @param str ข้อความที่ต้องการคำนวณ checksum
     * @returns checksum แบบง่าย
     */
    const createSimpleChecksum = (str: string): string => {
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += str.charCodeAt(i);
        }
        return sum.toString(16).padStart(4, '0'); // แปลงเป็น hex 4 หลัก
    };

    /**
     * เข้ารหัสข้อความเป็น URL Safe Base64
     * @param str ข้อความที่ต้องการเข้ารหัส
     * @returns ข้อความที่เข้ารหัสแล้ว
     */
    const encode = useCallback((str: string): string => {
        if (!str) return '';

        // สร้าง simple checksum
        const checksum = createSimpleChecksum(str);
        
        // รวมข้อมูลและ checksum
        const dataWithChecksum = `${str}|${checksum}|${str.length}`;

        // เข้ารหัสแบบ base64
        const encoded = Buffer.from(dataWithChecksum)
            .toString('base64')
            .replace(/\+/g, '-') // แทนที่ + ด้วย -
            .replace(/\//g, '_') // แทนที่ / ด้วย _
            .replace(/=/g, '');  // ลบ = ออก

        return encoded;
    }, []);

    /**
     * ถอดรหัสข้อความจาก URL Safe Base64
     * @param str ข้อความที่ต้องการถอดรหัส
     * @returns ข้อความที่ถอดรหัสแล้ว หรือ '' ถ้าข้อมูลไม่ถูกต้อง
     */
    const decode = useCallback((str: string): string => {
        if (!str) return '';

        try {
            // แทนที่อักขระที่ถูกแทนที่กลับคืน
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

            // เติม padding กลับคืน
            while (base64.length % 4) {
                base64 += '=';
            }

            // ถอดรหัส base64
            const decoded = Buffer.from(base64, 'base64').toString();

            // แยกข้อมูล
            const parts = decoded.split('|');
            if (parts.length !== 3) {
                return ''; // รูปแบบข้อมูลไม่ถูกต้อง
            }

            const [data, storedChecksum, lengthStr] = parts;
            
            // ตรวจสอบความยาวข้อมูล
            if (data.length !== parseInt(lengthStr, 10)) {
                return ''; // ความยาวข้อมูลไม่ตรงกัน
            }
            
            // ตรวจสอบ checksum
            const calculatedChecksum = createSimpleChecksum(data);
            if (calculatedChecksum !== storedChecksum) {
                return ''; // checksum ไม่ตรงกัน
            }
            
            return data;
        } catch (error) {
            console.error('Error decoding base64:', error);
            return '';
        }
    }, []);

    return {
        encode,
        decode
    };
};

// สำหรับการใช้งานในที่ที่ไม่ใช่ React component
export const encodeUrlSafeBase64 = (str: string): string => {
    if (!str) return '';

    // สร้าง simple checksum
    const createSimpleChecksum = (input: string): string => {
        let sum = 0;
        for (let i = 0; i < input.length; i++) {
            sum += input.charCodeAt(i);
        }
        return sum.toString(16).padStart(4, '0'); // แปลงเป็น hex 4 หลัก
    };

    // สร้าง checksum และรวมกับข้อมูล
    const checksum = createSimpleChecksum(str);
    const dataWithChecksum = `${str}|${checksum}|${str.length}`;

    // เข้ารหัสแบบ base64
    const encoded = Buffer.from(dataWithChecksum)
        .toString('base64')
        .replace(/\+/g, '-') // แทนที่ + ด้วย -
        .replace(/\//g, '_') // แทนที่ / ด้วย _
        .replace(/=/g, '');  // ลบ = ออก

    return encoded;
};

export const decodeUrlSafeBase64 = (str: string): string => {
    if (!str) return '';

    try {
        // สร้าง simple checksum
        const createSimpleChecksum = (input: string): string => {
            let sum = 0;
            for (let i = 0; i < input.length; i++) {
                sum += input.charCodeAt(i);
            }
            return sum.toString(16).padStart(4, '0'); // แปลงเป็น hex 4 หลัก
        };

        // แทนที่อักขระที่ถูกแทนที่กลับคืน
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

        // เติม padding กลับคืน
        while (base64.length % 4) {
            base64 += '=';
        }

        // ถอดรหัส base64
        const decoded = Buffer.from(base64, 'base64').toString();

        // แยกข้อมูล
        const parts = decoded.split('|');
        if (parts.length !== 3) {
            return ''; // รูปแบบข้อมูลไม่ถูกต้อง
        }

        const [data, storedChecksum, lengthStr] = parts;
        
        // ตรวจสอบความยาวข้อมูล
        if (data.length !== parseInt(lengthStr, 10)) {
            return ''; // ความยาวข้อมูลไม่ตรงกัน
        }
        
        // ตรวจสอบ checksum
        const calculatedChecksum = createSimpleChecksum(data);
        if (calculatedChecksum !== storedChecksum) {
            return ''; // checksum ไม่ตรงกัน
        }
        
        return data;
    } catch (error) {
        console.error('Error decoding base64:', error);
        return '';
    }
};