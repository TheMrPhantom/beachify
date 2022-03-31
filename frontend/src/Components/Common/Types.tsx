export type Song = {
    databaseID?: number,
    songname: string,
    album: string,
    trackID: string,
    coverURL: string,
    interpret: string,
    duration: number,
    startsAt: number,
    upvotes?: number,
    downvotes?: number,
    alreadyAdded?: boolean,
    approvalPending?: boolean
}