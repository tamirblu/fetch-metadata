import csrf from 'csrf';

const tokens = new csrf();

export const csrfMiddleware = (handler) => async (req, res) => {
    const csrfToken = req.cookies['csrf-token'];
    // Generate token on initial request (e.g., GET request)
    if (!csrfToken) {
        const newCsrfToken = tokens.create(process.env.CSRF_SECRET);
        res.setHeader('Set-Cookie', `csrf-token=${newCsrfToken}; Path=/`);
    }
    if (req.method === 'GET' ) {
        console.log('inside get');
        return handler(req, res);
    }

    // Validate CSRF token on POST/PUT/DELETE requests
    if (req.method !== 'GET') {
        console.log('inside post');
        console.log(csrfToken);

        if (!csrfToken || !tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
            return res.status(403).json({ message: 'Invalid CSRF token' });
        }
    }

    return handler(req, res);
};