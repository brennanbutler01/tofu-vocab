import { ImageReturn } from 'pages/api/upload';

//take a file, turn into form data and post to api upload endpoint
export async function uploadImage(file: File): Promise<ImageReturn> {
	const formData = new FormData();
	formData.append('file', file);

	return await fetch('/api/upload', { method: 'POST', body: formData }).then(
		res => res.json(),
	);
}
