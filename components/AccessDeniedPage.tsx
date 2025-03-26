import React from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const AccessDeniedPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
                <div className="text-red-500 text-6xl mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-16 w-16 mx-auto"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">การเข้าถึงถูกปฏิเสธ</h1>
                <p className="text-gray-600 mb-6">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</p>
                <div className="space-y-3">
                    <Button
                        onClick={() => router.push('/')}
                        className="w-full text-white py-2 px-4 rounded"
                        sx={{ backgroundColor: '#153448', '&:hover': { backgroundColor: '#102B3F' }, color: 'white' }}
                    >
                        กลับไปยังหน้าหลัก
                    </Button>
                    <Button
                        onClick={() => router.back()}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                    >
                        กลับไปหน้าก่อนหน้า
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;