import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = process.env.REACT_APP_API_URL;
const httpClient = fetchUtils.fetchJson;

const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}/list?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json.data,
                total: json.totalCount,
            };
        }
        );
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/Get/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: (resource, params) => {
        const { relatedItems, ...newData } = params.data;
        return httpClient(`${apiUrl}/${resource}/upsert/${params.id}`, {
            method: 'Post',
            body: JSON.stringify(newData),
        }).then(({ json }) => {
            console.log(json);
            var result = {
                data: json.data
            };
            console.log(result);
            return result;
        });
    },

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            return {
                data: json.data
            };
        });
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/create`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    get: (url) => {
        return httpClient(`${apiUrl}/${url}`, {
            method: 'GET'
        }).then(({ json }) => ({ data: json }));
    },

    post: (url, params) => {
        return httpClient(`${apiUrl}/${url}`, {
            method: 'POST',
            body: JSON.stringify(params)
        }).then(({ json }) => ({ data: json }));
    }
};

export default dataProvider;