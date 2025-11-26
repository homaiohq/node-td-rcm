import {fillWithPattern} from './utils/index.js';
import {FixedIncomeProducts, CrowdfundingProducts, TaxCredit, Fees, IncomeSubjectToIncomeTax, SaleOfSecurities} from './amountItems/index.js';

/**
 * @typedef {import('./indicativeArea/AmountIndicativeArea.js').default} AmountIndicativeArea
 * @typedef {import('./amountItems/TaxCredit.js').default} TaxCredit
 * @typedef {import('./amountItems/SaleOfSecurities.js').default} SaleOfSecurities
 * @typedef {import('./amountItems/IncomeSubjectToIncomeTax.js').default} IncomeSubjectToIncomeTax
 * @typedef {import('./amountItems/FixedIncomeProducts.js').default} FixedIncomeProducts
 * @typedef {import('./amountItems/CrowdfundingProducts.js').default} CrowdfundingProducts
 * @typedef {import('./amountItems/Fees.js').default} Fees
 */

/**
 * R2Amount Class
 *
 * R 2 Zone
 */
class R2Amount {
  /**
   * @param  {Object}
   * @param  {AmountIndicativeArea}     [blocks.amountIndicativeArea]
   * @param  {TaxCredit}                [blocks.taxCredit]
   * @param  {Object}                   [blocks.R213R224] (unimplemented)
   * @param  {Object}                   [blocks.R226R228] (unimplemented)
   * @param  {SaleOfSecurities}         [blocks.saleOfSecurities]
   * @param  {IncomeSubjectToIncomeTax} [blocks.incomeSubjectToIncomeTax]
   * @param  {FixedIncomeProducts}      [blocks.fixedIncomeProducts]
   * @param  {CrowdfundingProducts}     [blocks.crowdfundingProducts]
   * @param  {Object}                   [blocks.R245R248] (unimplemented)
   * @param  {Object}                   [blocks.R252R254] (unimplemented)
   * @param  {Object}                   [blocks.R249R250] (unimplemented)
   * @param  {Fees}                     [blocks.fees]
   * @param  {Object}                   [blocks.R261R262] (unimplemented)
   * @param  {Object}                   [blocks.R264] (unimplemented)
   */
  constructor(blocks) {
    [
      'amountIndicativeArea',
      'taxCredit',
      'R213R224',
      'R226R228',
      'saleOfSecurities',
      'incomeSubjectToIncomeTax',
      'fixedIncomeProducts',
      'crowdfundingProducts',
      'R245R248',
      'R252R254',
      'R249R250',
      'fees',
      'R261R262',
      'R264'
    ].forEach((blockName) => {
      this[blockName] = blocks[blockName]
    });
  }

  export() {
    return [
      ...this.amountIndicativeArea.export(),
      ...((this.taxCredit) ? this.taxCredit.export() : TaxCredit.default()),
      ...fillWithPattern('10X10N10N10N10N10X10N10N10N'),
      ...fillWithPattern('10N10N10N'),
      ...((this.saleOfSecurities) ? this.saleOfSecurities.export() : SaleOfSecurities.default()),
      ...((this.incomeSubjectToIncomeTax) ? this.incomeSubjectToIncomeTax.export() : IncomeSubjectToIncomeTax.default()),
      ...((this.fixedIncomeProducts) ? this.fixedIncomeProducts.export() : FixedIncomeProducts.default()),
      ...((this.crowdfundingProducts) ? this.crowdfundingProducts.export() : CrowdfundingProducts.default()),
      ...fillWithPattern('10N10N10N10N'),
      ...fillWithPattern('10N10N10N'),
      ...fillWithPattern('10N10N'),
      ...((this.fees) ? this.fees.export() : Fees.default()),
      ...fillWithPattern('10N10N'),
      ...fillWithPattern('10N'),
      // R371 reserved area filled with spaces
      ...fillWithPattern('379X')
    ];
  }

  validation() {
    this.amountIndicativeArea.validation();

    if (this.taxCredit) {
      this.taxCredit.validation();
    }

    if (this.grossAmountRevenues) {
      this.grossAmountRevenues.validation();
    }

    if (this.saleOfSecurities) {
      this.saleOfSecurities.validation();
    }

    if (this.incomeSubjectToIncomeTax) {
      this.incomeSubjectToIncomeTax.validation();
    }

    if (this.fixedIncomeProducts) {
      this.fixedIncomeProducts.validation();
    }

    if (this.crowdfundingProducts) {
      this.crowdfundingProducts.validation();
    }

    if (this.fees) {
      this.fees.validation();
    }

    return true;
  }
}

export default R2Amount;
