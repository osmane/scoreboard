import request from 'supertest';
import server from '../src/index';

afterAll(()=>{
    server.close()
})

describe('Test the root path', () => {
    test('Get root responds', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toBe(200);
    });
});