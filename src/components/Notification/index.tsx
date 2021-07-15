/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */

import { InviteNotification } from "./Invite";

interface NotificationChooserProps {
	notification: {
		_id: string;
		content: {
			type: string;
		};
	}
}

export function NotificationChooser({ notification }: NotificationChooserProps) {

	switch (notification.content.type) {
		case "invite":
			return <InviteNotification notification={notification as any} />
	}
}