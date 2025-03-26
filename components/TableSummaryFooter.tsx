import React from 'react'

export default function TableSummaryFooter({ rows, cols, threshold }: any) {
    const emptyCells = (
        <>
            <div style={{
                width: '150px', // width ของ column แรก
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid rgba(224, 224, 224, 1)'
            }}>
                สรุปผลรวม
            </div>
            <div style={{
                width: '230px', // width ของ column ที่สอง
                padding: '16px',
                textAlign: 'left',
                borderRight: '1px solid rgba(224, 224, 224, 1)'
            }}>
                เกณฑ์ผ่าน: ≥ {threshold} คะแนน
            </div>
        </>
    );

    // สร้าง cell สำหรับแต่ละ CLO
    const cloCells = cols.map((col: any) => {
        const cloId = col.id;
        const cloName = col.cloName;

        let totalStudents = rows.length;
        let passedStudents = 0;

        rows.forEach((row: any) => {
            if (row.excel) {
                const matchingItem = row.excel.find((item: any) => item.userCloId === cloId);
                if (matchingItem && matchingItem.score >= threshold) {
                    passedStudents++;
                }
            }
        });

        const failedStudents = totalStudents - passedStudents;
        const passRate = totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0;

        return (
            <div
                key={cloId}
                style={{
                    width: '120px', // width ของ CLO column
                    padding: '8px',
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{ color: 'green', fontWeight: 'bold' }}>ผ่าน: {passedStudents}</div>
                <div style={{ color: 'red' }}>ไม่ผ่าน: {failedStudents}</div>
                <div>({passRate.toFixed(1)}%)</div>
            </div>
        );
    });

    return (
        <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            borderLeft: '1px solid rgba(224, 224, 224, 1)',
            backgroundColor: '#f5f5f5'
        }}>
            {emptyCells}
            {cloCells}
        </div>
    );
};
