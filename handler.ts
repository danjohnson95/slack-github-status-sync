import { APIGatewayProxyHandler } from 'aws-lambda';
import InboundWebhookHandler from './InboundWebhookHandler';
import 'source-map-support/register';

export const webhook: APIGatewayProxyHandler = async (event, _context) => {
  const body = JSON.parse(event.body);

  switch (body.event.type) {
    case 'user_change':
      return await statusUpdater(event, _context);
    default:
      return await botCommunication(event, _context);
  }
}

export const accountLinker: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(event)
  };
}

const statusUpdater = async (event, _context) => {
  const handler = new InboundWebhookHandler(event);

  return handler.handle();
}

const botCommunication = async (event, _context) => {
  
}