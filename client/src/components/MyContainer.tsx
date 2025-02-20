/*
useTranslation: https://react.i18next.com/latest/usetranslation-hook
*/

import { useTranslation } from 'react-i18next';

const MyContainer = () => {
    // const {t, i18n} = useTranslation();
    const {t} = useTranslation();

    return (
        <div>
            {t("This is the front page")}
        </div>
    )
}

export default MyContainer
