import request from '@/utils/request'

export interface Account {

}

export interface AccountResult {
    records: Account[],
}

export function fetchAccounts() {
    return request.get<AccountResult>("/aapi/acc/accounts")
}

export function refreshAcc() {
    return request.get<String>("/aapi/acc/refresh")
}

export function refreshFunds() {
    return request.get<String>("/aapi/acc/refreshAllFunds")
}

export function fetchAccInfoByAccId(accId: string) {
    return request.get("/aapi/acc/info/" + accId)
}