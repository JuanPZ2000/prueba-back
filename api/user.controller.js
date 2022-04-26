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

  static async apiGetFundBalance(req, res, next) {
    const { usersList,totalNumusers } = await userDAO.getUsers()
    const fondos = usersList[0]['fondos']
    var balanceRecaudadora = 0
    var balanceEcopetrol = 0
    var balanceDeudaPrivada = 0
    var balanceAcciones = 0
    var balanceDinamica = 0
    for(var i=0; i<fondos.length; i++){
      if (fondos[i].fund == 'FPV_BTG_PACTUAL_RECAUDADORA'){
        balanceRecaudadora += parseInt(fondos[i].balance)
      }
      if (fondos[i].fund == 'FPV_BTG_PACTUAL_ECOPETROL'){
        balanceEcopetrol += parseInt(fondos[i].balance)
      }
      if (fondos[i].fund == 'DEUDAPRIVADA'){
        balanceDeudaPrivada += parseInt(fondos[i].balance)
      }
      if (fondos[i].fund == 'FDO-ACCIONES'){
        balanceAcciones += parseInt(fondos[i].balance)
      }
      if (fondos[i].fund == 'FPV_BTG_PACTUAL_DINAMICA'){
        balanceDinamica += parseInt(fondos[i].balance)
      }
    }
    let response = {
      balanceRecaudadora: balanceRecaudadora,
      balanceEcopetrol: balanceEcopetrol,
      balanceDeudaPrivada:balanceDeudaPrivada,
      balanceAcciones:balanceAcciones,
      balanceDinamica:balanceDinamica,
    }
    res.json(response)
  }

  static async apiGetHistorical(req, res, next) {
    const { usersList,totalNumusers } = await userDAO.getUsers()
    var historical = usersList[0]['historical']
    let response = {
      "historical":historical
    }
    res.json(response)
  }
  static async apiGetBalance(req, res, next) {
    const { usersList,totalNumusers } = await userDAO.getUsers()
    var balance = usersList[0]['saldo']
    let response = {
      "balance":balance
    }
    res.json(response)
  }

  static async apiPushFund(req, res, next) {
    var balance = req.body.balance
    var fund = req.body.fund
    const { usersList,totalNumusers } = await userDAO.getUsers()
    var balance_prev = usersList[0]['saldo']
    var result = await userDAO.pushFund(fund,balance,balance_prev)
    let response 
    if (result == 'error'){
      res.status(400).send('No diligencio un campo!')
    }
    else if(result == 'insuficiente'){
      res.status(202).send("Fondos insuficientes")
    }
    else if(result == 'fondos_insuficientes'){
      res.status(201).send("Fondos insuficientes")
    }
    else{
      var new_balance = balance_prev - balance
      await userDAO.updateUserBalance(new_balance)
      response== {
        "status": "done"
      }
      res.json(response)
    }
    
  } 
  static async apiPopFund(req, res, next) {
    const { usersList,totalNumusers } = await userDAO.getUsers()
    var balance_prev = usersList[0]['saldo']
    var fund = req.body.fund
    var fondos = usersList[0]['fondos']
    var balance_inversiones = 0
    for(var i=0; i<fondos.length; i++){
      if (fondos[i].fund == fund){
        balance_inversiones += parseInt(fondos[i].balance)
      }
    }
    console.log(fund)
    if (balance_inversiones == 0){
      res.status(202).send("No tiene inversiones en este fondo")
    }
    else{
      var balance = balance_prev + balance_inversiones
      await userDAO.updateUserBalance(balance)
      var result = await userDAO.popFund(fund,balance_inversiones)
      let response 
      response= {
        "status": "done"
      }
      res.json(response)
      }
    }
    
}