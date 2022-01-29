// eslint-disable-next-line no-undef
module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/Crazy_Time',
                permanent: true,
            },
        ]
    },
}