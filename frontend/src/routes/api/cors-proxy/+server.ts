import { json } from '@sveltejs/kit';
import { corsHeaders } from '$lib/corsHeaders.js';

const format_url = (url: URL, param: string) => {
    const url_obj = new URL(url);
    const final_url = url_obj.searchParams.get(param);
    console.log(final_url);
    return final_url!;
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url, request }) {
    const final_url = format_url(url, 'url');
    const headers = new Headers(request.headers);
    // remove host header
    headers.delete('Host');
    let proxy_response = await fetch(final_url, {
        method: 'GET',
        headers: headers,
        redirect: 'manual' // set redirect to manual
    });

    // handle redirect manually
    if (proxy_response.status === 301 || proxy_response.status === 302) {
        let redirect_url = proxy_response.headers.get('Location');
        if (redirect_url) {
            proxy_response = await fetch(redirect_url, {
                method: 'GET',
                headers: headers,
                redirect: 'manual'
            });
        }
    }

    return proxy_response;
}

export async function POST({ request, url }) {
    const body = await request.blob();
    let headers = request.headers;
    headers.delete('Host');
    const final_url = format_url(url, 'url');

    try {
        const proxy_response = await fetch(final_url, {
            method: 'POST',
            body: body,
            headers: headers
        });

        return proxy_response;
    } catch (error) {

        return json({ msg: 'ERROR', error: error });
    }
}

export async function PATCH({ request, url }) {
    const formated_url = format_url(url, 'url');
    const body = await request.json();
    const headers = new Headers(request.headers);
    headers.delete('Host');
    try {
        const proxy_response = await fetch(formated_url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: headers
        })

        return proxy_response;

    } catch (error) {

        return json({ msg: 'ERROR', error: error });
    }

}

export async function PUT({ request, url }) {
    const formated_url = format_url(url, 'url');
    const body = await request.json();
    const headers = new Headers(request.headers);
    headers.delete('Host');
    try {
        const proxy_response = await fetch(formated_url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: headers
        })

        return proxy_response;

    } catch (error) {

        return json({ msg: 'ERROR', error: error });
    }
}

export async function DELETE({ request, url }) {
    const formated_url = format_url(url, 'url');
    const headers = new Headers(request.headers);
    headers.delete('Host');


    try {
        const proxy_response = await fetch(formated_url, {
            method: 'DELETE',
            headers: headers
        })

        return proxy_response;
    } catch (error) {

        return json({ msg: 'ERROR', error: error });
    }
}
