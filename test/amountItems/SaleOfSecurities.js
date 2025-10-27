import test from 'ava';
import {ValidationError} from '../../lib/Validation';
import SaleOfSecurities from '../../lib/amountItems/SaleOfSecurities';

test('create instance', t => {
  const saleOfSecurities = new SaleOfSecurities({ AN: 38 });

  t.true(saleOfSecurities instanceof SaleOfSecurities);
});

test('set data', t => {
  const saleOfSecurities = new SaleOfSecurities({ AN: 38, AK: 2});

  t.deepEqual(saleOfSecurities.saleOfSecurities, { AN: 38, AK: 2});
});

test('export', t => {
  const saleOfSecurities = new SaleOfSecurities({ AN: 38, AK: 2});

  t.deepEqual(saleOfSecurities.export(), ['0000000038', '0000000002']);
});

test('throw on export is data is invalid', t => {
  const saleOfSecurities = new SaleOfSecurities({ AN: 'lol' });

  const error = t.throws(() => {
    saleOfSecurities.validation()
  }, ValidationError);

  t.is(error.name, 'ValidationError');
});

[{
  data: { AN: 38 },
}, {
  data: { AK: 8 },
}, {
  data: { AN: 38, AK: 8 },
}, {
  data: { AN: '38', AK: '8' },
}, {
  data: { AN: 0, AK: 0 }
}, {
  data: { AN: 'lol', AK: 'lol' },
  errors: { AN: [ 'An is not a number' ], AK: [ 'Ak is not a number' ] }
}, {
  data: { AN: 8.5, AK: 8.5 },
  errors: { AN: [ 'An must be an integer' ], AK: [ 'Ak must be an integer' ] }
},  {
  data: { AN: -1, AK: -1 },
  errors: { AN: [ 'An must be greater than or equal to 0' ], AK: [ 'Ak must be greater than or equal to 0' ] }
}, {
  data: { AN: 12345678901, AK: 12345678901 },
  errors: { AN: [ 'An must be less than or equal to 9999999999' ], AK: [ 'Ak must be less than or equal to 9999999999' ] }
}].forEach(({ data, errors }) => {
  test(`validation ${JSON.stringify(data)}`, t => {
    const saleOfSecurities = new SaleOfSecurities(data);

    if (!errors) {
      t.true(saleOfSecurities.validation());
    } else {
      const error = t.throws(() => {
        saleOfSecurities.validation()
      }, ValidationError);

      t.is(error.name, 'ValidationError');
      t.deepEqual(error.errors, errors);
    }
  });
});

test('default', t => {
  t.deepEqual(SaleOfSecurities.default(), ['0000000000', '0000000000']);
});
