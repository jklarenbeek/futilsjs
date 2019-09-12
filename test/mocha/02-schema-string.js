/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

registerDefaultFormatCompilers();

// https://json-schema.org/understanding-json-schema/reference/string.html

describe('Schema String Type', function () {

  describe('#stringBasic()', function () {
    it('should validate string types only', function () {
      compileJSONSchema('stringBasic1', { type: 'string' });

      const root = getJSONSchema('stringBasic1');
      assert.isFalse(root.validate(null), 'not validates null');
      assert.isTrue(root.validate('Déjà vu'), 'validates a string with accents');
      assert.isTrue(root.validate(''), 'validates an empty string');
      assert.isFalse(root.validate(42), 'not validates a number');
    });

    it('should validate strings by length', function () {
      compileJSONSchema('stringLength1', {
        type: 'string',
        minLength: 2,
        maxLength: 3,
      });

      const root = getJSONSchema('stringLength1');
      assert.isFalse(root.validate('A'), 'A string is too small');
      assert.isTrue(root.validate('AB'), 'AB string has valid length');
      assert.isTrue(root.validate('ABC'), 'ABC string has valid length');
      assert.isFalse(root.validate('ABCD'), 'ABCD is to long');
    });

    it('should validate strings by pattern', function () {
      compileJSONSchema('stringPattern1', {
        type: 'string',
        pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$',
      });

      const root = getJSONSchema('stringPattern1');
      assert.isTrue(root.validate('555-1212'), '555-1212 is a local phonenumber');
      assert.isTrue(root.validate('(888)555-1212'), 'is valid phonenumber with area code');
      assert.isFalse(root.validate('(888)555-1212 ext. 532'), 'is not valid phonenumber with extension');
      assert.isFalse(root.validate('(800)FLOWERS'), 'is not valid phonenumber by letters');
    });
  });

  describe('#stringFormat()', function () {
    it('should validate a RFC3339 date-time format', function () {
      compileJSONSchema('fdatetime1', { format: 'date-time' });

      const root = getJSONSchema('fdatetime1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('1963-06-19T08:30:06.283185Z'), 'a valid date-time string');
      assert.isTrue(root.validate('1963-06-19T08:30:06Z'), 'a valid date-time string without second fraction');
      assert.isTrue(root.validate('1937-01-01T12:00:27.87+00:20'), 'a valid date-time string with plus offset');
      assert.isTrue(root.validate('1990-12-31T15:59:50.123-08:00'), 'a valid date-time string with minus offset');
      assert.isFalse(root.validate('1990-02-31T15:59:60.123-08:00'), 'an invalid day in date-time string');
      assert.isFalse(root.validate('1990-12-31T15:59:60-24:00'), 'an invalid offset in date-time string');
      assert.isFalse(root.validate('06/19/1963 08:30:06 PST'), 'an invalid date-time string');
      // assert.isTrue(root.validate('06/19/1963 08:30:06 PST'), 'a local date-time string');
      assert.isTrue(root.validate('1963-06-19t08:30:06.283185z'), 'case-insensitive T and Z');
      assert.isFalse(root.validate('2013-350T01:01:01'), 'only RFC3339 not all of ISO 8601 are valid');
    });
    it('should validate a RFC3339 date string', function () {
      compileJSONSchema('fdate1', { format: 'date' });

      const root = getJSONSchema('fdate1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('1963-06-19'), 'a valid date string');
      assert.isFalse(root.validate('06/19/1963'), 'a different valid date string');
      // assert.isFalse(root.validate('06/19/1963'), 'an invalid date string');
      assert.isFalse(root.validate('2013-350'), 'only RFC3339 not all of ISO 8601 are valid');
    });
    it('should validate a RFC3339 time string', function () {
      compileJSONSchema('ftime1', { format: 'time' });

      const root = getJSONSchema('ftime1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('08:30:06Z'), 'a valid time string');
      assert.isTrue(root.validate('08:30:06.283185Z'), 'a valid time string with milliseconds');
      assert.isTrue(root.validate('08:30:06+01:00'), 'a valid time string with plus offset');
      assert.isTrue(root.validate('08:30:06.123+01:00'), 'a valid time string with millseconds and plus offset');
      assert.isTrue(root.validate('08:30:06-01:00'), 'a valid time string with min offset');
      assert.isFalse(root.validate('08:30:06'), 'an invalid time string without Z');
      assert.isFalse(root.validate('08:30:06 PST'), 'an invalid time string');
      assert.isFalse(root.validate('01:01:01,1111'), 'only RFC3339 not all of ISO 8601 are valid');
    });
    it('should validate alpha characters only', function () {
      compileJSONSchema('falpha1', { format: 'alpha' });
      const root = getJSONSchema('falpha1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('bitSOCIAL'), 'a valid letters only string');
      assert.isFalse(root.validate('2962'), 'an invalid string with numbers');
      assert.isFalse(root.validate('bit2SOCIAL'), 'an invalid mixed string with one number');
      assert.isFalse(root.validate('bit-SOCIAL'), 'an invalid mixed string with one symbol');
    });
    it('should validate alphanumeric characters only', function () {
      compileJSONSchema('falphanumeric1', { format: 'alphanumeric' });
      const root = getJSONSchema('falphanumeric1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('bitSOCIAL'), 'a valid letters only string');
      assert.isTrue(root.validate('2962'), 'a valid string of numbers');
      assert.isTrue(root.validate('bit2SOCIAL'), 'a valid mixed string with one number');
      assert.isFalse(root.validate('bit-SOCIAL'), 'an invalid mixed string with one symbol');
    });
    it('should validate an identifier string', function () {
      compileJSONSchema('fidentifier1', { format: 'identifier' });
      const root = getJSONSchema('fidentifier1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('bitSOCIAL'), 'a valid letters only string');
      assert.isTrue(root.validate('_2962'), 'a valid string with underscore');
      assert.isTrue(root.validate('bit2SOCIAL'), 'a valid mixed string with one number');
      assert.isTrue(root.validate('bit-SOCIAL'), 'an valid mixed string with one minus symbol');
      assert.isFalse(root.validate('bit SOCIAL'), 'an invalid mixed string with one symbol');
    });
    it('should validate a hexadecimal string', function () {
      compileJSONSchema('fhexadecimal1', { format: 'identifier' });
      const root = getJSONSchema('fhexadecimal1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('0123456789ABCDEF'), 'a valid string of hexadecimal digits');
      assert.isTrue(root.validate('_'), 'an invalid string with underscore');
      assert.isTrue(root.validate('ABGDE'), 'a invalid G in string');
    });
    it('should validate a numeric string', function () {
      compileJSONSchema('fnumeric1', { format: 'numeric' });
      const root = getJSONSchema('fnumeric1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isFalse(root.validate('0123456789ABCDEF'), 'an invalid string of hexadecimal digits');
      assert.isFalse(root.validate('_12345678'), 'an invalid string with underscore');
      assert.isFalse(root.validate('123ABC'), 'a invalid ABC string');
      assert.isTrue(root.validate('1234567890'), 'a invalid ABC string');
    });
    it('should validate an uppercase string', function () {
      compileJSONSchema('fuppercase1', { format: 'uppercase' });
      const root = getJSONSchema('fuppercase1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('0123456789ABCDEF'), 'an valid string of uppercase hexadecimal digits');
      assert.isFalse(root.validate('0123456789abcdef'), 'an invalid string with with lowercase hexadecimal digits');
      assert.isTrue(root.validate('123-ABC/12'), 'a valid ABC string with symbols');
    });
    it('should validate lowercase strings', function () {
      compileJSONSchema('flowercase1', { format: 'lowercase' });
      const root = getJSONSchema('flowercase1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isFalse(root.validate('0123456789ABCDEF'), 'an invalid string of uppercase hexadecimal digits');
      assert.isTrue(root.validate('0123456789abcdef'), 'an invalid string with with lowercase hexadecimal digits');
      assert.isFalse(root.validate('123-ABC/12'), 'a valid ABC string with symbols');
    });
    it.skip('shouls validate unique identifier UUID strings', function () {
      compileJSONSchema('fuuid1', { format: 'uuid' });
      const root = getJSONSchema('fuuid1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
    });
    it('should validate an email address', function () {
      compileJSONSchema('femail1', { format: 'email' });
      const root = getJSONSchema('femail1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('john.doe@example.com'), 'a valid email address');
      assert.isFalse(root.validate('2962'), 'an invalid email address');
    });
    it('should validate a hostname', function () {
      compileJSONSchema('fhostname1', { format: 'hostname' });
      const root = getJSONSchema('fhostname1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('www.example.com'), 'a valid hostname');
      assert.isTrue(root.validate('xn--4gbwdl.xn--wgbh1c'), 'a valid punycoded IDN hostname');
      assert.isFalse(root.validate('-a-host-name-that-starts-with--'), 'a host name starting with an illegal character');
      assert.isFalse(root.validate('not_a_valid_host_name'), 'a host name containing illegal characters');
      assert.isFalse(root.validate('a-vvvvvvvvvvvvvvvveeeeeeeeeeeeeeeerrrrrrrrrrrrrrrryyyyyyyyyyyyyyyy-long-host-name-component'), 'a host name with a component too long');
    });
    it('should validate an idn-email address', function () {
      compileJSONSchema('femail2', { format: 'idn-email' });
      const root = getJSONSchema('femail2');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('실례@실례.테스트'), 'a valid idn e-mail (example@example.test in Hangul)');
      assert.isFalse(root.validate('2962'), 'an invalid idn e-mail address');
    });
    it.skip('should validate an idn-hostname (TODO: fix false positive!)', function () {
      compileJSONSchema('fhostname2', { format: 'idn-hostname' });
      const root = getJSONSchema('fhostname2');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('실례.테스트'), 'a valid hostname (example.test in Hangul)');
      assert.isTrue(root.validate('a실례.테스트'), 'a valid first asci mixed hostname (example.test in Hangul)');
      assert.isTrue(root.validate('실례.com'), 'a valid mixed hostname (example.test in Hangul)');
      if (this === false) {
        assert.isFalse(root.validate('〮실례.테스트'), 'illegal first char U+302E Hangul single dot tone mark');
        assert.isFalse(root.validate('실〮례.테스트'), 'contains illegal char U+302E Hangul single dot tone mark');
      }
      assert.isFalse(root.validate('실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실례례테스트례례례례례례례례례례례례례례례례례테스트례례례례례례례례례례례례례례례례례례례테스트례례례례례례례례례례례례테스트례례실례.테스트'), 'a host name with a component too long');
    });
    it('should validate an ipv4 address', function () {
      compileJSONSchema('fipv41', { format: 'ipv4' });
      const root = getJSONSchema('fipv41');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('192.168.0.1'), 'a valid IP address');
      assert.isFalse(root.validate('127.0.0.0.1'), 'an IP address with too many components');
      assert.isFalse(root.validate('256.256.256.256'), 'an IP address with out-of-range values');
      assert.isFalse(root.validate('192.168.-10.1'), 'an invalid IP address with negative number');
      assert.isFalse(root.validate('127.0'), 'an IP address without 4 components');
      assert.isFalse(root.validate('0x7f000001'), 'an IP address as an integer');
    });
    it('should validate an ipv6 address', function () {
      compileJSONSchema('fipv61', { format: 'ipv6' });
      const root = getJSONSchema('fipv61');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('::1'), 'a valid IPv6 address');
      assert.isFalse(root.validate('12345::'), 'an IPv6 address with out-of-range values');
      assert.isFalse(root.validate('1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1'), 'an IPv6 address with too many components');
      assert.isFalse(root.validate('::laptop'), 'an IPv6 address containing illegal characters');
    });
    it.skip('should validate IRI (not implemented)', function () {
      compileJSONSchema('firi1', { format: 'iri' });
      const root = getJSONSchema('firi1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('http://ƒøø.ßår/?∂éœ=πîx#πîüx'), 'a valid IRI with anchor tag');
      assert.isTrue(root.validate('http://ƒøø.com/blah_(wîkïpédiå)_blah#ßité-1'), 'a valid IRI with anchor tag and parantheses');
      assert.isTrue(root.validate('http://ƒøø.ßår/?q=Test%20URL-encoded%20stuff'), 'a valid IRI with URL-encoded stuff');
      assert.isTrue(root.validate('http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com'), 'a valid IRI with many special characters');
      assert.isTrue(root.validate('http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]'), 'a valid IRI based on IPv6');
      assert.isFalse(root.validate('http://2001:0db8:85a3:0000:0000:8a2e:0370:7334'), 'an invalid IRI based on IPv6');
      assert.isFalse(root.validate('/abc'), 'an invalid relative IRI Reference');
      assert.isFalse(root.validate('\\\\WINDOWS\\filëßåré'), 'an invalid IRI');
      assert.isFalse(root.validate('âππ'), 'an invalid IRI though valid IRI reference');
    });
    it.skip('should validate IRI References (not implemented)', function () {
      compileJSONSchema('firiref1', { format: 'iri-reference' });
      const root = getJSONSchema('firiref1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('http://ƒøø.ßår/?∂éœ=πîx#πîüx'), 'a valid IRI');
      assert.isTrue(root.validate('//ƒøø.ßår/?∂éœ=πîx#πîüx'), 'a valid protocol-relative IRI Reference');
      assert.isTrue(root.validate('/âππ'), 'a valid relative IRI Reference');
      assert.isFalse(root.validate('\\\\WINDOWS\\filëßåré'), 'an invalid IRI Reference');
      assert.isTrue(root.validate('âππ'), 'a valid IRI Reference');
      assert.isTrue(root.validate('#ƒrägmênt'), 'a valid IRI fragment');
      assert.isFalse(root.validate('#ƒräg\\mênt'), 'an invalid IRI fragment');
    });
    it('should validate a JSON Pointer', function () {
      compileJSONSchema('fjsonpointer1', { format: 'json-pointer' });
      const root = getJSONSchema('fjsonpointer1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('/foo/bar~0/baz~1/%a'), 'a valid JSON-pointer');
      assert.isFalse(root.validate('/foo/bar~'), 'not a valid JSON-pointer (~ not escaped)');
      assert.isTrue(root.validate('/foo//bar'), 'valid JSON-pointer with empty segment');
      assert.isTrue(root.validate('/foo/bar/'), 'valid JSON-pointer with the last empty segment');
      assert.isTrue(root.validate(''), 'valid JSON-pointer as stated in RFC 6901 #1');
      assert.isTrue(root.validate('/foo'), 'valid JSON-pointer as stated in RFC 6901 #2');
      assert.isTrue(root.validate('/foo/0'), 'valid JSON-pointer as stated in RFC 6901 #3');
      assert.isTrue(root.validate('/'), 'valid JSON-pointer as stated in RFC 6901 #4');
      assert.isTrue(root.validate('/a~1b'), 'valid JSON-pointer as stated in RFC 6901 #5');
      assert.isTrue(root.validate('/c%d'), 'valid JSON-pointer as stated in RFC 6901 #6');
      assert.isTrue(root.validate('/e^f'), 'valid JSON-pointer as stated in RFC 6901 #7');
      assert.isTrue(root.validate('/g|h'), 'valid JSON-pointer as stated in RFC 6901 #8');
      assert.isTrue(root.validate('/i\\j'), 'valid JSON-pointer as stated in RFC 6901 #9');
      assert.isTrue(root.validate('/k\"l'), 'valid JSON-pointer as stated in RFC 6901 #10');
      assert.isTrue(root.validate('/ '), 'valid JSON-pointer as stated in RFC 6901 #11');
      assert.isTrue(root.validate('/m~0n'), 'valid JSON-pointer as stated in RFC 6901 #12');
      assert.isTrue(root.validate('/foo/-'), 'valid JSON-pointer used adding to the last array position');
      assert.isTrue(root.validate('/foo/-/bar'), 'valid JSON-pointer (- used as object member name)');
      assert.isTrue(root.validate('/~1~0~0~1~1'), 'valid JSON-pointer (multiple escaped characters)');
      assert.isTrue(root.validate('/~1.1'), 'valid JSON-pointer (escaped with fraction part) #1');
      assert.isTrue(root.validate('/~0.1'), 'valid JSON-pointer (escaped with fraction part) #2');
      assert.isFalse(root.validate('#'), 'not a valid JSON-pointer (URI Fragment Identifier) #1');
      assert.isFalse(root.validate('#/'), 'not a valid JSON-pointer (URI Fragment Identifier) #2');
      assert.isFalse(root.validate('#a'), 'not a valid JSON-pointer (URI Fragment Identifier) #3');
      assert.isFalse(root.validate('/~0~'), 'not a valid JSON-pointer (some escaped, but not all) #1');
      assert.isFalse(root.validate('/~0/~'), 'not a valid JSON-pointer (some escaped, but not all) #2');
      assert.isFalse(root.validate('/~2'), 'not a valid JSON-pointer (wrong escape character) #1');
      assert.isFalse(root.validate('/~-1'), 'not a valid JSON-pointer (wrong escape character) #2');
      assert.isFalse(root.validate('/~~'), 'not a valid JSON-pointer (multiple characters not escaped)');
      assert.isFalse(root.validate('a'), 'not a valid JSON-pointer (isn\'t empty nor starts with /) #1');
      assert.isFalse(root.validate('0'), 'not a valid JSON-pointer (isn\'t empty nor starts with /) #2');
      assert.isFalse(root.validate('a/a'), 'not a valid JSON-pointer (isn\'t empty nor starts with /) #3');
    });
    it('should validate a regular expression format', function () {
      compileJSONSchema('fregex1', { format: 'regex' });
      const root = getJSONSchema('fregex1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('([abc])+\\s+$'), 'a valid regular expression');
      assert.isFalse(root.validate('^(abc]'), 'a regular expression with unclosed parens is invalid');
    });
    it('should validate Relative JSON Pointers (RJP)', function () {
      compileJSONSchema('freljp1', { format: 'relative-json-pointer' });
      const root = getJSONSchema('freljp1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('1'), 'a valid upwards RJP');
      assert.isTrue(root.validate('0/foo/bar'), 'a valid downwards RJP');
      assert.isTrue(root.validate('2/0/baz/1/zip'), 'a valid up and then down RJP, with array index');
      assert.isTrue(root.validate('0#'), 'a valid RJP taking the member or index name');
      assert.isFalse(root.validate('/foo/bar'), 'an invalid RJP that is a valid JSON Pointer');
    });
    it('should validate URI References', function () {
      compileJSONSchema('furiref1', { format: 'uri-reference' });
      const root = getJSONSchema('furiref1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('http://foo.bar/?baz=qux#quux'), 'a valid URI');
      assert.isTrue(root.validate('//foo.bar/?baz=qux#quux'), 'a valid protocol-relative URI Reference');
      assert.isTrue(root.validate('/abc'), 'a valid relative URI Reference');
      assert.isFalse(root.validate('\\\\WINDOWS\\fileshare'), 'an invalid URI Reference');
      assert.isTrue(root.validate('abc'), 'a valid URI Reference');
      assert.isTrue(root.validate('#fragment'), 'a valid URI fragment');
      assert.isFalse(root.validate('#frag\\ment'), 'an invalid URI fragment');
    });
    it('should validate URI Templates', function () {
      compileJSONSchema('furitmpl1', { format: 'uri-template' });
      const root = getJSONSchema('furitmpl1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('http://example.com/dictionary/{term:1}/{term}'), 'a valid uri-template');
      assert.isFalse(root.validate('http://example.com/dictionary/{term:1}/{term'), 'an invalid uri-template');
      assert.isTrue(root.validate('http://example.com/dictionary'), 'a valid uri-template without variables');
      assert.isTrue(root.validate('dictionary/{term:1}/{term}'), 'a valid relative uri-template');
    });
    it('should validate an URI', function () {
      compileJSONSchema('furi1', { format: 'uri' });
      const root = getJSONSchema('furi1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('http://foo.bar/?baz=qux#quux'), 'a valid URL with anchor tag');
      assert.isTrue(root.validate('http://foo.com/blah_(wikipedia)_blah#cite-1'), 'a valid URL with anchor tag and parantheses');
      assert.isTrue(root.validate('http://foo.bar/?q=Test%20URL-encoded%20stuff'), 'a valid URL with URL-encoded stuff');
      assert.isTrue(root.validate('http://xn--nw2a.xn--j6w193g/'), 'a valid puny-coded URL');
      assert.isTrue(root.validate('http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com'), 'a valid URL with many special characters');
      assert.isTrue(root.validate('http://223.255.255.254'), 'a valid URL based on IPv4');
      assert.isTrue(root.validate('ftp://ftp.is.co.za/rfc/rfc1808.txt'), 'a valid URL with ftp scheme');
      assert.isTrue(root.validate('http://www.ietf.org/rfc/rfc2396.txt'), 'a valid URL for a simple text file');
      assert.isTrue(root.validate('ldap://[2001:db8::7]/c=GB?objectClass?one'), 'a valid URL');
      assert.isTrue(root.validate('mailto:John.Doe@example.com'), 'a valid mailto URI');
      assert.isTrue(root.validate('news:comp.infosystems.www.servers.unix'), 'a valid newsgroup URI');
      assert.isTrue(root.validate('tel:+1-816-555-1212'), 'a valid tel URI');
      assert.isTrue(root.validate('urn:oasis:names:specification:docbook:dtd:xml:4.1.2'), 'a valid URN');
      assert.isFalse(root.validate('//foo.bar/?baz=qux#quux'), 'an invalid protocol-relative URI Reference');
      assert.isFalse(root.validate('/abc'), 'an invalid relative URI Reference');
      assert.isFalse(root.validate('\\\\WINDOWS\\fileshare'), 'an invalid URI');
      assert.isFalse(root.validate('abc'), 'an invalid URI though valid URI reference');
      assert.isFalse(root.validate('http:// shouldfail.com'), 'an invalid URI with spaces');
      assert.isFalse(root.validate(':// should fail'), 'an invalid URI with spaces and missing scheme');
    });
  });
});
