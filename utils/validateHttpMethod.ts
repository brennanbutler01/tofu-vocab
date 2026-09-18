export enum HttpMethods {
	GET = 'GET',
	POST = 'POST',
	PATCH = 'PATCH',
	PUT = 'PUT',
	HEAD = 'HEAD',
	DELETE = 'DELETE',
	CONNECT = 'CONNECT',
	TRACE = 'TRACE',
}

//this function makes sure that the http method we are using is allowed by the endpoint
export function validateHttpMethod(
	method: HttpMethods,
	allowedMethods: Array<HttpMethods>,
	endpoint: string,
) {
	const status = { error: false, message: 'ok', endpoint };

	//if our attempted method is not allowed...
	if (!allowedMethods.includes(method)) {
		status.error = true;
		status.message = `Error: ${endpoint} does not allowed ${method} requests, only ${allowedMethods} requests.`;
	}

	return status;
}
