// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { IApiTag } from '../interfaces';
import { mergeTags } from './merge-tags';

describe('mergeTags should merge the tags', () => {

  it('when tags1 is undefined and tags2 is not.', () => {
    const tags1: IApiTag[] | undefined = undefined;
    const tags2: IApiTag[] | undefined = [ { name: 'A' } ];

    const tags = mergeTags(tags1, tags2);

    deepStrictEqual(tags, [ { name: 'A' } ]);
  });

  it('when tags2 is undefined and tags1 is not.', () => {
    const tags1: IApiTag[] | undefined =  [ { name: 'A' } ];
    const tags2: IApiTag[] | undefined = undefined;

    const tags = mergeTags(tags1, tags2);

    deepStrictEqual(tags,  [ { name: 'A' } ]);
  });

  it('when both tags1 and tags2 are undefined.', () => {
    const tags1: IApiTag[] | undefined = undefined;
    const tags2: IApiTag[] | undefined = undefined;

    const tags = mergeTags(tags1, tags2);

    strictEqual(tags, undefined);
  });

  it('when both tags1 and tags2 are defined.', () => {
    const tags1: IApiTag[] | undefined =  [ { name: 'A' } ];
    const tags2: IApiTag[] | undefined =  [ { name: 'B' } ];

    const tags = mergeTags(tags1, tags2);

    deepStrictEqual(tags, [ { name: 'A' }, { name: 'B' } ]);
  });

});
