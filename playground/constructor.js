// create constructor
//will allow to make instance easily
function User(firstName, lastName, age, gender) { //what makes constructor different is it starts using Capital letter
    //assign the parameter to user object uring this
    const user = this //this. reffered to the object that we wabt to create

    const validChoice = ['male', 'female']
    const isValid = validChoice.includes(gender)
    if (!isValid) {
        gender = 'gender undefined'
    }

    if (age > 90) {
        user.status = 'Whoa you must be very old'
    }

    //this is actually what's inside the constructor
    user.age = age
    user.firstName = firstName //user.firstparameter = firstmname(from parameter)
    user.lastName = lastName
    user.gender = gender

}

//create user instances
const user1 = new User('zen', 'huzaini', 24, 'male') //new is to invoke new constructor object
console.log(user1)

const user2 = new User('zen', 'smith', 25, 'male yeay')
console.log(user2)

const user3 = new User('zen', 'smith', 98, 'male yeay')
console.log(user3)