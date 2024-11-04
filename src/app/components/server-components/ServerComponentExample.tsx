import React from 'react';

export default async function ServerDataComponent() {
    // 使用 fetch 从 API 端点获取数据
    const res = await fetch('http://localhost:3000/api/product');    
    const data: { message: string; dataArray: number[] } = await res.json();
    return (
        <div>
            <h1>{data.message}</h1>
            <ul>
                {data.dataArray.map((num) => (
                    <li key={num}>{num}</li>
                ))}
            </ul>
        </div>
    );
}