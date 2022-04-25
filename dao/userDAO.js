import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let users

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db(process.env.DB_NAME).collection("user")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usersDAO: ${e}`,
      )
    }
  }
  static async updateUserBalance(balance){
    const query = { user: 'zuluagjp'}
    const updateDocument = {
      $set: {'saldo':balance}
    }
    const result = await users.updateOne(query,updateDocument)
  }
  static async pushFund(fund,balance){
    const query = { user: 'zuluagjp'}
    const updateDocument = {
      $push: {'fondos':{fund:fund,balance:balance}}
    }
    if (fund && balance){
      if(
        ((fund == 'FPV_BTG_PACTUAL_RECAUDADORA') && (balance >=75000)) ||
        ((fund == 'FPV_BTG_PACTUAL_ECOPETROL') && (balance >=125000)) ||
        ((fund == 'DEUDAPRIVADA') && (balance >=50000)) ||
        ((fund == 'FDO-ACCIONES') && (balance >=250000)) ||
        ((fund == 'FPV_BTG_PACTUAL_DINAMICA') && (balance >=100000)) 
        ){
          var result = await users.updateOne(query,updateDocument)
      }
      else{
        var result = "insuficiente"
      }
    }
    else{
      var result = 'error'
    }
    return result
  }

  static async getUsers({
    page = 0,
    usersPerPage = 20,
  } = {}) {
    let query

    let cursor
    
    try {
      cursor = await users
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { usersList: []}
    }

    const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

    try {
      const usersList = await displayCursor.toArray()

      return { usersList }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { usersList: []}
    }
  }
}