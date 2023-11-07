import { DbFactory } from '../src/db/dbfactory';
import { CyclicDb } from '../src/db/cyclicdb';
import { LocalDb } from '../src/db/localdb';

describe('DbFactory', () => {
  it('should produce CyclicDb when CYCLIC_DB is set', () => {
    process.env.CYCLIC_DB = 'true';
    const db = DbFactory.getDb();
    expect(db).toBeInstanceOf(CyclicDb);
    delete process.env.CYCLIC_DB;
  });

  it('should produce LocalDb', () => {
    const db = DbFactory.getDb();
    expect(db).toBeInstanceOf(LocalDb);
  });
});