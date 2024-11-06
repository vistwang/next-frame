import React, {PropsWithChildren} from 'react';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return <>
            <style jsx>{
                `header {
                    color: blue;
                    padding: 12px, 16px;
                }`
            }</style>
            <header>我是头</header>
            <main>{children}</main>
            <footer>我是尾</footer>
    </>
}

export default Layout;