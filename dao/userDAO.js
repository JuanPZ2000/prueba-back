import mongodb from "mongodb"
import { v4 as uuidv4 } from 'uuid';
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

  static async popFund(fund,balance){
    const result = await users.update(
      {'user':'zuluagjp'},
      { $pull:{ fondos:{ fund:fund}}}
    )
    const query = { user: 'zuluagjp'}
    const updateDocumentHistorical = {
      $push: {'historical':{id_transaction:uuidv4(),fund:fund,balance:balance,type:'cancel'}}
    }
    var historical = await users.updateOne(query,updateDocumentHistorical)
  }

  static async updateUserBalance(balance){
    const query = { user: 'zuluagjp'}
    const updateDocument = {
      $set: {'saldo':balance}
    }
    const result = await users.updateOne(query,updateDocument)
  }
  static async pushFund(fund,balance,balance_prev){
    const query = { user: 'zuluagjp'}
    const updateDocument = {
      $push: {'fondos':{fund:fund,balance:balance}}
    }
    const updateDocumentHistorical = {
      $push: {'historical':{id_transaction:uuidv4(),fund:fund,balance:balance,type:'suscribe'}}
    }
    if (fund && balance){
      if(
        ((fund == 'FPV_BTG_PACTUAL_RECAUDADORA') && (balance >=75000)) ||
        ((fund == 'FPV_BTG_PACTUAL_ECOPETROL') && (balance >=125000)) ||
        ((fund == 'DEUDAPRIVADA') && (balance >=50000)) ||
        ((fund == 'FDO-ACCIONES') && (balance >=250000)) ||
        ((fund == 'FPV_BTG_PACTUAL_DINAMICA') && (balance >=100000)) 
        ){
          if(balance_prev >= balance){
            var result = await users.updateOne(query,updateDocument)
            var historical = await users.updateOne(query,updateDocumentHistorical)
          }
          else{
            var result = "fondos_insuficientes"
          }
          
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