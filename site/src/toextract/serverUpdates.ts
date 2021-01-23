export const sendServerUpdateNewComponent = () => {
    return fetch('http://localhost:4000/component/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hello: 'world',
        })
    })
}