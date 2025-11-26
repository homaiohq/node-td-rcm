import fs from 'fs';
import T0Totalization from './T0Totalization.js';

/**
 * @typedef {import('./D0Issuer.js').default} D0Issuer
 * @typedef {import('./R1Recipient.js').default} R1Recipient
 * @typedef {import('./R2Amount.js').default} R2Amount
 */

/**
 * RCM class
 */
class RCM {
  /**
   * @param  {D0Issuer} d0
   * @param  {Object}   [personInCharge]
   * @param  {String}   [personInCharge.fullname]  T010 Nom Prénom
   * @param  {String}   [personInCharge.phone]     T011 Numéro de téléphone
   * @param  {String}   [personInCharge.email]     T012 Adresse courriel
   */
  constructor(d0, personInCharge = {}) {
    this.d0 = d0;
    this.personInCharge = personInCharge;
    this.recipients = [];
  }

  /**
   * Add Recipient
   *
   * @param {R1Recipient} r1
   * @param {R2Amount}    [r2]
   * @param {Object}      [r3] unimplemented
   * @param {Object}      [r4] unimplemented
   */
  addRecipient(r1, r2, r3, r4) {
    // Only include r2, r3, r4 if they were actually provided (not undefined)
    const recipient = [r1];
    if (r2 !== undefined) recipient.push(r2);
    if (r3 !== undefined) recipient.push(r3);
    if (r4 !== undefined) recipient.push(r4);

    this.recipients.push(recipient);
  }

  /**
   * Export data
   *
   * @param  {Boolean} [inline=false] Set to `true` for inline export
   * @return {String|Array}
   */
  export(inline = false) {
    const t0 = new T0Totalization(this).export();
    const d0 = this.d0.export();

    const exportedRecipient = this.recipients.reduce((acc, r) => {
        const r0 = r[0].export();
        const r1 = r[1].export();

        return acc.concat((inline) ? [
          '\n',
          ...r0,
          '\n',
          ...r1
        ] : [
          ...r0,
          ...r1
        ]);
    }, []);

    return (inline) ? [
      ...d0,
      ...exportedRecipient,
      '\n',
      ...t0
    ].join('') : [
      ...d0,
      ...exportedRecipient,
      ...t0
    ];
  }

  toFile(filename) {
    return new Promise((resolve, reject) => {
      try {
        const exportedRcm = this.export(true);

        fs.writeFile(filename, exportedRcm, 'utf-8', (err) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        })
      } catch (err) {
        return reject(err)
      }
    });
  }
}

export default RCM;
