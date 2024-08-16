const ACC_TYPE = {
    PERSONAL: 'personal',
    AGENT: 'agent',
    MARCHENT: 'marchent',
    SUPERADMIN: 'superadmin',
}

const ACC_STATUS = {
    ACTIVE: 'active',
    BLOCKED: 'blocked',
    PENDING: 'pending',
}

const SUSPICION = {
    LOGIN: 'login',
    PIN: 'pin',
}

const TRANSACTION_TYPE = {
    CASHIN: 'cashin',
    CASHOUT: 'cashout',
    SENDMONEY: 'sendmoney',
    PAYMENT: 'payment',
    LEND: 'lend',
}

const TRANSACTION_STATUS = {
    SUCCESSFUL: 'successful',
    FAILED: 'failed',
}

const NOTIFIED_STATUS = {
    SUCCESSFUL: 'successful',
    FAILED: 'failed',
    PENDING: 'pending',
}

module.exports = {
    ACC_TYPE,
    ACC_STATUS,
    SUSPICION,
    TRANSACTION_TYPE,
    TRANSACTION_STATUS,
    NOTIFIED_STATUS,
}
