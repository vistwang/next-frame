"use client";
import React, { memo, useCallback } from 'react';

// eslint-disable-next-line react/display-name
export default memo(({name}: {name: string}) => {

    const handleClick = useCallback(() => {
        alert('Button clicked!');
    }, []);

    return <>
    {name ? <code className="text-red-300">{name}</code> : null }
    <p><button onClick={handleClick}>Click me</button></p>
    </>
})