"use client";
import React, { memo, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line react/display-name
export default memo(() => {
    const [data, setData] = useState<any>();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('http://localhost:3000/api/user');
            const jsonData: { message: string; dataArray: number[] } = await res.json();
            setData(jsonData);
        }
        fetchData();
    }, []);

    const handleClick = useCallback(() => {
        alert('Button clicked!');
    }, []);

    return <>
    {data ? <div>{data?.message}</div> : <div>Loading...</div>}
    <button onClick={handleClick}>Click me</button>
    </>
})