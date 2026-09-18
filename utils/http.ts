export class HttpError extends Error {
	constructor(readonly status: number) {
		super(`Request failed with HTTP status ${status}`);
		this.name = 'HttpError';
	}
}

export class Http {
	constructor(
		private readonly fetchRequest: typeof fetch = (...args) =>
			fetch(...args),
	) {}

	private async request<T>(url: string, init?: RequestInit): Promise<T> {
		const response = await this.fetchRequest(url, {
			...init,
			headers: { 'Content-Type': 'application/json', ...init?.headers },
		});
		if (!response.ok) throw new HttpError(response.status);
		return response.json();
	}

	get = <T>(url: string) => this.request<T>(url);
	post = <T, B>(url: string, body: B) =>
		this.request<T>(url, { method: 'POST', body: JSON.stringify(body) });
	put = <T, B>(url: string, body: B) =>
		this.request<T>(url, { method: 'PUT', body: JSON.stringify(body) });
	delete = <T>(url: string) => this.request<T>(url, { method: 'DELETE' });
}

export default new Http();
