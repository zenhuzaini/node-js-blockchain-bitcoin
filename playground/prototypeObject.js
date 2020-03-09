//prototype object is simply an object that multiple other objects can reffer to.
//to get any information or functionality that meets our need

function User(firstName, lastName, age, gender) { //what makes constructor different is it starts using Capital letter
    //assign the parameter to user object uring this
    const user = this //this. reffered to the object that we wabt to create

    //this is actually what's inside the constructor
    user.age = age
    user.firstName = firstName //user.firstparameter = firstmname(from parameter)
    user.lastName = lastName
    user.gender = gender

}

const user1 = new User('aku', 'cinta nabi', 24, 'male')

//create prototype
User.prototype.emailDomain = '@facebook.com'


//or use this prototype
User.prototype.getEmailAddress = function () { ///we cannot use arrow function
    const user = this
    return user.firstName + user.lastName + user.emailDomain
    // return this.firstName
}

console.log(user1)
console.log(user1.firstName)
console.log(user1.emailDomain)
console.log(user1.getEmailAddress())