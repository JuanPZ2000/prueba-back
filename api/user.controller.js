import userDAO from "../dao/userDAO.js"

export default class UserController {
  static async apiGetUsers(req, res, next) {
    const { usersList,totalNumusers } = await userDAO.getUsers()
    console.log(usersList)
    let response = {
      user: usersList[0],
    }
    res.json(response)
  }
  // static async apiUpdateUserBalance(req, res, next) {
  //   const { usersList,totalNumusers } = await userDAO.getUsers()
  //   var balance_prev = usersList[0]['saldo']
  //   var new_balance = balance_prev - balance
  //   await userDAO.updateUserBalance(new_balance)
  //   let response = {
  //     "status":"done",
  //     "balance":new_balance
  //   }
  //   res.json(response)
  // }
  static async apiPushFund(req, res, next) {
    
    var balance = req.body.balance
    var fund = req.body.fund
    var result = await userDAO.pushFund(fund,balance)
    let response 
    if (result == 'error'){
      res.status(400).send('No diligencio un campo!')
    }
    else if(result == 'insuficiente'){
      res.status(202).send("Fondos insuficientes")
    }
    else{
      const { usersList,totalNumusers } = await userDAO.getUsers()
      var balance_prev = usersList[0]['saldo']
      var new_balance = balance_prev - balance
      await userDAO.updateUserBalance(new_balance)
      response== {
        "status": "done"
      }
      res.json(response)
    }
    
  }
}