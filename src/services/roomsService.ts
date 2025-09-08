import { Database, push, ref, remove, update } from 'firebase/database';

export class RoomsService {
	constructor(private db: Database) { }

	async updateRoomName(roomId: string, newName: string): Promise<void> {
		await update(
			ref(this.db, `rooms/${roomId}`),
			{ name: newName }
		);
	}

	async deleteRoom(roomId: string): Promise<void> {
		await remove(ref(this.db, `rooms/${roomId}`));
	}

	async createRoom(roomName: string): Promise<void> {
		await push(ref(this.db, 'rooms'), { name: roomName });
	}
}