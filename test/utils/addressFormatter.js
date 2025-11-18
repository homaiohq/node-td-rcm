import test from 'ava';
import { formatAddressToDGFIP } from '../../lib/utils/addressFormatter.js';

/**
 * Test cases covering all edge cases encountered during development:
 *
 * 1. Simple address with street number
 * 2. TER repetition index
 * 3. BIS repetition (letter form)
 * 4. BIS repetition (full word)
 * 5. QUATER repetition
 * 6. Inline apartment info (extracted to complement)
 * 7. Address2 field for apartment info
 * 8. Accented street type (cité)
 * 9. Comma separator after number (French format)
 * 10. Address without street number
 * 11. City with postal code prefix (should be cleaned)
 * 12. Complex multi-part comma-separated address
 * 13. Street name containing a street type word (Terrasse) - should prioritize earlier match
 * 14. Résidence keyword
 * 15. Avenue abbreviation
 * 16. Boulevard abbreviation
 * 17. Impasse with long street name (truncation)
 * 18. Postal code with leading zeros
 */
const testCases = [
  {
    description: 'Simple address with street number',
    input: {
      address: '3TER RUE JEAN MERMOZ',
      address2: null,
      city: 'VERSAILLES',
      postalCode: '78000'
    },
    expected: {
      R127: '                                ',
      R128: '0003',
      R129: 'T',
      R130: ' ',
      R131: 'RUE  JEAN MERMOZ          ',
      R132: '00000',
      R133: ' ',
      R134: 'VERSAILLES                ',
      R135: '78000',
      R136: ' ',
      R137: 'VERSAILLES                '
    }
  },
  {
    description: 'TER repetition index',
    input: {
      address: '25TER avenue Émile Zola',
      address2: null,
      city: 'Paris',
      postalCode: '75015'
    },
    expected: {
      R127: '                                ',
      R128: '0025',
      R129: 'T',
      R130: ' ',
      R131: 'AV   Émile Zola           ',
      R132: '00000',
      R133: ' ',
      R134: 'PARIS                     ',
      R135: '75015',
      R136: ' ',
      R137: 'PARIS                     '
    }
  },
  {
    description: 'BIS repetition (letter form)',
    input: {
      address: '10B rue Victor Hugo',
      address2: null,
      city: 'Lyon',
      postalCode: '69003'
    },
    expected: {
      R127: '                                ',
      R128: '0010',
      R129: 'B',
      R130: ' ',
      R131: 'RUE  Victor Hugo          ',
      R132: '00000',
      R133: ' ',
      R134: 'LYON                      ',
      R135: '69003',
      R136: ' ',
      R137: 'LYON                      '
    }
  },
  {
    description: 'BIS repetition (full word)',
    input: {
      address: '10 BIS rue Victor Hugo',
      address2: null,
      city: 'Lyon',
      postalCode: '69003'
    },
    expected: {
      R127: '                                ',
      R128: '0010',
      R129: 'B',
      R130: ' ',
      R131: 'RUE  Victor Hugo          ',
      R132: '00000',
      R133: ' ',
      R134: 'LYON                      ',
      R135: '69003',
      R136: ' ',
      R137: 'LYON                      '
    }
  },
  {
    description: 'QUATER repetition',
    input: {
      address: '5 QUATER boulevard Saint-Michel',
      address2: null,
      city: 'Bordeaux',
      postalCode: '33000'
    },
    expected: {
      R127: '                                ',
      R128: '0005',
      R129: 'Q',
      R130: ' ',
      R131: 'BD   Saint-Michel         ',
      R132: '00000',
      R133: ' ',
      R134: 'BORDEAUX                  ',
      R135: '33000',
      R136: ' ',
      R137: 'BORDEAUX                  '
    }
  },
  {
    description: 'Inline apartment info (should be extracted to complement)',
    input: {
      address: '12 rue de la Paix Appt 5',
      address2: null,
      city: 'Nice',
      postalCode: '06000'
    },
    expected: {
      R127: 'Appt 5                          ',
      R128: '0012',
      R129: ' ',
      R130: ' ',
      R131: 'RUE  de la Paix           ',
      R132: '00000',
      R133: ' ',
      R134: 'NICE                      ',
      R135: '06000',
      R136: ' ',
      R137: 'NICE                      '
    }
  },
  {
    description: 'Address2 field for apartment info',
    input: {
      address: '8 avenue des Champs-Élysées',
      address2: 'Bâtiment A, 3ème étage',
      city: 'Paris',
      postalCode: '75008'
    },
    expected: {
      R127: 'Bâtiment A, 3ème étage          ',
      R128: '0008',
      R129: ' ',
      R130: ' ',
      R131: 'AV   des Champs-Élysées   ',
      R132: '00000',
      R133: ' ',
      R134: 'PARIS                     ',
      R135: '75008',
      R136: ' ',
      R137: 'PARIS                     '
    }
  },
  {
    description: 'Accented street type (cité)',
    input: {
      address: '7 cité Dupont',
      address2: null,
      city: 'Marseille',
      postalCode: '13001'
    },
    expected: {
      R127: '                                ',
      R128: '0007',
      R129: ' ',
      R130: ' ',
      R131: 'CITE Dupont               ',
      R132: '00000',
      R133: ' ',
      R134: 'MARSEILLE                 ',
      R135: '13001',
      R136: ' ',
      R137: 'MARSEILLE                 '
    }
  },
  {
    description: 'Comma separator after number (French format)',
    input: {
      address: '11, rue des Carmes',
      address2: null,
      city: 'Toulouse',
      postalCode: '31000'
    },
    expected: {
      R127: '                                ',
      R128: '0011',
      R129: ' ',
      R130: ' ',
      R131: 'RUE  des Carmes           ',
      R132: '00000',
      R133: ' ',
      R134: 'TOULOUSE                  ',
      R135: '31000',
      R136: ' ',
      R137: 'TOULOUSE                  '
    }
  },
  {
    description: 'Address without street number',
    input: {
      address: 'Place de la République',
      address2: null,
      city: 'Strasbourg',
      postalCode: '67000'
    },
    expected: {
      R127: '                                ',
      R128: '0000',
      R129: ' ',
      R130: ' ',
      R131: 'PL   de la République     ',
      R132: '00000',
      R133: ' ',
      R134: 'STRASBOURG                ',
      R135: '67000',
      R136: ' ',
      R137: 'STRASBOURG                '
    }
  },
  {
    description: 'City with postal code prefix (should be cleaned)',
    input: {
      address: '15 rue de la Liberté',
      address2: null,
      city: '93100 - MONTREUIL',
      postalCode: '93100'
    },
    expected: {
      R127: '                                ',
      R128: '0015',
      R129: ' ',
      R130: ' ',
      R131: 'RUE  de la Liberté        ',
      R132: '00000',
      R133: ' ',
      R134: 'MONTREUIL                 ',
      R135: '93100',
      R136: ' ',
      R137: 'MONTREUIL                 '
    }
  },
  {
    description: 'Complex multi-part comma-separated address',
    input: {
      address: "2 rue François Couzan, Appt 42, Bât. C, Carré de l'Eperon",
      address2: null,
      city: 'Versailles',
      postalCode: '78000'
    },
    expected: {
      R127: "Appt 42, Bât. C, Carré de l'Eper",
      R128: '0002',
      R129: ' ',
      R130: ' ',
      R131: 'RUE  François Couzan      ',
      R132: '00000',
      R133: ' ',
      R134: 'VERSAILLES                ',
      R135: '78000',
      R136: ' ',
      R137: 'VERSAILLES                '
    }
  },
  {
    description: 'Street name containing a street type word (Terrasse) - should prioritize earlier match',
    input: {
      address: '09 rue de la Terrasse',
      address2: null,
      city: 'Nantes',
      postalCode: '44000'
    },
    expected: {
      R127: '                                ',
      R128: '0009',
      R129: ' ',
      R130: ' ',
      R131: 'RUE  de la Terrasse       ',
      R132: '00000',
      R133: ' ',
      R134: 'NANTES                    ',
      R135: '44000',
      R136: ' ',
      R137: 'NANTES                    '
    }
  },
  {
    description: 'Résidence keyword',
    input: {
      address: 'Résidence Les Pins',
      address2: 'Bât B',
      city: 'Cannes',
      postalCode: '06400'
    },
    expected: {
      R127: 'Bât B                           ',
      R128: '0000',
      R129: ' ',
      R130: ' ',
      R131: 'RES  Les Pins             ',
      R132: '00000',
      R133: ' ',
      R134: 'CANNES                    ',
      R135: '06400',
      R136: ' ',
      R137: 'CANNES                    '
    }
  },
  {
    description: 'Avenue abbreviation',
    input: {
      address: '42 av Victor Hugo',
      address2: null,
      city: 'Lille',
      postalCode: '59000'
    },
    expected: {
      R127: '                                ',
      R128: '0042',
      R129: ' ',
      R130: ' ',
      R131: 'AV   Victor Hugo          ',
      R132: '00000',
      R133: ' ',
      R134: 'LILLE                     ',
      R135: '59000',
      R136: ' ',
      R137: 'LILLE                     '
    }
  },
  {
    description: 'Boulevard abbreviation',
    input: {
      address: '100 bd de la République',
      address2: null,
      city: 'Rennes',
      postalCode: '35000'
    },
    expected: {
      R127: '                                ',
      R128: '0100',
      R129: ' ',
      R130: ' ',
      R131: 'BD   de la République     ',
      R132: '00000',
      R133: ' ',
      R134: 'RENNES                    ',
      R135: '35000',
      R136: ' ',
      R137: 'RENNES                    '
    }
  },
  {
    description: 'Impasse with long street name (truncation)',
    input: {
      address: '5 impasse de la Très Longue Rue des Anciens Combattants',
      address2: null,
      city: 'Dijon',
      postalCode: '21000'
    },
    expected: {
      R127: '                                ',
      R128: '0005',
      R129: ' ',
      R130: ' ',
      R131: 'IMP  Anciens Combattants  ',
      R132: '00000',
      R133: ' ',
      R134: 'DIJON                     ',
      R135: '21000',
      R136: ' ',
      R137: 'DIJON                     '
    }
  },
  {
    description: 'Postal code with leading zeros',
    input: {
      address: '20 rue Principale',
      address2: null,
      city: 'Ajaccio',
      postalCode: '2000'
    },
    expected: {
      R127: '                                ',
      R128: '0020',
      R129: ' ',
      R130: ' ',
      R131: 'RUE  Principale           ',
      R132: '00000',
      R133: ' ',
      R134: 'AJACCIO                   ',
      R135: '02000',
      R136: ' ',
      R137: 'AJACCIO                   '
    }
  }
];

// Generate individual AVA tests for each test case
testCases.forEach((testCase, index) => {
  test(`${index + 1}. ${testCase.description}`, t => {
    const result = formatAddressToDGFIP(testCase.input);

    // Compare each field
    for (const field of ['R127', 'R128', 'R129', 'R130', 'R131', 'R132', 'R133', 'R134', 'R135', 'R136', 'R137']) {
      t.is(
        result[field],
        testCase.expected[field],
        `Field ${field} should match (expected length: ${testCase.expected[field].length}, actual length: ${result[field].length})`
      );
    }
  });
});
