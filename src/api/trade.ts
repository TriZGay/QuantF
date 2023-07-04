import request from '@/utils/request'

export function refreshPositions() {
    return request.get<string>("/api/acc/refreshAllPosition")
}