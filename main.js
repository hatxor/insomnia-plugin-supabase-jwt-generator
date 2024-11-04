const { createSigner } = require('fast-jwt');

const ALGORITHM = 'HS256';

module.exports.templateTags = [{
    name: 'supabaseJwt',
    displayName: 'Supabase JWT',
    description: 'Generates a Supabase valid JWT',
    args: [
        {
            displayName: 'User Email',
            description: 'The email address of the user on behalf of whom the token will be issued',
            placeholder: 'john.doe@example.com',
            type: 'string',
        },
        {
            displayName: 'User Id',
            description: 'The id of the user on behalf of whom the token will be issued (UUID v4)',
            placeholder: '97aa977d-b5fa-44fc-a161-9c0ffb80e13a',
            type: 'string',
        },
        {
            displayName: 'Expiration time',
            description: 'Minutes during which the generated token will be valid',
            defaultValue: 60,
            type: 'number',
        },
        {
            displayName: 'Project URL',
            description: 'Supabase Project URL (acts as issuer)',
            placeholder: 'https://project-id.supabase.co/auth/v1',
            type: 'string',
        },
        {
            displayName: 'JWT Secret',
            description: 'JWT Secret provided by Supabase used to sign JWTs',
            type: 'string',
        }
    ],
    
    async run(context, email, sub, expMin, iss, jwtSecret) {

        const iat = Math.floor(new Date().getTime() / 1000);
        const exp = iat + expMin * 60;

        const signer = createSigner({ key: jwtSecret, algorithm: ALGORITHM });

        const payload = {
            iss,
            aud: "authenticated",
            iat,
            exp,
            sub,
            email,
            role: "authenticated",
            app_metadata: {
                provider: "email"
            },
            user_metadata: null,
            aal: "aal1",
            amr: [
                {
                    method: "password",
                    timestamp: iat
                }
            ],
            is_anonymous: false
        };
        return signer(payload);
    }
}];