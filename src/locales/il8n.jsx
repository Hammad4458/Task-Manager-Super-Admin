import il8n from "i18next";
import { initReactI18next} from "react-i18next";

const resources = {
    en:{
        translation:{
            "mainPage":"Main Page",
            "org":"Organizations",
            "dep":"Departments"
        }
    },
    fr:{
        translation:{
            "mainPage":"Page Principale",
            "org":"Organisations",
            "dep":"Départements"
        }
    }
};

il8n
 .use(initReactI18next)
 .init({
    resources,
    lng: navigator.language.split('-')[0] || "en", 
    fallbackLng: "en", 
    interpolation:{
        escapeValue:false,
    }
})

export default il8n;
