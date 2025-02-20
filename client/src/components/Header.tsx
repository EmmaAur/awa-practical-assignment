/*
Week 10 code
*/

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import { changeLanguage } from 'i18next'

const Header = () => {
    const {t, i18n} = useTranslation()
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }
    return (
        <header className="header">
            <h1>Very cool header</h1>
            <nav>
                <ul>
                    <Link to='/'>{t("Home")}</Link>
                    <Link to='/about'>{t("About")}</Link>
                    <button id="fi" onClick={() => changeLanguage("fi")}>FI</button>
                    <button id="en" onClick={() => changeLanguage("en")}>EN</button>
                </ul>
            </nav>
        </header>
    )
}

export default function App() {
    return (
        <Suspense fallback="loading">
            <Header />
        </Suspense>
    );
}