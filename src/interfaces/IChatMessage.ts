export interface IChatMessage {
	id: string;
	roomId: string;
	content: string;
	username: string;
	sentAt: string; // ISO string
}