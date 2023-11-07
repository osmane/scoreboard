import { Shortener } from '../src/shortener';
import { LocalDb } from '../src/db/localdb';

describe('Shortener', () => {
  let shortener: Shortener;
  let localDb: LocalDb;

  beforeEach(() => {
    localDb = new LocalDb()
    shortener = new Shortener(localDb);
  });

  it('should shorten data', async () => {
    const data = { input: 'longurl' };
    const result = await shortener.shorten(data);

    expect(result).toEqual({
      input: 'longurl',
      key: '1',
      shortUrl: 'https://tailuge-billiards.cyclic.app/replay/1',
    });
  });
});