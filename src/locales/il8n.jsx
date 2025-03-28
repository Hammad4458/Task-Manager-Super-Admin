import il8n from "i18next";
import { initReactI18next} from "react-i18next";

const resources = {
    en:{
        translation:{
            "mainPage":"Main Page",
            "org":"Organizations",
            "dep":"Departments",
            "add-user":"Add User",
            "edit":"Edit",
            "create":"Create",
            "back":"Back",
            "logout":"Logout",
            "create-dep":"Create Department",
            "create-org":"Create Organization",
            "logout":"Logout",
            "email":"Email",
            "password":"Password",
            "login":"Login",
            "admin":"Admin",
            "manager":"Manager",
            "user":"User",
            "upadte":"Update",
            "assign":"Assign"
        }
    },
    "fr": {
        "translation": {
            "mainPage": "Page Principale",
            "org": "Organisations",
            "dep": "Départements",
            "add-user": "Ajouter un utilisateur",
            "edit": "Modifier",
            "create": "Créer",
            "back": "Retour",
            "logout": "Déconnexion",
            "create-dep": "Créer un département",
            "create-org": "Créer un Organisations",
            "email": "E-mail",
            "password": "Mot de passe",
            "login": "Connexion",
            "admin": "Administrateur",
            "manager": "Gestionnaire",
            "user": "Utilisateur",
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
