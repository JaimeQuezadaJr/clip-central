from index import app


# Vercel serverless function handler
def handler(request, response):
    with app.test_client() as client:
        resp = client.open(
            path=request.path,
            method=request.method,
            headers={key: value for key, value in request.headers.items()},
            data=request.data,
            environ_base={"REMOTE_ADDR": request.headers.get("x-forwarded-for", "")},
        )

        # Copy status code
        response.status_code = resp.status_code

        # Copy headers
        for key, value in resp.headers.items():
            response.headers[key] = value

        # Return response body
        return resp.data
