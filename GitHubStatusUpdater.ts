import fetch from 'node-fetch';
import nodeEmoji from 'node-emoji';

export class GitHubStatusUpdater {
    protected readonly baseurl = 'https://api.github.com/graphql';
    protected authToken: string;

    constructor (authToken: string) {
        this.authToken = authToken;
    }

    async updateStatus (emojiString: string, message: string, limitedAvailability: boolean = false) {
        let emoji = null;

        if (emojiString) {
            emoji = nodeEmoji.get(emojiString);
        }

        const clientMutationId = 'test';
        const query = `mutation ChangeUserStatus($input: ChangeUserStatusInput!) {
            changeUserStatus(input: $input) {
                clientMutationId
            }
        }`;

        return await fetch(this.baseurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.authToken
            },
            body: JSON.stringify({
                query,
                variables: {
                    input: {
                        emoji,
                        message,
                        limitedAvailability,
                        clientMutationId
                    }
                }
            })
        });
    }
}
