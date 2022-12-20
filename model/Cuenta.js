

//clase para modelar las cuentas

class Cuenta {

    constructor(Account, Client, Comment, debitValue, creditValue, reference, agencyCode ){
        this.account = Account,
        this.client = Client,
        this.comment = Comment,
        this.debitValue = debitValue,
        this.creditValue = creditValue,
        this.reference = reference,
        this.agencyCode = agencyCode
    }
}


module.exports = Cuenta

