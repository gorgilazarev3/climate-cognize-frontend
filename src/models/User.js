class User {
    constructor(username, name, surname, role, isPremium=false) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.role = role;
        this.isPremium = isPremium;
    }

}

export default User;