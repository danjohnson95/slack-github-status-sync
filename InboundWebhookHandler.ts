import { APIGatewayProxyEvent } from "aws-lambda";
import { GitHubStatusUpdater } from "./GitHubStatusUpdater";

export default class InboundWebhookHandler {
    protected event: APIGatewayProxyEvent;
    protected body: any;

    constructor (event: APIGatewayProxyEvent) {
        this.event = event;
        this.body = JSON.parse(event.body);
    }

    protected isUserAuthed(): boolean {
        return this.body.authed_users.includes(this.body.event.user.id);
    }

    protected getAccessToken(): string {
        return '';
    }

    async handle () {
        if (! this.isUserAuthed()) {
            return {
                statusCode: 204,
                body: 'User not subscribed'
            };
        }

        const accessToken = this.getAccessToken();
        const updater = new GitHubStatusUpdater(accessToken);

        await updater.updateStatus(
            this.body.event.user.profile.status_emoji,
            this.body.event.user.profile.status_text,
            false
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Status updated for ' + this.body.event.user.real_name,
            })
        }
    }
}
