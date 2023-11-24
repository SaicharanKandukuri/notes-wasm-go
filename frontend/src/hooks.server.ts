import { corsHeaders } from '$lib/corsHeaders';
import type { Handle } from '@sveltejs/kit';

/*
    SOURCE: https://github.com/sveltejs/kit/issues/5193#issuecomment-1383161029

    -- MSG --
    dj-nuo commented on Jan 15 • 
    I managed to make OPTIONS work. (This option works for me locally & on Vercel, but most probably it would work elsewhere as well).
    This is needed if you're planning to invoke your function from a browser & solve CORS warning in SvelteKit.

    In your hooks.server.ts use this:

    import { corsHeaders } from '$lib/server/corsHeaders';
    import type { Handle } from '@sveltejs/kit';

    export const handle: Handle = async ({ event, resolve }) => {
        if (event.request.method !== 'OPTIONS') {
            const response = await resolve(event);
            for (const [key, value] of Object.entries(corsHeaders)) {
                response.headers.set(key, value);
            }
            return response;
        }

        return new Response('ok', { headers: corsHeaders });
    };
    I separated corsHeaders as server const in $lib/server/corsHeaders.ts

    export const corsHeaders = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Headers':
            'authorization, x-client-info, apikey, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    };
    As a Bonus - you can modify the behaviour of your OPTIONS response to set Access-Control-Allow-Origin to only list of origin urls that you trust (e.g. localhost & your domains for staging, prod).
    Additionally, you can also define which routes you allow from which origins.
    Just console.log(event) to see which properties you might utilize 😉

    p.s. just a junior developer here trying to help fellow devs
*/

export const handle: Handle = async ({ event, resolve }) => {
    if (event.request.method !== 'OPTIONS') {
        const response = await resolve(event);

        // clone headers before mutating them
        // (https://github.com/sveltejs/kit/pull/10030/files#diff-7a5a1441a4765c525635c31466bc75c520fb481ec56d1606894270a73986ff86R58)
        const headers = new Headers(response.headers);

        for (const [key, value] of Object.entries(corsHeaders)) {
            headers.set(key, value);
        }
        return response;
    }

    console.log('=> HOOK | handeled OPTIONS request');
    return new Response('ok', { headers: corsHeaders });
};
