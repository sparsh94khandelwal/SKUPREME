import { S3Handler } from "../S3/S3Handler";

export default class S3Client {
    private provideId: number;
    private orgId: number;

    constructor(provideId: number, orgId: number) {
        this.provideId = provideId;
        this.orgId = orgId;
    }

    static getInstance = (providerId: number, orgId: number) => {
        if (providerId && orgId) {
            return new S3Client(providerId, orgId);
        }
        throw new Error("Missing Params: Required ProviderId or OrgShortCode are not passed!");
    };

    public s3Put(key: string, logJSON: object, bucket: string) {
        key = `${this.provideId}/${this.orgId}/${key.trim()}`;
        console.log(bucket, key, logJSON);
        let s3Handler = new S3Handler();
        return s3Handler.upload({
            Bucket: bucket,
            Key: `${key}.json`,
            Body: Buffer.from(JSON.stringify(logJSON)),
            ContentEncoding: "UTF-8",
            ContentType: "application/json"
        });
    }

    public s3Get(key: string, bucket: string) {
        key = `${this.provideId}/${this.orgId}/${key.trim()}`;
        let s3Handler = new S3Handler();
        return s3Handler.fetch({
            Bucket: bucket,
            Key: `${key}.json`
        });
    }

    public s3ListObjects(bucket: string) {
        let s3Handler = new S3Handler();
        return s3Handler.getObjects({
            Bucket: bucket
        });
    }
}
