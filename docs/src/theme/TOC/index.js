/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import useTOCHighlight from '@theme/hooks/useTOCHighlight';
import styles from './styles.module.css';

// FoalTS
import { initAd } from '../../utils/init';

const LINK_CLASS_NAME = 'table-of-contents__link';
const ACTIVE_LINK_CLASS_NAME = 'table-of-contents__link--active';
const TOP_OFFSET = 100;
/* eslint-disable jsx-a11y/control-has-associated-label */

function Headings({
  toc,
  isChild
}) {
  if (!toc.length) {
    return null;
  }

  return <ul className={isChild ? '' : 'table-of-contents table-of-contents__left-border'}>
      {toc.map(heading => <li key={heading.id}>
          <a href={`#${heading.id}`} className={LINK_CLASS_NAME} // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: heading.value
      }} />
          <Headings isChild toc={heading.children} />
        </li>)}
    </ul>;
}

// FoalTS
let doNotLoad = false;

function TOC({
  toc
}) {
  // FoalTS
  const isNotMobile = () => typeof window !== 'undefined' && window.document.body.clientWidth > 996;

  // FoalTS
  useEffect(() => {
    if (isNotMobile() && !doNotLoad) {
      // This line prevents the ad from being loaded twice. I don't why but useEffect
      // is called twice even if window.location.href has not changed.
      doNotLoad = true;
      setTimeout(() => doNotLoad = false, 1000);

      initAd();
    }
  }, [
    // Only execute this effect when the user navigates to a new page.
    typeof window !== 'undefined' ? window.location.href : ''
  ]);

  useTOCHighlight(LINK_CLASS_NAME, ACTIVE_LINK_CLASS_NAME, TOP_OFFSET);
  return <div className={clsx(styles.tableOfContents, 'thin-scrollbar')}>
      <Headings toc={toc} />
      {/* FoalTS */}
      {isNotMobile() && <div id="carbon-js"></div>}
    </div>;
}

export default TOC;