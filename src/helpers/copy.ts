/**
 * Copies a string to the clipboard
 *
 * @param item The item to be copied to the clipboard
 */
export const copyMessage = (item: string) => {
	const listener = (e: ClipboardEvent) => {
		if (e.clipboardData) {
			e.clipboardData.setData('text/plain', item);
			e.preventDefault();
		}
	};

	document.addEventListener('copy', listener);
	document.execCommand('copy');
	document.removeEventListener('copy', listener);
};
