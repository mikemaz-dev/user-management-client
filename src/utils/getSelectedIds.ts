export const getSelectedIds = (selected: Record<string, boolean>) =>
	Object.entries(selected)
		.filter(([_, sel]) => sel)
		.map(([id]) => id)
