import validate from 'validate.js';
import {ValidationError} from '../Validation.js';
import {numberPad, fillWithPattern} from '../utils/index.js';

/**
 * SaleOfSecurities Class
 *
 * Cession de valeurs mobilières
 * R230 - R231
 *
 * @private
 */
class SaleOfSecurities {
  /**
   * @param {Object}  saleOfSecurities
   * @param {Number}  [saleOfSecurities.AN]  R230 Montant total des cessions
   * @param {Number}  [saleOfSecurities.AK]  R231 Soultes reçues lors d'opérations d'échange ou d'apport de titres
   */
  constructor(saleOfSecurities) {
    this.saleOfSecurities = saleOfSecurities;
  }

  export() {
    this.validation();

    return [
      numberPad(this.saleOfSecurities.AN, 10),
      numberPad(this.saleOfSecurities.AK, 10)
    ];
  }

  validation() {
    const saleOfSecuritiesSchema = {
      AN: {
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 9999999999
        }
      },
      AK: {
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 9999999999
        }
      }
    };

    const invalid = validate(this.saleOfSecurities, saleOfSecuritiesSchema);

    if (invalid) {
      throw new ValidationError(invalid);
    } else {
      return true;
    }
  }

  static default() {
    return fillWithPattern('10N10N');
  }
}

export default SaleOfSecurities;
