module.exports = {

  getAge(timestamp){

    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    age = age + (month <= 0 && today.getDate() < birthDate.getDate()  ? -1 : 0) 

    return age
  }
}